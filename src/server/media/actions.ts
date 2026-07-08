"use server";

import { MediaAssetUsage } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { archiveMediaAsset, updateMediaAsset } from "@/server/media/media";

const mediaAssetUpdateSchema = z.object({
    alt: z.string().trim().max(240).optional(),
    id: z.string().trim().min(1),
    tags: z.string().trim().max(400).optional(),
    title: z.string().trim().max(160).optional(),
    usage: z.enum(MediaAssetUsage).optional(),
});

export async function updateMediaAssetAction(formData: FormData) {
    await requireAdminSession();

    const parsed = mediaAssetUpdateSchema.parse({
        alt: optionalFormString(formData.get("alt")),
        id: formData.get("id"),
        tags: optionalFormString(formData.get("tags")),
        title: optionalFormString(formData.get("title")),
        usage: optionalFormString(formData.get("usage")),
    });

    await updateMediaAsset({
        alt: parsed.alt,
        id: parsed.id,
        tags: parseTags(parsed.tags),
        title: parsed.title,
        usage: parsed.usage,
    });

    revalidateMedia();
    redirect("/admin/mediatheque?feedback=updated");
}

export async function archiveMediaAssetAction(formData: FormData) {
    await requireAdminSession();

    const id = String(formData.get("id") ?? "").trim();
    if (!id) redirect("/admin/mediatheque?feedback=missing");

    await archiveMediaAsset(id);

    revalidateMedia();
    redirect("/admin/mediatheque?feedback=archived");
}

function optionalFormString(value: FormDataEntryValue | null) {
    if (typeof value !== "string") return undefined;

    return value;
}

function parseTags(value: string | undefined) {
    return (value ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 12);
}

function revalidateMedia() {
    revalidatePath("/admin/mediatheque");
}
