import { Section } from "@/components/layout";
import type { ContactPageContent } from "@/content/contact";

import { ContactFormCard } from "./ContactFormCard";

type ContactFormSectionProps = {
    content: ContactPageContent["form"];
};

/**
 * Le message (02) : formulaire épuré, colonne unique centrée, cible de
 * l'ancre « Écrire un message » du héros et des cartes d'orientation.
 */
export function ContactFormSection({ content }: ContactFormSectionProps) {
    return (
        <Section
            id="message"
            className="scroll-mt-24 border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="mx-auto flex max-w-[760px] flex-col">
                <div className="flex flex-col gap-3">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        {content.eyebrow}
                    </p>
                    <h2 className="text-balance">{content.title}</h2>
                    <p className="text-body text-[color:var(--color-text-muted)]">
                        {content.description}
                    </p>
                </div>

                <div className="mt-8 rounded-panel border border-[color:var(--color-border-subtle)] bg-[rgba(255,243,224,0.03)] p-5 shadow-elevation-1 md:mt-10 md:p-7">
                    <ContactFormCard content={content} />
                </div>
            </div>
        </Section>
    );
}
