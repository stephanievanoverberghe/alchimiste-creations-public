import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container, Section } from "@/components/layout";
import type { LegalPageContent, LegalSection } from "@/content/legal";

type LegalPageProps = {
    content: LegalPageContent;
};

/**
 * Gabarit commun des pages légales — table rase, pensé pour la lecture :
 * héros typographique sobre avec date de mise à jour, sommaire ancré collant
 * et sections en récit éditorial numéroté (liserés fins plutôt que boîtes).
 * Un seul fichier pour les 5 pages légales.
 */
export function LegalPage({ content }: LegalPageProps) {
    return (
        <div className="flex flex-col">
            <Section
                spacing="none"
                className="relative overflow-hidden border-b border-[color:var(--color-border-subtle)] bg-[radial-gradient(circle_at_18%_-12%,rgba(255,232,184,0.08),transparent_44%),var(--color-bg-main)]"
            >
                <Container
                    width="content"
                    className="pt-28 pb-10 md:pt-32 md:pb-14 lg:pt-36"
                >
                    <div className="flex max-w-[760px] flex-col gap-5">
                        <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                            {content.hero.eyebrow}
                        </p>

                        <h1 className="anim-rise-2 text-balance text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08] tracking-[-0.02em]">
                            {content.hero.title}
                        </h1>

                        <p className="anim-rise-3 max-w-[620px] text-body text-[color:var(--color-text-muted)]">
                            {content.hero.description}
                        </p>

                        <p className="anim-rise-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] px-4 py-1.5 text-caption text-[color:var(--color-text-muted)]">
                            <span
                                className="size-1.5 rounded-full bg-[var(--color-decor-gold)]"
                                aria-hidden="true"
                            />
                            Dernière mise à jour : {content.hero.lastUpdated}
                        </p>
                    </div>
                </Container>
            </Section>

            <Section spacing="lg">
                <Container
                    width="content"
                    className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-14"
                >
                    <LegalSummary sections={content.sections} />

                    <div className="flex min-w-0 flex-col">
                        {content.sections.map((section, index) => (
                            <LegalSectionBlock
                                key={section.title}
                                id={getSectionId(index)}
                                section={section}
                                index={index}
                            />
                        ))}
                    </div>
                </Container>
            </Section>
        </div>
    );
}

function LegalSummary({ sections }: { sections: readonly LegalSection[] }) {
    return (
        <aside className="lg:sticky lg:top-28">
            <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                Sommaire
            </p>
            <nav
                className="mt-4 flex flex-col border-l border-[color:var(--color-border-subtle)]"
                aria-label="Sommaire"
            >
                {sections.map((section, index) => (
                    <Link
                        key={section.title}
                        href={`#${getSectionId(index)}`}
                        className="focus-ring -ml-px border-l-2 border-transparent py-2 pl-4 text-body-small text-[color:var(--color-text-muted)] no-underline transition-colors duration-200 ease-standard hover:border-[color:var(--color-decor-gold)] hover:text-[color:var(--color-text-default)]"
                    >
                        {section.title}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

function LegalSectionBlock({
    id,
    index,
    section,
}: {
    id: string;
    index: number;
    section: LegalSection;
}) {
    return (
        <section
            id={id}
            className="scroll-mt-28 border-t border-[color:var(--color-border-subtle)] py-8 first:border-t-0 first:pt-0 md:py-10"
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-baseline gap-4">
                    <span
                        className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-decor-gold)]/45"
                        aria-hidden="true"
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-balance font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                        {section.title}
                    </h2>
                </div>

                {section.description ? (
                    <p className="max-w-[720px] text-body text-[color:var(--color-text-muted)]">
                        {section.description}
                    </p>
                ) : null}

                {section.items ? (
                    <ul className="grid gap-2.5">
                        {section.items.map((item) => (
                            <li
                                key={item}
                                className="flex gap-3 text-body-small text-[color:var(--color-text-muted)]"
                            >
                                <span
                                    className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-decor-gold)]"
                                    aria-hidden="true"
                                />
                                <span className="min-w-0">{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : null}

                {section.links ? (
                    <div className="flex flex-wrap gap-3">
                        {section.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] px-4 text-body-small font-semibold text-[color:var(--color-action-default)] no-underline transition-[border-color,color] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)] hover:text-[color:var(--color-action-hover)]"
                            >
                                {link.label}
                                <ArrowUpRight
                                    className="size-4 transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                                    aria-hidden="true"
                                />
                            </Link>
                        ))}
                    </div>
                ) : null}

                {section.note ? (
                    <p className="max-w-[720px] border-l-2 border-[color:var(--color-decor-gold)]/50 bg-[var(--color-surface-default)] px-4 py-3 text-body-small text-[color:var(--color-text-muted)]">
                        {section.note}
                    </p>
                ) : null}
            </div>
        </section>
    );
}

function getSectionId(index: number) {
    return `section-${index + 1}`;
}
