"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/components/ui/forms/shared";

import {
    feedbackIcons,
    feedbackToneClasses,
    type FeedbackTone,
} from "./shared";

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
    autoDismiss?: boolean;
    children: ReactNode;
    dismissible?: boolean;
    durationMs?: number;
    placement?: "bottom-right" | "inline" | "top";
    showProgress?: boolean;
    title: string;
    tone?: Exclude<FeedbackTone, "neutral">;
};

export function Toast({
    autoDismiss = false,
    children,
    className,
    dismissible = false,
    durationMs = 6000,
    placement = "inline",
    showProgress = false,
    title,
    tone = "info",
    ...props
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const toneClasses = feedbackToneClasses[tone];
    const Icon = feedbackIcons[tone];

    useEffect(() => {
        if (!autoDismiss) return;

        const timeoutId = window.setTimeout(() => {
            setIsVisible(false);
        }, durationMs);

        return () => window.clearTimeout(timeoutId);
    }, [autoDismiss, durationMs]);

    useEffect(() => {
        if (!showProgress) return;

        const frameId = window.requestAnimationFrame(() => {
            setIsRunning(true);
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [showProgress]);

    if (!isVisible) return null;

    const toast = (
        <div
            className={cn(
                "relative grid min-h-[72px] w-full grid-cols-[auto_1fr_auto] items-start gap-3 overflow-hidden rounded-2xl border px-4 py-3 shadow-lg shadow-black/15",
                placement === "top"
                    ? "pointer-events-auto max-w-[720px] px-5 py-4"
                    : placement === "bottom-right"
                        ? "pointer-events-auto max-w-[420px] px-5 py-4"
                    : "md:max-w-[320px]",
                toneClasses.frame,
                className,
            )}
            role={tone === "danger" ? "alert" : "status"}
            {...props}
        >
            <span
                className={cn(
                    "mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full border [&>svg]:size-3.5",
                    toneClasses.icon,
                )}
                aria-hidden="true"
            >
                <Icon />
            </span>

            <div className="min-w-0">
                <p className={cn("text-label", toneClasses.title)}>{title}</p>
                <div className={cn("mt-1 text-caption", toneClasses.body)}>
                    {children}
                </div>
            </div>

            {dismissible ? (
                <button
                    className={cn(
                        "inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/5 focus-ring",
                        toneClasses.icon,
                    )}
                    type="button"
                    aria-label="Fermer la notification"
                    onClick={() => setIsVisible(false)}
                >
                    <X className="size-3.5" aria-hidden="true" />
                </button>
            ) : null}

            {showProgress ? (
                <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1 overflow-hidden"
                    aria-hidden="true"
                >
                    <span
                        className={cn(
                            "block h-full origin-left bg-current opacity-70 transition-transform ease-linear",
                            toneClasses.title,
                        )}
                        style={{
                            transform: isRunning ? "scaleX(0)" : "scaleX(1)",
                            transitionDuration: `${durationMs}ms`,
                        }}
                    />
                </span>
            ) : null}
        </div>
    );

    if (placement === "top") {
        return (
            <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-[calc(env(safe-area-inset-top)+1rem)] md:pt-[calc(env(safe-area-inset-top)+1.5rem)]">
                {toast}
            </div>
        );
    }

    if (placement === "bottom-right") {
        return (
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:inset-x-auto md:right-0 md:justify-end md:pr-6 md:pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                {toast}
            </div>
        );
    }

    return toast;
}
