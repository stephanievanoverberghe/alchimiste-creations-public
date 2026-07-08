import { Container } from "@/components/layout";
import type { OfferDetailPageContent } from "@/content/offers";

import {
    OfferDetailHeroSection,
    OfferFaqSection,
    OfferPricingSection,
    OfferProblemSection,
    OfferResultSection,
    OfferScopeSection,
    OfferWorkflowSection,
} from "./sections";

type OfferDetailPageProps = {
    content: OfferDetailPageContent;
};

/**
 * Gabarit commun des pages détail d'offre — un seul récit vertical du 375
 * au desktop, aligné sur l'intention A4 du plan : problème → résultat →
 * périmètre (inclus/non inclus) → déroulé réel (playbook) → prix → FAQ.
 * L'appel final est porté par la bande CTA du footer.
 */
export function OfferDetailPage({ content }: OfferDetailPageProps) {
    return (
        <div className="flex flex-col">
            <OfferDetailHeroSection content={content} />
            <Container>
                <OfferProblemSection content={content.purpose} />
                <OfferResultSection content={content.result} />
                <OfferScopeSection
                    scope={content.scope}
                    fallbackExcluded={content.qualification.notAdapted}
                />
                <OfferWorkflowSection content={content} />
                <OfferPricingSection content={content.pricing} />
                {content.faq ? <OfferFaqSection items={content.faq} /> : null}
            </Container>
        </div>
    );
}
