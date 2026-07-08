"use client";

import { FileUp, Loader2, Paperclip, X } from "lucide-react";
import { useId, useRef, useState, type ChangeEvent } from "react";

/** Taille maximale acceptée pour une pièce jointe (10 Mo). */
const MAX_BYTES = 10 * 1024 * 1024;

/** Types acceptés : documents courants et images. */
const ACCEPTED = [
    ".pdf",
    ".doc",
    ".docx",
    ".odt",
    ".txt",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
].join(",");

type AttachmentValue = {
    name: string;
    url: string;
};

type ProjectRequestAttachmentFieldProps = {
    onChange: (value: AttachmentValue) => void;
    value: AttachmentValue;
};

/**
 * Champ d'upload de pièce jointe pour le formulaire public : le prospect peut
 * joindre un document ou une image. Le fichier part directement vers
 * Cloudinary via une signature à usage unique obtenue du serveur (dossier
 * imposé, endpoint rate-limité). La taille et le type sont vérifiés côté
 * client avant tout envoi.
 */
export function ProjectRequestAttachmentField({
    onChange,
    value,
}: ProjectRequestAttachmentFieldProps) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string>();

    const openPicker = () => inputRef.current?.click();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Réinitialise l'input pour permettre de re-sélectionner le même fichier.
        event.target.value = "";

        if (!file) return;

        if (file.size > MAX_BYTES) {
            setError("Le fichier dépasse 10 Mo. Choisis un document plus léger.");
            return;
        }

        setError(undefined);
        setIsUploading(true);

        try {
            const uploadedUrl = await uploadAttachment(file);
            onChange({ name: file.name.slice(0, 200), url: uploadedUrl });
        } catch (uploadError) {
            setError(
                uploadError instanceof Error
                    ? uploadError.message
                    : "L'envoi du document n'a pas abouti. Réessaie.",
            );
        } finally {
            setIsUploading(false);
        }
    };

    const removeAttachment = () => {
        setError(undefined);
        onChange({ name: "", url: "" });
    };

    const hasAttachment = Boolean(value.url);

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <span className="text-label font-medium text-[color:var(--color-text-default)]">
                Joindre un document{" "}
                <span className="font-normal text-[color:var(--color-text-subtle)]">
                    (optionnel)
                </span>
            </span>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={ACCEPTED}
                className="sr-only"
                onChange={handleFileChange}
                disabled={isUploading}
            />

            {hasAttachment ? (
                <div className="flex items-center gap-3 rounded-card border border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] px-4 py-3">
                    <Paperclip
                        className="size-4 shrink-0 text-[color:var(--color-action-default)]"
                        aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate text-body-small font-medium text-[color:var(--color-text-default)]">
                        {value.name || "Document joint"}
                    </span>
                    <button
                        type="button"
                        onClick={removeAttachment}
                        className="focus-ring inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[color:var(--color-text-muted)] transition-colors hover:bg-[rgba(255,243,224,0.06)] hover:text-[color:var(--color-text-default)]"
                        aria-label="Retirer le document joint"
                    >
                        <X className="size-4" aria-hidden="true" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={openPicker}
                    disabled={isUploading}
                    className="focus-ring group flex min-h-14 items-center justify-center gap-3 rounded-card border border-dashed border-[color:var(--color-border-strong)] bg-transparent px-4 text-body-small font-medium text-[color:var(--color-text-muted)] transition-[border-color,color] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/60 hover:text-[color:var(--color-text-default)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isUploading ? (
                        <>
                            <Loader2
                                className="size-4 animate-spin"
                                aria-hidden="true"
                            />
                            Envoi du document...
                        </>
                    ) : (
                        <>
                            <FileUp
                                className="size-4 text-[color:var(--color-action-default)]"
                                aria-hidden="true"
                            />
                            Choisir un fichier (PDF, image, doc — 10 Mo max)
                        </>
                    )}
                </button>
            )}

            {error ? (
                <p
                    className="text-body-small font-medium text-[color:var(--color-danger-text)]"
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}

type AttachmentSignature = {
    apiKey: string;
    cloudName: string;
    folder: string;
    signature: string;
    timestamp: number;
};

/**
 * Obtient une signature du serveur puis téléverse le fichier directement vers
 * Cloudinary. Retourne l'URL sécurisée du média.
 */
async function uploadAttachment(file: File): Promise<string> {
    const signatureResponse = await fetch(
        "/api/project-requests/attachment-signature",
        { method: "POST" },
    );
    const signaturePayload = (await signatureResponse
        .json()
        .catch(() => null)) as (AttachmentSignature & { ok?: boolean }) | null;

    if (!signatureResponse.ok || !signaturePayload?.signature) {
        throw new Error(
            "L'envoi de document n'est pas disponible pour le moment.",
        );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signaturePayload.apiKey);
    formData.append("timestamp", String(signaturePayload.timestamp));
    formData.append("folder", signaturePayload.folder);
    formData.append("signature", signaturePayload.signature);

    const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/auto/upload`,
        { method: "POST", body: formData },
    );
    const uploadResult = (await uploadResponse
        .json()
        .catch(() => null)) as { secure_url?: string } | null;

    if (!uploadResponse.ok || !uploadResult?.secure_url) {
        throw new Error("L'envoi du document n'a pas abouti. Réessaie.");
    }

    return uploadResult.secure_url;
}
