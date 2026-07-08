import { Minus } from "lucide-react";

import { Section } from "@/components/layout";
import type { OfferDetailPageContent } from "@/content/offers";

type OfferScopeSectionProps = {
    scope: OfferDetailPageContent["scope"];
    fallbackExcluded: OfferDetailPageContent["qualification"]["notAdapted"];
};

/**
 * Le périmètre : ce qui est inclus (découpé en temps de travail) ET ce qui
 * ne l'est pas. Dire le hors-cadre est un signal d'agence sérieuse — ça
 * évite les malentendus et cadre l'utile. Utilise le vrai « hors périmètre »
 * (`scope.excluded`) quand il existe ; sinon retombe sur les conditions
 * « pas le bon cadre si » de la qualification.
 */
export function OfferScopeSection({
    scope,
    fallbackExcluded,
}: OfferScopeSectionProps) {
    const hasRealExcluded = Boolean(scope.excluded?.length);
    const excludedItems = scope.excluded ?? fallbackExcluded.items;
    const excludedCaption = hasRealExcluded
        ? "Ce qui n'est pas inclus"
        : "Ce n'est pas le bon cadre si";

    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    03 — Le périmètre
                </p>
                <h2 className="text-balance">{scope.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {scope.note}
                </p>
            </div>

            <ol className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3 lg:gap-6">
                {scope.groups.map((group, index) => (
                    <li
                        key={group.title}
                        className="flex flex-col gap-4 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6"
                    >
                        <div className="flex items-baseline gap-3">
                            <span
                                className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                                {group.title}
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {group.items.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2.5 text-body-small text-[color:var(--color-text-muted)]"
                                >
                                    <span
                                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-decor-gold)]"
                                        aria-hidden="true"
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>

            <div className="mt-4 flex flex-col gap-4 rounded-panel border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.35)] p-5 md:p-6">
                <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {excludedCaption}
                </span>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                    {excludedItems.map((item) => (
                        <li
                            key={item}
                            className="flex items-start gap-2.5 text-body-small text-[color:var(--color-text-muted)]"
                        >
                            <Minus
                                className="mt-0.5 size-4 shrink-0 text-[color:var(--color-text-subtle)]"
                                aria-hidden="true"
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
}
