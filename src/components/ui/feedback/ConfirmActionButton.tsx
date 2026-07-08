"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/primitives/Button";
import { cn } from "@/components/ui/forms/shared";

type ConfirmActionTone = "danger" | "warning" | "info" | "success" | "neutral";

type ConfirmActionButtonProps = {
    action: (formData: FormData) => void | Promise<void>;
    confirmDescription: string;
    confirmIcon?: ReactNode;
    confirmLabel: string;
    confirmTitle: string;
    disabled?: boolean;
    disabledTitle?: string;
    id: string;
    itemName: string;
    tone?: ConfirmActionTone;
    triggerClassName?: string;
    triggerIcon: ReactNode;
    triggerTitle: string;
};

const toneClasses: Record<
    ConfirmActionTone,
    { badge: string; triggerHover: string }
> = {
    danger: {
        badge: "border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[color:var(--color-danger-text)]",
        triggerHover: "hover:bg-[var(--color-danger-solid)] hover:text-white",
    },
    info: {
        badge: "border-[color:var(--color-info-border)] bg-[var(--color-info-bg)] text-[color:var(--color-info-text)]",
        triggerHover:
            "hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]",
    },
    neutral: {
        badge: "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] text-[color:var(--color-text-default)]",
        triggerHover:
            "hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]",
    },
    success: {
        badge: "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]",
        triggerHover:
            "hover:bg-[var(--color-success-bg)] hover:text-[color:var(--color-success-text)]",
    },
    warning: {
        badge: "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[color:var(--color-warning-text)]",
        triggerHover:
            "hover:bg-[var(--color-warning-bg)] hover:text-[color:var(--color-warning-text)]",
    },
};

export function ConfirmActionButton({
    action,
    confirmDescription,
    confirmIcon,
    confirmLabel,
    confirmTitle,
    disabled = false,
    disabledTitle,
    id,
    itemName,
    tone = "neutral",
    triggerClassName,
    triggerIcon,
    triggerTitle,
}: ConfirmActionButtonProps) {
    const classes = toneClasses[tone];
    const activeConfirmIcon = confirmIcon ?? <AlertTriangle className="size-5" aria-hidden="true" />;

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        "focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition disabled:cursor-not-allowed disabled:opacity-40",
                        classes.triggerHover,
                        triggerClassName,
                    )}
                    disabled={disabled}
                    title={disabled ? disabledTitle : triggerTitle}
                >
                    {triggerIcon}
                    <span className="sr-only">
                        {triggerTitle} {itemName}
                    </span>
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=closed]:animate-[mobile-menu-overlay-out_180ms_ease-in] data-[state=open]:animate-[mobile-menu-overlay-in_180ms_ease-out]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] w-[min(440px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 shadow-2xl shadow-black/45 outline-none">
                    <div className="flex items-start justify-between gap-4">
                        <span
                            className={cn(
                                "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border",
                                classes.badge,
                            )}
                        >
                            {activeConfirmIcon}
                        </span>
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="focus-ring inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                                aria-label="Fermer la confirmation"
                            >
                                <X className="size-4" aria-hidden="true" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <Dialog.Title className="mt-4 text-h3 text-[color:var(--color-text-default)]">
                        {confirmTitle}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        {confirmDescription}
                    </Dialog.Description>

                    <form action={action} className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <input type="hidden" name="id" value={id} />
                        <Dialog.Close asChild>
                            <Button type="button" variant="secondary" size="sm">
                                Annuler
                            </Button>
                        </Dialog.Close>
                        <Button
                            type="submit"
                            variant="solid"
                            tone={tone === "neutral" ? "info" : tone}
                            size="sm"
                            iconLeft={confirmIcon}
                        >
                            {confirmLabel}
                        </Button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
