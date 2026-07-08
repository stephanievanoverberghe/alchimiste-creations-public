import { Container } from "@/components/layout";
import type { AboutPageContent } from "@/content/about";

import {
    AboutHeroSection,
    AboutPathSection,
    AboutPersonSection,
    AboutSoloSection,
    AboutValuesSection,
} from "./sections";

type AboutPageProps = {
    content: AboutPageContent;
};

/**
 * Page à-propos publique — l'humain du studio en un seul récit vertical,
 * du 375 au desktop : héros à repères d'identité, la personne (01,
 * portrait), le parcours en trois matières (02), les valeurs incarnées
 * (03) et le format solo assumé (04). L'appel final est porté par la
 * bande CTA du footer.
 */
export function AboutPage({ content }: AboutPageProps) {
    return (
        <div className="flex flex-col">
            <AboutHeroSection content={content.hero} />
            <Container>
                <AboutPersonSection content={content.person} />
                <AboutPathSection content={content.path} />
                <AboutValuesSection content={content.values} />
                <AboutSoloSection content={content.solo} />
            </Container>
        </div>
    );
}
