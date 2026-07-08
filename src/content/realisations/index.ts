import {
    offerCategoryRoutes,
    offerRoutes,
    publicCtas,
    publicRoutes,
} from "@/config/navigation";

import {
    getRealisationDetailBySlug,
    realisationDetailPages,
    type RealisationDetailContent,
} from "./details";

const realisationsActions = {
    presentProject: {
        ...publicCtas.presentProject,
    },
    seeOffers: {
        ...publicCtas.seeOffers,
    },
} as const;

const offerCategoryImages = {
    create: {
        src: "/images/pages/offers/categories/create/cover-offres-mobile.png",
        tablet: "/images/pages/offers/categories/create/cover-tablet.png",
        alt: "Interface web en création sur un écran",
    },
    siteVitrine: {
        src: "/images/pages/offers/categories/create/site-vitrine/hero-mobile.png",
        tablet: "/images/pages/offers/categories/create/site-vitrine/hero-tablet.png",
        alt: "Ambiance de site vitrine clair et structuré",
    },
    sell: {
        src: "/images/pages/offers/categories/sell/cover-offres-mobile.png",
        tablet: "/images/pages/offers/categories/sell/cover-tablet.png",
        alt: "Interface de vente et présentation d'offre en ligne",
    },
    improve: {
        src: "/images/pages/offers/categories/improve/cover-offres-mobile.png",
        tablet: "/images/pages/offers/categories/improve/cover-tablet.png",
        alt: "Interface web en amélioration et optimisation",
    },
} as const;

const galleryProjects = realisationDetailPages.map((project) => ({
    id: project.slug,
    badge: project.card.badge,
    title: project.title,
    type: project.card.type,
    description: project.card.description,
    // Chaque carte met en scène le vrai site en duo desktop + mobile.
    mockup: project.mockups.desktop,
    mockupMobile: project.mockups.mobile,
    href: `${publicRoutes.realisations}/${project.slug}`,
}));

export const realisationsProjectPages = realisationDetailPages;
export const getRealisationsProjectBySlug = getRealisationDetailBySlug;
export type { RealisationDetailContent };
export type RealisationsProjectContent = RealisationDetailContent;

export const realisationsPageContent = {
    seo: {
        title: "Réalisations — Projets web et démonstrations",
        description:
            "Découvre les réalisations d'Alchimiste Créations : projets clients, démonstrations personnelles et exemples pour te projeter avec clarté.",
    },
    hero: {
        images: {
            mobile: "/images/pages/projects/hero-mobile.png",
            tablet: "/images/pages/projects/hero-tablet.png",
            desktop: "/images/pages/projects/hero-desktop.png",
            alt: "Galerie de réalisations web Alchimiste Créations",
        },
        eyebrow: "Réalisations",
        titleBefore: "La preuve, montrée ",
        titleAccent: "sans survente",
        titleAfter: ".",
        description:
            "Chaque projet est présenté pour ce qu'il est vraiment — réalisation client, démonstration personnelle ou projet en refonte — pour montrer le savoir-faire sans jamais gonfler la vitrine.",
        primaryAction: realisationsActions.presentProject,
        galleryCta: {
            label: "Voir la galerie",
            href: "#galerie",
        },
        naturesLabel: "Chaque projet, sa vraie nature",
        natures: ["Réalisation client", "Démonstration personnelle", "Projet en refonte"],
    },
    transparency: {
        eyebrow: "01 — Lecture honnête",
        title: "Des projets présentés avec leur vraie nature.",
        description:
            "Une réalisation client, une démonstration personnelle et un projet en refonte ne racontent pas la même chose. La page les distingue pour rester claire et crédible.",
        note:
            "La crédibilité vient autant de la qualité du travail que de la manière honnête dont il est présenté.",
        statuses: [
            {
                title: "Réalisation client",
                description:
                    "Un projet effectivement réalisé ou livré, publié avec les éléments autorisés.",
            },
            {
                title: "Démonstration personnelle",
                description:
                    "Une exploration interne qui montre un parcours, une interface ou une logique produit.",
            },
            {
                title: "Projet en refonte",
                description:
                    "Un projet conservé pour montrer une intention ou une architecture, sans le présenter comme finalisé.",
            },
        ],
    },
    gallery: {
        eyebrow: "02 — La galerie",
        title: "Des exemples concrets pour imaginer ton futur site.",
        description:
            "Boutique, portfolio, formation, contenu éditorial ou parcours guidé : chaque projet montre une façon différente de rendre une idée plus claire et plus agréable à parcourir.",
        filterLabel: "Filtrer par type",
        allLabel: "Tous",
        emptyLabel: "Aucun projet pour ce type — pour l'instant.",
        projects: galleryProjects,
    },
    useCases: {
        eyebrow: "03 — Trouver le bon format",
        title: "Quel type de projet se rapproche du tien ?",
        description:
            "Les réalisations ne sont pas des modèles à copier. Elles servent à repérer ton besoin : poser une présence, vendre une offre, transmettre un contenu ou améliorer l'existant.",
        action: realisationsActions.seeOffers,
        cases: [
            {
                title: "Créer une présence claire",
                description:
                    "Présenter ton activité, ton univers ou une première offre avec une base lisible.",
                href: offerCategoryRoutes.create,
                action: "Voir les offres pour créer",
                image: offerCategoryImages.create,
            },
            {
                title: "Créer un site vitrine complet",
                description:
                    "Présenter ton activité, tes services et ton univers avec une structure claire et rassurante.",
                href: offerRoutes.siteVitrine,
                action: "Voir le site vitrine",
                image: offerCategoryImages.siteVitrine,
            },
            {
                title: "Vendre ou transmettre",
                description:
                    "Organiser une boutique, une formation ou un parcours de contenu avec une structure claire.",
                href: offerCategoryRoutes.sell,
                action: "Voir les offres pour vendre",
                image: offerCategoryImages.sell,
            },
            {
                title: "Améliorer l'existant",
                description:
                    "Reprendre un site déjà en ligne, clarifier son message ou corriger un parcours qui bloque.",
                href: offerCategoryRoutes.improve,
                action: "Voir les offres pour améliorer",
                image: offerCategoryImages.improve,
            },
        ],
    },
} as const;

export type RealisationsPageContent = typeof realisationsPageContent;
