import { MediaAssetUsage } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/server/auth";
import { isAdminRole } from "@/server/auth/roles";
import { createMediaAsset } from "@/server/media/media";

export const runtime = "nodejs";

const createMediaAssetSchema = z.object({
    alt: z.string().trim().max(240).optional(),
    bytes: z.number().int().min(0).optional(),
    folder: z.string().trim().max(180).optional(),
    format: z.string().trim().max(40).optional(),
    height: z.number().int().min(0).optional(),
    publicId: z.string().trim().min(1).max(240),
    secureUrl: z.string().trim().url().max(500),
    tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
    title: z.string().trim().max(160).optional(),
    usage: z.enum(MediaAssetUsage).optional(),
    width: z.number().int().min(0).optional(),
});

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
    const parsed = createMediaAssetSchema.safeParse(payload);

    if (!parsed.success) {
        return NextResponse.json(
            { ok: false, message: "Média invalide." },
            { status: 400 },
        );
    }

    const asset = await createMediaAsset({
        ...parsed.data,
        createdByUserId: session.user.id,
    });

    revalidatePath("/admin/mediatheque");

    return NextResponse.json({ asset, ok: true });
}

async function readJson(request: Request) {
    try {
        return (await request.json()) as Record<string, unknown>;
    } catch {
        return {};
    }
}
