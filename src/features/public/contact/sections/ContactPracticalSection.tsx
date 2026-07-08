import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/layout";
import type { ContactPageContent } from "@/content/contact";

type ContactPracticalSectionProps = {
    content: ContactPageContent["practicalLinks"];
};

/**
 * Liens utiles (03) : raccourcis vers les pages pratiques (demande, légales)
 * en cibles ≥ 44 px, dernière section avant la bande CTA du footer.
 */
export function ContactPracticalSection({
    content,
}: ContactPracticalSectionProps) {
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
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
                {content.links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="focus-ring group flex min-h-14 items-center justify-between gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] px-4 py-3 text-body-small font-medium text-[color:var(--color-text-muted)] no-underline transition-[border-color,color] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/55 hover:text-[color:var(--color-text-default)]"
                        >
                            <span>{link.label}</span>
                            <ChevronRight
                                className="size-4 text-[color:var(--color-action-default)] transition-transform duration-200 ease-standard group-hover:translate-x-0.5 motion-reduce:transform-none"
                                aria-hidden="true"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
