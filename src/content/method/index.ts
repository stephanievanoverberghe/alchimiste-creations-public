import { publicCtas } from "@/config/navigation";

const methodActions = {
    presentProject: {
        ...publicCtas.presentProject,
    },
    seeOffers: {
        ...publicCtas.seeOffers,
    },
} as const;

const methodAssets = {
    heroImages: {
        mobile: "/images/pages/method/hero-mobile.png",
        tablet: "/images/pages/method/hero-tablet.png",
        desktop: "/images/pages/method/hero-desktop.png",
        alt: "Bureau de travail avec carnet, ordinateur et ambiance de méthode créative",
    },
    chapterImages: {
        clarifier: {
            src: "/images/pages/method/pillars/clarifier-mobile.png",
            tablet: "/images/pages/method/pillars/clarifier-tablet.png",
            alt: "Ambiance de travail pour clarifier la direction d'un projet web",
        },
        designer: {
            src: "/images/pages/method/pillars/designer-mobile.png",
            tablet: "/images/pages/method/pillars/designer-tablet.png",
            alt: "Interface et direction visuelle pour designer un projet web",
        },
        lancer: {
            src: "/images/pages/method/pillars/lancer-mobile.png",
            tablet: "/images/pages/method/pillars/lancer-tablet.png",
            alt: "Préparation du lancement d'un site web sur mesure",
        },
    },
    roleImage: {
        src: "/images/pages/method/roles/role-desktop.png",
        alt: "Ambiance de collaboration autour d'un projet web",
    },
} as const;

const methodHeroContent = {
    images: methodAssets.heroImages,
    eyebrow: "Méthode Alchimiste",
    titleBefore: "Une méthode qui rend chaque projet ",
    titleAccent: "lisible",
    titleAfter: ", du flou au lancement.",
    description:
        "Clarifier, designer, lancer : trois temps, sept étapes, un livrable et une décision à chaque pas. Voici comment ton projet avance sans se disperser.",
    primaryAction: methodActions.presentProject,
    journeyCta: {
        label: "Suivre le parcours",
        href: "#parcours",
    },
    tempsLabel: "Les trois temps",
    temps: [
        {
            verb: "Clarifier",
            summary: "Comprendre le fond et trancher les priorités.",
        },
        {
            verb: "Designer",
            summary: "Structurer les pages et donner une forme claire.",
        },
        {
            verb: "Lancer",
            summary: "Développer, vérifier et mettre en ligne proprement.",
        },
    ],
} as const;

const methodIntentionContent = {
    eyebrow: "01 — Pourquoi une méthode",
    title: "On ne commence pas par dessiner. On commence par comprendre.",
    description:
        "La méthode sert d'abord à transformer une matière encore floue — idées, envies, contraintes, contenus — en base de travail claire : objectif, message, parcours et priorités.",
    signalsLabel: "Ce qu'on entend au départ",
    signals: [
        "J'ai plein d'idées, mais rien n'est structuré.",
        "Je ne sais pas par où commencer.",
        "Je veux un site beau, mais surtout clair.",
        "J'ai besoin d'être guidé, étape par étape.",
    ],
    insight: {
        label: "Le vrai point de départ",
        title: "Le flou n'est pas un blocage. C'est la matière à organiser.",
        description:
            "On part de ce que tu as déjà : on trie, on relie, on décide. Une fois ce socle posé, le design traduit le projet au lieu d'essayer de le deviner.",
    },
    takeawaysLabel: "Ce que le cadre installe",
    takeaways: [
        {
            title: "Une direction lisible",
            description:
                "Un objectif principal fixé : les choix arrêtent de se disperser.",
        },
        {
            title: "Un message hiérarchisé",
            description:
                "Ce qui compte vraiment ressort en premier, le reste vient soutenir.",
        },
        {
            title: "Des décisions nettes",
            description:
                "On sait quoi trancher, à quel moment et pourquoi.",
        },
    ],
} as const;

const methodJourneyContent = {
    eyebrow: "02 — Le parcours",
    title: "Sept étapes, du premier échange à la mise en ligne.",
    description:
        "Chaque étape clarifie une partie du projet, produit un livrable concret et attend une décision claire de ta part avant de passer à la suivante.",
    deliverableLabel: "Le livrable",
    roleLabel: "Ton rôle",
    chapters: [
        {
            verb: "Clarifier",
            summary:
                "Comprendre le fond, trier les idées, décider ce qui doit guider le site.",
            image: methodAssets.chapterImages.clarifier,
            steps: [
                {
                    title: "Comprendre le projet",
                    description:
                        "On écoute le contexte, l'objectif, les publics visés et les contraintes.",
                    deliverable:
                        "Une note de cadrage qui pose le projet noir sur blanc.",
                    role: "Tu partages ton univers, tes contenus et tes intentions.",
                },
                {
                    title: "Clarifier les besoins",
                    description:
                        "On trie les idées pour distinguer l'essentiel du secondaire.",
                    deliverable:
                        "Une hiérarchie des priorités validée ensemble.",
                    role: "Tu tranches ce qui compte vraiment pour ce lancement.",
                },
            ],
        },
        {
            verb: "Designer",
            summary:
                "Structurer les pages, puis donner une forme visuelle fidèle au projet.",
            image: methodAssets.chapterImages.designer,
            steps: [
                {
                    title: "Structurer les pages",
                    description:
                        "On définit les pages, les sections clés et le parcours du visiteur.",
                    deliverable:
                        "Une arborescence et une trame de contenu par page.",
                    role: "Tu valides le chemin que suivra ton visiteur.",
                },
                {
                    title: "Créer le design",
                    description:
                        "On donne une forme visuelle claire, belle et fidèle à ton univers.",
                    deliverable:
                        "Une direction visuelle, puis les maquettes des pages.",
                    role: "Tu réagis sur une direction, pas sur une page blanche.",
                },
            ],
        },
        {
            verb: "Lancer",
            summary:
                "Développer, vérifier, puis mettre en ligne proprement et accompagner.",
            image: methodAssets.chapterImages.lancer,
            steps: [
                {
                    title: "Développer le site",
                    description:
                        "On transforme les maquettes en site réel, responsive et rapide.",
                    deliverable:
                        "Un site fonctionnel, consultable dès l'aperçu.",
                    role: "Tu fournis tes contenus définitifs et tes accès.",
                },
                {
                    title: "Vérifier la qualité",
                    description:
                        "On relit, on teste et on corrige avant toute mise en ligne.",
                    deliverable:
                        "Une recette : liens, affichage, mobile et formulaires vérifiés.",
                    role: "Tu parcours le site et signales ce qui doit être ajusté.",
                },
                {
                    title: "Mettre en ligne",
                    description:
                        "On déploie proprement et on accompagne les premiers pas.",
                    deliverable:
                        "Le site en ligne, avec un temps de prise en main.",
                    role: "Tu prends la main sur ton site, avec un cadre pour t'appuyer.",
                },
            ],
        },
    ],
} as const;

const methodRolesContent = {
    eyebrow: "03 — La collaboration",
    title: "Un projet construit avec toi, pas à ta place.",
    description:
        "La méthode installe un cadre où chacun sait ce qu'il apporte, ce qui est attendu et quelle est la prochaine étape.",
    image: methodAssets.roleImage,
    principle: {
        label: "Répartition claire",
        title: "Tu gardes la vision. Le studio tient le cadre.",
        description:
            "Ton expertise du projet rencontre une méthode claire : on sait quoi décider, à quel moment, et pourquoi.",
    },
    result:
        "Le projet avance avec des retours utiles, des validations nettes et moins de flou entre deux étapes.",
    client: {
        title: "Tu apportes",
        items: [
            "Ton projet et ton univers",
            "Tes besoins et tes priorités",
            "Tes contenus et informations",
            "Tes retours et validations",
        ],
    },
    studio: {
        title: "Le studio apporte",
        items: [
            "Le cadre et la méthode",
            "La structure et le design",
            "Le développement",
            "La qualité et l'accompagnement",
        ],
    },
} as const;

const methodAdaptationContent = {
    eyebrow: "04 — Un cadre qui s'adapte",
    title: "Le même cap, quelle que soit l'ampleur du projet.",
    description:
        "La base ne change pas : comprendre, clarifier, structurer, créer, développer, vérifier, livrer. Ensuite, l'intensité du cadrage s'ajuste au type de projet.",
    principle: {
        label: "Même méthode, intensité différente",
        title: "On garde le cap, puis on ajuste le niveau d'accompagnement.",
        description:
            "Un site vitrine, une refonte ou un projet plus spécifique n'ont pas besoin du même niveau de cadrage. La méthode reste stable ; son application s'adapte au besoin réel.",
    },
    families: [
        {
            group: "Créer",
            entries: ["Site vitrine", "One Page", "Landing Page"],
        },
        {
            group: "Vendre",
            entries: ["Boutique en ligne", "Formation en ligne"],
        },
        {
            group: "Améliorer",
            entries: ["Diagnostic Web", "Refonte", "Maintenance"],
        },
        {
            group: "Adapter",
            entries: ["Projet sur mesure"],
        },
    ],
    note:
        "Les fonctionnalités avancées ou interfaces spécifiques sont étudiées seulement si le besoin est clair, utile et cohérent.",
    action: methodActions.seeOffers,
} as const;

export const methodPageContent = {
    hero: methodHeroContent,
    intention: methodIntentionContent,
    journey: methodJourneyContent,
    roles: methodRolesContent,
    adaptation: methodAdaptationContent,
} as const;

export type MethodPageContent = typeof methodPageContent;
