import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const maintenanceOffer: OfferDetailContent = {
    slug: "maintenance",
    family: "Améliorer l'existant",
    seo: {
        title: "Maintenance de site web — Alchimiste Créations",
        description:
            "Alchimiste Créations accompagne la maintenance de ton site web pour corriger, ajuster, améliorer et faire évoluer ta présence en ligne dans un cadre clair.",
    },
    hero: {
        eyebrow: "Maintenance",
        title: "Maintenance de site web.",

        description:
            "Un accompagnement pour garder propre et fiable un site que j'ai réalisé : corrections, ajustements, petites évolutions et suivi clair. Réservé aux sites créés par le studio.",
        price: "À partir de 180 € / intervention",
        images: createOfferHeroImages({
            category: "improve",
            folder: "maintenance",
            alt: "Ambiance de maintenance pour un site web",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Prolonger proprement un site que le studio a réalisé.",
        description:
            "La maintenance prolonge un site créé par le studio : corriger, ajuster ou faire évoluer sans transformer chaque demande en refonte complète. Elle est réservée aux sites que j'ai réalisés, dont je connais déjà la structure et le code.",
        questions: [
            "Qu'est-ce qui doit être corrigé ou ajusté ?",
            "Quels contenus doivent évoluer ?",
            "Quels points sont urgents, utiles ou secondaires ?",
            "Le mobile reste-t-il confortable après les changements ?",
            "Faut-il une intervention ponctuelle ou un suivi régulier ?",
            "La demande relève-t-elle encore d'une maintenance ou déjà d'une refonte ?",
        ],
        message:
            "La maintenance garde ton site vivant, propre et cohérent avec ton activité.",
    },
    qualification: {
        title: "Le bon cadre pour suivre un site réalisé par le studio.",
        adapted: {
            title: "Adapté si",
            items: [
                "Ton site a été réalisé par le studio.",
                "Tu veux éviter qu'il se dégrade avec le temps.",
                "Tu as besoin de petites corrections ou d'ajustements ciblés.",
                "Tu veux faire évoluer certains contenus ou sections.",
                "Tu préfères être accompagné plutôt que gérer seul.",
            ],
        },
        examples: {
            title: "Situations concernées",
            items: [
                "Correction d'un bug simple.",
                "Modification de textes.",
                "Ajout d'un bloc.",
                "Vérification mobile.",
                "Amélioration d'un CTA.",
                "Petite évolution après lancement.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Ton site a été réalisé par quelqu'un d'autre (un diagnostic ou une refonte est alors plus juste).",
                "Le site doit être refait en profondeur.",
                "La structure entière est à revoir.",
                "Tu veux créer une nouvelle boutique ou formation complète.",
                "Tu as besoin d'un support illimité ou d'une astreinte permanente.",
            ],
        },
        orientations: [
            {
                label: "Refonte",
                href: offerRoutes.refonte,
            },
            {
                label: "Diagnostic web",
                href: offerRoutes.diagnosticWeb,
            },
            {
                label: "Projet sur mesure",
                href: offerRoutes.projetSurMesure,
            },
            {
                label: "Site vitrine",
                href: offerRoutes.siteVitrine,
            },
        ],
    },
    scope: {
        title: "Un cadre pour suivre le site sans partir dans tous les sens.",
        note:
            "La maintenance peut être ponctuelle ou mensuelle. Elle doit rester cadrée dans le temps, les demandes et le niveau de disponibilité attendu.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange pour comprendre la demande.",
                    "Liste des corrections ou évolutions.",
                    "Priorisation des actions.",
                    "Vérification du cadre : ponctuel, pack d'heures ou suivi mensuel.",
                    "Accès utiles si nécessaire.",
                ],
            },
            {
                title: "Intervention",
                items: [
                    "Corrections simples.",
                    "Ajustements de contenus.",
                    "Ajout ou modification de sections.",
                    "Améliorations UI légères.",
                    "Ajustements responsive.",
                    "Petites optimisations selon le site.",
                ],
            },
            {
                title: "Suivi",
                items: [
                    "Vérification des éléments modifiés.",
                    "Vérification mobile si nécessaire.",
                    "Correction de liens ou points bloquants.",
                    "Conseils simples pour la suite.",
                    "Suivi des demandes dans un cadre défini.",
                ],
            },
        ],
        excluded: [
            "La maintenance d'un site réalisé par quelqu'un d'autre (voir Diagnostic ou Refonte).",
            "Une refonte, une nouvelle structure ou un nouveau design complet.",
            "L'ajout d'une boutique, d'une formation ou de modules complexes.",
            "Un support illimité ou une astreinte permanente.",
            "La création de nouveaux contenus éditoriaux.",
            "Les évolutions trop larges (transformées proprement en devis à part).",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Traiter les demandes avec ordre et clarté.",
        description:
            "Même pour de petites corrections, la maintenance garde un cadre : comprendre la demande, prioriser, réaliser, vérifier et conseiller la suite.",
        steps: [
            {
                title: "Comprendre la demande",
                description:
                    "Identifier ce qui doit être corrigé, modifié ou amélioré.",
            },
            {
                title: "Prioriser les actions",
                description:
                    "Distinguer ce qui est urgent, utile ou secondaire.",
            },
            {
                title: "Réaliser les ajustements",
                description:
                    "Appliquer les corrections ou évolutions prévues dans le périmètre retenu.",
            },
            {
                title: "Vérifier",
                description:
                    "Contrôler les éléments modifiés, notamment sur mobile si nécessaire.",
            },
            {
                title: "Conseiller la suite",
                description:
                    "Indiquer si d'autres actions sont utiles ou si une refonte devient préférable.",
            },
        ],
    },
    split: {
        title: "Des demandes claires pour un suivi efficace.",
        client: {
            title: "Tu apportes",
            items: [
                "Le lien du site.",
                "Les demandes de correction ou d'évolution.",
                "Les contenus à modifier si nécessaire.",
                "Les priorités ressenties.",
                "Les accès utiles si besoin.",
                "Tes retours et validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "L'analyse des demandes.",
                "La priorisation.",
                "Les corrections.",
                "Les ajustements UI.",
                "Les vérifications.",
                "Les conseils d'évolution.",
            ],
        },
    },
    result: {
        title: "Un site plus propre et plus facile à faire évoluer.",
        description:
            "La maintenance permet de garder une base utile et cohérente dans le temps, sans confondre suivi léger, refonte et projet avancé.",
        items: [
            "Des corrections réalisées.",
            "Des contenus ajustés.",
            "Une meilleure cohérence.",
            "Une version mobile vérifiée si nécessaire.",
            "Des petites évolutions maîtrisées.",
            "Une base plus propre.",
            "Une meilleure visibilité sur les prochaines actions.",
        ],
    },
    pricing: {
        title: "Des formats adaptés au niveau de suivi nécessaire.",
        price: "À partir de 180 € / intervention",
        description:
            "Réservée aux sites réalisés par le studio. Le tarif dépend du volume d'ajustements, du niveau de suivi attendu, de la fréquence des demandes, de la complexité du site, du niveau d'urgence et du cadre choisi.",
        included: [
            "Premier échange pour comprendre la demande.",
            "Identification des corrections ou évolutions.",
            "Priorisation des actions.",
            "Corrections simples.",
            "Ajustements de contenus.",
            "Vérifications mobile si nécessaire.",
            "Vérification des éléments modifiés.",
            "Conseils simples pour la suite.",
        ],
        factors: [
            "Volume de corrections.",
            "Urgence de la demande.",
            "Nombre de pages concernées.",
            "Complexité du site.",
            "Besoin de vérification mobile.",
            "Ajout de nouvelles sections.",
            "Petites évolutions fonctionnelles.",
            "Fréquence du suivi.",
            "Niveau de disponibilité attendu.",
        ],
        options: [
            "Intervention ponctuelle.",
            "Pack 5h.",
            "Pack 10h.",
            "Suivi mensuel simple.",
            "Suivi mensuel renforcé.",
            "Mini diagnostic régulier.",
            "Priorité de traitement.",
            "Maintenance post-livraison.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ta maintenance est menée.",
        description:
            "Même de petites interventions gardent un cadre : voici le déroulé réel, en trois temps, de la demande à la clôture. Réservé aux sites que je réalise.",
        count: 13,
        countLabel: "13 étapes réelles",
        groups: [
            {
                verb: "Cadrer",
                summary: "Poser le cadre de service et trier les demandes.",
                steps: [
                    {
                        name: "Kickoff et accès",
                        objective:
                            "Récupérer accès, historiques et consignes pour intervenir sans improviser.",
                    },
                    {
                        name: "Cadre de service",
                        objective:
                            "Définir comment les demandes sont reçues, triées, priorisées et clôturées.",
                    },
                    {
                        name: "État initial",
                        objective:
                            "Créer un point de départ fiable pour comprendre l'existant avant d'intervenir.",
                    },
                    {
                        name: "Triage demande",
                        objective:
                            "Qualifier chaque demande : urgence, impact, périmètre, accès et décision.",
                    },
                ],
            },
            {
                verb: "Intervenir",
                summary: "Corriger dans le périmètre, sans rien casser.",
                steps: [
                    {
                        name: "Sécurisation",
                        objective:
                            "Réduire le risque avant toute correction ou petite évolution.",
                    },
                    {
                        name: "Intervention corrective",
                        objective:
                            "Traiter la demande validée, dans le périmètre, avec une trace claire.",
                    },
                    {
                        name: "QA intervention",
                        objective:
                            "Vérifier que la correction fonctionne et ne casse rien d'essentiel.",
                    },
                    {
                        name: "Validation client",
                        objective:
                            "Te faire confirmer la résolution ou acter qu'une suite est nécessaire.",
                    },
                ],
            },
            {
                verb: "Suivre",
                summary: "Garder l'historique et anticiper la suite.",
                steps: [
                    {
                        name: "Reporting",
                        objective:
                            "Tenir l'historique des interventions pour une vision claire de la maintenance.",
                    },
                    {
                        name: "Clôture ticket",
                        objective:
                            "Fermer proprement le ticket, ou le transformer en devis s'il dépasse le cadre.",
                    },
                    {
                        name: "Revue périodique",
                        objective:
                            "Sur un contrat récurrent, vérifier l'état du site et les demandes à anticiper.",
                    },
                    {
                        name: "Évolution hors forfait",
                        objective:
                            "Transformer proprement une demande trop large en opportunité ou devis.",
                    },
                    {
                        name: "Bilan et RETEX",
                        objective:
                            "Capitaliser pour améliorer la méthode, le site et les futures offres.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "C'est réservé aux sites que tu as faits ?",
            answer:
                "Oui : je maintiens les sites que j'ai réalisés, dont je connais la structure et le code. Pour un site fait ailleurs, un diagnostic ou une refonte est plus juste.",
        },
        {
            question: "Comment ça marche, concrètement ?",
            answer:
                "Tu envoies tes demandes, je les trie et priorise, j'interviens dans un cadre défini (ponctuel ou pack d'heures), puis tu valides. Chaque intervention est tracée.",
        },
        {
            question: "Et si une demande est trop grosse ?",
            answer:
                "Elle sort du cadre maintenance et devient une opportunité ou un devis à part — on ne traite pas une refonte comme une simple correction.",
        },
        {
            question: "180 € / intervention, ça couvre quoi ?",
            answer:
                "C'est un point de départ : le tarif dépend du volume, de l'urgence, de la complexité et du niveau de suivi. On cale le bon format ensemble.",
        },
    ],

};
