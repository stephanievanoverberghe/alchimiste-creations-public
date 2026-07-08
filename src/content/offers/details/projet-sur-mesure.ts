import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const projetSurMesureOffer: OfferDetailContent = {
    slug: "projet-sur-mesure",
    family: "Projet avancé",
    seo: {
        title: "Projet web sur mesure — Alchimiste Créations",
        description:
            "Alchimiste Créations accompagne les projets web sur mesure : parcours spécifiques, interfaces adaptées, espaces privés, fonctionnalités ciblées et bases évolutives.",
    },
    hero: {
        eyebrow: "Projet sur mesure",
        title: "Projet web sur mesure.",

        description:
            "Un accompagnement pour les projets qui ne rentrent pas dans une offre simple : parcours spécifique, espace privé, interface dédiée, logique métier ou fonctionnalités particulières.",
        price: "Sur devis, après échange",
        images: createOfferHeroImages({
            category: "custom",
            folder: "projet-avance",
            alt: "Ambiance de conception pour un projet web avancé",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Créer une solution adaptée à un besoin précis.",
        description:
            "Le sur mesure sert les projets qui demandent un parcours, une interface ou une organisation spécifique. Il ne veut pas dire tout faire : il commence par un périmètre clair.",
        questions: [
            "Quel besoin sort d'une offre standard ?",
            "Quels utilisateurs ou clients sont concernés ?",
            "Quels parcours doivent être structurés ?",
            "Quelles données ou contenus doivent être organisés ?",
            "Quelles fonctionnalités sont essentielles en V1 ?",
            "Qu'est-ce qui peut attendre une V2 ?",
        ],
        message:
            "Le sur mesure doit rendre le projet plus clair, pas plus compliqué.",
    },
    qualification: {
        title: "Le bon cadre quand le projet demande plus qu'un site classique.",
        adapted: {
            title: "Adapté si",
            items: [
                "Ton projet ne rentre pas dans une offre simple.",
                "Tu as besoin d'un parcours utilisateur spécifique.",
                "Tu veux créer une expérience plus avancée ou évolutive.",
                "Tu as besoin d'un espace membre, client ou privé.",
                "Tu dois organiser des contenus, données ou demandes d'une manière particulière.",
                "Tu as besoin de cadrer une V1 avant d'imaginer la suite.",
            ],
        },
        examples: {
            title: "Exemples de projets concernés",
            items: [
                "Parcours de demande personnalisée.",
                "Espace membre.",
                "Espace client simple.",
                "Tableau de bord simple.",
                "Interface interne légère.",
                "Projet hybride entre site, contenu et fonctionnalités.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Une offre standard suffit.",
                "Tu as seulement besoin d'un site vitrine, d'une One-page ou d'une Landing page.",
                "Tu cherches une maintenance légère.",
                "Tu veux un CRM complet prêt à l'emploi sans cadrage.",
                "Tu veux une plateforme SaaS complète ou une application mobile native dès la V1.",
                "Tu souhaites ajouter beaucoup de fonctionnalités sans priorité claire.",
            ],
        },
        orientations: [
            {
                label: "Site vitrine",
                href: offerRoutes.siteVitrine,
            },
            {
                label: "Boutique en ligne",
                href: offerRoutes.boutiqueEnLigne,
            },
            {
                label: "Formation en ligne",
                href: offerRoutes.formationEnLigne,
            },
            {
                label: "Diagnostic web",
                href: offerRoutes.diagnosticWeb,
            },
        ],
    },
    scope: {
        title: "Un accompagnement complet, à définir selon le projet.",
        note:
            "Le périmètre est défini avant production pour éviter de transformer le projet en chantier illimité. La V1 doit rester réaliste, utile et vérifiable.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange et cadrage approfondi.",
                    "Clarification du besoin.",
                    "Objectif du projet et utilisateurs concernés.",
                    "Données ou contenus à gérer.",
                    "Fonctionnalités essentielles et secondaires.",
                    "Définition du périmètre V1.",
                ],
            },
            {
                title: "Conception",
                items: [
                    "Arborescence ou structure fonctionnelle.",
                    "Parcours utilisateur.",
                    "Structure des pages ou interfaces.",
                    "Direction visuelle.",
                    "Design d'interface.",
                    "Prototype ou maquette avancée si nécessaire.",
                ],
            },
            {
                title: "Lancement",
                items: [
                    "Développement selon le périmètre validé.",
                    "Formulaires ou parcours avancés si prévus.",
                    "Intégrations selon le besoin.",
                    "Optimisation mobile.",
                    "Tests et vérifications.",
                    "Mise en ligne et conseils de prise en main.",
                ],
            },
        ],
        excluded: [
            "Un périmètre illimité : on livre un MVP (lot 1) cadré, pas tout le backlog d'un coup.",
            "La rédaction des contenus ou la saisie des données métier.",
            "Une application mobile native (sauf cadrage explicite).",
            "Un support ou une astreinte 24/7.",
            "La maintenance évolutive continue après livraison (cadrée à part).",
            "Les intégrations tierces non identifiées au périmètre.",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Cadrer avant de développer.",
        description:
            "Plus un projet est spécifique, plus il a besoin d'une méthode claire. On clarifie les usages, les parcours, les priorités et les limites avant de développer.",
        steps: [
            {
                title: "Comprendre le projet",
                description:
                    "Identifier l'idée, les objectifs, les utilisateurs et le contexte.",
            },
            {
                title: "Clarifier le besoin",
                description:
                    "Distinguer ce qui est nécessaire, utile, secondaire ou à repousser.",
            },
            {
                title: "Structurer l'expérience",
                description:
                    "Définir les pages, interfaces, parcours et actions importantes.",
            },
            {
                title: "Créer le design",
                description:
                    "Concevoir une interface claire, lisible et alignée avec l'univers du projet.",
            },
            {
                title: "Développer la solution",
                description:
                    "Construire une base fonctionnelle, responsive et adaptée au périmètre validé.",
            },
            {
                title: "Vérifier et préparer la suite",
                description:
                    "Tester les parcours, les accès, le mobile, les formulaires et identifier les évolutions possibles.",
            },
        ],
    },
    split: {
        title: "Ton idée, tes usages, une V1 réaliste.",
        client: {
            title: "Tu apportes",
            items: [
                "Ton idée ou besoin.",
                "Ton contexte.",
                "Tes objectifs.",
                "Tes utilisateurs ou clients concernés.",
                "Tes contenus ou données disponibles.",
                "Tes contraintes.",
                "Tes priorités.",
                "Tes retours et validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "La méthode.",
                "La clarification du périmètre.",
                "La structure UX.",
                "La direction visuelle.",
                "Le design d'interface.",
                "Le développement selon le périmètre validé.",
                "Les vérifications.",
            ],
        },
    },
    result: {
        title: "Une solution claire, utile et adaptée à ton projet.",
        description:
            "Le sur mesure doit donner une base évolutive, réaliste et alignée avec les usages réels du projet, sans ajouter de complexité inutile.",
        items: [
            "Un projet mieux cadré.",
            "Une structure adaptée.",
            "Un parcours utilisateur clair.",
            "Une interface lisible.",
            "Des fonctionnalités utiles.",
            "Une version mobile soignée.",
            "Une base évolutive.",
            "Une V1 plus réaliste, plus claire et plus facile à faire évoluer.",
        ],
    },
    pricing: {
        title: "Un projet sur devis, avec un point de départ clair.",
        price: "Sur devis, après échange",
        description:
            "Le tarif final dépend du périmètre V1, du nombre d'écrans ou pages, des parcours utilisateurs, des fonctionnalités, des accès, des données ou contenus à gérer, des intégrations et du niveau de développement nécessaire.",
        included: [
            "Cadrage approfondi du besoin.",
            "Définition du périmètre V1.",
            "Parcours utilisateur.",
            "Structure des pages ou interfaces.",
            "Direction visuelle.",
            "Design d'interface.",
            "Développement selon le périmètre validé.",
            "Formulaires ou parcours avancés si prévus.",
            "Optimisation mobile.",
            "Tests et vérifications.",
            "Mise en ligne.",
            "Conseils de prise en main.",
        ],
        factors: [
            "Nombre d'écrans ou interfaces.",
            "Nombre de parcours utilisateurs.",
            "Accès privés.",
            "Gestion de données ou contenus.",
            "Niveau d'administration.",
            "Intégrations externes.",
            "Formulaires complexes.",
            "Règles métier spécifiques.",
            "Besoin de sécurité ou confidentialité renforcé.",
            "Évolutions déjà prévues après la V1.",
        ],
        options: [
            "Atelier de cadrage approfondi.",
            "Prototype ou maquette avancée.",
            "Espace privé simple.",
            "Interface interne.",
            "Formulaire avancé.",
            "Parcours de validation.",
            "Intégration outil externe.",
            "Documentation de prise en main.",
            "Maintenance post-livraison.",
            "Lot d'évolution V2.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ton projet sur mesure est cadré et construit.",
        description:
            "Un projet spécifique dérape vite sans méthode : voici le déroulé réel, en trois temps, de la discovery au MVP livré.",
        count: 18,
        countLabel: "18 étapes réelles",
        groups: [
            {
                verb: "Clarifier",
                summary: "Comprendre le métier et cadrer un MVP réaliste.",
                steps: [
                    {
                        name: "Kickoff et collecte",
                        objective:
                            "Installer le cadre et récupérer les infos nécessaires à la discovery.",
                    },
                    {
                        name: "Discovery produit",
                        objective:
                            "Comprendre le problème métier, les utilisateurs et les limites du MVP.",
                    },
                    {
                        name: "Cartographie métier",
                        objective:
                            "Cartographier le métier pour ne pas coder une interface sans logique.",
                    },
                    {
                        name: "Rôles et permissions",
                        objective:
                            "Définir qui peut voir, créer, modifier, valider ou administrer.",
                    },
                    {
                        name: "Données métier",
                        objective:
                            "Définir les objets, champs et relations métier avant le modèle technique.",
                    },
                    {
                        name: "Périmètre MVP",
                        objective:
                            "Transformer l'ambition en lots livrables et choisir ce qui entre dans le lot 1.",
                    },
                ],
            },
            {
                verb: "Designer",
                summary: "Valider les flux et les écrans avant de développer.",
                steps: [
                    {
                        name: "Wireframes et flux",
                        objective:
                            "Concevoir les flux avant l'UI détaillée pour valider la logique.",
                    },
                    {
                        name: "Maquettes UI",
                        objective:
                            "Concevoir les écrans clés du lot 1, sans tout designer d'avance.",
                    },
                ],
            },
            {
                verb: "Lancer",
                summary: "Construire un premier lot exploitable et le mettre en ligne.",
                steps: [
                    {
                        name: "Architecture technique",
                        objective:
                            "Traduire les décisions métier en architecture minimale et maintenable.",
                    },
                    {
                        name: "Setup projet",
                        objective:
                            "Préparer le repo, les environnements et la base de développement du lot 1.",
                    },
                    {
                        name: "Backlog lot 1",
                        objective:
                            "Découper le lot 1 en tâches actionnables et critères d'acceptation.",
                    },
                    {
                        name: "Développement lot 1",
                        objective:
                            "Construire le premier lot exploitable selon le périmètre validé.",
                    },
                    {
                        name: "Tests fonctionnels",
                        objective:
                            "Tester les workflows critiques du lot 1 avant recette.",
                    },
                    {
                        name: "Recette client",
                        objective:
                            "Te faire valider le lot 1 comme MVP, sans ouvrir tout le backlog futur.",
                    },
                    {
                        name: "Préparation production",
                        objective:
                            "Sécuriser le passage en production avec données, accès et environnement maîtrisés.",
                    },
                    {
                        name: "Mise en ligne",
                        objective:
                            "Déployer le MVP et vérifier les parcours essentiels en production.",
                    },
                    {
                        name: "Livraison et passation",
                        objective:
                            "Livrer le lot 1, transmettre les repères et cadrer la suite produit.",
                    },
                    {
                        name: "Stabilisation et RETEX",
                        objective:
                            "Surveiller les premiers usages et qualifier les demandes.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "Ça veut dire quoi « sur mesure », concrètement ?",
            answer:
                "Un projet qui ne rentre pas dans une offre standard : parcours spécifique, espace privé, logique métier, interface dédiée. On commence toujours par une discovery pour cadrer un MVP réaliste.",
        },
        {
            question: "Pourquoi un MVP et pas tout d'un coup ?",
            answer:
                "Livrer un premier lot exploitable réduit le risque, le coût et les mauvaises surprises. On construit ce qui a le plus de valeur d'abord, puis on itère.",
        },
        {
            question: "Comment est fixé le prix ?",
            answer:
                "Sur devis, après la discovery : le tarif dépend du périmètre du lot 1, des parcours, des données, des accès et des intégrations.",
        },
        {
            question: "Et la suite après le lot 1 ?",
            answer:
                "On cadre les évolutions en lots suivants, selon ce que l'usage réel révèle — sans t'enfermer dans un chantier illimité.",
        },
    ],

};
