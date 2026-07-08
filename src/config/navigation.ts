export const publicRoutes = {
    home: "/",
    method: "/methode-alchimiste",
    offers: "/offres",
    realisations: "/realisations",
    about: "/a-propos",
    contact: "/contact",
    projectRequest: "/demande-de-projet",
} as const;

export const legalRoutes = {
    legalNotice: "/mentions-legales",
    privacy: "/politique-de-confidentialite",
    cookies: "/gestion-des-cookies",
    cgu: "/conditions-generales-utilisation",
    cgs: "/conditions-generales-de-services",
} as const;

export const privateRoutes = {
    admin: "/admin",
    clientSpace: "/espace-client",
    login: "/connexion",
    activation: "/activation",
    api: "/api",
} as const;

export const offerRoutes = {
    siteVitrine: `${publicRoutes.offers}/site-vitrine`,
    onePage: `${publicRoutes.offers}/one-page`,
    landingPage: `${publicRoutes.offers}/landing-page`,
    boutiqueEnLigne: `${publicRoutes.offers}/boutique-en-ligne`,
    formationEnLigne: `${publicRoutes.offers}/formation-en-ligne`,
    diagnosticWeb: `${publicRoutes.offers}/diagnostic-web`,
    refonte: `${publicRoutes.offers}/refonte`,
    maintenance: `${publicRoutes.offers}/maintenance`,
    projetSurMesure: `${publicRoutes.offers}/projet-sur-mesure`,
} as const;

export const offerCategoryRoutes = {
    create: `${publicRoutes.offers}#creer`,
    improve: `${publicRoutes.offers}#ameliorer`,
    // Vendre et Sur-mesure ont fusionné dans le bloc « sur devis » de /offres (A3).
    sell: `${publicRoutes.offers}#sur-devis`,
    custom: `${publicRoutes.offers}#sur-devis`,
} as const;

export const publicCtas = {
    discoverMethod: {
        href: publicRoutes.method,
        label: "Découvrir la méthode",
    },
    discoverOffers: {
        href: publicRoutes.offers,
        label: "Découvrir les offres",
    },
    presentProject: {
        href: publicRoutes.projectRequest,
        label: "Présenter mon projet",
    },
    seeOffers: {
        href: publicRoutes.offers,
        label: "Voir les offres",
    },
    seeProjects: {
        href: publicRoutes.realisations,
        label: "Voir les réalisations",
    },
} as const;

export const mainNavigationLinks = [
    {
        href: publicRoutes.home,
        icon: "home",
        label: "Accueil",
        description: "Promesse et parcours global",
    },
    {
        href: publicRoutes.method,
        icon: "method",
        label: "Méthode",
        description: "Comprendre le cadre",
    },
    {
        href: publicRoutes.offers,
        icon: "offers",
        label: "Offres",
        description: "Choisir une prestation",
    },
    {
        href: publicRoutes.realisations,
        icon: "realisations",
        label: "Réalisations",
        description: "Voir des cas concrets",
    },
    {
        href: publicRoutes.about,
        icon: "about",
        label: "À propos",
        description: "Découvrir l'approche",
    },
    {
        href: publicRoutes.contact,
        icon: "contact",
        label: "Contact",
        description: "Poser une question",
    },
] as const;

export const footerNavigationLinks = [
    ...mainNavigationLinks
        .filter((link) => link.href !== publicRoutes.home)
        .map(({ href, label }) => ({ href, label })),
    { href: publicRoutes.projectRequest, label: "Demande de projet" },
] as const;

export const footerOfferLinks = [
    { href: offerCategoryRoutes.create, label: "Créer" },
    { href: offerCategoryRoutes.sell, label: "Vendre" },
    { href: offerCategoryRoutes.improve, label: "Améliorer" },
    { href: offerCategoryRoutes.custom, label: "Sur mesure" },
] as const;

export const legalNavigationLinks = [
    { href: legalRoutes.legalNotice, label: "Mentions légales" },
    { href: legalRoutes.privacy, label: "Confidentialité" },
    { href: legalRoutes.cookies, label: "Cookies" },
    { href: legalRoutes.cgu, label: "CGU" },
    { href: legalRoutes.cgs, label: "CGS" },
] as const;
