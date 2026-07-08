import { Archive, Images, Upload } from "lucide-react";
import type { ReactNode } from "react";

import { Badge, Toast } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { MediaLibraryBrowser } from "@/features/media/components/MediaLibraryBrowser";
import { MediaLibraryUploadCard } from "@/features/media/components/MediaLibraryUploadCard";
import { getAdminMediaAssets } from "@/server/media/media";

type AdminMediaLibraryPageProps = {
    assets: Awaited<ReturnType<typeof getAdminMediaAssets>>;
    filters: {
        query?: string;
        status?: string;
        usage?: string;
    };
    status?: string;
};

export function AdminMediaLibraryPage({
    assets,
    filters,
    status,
}: AdminMediaLibraryPageProps) {
    const cloudinaryConfig = {
        apiKey:
            process.env.CLOUDINARY_API_KEY ??
            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        cloudName:
            process.env.CLOUDINARY_CLOUD_NAME ??
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    };

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Catalogue"
                title="Médiathèque"
                description="Centralise les images uploadées depuis l'admin, réutilise-les dans les offres et garde les textes alternatifs propres."
                actions={<MediaLibraryUploadCard cloudinary={cloudinaryConfig} />}
                metrics={
                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                        <Metric
                            icon={<Images className="size-4" />}
                            label="Images"
                            value={String(assets.length)}
                        />
                        <Metric
                            icon={<Upload className="size-4" />}
                            label="Actives"
                            value={String(
                                assets.filter((asset) => asset.status === "ACTIVE")
                                    .length,
                            )}
                        />
                        <Metric
                            icon={<Archive className="size-4" />}
                            label="Archivées"
                            value={String(
                                assets.filter((asset) => asset.status === "ARCHIVED")
                                    .length,
                            )}
                        />
                    </div>
                }
            />

            <MediaStatusToast status={status} />

            <div className="grid gap-5">
                <MediaLibraryBrowser assets={assets} filters={filters} />
            </div>
        </AdminPageShell>
    );
}

function MediaStatusToast({ status }: { status?: string }) {
    if (!status) return null;

    const messages: Record<
        string,
        { message: string; title: string; tone: "success" | "warning" }
    > = {
        archived: {
            message:
                "L'image est archivée. Le fichier Cloudinary n'a pas été supprimé.",
            title: "Image archivée",
            tone: "warning",
        },
        updated: {
            message: "Les informations de l'image ont été mises à jour.",
            title: "Médiathèque mise à jour",
            tone: "success",
        },
    };

    const feedback = messages[status];
    if (!feedback) return null;

    return (
        <Toast
            autoDismiss
            dismissible
            durationMs={6500}
            placement="bottom-right"
            showProgress
            tone={feedback.tone}
            title={feedback.title}
        >
            {feedback.message}
        </Toast>
    );
}

function Metric({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    {label}
                </p>
                <Badge tone="neutral" size="sm">
                    {icon}
                </Badge>
            </div>
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}
