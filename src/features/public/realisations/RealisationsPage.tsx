import { Container } from "@/components/layout";
import type { RealisationsPageContent } from "@/content/realisations";

import {
    RealisationsGallerySection,
    RealisationsHeroSection,
    RealisationsTransparencySection,
    RealisationsUseCasesSection,
} from "./sections";

type RealisationsPageProps = {
    content: RealisationsPageContent;
};

/**
 * Page réalisations publique — la preuve, en un seul récit vertical du 375
 * au desktop (fin du carrousel mobile) : héros honnête, puis la lecture
 * des trois natures (01), la galerie immersive à filtres par type (02, la
 * pièce maîtresse) et la passerelle vers les offres (03). L'appel final est
 * porté par la bande CTA du footer.
 */
export function RealisationsPage({ content }: RealisationsPageProps) {
    return (
        <div className="flex flex-col">
            <RealisationsHeroSection content={content.hero} />
            <Container>
                <RealisationsTransparencySection content={content.transparency} />
                <RealisationsGallerySection content={content.gallery} />
                <RealisationsUseCasesSection content={content.useCases} />
            </Container>
        </div>
    );
}
