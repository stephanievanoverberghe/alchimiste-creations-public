import { offerRoutes } from "@/config/navigation";

import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";
import type { OfferDetailContent } from "./types";

export const boutiqueEnLigneOffer: OfferDetailContent = {
    slug: "boutique-en-ligne",
    family: "Vendre ou transmettre",
    seo: {
        title: "Boutique en ligne sur mesure — Alchimiste Créations",
        description:
            "Alchimiste Créations crée des boutiques en ligne sur mesure pour vendre tes produits ou services avec un catalogue clair, un parcours d'achat simple et une expérience mobile soignée.",
    },
    hero: {
        eyebrow: "Boutique en ligne",
        title: "Création de boutique en ligne sur mesure.",

        description:
            "Une boutique claire pour vendre des produits ou services sans perdre ton univers : catalogue lisible, parcours d'achat simple, confiance et expérience mobile soignée.",
        price: "Sur devis, après échange",
        images: createOfferHeroImages({
            category: "sell",
            folder: "boutique",
            alt: "Ambiance de conception pour une boutique en ligne",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Vendre en ligne avec une structure claire.",
        description:
            "Une boutique en ligne permet d'organiser un catalogue, de mettre les produits en valeur, de rassurer avant l'achat et de rendre le panier comme le paiement faciles à comprendre.",
        questions: [
            "Quels produits ou services doivent être vendus ?",
            "Comment organiser le catalogue et les catégories ?",
            "Qu'est-ce qui rassure avant l'achat ?",
            "Comment simplifier le panier et le paiement ?",
            "Quelles informations de livraison ou de retour sont nécessaires ?",
            "Comment garder une expérience mobile fluide ?",
        ],
        message:
            "Une boutique en ligne doit vendre, mais elle doit aussi inspirer confiance.",
    },
    qualification: {
        title: "Le bon cadre si ton projet doit vendre avec clarté.",
        adapted: {
            title: "Adapté si",
            items: [
                "Tu veux vendre des produits, services ou offres simples en ligne.",
                "Tu as besoin d'un catalogue clair et organisé.",
                "Tu veux un parcours d'achat lisible, rassurant et cohérent.",
                "Tu veux une boutique alignée avec ton univers de marque.",
                "Tu veux préparer une base e-commerce propre et évolutive.",
            ],
        },
        examples: {
            title: "Exemples de projets concernés",
            items: [
                "Boutique de créations.",
                "Produits physiques.",
                "Produits numériques simples.",
                "Services réservables ou achetables.",
                "Petite marque indépendante.",
                "Prévente ou lancement de collection.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Tu n'as pas encore clarifié ce que tu veux vendre.",
                "Tes produits, tarifs ou informations essentielles ne sont pas prêts.",
                "Tu as besoin d'une marketplace multi-vendeurs.",
                "Tu veux une plateforme SaaS complète ou un CRM intégré.",
                "Ta logistique ou tes règles de vente sont trop complexes sans cadrage.",
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
                label: "Formation en ligne",
                href: offerRoutes.formationEnLigne,
            },
            {
                label: "Projet sur mesure",
                href: offerRoutes.projetSurMesure,
            },
        ],
    },
    scope: {
        title: "Un accompagnement pour construire une boutique claire et fonctionnelle.",
        note:
            "Le bon périmètre dépend du type de produits, du volume du catalogue, du parcours d'achat, du paiement, de la livraison et des obligations propres au projet.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange et cadrage e-commerce.",
                    "Clarification de l'offre ou du catalogue.",
                    "Nombre de produits au lancement.",
                    "Catégories, variantes et informations produits.",
                    "Paiement, livraison, retrait ou mode de remise.",
                ],
            },
            {
                title: "Création",
                items: [
                    "Structure de la boutique.",
                    "Structure des fiches produits.",
                    "Direction visuelle.",
                    "Design de l'interface.",
                    "Développement responsive.",
                    "Panier et paiement selon la solution retenue.",
                ],
            },
            {
                title: "Lancement",
                items: [
                    "Pages essentielles.",
                    "Optimisation mobile.",
                    "SEO de base.",
                    "Vérification du panier, du paiement et des liens.",
                    "Mise en ligne.",
                    "Conseils de prise en main.",
                ],
            },
        ],
        excluded: [
            "La rédaction complète de toutes tes fiches produits (on structure, tu fournis le fond).",
            "La photographie ou la création des visuels produits.",
            "La gestion des stocks, des commandes ou du service client au quotidien.",
            "Une marketplace multi-vendeurs ou une plateforme SaaS complète.",
            "La stratégie marketing, publicitaire ou d'acquisition.",
            "La logistique, les transporteurs ou la comptabilité.",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Cadrer avant de vendre.",
        description:
            "La boutique avance étape par étape : comprendre ce qui est vendu, organiser le catalogue, structurer le parcours d'achat, designer, développer, vérifier et lancer.",
        steps: [
            {
                title: "Comprendre le projet",
                description:
                    "Identifier ce qui est vendu, à qui, avec quel univers et quels objectifs.",
            },
            {
                title: "Clarifier le catalogue",
                description:
                    "Organiser les produits, catégories, variantes et informations importantes.",
            },
            {
                title: "Structurer le parcours d'achat",
                description:
                    "Définir comment le visiteur découvre, choisit, ajoute au panier et commande.",
            },
            {
                title: "Créer le design",
                description:
                    "Mettre en valeur les produits tout en gardant une interface claire et rassurante.",
            },
            {
                title: "Développer la boutique",
                description:
                    "Créer une boutique responsive, fonctionnelle et adaptée aux usages.",
            },
            {
                title: "Vérifier et lancer",
                description:
                    "Tester le mobile, les fiches produits, le panier, le paiement, les liens et les informations essentielles.",
            },
        ],
    },
    split: {
        title: "Une boutique se construit avec tes contenus et ton univers.",
        client: {
            title: "Tu apportes",
            items: [
                "Ton projet ou ta marque.",
                "Tes produits ou services.",
                "Les informations produits.",
                "Les visuels disponibles.",
                "Les prix ou règles de vente.",
                "Les conditions de livraison ou de prestation.",
                "Tes retours et validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "La structure e-commerce.",
                "La direction visuelle.",
                "Le design.",
                "Le développement.",
                "La clarté du parcours d'achat.",
                "Les vérifications.",
                "L'accompagnement.",
            ],
        },
    },
    result: {
        title: "Une boutique claire, belle et facile à utiliser.",
        description:
            "La boutique doit être fonctionnelle, mais aussi donner confiance et envie d'acheter. Le visiteur comprend ce qu'il peut acheter, pourquoi cela lui correspond et comment commander.",
        items: [
            "Une boutique professionnelle.",
            "Un catalogue organisé.",
            "Des fiches produits claires.",
            "Un parcours d'achat simple.",
            "Une version mobile soignée.",
            "Une expérience cohérente avec ton univers.",
            "Une base prête à évoluer.",
            "Une mise en ligne cadrée.",
        ],
    },
    pricing: {
        title: "Un tarif défini sur devis, après un premier échange.",
        price: "Sur devis",
        description:
            "La boutique en ligne se chiffre sur mesure : le tarif dépend du catalogue, du nombre de produits, du parcours d'achat, du système de règlement, de la livraison, des contenus à préparer et des besoins de gestion. On le définit ensemble après avoir cadré ton besoin.",
        included: [
            "Cadrage e-commerce.",
            "Structure de la boutique.",
            "Organisation d'un catalogue simple.",
            "Structure des fiches produits.",
            "Design sur mesure.",
            "Développement responsive.",
            "Optimisation mobile.",
            "Panier.",
            "Règlement en ligne selon la solution retenue.",
            "Pages essentielles.",
            "Vérifications avant mise en ligne.",
            "Mise en ligne.",
        ],
        factors: [
            "Nombre de produits au lancement.",
            "Nombre de catégories.",
            "Variantes produits.",
            "Règles de livraison.",
            "Commandes personnalisées.",
            "Messages automatiques liés aux commandes.",
            "Pages légales e-commerce.",
            "Connexion à des outils externes.",
            "Maintenance après lancement.",
        ],
        options: [
            "Produits supplémentaires.",
            "Catégories supplémentaires.",
            "Fiche produit avancée.",
            "Formulaire ou demande personnalisée.",
            "Intégration outil externe.",
            "Accompagnement fiches produits.",
            "Formation ou prise en main.",
            "Maintenance post-livraison.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ta boutique est produite.",
        description:
            "Vendre en ligne engage de l'argent réel : la boutique suit un déroulé de production rigoureux, en trois temps. Voici les étapes concrètes.",
        count: 19,
        countLabel: "19 étapes réelles",
        groups: [
            {
                verb: "Clarifier",
                summary: "Cadrer ce qui se vend et comment on l'achète.",
                steps: [
                    {
                        name: "Kickoff et accès",
                        objective:
                            "Installer le cadre et récupérer les accès avant toute décision e-commerce.",
                    },
                    {
                        name: "Cadrage business",
                        objective:
                            "Clarifier ce que la boutique vend, à qui, avec quelle promesse et quelles limites.",
                    },
                    {
                        name: "Catalogue produits",
                        objective:
                            "Structurer le catalogue pour des produits faciles à gérer, comprendre et acheter.",
                    },
                    {
                        name: "Fiche produit",
                        objective:
                            "Définir la fiche qui convainc, rassure et prépare l'achat.",
                    },
                    {
                        name: "Parcours d'achat",
                        objective:
                            "Concevoir un parcours clair du catalogue à la commande, sans friction inutile.",
                    },
                    {
                        name: "Paiement, livraison et taxes",
                        objective:
                            "Cadrer les règles e-commerce qui peuvent bloquer une commande réelle.",
                    },
                    {
                        name: "Contenus et SEO e-commerce",
                        objective:
                            "Préparer textes, métadonnées, images et réassurance d'une boutique vendable.",
                    },
                ],
            },
            {
                verb: "Designer",
                summary: "Mettre les produits en valeur et donner confiance.",
                steps: [
                    {
                        name: "Direction artistique",
                        objective:
                            "Fixer une direction visuelle qui donne confiance et valorise les produits.",
                    },
                    {
                        name: "Maquettes UI",
                        objective:
                            "Concevoir les écrans clés de la boutique avant développement.",
                    },
                ],
            },
            {
                verb: "Lancer",
                summary: "Construire le parcours d'achat et publier sans perte.",
                steps: [
                    {
                        name: "Setup technique",
                        objective:
                            "Préparer une base technique fiable, sans improviser les choix structurants.",
                    },
                    {
                        name: "Développement catalogue",
                        objective:
                            "Construire les pages catalogue et produit sur une base responsive et fiable.",
                    },
                    {
                        name: "Panier et checkout",
                        objective:
                            "Construire le parcours d'achat jusqu'à la commande testable.",
                    },
                    {
                        name: "Intégration produits",
                        objective:
                            "Intégrer produits, médias, contenus, SEO et réassurance validés.",
                    },
                    {
                        name: "Pages légales et confiance",
                        objective:
                            "Sécuriser les informations de confiance et les pages attendues d'une boutique.",
                    },
                    {
                        name: "QA interne",
                        objective:
                            "Contrôler le parcours complet et les cas limites avant recette.",
                    },
                    {
                        name: "Recette client",
                        objective:
                            "Te faire valider la boutique sans dérive infinie du catalogue ou du design.",
                    },
                    {
                        name: "Mise en ligne",
                        objective:
                            "Publier sans perdre les commandes, les paramètres paiement ou les mentions légales.",
                    },
                    {
                        name: "Livraison et passation",
                        objective:
                            "Te rendre capable de gérer produits, commandes et contenus essentiels.",
                    },
                    {
                        name: "Stabilisation et RETEX",
                        objective:
                            "Sécuriser les premiers jours après lancement.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "Quelle solution technique utilises-tu ?",
            answer:
                "On la choisit ensemble au cadrage, selon ton catalogue et tes besoins réels : l'important est une base fiable, gérable par toi et évolutive — pas la techno à la mode.",
        },
        {
            question: "Pourquoi un devis et pas un prix fixe ?",
            answer:
                "Une boutique varie énormément selon le catalogue, le parcours d'achat, le paiement et la livraison. On cadre d'abord ton besoin, puis on chiffre juste.",
        },
        {
            question: "Pourrai-je gérer mes produits seule ?",
            answer:
                "Oui : la passation te rend autonome sur les produits, les commandes et les contenus essentiels.",
        },
        {
            question: "Et le paiement, c'est sécurisé ?",
            answer:
                "On s'appuie sur des solutions de paiement établies et conformes, et on cadre les pages légales et de confiance attendues.",
        },
    ],

};
