import { ArrowRight } from "lucide-react";

import { ResponsiveFillImage, Section } from "@/components/layout";
import type { MethodPageContent } from "@/content/method";

type MethodRolesSectionProps = {
    content: MethodPageContent["roles"];
};

/**
 * La collaboration : le portrait de la répartition — « tu gardes la
 * vision, le studio tient le cadre » — puis les deux colonnes de ce que
 * chacun apporte. Elle rassure sur le « avec toi, pas à ta place » après
 * le détail du parcours.
 */
export function MethodRolesSection({ content }: MethodRolesSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[640px] flex-col gap-3">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="max-w-[540px] text-body-small text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
                <div className="relative isolate min-h-[380px] overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/50 shadow-elevation-2 md:min-h-[460px]">
                    <ResponsiveFillImage
                        image={content.image}
                        sizes="(min-width: 1024px) 52vw, 100vw"
                        className="z-0 object-cover object-[50%_40%]"
                    />
                    <span
                        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0)_0%,rgba(15,14,11,0.14)_38%,rgba(15,14,11,0.74)_72%,rgba(15,14,11,0.95)_100%)]"
                        aria-hidden="true"
                    />
                    <span
                        className="absolute inset-x-7 top-0 z-20 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)]"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2.5 p-6 md:p-8">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.principle.label}
                        </span>
                        <p className="max-w-[420px] font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                            {content.principle.title}
                        </p>
                        <p className="max-w-[440px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.principle.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <RoleColumn title={content.client.title} items={content.client.items} />
                        <RoleColumn title={content.studio.title} items={content.studio.items} />
                    </div>

                    <div className="flex items-start gap-3 rounded-panel border border-[color:var(--color-decor-gold)]/40 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-5 md:p-6">
                        <ArrowRight
                            className="mt-0.5 size-4 shrink-0 text-[color:var(--color-decor-gold)]"
                            aria-hidden="true"
                        />
                        <p className="text-body-small text-[color:var(--color-text-default)]">
                            {content.result}
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}

function RoleColumn({ title, items }: { title: string; items: readonly string[] }) {
    return (
        <div className="flex flex-col gap-3 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6">
            <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                {title}
            </span>
            <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                    <li
                        key={item}
                        className="flex items-start gap-2.5 text-body-small text-[color:var(--color-text-muted)]"
                    >
                        <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-action-default)]"
                            aria-hidden="true"
                        />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
