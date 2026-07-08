import { publicRoutes } from "@/config/navigation";

export const marketingPages = {
    offres: {
        activeHref: publicRoutes.offers,
        eyebrow: "Offres",
        title: "Des offres pour créer, vendre ou améliorer ton site.",
        description:
            "Choisis le bon point de départ selon ton besoin actuel : poser une présence claire, fluidifier la vente, améliorer l'existant ou construire une solution sur mesure.",
    },
    realisations: {
        activeHref: publicRoutes.realisations,
        eyebrow: "Réalisations",
        title: "Des projets web pensés pour être compris vite.",
        description:
            "Chaque réalisation met l'accent sur une direction claire, une expérience mobile propre et une identité qui sert vraiment le projet.",
    },
    methode: {
        activeHref: publicRoutes.method,
        eyebrow: "Méthode Alchimiste",
        title: "Une méthode simple pour avancer sans dispersion.",
        description:
            "On clarifie le besoin, on cadre le parcours, on design l'interface puis on construit une base technique propre et maintenable.",
    },
    aPropos: {
        activeHref: publicRoutes.about,
        eyebrow: "À propos",
        title: "Un studio pour relier stratégie, design et développement.",
        description:
            "Alchimiste Créations accompagne les projets web avec une approche claire, sensible et concrète, pensée pour transformer une idée en interface utile.",
    },
    demandeDeProjet: {
        activeHref: publicRoutes.projectRequest,
        eyebrow: "Demande de projet",
        title: "Présente ton projet, même s'il n'est pas encore parfaitement clair.",
        description:
            "Cette page servira à cadrer ton besoin, comprendre tes priorités et préparer les bonnes prochaines étapes.",
    },
    contact: {
        activeHref: publicRoutes.contact,
        eyebrow: "Contact",
        title: "Un premier échange pour clarifier la suite.",
        description:
            "On prend le temps de comprendre ton contexte, ton objectif et le type d'accompagnement le plus adapté.",
    },
};
