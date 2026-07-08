import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/components/ui/forms/shared";

export type PageHeaderVariant = "public" | "client" | "admin";

export type PageHeaderProps = {
    /** Sur-titre court en capitales (« Cockpit projet », « Espace client »). */
    eyebrow: string;
    title: string;
    description?: string;
    /** Boutons ou raccourcis, alignés à droite en desktop. */
    actions?: ReactNode;
    /** Lien de remontée (« Tous les projets »), affiché au-dessus du titre. */
    backHref?: string;
    backLabel?: string;
    /** Zone libre sous l'en-tête (métriques, stepper, filtres). */
    children?: ReactNode;
    /**
     * public = ample et séducteur, client = chaleureux et rassurant,
     * admin = dense et efficace. Mêmes fondations, densités différentes.
     */
    variant?: PageHeaderVariant;
    className?: string;
};

const variantSurfaceClasses: Record<PageHeaderVariant, string> = {
    public: "rounded-panel px-5 py-8 md:px-8 md:py-12",
    client: "rounded-panel p-5 md:p-8",
    admin: "rounded-card p-4 md:p-5",
};

const variantTitleClasses: Record<PageHeaderVariant, string> = {
    public: "text-h1",
    client: "text-h2",
    admin: "text-h3",
};

/**
 * En-tête de page unifié des trois territoires. Toujours : eyebrow or,
 * titre display, description courte — la page répond d'abord à
 * « où suis-je, qu'est-ce que je peux faire ici ».
 */
export function PageHeader({
    actions,
    backHref,
    backLabel,
    children,
    className,
    description,
    eyebrow,
    title,
    variant = "admin",
}: PageHeaderProps) {
    return (
        <header
            className={cn(
                "relative isolate min-w-0 overflow-hidden border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] shadow-elevation-1",
                variantSurfaceClasses[variant],
                className,
            )}
        >
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-hero)]"
                aria-hidden="true"
            />
            {backHref ? (
                <Link
                    href={backHref}
                    className="focus-ring -my-2.5 mb-0.5 inline-flex min-h-11 items-center gap-1.5 rounded-full text-label text-[color:var(--color-text-muted)] transition-colors duration-150 ease-standard hover:text-[color:var(--color-text-default)]"
                >
                    <ArrowLeft className="size-3.5" aria-hidden="true" />
                    {backLabel ?? "Retour"}
                </Link>
            ) : null}
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div
                    className={cn(
                        "flex min-w-0 flex-col",
                        variant === "admin" ? "gap-1.5" : "gap-2.5",
                    )}
                >
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        {eyebrow}
                    </p>
                    <h1
                        className={cn(
                            "max-w-[26ch] text-balance text-[color:var(--color-text-default)]",
                            variantTitleClasses[variant],
                        )}
                    >
                        {title}
                    </h1>
                    {description ? (
                        <p
                            className={cn(
                                "max-w-[640px] text-[color:var(--color-text-muted)]",
                                variant === "public"
                                    ? "text-body"
                                    : "text-body-small",
                            )}
                        >
                            {description}
                        </p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
                        {actions}
                    </div>
                ) : null}
            </div>
            {children ? <div className="mt-5 min-w-0">{children}</div> : null}
        </header>
    );
}
