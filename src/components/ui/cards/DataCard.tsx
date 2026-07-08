import Link from "next/link";
import { MoveDownRight, MoveRight, MoveUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/components/ui/forms/shared";

export type DataCardTrendDirection = "up" | "down" | "flat";

export type DataCardTrend = {
    direction: DataCardTrendDirection;
    /** Ex. « +2 cette semaine » — déjà formaté. */
    label: string;
    /** Un « down » peut être une bonne nouvelle (blocages) : ton découplé. */
    positive?: boolean;
};

export type DataCardProps = {
    /** Libellé de la métrique, court et sans jargon. */
    label: string;
    /** Valeur déjà formatée (nombre, montant, durée). */
    value: string;
    hint?: string;
    icon?: ReactNode;
    trend?: DataCardTrend;
    /** accent = métrique à l'honneur (une seule par rangée). */
    tone?: "default" | "accent";
    /** Rend la carte cliquable vers l'écran de détail. */
    href?: string;
    className?: string;
};

const trendIcons: Record<DataCardTrendDirection, typeof MoveUpRight> = {
    up: MoveUpRight,
    down: MoveDownRight,
    flat: MoveRight,
};

/**
 * Carte métrique du pilotage : un chiffre en display, une tendance,
 * un chemin vers le détail. Scannable en une seconde.
 */
export function DataCard({
    className,
    hint,
    href,
    icon,
    label,
    tone = "default",
    trend,
    value,
}: DataCardProps) {
    const isAccent = tone === "accent";
    const TrendIcon = trend ? trendIcons[trend.direction] : null;

    const body = (
        <>
            <div className="flex items-center justify-between gap-3">
                <p
                    className={cn(
                        "text-label uppercase",
                        isAccent
                            ? "text-[color:var(--color-action-default)]"
                            : "text-[color:var(--color-text-muted)]",
                    )}
                >
                    {label}
                </p>
                {icon ? (
                    <span
                        className={cn(
                            "inline-flex size-8 shrink-0 items-center justify-center rounded-control border [&>svg]:size-4",
                            isAccent
                                ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                                : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-raised)] text-[color:var(--color-decor-gold)]",
                        )}
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                ) : null}
            </div>
            <p className="mt-4 font-[family-name:var(--font-display)] text-h1 leading-none text-[color:var(--color-text-default)]">
                {value}
            </p>
            {trend || hint ? (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {trend && TrendIcon ? (
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 text-caption font-medium",
                                trend.positive === undefined
                                    ? "text-[color:var(--color-text-muted)]"
                                    : trend.positive
                                      ? "text-[color:var(--color-success-text)]"
                                      : "text-[color:var(--color-danger-text)]",
                            )}
                        >
                            <TrendIcon className="size-3.5" aria-hidden="true" />
                            {trend.label}
                        </span>
                    ) : null}
                    {hint ? (
                        <span className="text-caption text-[color:var(--color-text-subtle)]">
                            {hint}
                        </span>
                    ) : null}
                </div>
            ) : null}
        </>
    );

    const surfaceClasses = cn(
        "block rounded-card border p-4 md:p-5",
        isAccent
            ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] shadow-elevation-1"
            : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]",
        href &&
            "focus-ring transition-[transform,box-shadow,border-color] duration-150 ease-standard hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] hover:shadow-elevation-2 active:translate-y-0 motion-reduce:hover:translate-y-0",
        className,
    );

    if (href) {
        return (
            <Link href={href} className={surfaceClasses}>
                {body}
            </Link>
        );
    }

    return <div className={surfaceClasses}>{body}</div>;
}
