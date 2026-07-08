"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, ImagePlus, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Badge, Button } from "@/components/ui";
import {
    CloudinaryImageUploadField,
    type CloudinaryImageUploadConfig,
} from "@/components/ui/forms/CloudinaryImageUploadField";
import { cn } from "@/components/ui/forms/shared";

export type MediaImageFieldAsset = {
    alt: string | null;
    id: string;
    secureUrl: string;
    status: "ACTIVE" | "ARCHIVED";
    tags: string[];
    title: string | null;
    usage: string;
};

type MediaImageFieldProps = {
    name: string;
    label: string;
    assets: MediaImageFieldAsset[];
    assetAlt?: string;
    assetTitle?: string;
    className?: string;
    cloudinary?: CloudinaryImageUploadConfig;
    defaultValue?: string | null;
    folder?: string;
    helperText?: string;
    onValueChange?: () => void;
    required?: boolean;
    usage?: "GENERAL" | "OFFER" | "OFFER_FAMILY" | "REALISATION" | "PROJECT" | "DOCUMENT";
};

export function MediaImageField({
    name,
    label,
    assets,
    assetAlt,
    assetTitle,
    className,
    cloudinary,
    defaultValue,
    folder,
    helperText,
    onValueChange,
    required = false,
    usage = "GENERAL",
}: MediaImageFieldProps) {
    const [value, setValue] = useState(defaultValue ?? "");
    const [query, setQuery] = useState("");

    const activeAssets = useMemo(
        () => assets.filter((asset) => asset.status === "ACTIVE"),
        [assets],
    );
    const filteredAssets = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return activeAssets;

        return activeAssets.filter((asset) =>
            [
                asset.title,
                asset.alt,
                asset.secureUrl,
                asset.usage,
                ...asset.tags,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery),
        );
    }, [activeAssets, query]);

    const selectedAsset = activeAssets.find((asset) => asset.secureUrl === value);

    function updateValue(nextValue: string) {
        setValue(nextValue);
        onValueChange?.();
    }

    return (
        <div className={cn("grid gap-3", className)}>
            <CloudinaryImageUploadField
                name={name}
                label={label}
                assetAlt={assetAlt}
                assetTitle={assetTitle}
                cloudinary={cloudinary}
                defaultValue={defaultValue}
                folder={folder}
                helperText={helperText}
                onUrlChange={updateValue}
                onValueChange={onValueChange}
                required={required}
                usage={usage}
                value={value}
            />

            <div className="flex flex-wrap items-center gap-2">
                <MediaPickerDialog
                    assets={filteredAssets}
                    query={query}
                    selectedUrl={value}
                    setQuery={setQuery}
                    onSelect={updateValue}
                />
                {selectedAsset ? (
                    <Badge tone="info" size="sm">
                        Image issue de la médiathèque
                    </Badge>
                ) : null}
            </div>
        </div>
    );
}

function MediaPickerDialog({
    assets,
    onSelect,
    query,
    selectedUrl,
    setQuery,
}: {
    assets: MediaImageFieldAsset[];
    onSelect: (value: string) => void;
    query: string;
    selectedUrl: string;
    setQuery: (value: string) => void;
}) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    iconLeft={<ImagePlus className="size-4" aria-hidden="true" />}
                >
                    Choisir dans la médiathèque
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] grid max-h-[min(760px,calc(100vh-32px))] w-[min(980px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-3xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] shadow-2xl shadow-black/45 outline-none">
                    <header className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border-subtle)] p-5">
                        <div>
                            <Dialog.Title className="text-h3 text-[color:var(--color-text-default)]">
                                Choisir une image
                            </Dialog.Title>
                            <Dialog.Description className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                                Sélectionne une image déjà envoyée dans Cloudinary.
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="focus-ring inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                                aria-label="Fermer la médiathèque"
                            >
                                <X className="size-4" aria-hidden="true" />
                            </button>
                        </Dialog.Close>
                    </header>

                    <div className="border-b border-[color:var(--color-border-subtle)] p-4">
                        <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[color:var(--color-border-control)] bg-[var(--color-bg-deep)] px-4">
                            <Search
                                className="size-4 shrink-0 text-[color:var(--color-text-subtle)]"
                                aria-hidden="true"
                            />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Rechercher par titre, alt, tag..."
                                className="min-w-0 flex-1 bg-transparent text-body-small text-[color:var(--color-text-default)] outline-none placeholder:text-[color:var(--color-text-subtle)]"
                            />
                        </label>
                    </div>

                    <div className="overflow-y-auto p-4">
                        {assets.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {assets.map((asset) => (
                                    <Dialog.Close key={asset.id} asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "focus-ring group overflow-hidden rounded-2xl border bg-[var(--color-surface-interactive)] text-left transition hover:border-[color:var(--color-action-hover)]",
                                                selectedUrl === asset.secureUrl
                                                    ? "border-[color:var(--color-action-default)]"
                                                    : "border-[color:var(--color-border-subtle)]",
                                            )}
                                            onClick={() => onSelect(asset.secureUrl)}
                                        >
                                            <span className="relative block aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={asset.secureUrl}
                                                    alt={asset.alt ?? ""}
                                                    fill
                                                    sizes="(min-width:1280px) 300px, 50vw"
                                                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                                />
                                                {selectedUrl === asset.secureUrl ? (
                                                    <span className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)]">
                                                        <Check className="size-4" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </span>
                                            <span className="grid gap-1 p-3">
                                                <span className="truncate text-label text-[color:var(--color-text-default)]">
                                                    {asset.title ?? "Image sans titre"}
                                                </span>
                                                <span className="truncate text-caption text-[color:var(--color-text-subtle)]">
                                                    {asset.alt ?? asset.usage}
                                                </span>
                                            </span>
                                        </button>
                                    </Dialog.Close>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-8 text-center">
                                <p className="text-h3 text-[color:var(--color-text-default)]">
                                    Aucune image disponible.
                                </p>
                                <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                                    Upload une image depuis un formulaire ou depuis la médiathèque.
                                </p>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
