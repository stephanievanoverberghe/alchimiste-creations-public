import { toAbsoluteUrl } from "@/lib/seo";
import {
    type BrandedEmailInput,
    renderBrandedEmailHtml,
    renderBrandedEmailText,
} from "@/server/emails/branded-email";

import type { ProjectRequestData } from "./schema";

type ProjectRequestEmailSuccess = {
    ok: true;
    provider: "resend";
    providerId?: string;
};

type ProjectRequestEmailFailure = {
    ok: false;
    reason: "not-configured" | "send-failed";
    message: string;
    status?: number;
};

export type ProjectRequestEmailResult =
    | ProjectRequestEmailSuccess
    | ProjectRequestEmailFailure;

type ProjectRequestEmailConfig = {
    apiKey: string;
    from: string;
    to: string[];
};

const resendEndpoint = "https://api.resend.com/emails";

export async function sendProjectRequestEmail({
    request,
    requestId,
}: {
    request: ProjectRequestData;
    requestId: string;
}): Promise<ProjectRequestEmailResult> {
    const config = getProjectRequestEmailConfig();

    if (!config) {
        return {
            ok: false,
            reason: "not-configured",
            message:
                "L'envoi e-mail des demandes projet n'est pas encore configuré.",
        };
    }

    const email = buildProjectRequestEmail(request, requestId);

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
                subject: buildSubject(request),
                text: renderBrandedEmailText(email),
                html: renderBrandedEmailHtml(email),
                reply_to: request.email,
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

function getProjectRequestEmailConfig(): ProjectRequestEmailConfig | null {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.PROJECT_REQUEST_EMAIL_FROM?.trim();
    const recipients = process.env.PROJECT_REQUEST_EMAIL_TO?.split(",")
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

function buildSubject(request: ProjectRequestData) {
    const projectLabel =
        request.projectName || request.labels.projectType || "demande de projet";

    return `Nouvelle demande projet — ${projectLabel}`;
}

/** Construit l'e-mail admin de notification d'une demande de projet. */
function buildProjectRequestEmail(
    request: ProjectRequestData,
    requestId: string,
): BrandedEmailInput {
    return {
        preheader: "Nouvelle demande de projet reçue depuis le site.",
        eyebrow: "Nouvelle demande",
        title: request.projectName || "Nouvelle demande de projet",
        paragraphs: [
            `${request.fullName} vient de transmettre une demande depuis le site. Tu peux répondre directement à ${request.email}.`,
        ],
        primaryCta: {
            label: "Répondre au prospect",
            url: buildReplyMailUrl(request, requestId),
        },
        secondaryCta: {
            label: "Ouvrir les demandes",
            url: toAbsoluteUrl("/admin/demandes"),
        },
        details: [
            {
                title: "Projet",
                rows: [
                    {
                        label: "Type de projet",
                        value: request.labels.projectType || request.projectType,
                    },
                    {
                        label: "Avancement",
                        value: request.labels.maturity || request.maturity,
                    },
                    {
                        label: "Budget",
                        value: request.labels.budget || request.budget || "",
                    },
                    {
                        label: "Délai",
                        value: request.labels.deadline || request.deadline || "",
                    },
                ],
            },
            {
                title: "Contact",
                rows: [
                    { label: "Nom", value: request.fullName },
                    { label: "E-mail", value: request.email },
                    { label: "Projet", value: request.projectName },
                    { label: "Site existant", value: request.website },
                ],
            },
            {
                title: "Besoin exprimé",
                rows: [
                    { label: "Description", value: request.description },
                    { label: "Objectif", value: request.objective },
                    { label: "Précisions", value: request.constraints },
                    ...(request.attachmentUrl
                        ? [
                              {
                                  label: "Document joint",
                                  value: request.attachmentUrl,
                              },
                          ]
                        : []),
                ],
            },
        ],
        footerNote: `Référence interne : ${requestId}. Cette demande est aussi enregistrée côté admin (demande + opportunité).`,
    };
}

function buildReplyMailUrl(request: ProjectRequestData, requestId: string) {
    const subject = `Re: demande projet ${request.projectName || requestId}`;
    const body = [
        `Bonjour ${request.fullName},`,
        "",
        "Merci pour ta demande. Je reviens vers toi avec la prochaine étape.",
        "",
        "---",
        "Récapitulatif de la demande",
        `Référence : ${requestId}`,
        `Type de projet : ${request.labels.projectType || request.projectType}`,
        `Projet : ${request.projectName || "Non renseigné"}`,
        `Site existant : ${request.website || "Non renseigné"}`,
        `Avancement : ${request.labels.maturity || request.maturity}`,
        `Budget : ${request.labels.budget || request.budget || "Non renseigné"}`,
        `Délai : ${request.labels.deadline || request.deadline || "Non renseigné"}`,
        "",
        "Besoin :",
        request.description,
        "",
        "Objectif :",
        request.objective,
        "",
        "Précisions :",
        request.constraints || "Non renseigné",
    ].join("\n");

    return `mailto:${request.email}?subject=${encodeURIComponent(
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
