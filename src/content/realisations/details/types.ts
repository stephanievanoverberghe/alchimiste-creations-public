import type { PublicHeroImages } from "@/components/layout";

export type RealisationDetailAction = {
    href: string;
    label: string;
};

export type RealisationDetailMethodPhase =
    | "Comprendre"
    | "Clarifier"
    | "Structurer"
    | "Designer"
    | "Développer"
    | "Vérifier"
    | "Lancer";

export type RealisationDetailStep = {
    description: string;
    phase: RealisationDetailMethodPhase;
    title: string;
};

export type RealisationDetailImage = {
    alt: string;
    height?: number;
    src: string;
    width?: number;
};

export type RealisationDetailContent = {
    badge: string;
    /** Galerie de captures réelles du site (desktop + mobile). */
    gallery: {
        description: string;
        images: readonly RealisationDetailImage[];
        title: string;
    };
    /** Mockups device (navigateur + téléphone) pour les cartes et le projet suivant. */
    mockups: {
        desktop: RealisationDetailImage;
        mobile: RealisationDetailImage;
    };
    card: {
        badge: string;
        description: string;
        type: string;
    };
    context: {
        description: string;
        items: readonly string[];
        message: string;
        title: string;
    };
    hero: {
        description: string;
        images: PublicHeroImages;
        primaryAction: RealisationDetailAction;
        title: string;
        type: string;
    };
    method: {
        description: string;
        steps: readonly RealisationDetailStep[];
        title: string;
    };
    objectives: {
        items: readonly string[];
        message: string;
        title: string;
    };
    overview: {
        description: string;
        message: string;
        title: string;
    };
    proof: {
        description: string;
        items: readonly string[];
        title: string;
    };
    website?: RealisationDetailAction | null;
    seo: {
        description: string;
        title: string;
    };
    slug: string;
    title: string;
    work: {
        items: readonly string[];
        message: string;
        title: string;
    };
};
