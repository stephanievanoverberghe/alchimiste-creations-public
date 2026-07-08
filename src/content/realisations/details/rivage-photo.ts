import { createRealisationDetail } from "./create-realisation-detail";

export const rivagePhotoProject = createRealisationDetail({
    slug: "rivage-photo",
    title: "Rivage Photo",
    badge: "Démonstrateur personnel",
    folder: "rivage-photo",
    heroAlt: "Couverture de la démonstration personnelle Rivage Photo",
    hero: {
        title: "Rivage Photo — Démonstrateur de portfolio photographe.",
        type: "Site vitrine",
    },
    heroDescription:
        "Rivage Photo est un démonstrateur personnel pensé pour explorer un portfolio photographe, une galerie visuelle et une expérience de consultation sobre, immersive et facile à parcourir.",
    cardDescription:
        "Un portfolio visuel pour valoriser les images, guider la navigation et donner envie de découvrir l'univers du photographe.",
    website: {
        href: "https://rivage-photo.vercel.app/",
        label: "Voir le site",
    },
    seo: {
        title: "Rivage Photo — Démonstrateur de portfolio photographe et galerie visuelle",
        description:
            "Découvrez Rivage Photo, un démonstrateur personnel conçu pour explorer un portfolio photographe, une galerie visuelle et une expérience de consultation immersive.",
    },
    overview: {
        title: "Un portfolio pensé pour laisser les images porter l'univers.",
        description:
            "Rivage Photo explore la manière dont un site peut mettre en valeur des séries d'images, organiser une galerie et créer une expérience de consultation fluide.",
        message:
            "Un portfolio photo ne doit pas seulement montrer des images : il doit créer une expérience claire, sensible et agréable.",
    },
    context: {
        title: "Un portfolio visuel demande de la retenue et de la structure.",
        description:
            "La navigation, les espacements, la hiérarchie et les transitions doivent aider le visiteur à entrer dans l'univers visuel sans distraction.",
        items: [
            "Images à mettre en valeur.",
            "Séries ou galeries à organiser.",
            "Navigation fluide à créer.",
            "Interface sobre et sensible.",
            "Expérience mobile à soigner.",
            "Contenus visuels à rendre évolutifs.",
        ],
        message:
            "Un projet très visuel a besoin d'une structure discrète : assez présente pour guider, assez sobre pour laisser respirer les images.",
    },
    objectives: {
        title: "Montrer, organiser et faire ressentir.",
        items: [
            "Présenter l'univers du photographe.",
            "Mettre en valeur les images.",
            "Organiser les séries ou galeries.",
            "Proposer une navigation fluide.",
            "Créer une expérience visuelle immersive.",
            "Garder une interface simple et élégante.",
        ],
        message:
            "L'objectif est de créer un portfolio qui accompagne les images sans voler leur place.",
    },
    work: {
        title: "Un travail de composition, de navigation et de silence visuel.",
        items: [
            "Portfolio photographe.",
            "Galeries photo.",
            "Séries d'images.",
            "Mise en page visuelle.",
            "Navigation immersive.",
            "Design sobre et sensible.",
        ],
        message:
            "La composition aide à mettre les images au premier plan, sans perdre la navigation, le rythme et l'envie de contacter.",
    },
    method: {
        title: "Un fil vitrine appliqué à un portfolio visuel.",
        description:
            "Rivage Photo suit le playbook Site vitrine : comprendre l'univers, clarifier le message, structurer les pages et construire une présence visuelle claire.",
        steps: [
            {
                phase: "Comprendre",
                title: "Comprendre l'univers",
                description:
                    "Identifier le style photographique, les séries à montrer, le public et le niveau de sobriété attendu.",
            },
            {
                phase: "Clarifier",
                title: "Clarifier le message",
                description:
                    "Définir ce que le visiteur doit retenir : l'univers, le niveau de prestation, la sensibilité et le chemin vers le contact.",
            },
            {
                phase: "Structurer",
                title: "Cadrer les pages utiles",
                description:
                    "Définir les zones essentielles : accueil, galerie, séries, présentation, contact et informations rassurantes.",
            },
            {
                phase: "Designer",
                title: "Composer une vitrine visuelle",
                description:
                    "Créer une interface sobre, immersive et lisible qui accompagne les images sans les concurrencer.",
            },
            {
                phase: "Développer",
                title: "Structurer la consultation",
                description:
                    "Organiser la navigation, les blocs, les galeries et les comportements responsive autour des images.",
            },
            {
                phase: "Vérifier",
                title: "Vérifier la mise en valeur",
                description:
                    "Tester le mobile, les proportions, les temps de lecture, les images et le parcours jusqu'au contact.",
            },
            {
                phase: "Lancer",
                title: "Préparer une présence crédible",
                description:
                    "Préparer une version montrable, cohérente et facile à compléter avec de nouvelles séries ou prestations.",
            },
        ],
    },
    proof: {
        title: "Ce qu'un portfolio visuel doit faire ressentir.",
        description:
            "Pour un projet visuel, le site doit installer une ambiance, organiser les séries et rendre la consultation agréable sur tous les formats.",
        items: [
            "Création d'un portfolio sensible.",
            "Structuration de contenus visuels.",
            "Mise en valeur d'un univers photographique.",
            "Équilibre entre sobriété, navigation et impact visuel.",
            "Design au service de l'image.",
            "Expérience de consultation mobile.",
        ],
    },
});
