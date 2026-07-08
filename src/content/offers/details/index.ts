import { boutiqueEnLigneOffer } from "./boutique-en-ligne";
import { diagnosticWebOffer } from "./diagnostic-web";
import { formationEnLigneOffer } from "./formation-en-ligne";
import { landingPageOffer } from "./landing-page";
import { maintenanceOffer } from "./maintenance";
import { onePageOffer } from "./one-page";
import { projetSurMesureOffer } from "./projet-sur-mesure";
import { refonteOffer } from "./refonte";
import { siteVitrineOffer } from "./site-vitrine";
import type { OfferDetailContent } from "./types";

export const offerDetailPages: readonly OfferDetailContent[] = [
    siteVitrineOffer,
    onePageOffer,
    landingPageOffer,
    boutiqueEnLigneOffer,
    formationEnLigneOffer,
    diagnosticWebOffer,
    refonteOffer,
    maintenanceOffer,
    projetSurMesureOffer,
] as const;

export function getOfferDetailBySlug(slug: string) {
    return offerDetailPages.find((offer) => offer.slug === slug);
}

export type { OfferDetailContent } from "./types";
