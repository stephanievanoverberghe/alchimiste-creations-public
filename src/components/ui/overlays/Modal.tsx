"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/primitives/Button";
import { cn } from "@/components/ui/forms/shared";

type ModalSize = "md" | "lg" | "xl";

type ModalProps = {
    children: ReactNode;
    description?: string;
    eyebrow?: string;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    size?: ModalSize;
    title: string;
    trigger: ReactNode;
};

const modalSizeClasses: Record<ModalSize, string> = {
    md: "w-[min(640px,calc(100vw-32px))]",
    lg: "w-[min(820px,calc(100vw-32px))]",
    xl: "w-[min(1040px,calc(100vw-32px))]",
};

export function Modal({
    children,
    description,
    eyebrow,
    onOpenChange,
    open,
    size = "lg",
    title,
    trigger,
}: ModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className={cn(
                        "fixed left-1/2 top-1/2 z-[110] max-h-[min(820px,calc(100vh-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-[color:var(--color-border-subtle)] bg-[linear-gradient(180deg,var(--color-surface-raised),var(--color-surface-default))] shadow-2xl shadow-black/50 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        modalSizeClasses[size],
                    )}
                >
                    <header className="flex items-start justify-between gap-5 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-5 py-4">
                        <div className="min-w-0">
                            {eyebrow ? (
                                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                    {eyebrow}
                                </p>
                            ) : null}
                            <Dialog.Title className="mt-1 text-h3 text-[color:var(--color-text-default)]">
                                {title}
                            </Dialog.Title>
                            {description ? (
                                <Dialog.Description className="mt-1 max-w-[640px] text-body-small text-[color:var(--color-text-muted)]">
                                    {description}
                                </Dialog.Description>
                            ) : null}
                        </div>
                        <Dialog.Close asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="size-10 border-[color:var(--color-border-subtle)] bg-[var(--color-bg-deep)] px-0 text-[color:var(--color-text-default)]"
                                aria-label="Fermer"
                            >
                                <X className="size-5" aria-hidden="true" />
                            </Button>
                        </Dialog.Close>
                    </header>

                    <div className="max-h-[calc(min(820px,100vh)-150px)] overflow-y-auto p-5">
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
