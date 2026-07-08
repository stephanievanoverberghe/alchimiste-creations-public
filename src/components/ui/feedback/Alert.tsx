import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/primitives";
import { cn } from "@/components/ui/forms/shared";

import {
    feedbackIcons,
    feedbackToneClasses,
    type FeedbackTone,
} from "./shared";

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
    actionHref?: string;
    actionLabel?: string;
    children: ReactNode;
    title: string;
    tone?: FeedbackTone;
};

export function Alert({
    actionHref,
    actionLabel = "Voir détail",
    children,
    className,
    title,
    tone = "neutral",
    ...props
}: AlertProps) {
    const toneClasses = feedbackToneClasses[tone];
    const Icon = feedbackIcons[tone];

    return (
        <div
            className={cn(
                "grid gap-4 rounded-2xl border px-4 py-4 md:grid-cols-[1fr_auto] md:px-5",
                toneClasses.frame,
                className,
            )}
            role={tone === "danger" ? "alert" : "status"}
            {...props}
        >
            <div className="grid grid-cols-[auto_1fr] gap-3">
                <span
                    className={cn(
                        "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border [&>svg]:size-3.5",
                        toneClasses.icon,
                    )}
                    aria-hidden="true"
                >
                    <Icon />
                </span>
                <div className="min-w-0">
                    <p className={cn("text-body font-semibold", toneClasses.title)}>
                        {title}
                    </p>
                    <div className={cn("mt-1 text-body-small", toneClasses.body)}>
                        {children}
                    </div>
                </div>
            </div>

            {actionHref ? (
                <Button
                    href={actionHref}
                    variant="ghost"
                    size="sm"
                    className={cn("h-fit self-start px-0", toneClasses.action)}
                >
                    {actionLabel}
                </Button>
            ) : null}
        </div>
    );
}
