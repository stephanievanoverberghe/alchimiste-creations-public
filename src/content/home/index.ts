import { offerCategoryRoutes, publicCtas, publicRoutes } from "@/config/navigation";

const homeActions = {
    discoverMethod: {
        ...publicCtas.discoverMethod,
    },
    exploreOffers: {
        href: publicRoutes.offers,
        label: "Explorer les offres",
    },
    presentProject: {
        ...publicCtas.presentProject,
    },
    seeMethodSteps: {
        href: publicRoutes.method,
        label: "Voir les étapes",
    },
    seeOffers: {
        ...publicCtas.seeOffers,
    },
    seeProjects: {
        ...publicCtas.seeProjects,
    },
    seeStudio: {
        href: publicRoutes.about,
        label: "Découvrir le studio",
    },
} as const;

export const homeHeaderContent = {
    brandLabel: "Alchimiste Créations",
    homeLabel: "Accueil Alchimiste Créations",
    menuLabel: "Ouvrir le menu",
    signature: "Clarifier. Designer. Lancer.",
    logo: {
        src: "/images/brand/logo-primary.png",
    },
};

const homeHeroContent = {
    images: {
        mobile: "/images/pages/home/hero-mobile.png",
        tablet: "/images/pages/home/hero-tablet.png",
        desktop: "/images/pages/home/hero-desktop.png",
        alt: "Bureau de création avec ordinateur, carnet de croquis et ambiance alchimique",
    },
    eyebrow: "Studio web indépendant",
    titleBefore: "Fais ",
    titleAccent: "émerger",
    titleAfter: " le site que ton projet mérite.",
    description:
        "Alchimiste Créations clarifie ton message, organise ton parcours et donne forme à une présence web sur mesure, pensée pour convaincre sans perdre ton identité.",
    primaryAction: homeActions.presentProject,
    secondaryAction: homeActions.discoverMethod,
    proofPoints: [
        "Clarifier l'idée",
        "Structurer le parcours",
        "Préparer le lancement",
    ],
    scrollCueLabel: "Découvrir",
};

const homeAssetsContent = {
    offerCategories: [
        {
            category: "create",
            label: "Créer",
            description:
                "Partir d'une idée, poser les fondations et construire une première présence web claire.",
            image: {
                src: "/images/pages/offers/categories/create/cover-mobile.png",
                tablet: "/images/pages/offers/categories/create/cover-tablet.png",
                alt: "",
            },
            href: offerCategoryRoutes.create,
        },
        {
            category: "sell",
            label: "Vendre",
            description:
                "Clarifier une proposition, structurer l'argumentaire et guider vers l'action.",
            image: {
                src: "/images/pages/offers/categories/sell/cover-mobile.png",
                tablet: "/images/pages/offers/categories/sell/cover-tablet.png",
                alt: "",
            },
            href: offerCategoryRoutes.sell,
        },
        {
            category: "improve",
            label: "Améliorer",
            description:
                "Retravailler ce qui manque de lisibilité, de cohérence ou d'efficacité.",
            image: {
                src: "/images/pages/offers/categories/improve/cover-mobile.png",
                tablet: "/images/pages/offers/categories/improve/cover-tablet.png",
                alt: "",
            },
            href: offerCategoryRoutes.improve,
        },
        {
            category: "custom",
            label: "Sur mesure",
            description:
                "Un cadre, un rythme et un périmètre pensés pour les projets plus spécifiques.",
            image: {
                src: "/images/pages/offers/categories/custom/cover-mobile.png",
                tablet: "/images/pages/offers/categories/custom/cover-tablet.png",
                alt: "",
            },
            href: offerCategoryRoutes.custom,
        },
    ],
    featuredProjects: [
        {
            label: "Norel Art",
            title: "Norel Art",
            description:
                "Une direction visuelle sensible pour présenter un univers artistique avec clarté, matière et respiration.",
            meta: "Portfolio artistique",
            href: `${publicRoutes.realisations}/norel-art`,
            image: {
                src: "/images/pages/projects/norel-art/cover-mobile.webp",
                tablet: "/images/pages/projects/norel-art/cover-tablet.webp",
                desktop: "/images/pages/projects/norel-art/cover-desktop.webp",
                alt: "Univers visuel du projet Norel Art",
            },
            tone: "brand",
            tags: ["Identité", "Portfolio", "Direction visuelle"],
        },
        {
            label: "Mystères à la carte",
            title: "Mystères à la carte",
            description:
                "Un parcours guidé pour transformer une demande complexe en expérience claire, progressive et facile à transmettre.",
            meta: "Parcours guidé",
            href: `${publicRoutes.realisations}/mysteres-a-la-carte`,
            image: {
                src: "/images/pages/projects/mysteres-a-la-carte/cover-mobile.webp",
                tablet: "/images/pages/projects/mysteres-a-la-carte/cover-tablet.webp",
                desktop: "/images/pages/projects/mysteres-a-la-carte/cover-desktop.webp",
                alt: "Univers visuel du projet Mystères à la carte",
            },
            tone: "brand",
            tags: ["UX", "Formulaire", "Parcours guidé"],
        },
    ],
    studioPortrait: {
        src: "/images/pages/studio/portrait-stephanie-mobile.png",
        tablet: "/images/pages/studio/portrait-stephanie-tablet.png",
        alt: "Portrait de Stéphanie, fondatrice d'Alchimiste Créations",
    },
} as const;

const homeDesktopSectionsContent = {
    problem: {
        eyebrow: "02 — Le point de départ",
        title: "Avant de créer un site, il faut savoir ce qu'il doit raconter.",
        description:
            "Une idée encore floue alourdit chaque décision : le message se disperse, les pages s'empilent, et le design finit par masquer l'absence de direction.",
        signalsLabel: "Ce qu'on entend souvent",
        insight: {
            label: "Le vrai point de départ",
            title: "Ce n'est pas encore un problème de design.",
            description:
                "Comprendre ce que le projet doit dire, à qui il s'adresse et quel chemin doit suivre la personne qui arrive. La clarté d'abord, l'esthétique ensuite.",
        },
        signals: [
            "Je ne sais pas par où commencer.",
            "J'ai des idées, mais rien n'est structuré.",
            "Je veux un site beau, mais surtout clair.",
            "J'ai besoin d'être guidé.",
        ],
        takeawaysLabel: "Ce que ça change",
        takeaways: [
            {
                title: "Une direction lisible",
                description:
                    "On fixe l'objectif principal, les choix arrêtent de se disperser.",
            },
            {
                title: "Un message hiérarchisé",
                description:
                    "On trie les idées : ce qui compte vraiment ressort en premier.",
            },
            {
                title: "Un parcours utile",
                description:
                    "On pose une structure qui aide à comprendre et à agir.",
            },
        ],
    },
    method: {
        eyebrow: "03 — La méthode",
        title: "Une méthode claire pour avancer sans se disperser.",
        description:
            "On transforme le flou en décisions, étape après étape. Chaque phase sert à comprendre, organiser et construire un site qui tient debout.",
        phasesLabel: "Les trois temps",
        stepsLabel: "Le déroulé détaillé",
        phases: [
            {
                title: "Clarifier",
                description: "L'objectif, le message et les priorités.",
            },
            {
                title: "Designer",
                description: "La direction traduite en interface soignée.",
            },
            {
                title: "Lancer",
                description: "Vérifications, finitions et mise en ligne.",
            },
        ],
        steps: [
            {
                title: "Comprendre le projet",
                description:
                    "Ton contexte, ton objectif et ce que le site doit vraiment provoquer.",
            },
            {
                title: "Clarifier le message",
                description:
                    "On fait ressortir ce qui doit être compris en premier.",
            },
            {
                title: "Structurer le parcours",
                description:
                    "Sections, priorités et actions organisées pour guider la lecture.",
            },
            {
                title: "Créer l'interface",
                description:
                    "Une direction visuelle cohérente, lisible et responsive.",
            },
            {
                title: "Construire la page",
                description:
                    "La maquette devient une expérience propre, prête à évoluer.",
            },
            {
                title: "Vérifier et lancer",
                description:
                    "Ajustements, contrôle du rendu, mise en ligne maîtrisée.",
            },
        ],
        action: homeActions.discoverMethod,
    },
    offers: {
        eyebrow: "04 — Les offres",
        title: "Choisis le bon point d'entrée pour ton projet.",
        description:
            "Quatre situations concrètes : créer, vendre, améliorer, ou construire quelque chose de plus spécifique.",
        guide: {
            title: "Pas besoin de savoir exactement quoi commander.",
            description:
                "Pars de là où tu en es. On ajuste ensuite le format, l'accompagnement et les priorités selon ce qui sert vraiment le projet.",
        },
        action: homeActions.seeOffers,
    },
    studio: {
        eyebrow: "05 — Le studio",
        title: "Un studio web clair, créatif et humain.",
        description:
            "Structure, design, développement et accompagnement : réunis par une seule interlocutrice, du premier échange à la mise en ligne.",
        image: homeAssetsContent.studioPortrait,
        portrait: {
            label: "Studio indépendant",
            title: "Une direction tenue, du cadrage au lancement.",
            description:
                "Une interlocutrice unique qui relie le fond, l'esthétique et la mise en ligne — sans découper le projet en silos.",
        },
        positioning: {
            label: "Positionnement",
            title: "Une approche qui garde le projet lisible.",
            description:
                "Stratégie, design et développement ne sont pas séparés. Les trois avancent ensemble : moins d'allers-retours, une intention qui reste claire.",
        },
        pillars: [
            {
                title: "Un cadre professionnel",
                description:
                    "Des étapes claires, des décisions posées, une direction tenue.",
            },
            {
                title: "Une sensibilité créative",
                description:
                    "Un design qui traduit ton identité sans sacrifier la lisibilité.",
            },
            {
                title: "Un accompagnement humain",
                description:
                    "Un projet construit dans l'échange, avec des repères simples.",
            },
        ],
        action: homeActions.seeStudio,
    },
    projects: {
        eyebrow: "01 — Réalisations",
        title: "Des réalisations qui traduisent une intention.",
        description:
            "Deux directions, une même exigence : clarifier le message, poser une direction visuelle et construire un parcours utile.",
        action: homeActions.seeProjects,
    },
} as const;

export const homePageContent = {
    hero: homeHeroContent,
    offerCategories: homeAssetsContent.offerCategories,
    featuredProjects: homeAssetsContent.featuredProjects,
    problem: homeDesktopSectionsContent.problem,
    method: homeDesktopSectionsContent.method,
    offers: homeDesktopSectionsContent.offers,
    studio: homeDesktopSectionsContent.studio,
    projects: homeDesktopSectionsContent.projects,
} as const;

export type HomePageContent = typeof homePageContent;
