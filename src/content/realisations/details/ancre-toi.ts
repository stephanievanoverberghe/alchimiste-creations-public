import { createRealisationDetail } from "./create-realisation-detail";

export const ancreToiProject = createRealisationDetail({
    slug: "ancre-toi",
    title: "Ancre-toi",
    badge: "Démonstrateur en refonte",
    folder: "ancre-toi",
    heroAlt: "Couverture de la démonstration personnelle Ancre-toi",
    hero: {
        title: "Ancre-toi — Démonstrateur de formation en ligne en refonte.",
        type: "Formation en ligne",
    },
    heroDescription:
        "Ancre-toi est un démonstrateur personnel en reconstruction. Le projet sert à explorer un parcours de formation en ligne, un espace membre et une architecture apprenante, sans être présenté comme une version finalisée.",
    cardDescription:
        "Un démonstrateur en refonte autour d'une formation en ligne, d'un espace membre et d'un parcours apprenant à clarifier.",
    website: {
        href: "https://ancretoi.vercel.app/",
        label: "Voir le site",
    },
    seo: {
        title: "Ancre-toi — Démonstrateur de formation en ligne et espace membre",
        description:
            "Découvrez Ancre-toi, un démonstrateur personnel en refonte autour d'une expérience de formation en ligne, d'un espace membre et d'un accès organisé aux modules.",
    },
    overview: {
        title: "Un parcours de formation en reconstruction.",
        description:
            "Ancre-toi explore la manière dont un site peut présenter une formation, guider l'inscription ou l'achat, puis donner accès aux modules dans un espace dédié. La fiche montre l'intention et l'architecture en cours, pas une livraison finalisée.",
        message:
            "La refonte sert à remettre le parcours apprenant, les accès et les contenus dans une structure plus claire.",
    },
    context: {
        title: "Une formation en ligne en refonte demande une vraie structure.",
        description:
            "Le projet est conservé comme démonstrateur de formation en ligne, mais il est en reconstruction pour clarifier le parcours, les modules et l'espace membre.",
        items: [
            "Formation à présenter clairement.",
            "Parcours pédagogique à organiser.",
            "Modules à structurer.",
            "Accès membre à prévoir.",
            "Ressources à rendre accessibles.",
            "Expérience mobile à soigner.",
        ],
        message:
            "La valeur de ce cas vient de l'architecture à reconstruire : comprendre où commencer, quoi suivre et comment avancer.",
    },
    objectives: {
        title: "Présenter, inscrire, donner accès et guider.",
        items: [
            "Présenter la formation clairement.",
            "Expliquer le parcours proposé.",
            "Permettre l'achat ou l'inscription si prévu.",
            "Donner accès à un espace membre.",
            "Organiser les modules de formation.",
            "Reclarifier une expérience rassurante et structurée.",
        ],
        message:
            "L'objectif de la refonte est de rendre le parcours de formation plus simple à comprendre et plus facile à suivre.",
    },
    work: {
        title: "Un travail de refonte pédagogique, d'accès et d'interface.",
        items: [
            "Page de présentation de la formation.",
            "Parcours d'inscription ou d'achat.",
            "Espace membre.",
            "Accès aux modules.",
            "Organisation des contenus.",
            "Expérience mobile app-like.",
        ],
        message:
            "La reconstruction vise à mieux présenter la formation, organiser l'accès aux modules et rendre le parcours plus rassurant.",
    },
    method: {
        title: "Un fil de refonte pédagogique avant l'interface.",
        description:
            "Ancre-toi suit le playbook Formation en ligne en phase de refonte : comprendre le parcours apprenant, réorganiser les modules, cadrer les accès et rendre l'expérience plus facile à suivre.",
        steps: [
            {
                phase: "Comprendre",
                title: "Recomprendre la formation",
                description:
                    "Identifier le sujet, le public apprenant, le résultat attendu et les contenus déjà disponibles.",
            },
            {
                phase: "Clarifier",
                title: "Clarifier la progression",
                description:
                    "Définir ce que l'apprenant doit comprendre, dans quel ordre, et ce qui doit être visible dès le départ.",
            },
            {
                phase: "Structurer",
                title: "Structurer les modules",
                description:
                    "Découper la formation en modules, leçons et ressources pour construire une progression claire.",
            },
            {
                phase: "Designer",
                title: "Designer l'espace apprenant",
                description:
                    "Créer un espace calme, lisible et rassurant pour consulter les modules sans se perdre.",
            },
            {
                phase: "Développer",
                title: "Cadrer les accès",
                description:
                    "Prévoir comment l'apprenant arrive, se connecte, accède aux contenus et retrouve ses ressources.",
            },
            {
                phase: "Vérifier",
                title: "Tester le parcours",
                description:
                    "Vérifier la navigation, les accès, le mobile, les contenus et les points qui peuvent bloquer l'apprentissage.",
            },
            {
                phase: "Lancer",
                title: "Préparer une version reconstruite",
                description:
                    "Identifier ce qui doit être finalisé avant de présenter le démonstrateur comme une version stable.",
            },
        ],
    },
    proof: {
        title: "Ce qu'une formation en ligne en refonte doit clarifier.",
        description:
            "Ce cas montre une architecture de formation à reconstruire : promesse, parcours, accès aux contenus et expérience apprenant.",
        items: [
            "Architecture de formation en cours de refonte.",
            "Réflexion sur un parcours pédagogique.",
            "Organisation d'un espace membre.",
            "Accès aux modules à clarifier.",
            "Expérience apprenante à reconstruire.",
            "Base utile pour cadrer une formation ou une méthode.",
        ],
    },
});
