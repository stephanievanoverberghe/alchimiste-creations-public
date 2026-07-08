import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const onePageOffer: OfferDetailContent = {
    slug: "one-page",
    family: "Créer un site",
    seo: {
        title: "One-page — Alchimiste Créations",
        description:
            "Alchimiste Créations crée des sites One-page sur mesure pour présenter simplement une activité, une personne, un projet ou une offre sans créer un site complet.",
    },
    hero: {
        eyebrow: "One-page",
        title: "Création de site One-page sur mesure.",

        description:
            "Une mini-présence complète sur une seule page pour présenter l'essentiel d'une activité, d'une personne, d'un projet ou d'une offre simple.",
        price: "À partir de 1 200 €",
        images: createOfferHeroImages({
            category: "create",
            folder: "one-page",
            alt: "Ambiance de conception pour une page web unique",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Présenter l'essentiel sans construire un site complet.",
        description:
            "La One-page sert à poser une présence claire, simple et professionnelle quand le projet peut être compris sur une seule page bien structurée.",
        questions: [
            "Qui es-tu ou que présentes-tu ?",
            "Que doit-on comprendre en moins d'une minute ?",
            "Quelles informations suffisent pour expliquer le projet ?",
            "Quel univers doit être ressenti rapidement ?",
            "Quel contact ou lien simple doit être accessible ?",
            "Qu'est-ce qui évite de créer plusieurs pages ?",
        ],
        message:
            "Une One-page réussie ne dit pas tout. Elle dit l'essentiel, au bon endroit.",
    },
    qualification: {
        title: "Le bon format quand une page bien organisée suffit.",
        adapted: {
            title: "Adapté si",
            items: [
                "Tu veux présenter une activité, une personne, un projet ou une offre simple.",
                "Ton message peut tenir sur une page structurée.",
                "Tu as besoin d'une présence professionnelle sans arborescence complète.",
                "Tu veux un support clair pour être trouvé, compris et contacté.",
                "Tu veux poser une première base avant un site plus complet.",
            ],
        },
        examples: {
            title: "Exemples de projets concernés",
            items: [
                "Activité indépendante.",
                "Artiste ou créateur.",
                "Thérapeute ou praticien.",
                "Mini-marque.",
                "Portfolio express.",
                "Événement ou initiative ponctuelle.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Plusieurs offres ou publics doivent être détaillés.",
                "Le projet demande beaucoup de contenus ou une vraie arborescence.",
                "Tu veux présenter toute une activité avec plusieurs pages.",
                "La page doit soutenir une campagne, un lancement ou une action commerciale précise.",
                "Tu as besoin d'une boutique, d'un blog complet ou d'un espace membre.",
            ],
        },
        orientations: [
            {
                label: "Site vitrine",
                href: offerRoutes.siteVitrine,
            },
            {
                label: "Landing page",
                href: offerRoutes.landingPage,
            },
            {
                label: "Projet sur mesure",
                href: offerRoutes.projetSurMesure,
            },
            {
                label: "Diagnostic web",
                href: offerRoutes.diagnosticWeb,
            },
        ],
    },
    scope: {
        title: "Une seule page, mais un vrai chemin de lecture.",
        note:
            "La One-page garde un périmètre volontairement simple. Elle se concentre sur les sections nécessaires pour expliquer le projet, rassurer et donner un point de contact clair.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange et clarification du besoin.",
                    "Objectif principal de la page.",
                    "Public prioritaire.",
                    "Message essentiel.",
                    "Sections vraiment utiles.",
                ],
            },
            {
                title: "Création",
                items: [
                    "Structure d'une page unique.",
                    "Organisation des contenus essentiels.",
                    "Direction visuelle adaptée.",
                    "Design sur mesure.",
                    "Développement responsive.",
                    "Optimisation mobile.",
                ],
            },
            {
                title: "Lancement",
                items: [
                    "SEO de base.",
                    "Lien de contact ou formulaire simple.",
                    "Vérifications avant mise en ligne.",
                    "Mise en ligne ou livraison de la page.",
                    "Conseils de prise en main.",
                ],
            },
        ],
        excluded: [
            "Les pages supplémentaires : c'est une page unique (au-delà, c'est un site vitrine).",
            "Une boutique, un paiement ou un espace membre.",
            "La rédaction complète de longs contenus éditoriaux.",
            "La création d'un logo ou d'une identité de marque complète.",
            "Une stratégie SEO ou marketing approfondie.",
            "Le suivi et les évolutions après lancement (voir Maintenance).",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Structurer l'essentiel dans le bon ordre.",
        description:
            "La One-page demande de faire des choix. La méthode permet de décider quoi dire, dans quel ordre, et comment garder une lecture fluide sans surcharger.",
        steps: [
            {
                title: "Comprendre le projet",
                description:
                    "Identifier ce que la page doit présenter et à qui elle s'adresse.",
            },
            {
                title: "Clarifier le message",
                description:
                    "Choisir les informations les plus importantes et retirer ce qui disperse la lecture.",
            },
            {
                title: "Structurer la page",
                description:
                    "Organiser les sections comme un parcours simple : présentation, contexte, éléments utiles et contact.",
            },
            {
                title: "Créer le design",
                description:
                    "Donner une forme visuelle claire, soignée et fidèle à l'univers du projet.",
            },
            {
                title: "Développer la page",
                description:
                    "Créer une page responsive, fluide et agréable à parcourir sur mobile comme sur desktop.",
            },
            {
                title: "Vérifier et lancer",
                description:
                    "Tester la lecture, les liens, les CTA, le mobile et les derniers réglages avant publication.",
            },
        ],
    },
    split: {
        title: "Une base simple à préparer, un cadre clair pour la construire.",
        client: {
            title: "Tu apportes",
            items: [
                "Ton projet ou ton activité.",
                "Ton objectif principal.",
                "Ton univers.",
                "Tes contenus existants si disponibles.",
                "Tes retours.",
                "Tes validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "La structure.",
                "L'organisation des contenus.",
                "Le design.",
                "Le développement.",
                "La clarté du parcours.",
                "L'accompagnement.",
            ],
        },
    },
    result: {
        title: "Une page claire, fluide et professionnelle.",
        description:
            "La One-page permet de poser une présence lisible sans surdimensionner le projet. Le résultat doit rester simple, mais jamais pauvre ou bâclé.",
        items: [
            "Une mini-présence web professionnelle.",
            "Une structure claire sur une seule page.",
            "Un message resserré autour de l'essentiel.",
            "Un design aligné avec ton univers.",
            "Une version mobile soignée.",
            "Un lien de contact ou une action simple.",
            "Une page facile à partager.",
            "Une base évolutive si le projet grandit ensuite.",
        ],
    },
    pricing: {
        title: "Un format simple, avec un prix clair dès le départ.",
        price: "À partir de 1 200 €",
        description:
            "Le tarif final dépend du nombre de sections, du volume de contenus à organiser, du niveau de design et des éventuels besoins de formulaire, animation ou intégration légère.",
        included: [
            "Cadrage simple du besoin.",
            "Clarification de l'objectif de la page.",
            "Structure de la One-page.",
            "Organisation des contenus essentiels.",
            "Direction visuelle adaptée.",
            "Design sur mesure.",
            "Développement responsive.",
            "Optimisation mobile.",
            "SEO de base.",
            "Vérifications avant mise en ligne.",
            "Mise en ligne.",
        ],
        factors: [
            "Nombre de sections.",
            "Volume de textes à organiser.",
            "Niveau de direction artistique.",
            "Besoin d'accompagnement contenu.",
            "Formulaire plus complet.",
            "Animations ou transitions spécifiques.",
            "Intégration d'un outil externe.",
            "Délai demandé.",
        ],
        options: [
            "Section supplémentaire.",
            "Accompagnement contenu.",
            "Ancre de navigation interne.",
            "Formulaire de contact simple.",
            "Animation légère.",
            "Intégration d'un outil externe.",
            "Maintenance post-livraison.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ta one-page est produite.",
        description:
            "Même une page unique suit un déroulé de production réel, regroupé en trois temps. Voici les étapes concrètes, telles qu'on les mène.",
        count: 15,
        countLabel: "15 étapes réelles",
        groups: [
            {
                verb: "Clarifier",
                summary: "Comprendre le projet et poser le message.",
                steps: [
                    {
                        name: "Kickoff et collecte",
                        objective:
                            "Installer le cadre et récupérer les infos utiles, sans alourdir un projet compact.",
                    },
                    {
                        name: "Objectif et message",
                        objective:
                            "Clarifier ce que la page doit faire comprendre et l'action à provoquer.",
                    },
                    {
                        name: "Structure de page",
                        objective:
                            "Organiser les sections pour tout dire en une seule page, sans perdre en clarté.",
                    },
                    {
                        name: "Contenus essentiels",
                        objective:
                            "Préparer des textes courts, utiles et orientés action.",
                    },
                    {
                        name: "Visuels et preuves",
                        objective:
                            "Choisir les visuels et preuves qui crédibilisent sans alourdir.",
                    },
                    {
                        name: "SEO léger",
                        objective: "Poser les bases SEO utiles à une page unique.",
                    },
                ],
            },
            {
                verb: "Designer",
                summary: "Donner une forme visuelle claire et compacte.",
                steps: [
                    {
                        name: "Direction artistique",
                        objective:
                            "Fixer une direction visuelle simple et cohérente.",
                    },
                    {
                        name: "Maquette UI",
                        objective:
                            "Concevoir la page (desktop et mobile) avant le développement.",
                    },
                ],
            },
            {
                verb: "Lancer",
                summary: "Construire, vérifier et mettre en ligne.",
                steps: [
                    {
                        name: "Setup technique",
                        objective: "Préparer une base technique légère et propre.",
                    },
                    {
                        name: "Développement",
                        objective:
                            "Développer la page, responsive et orientée action.",
                    },
                    {
                        name: "Intégration contenus",
                        objective:
                            "Intégrer textes, visuels, preuves, métadonnées et liens.",
                    },
                    {
                        name: "QA interne",
                        objective:
                            "Contrôler la page comme une expérience complète, de la lecture au CTA.",
                    },
                    {
                        name: "Recette client",
                        objective:
                            "Te faire valider la page sans dériver vers des sections hors périmètre.",
                    },
                    {
                        name: "Mise en ligne",
                        objective:
                            "Publier en vérifiant l'URL, le CTA, le formulaire et les métadonnées.",
                    },
                    {
                        name: "Livraison et passation",
                        objective:
                            "Livrer et t'expliquer l'inclus, les évolutions et où arrivent les contacts.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "Une one-page, c'est vraiment suffisant ?",
            answer:
                "Pour une activité claire avec une offre principale, oui : une page bien structurée va souvent à l'essentiel mieux qu'un site dispersé. Si tu as besoin de plusieurs sections détaillées, on s'oriente plutôt vers un site vitrine.",
        },
        {
            question: "Combien de temps ça prend ?",
            answer:
                "Généralement deux à quatre semaines, selon la disponibilité de tes contenus et le nombre d'allers-retours.",
        },
        {
            question: "Que dois-je préparer de mon côté ?",
            answer:
                "Ton offre, tes textes (même bruts), tes visuels et ton logo. Si ce n'est pas prêt, on cadre ensemble ce qui manque.",
        },
        {
            question: "Je pourrai passer à un site complet plus tard ?",
            answer:
                "Oui. La one-page est une base propre : on peut l'étendre vers un site vitrine ensuite, sans repartir de zéro.",
        },
    ],

};
