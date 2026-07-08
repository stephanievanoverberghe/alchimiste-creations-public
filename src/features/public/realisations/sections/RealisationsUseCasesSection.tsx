import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { ResponsiveFillImage, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { RealisationsPageContent } from "@/content/realisations";

type RealisationsUseCasesSectionProps = {
    content: RealisationsPageContent["useCases"];
};

type UseCase = RealisationsPageContent["useCases"]["cases"][number];

/**
 * Trouver le bon format : la galerie sert à repérer son besoin, pas à
 * copier un modèle. Cette section traduit ce que le visiteur a vu en
 * portes d'entrée vers les offres. Dernière section avant la bande CTA du
 * footer.
 */
export function RealisationsUseCasesSection({
    content,
}: RealisationsUseCasesSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
                <div className="flex max-w-[640px] flex-col gap-3">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        {content.eyebrow}
                    </p>
                    <h2 className="text-balance">{content.title}</h2>
                    <p className="max-w-[540px] text-body-small text-[color:var(--color-text-muted)]">
                        {content.description}
                    </p>
                </div>
                <Button
                    href={content.action.href}
                    variant="ghost"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    className="shrink-0 self-start md:self-end"
                >
                    {content.action.label}
                </Button>
            </div>

            <ul className="mt-8 grid gap-4 md:mt-12 sm:grid-cols-2 lg:gap-6">
                {content.cases.map((useCase) => (
                    <li key={useCase.title}>
                        <UseCaseCard useCase={useCase} />
                    </li>
                ))}
            </ul>
        </Section>
    );
}

function UseCaseCard({ useCase }: { useCase: UseCase }) {
    return (
        <Link
            href={useCase.href}
            className="focus-ring group flex h-full flex-col overflow-hidden rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] no-underline shadow-elevation-1 transition-[border-color,box-shadow] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/55 hover:shadow-elevation-2"
        >
            <div className="relative isolate h-40 overflow-hidden">
                <ResponsiveFillImage
                    image={useCase.image}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="z-0 object-cover transition-transform duration-500 ease-standard group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                />
                <span
                    className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0.28)_0%,rgba(15,14,11,0.58)_100%)]"
                    aria-hidden="true"
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                <h3 className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)] transition-colors duration-200 group-hover:text-[color:var(--color-action-default)]">
                    {useCase.title}
                </h3>
                <p className="text-body-small text-[color:var(--color-text-muted)]">
                    {useCase.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-3 text-body-small font-semibold text-[color:var(--color-action-default)]">
                    {useCase.action}
                    <ArrowUpRight
                        className="size-4 transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                    />
                </span>
            </div>
        </Link>
    );
}
