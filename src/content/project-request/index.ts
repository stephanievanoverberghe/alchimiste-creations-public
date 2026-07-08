import { legalRoutes, publicRoutes } from "@/config/navigation";

const projectRequestAssets = {
    hero: {
        mobile: "/images/common/final-cta-mobile.png",
        tablet: "/images/common/final-cta-tablet.png",
        desktop: "/images/common/final-cta-desktop.png",
        alt: "Ambiance de lancement pour présenter un projet web",
    },
} as const;

const projectTypeOptions = [
    {
        value: "site-vitrine",
        label: "Site vitrine",
        description: "Présenter ton activité, ton univers et tes services.",
    },
    {
        value: "one-page",
        label: "One Page",
        description: "Aller droit au but avec une page claire et fluide.",
    },
    {
        value: "landing-page",
        label: "Landing Page",
        description: "Mettre en avant une offre, une action ou un lancement.",
    },
    {
        value: "boutique-en-ligne",
        label: "Boutique en ligne",
        description: "Vendre des produits avec une expérience soignée.",
    },
    {
        value: "formation-en-ligne",
        label: "Formation en ligne",
        description: "Organiser une offre, des modules ou un accès apprenant.",
    },
    {
        value: "diagnostic-web",
        label: "Diagnostic Web",
        description: "Comprendre ce qui bloque avant de refaire ou d'améliorer.",
    },
    {
        value: "refonte",
        label: "Refonte",
        description: "Repenser un site existant qui ne sert plus assez le projet.",
    },
    {
        value: "maintenance",
        label: "Maintenance",
        description: "Faire vivre un site déjà en ligne sans repartir de zéro.",
    },
    {
        value: "projet-sur-mesure",
        label: "Projet sur mesure",
        description: "Construire un parcours ou une interface plus spécifique.",
    },
    {
        value: "unknown",
        label: "Je ne sais pas encore",
        description: "On choisira le bon format après avoir compris ton besoin.",
    },
] as const;

const maturityOptions = [
    { value: "idea", label: "Idée en réflexion" },
    { value: "preparation", label: "Projet en préparation" },
    { value: "content-ready", label: "Contenus déjà prêts" },
    { value: "identity-ready", label: "Identité visuelle existante" },
    { value: "online", label: "Site déjà en ligne" },
    { value: "refonte", label: "Refonte à prévoir" },
    { value: "urgent", label: "Besoin urgent" },
    { value: "unknown", label: "Je ne sais pas encore" },
] as const;

const budgetOptions = [
    { value: "under-1000", label: "Moins de 1 000 €" },
    { value: "1000-2500", label: "1 000 € à 2 500 €" },
    { value: "2500-5000", label: "2 500 € à 5 000 €" },
    { value: "5000-10000", label: "5 000 € à 10 000 €" },
    { value: "over-10000", label: "Plus de 10 000 €" },
    { value: "unknown", label: "Je ne sais pas encore" },
] as const;

const deadlineOptions = [
    { value: "flexible", label: "Délai flexible" },
    { value: "one-month", label: "Dans le mois" },
    { value: "two-three-months", label: "Dans 2 à 3 mois" },
    { value: "quarter", label: "Dans le trimestre" },
    { value: "later", label: "Plus tard" },
    { value: "unknown", label: "Je ne sais pas encore" },
] as const;

export const projectRequestPageContent = {
    activeHref: publicRoutes.projectRequest,
    seo: {
        title: "Présenter mon projet — Alchimiste Créations",
        description:
            "Présente ton projet web à Alchimiste Créations avec un parcours guidé : besoin, contexte, budget indicatif, délai et récapitulatif avant envoi.",
    },
    hero: {
        images: projectRequestAssets.hero,
        eyebrow: "Demande de projet",
        titleBefore: "Présente ton projet, ",
        titleAccent: "même encore flou",
        titleAfter: ".",
        description:
            "Un parcours guidé, pas un cahier des charges : quelques étapes simples pour poser ton besoin, ton contexte et préparer une vraie suite.",
        primaryAction: {
            href: "#demande",
            label: "Commencer ma demande",
        },
        reassuranceLabel: "Ce qui t'attend",
        reassurance: [
            "Pas besoin d'un brief parfait",
            "Budget et délai restent indicatifs",
            "Récapitulatif avant l'envoi",
        ],
    },
    intro: {
        eyebrow: "Tunnel de demande",
        title: "Une demande claire, sans formulaire interminable.",
        description:
            "Le parcours aide à comprendre ton point de départ, ton besoin et les informations utiles pour te répondre correctement.",
    },
    wizard: {
        contactFallback: {
            href: publicRoutes.contact,
            label: "Pour une question générale, passe par la page contact.",
        },
        steps: [
            {
                id: "start",
                eyebrow: "01 - Demarrer",
                title: "On commence simplement.",
                description:
                    "Tu poses les bases de ton projet, même si tout n'est pas encore défini.",
            },
            {
                id: "project-type",
                eyebrow: "02 - Type de projet",
                title: "Quel point de départ ressemble le plus à ton besoin ?",
                description:
                    "Choisis l'option la plus proche. Si tu hésites, sélectionne Je ne sais pas encore.",
            },
            {
                id: "identity",
                eyebrow: "03 - Identite",
                title: "Qui porte le projet ?",
                description:
                    "On garde l'essentiel : un nom et un e-mail pour pouvoir te recontacter.",
            },
            {
                id: "project-context",
                eyebrow: "04 - Contexte",
                title: "Ton projet a-t-il déjà un nom ou un site ?",
                description:
                    "Ces informations sont facultatives. Elles aident seulement à situer le contexte plus vite.",
            },
            {
                id: "need",
                eyebrow: "05 - Besoin",
                title: "Qu'est-ce que tu veux créer, clarifier ou améliorer ?",
                description:
                    "Explique avec tes mots. Une description imparfaite suffit pour commencer.",
            },
            {
                id: "objective",
                eyebrow: "06 - Objectif",
                title: "Qu'est-ce qui doit changer grâce au projet ?",
                description:
                    "On identifie le résultat attendu et l'état d'avancement actuel.",
            },
            {
                id: "frame",
                eyebrow: "07 - Cadre",
                title: "Budget et délai.",
                description:
                    "Ces réponses restent indicatives. Elles servent à proposer un cadre réaliste.",
            },
            {
                id: "details",
                eyebrow: "08 - Details",
                title: "Une précision importante ?",
                description:
                    "Ajoute ce qui peut aider : contrainte, inspiration, contenu prêt ou point sensible.",
            },
            {
                id: "consent",
                eyebrow: "09 - Consentement",
                title: "Dernier point avant le recapitulatif.",
                description:
                    "Le consentement concerne uniquement le traitement de ta demande et les échanges autour de ton projet.",
            },
            {
                id: "review",
                eyebrow: "10 - Recapitulatif",
                title: "Vérifie ta demande avant envoi.",
                description:
                    "Relis les informations importantes avant l'envoi et corrige ce qui doit l'être.",
            },
        ],
        projectTypes: projectTypeOptions,
        maturityOptions,
        budgetOptions,
        deadlineOptions,
        privacyHref: legalRoutes.privacy,
    },
    confirmation: {
        eyebrow: "Demande envoyée",
        title: "Merci, ta demande est bien transmise.",
        description:
            "Je peux maintenant relire ton besoin, vérifier le bon format d'accompagnement et revenir vers toi avec une suite claire.",
        nextSteps: [
            "Relire le besoin et le contexte.",
            "Vérifier le bon format d'accompagnement.",
            "Te répondre avec une proposition de suite.",
        ],
    },
} as const;

export type ProjectRequestPageContent = typeof projectRequestPageContent;
