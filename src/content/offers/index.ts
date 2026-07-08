import { offerRoutes, publicCtas } from "@/config/navigation";

const offersActions = {
    discoverMethod: {
        ...publicCtas.discoverMethod,
    },
    presentProject: {
        ...publicCtas.presentProject,
    },
} as const;

const offersAssets = {
    heroImages: {
        mobile: "/images/pages/offers/hero-mobile.png",
        tablet: "/images/pages/offers/hero-tablet.png",
        desktop: "/images/pages/offers/hero-desktop.png",
        alt: "Ambiance de bureau créatif pour choisir un accompagnement web sur mesure",
    },
    create: {
        src: "/images/pages/offers/categories/create/cover-offres-mobile.png",
        tablet: "/images/pages/offers/categories/create/cover-tablet.png",
        alt: "Interface web en création sur un écran",
    },
    improve: {
        src: "/images/pages/offers/categories/improve/cover-offres-mobile.png",
        tablet: "/images/pages/offers/categories/improve/cover-tablet.png",
        alt: "Interface web en amélioration et optimisation",
    },
    sell: {
        src: "/images/pages/offers/categories/sell/cover-offres-mobile.png",
        tablet: "/images/pages/offers/categories/sell/cover-tablet.png",
        alt: "Interface de vente et présentation d'offre en ligne",
    },
} as const;

const offersHeroContent = {
    images: offersAssets.heroImages,
    eyebrow: "Offres",
    titleBefore: "Choisis le cadre qui fait ",
    titleAccent: "avancer",
    titleAfter: " ton projet.",
    description:
        "Cinq offres clé-en-main aux tarifs assumés, et des accompagnements sur mesure pour les projets plus ambitieux. Tu n'as pas besoin de connaître la solution : on part de ta situation.",
    primaryAction: offersActions.presentProject,
    situationsLabel: "Tu veux…",
    situations: [
        { label: "Créer un site", href: "#creer" },
        { label: "Améliorer l'existant", href: "#ameliorer" },
        { label: "Vendre en ligne", href: "#sur-devis" },
    ],
} as const;

const offersOrientationContent = {
    eyebrow: "01 — Par où commencer",
    title: "Le bon accompagnement dépend de ton point de départ.",
    description:
        "Tu peux arriver avec une idée, un site existant ou un projet plus avancé. Cette page t'aide à repérer le cadre le plus utile, sans figer ton projet trop tôt.",
    questions: [
        "Créer une présence claire en ligne ?",
        "Présenter une offre en peu de pages ?",
        "Améliorer un site qui ne convertit plus ?",
        "Analyser ce qui bloque avant de refaire ?",
        "Vendre ou transmettre en ligne ?",
        "Cadrer un projet plus spécifique ?",
    ],
    note:
        "Si tu hésites entre plusieurs offres, c'est normal : le bon cadre se confirme après un premier échange.",
} as const;

const offersTurnkeyContent = {
    eyebrow: "02 — Offres clé-en-main",
    title: "Des offres au périmètre clair, au tarif assumé.",
    description:
        "Chaque offre affiche un point de départ « à partir de ». Le périmètre exact se confirme ensuite selon ton contexte, tes contenus et le niveau d'accompagnement.",
    families: [
        {
            id: "creer",
            label: "Créer",
            eyebrow: "Partir d'une base claire",
            description:
                "Transformer une idée ou une activité en présence web claire et crédible.",
            image: offersAssets.create,
            offers: [
                {
                    title: "One-page",
                    description:
                        "Une page unique, fluide, pensée pour être comprise en un coup d'œil.",
                    price: "À partir de 1 200 €",
                    href: offerRoutes.onePage,
                },
                {
                    title: "Landing page",
                    description:
                        "Une page focalisée sur une offre précise, conçue pour guider vers une action.",
                    price: "À partir de 1 500 €",
                    href: offerRoutes.landingPage,
                },
                {
                    title: "Site vitrine",
                    description:
                        "Ton activité, ton univers et tes offres dans un site clair, complet et rassurant.",
                    price: "À partir de 2 000 €",
                    href: offerRoutes.siteVitrine,
                },
            ],
        },
        {
            id: "ameliorer",
            label: "Améliorer",
            eyebrow: "Réparer ce qui bloque",
            description:
                "Redonner de la clarté et de l'efficacité à un site existant.",
            image: offersAssets.improve,
            offers: [
                {
                    title: "Diagnostic web",
                    description:
                        "Comprendre ce qui bloque et quelles priorités traiter avant d'investir plus loin.",
                    price: "À partir de 350 €",
                    href: offerRoutes.diagnosticWeb,
                },
                {
                    title: "Refonte",
                    description:
                        "Repenser un site existant pour le rendre plus lisible, cohérent et efficace.",
                    price: "À partir de 2 500 €",
                    href: offerRoutes.refonte,
                },
            ],
        },
    ],
} as const;

const offersOnQuoteContent = {
    eyebrow: "03 — Sur projet, sur devis",
    title: "Des projets plus ambitieux, cadrés après un échange.",
    description:
        "Boutique, formation, projet spécifique : ces accompagnements se chiffrent sur mesure. On part de ton besoin réel, puis on définit ensemble le bon périmètre.",
    image: offersAssets.sell,
    imageCaption: "On cadre d'abord, on chiffre ensuite.",
    quoteLabel: "Sur devis",
    offers: [
        {
            title: "Boutique en ligne",
            description:
                "Vendre des produits ou services avec un catalogue clair et un parcours d'achat simple.",
            href: offerRoutes.boutiqueEnLigne,
        },
        {
            title: "Formation en ligne",
            description:
                "Donner une forme claire à ton contenu pour le transmettre et le vendre.",
            href: offerRoutes.formationEnLigne,
        },
        {
            title: "Projet sur mesure",
            description:
                "Un cadre précis pour un besoin plus complexe, évolutif ou atypique.",
            href: offerRoutes.projetSurMesure,
        },
    ],
    maintenance: {
        label: "Après la mise en ligne",
        title: "Maintenance & évolutions",
        description:
            "Des ajustements propres et maîtrisés, réservés aux sites que je réalise.",
        price: "À partir de 180 € / intervention",
        href: offerRoutes.maintenance,
    },
} as const;

const offersNextStepsContent = {
    eyebrow: "04 — On choisit ensemble",
    title: "Tu n'as pas besoin de choisir seul.",
    description:
        "La première étape sert à comprendre ton contexte, puis à identifier l'offre ou le cadre le plus juste.",
    steps: [
        {
            title: "Tu présentes ton projet",
            description:
                "Quelques lignes suffisent : ton contexte, ton besoin et ce que tu aimerais faire avancer.",
        },
        {
            title: "On clarifie le besoin",
            description:
                "On regarde ce qui est déjà clair, ce qui manque encore et ce qui doit être priorisé.",
        },
        {
            title: "Le bon cadre est identifié",
            description:
                "On relie ton besoin à l'offre la plus adaptée, ou à un accompagnement plus spécifique.",
        },
        {
            title: "Tu reçois une suite claire",
            description:
                "Tu sais quel format choisir, quel périmètre prévoir et quelle prochaine étape lancer.",
        },
    ],
    action: offersActions.presentProject,
    methodLink: offersActions.discoverMethod,
} as const;

export const offersPageContent = {
    hero: offersHeroContent,
    orientation: offersOrientationContent,
    turnkey: offersTurnkeyContent,
    onQuote: offersOnQuoteContent,
    nextSteps: offersNextStepsContent,
} as const;

export type OffersPageContent = typeof offersPageContent;
export {
    getOfferDetailBySlug,
    offerDetailPages,
} from "./details";
export type { OfferDetailContent as OfferDetailPageContent } from "./details";
