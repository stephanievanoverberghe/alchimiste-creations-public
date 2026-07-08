import type { PublicHeroImages } from "@/components/layout";
import { publicCtas } from "@/config/navigation";

export const realisationDetailActions = {
    presentProject: {
        ...publicCtas.presentProject,
    },
} as const;

/**
 * Construit le triplet d'images d'un projet à partir de captures réelles du
 * site : mobile = capture mobile, tablette/desktop = capture desktop.
 */
export function createProjectImages({
    alt,
    folder,
}: {
    alt: string;
    folder: string;
}): PublicHeroImages {
    // Fond plein cadre du héros de fiche : visuels d'ambiance du projet
    // (portrait mobile, paysage tablette/desktop).
    return {
        mobile: `/images/pages/projects/${folder}/cover-mobile.webp`,
        tablet: `/images/pages/projects/${folder}/cover-tablet.webp`,
        desktop: `/images/pages/projects/${folder}/cover-desktop.webp`,
        alt,
    };
}

/** Mockups device (navigateur + téléphone) composés à partir des captures réelles. */
export function createProjectMockups({
    folder,
    title,
}: {
    folder: string;
    title: string;
}) {
    return {
        desktop: {
            src: `/images/pages/projects/${folder}/mockup-desktop.webp`,
            alt: `Le site ${title} affiché dans un navigateur`,
        },
        mobile: {
            src: `/images/pages/projects/${folder}/mockup-mobile.webp`,
            alt: `Le site ${title} affiché sur un téléphone`,
        },
    };
}

/** Galerie de captures réelles du site (accueil, sections, mobile). */
export function createProjectGallery({
    folder,
    title,
}: {
    folder: string;
    title: string;
}) {
    const shots = [
        { key: "g1", label: "page d'accueil", width: 2160, height: 1350 },
        { key: "g2", label: "une section clé", width: 2160, height: 1350 },
        { key: "g3", label: "un autre écran", width: 2160, height: 1350 },
        { key: "g4", label: "en version mobile", width: 780, height: 1688 },
    ];
    return {
        title: "Le site en images",
        description: `Des captures réelles du site ${title}, du grand écran au mobile.`,
        images: shots.map((shot) => ({
            src: `/images/pages/projects/${folder}/gallery/${shot.key}.webp`,
            alt: `${title} — ${shot.label}`,
            width: shot.width,
            height: shot.height,
        })),
    };
}
