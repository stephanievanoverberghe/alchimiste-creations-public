import { NextResponse } from "next/server";

import { sendProjectRequestEmail } from "@/lib/project-requests/email";
import { createProjectRequestReference } from "@/lib/project-requests/reference";
import {
    validateProjectRequestPayload,
    type ProjectRequestData,
} from "@/lib/project-requests/schema";
import {
    createProjectRequestOpportunity,
    markProjectRequestEmailResult,
} from "@/server/crm/project-requests";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
    let requestId = crypto.randomUUID();
    const receivedAt = new Date();
    const rateLimit = checkRateLimit({
        key: `project-request:${getClientIp(request)}`,
    });

    if (!rateLimit.ok) {
        return NextResponse.json(
            {
                ok: false,
                code: "RATE_LIMITED",
                message:
                    "Trop de demandes envoyées en peu de temps. Merci de réessayer dans quelques minutes.",
                requestId,
            },
            {
                headers: {
                    "Retry-After": String(rateLimit.retryAfterSeconds),
                },
                status: 429,
            },
        );
    }

    const payload = await readJson(request);

    if (!payload.ok) {
        return NextResponse.json(
            {
                ok: false,
                code: "INVALID_JSON",
                message: "La demande envoyée n'est pas lisible.",
                requestId,
            },
            { status: 400 },
        );
    }

    const validation = validateProjectRequestPayload(payload.data);

    if (validation.isSpam) {
        return NextResponse.json({
            ok: true,
            message: "Demande reçue.",
            requestId,
        });
    }

    if (!validation.success) {
        return NextResponse.json(
            {
                ok: false,
                code: "VALIDATION_ERROR",
                message: "Certaines informations sont manquantes ou invalides.",
                fieldErrors: validation.errors,
                requestId,
            },
            { status: 422 },
        );
    }

    try {
        requestId = await createProjectRequestWithReference({
            payload: payload.data,
            receivedAt,
            request: validation.data,
        });
    } catch {
        return NextResponse.json(
            {
                ok: false,
                code: "REQUEST_SAVE_FAILED",
                message:
                    "La demande est valide, mais elle n'a pas pu être enregistrée.",
                requestId,
            },
            { status: 500 },
        );
    }

    const emailResult = await sendProjectRequestEmail({
        request: validation.data,
        requestId,
    });

    try {
        await markProjectRequestEmailResult({
            emailResult,
            requestId,
        });
    } catch {
        // The request and opportunity are already saved. Keep the public response
        // aligned with the email result instead of failing on tracking metadata.
    }

    if (!emailResult.ok) {
        const isMissingConfig = emailResult.reason === "not-configured";

        return NextResponse.json(
            {
                ok: false,
                code: isMissingConfig
                    ? "EMAIL_NOT_CONFIGURED"
                    : "EMAIL_SEND_FAILED",
                message: isMissingConfig
                    ? "La demande est validée, mais l'envoi e-mail n'est pas encore configuré."
                    : "La demande est validée, mais l'e-mail n'a pas pu être envoyé.",
                requestId,
            },
            { status: isMissingConfig ? 503 : 502 },
        );
    }

    return NextResponse.json({
        ok: true,
        message: "Demande transmise.",
        requestId,
    });
}

async function readJson(request: Request) {
    try {
        return {
            ok: true as const,
            data: (await request.json()) as unknown,
        };
    } catch {
        return {
            ok: false as const,
        };
    }
}

async function createProjectRequestWithReference({
    payload,
    receivedAt,
    request,
}: {
    payload: unknown;
    receivedAt: Date;
    request: ProjectRequestData;
}) {
    let requestId = "";

    for (let sequence = 1; sequence <= 999; sequence += 1) {
        requestId = createProjectRequestReference(receivedAt, sequence);

        try {
            await createProjectRequestOpportunity({
                payload,
                request,
                requestId,
            });

            return requestId;
        } catch (error) {
            if (!isUniqueReferenceError(error) || sequence === 999) {
                throw error;
            }
        }
    }

    return requestId;
}

function isUniqueReferenceError(error: unknown) {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
    );
}
