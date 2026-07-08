import type { RealisationDetailContent } from "./types";
import {
    createProjectGallery,
    createProjectImages,
    createProjectMockups,
    realisationDetailActions,
} from "./shared";

type RealisationDetailInput = Omit<
    RealisationDetailContent,
    "card" | "gallery" | "hero" | "mockups"
> & {
    cardDescription: string;
    folder: string;
    hero: Pick<RealisationDetailContent["hero"], "title" | "type">;
    heroAlt: string;
    heroDescription: string;
};

/**
 * Assemble le contenu complet d'une étude de cas à partir des textes propres
 * au projet : visuels (covers, mockups, galerie) dérivés du dossier d'images
 * et carte/héros composés selon le gabarit commun A6.
 */
export function createRealisationDetail(
    input: RealisationDetailInput,
): RealisationDetailContent {
    const images = createProjectImages({
        folder: input.folder,
        alt: input.heroAlt,
    });

    return {
        ...input,
        gallery: createProjectGallery({ folder: input.folder, title: input.title }),
        mockups: createProjectMockups({ folder: input.folder, title: input.title }),
        card: {
            badge: input.badge,
            type: input.hero.type,
            description: input.cardDescription,
        },
        hero: {
            ...input.hero,
            description: input.heroDescription,
            images,
            primaryAction: realisationDetailActions.presentProject,
        },
    };
}
