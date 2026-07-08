import { Section } from "@/components/layout";
import type { RealisationsProjectContent } from "@/content/realisations";

type ProjectContextSectionProps = {
    content: RealisationsProjectContent["context"];
};

/**
 * Le contexte : la situation de départ et les contraintes à concilier, puis
 * la tension centrale que le projet devait résoudre.
 */
export function ProjectContextSection({ content }: ProjectContextSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14">
                <div className="flex flex-col gap-4">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        03 — Le contexte
                    </p>
                    <h2 className="text-balance">{content.title}</h2>
                    <p className="text-body text-[color:var(--color-text-muted)]">
                        {content.description}
                    </p>
                    <p className="mt-2 border-l-2 border-[color:var(--color-decor-gold)] pl-4 text-body-small text-[color:var(--color-text-default)]">
                        {content.message}
                    </p>
                </div>

                <ul className="flex flex-col gap-2.5">
                    {content.items.map((item) => (
                        <li
                            key={item}
                            className="flex items-start gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4"
                        >
                            <span
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-decor-gold)]"
                                aria-hidden="true"
                            />
                            <span className="text-body-small text-[color:var(--color-text-muted)]">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
}
