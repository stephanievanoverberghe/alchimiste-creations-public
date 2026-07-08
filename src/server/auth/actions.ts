"use server";

import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth, signIn, signOut } from "@/server/auth";
import {
    hashPassword,
    validateNewPassword,
} from "@/server/auth/passwords";
import { getAuthenticatedHomePath } from "@/server/auth/roles";
import { getPrismaClient } from "@/server/db/client";

export async function requestMagicLinkAction(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const callbackUrl = String(
        formData.get("callbackUrl") ?? "/connexion/redirect",
    );

    if (!email) {
        redirect("/connexion?error=EmailRequired");
    }

    const cookieStore = await cookies();
    cookieStore.set("auth:last-magic-link-email", email, {
        httpOnly: true,
        maxAge: 10 * 60,
        path: "/connexion",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    try {
        await signIn("resend", {
            email,
            redirect: false,
            redirectTo: callbackUrl || "/connexion/redirect",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            redirect(`/connexion?error=${error.type}`);
        }

        throw error;
    }

    redirect(`/connexion?sent=1&email=${encodeURIComponent(email)}`);
}

export async function signInWithPasswordAction(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const callbackUrl = String(
        formData.get("callbackUrl") ?? "/connexion/redirect",
    );

    if (!email || !password) {
        redirect("/connexion?mode=password&error=CredentialsSignin");
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || "/connexion/redirect",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            redirect(`/connexion?mode=password&error=${error.type}`);
        }

        throw error;
    }
}

export async function setPasswordAction(formData: FormData) {
    const session = await auth();

    if (!session?.user) {
        redirect("/connexion?callbackUrl=/compte/securite");
    }

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const validation = validateNewPassword({ confirmPassword, password });

    if (!validation.ok) {
        redirect(`/compte/securite?status=${validation.code}`);
    }

    const prisma = getPrismaClient();
    const passwordHash = await hashPassword(password);

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            passwordHash,
            passwordSetAt: new Date(),
        },
    });

    redirect("/compte/securite?status=password-updated");
}

export async function signOutAction() {
    await signOut({
        redirectTo: "/connexion",
    });
}

export async function goToPrivateHomeAction() {
    const session = await auth();
    const homePath = getAuthenticatedHomePath(session?.user.role);

    redirect(homePath ?? "/connexion");
}
