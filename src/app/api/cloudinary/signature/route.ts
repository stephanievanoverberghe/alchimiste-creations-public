import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { isAdminRole } from "@/server/auth/roles";
import { signCloudinaryUploadParams } from "@/server/cloudinary/signature";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json(
            { ok: false, message: "Connexion requise." },
            { status: 401 },
        );
    }

    if (!isAdminRole(session.user.role)) {
        return NextResponse.json(
            { ok: false, message: "Accès admin requis." },
            { status: 403 },
        );
    }

    const payload = await readJson(request);
    const paramsToSign = payload.paramsToSign;

    if (!isRecord(paramsToSign)) {
        return NextResponse.json(
            { ok: false, message: "Paramètres Cloudinary invalides." },
            { status: 400 },
        );
    }

    try {
        return NextResponse.json({
            signature: signCloudinaryUploadParams(paramsToSign),
        });
    } catch {
        return NextResponse.json(
            { ok: false, message: "Cloudinary n'est pas configuré." },
            { status: 503 },
        );
    }
}

async function readJson(request: Request) {
    try {
        return (await request.json()) as Record<string, unknown>;
    } catch {
        return {};
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
