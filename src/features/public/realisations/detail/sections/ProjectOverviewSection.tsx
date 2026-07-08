import { Section } from "@/components/layout";
import type { RealisationsProjectContent } from "@/content/realisations";

type ProjectOverviewSectionProps = {
    content: RealisationsProjectContent["overview"];
};

/**
 * Le projet en une phrase : l'intention d'ensemble avant d'entrer dans le
 * détail de l'étude de cas. Ouvre le récit.
 */
export function ProjectOverviewSection({ content }: ProjectOverviewSectionProps) {
    return (
        <Section spacing="lg">
            <div className="flex max-w-[760px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    01 — Le projet
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-panel border border-[color:var(--color-decor-gold)]/40 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-5 md:mt-8 md:p-6">
                <span
                    className="mt-1 h-8 w-0.5 shrink-0 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                    aria-hidden="true"
                />
                <p className="max-w-[620px] font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                    {content.message}
                </p>
            </div>
        </Section>
    );
}
