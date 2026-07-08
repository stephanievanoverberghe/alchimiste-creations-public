import type { MediaAssetStatus, MediaAssetUsage } from "@prisma/client";

import { getPrismaClient } from "@/server/db/client";

export type AdminMediaFilters = {
    query?: string;
    status?: MediaAssetStatus | "all";
    usage?: MediaAssetUsage | "all";
};

export const mediaAssetSelect = {
    id: true,
    alt: true,
    bytes: true,
    createdAt: true,
    folder: true,
    format: true,
    height: true,
    publicId: true,
    secureUrl: true,
    status: true,
    tags: true,
    title: true,
    updatedAt: true,
    usage: true,
    width: true,
} as const;

export async function getAdminMediaAssets(filters: AdminMediaFilters = {}) {
    const prisma = getPrismaClient();
    const query = filters.query?.trim();

    return prisma.mediaAsset.findMany({
        orderBy: [{ createdAt: "desc" }],
        select: mediaAssetSelect,
        where: {
            ...(filters.status && filters.status !== "all"
                ? { status: filters.status }
                : {}),
            ...(filters.usage && filters.usage !== "all"
                ? { usage: filters.usage }
                : {}),
            ...(query
                ? {
                      OR: [
                          { title: { contains: query, mode: "insensitive" } },
                          { alt: { contains: query, mode: "insensitive" } },
                          { publicId: { contains: query, mode: "insensitive" } },
                          { folder: { contains: query, mode: "insensitive" } },
                      ],
                  }
                : {}),
        },
        take: 120,
    });
}

export async function createMediaAsset(input: {
    alt?: string;
    bytes?: number;
    createdByUserId?: string;
    folder?: string;
    format?: string;
    height?: number;
    publicId: string;
    secureUrl: string;
    tags?: string[];
    title?: string;
    usage?: MediaAssetUsage;
    width?: number;
}) {
    const prisma = getPrismaClient();

    return prisma.mediaAsset.upsert({
        create: {
            alt: nullableString(input.alt),
            bytes: input.bytes ?? null,
            createdByUserId: input.createdByUserId,
            folder: nullableString(input.folder),
            format: nullableString(input.format),
            height: input.height ?? null,
            publicId: input.publicId,
            secureUrl: input.secureUrl,
            tags: input.tags ?? [],
            title: nullableString(input.title),
            usage: input.usage ?? "GENERAL",
            width: input.width ?? null,
        },
        update: {
            alt: nullableString(input.alt),
            bytes: input.bytes ?? null,
            folder: nullableString(input.folder),
            format: nullableString(input.format),
            height: input.height ?? null,
            secureUrl: input.secureUrl,
            tags: input.tags ?? [],
            title: nullableString(input.title),
            usage: input.usage ?? "GENERAL",
            width: input.width ?? null,
            status: "ACTIVE",
        },
        where: { publicId: input.publicId },
        select: mediaAssetSelect,
    });
}

export async function updateMediaAsset(input: {
    alt?: string;
    id: string;
    tags?: string[];
    title?: string;
    usage?: MediaAssetUsage;
}) {
    const prisma = getPrismaClient();

    return prisma.mediaAsset.update({
        data: {
            alt: nullableString(input.alt),
            tags: input.tags ?? [],
            title: nullableString(input.title),
            usage: input.usage,
        },
        where: { id: input.id },
        select: mediaAssetSelect,
    });
}

export async function archiveMediaAsset(id: string) {
    const prisma = getPrismaClient();

    return prisma.mediaAsset.update({
        data: { status: "ARCHIVED" },
        where: { id },
        select: { id: true },
    });
}

function nullableString(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}
