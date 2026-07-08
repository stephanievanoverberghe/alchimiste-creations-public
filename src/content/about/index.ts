import { publicCtas } from "@/config/navigation";

const aboutActions = {
    discoverMethod: {
        ...publicCtas.discoverMethod,
    },
    presentProject: {
        ...publicCtas.presentProject,
    },
    seeProjects: {
        ...publicCtas.seeProjects,
    },
} as const;

const aboutAssetsContent = {
    hero: {
        mobile: "/images/pages/studio/hero-mobile.png",
        tablet: "/images/pages/studio/hero-tablet.png",
        desktop: "/images/pages/studio/hero-desktop.png",
        alt: "Ambiance du studio Alchimiste Créations",
    },
    portrait: {
        src: "/images/pages/studio/portrait-stephanie-mobile.png",
        tablet: "/images/pages/studio/portrait-stephanie-tablet.png",
        desktop: "/images/pages/studio/portrait-stephanie-tablet.png",
        alt: "Portrait de Stéphanie, fondatrice d'Alchimiste Créations",
    },
} as const;

/**
 * Contenu éditorial de la page à-propos (A7) — l'humain du studio en un
 * seul récit vertical : héros à repères, la personne (portrait), le
 * parcours (trois matières), les valeurs incarnées et le format solo
 * assumé. L'appel final est porté par la bande CTA du footer.
 */
export const aboutPageContent = {
    seo: {
        title: "À propos — Alchimiste Créations, studio web indépendant",
        description:
            "Découvrez Alchimiste Créations, studio web indépendant porté par Stéphanie, développeuse web et graphiste, pour créer des sites clairs, sensibles et bien structurés.",
    },
    hero: {
        images: aboutAssetsContent.hero,
        eyebrow: "À propos",
        titleBefore: "Derrière le studio, ",
        titleAccent: "une seule personne",
        titleAfter: ".",
        description:
            "Alchimiste Créations est le studio web solo de Stéphanie, développeuse et graphiste. Le même regard porte ton projet du premier échange à la mise en ligne : le message, la direction visuelle et le code.",
        primaryAction: aboutActions.presentProject,
        meetCta: {
            label: "Faire connaissance",
            href: "#la-personne",
        },
        reperesLabel: "Le studio en trois repères",
        reperes: [
            {
                label: "Fondatrice",
                title: "Stéphanie",
                description: "Développeuse web et graphiste.",
            },
            {
                label: "Format",
                title: "Studio solo",
                description: "Une interlocutrice unique, sans intermédiaire.",
            },
            {
                label: "Fil conducteur",
                title: "Clarifier. Designer. Lancer.",
                description: "La même méthode sur chaque projet.",
            },
        ],
    },
    person: {
        id: "la-personne",
        eyebrow: "01 — La personne",
        title: "Stéphanie, développeuse web et graphiste.",
        description:
            "J'ai fait du design et du code deux moitiés d'un même métier : comprendre ce que ton projet veut dire, puis le rendre visible, lisible et agréable à utiliser.",
        portrait: {
            image: aboutAssetsContent.portrait,
            label: "Fondatrice",
            title: "Une interlocutrice, du premier échange à la mise en ligne.",
            description:
                "Tu parles toujours à la personne qui conçoit et construit réellement ton site.",
        },
        insight: {
            label: "Le pari du studio",
            title: "Quand la même personne dessine et développe, rien ne se perd en route.",
            description:
                "Pas de brief qui se déforme entre un graphiste, un chef de projet et un développeur : l'intention posée ensemble est celle qui arrive en ligne.",
        },
    },
    path: {
        eyebrow: "02 — Le parcours",
        title: "Trois matières réunies en un seul regard.",
        description:
            "Le studio s'est construit en reliant ce qui est souvent séparé : l'image, l'expérience et le code. C'est ce croisement qui fait la manière Alchimiste.",
        steps: [
            {
                title: "L'image",
                description:
                    "Le graphisme et la direction visuelle : donner une forme juste à une idée, une identité, une ambiance.",
            },
            {
                title: "Le parcours",
                description:
                    "L'expérience utilisateur : comprendre comment un visiteur lit, hésite, cherche et décide.",
            },
            {
                title: "Le code",
                description:
                    "Le développement front-end React / Next.js : des interfaces fiables, responsive et durables.",
            },
        ],
        synthesis: {
            label: "La synthèse",
            title: "Le studio réunit les trois.",
            description:
                "Un regard entier qui suit ton projet de l'intention au site en ligne, sans rupture entre le sens, la forme et la technique.",
        },
    },
    values: {
        eyebrow: "03 — Les valeurs",
        title: "Ce qui guide chaque projet, concrètement.",
        description:
            "Pas des mots d'agence affichés au mur : des repères qui se voient dans le site livré.",
        message: {
            label: "La boussole",
            title: "Un bon site est beau, oui — mais surtout évident.",
            description:
                "Évident pour ton visiteur, fidèle à ton projet et solide à l'usage : c'est à ça que chaque décision est mesurée.",
        },
        items: [
            {
                title: "Clarté",
                description:
                    "Ton visiteur comprend en quelques secondes ce que tu proposes et pourquoi ça le concerne.",
            },
            {
                title: "Progression",
                description:
                    "Le projet avance étape par étape : chaque décision est posée au bon moment, jamais au hasard.",
            },
            {
                title: "Créativité",
                description:
                    "Le design ne décore pas : il aide à comprendre et donne une vraie personnalité à ton site.",
            },
            {
                title: "Qualité",
                description:
                    "Le code rend l'expérience fluide, responsive et durable — pas seulement fonctionnelle.",
            },
            {
                title: "Humain",
                description:
                    "Le projet se construit avec écoute et retours : tu restes dans les décisions qui comptent.",
            },
        ],
    },
    solo: {
        eyebrow: "04 — Studio solo",
        title: "Un petit format, de vrais avantages.",
        description:
            "Un studio d'une personne n'est pas une agence en réduction : c'est un autre format, avec des forces propres — à condition d'un cadre solide.",
        gains: [
            {
                title: "Une seule interlocutrice",
                description:
                    "Tu expliques ton projet une fois. La personne qui t'écoute est celle qui conçoit et développe.",
            },
            {
                title: "Des décisions rapides",
                description:
                    "Pas de chaîne de validation interne : une question posée, une réponse claire, le projet avance.",
            },
            {
                title: "Un cadre qui sécurise",
                description:
                    "La méthode borne chaque étape : tu sais toujours où en est le projet et ce qui vient ensuite.",
            },
            {
                title: "Un site cohérent",
                description:
                    "Le message, le design et le code sont pensés ensemble, du premier échange au lancement.",
            },
        ],
        methodAction: aboutActions.discoverMethod,
        projectsAction: aboutActions.seeProjects,
    },
} as const;

export type AboutPageContent = typeof aboutPageContent;
