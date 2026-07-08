import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const siteVitrineOffer: OfferDetailContent = {
    slug: "site-vitrine",
    family: "Créer un site",
    seo: {
        title: "Site vitrine sur mesure — Alchimiste Créations",
        description:
            "Alchimiste Créations crée des sites vitrines sur mesure pour présenter ton activité, clarifier tes offres, inspirer confiance et faciliter la prise de contact.",
    },
    hero: {
        eyebrow: "Site vitrine",
        title: "Création de site vitrine sur mesure.",

        description:
            "L'offre pilier pour poser une présence web claire : présenter ton activité, structurer tes offres, rassurer tes visiteurs et faciliter la prise de contact.",
        price: "À partir de 2 000 €",
        images: createOfferHeroImages({
            category: "create",
            folder: "site-vitrine",
            alt: "Ambiance de conception pour un site vitrine sur mesure",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Ton activité mérite un site clair, pas une simple présence en ligne.",
        description:
            "Un site vitrine sert à expliquer qui tu es, ce que tu proposes, à qui tu t'adresses et pourquoi on peut te faire confiance. C'est le bon format quand ton activité demande plus qu'une page unique.",
        questions: [
            "Qui es-tu ?",
            "Que proposes-tu ?",
            "Pour qui ?",
            "Pourquoi te faire confiance ?",
            "Comment passer à l'action ?",
            "Comment te contacter ?",
        ],
        message:
            "Un bon site vitrine rend ton activité plus lisible, plus crédible et plus simple à contacter.",
    },
    qualification: {
        title: "Le bon cadre si ton activité doit être expliquée.",
        adapted: {
            title: "Adapté si",
            items: [
                "Tu veux présenter une activité de service, un studio, un atelier, une pratique ou une marque personnelle.",
                "Tu as besoin de plusieurs pages pour expliquer clairement ton univers, tes offres et ton parcours.",
                "Tu veux une base web professionnelle, cohérente et durable.",
                "Tu veux inspirer confiance avant une prise de contact.",
                "Tu veux guider vers une demande, un rendez-vous ou un premier échange.",
            ],
        },
        examples: {
            title: "Exemples de projets concernés",
            items: [
                "Activité indépendante.",
                "Studio ou atelier créatif.",
                "Projet de service.",
                "Projet artistique.",
                "Petite structure.",
                "Marque personnelle.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Tu veux vendre directement en ligne avec panier et paiement.",
                "Tu veux créer une formation en ligne complète.",
                "Tu as besoin d'un espace membre ou client dès le départ.",
                "Tu cherches surtout un diagnostic sur un site existant.",
                "Ton besoin correspond plutôt à une landing page ciblée.",
                "Tu veux uniquement une page très courte pour poser une mini-présence.",
            ],
        },
        orientations: [
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
            {
                label: "Landing page",
                href: offerRoutes.landingPage,
            },
        ],
    },
    scope: {
        title: "Un accompagnement complet pour créer une base claire.",
        note:
            "La structure exacte dépend du projet. Pour une base de 4 à 6 pages, il faut souvent prévoir 4 à 8 semaines selon les contenus, les validations et le niveau d'accompagnement.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange et compréhension du besoin.",
                    "Clarification des objectifs.",
                    "Identification du public prioritaire.",
                    "Arborescence du site.",
                    "Structure des pages.",
                    "Organisation des contenus.",
                ],
            },
            {
                title: "Création",
                items: [
                    "Direction visuelle.",
                    "Design des pages utiles.",
                    "Développement responsive.",
                    "Optimisation mobile.",
                    "SEO de base.",
                    "Formulaire de contact simple.",
                ],
            },
            {
                title: "Lancement",
                items: [
                    "Vérifications avant mise en ligne.",
                    "Mise en ligne.",
                    "Guide ou conseils de prise en main.",
                    "Repères pour faire évoluer le site.",
                    "Prochaine étape claire après lancement.",
                ],
            },
        ],
        excluded: [
            "La rédaction complète de tous tes contenus (on t'accompagne, mais le fond reste le tien).",
            "Une boutique en ligne, un paiement ou un espace membre (offres dédiées).",
            "La création d'un logo ou d'une identité de marque complète.",
            "Une stratégie marketing, publicitaire ou de réseaux sociaux.",
            "La reprise ou la migration d'un site existant (voir Refonte).",
            "Le suivi éditorial et les évolutions après lancement (voir Maintenance).",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Une création cadrée, étape par étape.",
        description:
            "Même pour un site de présentation, le projet ne doit pas partir dans tous les sens. La méthode permet d'avancer avec une direction claire et des validations utiles.",
        steps: [
            {
                title: "Comprendre ton activité",
                description:
                    "Identifier ce que tu fais, pour qui, avec quelle intention et quels objectifs.",
            },
            {
                title: "Clarifier le message",
                description:
                    "Mettre de l'ordre dans tes idées pour rendre ton activité facile à comprendre.",
            },
            {
                title: "Structurer les pages",
                description:
                    "Définir les pages nécessaires et le rôle de chaque section.",
            },
            {
                title: "Créer le design",
                description:
                    "Créer une direction visuelle fidèle à ton univers, lisible et professionnelle.",
            },
            {
                title: "Développer le site",
                description:
                    "Transformer la maquette en site responsive, propre et fonctionnel.",
            },
            {
                title: "Vérifier et lancer",
                description:
                    "Tester, relire, corriger, préparer la mise en ligne et poser les premiers repères.",
            },
        ],
    },
    split: {
        title: "Un projet construit avec toi, sans que tu doives tout gérer seul.",
        client: {
            title: "Tu apportes",
            items: [
                "Ton activité.",
                "Ton univers.",
                "Tes objectifs.",
                "Tes contenus ou idées de contenus.",
                "Tes retours et validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "La méthode.",
                "La structure.",
                "Le design.",
                "Le développement.",
                "La qualité.",
                "L'accompagnement.",
            ],
        },
    },
    result: {
        title: "Un site clair, beau et fidèle à ton univers.",
        description:
            "Le résultat doit être esthétique, mais surtout utile : tes visiteurs comprennent vite ton activité, trouvent les bonnes informations et savent comment te contacter.",
        items: [
            "Un site professionnel.",
            "Une structure claire.",
            "Des pages faciles à comprendre.",
            "Un design aligné avec ton univers.",
            "Une version mobile soignée.",
            "Une base technique propre.",
            "Des appels à l'action clairs.",
            "Une présence en ligne plus crédible.",
        ],
    },
    pricing: {
        title: "Un prix de départ pour cadrer ton projet.",
        price: "À partir de 2 000 €",
        description:
            "Le tarif final dépend du nombre de pages, du niveau de design, des contenus à organiser et des fonctionnalités utiles. Le socle ne comprend pas l'e-commerce, l'espace membre, la rédaction complète de tous les contenus ou une stratégie marketing longue.",
        included: [
            "Cadrage du besoin.",
            "Arborescence du site.",
            "Structure des pages.",
            "Parcours de contact.",
            "Direction visuelle.",
            "Design sur mesure.",
            "Développement responsive.",
            "Optimisation mobile.",
            "SEO de base.",
            "Vérifications avant mise en ligne.",
            "Mise en ligne.",
            "Conseils de prise en main.",
        ],
        factors: [
            "Nombre de pages.",
            "Volume de contenus à organiser.",
            "Niveau de direction artistique.",
            "Besoin d'accompagnement rédactionnel.",
            "Formulaire plus avancé.",
            "Section réalisations ou portfolio plus poussée.",
            "Animations ou interactions particulières.",
            "Maintenance après mise en ligne.",
        ],
        options: [
            "Page supplémentaire.",
            "Section supplémentaire.",
            "Formulaire avancé.",
            "FAQ avancée.",
            "Blog simple.",
            "Accompagnement contenu.",
            "Animations légères.",
            "Maintenance post-livraison.",
            "Préparation d'une landing page après lancement.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ton site vitrine est produit.",
        description:
            "Pas d'improvisation : le site vitrine suit un déroulé de production réel, regroupé en trois temps. Voici les étapes concrètes, telles qu'on les mène.",
        count: 15,
        countLabel: "15 étapes réelles",
        groups: [
            {
                verb: "Clarifier",
                summary: "Comprendre le projet et poser des bases solides.",
                steps: [
                    {
                        name: "Kickoff projet",
                        objective: "Poser le cadre opérationnel avant de produire.",
                    },
                    {
                        name: "Cadrage stratégique",
                        objective:
                            "Clarifier ce que le site doit accomplir et verrouiller le périmètre.",
                    },
                    {
                        name: "Architecture du site",
                        objective:
                            "Organiser les pages, la navigation et le parcours visiteur.",
                    },
                    {
                        name: "Contenus et SEO",
                        objective:
                            "Préparer les textes, les médias et les bases SEO avant le design.",
                    },
                ],
            },
            {
                verb: "Designer",
                summary: "Donner une forme visuelle claire et fidèle.",
                steps: [
                    {
                        name: "Direction artistique",
                        objective: "Fixer l'univers visuel avant les maquettes.",
                    },
                    {
                        name: "Maquettes UI",
                        objective: "Concevoir l'interface avant le développement.",
                    },
                ],
            },
            {
                verb: "Lancer",
                summary: "Construire, vérifier et mettre en ligne proprement.",
                steps: [
                    {
                        name: "Setup technique",
                        objective: "Préparer une base technique propre et vérifiable.",
                    },
                    {
                        name: "Développement",
                        objective: "Construire le site selon le périmètre validé.",
                    },
                    {
                        name: "Intégration contenus",
                        objective:
                            "Intégrer les textes, médias, CTA et métadonnées définitifs.",
                    },
                    {
                        name: "Fonctionnalités",
                        objective: "Vérifier les fonctions attendues du site.",
                    },
                    {
                        name: "QA interne",
                        objective: "Contrôler le site avant de l'envoyer au client.",
                    },
                    {
                        name: "Recette client",
                        objective:
                            "Te faire valider le site sans mélanger bugs, ajustements et hors périmètre.",
                    },
                    {
                        name: "Mise en ligne",
                        objective: "Publier sans perte ni improvisation.",
                    },
                    {
                        name: "Livraison et passation",
                        objective: "Livrer proprement et te rendre autonome.",
                    },
                    {
                        name: "Stabilisation et RETEX",
                        objective: "Sécuriser l'après-livraison et améliorer la méthode.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "Combien de temps prend un site vitrine ?",
            answer:
                "Selon le nombre de pages et la disponibilité de tes contenus, compte généralement de trois à six semaines entre le cadrage et la mise en ligne. On fixe un rythme réaliste dès le départ.",
        },
        {
            question: "Que dois-je préparer de mon côté ?",
            answer:
                "L'idéal : tes textes (même bruts), tes visuels, ton logo et une idée de tes offres. Si ce n'est pas prêt, on cadre ensemble ce qui manque — tu n'as pas besoin d'arriver avec tout parfait.",
        },
        {
            question: "Le prix est-il fixe ?",
            answer:
                "Le tarif « à partir de 2 000 € » est un point de départ. Le devis exact est posé après le cadrage, une fois le périmètre clair — sans surprise en cours de route.",
        },
        {
            question: "Est-ce que je pourrai faire évoluer mon site ensuite ?",
            answer:
                "Oui. Le site est construit sur une base propre et évolutive, et je propose un suivi d'évolutions (maintenance) réservé aux sites que je réalise.",
        },
    ],

};
