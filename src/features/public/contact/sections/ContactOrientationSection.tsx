import { ChevronRight, ClipboardList, MessageSquareText } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/layout";
import type { ContactPageContent } from "@/content/contact";

type ContactOrientationSectionProps = {
    content: ContactPageContent["orientation"];
};

const icons = [MessageSquareText, ClipboardList] as const;

/**
 * Orientation (01) : deux points d'entrée honnêtes — message libre pour une
 * question, demande de projet pour cadrer un site — pour que le visiteur
 * choisisse le bon canal sans se tromper.
 */
export function ContactOrientationSection({
    content,
}: ContactOrientationSectionProps) {
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
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 lg:gap-6">
                {content.cards.map((card, index) => {
                    const Icon = icons[index] ?? MessageSquareText;

                    return (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="focus-ring group flex h-full flex-col justify-between gap-8 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-6 no-underline shadow-elevation-1 transition-[border-color,box-shadow,transform] duration-200 ease-standard hover:-translate-y-1 hover:border-[color:var(--color-decor-gold)]/55 hover:shadow-elevation-3 motion-reduce:hover:translate-y-0 md:p-7"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                                        <Icon
                                            className="size-5"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                                        {card.meta}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)] transition-colors duration-200 group-hover:text-[color:var(--color-action-default)]">
                                        {card.title}
                                    </h3>
                                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-2 text-body-small font-semibold text-[color:var(--color-action-default)]">
                                {card.actionLabel}
                                <ChevronRight
                                    className="size-4 transition-transform duration-200 ease-standard group-hover:translate-x-0.5 motion-reduce:transform-none"
                                    aria-hidden="true"
                                />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </Section>
    );
}
