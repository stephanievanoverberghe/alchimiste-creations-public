import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const landingPageOffer: OfferDetailContent = {
    slug: "landing-page",
    family: "Créer un site",
    seo: {
        title: "Landing page — Alchimiste Créations",
        description:
            "Alchimiste Créations crée des landing pages sur mesure pour clarifier une offre, construire un argumentaire, rassurer et guider vers une action précise.",
    },
    hero: {
        eyebrow: "Landing page",
        title: "Création de landing page sur mesure.",

        description:
            "Une page orientée action pour vendre, réserver, s'inscrire, télécharger, rejoindre une liste ou lancer une offre précise.",
        price: "À partir de 1 500 €",
        images: createOfferHeroImages({
            category: "create",
            folder: "landing-page",
            alt: "Ambiance de conception pour une landing page",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Une page pensée pour une action précise.",
        description:
            "La Landing page sert une offre, un lancement ou une campagne. Elle concentre le message, l'argumentaire, la réassurance et le CTA autour d'une décision claire.",
        questions: [
            "Quelle offre ou action doit être comprise immédiatement ?",
            "À qui s'adresse cette proposition ?",
            "Quelle action doit être déclenchée ?",
            "Quels arguments donnent envie d'aller plus loin ?",
            "Quelles preuves ou réassurances lèvent les freins ?",
            "Quel CTA doit rester évident du début à la fin ?",
        ],
        message:
            "Une bonne Landing page ne disperse pas l'attention. Elle rend le message clair et l'action évidente.",
    },
    qualification: {
        title: "Le bon format quand une page doit soutenir une action.",
        adapted: {
            title: "Adapté si",
            items: [
                "Tu veux vendre une offre, réserver un appel, obtenir une inscription ou faire télécharger une ressource.",
                "L'offre est ciblée et l'action attendue est claire.",
                "La page doit soutenir un lancement, une liste d'attente ou une campagne.",
                "Tu as besoin d'un argumentaire structuré avec bénéfices, preuves, réassurance et CTA.",
                "Tu veux une page facile à partager pour une action précise.",
            ],
        },
        examples: {
            title: "Actions possibles",
            items: [
                "Vendre une offre.",
                "Réserver un appel.",
                "S'inscrire à un événement.",
                "Télécharger une ressource.",
                "Rejoindre une liste.",
                "Lancer une offre.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Le besoin est de présenter toute une activité.",
                "Le projet demande plusieurs pages institutionnelles.",
                "L'objectif principal n'est pas encore clair.",
                "Tu veux surtout une mini-présence simple, sans logique d'offre ou de lancement.",
                "Tu as besoin d'une boutique complète, d'un média ou d'un espace membre.",
            ],
        },
        orientations: [
            {
                label: "One-page",
                href: offerRoutes.onePage,
            },
            {
                label: "Site vitrine",
                href: offerRoutes.siteVitrine,
            },
            {
                label: "Boutique en ligne",
                href: offerRoutes.boutiqueEnLigne,
            },
            {
                label: "Diagnostic web",
                href: offerRoutes.diagnosticWeb,
            },
        ],
    },
    scope: {
        title: "Un parcours court, ciblé et convaincant.",
        note:
            "La Landing page doit rester concentrée. Chaque section doit aider à comprendre l'offre, lever un doute ou guider vers l'action principale.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange et clarification de l'objectif.",
                    "Offre, cible et promesse principale.",
                    "Action attendue : vendre, réserver, s'inscrire, télécharger ou rejoindre.",
                    "Freins, preuves et réassurances nécessaires.",
                    "CTA principal.",
                ],
            },
            {
                title: "Création",
                items: [
                    "Structure de la page.",
                    "Hiérarchie des arguments.",
                    "Sections de bénéfices, preuves et réassurance.",
                    "Direction visuelle adaptée.",
                    "Design sur mesure.",
                    "Développement responsive.",
                ],
            },
            {
                title: "Lancement",
                items: [
                    "CTA ou formulaire simple.",
                    "Optimisation mobile.",
                    "SEO de base si pertinent.",
                    "Vérification des liens et formulaires.",
                    "Mise en ligne.",
                ],
            },
        ],
        excluded: [
            "Un site complet ou des pages supplémentaires (la landing sert une seule offre).",
            "Une boutique ou un catalogue de produits.",
            "La création de la campagne publicitaire (budget média, ciblage, pub).",
            "La création d'un logo ou d'une identité de marque complète.",
            "Un stack analytics avancé ou un CRM.",
            "L'optimisation continue après lancement (voir Maintenance).",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Une page ciblée demande un cadrage précis.",
        description:
            "La méthode permet de clarifier l'offre, l'action attendue et les arguments utiles avant de designer la page. Le visuel vient soutenir la décision, pas la masquer.",
        steps: [
            {
                title: "Comprendre l'offre",
                description:
                    "Identifier ce qui est proposé, à qui, avec quelle promesse et dans quel contexte.",
            },
            {
                title: "Clarifier l'action attendue",
                description:
                    "Définir ce que le visiteur doit faire : acheter, réserver, s'inscrire, télécharger ou demander un échange.",
            },
            {
                title: "Structurer l'argumentaire",
                description:
                    "Organiser le problème, l'offre, les bénéfices, les preuves, les objections et les CTA.",
            },
            {
                title: "Designer le parcours",
                description:
                    "Créer une page lisible, rassurante et alignée avec l'univers du projet.",
            },
            {
                title: "Développer la page",
                description:
                    "Créer une page responsive, rapide à comprendre et confortable sur mobile.",
            },
            {
                title: "Vérifier et lancer",
                description:
                    "Tester les CTA, les formulaires, les liens, le mobile et les derniers réglages avant publication.",
            },
        ],
    },
    split: {
        title: "Une offre à clarifier, un parcours à construire.",
        client: {
            title: "Tu apportes",
            items: [
                "Ton offre ou ton idée.",
                "Ton objectif principal.",
                "Ta cible.",
                "Tes contenus existants si disponibles.",
                "Tes preuves, garanties ou éléments de confiance.",
                "Tes contraintes ou délais.",
                "Tes retours et validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "La structure.",
                "La hiérarchie du message.",
                "La logique de réassurance.",
                "Le design.",
                "Le développement.",
                "La clarté du parcours.",
            ],
        },
    },
    result: {
        title: "Une page ciblée, claire et facile à utiliser.",
        description:
            "La Landing page donne une forme claire à une offre précise. Elle aide le visiteur à comprendre vite, à être rassuré et à savoir quelle action faire ensuite.",
        items: [
            "Une offre mieux expliquée.",
            "Un message structuré.",
            "Un argumentaire plus lisible.",
            "Des éléments de réassurance mieux placés.",
            "Un CTA clair.",
            "Un formulaire ou lien d'action fonctionnel.",
            "Une version mobile soignée.",
            "Un support clair pour lancer ou promouvoir.",
        ],
    },
    pricing: {
        title: "Un prix de départ pour une page orientée objectif.",
        price: "À partir de 1 500 €",
        description:
            "Le tarif final dépend de l'objectif de la page, du niveau d'argumentaire, du volume de contenus, du design, du formulaire ou CTA nécessaire et des éventuelles intégrations.",
        included: [
            "Cadrage de l'objectif.",
            "Clarification de l'offre ou du lancement.",
            "Identification de l'action principale.",
            "Structure de la page.",
            "Organisation des arguments.",
            "Direction visuelle adaptée.",
            "Design sur mesure.",
            "Développement responsive.",
            "Optimisation mobile.",
            "Formulaire ou CTA simple.",
            "Vérifications avant mise en ligne.",
            "Mise en ligne.",
        ],
        factors: [
            "Niveau de stratégie du message.",
            "Volume de contenus à structurer.",
            "Nombre de sections.",
            "Formulaire plus avancé.",
            "Connexion à un outil externe.",
            "Besoin d'accompagnement contenu.",
            "Animations ou interactions spécifiques.",
            "Suivi post-lancement.",
        ],
        options: [
            "Variante de section pour test.",
            "Accompagnement sur l'argumentaire.",
            "Connexion à un outil d'inscription ou de réservation.",
            "Section FAQ ou objections.",
            "Animation légère.",
            "Optimisation SEO renforcée.",
            "Maintenance pendant un lancement.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ta landing page est produite.",
        description:
            "Une landing efficace ne s'improvise pas : elle suit un déroulé de production réel, regroupé en trois temps. Voici les étapes concrètes.",
        count: 18,
        countLabel: "18 étapes réelles",
        groups: [
            {
                verb: "Clarifier",
                summary: "Poser l'offre, l'angle et l'argumentaire de conversion.",
                steps: [
                    {
                        name: "Kickoff et collecte",
                        objective:
                            "Installer le cadre et récupérer accès, contenus, preuves et éléments de campagne.",
                    },
                    {
                        name: "Objectif de conversion",
                        objective:
                            "Définir l'action à provoquer et comment on saura si elle fonctionne.",
                    },
                    {
                        name: "Cible et objections",
                        objective:
                            "Comprendre à qui la page parle, ce qui bloque et ce qui rassure.",
                    },
                    {
                        name: "Offre et promesse",
                        objective:
                            "Clarifier l'offre et l'angle de persuasion avant de structurer.",
                    },
                    {
                        name: "Structure persuasive",
                        objective:
                            "Ordonner les sections pour faire avancer le visiteur vers l'action.",
                    },
                    {
                        name: "Copywriting",
                        objective:
                            "Rédiger les textes pour clarifier, rassurer et déclencher l'action.",
                    },
                    {
                        name: "Preuves et réassurance",
                        objective:
                            "Choisir ce qui crédibilise la promesse et réduit le risque perçu.",
                    },
                    {
                        name: "Formulaire et destination",
                        objective:
                            "Définir ce qui se passe quand le visiteur clique ou envoie ses infos.",
                    },
                    {
                        name: "Tracking et mesure",
                        objective:
                            "Cadrer les événements à suivre, sans couche analytics inutile.",
                    },
                ],
            },
            {
                verb: "Designer",
                summary: "Donner une forme visuelle au service de la conversion.",
                steps: [
                    {
                        name: "Direction artistique",
                        objective:
                            "Fixer une direction visuelle qui soutient la conversion.",
                    },
                    {
                        name: "Maquette UI",
                        objective:
                            "Concevoir la page avant développement : parcours, hiérarchie, états clés.",
                    },
                ],
            },
            {
                verb: "Lancer",
                summary: "Construire, tester la conversion et publier.",
                steps: [
                    {
                        name: "Setup technique",
                        objective: "Préparer une base technique légère et fiable.",
                    },
                    {
                        name: "Développement",
                        objective:
                            "Développer la page : hiérarchie claire, responsive propre, interactions utiles.",
                    },
                    {
                        name: "Intégration contenus",
                        objective:
                            "Intégrer textes, visuels, preuves, métadonnées et réassurance validés.",
                    },
                    {
                        name: "QA conversion",
                        objective:
                            "Tester la page comme un parcours de conversion, pas juste une jolie page.",
                    },
                    {
                        name: "Recette client",
                        objective:
                            "Te faire valider la landing sans la transformer en refonte d'offre.",
                    },
                    {
                        name: "Mise en ligne",
                        objective:
                            "Publier en vérifiant l'URL, le formulaire, le tracking et la conversion.",
                    },
                    {
                        name: "Livraison et RETEX",
                        objective:
                            "Livrer l'utile, clôturer proprement et noter les apprentissages de conversion.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "Quelle différence avec une one-page ?",
            answer:
                "La one-page présente ton activité globale ; la landing page est concentrée sur une seule offre et une seule action (vendre, réserver, inscrire). Elle est pensée pour la conversion.",
        },
        {
            question: "Faut-il déjà avoir ma campagne publicitaire ?",
            answer:
                "Non, mais savoir d'où viendra le trafic (pub, emailing, réseaux) aide à aligner le message. Je crée la page — pas la campagne média elle-même.",
        },
        {
            question: "Combien de temps ça prend ?",
            answer:
                "Généralement deux à quatre semaines, selon tes contenus et les preuves disponibles.",
        },
        {
            question: "Le prix est-il fixe ?",
            answer:
                "« À partir de 1 500 € » est un point de départ. Le devis est posé après le cadrage, une fois l'offre et le parcours clairs.",
        },
    ],

};
