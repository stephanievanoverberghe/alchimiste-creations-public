import type { ReactNode } from "react";
import { FileCheck2, UserRound } from "lucide-react";

import { ResponsiveFillImage, Section } from "@/components/layout";
import type { MethodPageContent } from "@/content/method";

type MethodJourneyContent = MethodPageContent["journey"];
type MethodChapter = MethodJourneyContent["chapters"][number];
type MethodStep = MethodChapter["steps"][number];

type MethodJourneySectionProps = {
    content: MethodJourneyContent;
};

/**
 * Le parcours, cœur de la page : une timeline verticale unique (du mobile
 * au desktop) regroupée par temps. Chaque temps est un chapitre — marqueur
 * en matière, collé au scroll sur desktop — et chaque étape un nœud du fil,
 * numéroté en continu (01 → 07), avec son livrable concret et le rôle du
 * client. C'est la vitrine publique du Project OS.
 */
export function MethodJourneySection({ content }: MethodJourneySectionProps) {
    const chapters = content.chapters.map((chapter, index) => ({
        chapter,
        index,
        startNumber: content.chapters
            .slice(0, index)
            .reduce((total, previous) => total + previous.steps.length, 0),
    }));

    return (
        <Section
            id="parcours"
            spacing="lg"
            className="scroll-mt-24 border-t border-[color:var(--color-border-subtle)]"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-10 flex flex-col gap-10 lg:mt-16 lg:gap-16">
                {chapters.map(({ chapter, index, startNumber }) => (
                    <div
                        key={chapter.verb}
                        className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-12"
                    >
                        <ChapterMarker chapter={chapter} index={index} />
                        <ol className="relative flex flex-col gap-6 md:gap-8">
                            <span
                                className="pointer-events-none absolute bottom-3 left-[15px] top-3 w-px bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))] opacity-70"
                                aria-hidden="true"
                            />
                            {chapter.steps.map((step, stepIndex) => (
                                <StepNode
                                    key={step.title}
                                    step={step}
                                    number={startNumber + stepIndex + 1}
                                    deliverableLabel={content.deliverableLabel}
                                    roleLabel={content.roleLabel}
                                />
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function ChapterMarker({
    chapter,
    index,
}: {
    chapter: MethodChapter;
    index: number;
}) {
    return (
        <div className="relative isolate flex min-h-[160px] flex-col justify-end overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/40 p-5 shadow-elevation-1 lg:sticky lg:top-24 lg:min-h-[300px] lg:p-6">
            <ResponsiveFillImage
                image={chapter.image}
                sizes="(min-width: 1024px) 300px, 100vw"
                className="z-0 object-cover"
            />
            <span
                className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0.30)_0%,rgba(15,14,11,0.62)_52%,rgba(15,14,11,0.94)_100%)]"
                aria-hidden="true"
            />
            <span
                className="absolute inset-x-5 top-0 z-20 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)] lg:inset-x-6"
                aria-hidden="true"
            />

            <div className="relative z-20 flex flex-col gap-2">
                <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                    {`Temps ${String(index + 1).padStart(2, "0")}`}
                </span>
                <span className="font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                    {chapter.verb}
                </span>
                <span className="max-w-[280px] text-body-small text-[color:var(--color-text-muted)]">
                    {chapter.summary}
                </span>
            </div>
        </div>
    );
}

function StepNode({
    step,
    number,
    deliverableLabel,
    roleLabel,
}: {
    step: MethodStep;
    number: number;
    deliverableLabel: string;
    roleLabel: string;
}) {
    return (
        <li className="relative flex gap-4">
            <span
                className="relative z-10 mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/50 bg-[var(--color-surface-default)] font-[family-name:var(--font-display)] text-body-small italic text-[color:var(--color-decor-gold)]"
                aria-hidden="true"
            >
                {String(number).padStart(2, "0")}
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-3 pb-1">
                <div className="flex flex-col gap-1.5">
                    <h3 className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                        {step.title}
                    </h3>
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {step.description}
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <StepAside
                        icon={
                            <FileCheck2 className="size-4" aria-hidden="true" />
                        }
                        label={deliverableLabel}
                        text={step.deliverable}
                    />
                    <StepAside
                        icon={
                            <UserRound className="size-4" aria-hidden="true" />
                        }
                        label={roleLabel}
                        text={step.role}
                    />
                </div>
            </div>
        </li>
    );
}

function StepAside({
    icon,
    label,
    text,
}: {
    icon: ReactNode;
    label: string;
    text: string;
}) {
    return (
        <div className="flex flex-col gap-1.5 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <span className="flex items-center gap-2 text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                {icon}
                {label}
            </span>
            <span className="text-body-small text-[color:var(--color-text-default)]">
                {text}
            </span>
        </div>
    );
}
