import type { HTMLAttributes, ReactNode } from "react";

import { Badge } from "../primitives";

type MobileSlideProps = HTMLAttributes<HTMLElement> & {
    children: ReactNode;
};

export function MobileSlide({
    children,
    className,
    ...props
}: MobileSlideProps) {
    return (
        <article
            className={`relative isolate flex h-full min-h-[460px] flex-col gap-4 overflow-hidden rounded-3xl border border-[color:var(--color-action-default)] bg-[linear-gradient(145deg,var(--color-surface-raised)_0%,var(--color-surface-default)_58%,var(--color-action-subtle)_100%)] p-4 shadow-xl shadow-black/20 ${className ?? ""}`}
            {...props}
        >
            {children}
        </article>
    );
}

type MobileSlideLineProps = {
    className?: string;
};

export function MobileSlideLine({ className = "" }: MobileSlideLineProps) {
    return (
        <span
            className={`absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)] ${className}`}
            aria-hidden="true"
        />
    );
}

type MobileSlideNumberProps = {
    children: string;
    className?: string;
};

export function MobileSlideNumber({
    children,
    className = "opacity-10",
}: MobileSlideNumberProps) {
    return (
        <span
            className={`pointer-events-none absolute -right-3 top-8 z-0 text-[92px] font-black leading-none text-[color:var(--color-action-default)] ${className}`}
            aria-hidden="true"
        >
            {children}
        </span>
    );
}

type MobileSlideTopProps = {
    badge: string;
    icon: ReactNode;
    iconClassName?: string;
};

export function MobileSlideTop({
    badge,
    icon,
    iconClassName = "bg-[var(--color-surface-interactive)]",
}: MobileSlideTopProps) {
    return (
        <div className="relative z-10 flex items-start justify-between gap-4">
            <Badge className="w-fit">{badge}</Badge>

            <span
                className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-action-default)] ${iconClassName}`}
            >
                {icon}
            </span>
        </div>
    );
}

type MobileSlideTextProps = {
    description: string;
    eyebrow: string;
    title: string;
};

export function MobileSlideText({
    description,
    eyebrow,
    title,
}: MobileSlideTextProps) {
    return (
        <div className="relative z-10 flex flex-col gap-3">
            <span className="text-xs font-medium leading-4 tracking-[0.02em] uppercase text-[color:var(--color-decor-gold)]">
                {eyebrow}
            </span>
            <h3>{title}</h3>
            <p className="text-[color:var(--color-text-muted)]">{description}</p>
        </div>
    );
}
