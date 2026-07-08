import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";

import {
    type BrandedEmailInput,
    renderBrandedEmailHtml,
    renderBrandedEmailText,
} from "@/server/emails/branded-email";
import { ADMIN_ROLES } from "@/server/auth/roles";
import { verifyPassword } from "@/server/auth/passwords";
import { getPrismaClient } from "@/server/db/client";

const prisma = getPrismaClient();

export const authConfig = {
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id ?? token.sub ?? "");
                session.user.role = token.role as UserRole;
            }

            return session;
        },
        async signIn({ email, user }) {
            if (email?.verificationRequest) {
                return canRequestMagicLink(user.email);
            }

            await promoteAdminEmail(user.email);
            await markLastLogin(user.email);

            return true;
        },
    },
    events: {
        async createUser({ user }) {
            await promoteAdminEmail(user.email);
        },
    },
    pages: {
        error: "/connexion",
        signIn: "/connexion",
        verifyRequest: "/connexion?sent=1",
    },
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Adresse e-mail",
                    type: "email",
                },
                password: {
                    label: "Mot de passe",
                    type: "password",
                },
            },
            async authorize(credentials) {
                const email = normalizeEmail(String(credentials.email ?? ""));
                const password = String(credentials.password ?? "");

                if (!email || !password) return null;

                return validatePasswordCredentials({ email, password });
            },
        }),
        Resend({
            apiKey: process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY,
            from: getAuthEmailFrom(),
            async sendVerificationRequest({ identifier, provider, url }) {
                await sendFrenchVerificationEmail({
                    apiKey: provider.apiKey,
                    from: provider.from,
                    to: identifier,
                    url,
                });
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    trustHost: true,
} satisfies NextAuthConfig;

async function promoteAdminEmail(email: string | null | undefined) {
    if (!email || !isAdminEmail(email)) return;

    try {
        const user = await prisma.user.findUnique({
            where: { email: normalizeEmail(email) },
            select: {
                id: true,
                role: true,
            },
        });

        if (!user || ADMIN_ROLES.includes(user.role)) return;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                role: "ADMIN",
            },
        });
    } catch (error) {
        console.error("Admin email promotion failed.", error);
    }
}

async function canRequestMagicLink(email: string | null | undefined) {
    if (!email) return false;
    if (isAdminEmail(email)) return true;

    const normalizedEmail = normalizeEmail(email);

    try {
        const [existingUser, pendingInvitation, existingContact] =
            await Promise.all([
                prisma.user.findUnique({
                    where: { email: normalizedEmail },
                    select: { id: true },
                }),
                prisma.invitation.findFirst({
                    where: {
                        email: normalizedEmail,
                        expiresAt: {
                            gt: new Date(),
                        },
                        status: "PENDING",
                    },
                    select: { id: true },
                }),
                prisma.contact.findFirst({
                    where: { email: normalizedEmail },
                    select: { id: true },
                }),
            ]);

        return Boolean(existingUser || pendingInvitation || existingContact);
    } catch (error) {
        console.error("Magic link authorization check failed.", error);

        return false;
    }
}

async function validatePasswordCredentials({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            email: true,
            failedLoginAttempts: true,
            id: true,
            image: true,
            lockedUntil: true,
            name: true,
            passwordHash: true,
            role: true,
        },
    });

    if (!user) return null;
    if (user.lockedUntil && user.lockedUntil > new Date()) return null;

    const isValid = await verifyPassword({
        password,
        passwordHash: user.passwordHash,
    });

    if (!isValid) {
        await registerFailedPasswordAttempt(user.id, user.failedLoginAttempts);

        return null;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            failedLoginAttempts: 0,
            lastLoginAt: new Date(),
            lockedUntil: null,
        },
    });

    return {
        email: user.email,
        id: user.id,
        image: user.image,
        name: user.name,
        role: user.role,
    };
}

async function registerFailedPasswordAttempt(
    userId: string,
    failedLoginAttempts: number,
) {
    const nextAttempts = failedLoginAttempts + 1;
    const shouldLock = nextAttempts >= 5;

    await prisma.user.update({
        where: { id: userId },
        data: {
            failedLoginAttempts: nextAttempts,
            lockedUntil: shouldLock ? getLockExpiration() : null,
        },
    });
}

async function markLastLogin(email: string | null | undefined) {
    if (!email) return;

    try {
        await prisma.user.updateMany({
            where: { email: normalizeEmail(email) },
            data: {
                failedLoginAttempts: 0,
                lastLoginAt: new Date(),
                lockedUntil: null,
            },
        });
    } catch (error) {
        console.error("Last login update failed.", error);
    }
}

function getLockExpiration() {
    return new Date(Date.now() + 15 * 60 * 1000);
}

function isAdminEmail(email: string) {
    const adminEmails = getAdminEmails();

    return adminEmails.has(normalizeEmail(email));
}

function getAdminEmails() {
    return new Set(
        (process.env.AUTH_ADMIN_EMAILS ?? "")
            .split(",")
            .map((email) => normalizeEmail(email))
            .filter(Boolean),
    );
}

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function getAuthEmailFrom() {
    return (
        process.env.AUTH_EMAIL_FROM ??
        process.env.CONTACT_EMAIL_FROM ??
        process.env.PROJECT_REQUEST_EMAIL_FROM
    );
}

async function sendFrenchVerificationEmail({
    apiKey,
    from,
    to,
    url,
}: {
    apiKey?: string;
    from?: string;
    to: string;
    url: string;
}) {
    if (!apiKey || !from) {
        throw new Error("Missing Resend auth email configuration.");
    }

    const magicLinkUrl = new URL(url);
    const accountSecurityUrl = new URL("/compte/securite", magicLinkUrl.origin);
    const passwordSetupUrl = new URL(url);

    passwordSetupUrl.searchParams.set(
        "callbackUrl",
        accountSecurityUrl.toString(),
    );

    const email: BrandedEmailInput = {
        preheader: "Ton lien de connexion sécurisé est prêt.",
        eyebrow: "Accès privé",
        title: "Connexion à ton espace Alchimiste Créations",
        paragraphs: [
            `Une demande de connexion a été faite pour ${to}.`,
            "Ce lien t'ouvre ton espace privé. Il est temporaire, personnel, et ne se partage pas.",
        ],
        primaryCta: {
            label: "Me connecter",
            url: magicLinkUrl.toString(),
        },
        panel: {
            title: "Tu préfères un mot de passe ?",
            body: "Ce lien te connecte, puis t'emmène vers la page de sécurité pour définir ou modifier ton mot de passe.",
            cta: {
                label: "Me connecter et créer mon mot de passe",
                url: passwordSetupUrl.toString(),
            },
        },
        footerNote:
            "Si tu n'es pas à l'origine de cette demande, ignore simplement cet e-mail.",
    };

    const res = await fetch("https://api.resend.com/emails", {
        body: JSON.stringify({
            from,
            html: renderBrandedEmailHtml(email),
            subject: "Connexion à ton espace Alchimiste Créations",
            text: renderBrandedEmailText(email),
            to,
        }),
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    });

    if (!res.ok) {
        throw new Error(`Resend auth email failed: ${await res.text()}`);
    }
}

