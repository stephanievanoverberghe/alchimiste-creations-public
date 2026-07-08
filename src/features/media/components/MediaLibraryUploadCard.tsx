"use client";

import { ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Modal, Select, TextField } from "@/components/ui";
import {
    CloudinaryImageUploadField,
    type CloudinaryImageUploadConfig,
} from "@/components/ui/forms";

type MediaLibraryUploadCardProps = {
    cloudinary: CloudinaryImageUploadConfig;
};

type MediaAssetUsage =
    | "GENERAL"
    | "OFFER"
    | "OFFER_FAMILY"
    | "REALISATION"
    | "PROJECT"
    | "DOCUMENT";

const usageOptions: { label: string; value: MediaAssetUsage }[] = [
    { label: "Général", value: "GENERAL" },
    { label: "Offre", value: "OFFER" },
    { label: "Famille d'offres", value: "OFFER_FAMILY" },
    { label: "Réalisation", value: "REALISATION" },
    { label: "Projet", value: "PROJECT" },
    { label: "Document", value: "DOCUMENT" },
];

export function MediaLibraryUploadCard({ cloudinary }: MediaLibraryUploadCardProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [alt, setAlt] = useState("");
    const [usage, setUsage] = useState<MediaAssetUsage>("GENERAL");

    function handleUploadComplete() {
        router.refresh();
    }

    return (
        <Modal
            open={isOpen}
            onOpenChange={setIsOpen}
            eyebrow="Médiathèque"
            title="Ajouter une image"
            description="Prépare l'image avant l'upload pour la retrouver, la filtrer et la réutiliser proprement dans l'admin."
            size="lg"
            trigger={
                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    iconLeft={<ImagePlus className="size-4" aria-hidden="true" />}
                >
                    Ajouter une image
                </Button>
            }
        >
            <div className="grid gap-5">
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                            label="Titre interne"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Ex. Visuel famille Créer"
                        />
                        <Select
                            label="Usage"
                            value={usage}
                            onValueChange={(nextValue) =>
                                setUsage(nextValue as MediaAssetUsage)
                            }
                            options={usageOptions}
                        />
                    </div>
                    <TextField
                        className="mt-4"
                        label="Texte alternatif"
                        value={alt}
                        onChange={(event) => setAlt(event.target.value)}
                        placeholder="Décris l'image pour l'accessibilité et le SEO."
                    />
                </div>

                <CloudinaryImageUploadField
                    name="mediaUpload"
                    label="Fichier image"
                    assetAlt={alt}
                    assetTitle={title || "Image médiathèque"}
                    cloudinary={cloudinary}
                    folder="alchimiste-creations/media-library"
                    helperText="L'image est envoyée sur Cloudinary puis indexée dans la médiathèque."
                    onValueChange={handleUploadComplete}
                    usage={usage}
                />
            </div>
        </Modal>
    );
}
