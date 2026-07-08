import type { MediaAssetStatus, MediaAssetUsage } from "@prisma/client";
import type { Metadata } from "next";

import { AdminMediaLibraryPage } from "@/features/media/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminMediaAssets } from "@/server/media/media";

export const metadata: Metadata = {
    title: "Médiathèque — Admin Alchimiste Créations",
    description: "Bibliothèque d'images Cloudinary utilisée par l'admin.",
};

export const dynamic = "force-dynamic";

type AdminMediaLibraryRouteProps = {
    searchParams: Promise<{
        q?: string;
        feedback?: string;
        status?: string;
        usage?: string;
    }>;
};

export default async function AdminMediaLibraryRoute({
    searchParams,
}: AdminMediaLibraryRouteProps) {
    await requireAdminSession();

    const params = await searchParams;
    const filters = {
        query: params.q,
        status: normalizeStatus(params.status),
        usage: normalizeUsage(params.usage),
    };
    const assets = await getAdminMediaAssets();

    return (
        <AdminMediaLibraryPage
            assets={assets}
            filters={filters}
            status={params.feedback}
        />
    );
}

function normalizeStatus(value: string | undefined): MediaAssetStatus | "all" {
    if (value === "ARCHIVED" || value === "ACTIVE" || value === "all") {
        return value;
    }

    return "ACTIVE";
}

function normalizeUsage(value: string | undefined): MediaAssetUsage | "all" {
    if (
        value === "GENERAL" ||
        value === "OFFER" ||
        value === "OFFER_FAMILY" ||
        value === "REALISATION" ||
        value === "PROJECT" ||
        value === "DOCUMENT" ||
        value === "all"
    ) {
        return value;
    }

    return "all";
}
