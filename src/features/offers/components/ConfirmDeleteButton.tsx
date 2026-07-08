"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/components/ui/forms/shared";

type ConfirmDeleteButtonProps = {
    action: (formData: FormData) => void | Promise<void>;
    confirmDescription: string;
    confirmTitle: string;
    disabled?: boolean;
    disabledTitle?: string;
    id: string;
    itemName: string;
    triggerClassName?: string;
};

export function ConfirmDeleteButton({
    action,
    confirmDescription,
    confirmTitle,
    disabled = false,
    disabledTitle,
    id,
    itemName,
    triggerClassName,
}: ConfirmDeleteButtonProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        "focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-danger-solid)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40",
                        triggerClassName,
                    )}
                    disabled={disabled}
                    title={disabled ? disabledTitle : "Supprimer"}
                >
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Supprimer {itemName}</span>
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=closed]:animate-[mobile-menu-overlay-out_180ms_ease-in] data-[state=open]:animate-[mobile-menu-overlay-in_180ms_ease-out]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[color:var(--color-danger-border)] bg-[var(--color-surface-default)] p-5 shadow-2xl shadow-black/45 outline-none">
                    <div className="flex items-start justify-between gap-4">
                        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[color:var(--color-danger-text)]">
                            <AlertTriangle className="size-5" aria-hidden="true" />
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
                            tone="danger"
                            size="sm"
                            iconLeft={<Trash2 className="size-4" aria-hidden="true" />}
                        >
                            Supprimer
                        </Button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
