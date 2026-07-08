import { ArrowLeft, Route, ShieldCheck, Wand2 } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui";
import type { LoginPageContent, LoginPromiseIcon } from "@/content/auth";

type LoginPromiseSectionProps = {
    content: LoginPageContent["promise"];
};

/** Icônes des repères de réassurance (le contenu reste sérialisable). */
const promiseIcons: Record<LoginPromiseIcon, ComponentType<{ className?: string }>> = {
    shield: ShieldCheck,
    wand: Wand2,
    route: Route,
};

/**
 * Colonne de gauche du split-screen : la promesse de l'espace privé.
 * Sur mobile elle reste compacte (marque + titre + accroche) ; les repères
 * détaillés n'apparaissent qu'à partir de `lg` pour ne pas repousser le
 * formulaire sous la ligne de flottaison (action principale au pouce).
 */
export function LoginPromiseSection({ content }: LoginPromiseSectionProps) {
    return (
        <section className="relative flex flex-col justify-between gap-8 overflow-hidden border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-main)] bg-[image:var(--gradient-hero)] px-6 pt-6 pb-8 lg:min-h-[100svh] lg:border-b-0 lg:border-r lg:px-12 lg:pt-12 lg:pb-12">
            <Button
                href={content.backHref}
                variant="ghost"
                size="sm"
                iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                className="w-fit"
            >
                {content.backLabel}
            </Button>

            <div className="flex flex-col gap-4 lg:gap-5">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] text-[color:var(--color-action-default)]">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h1 className="max-w-[14ch] text-balance text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.08] tracking-[-0.02em]">
                    {content.titleBefore}
                    <em className="bg-[linear-gradient(105deg,var(--color-decor-gold),var(--color-action-default))] bg-clip-text pr-1 italic text-transparent">
                        {content.titleAccent}
                    </em>
                    {content.titleAfter}
                </h1>
                <p className="max-w-[46ch] text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <ul className="hidden flex-col gap-5 lg:flex">
                {content.points.map((point) => {
                    const Icon = promiseIcons[point.icon];

                    return (
                        <li key={point.title} className="flex items-start gap-4">
                            <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] text-[color:var(--color-decor-gold)]">
                                <Icon className="size-4" />
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="text-body font-semibold text-[color:var(--color-text-default)]">
                                    {point.title}
                                </p>
                                <p className="text-body-small text-[color:var(--color-text-muted)]">
                                    {point.description}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
