import type { PublicHeroImages } from "@/components/layout";
import { publicCtas } from "@/config/navigation";

export const offerDetailActions = {
    presentProject: {
        ...publicCtas.presentProject,
    },
} as const;

/**
 * Construit le triplet d'images de héros (mobile/tablette/desktop) d'une
 * offre à partir de sa catégorie et de son dossier d'assets.
 */
export function createOfferHeroImages({
    alt,
    category,
    folder,
}: {
    alt: string;
    category: "create" | "custom" | "improve" | "sell";
    folder: string;
}): PublicHeroImages {
    return {
        mobile: `/images/pages/offers/categories/${category}/${folder}/hero-mobile.png`,
        tablet: `/images/pages/offers/categories/${category}/${folder}/hero-tablet.png`,
        desktop: `/images/pages/offers/categories/${category}/${folder}/hero-desktop.png`,
        alt,
    };
}
