import { Container } from "@/components/layout";
import type { OffersPageContent } from "@/content/offers";

import {
    OffersHeroSection,
    OffersNextStepsSection,
    OffersOnQuoteSection,
    OffersOrientationSection,
    OffersTurnkeySection,
} from "./sections";

type OffersPageProps = {
    content: OffersPageContent;
};

/**
 * Page offres publique — un seul récit vertical du 375 au desktop
 * (fin du carrousel-teaser mobile et des onglets Radix). Elle oriente par
 * situation puis assume deux niveaux : les offres clé-en-main aux tarifs
 * affichés (02) et les accompagnements sur devis (03). L'appel final est
 * porté par la bande CTA du footer.
 */
export function OffersPage({ content }: OffersPageProps) {
    return (
        <div className="flex flex-col">
            <OffersHeroSection content={content.hero} />
            <Container>
                <OffersOrientationSection content={content.orientation} />
                <OffersTurnkeySection content={content.turnkey} />
                <OffersOnQuoteSection content={content.onQuote} />
                <OffersNextStepsSection content={content.nextSteps} />
            </Container>
        </div>
    );
}
