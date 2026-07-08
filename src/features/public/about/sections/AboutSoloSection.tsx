import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { AboutPageContent } from "@/content/about";

type AboutSoloSectionProps = {
    content: AboutPageContent["solo"];
};

/**
 * Le format solo assumé — le ton différenciant de la page : ce que le
 * petit format change concrètement pour le client, puis les passerelles
 * vers la méthode (le cadre qui sécurise) et les réalisations (la
 * preuve). L'appel final est porté par la bande CTA du footer.
 */
export function AboutSoloSection({ content }: AboutSoloSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
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

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 lg:gap-5">
                {content.gains.map((gain) => (
                    <li
                        key={gain.title}
                        className="flex flex-col gap-2 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6"
                    >
                        <span className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                            {gain.title}
                        </span>
                        <span className="text-body-small text-[color:var(--color-text-muted)]">
                            {gain.description}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10">
                <Button
                    href={content.methodAction.href}
                    variant="secondary"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    className="w-full sm:w-fit"
                >
                    {content.methodAction.label}
                </Button>
                <Button
                    href={content.projectsAction.href}
                    variant="ghost"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    className="w-full sm:w-fit"
                >
                    {content.projectsAction.label}
                </Button>
            </div>
        </Section>
    );
}
