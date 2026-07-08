import { ResponsiveFillImage, Section } from "@/components/layout";
import type { AboutPageContent } from "@/content/about";

type AboutPersonSectionProps = {
    content: AboutPageContent["person"];
};

/**
 * La personne derrière le studio : portrait grand format légendé
 * (« une interlocutrice, du premier échange à la mise en ligne ») face
 * au pari du studio — quand la même personne dessine et développe,
 * rien ne se perd. C'est la section « l'humain » du plan A7.
 */
export function AboutPersonSection({ content }: AboutPersonSectionProps) {
    return (
        <Section id={content.id} className="scroll-mt-24" spacing="lg">
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-12">
                <div className="relative isolate min-h-[440px] overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/50 shadow-elevation-2 md:min-h-[560px]">
                    <ResponsiveFillImage
                        image={content.portrait.image}
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="z-0 object-cover object-[50%_45%]"
                    />
                    <span
                        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0)_0%,rgba(15,14,11,0.12)_38%,rgba(15,14,11,0.72)_70%,rgba(15,14,11,0.95)_100%)]"
                        aria-hidden="true"
                    />
                    <span
                        className="absolute inset-x-7 top-0 z-20 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)]"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2.5 p-6 md:p-8">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.portrait.label}
                        </span>
                        <p className="max-w-[380px] font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                            {content.portrait.title}
                        </p>
                        <p className="max-w-[400px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.portrait.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <div className="relative overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/45 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-6 shadow-elevation-2 md:p-8">
                        <span
                            className="absolute inset-y-6 left-0 w-0.5 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                            aria-hidden="true"
                        />
                        <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.insight.label}
                        </p>
                        <p className="mt-3 font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                            {content.insight.title}
                        </p>
                        <p className="mt-3 max-w-[460px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.insight.description}
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
