import { createRealisationDetail } from "./create-realisation-detail";

export const explorArtProject = createRealisationDetail({
    slug: "explor-art",
    title: "Explor'Art",
    badge: "Démonstrateur personnel",
    folder: "explor-art",
    heroAlt: "Couverture de la démonstration personnelle Explor'Art",
    hero: {
        title: "Explor'Art — Démonstrateur de blog vidéo éditorial.",
        type: "Projet sur mesure",
    },
    heroDescription:
        "Explor'Art est un démonstrateur personnel pensé pour explorer une architecture éditoriale autour de l'art, organiser des articles, intégrer des vidéos et guider le visiteur dans une expérience de lecture claire.",
    cardDescription:
        "Un projet éditorial pour organiser des contenus, mettre en avant des vidéos et rendre la découverte plus immersive.",
    website: {
        href: "https://explorart-blog.vercel.app/",
        label: "Voir le site",
    },
    seo: {
        title: "Explor'Art — Démonstrateur de blog vidéo et architecture éditoriale",
        description:
            "Découvrez Explor'Art, un démonstrateur personnel conçu pour explorer une architecture éditoriale, un blog vidéo et une expérience de lecture autour de contenus artistiques.",
    },
    overview: {
        title: "Une architecture éditoriale pour rendre les contenus faciles à explorer.",
        description:
            "Explor'Art montre comment transformer une idée éditoriale en expérience de lecture lisible, cohérente et évolutive.",
        message:
            "Un blog vidéo ne doit pas seulement empiler des contenus : il doit aider le visiteur à comprendre, explorer et naviguer.",
    },
    context: {
        title: "Un projet éditorial demande une architecture claire.",
        description:
            "Un projet riche en contenus peut vite devenir confus si les articles, vidéos et catégories ne sont pas organisés dès le départ.",
        items: [
            "Contenus éditoriaux à organiser.",
            "Articles et vidéos à intégrer.",
            "Catégories ou piliers à structurer.",
            "Navigation entre contenus à penser.",
            "Expérience de lecture agréable.",
            "Base administrable à prévoir.",
        ],
        message:
            "Un projet éditorial devient plus lisible quand les contenus, les catégories et les parcours sont pensés ensemble.",
    },
    objectives: {
        title: "Organiser, publier et guider la consultation.",
        items: [
            "Présenter le concept Explor'Art.",
            "Organiser les contenus éditoriaux.",
            "Créer une structure de blog claire.",
            "Intégrer des contenus vidéo si prévus.",
            "Valoriser les articles et contenus longs.",
            "Proposer une expérience mobile lisible.",
        ],
        message:
            "L'objectif est de rendre les contenus plus faciles à explorer, pas simplement de les publier.",
    },
    work: {
        title: "Un travail d'architecture, de lecture et d'organisation.",
        items: [
            "Page d'accueil éditoriale.",
            "Pages articles.",
            "Catégories et piliers de contenus.",
            "Intégration vidéo.",
            "Grille d'articles.",
            "Lisibilité mobile.",
        ],
        message:
            "La structure aide à publier plus clairement, guider la lecture et préparer une base éditoriale capable d'évoluer.",
    },
    method: {
        title: "Un fil sur mesure pour organiser un projet éditorial vivant.",
        description:
            "Explor'Art suit le playbook Projet sur mesure : comprendre le besoin métier, cadrer les rôles, structurer les contenus et préparer une base applicative évolutive.",
        steps: [
            {
                phase: "Comprendre",
                title: "Comprendre le besoin éditorial",
                description:
                    "Identifier les contenus à publier, les usages attendus, les types de lecteurs et le rôle du futur backoffice.",
            },
            {
                phase: "Clarifier",
                title: "Cadrer les contenus et les rôles",
                description:
                    "Définir les catégories, les articles, les vidéos, les permissions et ce qui doit rester administrable.",
            },
            {
                phase: "Structurer",
                title: "Prioriser une V1 réaliste",
                description:
                    "Séparer le socle indispensable du backlog futur pour éviter une plateforme trop ambitieuse dès le départ.",
            },
            {
                phase: "Designer",
                title: "Designer les parcours",
                description:
                    "Créer une lecture claire entre accueil, catégories, articles, vidéos et espaces de gestion.",
            },
            {
                phase: "Développer",
                title: "Construire la base applicative",
                description:
                    "Mettre en place les structures de pages, les composants, les états et les bases nécessaires à l'administration.",
            },
            {
                phase: "Vérifier",
                title: "Vérifier les usages",
                description:
                    "Tester les parcours, les états, les contenus, les accès et la lisibilité sur les formats importants.",
            },
            {
                phase: "Lancer",
                title: "Préparer l'évolution",
                description:
                    "Documenter ce qui est prêt, ce qui reste à brancher et les prochaines priorités pour faire grandir le projet.",
            },
        ],
    },
    proof: {
        title: "Ce qu'un projet éditorial doit organiser.",
        description:
            "Quand les contenus se multiplient, le site doit donner des repères clairs au lecteur et rester simple à administrer.",
        items: [
            "Création d'une architecture éditoriale.",
            "Organisation d'articles et de vidéos.",
            "Structuration d'un blog.",
            "Contenu culturel rendu plus clair.",
            "Base administrable préparée.",
            "Équilibre entre contenu, navigation et UX.",
        ],
    },
});
