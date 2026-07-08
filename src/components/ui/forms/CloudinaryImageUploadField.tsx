"use client";

import { ImagePlus, Link as LinkIcon, LoaderCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/primitives/Button";
import {
    cn,
    FormLabel,
    FormMessage,
    formRootClasses,
    getFieldFrameClasses,
    useFormField,
} from "@/components/ui/forms/shared";

type CloudinaryImageUploadFieldProps = {
    name: string;
    label: string;
    assetAlt?: string;
    assetTitle?: string;
    className?: string;
    cloudinary?: CloudinaryImageUploadConfig;
    defaultValue?: string | null;
    errorMessage?: string;
    folder?: string;
    helperText?: string;
    onUrlChange?: (value: string) => void;
    onValueChange?: () => void;
    placeholder?: string;
    registerInMediaLibrary?: boolean;
    required?: boolean;
    usage?: MediaAssetUsageValue;
    value?: string;
};

export type CloudinaryImageUploadConfig = {
    apiKey?: string;
    cloudName?: string;
    signatureEndpoint?: string;
};

type CloudinaryUploadResponse = {
    bytes?: number;
    folder?: string;
    format?: string;
    height?: number;
    public_id?: string;
    secure_url?: string;
    width?: number;
    error?: {
        message?: string;
    };
};

type MediaAssetUsageValue =
    | "GENERAL"
    | "OFFER"
    | "OFFER_FAMILY"
    | "REALISATION"
    | "PROJECT"
    | "DOCUMENT";

const defaultCloudinarySignatureEndpoint = "/api/cloudinary/signature";
const maxImageSize = 5 * 1024 * 1024;

export function CloudinaryImageUploadField({
    name,
    label,
    assetAlt,
    assetTitle,
    className,
    cloudinary,
    defaultValue,
    errorMessage,
    folder,
    helperText,
    onUrlChange,
    onValueChange,
    placeholder = "https://res.cloudinary.com/...",
    registerInMediaLibrary = true,
    required = false,
    usage = "GENERAL",
    value: controlledValue,
}: CloudinaryImageUploadFieldProps) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [localError, setLocalError] = useState<string>();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fieldError = errorMessage ?? localError;
    const hasError = Boolean(fieldError);
    const message = fieldError ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        name,
        message,
    });
    const cloudName =
        cloudinary?.cloudName ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = cloudinary?.apiKey ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const signatureEndpoint =
        cloudinary?.signatureEndpoint ?? defaultCloudinarySignatureEndpoint;
    const canUpload = Boolean(cloudName && apiKey);
    const value = controlledValue ?? internalValue;

    const updateValue = useCallback(
        (nextValue: string) => {
            if (controlledValue === undefined) {
                setInternalValue(nextValue);
            }

            setLocalError(undefined);
            onUrlChange?.(nextValue);
            window.setTimeout(() => onValueChange?.(), 0);
        },
        [controlledValue, onUrlChange, onValueChange],
    );

    const uploadFile = useCallback(
        async (file: File) => {
            if (!cloudName || !apiKey) {
                setLocalError("Cloudinary n'est pas configuré.");
                return;
            }

            setLocalError(undefined);
            setIsUploading(true);
            setProgress(0);

            try {
                const timestamp = Math.round(Date.now() / 1000);
                const paramsToSign = {
                    folder,
                    timestamp,
                };
                const signatureResponse = await fetch(signatureEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ paramsToSign }),
                });

                if (!signatureResponse.ok) {
                    throw new Error("Signature Cloudinary impossible.");
                }

                const signaturePayload = (await signatureResponse.json()) as {
                    signature?: string;
                };

                if (!signaturePayload.signature) {
                    throw new Error("Signature Cloudinary manquante.");
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("api_key", apiKey);
                formData.append("timestamp", String(timestamp));
                formData.append("signature", signaturePayload.signature);

                if (folder) {
                    formData.append("folder", folder);
                }

                const uploadResponse = await uploadToCloudinary({
                    cloudName,
                    formData,
                    onProgress: setProgress,
                });

                if (!uploadResponse.secure_url) {
                    throw new Error(
                        uploadResponse.error?.message ??
                            "Cloudinary n'a pas renvoyé d'URL.",
                    );
                }

                if (registerInMediaLibrary) {
                    await registerMediaAsset({
                        alt: assetAlt,
                        bytes: uploadResponse.bytes,
                        folder: uploadResponse.folder ?? folder,
                        format: uploadResponse.format,
                        height: uploadResponse.height,
                        publicId: uploadResponse.public_id,
                        secureUrl: uploadResponse.secure_url,
                        title: assetTitle ?? label,
                        usage,
                        width: uploadResponse.width,
                    });
                }

                updateValue(uploadResponse.secure_url);
            } catch (error) {
                setLocalError(
                    error instanceof Error
                        ? error.message
                        : "L'image n'a pas pu être envoyée.",
                );
            } finally {
                setIsUploading(false);
            }
        },
        [
            apiKey,
            assetAlt,
            assetTitle,
            cloudName,
            folder,
            label,
            registerInMediaLibrary,
            signatureEndpoint,
            updateValue,
            usage,
        ],
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            void uploadFile(file);
        },
        [uploadFile],
    );

    const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
        accept: {
            "image/avif": [".avif"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
        },
        disabled: !canUpload || isUploading,
        maxFiles: 1,
        maxSize: maxImageSize,
        multiple: false,
        noClick: true,
        onDrop,
        onDropRejected: () => {
            setLocalError("Choisis une image JPG, PNG, WebP ou AVIF de moins de 5 Mo.");
        },
    });

    return (
        <div className={cn(formRootClasses, className)}>
            <FormLabel
                htmlFor={fieldId}
                label={label}
                required={required}
                hasError={hasError}
            />

            <div
                className={cn(
                    "grid gap-4 p-3 md:grid-cols-[180px_1fr]",
                    getFieldFrameClasses({ hasError }),
                )}
            >
                <div
                    {...getRootProps({
                        className: cn(
                            "relative min-h-32 overflow-hidden rounded-xl border bg-[linear-gradient(135deg,var(--color-surface-interactive),var(--color-bg-deep))] transition-colors",
                            isDragActive
                                ? "border-[color:var(--color-info-border)]"
                                : "border-[color:var(--color-border-subtle)]",
                        ),
                    })}
                >
                    <input {...getInputProps()} />
                    {value ? (
                        <Image
                            src={value}
                            alt=""
                            fill
                            className="size-full object-cover"
                            sizes="180px"
                        />
                    ) : (
                        <div className="flex size-full min-h-32 flex-col items-center justify-center gap-2 p-4 text-center text-[color:var(--color-text-subtle)]">
                            <ImagePlus className="size-8" aria-hidden="true" />
                            <span className="text-caption">
                                Glisse ton image ici
                            </span>
                        </div>
                    )}
                    {isUploading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/65 p-4 text-center text-[color:var(--color-text-default)]">
                            <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
                            <span className="text-caption">Upload {progress}%</span>
                        </div>
                    ) : null}
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        {canUpload ? (
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                loading={isUploading}
                                iconLeft={<ImagePlus className="size-4" aria-hidden="true" />}
                                onClick={open}
                            >
                                Choisir une image
                            </Button>
                        ) : (
                            <span className="inline-flex min-h-10 items-center rounded-full border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] px-4 text-caption text-[color:var(--color-warning-text)]">
                                Cloudinary à configurer
                            </span>
                        )}

                        {value ? (
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                iconLeft={<Trash2 className="size-4" aria-hidden="true" />}
                                onClick={() => updateValue("")}
                            >
                                Retirer
                            </Button>
                        ) : null}
                    </div>

                    <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[color:var(--color-border-control)] bg-[var(--color-bg-deep)] px-3">
                        <LinkIcon
                            className="size-4 shrink-0 text-[color:var(--color-text-subtle)]"
                            aria-hidden="true"
                        />
                        <input
                            id={fieldId}
                            name={name}
                            type="text"
                            inputMode="url"
                            value={value}
                            onChange={(event) => updateValue(event.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-caption text-[color:var(--color-text-default)] outline-none placeholder:text-[color:var(--color-text-subtle)]"
                            placeholder={placeholder}
                            required={required}
                            aria-invalid={hasError || undefined}
                            aria-describedby={describedBy}
                        />
                    </label>
                </div>
            </div>

            <FormMessage id={messageId} message={message} hasError={hasError} />
        </div>
    );
}

function uploadToCloudinary({
    cloudName,
    formData,
    onProgress,
}: {
    cloudName: string;
    formData: FormData;
    onProgress: (progress: number) => void;
}) {
    return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.upload.addEventListener("progress", (event) => {
            if (!event.lengthComputable) return;

            onProgress(Math.round((event.loaded / event.total) * 100));
        });

        request.addEventListener("load", () => {
            try {
                const payload = JSON.parse(request.responseText) as CloudinaryUploadResponse;

                if (request.status >= 200 && request.status < 300) {
                    resolve(payload);
                    return;
                }

                reject(new Error(payload.error?.message ?? "Upload Cloudinary refusé."));
            } catch {
                reject(new Error("Réponse Cloudinary illisible."));
            }
        });

        request.addEventListener("error", () => {
            reject(new Error("Upload Cloudinary interrompu."));
        });

        request.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        );
        request.send(formData);
    });
}

async function registerMediaAsset(input: {
    alt?: string;
    bytes?: number;
    folder?: string;
    format?: string;
    height?: number;
    publicId?: string;
    secureUrl: string;
    title?: string;
    usage: MediaAssetUsageValue;
    width?: number;
}) {
    if (!input.publicId) {
        throw new Error("Cloudinary n'a pas renvoyÃ© d'identifiant mÃ©dia.");
    }

    const response = await fetch("/api/media/assets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error("L'image a Ã©tÃ© envoyÃ©e, mais pas ajoutÃ©e Ã  la mÃ©diathÃ¨que.");
    }
}
