import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/contact/email";
import { validateContactPayload } from "@/lib/contact/schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const requestId = crypto.randomUUID();
    const rateLimit = checkRateLimit({
        key: `contact:${getClientIp(request)}`,
    });

    if (!rateLimit.ok) {
        return NextResponse.json(
            {
                ok: false,
                code: "RATE_LIMITED",
                message:
                    "Trop de messages envoyés en peu de temps. Merci de réessayer dans quelques minutes.",
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
                message: "Le message envoyé n'est pas lisible.",
                requestId,
            },
            { status: 400 },
        );
    }

    const validation = validateContactPayload(payload.data);

    if (validation.isSpam) {
        return NextResponse.json({
            ok: true,
            message: "Message reçu.",
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

    const emailResult = await sendContactEmail({
        message: validation.data,
        requestId,
    });

    if (!emailResult.ok) {
        const isMissingConfig = emailResult.reason === "not-configured";

        return NextResponse.json(
            {
                ok: false,
                code: isMissingConfig
                    ? "EMAIL_NOT_CONFIGURED"
                    : "EMAIL_SEND_FAILED",
                message: isMissingConfig
                    ? "Le message est validé, mais l'envoi e-mail n'est pas encore configuré."
                    : "Le message est validé, mais l'e-mail n'a pas pu être envoyé.",
                requestId,
            },
            { status: isMissingConfig ? 503 : 502 },
        );
    }

    return NextResponse.json({
        ok: true,
        message: "Message transmis.",
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
