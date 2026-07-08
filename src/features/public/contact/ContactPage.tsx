import { Container } from "@/components/layout";
import type { ContactPageContent } from "@/content/contact";

import {
    ContactFormSection,
    ContactHeroSection,
    ContactOrientationSection,
    ContactPracticalSection,
} from "./sections";

type ContactPageProps = {
    content: ContactPageContent;
};

/**
 * Page contact publique — rassurer avant d'écrire, en un seul récit vertical
 * du 375 au desktop : héros typographique avec attentes claires, orientation
 * (message / demande de projet), formulaire épuré, puis liens pratiques.
 * L'appel final est porté par la bande CTA du footer.
 */
export function ContactPage({ content }: ContactPageProps) {
    return (
        <div className="flex flex-col">
            <ContactHeroSection content={content.hero} />
            <Container>
                <ContactOrientationSection content={content.orientation} />
                <ContactFormSection content={content.form} />
                <ContactPracticalSection content={content.practicalLinks} />
            </Container>
        </div>
    );
}
