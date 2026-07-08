// Transactional portal e-mails via Resend. Fire-and-forget by design:
// an e-mail failure must never block the action that triggered it
// (Resend stays in test mode until the sending domain is verified,
// see docs/crm/03_hardening-exploitation.md).

import {
    type BrandedEmailInput,
    renderBrandedEmailHtml,
    renderBrandedEmailText,
} from "@/server/emails/branded-email";

type PortalEmailInput = {
    actionLabel: string;
    actionPath: string;
    body: string;
    subject: string;
    to: string[];
};

export async function sendPortalEmail(input: PortalEmailInput) {
    const apiKey = process.env.RESEND_API_KEY;
    const from =
        process.env.AUTH_EMAIL_FROM ??
        process.env.CONTACT_EMAIL_FROM ??
        process.env.PROJECT_REQUEST_EMAIL_FROM;
    const recipients = [...new Set(input.to.filter(Boolean))];

    if (!apiKey || !from || recipients.length === 0) {
        return { ok: false as const, reason: "not-configured" as const };
    }

    const actionUrl = new URL(
        input.actionPath,
        process.env.APP_URL ?? "http://localhost:3000",
    ).toString();

    const email: BrandedEmailInput = {
        eyebrow: "Suivi de projet",
        title: input.subject,
        paragraphs: [input.body],
        primaryCta: { label: input.actionLabel, url: actionUrl },
        footerNote:
            "E-mail automatique du suivi de projet. Tu peux répondre directement depuis ton espace.",
    };

    try {
        const res = await fetch("https://api.resend.com/emails", {
            body: JSON.stringify({
                from,
                html: renderBrandedEmailHtml(email),
                subject: input.subject,
                text: renderBrandedEmailText(email),
                to: recipients,
            }),
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            method: "POST",
        });

        if (!res.ok) {
            console.error("Portal email failed.", await res.text());

            return { ok: false as const, reason: "send-failed" as const };
        }

        return { ok: true as const };
    } catch (error) {
        console.error("Portal email failed.", error);

        return { ok: false as const, reason: "send-failed" as const };
    }
}

// Recipient helpers: client portal members of a project, or the admins.
export async function getProjectClientEmails(projectId: string) {
    const { getPrismaClient } = await import("@/server/db/client");
    const { isAdminRole } = await import("@/server/auth/roles");
    const prisma = getPrismaClient();

    const accesses = await prisma.clientPortalAccess.findMany({
        where: { projectId, status: "ACTIVE" },
        select: {
            user: {
                select: { email: true, role: true },
            },
        },
    });

    return accesses
        .filter((access) => !isAdminRole(access.user.role))
        .map((access) => access.user.email)
        .filter((email): email is string => Boolean(email));
}

export async function getAdminEmails() {
    const { getPrismaClient } = await import("@/server/db/client");
    const prisma = getPrismaClient();

    const admins = await prisma.user.findMany({
        where: {
            role: {
                in: ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"],
            },
        },
        select: { email: true },
    });

    return admins
        .map((admin) => admin.email)
        .filter((email): email is string => Boolean(email));
}
