import { Section } from "@/components/layout";
import type { RealisationsPageContent } from "@/content/realisations";

type RealisationsTransparencySectionProps = {
    content: RealisationsPageContent["transparency"];
};

/**
 * Lecture honnête : les trois natures de projet (réalisation client,
 * démonstration personnelle, projet en refonte) expliquées avant la
 * galerie, pour que le visiteur sache exactement ce qu'il regarde. La
 * transparence est ici un argument, pas une contrainte.
 */
export function RealisationsTransparencySection({
    content,
}: RealisationsTransparencySectionProps) {
    return (
        <Section spacing="lg">
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <ol className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3 lg:gap-6">
                {content.statuses.map((status, index) => (
                    <li
                        key={status.title}
                        className="flex flex-col gap-3 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6"
                    >
                        <span
                            className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                            aria-hidden="true"
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                            {status.title}
                        </span>
                        <span className="text-body-small text-[color:var(--color-text-muted)]">
                            {status.description}
                        </span>
                    </li>
                ))}
            </ol>

            <div className="mt-6 flex items-start gap-3">
                <span
                    className="mt-1 h-8 w-0.5 shrink-0 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                    aria-hidden="true"
                />
                <p className="max-w-[620px] text-body-small text-[color:var(--color-text-muted)]">
                    {content.note}
                </p>
            </div>
        </Section>
    );
}
