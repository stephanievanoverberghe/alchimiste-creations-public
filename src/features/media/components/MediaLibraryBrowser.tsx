"use client";

import {
    Archive,
    Edit3,
    ExternalLink,
    Grid2X2,
    Images,
    List,
    Search,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import {
    Badge,
    Button,
    DataViewToolbar,
    Modal,
    Select,
    TextField,
} from "@/components/ui";
import { CopyMediaUrlButton } from "@/features/media/components/CopyMediaUrlButton";
import {
    archiveMediaAssetAction,
    updateMediaAssetAction,
} from "@/server/media/actions";
import type { getAdminMediaAssets } from "@/server/media/media";

type MediaAsset = Awaited<ReturnType<typeof getAdminMediaAssets>>[number];

type MediaLibraryBrowserProps = {
    assets: MediaAsset[];
    filters: {
        query?: string;
        status?: string;
        usage?: string;
    };
};

type MediaViewMode = "grid" | "table";

const usageOptions = [
    { label: "Général", value: "GENERAL" },
    { label: "Offre", value: "OFFER" },
    { label: "Famille d'offres", value: "OFFER_FAMILY" },
    { label: "Réalisation", value: "REALISATION" },
    { label: "Projet", value: "PROJECT" },
    { label: "Document", value: "DOCUMENT" },
];

export function MediaLibraryBrowser({
    assets,
    filters,
}: MediaLibraryBrowserProps) {
    const [queryFilter, setQueryFilter] = useState(filters.query ?? "");
    const [statusFilter, setStatusFilter] = useState(filters.status ?? "ACTIVE");
    const [usageFilter, setUsageFilter] = useState(filters.usage ?? "all");
    const [viewMode, setViewMode] = useState<MediaViewMode>("grid");
    const filteredAssets = useMemo(
        () =>
            assets.filter((asset) => {
                const normalizedQuery = queryFilter.trim().toLowerCase();
                const matchesQuery =
                    !normalizedQuery ||
                    [
                        asset.title,
                        asset.alt,
                        asset.publicId,
                        asset.folder,
                        asset.secureUrl,
                        asset.usage,
                        ...asset.tags,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase()
                        .includes(normalizedQuery);
                const matchesStatus =
                    statusFilter === "all" || asset.status === statusFilter;
                const matchesUsage =
                    usageFilter === "all" || asset.usage === usageFilter;

                return matchesQuery && matchesStatus && matchesUsage;
            }),
        [assets, queryFilter, statusFilter, usageFilter],
    );

    return (
        <section className="grid gap-4">
            <DataViewToolbar
                countLabel={`${filteredAssets.length} image(s) affichée(s) sur ${assets.length}`}
                filtersClassName="md:grid-cols-[minmax(220px,340px)_minmax(180px,240px)_minmax(160px,220px)]"
                viewMode={viewMode}
                onViewModeChange={(nextValue) =>
                    setViewMode(nextValue as MediaViewMode)
                }
                viewOptions={[
                    {
                        value: "grid",
                        label: "Grille",
                        icon: <Grid2X2 className="size-4" />,
                    },
                    {
                        value: "table",
                        label: "Table",
                        icon: <List className="size-4" />,
                    },
                ]}
            >
                <TextField
                    label="Recherche"
                    value={queryFilter}
                    onChange={(event) => setQueryFilter(event.target.value)}
                    placeholder="Titre, alt, Cloudinary..."
                    iconLeft={<Search className="size-4" />}
                />
                <Select
                    label="Usage"
                    value={usageFilter}
                    onValueChange={setUsageFilter}
                    options={[
                        { value: "all", label: "Tous les usages" },
                        ...usageOptions,
                    ]}
                />
                <Select
                    label="Statut"
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    options={[
                        { value: "ACTIVE", label: "Actives" },
                        { value: "ARCHIVED", label: "Archivées" },
                        { value: "all", label: "Toutes" },
                    ]}
                />
            </DataViewToolbar>

            {filteredAssets.length > 0 ? (
                viewMode === "grid" ? (
                    <MediaAssetGrid assets={filteredAssets} />
                ) : (
                    <MediaAssetTable assets={filteredAssets} />
                )
            ) : (
                <MediaEmptyState />
            )}
        </section>
    );
}

function MediaAssetGrid({ assets }: { assets: MediaAsset[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {assets.map((asset) => (
                <MediaAssetCard key={asset.id} asset={asset} />
            ))}
        </div>
    );
}

function MediaAssetCard({ asset }: { asset: MediaAsset }) {
    return (
        <article className="group relative min-h-[340px] overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <Image
                src={asset.secureUrl}
                alt={asset.alt ?? ""}
                fill
                sizes="(min-width:1536px) 28vw, (min-width:768px) 45vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.20),rgba(10,8,5,0.34)_36%,rgba(10,8,5,0.90))]"
                aria-hidden="true"
            />

            <div className="relative z-10 flex min-h-[340px] flex-col justify-between gap-6 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-wrap gap-2">
                        <Badge
                            tone={asset.status === "ACTIVE" ? "success" : "draft"}
                            size="sm"
                            className="shadow-lg shadow-black/20"
                        >
                            {asset.status === "ACTIVE" ? "Active" : "Archivée"}
                        </Badge>
                        <Badge tone="info" size="sm" className="shadow-lg shadow-black/20">
                            {getUsageLabel(asset.usage)}
                        </Badge>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/25 p-1 shadow-lg shadow-black/25 backdrop-blur-sm">
                        <MediaAssetActions asset={asset} />
                    </div>
                </div>

                <div className="grid gap-3">
                    <div>
                        <p className="text-caption uppercase text-[color:var(--color-decor-gold)]">
                            {asset.format ? asset.format.toUpperCase() : "Image"}
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-h3 text-white">
                            {asset.title ?? "Image sans titre"}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-body-small text-white/76">
                            {asset.alt || asset.publicId}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <CompactMediaStat
                            label="Largeur"
                            value={asset.width ? `${asset.width}px` : "N/A"}
                        />
                        <CompactMediaStat
                            label="Hauteur"
                            value={asset.height ? `${asset.height}px` : "N/A"}
                        />
                        <CompactMediaStat
                            label="Poids"
                            value={asset.bytes ? formatBytes(asset.bytes) : "N/A"}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}

function MediaAssetTable({ assets }: { assets: MediaAsset[] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="grid min-w-[1060px] grid-cols-[minmax(360px,1fr)_180px_170px_188px] gap-4 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3 text-caption uppercase text-[color:var(--color-text-subtle)]">
                <span>Image</span>
                <span>Usage</span>
                <span>Fichier</span>
                <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-[color:var(--color-border-subtle)]">
                {assets.map((asset) => (
                    <article
                        key={asset.id}
                        className="grid min-w-[1060px] grid-cols-[minmax(360px,1fr)_180px_170px_188px] items-center gap-4 px-4 py-3"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)]">
                                <Image
                                    src={asset.secureUrl}
                                    alt={asset.alt ?? ""}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-label text-[color:var(--color-text-default)]">
                                    {asset.title ?? "Image sans titre"}
                                </p>
                                <p className="mt-0.5 truncate text-caption text-[color:var(--color-text-subtle)]">
                                    {asset.alt || asset.publicId}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge tone="info" size="sm">
                                {getUsageLabel(asset.usage)}
                            </Badge>
                            <Badge
                                tone={asset.status === "ACTIVE" ? "success" : "draft"}
                                size="sm"
                            >
                                {asset.status === "ACTIVE" ? "Active" : "Archivée"}
                            </Badge>
                        </div>
                        <p className="text-caption text-[color:var(--color-text-subtle)]">
                            {asset.width && asset.height
                                ? `${asset.width} × ${asset.height}`
                                : "Dimensions inconnues"}
                            {asset.format ? ` · ${asset.format.toUpperCase()}` : ""}
                            {asset.bytes ? ` · ${formatBytes(asset.bytes)}` : ""}
                        </p>
                        <MediaAssetActions asset={asset} />
                    </article>
                ))}
            </div>
        </div>
    );
}

function CompactMediaStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3 shadow-inner shadow-white/5 backdrop-blur-sm">
            <p className="text-caption text-white/58">{label}</p>
            <p className="mt-1 truncate text-label text-white">{value}</p>
        </div>
    );
}

function MediaAssetActions({ asset }: { asset: MediaAsset }) {
    return (
        <div className="flex shrink-0 items-center justify-end gap-2 whitespace-nowrap">
            <a
                href={asset.secureUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                title="Ouvrir l'image"
            >
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only">Ouvrir {asset.title ?? "l'image"}</span>
            </a>
            <CopyMediaUrlButton url={asset.secureUrl} />
            <MediaAssetEditModal asset={asset} />
            <ArchiveMediaAssetModal asset={asset} />
        </div>
    );
}

function MediaAssetEditModal({ asset }: { asset: MediaAsset }) {
    return (
        <Modal
            eyebrow="Médiathèque"
            title="Modifier l'image"
            description="Mets à jour les informations utiles pour retrouver et réutiliser cette image dans l'admin."
            size="md"
            trigger={
                <button
                    type="button"
                    className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]"
                    title="Modifier"
                >
                    <Edit3 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Modifier</span>
                </button>
            }
        >
            <MediaAssetEditForm asset={asset} />
        </Modal>
    );
}

function MediaAssetEditForm({ asset }: { asset: MediaAsset }) {
    return (
        <form action={updateMediaAssetAction} className="grid gap-4">
            <input type="hidden" name="id" value={asset.id} />
            <TextField
                name="title"
                label="Titre"
                defaultValue={asset.title ?? ""}
                placeholder="Nom interne de l'image"
            />
            <TextField
                name="alt"
                label="Texte alternatif"
                defaultValue={asset.alt ?? ""}
                placeholder="Description courte de l'image"
            />
            <div className="grid gap-3 sm:grid-cols-2">
                <Select
                    name="usage"
                    label="Usage"
                    defaultValue={asset.usage}
                    options={usageOptions}
                />
                <TextField
                    name="tags"
                    label="Tags"
                    defaultValue={asset.tags.join(", ")}
                    placeholder="offre, accueil, hero"
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit" variant="primary" size="md">
                    Enregistrer
                </Button>
            </div>
        </form>
    );
}

function ArchiveMediaAssetModal({ asset }: { asset: MediaAsset }) {
    if (asset.status !== "ACTIVE") return null;

    return (
        <Modal
            eyebrow="Médiathèque"
            title="Supprimer cette image ?"
            description="En V1, l'image sera archivée dans le CRM. Le fichier Cloudinary ne sera pas supprimé physiquement."
            size="md"
            trigger={
                <button
                    type="button"
                    className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-danger-solid)] hover:text-white"
                    title="Supprimer"
                >
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Supprimer</span>
                </button>
            }
        >
            <form action={archiveMediaAssetAction} className="grid gap-5">
                <input type="hidden" name="id" value={asset.id} />
                <div className="rounded-2xl border border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] p-4 text-body-small text-[color:var(--color-danger-text)]">
                    Tu pourras encore retrouver l&apos;image en filtrant sur les médias archivés.
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="submit"
                        variant="solid"
                        tone="danger"
                        size="md"
                        iconLeft={<Archive className="size-4" aria-hidden="true" />}
                    >
                        Archiver l&apos;image
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function MediaEmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-10 text-center">
            <Images
                className="mx-auto size-10 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <h2 className="mt-4 text-h3 text-[color:var(--color-text-default)]">
                Aucune image dans cette vue.
            </h2>
            <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                Upload une image ou ajuste les filtres.
            </p>
        </div>
    );
}

function getUsageLabel(value: string) {
    return usageOptions.find((option) => option.value === value)?.label ?? value;
}

function formatBytes(value: number) {
    if (value < 1024 * 1024) return `${Math.round(value / 1024)} Ko`;

    return `${(value / 1024 / 1024).toFixed(1)} Mo`;
}
