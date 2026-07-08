import type { ReactNode } from "react";

/**
 * Gabarit d'une section de la page design : titre display, note d'usage,
 * contenu sur surface neutre pour juger les composants sans distraction.
 */
export function DesignSection({
    children,
    note,
    title,
}: {
    children: ReactNode;
    note?: string;
    title: string;
}) {
    return (
        <section className="min-w-0 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-deep)] p-4 md:p-6">
            <div className="mb-5 flex flex-col gap-1">
                <h2 className="text-h3 text-[color:var(--color-text-default)]">
                    {title}
                </h2>
                {note ? (
                    <p className="max-w-[720px] text-body-small text-[color:var(--color-text-subtle)]">
                        {note}
                    </p>
                ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-6">{children}</div>
        </section>
    );
}

/** Sous-bloc étiqueté d'une section (une variante, un état). */
export function DesignSpecimen({
    children,
    label,
}: {
    children: ReactNode;
    label: string;
}) {
    return (
        <div className="min-w-0">
            <p className="mb-2.5 text-caption uppercase tracking-[0.08em] text-[color:var(--color-text-subtle)]">
                {label}
            </p>
            {children}
        </div>
    );
}
