import {
    type BrandedEmailInput,
    renderBrandedEmailHtml,
    renderBrandedEmailText,
} from "@/server/emails/branded-email";

import type { ContactMessageData } from "./schema";

type ContactEmailSuccess = {
    ok: true;
    provider: "resend";
    providerId?: string;
};

type ContactEmailFailure = {
    ok: false;
    reason: "not-configured" | "send-failed";
    message: string;
    status?: number;
};

export type ContactEmailResult = ContactEmailSuccess | ContactEmailFailure;

type ContactEmailConfig = {
    apiKey: string;
    from: string;
    to: string[];
};

const resendEndpoint = "https://api.resend.com/emails";

export async function sendContactEmail({
    message,
    requestId,
}: {
    message: ContactMessageData;
    requestId: string;
}): Promise<ContactEmailResult> {
    const config = getContactEmailConfig();

    if (!config) {
        return {
            ok: false,
            reason: "not-configured",
            message: "L'envoi e-mail des messages contact n'est pas configuré.",
        };
    }

    const email = buildContactEmail(message, requestId);

    try {
        const response = await fetch(resendEndpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: config.from,
                to: config.to,
                subject: `Nouveau message contact — ${message.subjectLabel}`,
                text: renderBrandedEmailText(email),
                html: renderBrandedEmailHtml(email),
                reply_to: message.email,
            }),
        });

        const payload = await readJson(response);

        if (!response.ok) {
            return {
                ok: false,
                reason: "send-failed",
                status: response.status,
                message: getResendErrorMessage(payload),
            };
        }

        return {
            ok: true,
            provider: "resend",
            providerId: getResendEmailId(payload),
        };
    } catch {
        return {
            ok: false,
            reason: "send-failed",
            message: "Le service d'e-mail n'a pas répondu.",
        };
    }
}

function getContactEmailConfig(): ContactEmailConfig | null {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = (
        process.env.CONTACT_EMAIL_FROM ??
        process.env.PROJECT_REQUEST_EMAIL_FROM
    )?.trim();
    const recipients = (
        process.env.CONTACT_EMAIL_TO ??
        process.env.PROJECT_REQUEST_EMAIL_TO
    )
        ?.split(",")
        .map((recipient) => recipient.trim())
        .filter(Boolean);

    if (!apiKey || !from || !recipients?.length) {
        return null;
    }

    return {
        apiKey,
        from,
        to: recipients,
    };
}

/** Construit l'e-mail admin de notification d'un message contact. */
function buildContactEmail(
    message: ContactMessageData,
    requestId: string,
): BrandedEmailInput {
    return {
        preheader: `Nouveau message contact — ${message.subjectLabel}`,
        eyebrow: "Nouveau message",
        title: message.subjectLabel,
        paragraphs: [
            `${message.name || "Un visiteur"} t'a écrit depuis la page contact. Tu peux répondre directement à ${message.email}.`,
        ],
        primaryCta: {
            label: "Répondre",
            url: buildContactReplyUrl(message),
        },
        details: [
            {
                rows: [
                    { label: "Nom", value: message.name },
                    { label: "E-mail", value: message.email },
                    { label: "Sujet", value: message.subjectLabel },
                    { label: "Message", value: message.message },
                    { label: "Référence", value: requestId },
                ],
            },
        ],
        footerNote: "Message reçu via la page contact du site Alchimiste Créations.",
    };
}

function buildContactReplyUrl(message: ContactMessageData) {
    const subject = `Re: ${message.subjectLabel}`;
    const body = [`Bonjour ${message.name},`, "", "Merci pour ton message.", ""].join(
        "\n",
    );

    return `mailto:${message.email}?subject=${encodeURIComponent(
        subject,
    )}&body=${encodeURIComponent(body)}`;
}

async function readJson(response: Response) {
    try {
        return (await response.json()) as unknown;
    } catch {
        return null;
    }
}

function getResendEmailId(payload: unknown) {
    if (!isRecord(payload) || typeof payload.id !== "string") return undefined;

    return payload.id;
}

function getResendErrorMessage(payload: unknown) {
    if (!isRecord(payload)) {
        return "Le service d'e-mail a refusé l'envoi.";
    }

    const message = payload.message ?? payload.error;

    if (typeof message === "string" && message.trim()) {
        return message;
    }

    return "Le service d'e-mail a refusé l'envoi.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
