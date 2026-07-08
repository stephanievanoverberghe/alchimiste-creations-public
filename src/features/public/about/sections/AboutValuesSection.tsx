import { Section } from "@/components/layout";
import type { AboutPageContent } from "@/content/about";

type AboutValuesSectionProps = {
    content: AboutPageContent["values"];
};

/**
 * Les valeurs incarnées : la boussole du studio (« un bon site est
 * beau, oui — mais surtout évident ») en panneau ancré, et les cinq
 * repères numérotés formulés en effets concrets dans le site livré,
 * pas en mots d'agence.
 */
export function AboutValuesSection({ content }: AboutValuesSectionProps) {
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

            <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <div className="relative overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/45 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-6 shadow-elevation-2 md:p-8">
                        <span
                            className="absolute inset-y-6 left-0 w-0.5 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                            aria-hidden="true"
                        />
                        <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.message.label}
                        </p>
                        <p className="mt-3 font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                            {content.message.title}
                        </p>
                        <p className="mt-3 max-w-[440px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.message.description}
                        </p>
                    </div>
                </div>

                <ol className="flex flex-col">
                    {content.items.map((value, index) => (
                        <li
                            key={value.title}
                            className="flex gap-4 border-t border-[color:var(--color-border-strong)] py-5 first:border-t-0 first:pt-0 last:pb-0 md:gap-6"
                        >
                            <span
                                className="font-[family-name:var(--font-display)] text-h3 italic leading-none text-[color:var(--color-decor-gold)]"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="flex min-w-0 flex-col gap-1.5">
                                <span className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                                    {value.title}
                                </span>
                                <span className="max-w-[520px] text-body-small text-[color:var(--color-text-muted)]">
                                    {value.description}
                                </span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
}
