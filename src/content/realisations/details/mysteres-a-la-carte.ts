import { createRealisationDetail } from "./create-realisation-detail";

export const mysteresALaCarteProject = createRealisationDetail({
    slug: "mysteres-a-la-carte",
    title: "Mystères à la carte",
    badge: "Démonstrateur personnel",
    folder: "mysteres-a-la-carte",
    heroAlt: "Couverture de la démonstration personnelle Mystères à la carte",
    hero: {
        title: "Mystères à la carte — Parcours de demande personnalisée.",
        type: "Landing page",
    },
    heroDescription:
        "Mystères à la carte est un démonstrateur personnel pensé pour explorer un parcours de demande guidée, structurer un formulaire avancé et rendre une demande plus claire à transmettre comme à traiter.",
    cardDescription:
        "Un parcours guidé pour aider une personne à formuler une demande précise, étape par étape, sans se perdre dans un formulaire classique.",
    website: {
        href: "https://mysteres-a-la-carte.vercel.app/",
        label: "Voir le site",
    },
    seo: {
        title: "Mystères à la carte — Démonstrateur UX et formulaire avancé",
        description:
            "Découvrez Mystères à la carte, un démonstrateur personnel conçu pour explorer un parcours de demande personnalisée, un formulaire avancé et une expérience utilisateur guidée.",
    },
    overview: {
        title: "Un parcours guidé pour transformer une demande complexe en action claire.",
        description:
            "Le projet explore comment organiser des informations, structurer un formulaire, limiter la confusion et préparer une demande plus complète sans rendre l'expérience lourde.",
        message:
            "Un formulaire avancé peut rester clair s'il est pensé comme un parcours, et pas comme une liste de champs.",
    },
    context: {
        title: "Une demande personnalisée demande plus qu'un simple formulaire.",
        description:
            "Lorsque la demande dépend de choix, de préférences ou d'un contexte spécifique, le parcours doit aider l'utilisateur à avancer étape par étape.",
        items: [
            "Parcours de demande plus structuré.",
            "Informations à collecter dans un ordre logique.",
            "Risque de demandes incomplètes.",
            "Expérience rassurante à créer.",
            "Clarté mobile à renforcer.",
            "Base technique réutilisable.",
        ],
        message:
            "Ce type de parcours aide la personne à formuler son besoin sans se retrouver face à un formulaire trop lourd.",
    },
    objectives: {
        title: "Guider, structurer et simplifier.",
        items: [
            "Présenter clairement le concept.",
            "Guider l'utilisateur vers la bonne action.",
            "Structurer la demande ou la réservation.",
            "Simplifier la collecte d'informations.",
            "Réduire les échanges inutiles.",
            "Montrer une logique de projet web sur mesure.",
        ],
        message:
            "L'objectif est de rendre la demande plus claire pour l'utilisateur comme pour la personne qui la reçoit.",
    },
    work: {
        title: "Un travail de structure, de parcours et de qualité.",
        items: [
            "Clarification du parcours utilisateur.",
            "Structure des pages.",
            "Organisation du formulaire.",
            "Logique de demande ou réservation.",
            "Expérience utilisateur guidée.",
            "Organisation de composants réutilisables.",
        ],
        message:
            "Le parcours aide à collecter les bonnes informations tout en gardant une expérience simple à suivre.",
    },
    method: {
        title: "Un fil orienté conversion et demande guidée.",
        description:
            "Mystères à la carte suit le playbook Landing Page : comprendre la demande, clarifier la promesse, structurer le parcours et guider vers une action simple.",
        steps: [
            {
                phase: "Comprendre",
                title: "Comprendre la demande",
                description:
                    "Identifier ce que l'utilisateur doit formuler, ce qui rend la demande complexe et les informations vraiment utiles.",
            },
            {
                phase: "Clarifier",
                title: "Clarifier l'offre et la cible",
                description:
                    "Identifier la personne qui remplit le parcours, ses hésitations, ses besoins et les éléments qui doivent la rassurer.",
            },
            {
                phase: "Structurer",
                title: "Structurer la conversion",
                description:
                    "Organiser les sections, les étapes du formulaire, les CTA et les messages de réassurance dans le bon ordre.",
            },
            {
                phase: "Designer",
                title: "Designer le parcours",
                description:
                    "Créer une expérience courte, lisible et progressive pour éviter l'effet formulaire trop lourd.",
            },
            {
                phase: "Développer",
                title: "Développer le formulaire guidé",
                description:
                    "Construire les étapes, les états, les composants et la logique qui rendent la demande exploitable.",
            },
            {
                phase: "Vérifier",
                title: "Vérifier la compréhension",
                description:
                    "Contrôler les champs, les erreurs, le mobile et la clarté du résumé transmis à la fin du parcours.",
            },
            {
                phase: "Lancer",
                title: "Préparer une demande actionnable",
                description:
                    "Faire en sorte que la personne qui reçoit la demande puisse comprendre le besoin et répondre sans multiplier les échanges.",
            },
        ],
    },
    proof: {
        title: "Ce qu'un parcours de demande doit rendre simple.",
        description:
            "Quand la demande est spécifique, le site doit aider à préciser le besoin, réduire les hésitations et transmettre une information exploitable.",
        items: [
            "Structuration d'un parcours utilisateur.",
            "Conception d'un formulaire avancé compréhensible.",
            "Demande rendue plus claire.",
            "Attention portée à la qualité du code.",
            "Équilibre entre fonctionnement et expérience utilisateur.",
            "Capacité à imaginer un projet plus avancé qu'un site vitrine.",
        ],
    },
});
