import { ArrowUpRight } from "lucide-react";

import { Container, Section } from "@/components/layout";
import type { ProjectRequestPageContent } from "@/content/project-request";

import { ProjectRequestWizard } from "./ProjectRequestWizard";

type ProjectRequestJourneySectionProps = {
    content: ProjectRequestPageContent;
};

/**
 * Section qui accueille le wizard : intro courte, passerelle vers la page
 * contact pour les questions générales, puis le parcours guidé lui-même.
 */
export function ProjectRequestJourneySection({
    content,
}: ProjectRequestJourneySectionProps) {
    return (
        <Section id="demande" className="scroll-mt-24 md:scroll-mt-28" spacing="lg">
            <Container className="flex flex-col gap-8 lg:gap-10">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.5fr)] lg:items-end lg:gap-12">
                    <div className="flex max-w-[760px] flex-col gap-3">
                        <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                            {content.intro.eyebrow}
                        </p>
                        <h2 className="text-balance">{content.intro.title}</h2>
                        <p className="text-body text-[color:var(--color-text-muted)]">
                            {content.intro.description}
                        </p>
                    </div>

                    <a
                        href={content.wizard.contactFallback.href}
                        className="focus-ring group flex flex-col gap-2 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 no-underline shadow-elevation-1 transition-[border-color,box-shadow] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/55 hover:shadow-elevation-2 md:p-6"
                    >
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            Juste une question ?
                        </span>
                        <span className="text-body-small text-[color:var(--color-text-muted)]">
                            {content.wizard.contactFallback.label}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-2 text-body-small font-semibold text-[color:var(--color-action-default)]">
                            Aller au contact
                            <ArrowUpRight
                                className="size-4 transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                                aria-hidden="true"
                            />
                        </span>
                    </a>
                </div>

                <ProjectRequestWizard
                    confirmation={content.confirmation}
                    content={content.wizard}
                />
            </Container>
        </Section>
    );
}
