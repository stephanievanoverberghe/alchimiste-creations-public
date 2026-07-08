import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const refonteOffer: OfferDetailContent = {
    slug: "refonte",
    family: "Améliorer l'existant",
    seo: {
        title: "Refonte de site web — Alchimiste Créations",
        description:
            "Alchimiste Créations accompagne la refonte de sites web pour clarifier le message, reprendre les pages utiles, améliorer l'expérience mobile et cadrer un périmètre réaliste.",
    },
    hero: {
        eyebrow: "Refonte",
        title: "Refonte de site web sur mesure.",

        description:
            "Une refonte cadrée pour reprendre un site existant quand le message, la structure, le design ou l'expérience ne servent plus le projet.",
        price: "À partir de 2 500 €",
        images: createOfferHeroImages({
            category: "improve",
            folder: "refonte",
            alt: "Ambiance de refonte pour un site web existant",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Repartir sur une base plus claire, pas seulement plus jolie.",
        description:
            "Une refonte sert à comprendre l'existant, garder ce qui fonctionne, corriger ce qui bloque et reconstruire un site plus aligné avec l'activité actuelle.",
        questions: [
            "Le site reflète-t-il encore ton activité ?",
            "Les offres sont-elles faciles à comprendre ?",
            "Quelles pages doivent être gardées, fusionnées ou supprimées ?",
            "Le design inspire-t-il encore confiance ?",
            "Le visiteur sait-il quoi faire ensuite ?",
            "L'expérience mobile est-elle vraiment confortable ?",
        ],
        message:
            "Une refonte utile ne change pas seulement l'apparence. Elle améliore la clarté du projet.",
    },
    qualification: {
        title: "Le bon cadre quand le site doit être repensé dans son ensemble.",
        adapted: {
            title: "Adapté si",
            items: [
                "Ton site existe déjà, mais ne reflète plus ton activité actuelle.",
                "Ton offre, ton message ou ton positionnement ont évolué.",
                "La structure est confuse ou les pages ne jouent plus leur rôle.",
                "Le design ne correspond plus à ton univers.",
                "L'expérience mobile doit être repensée.",
                "Tu veux garder certaines choses, mais revoir l'ensemble.",
            ],
        },
        examples: {
            title: "Situations concernées",
            items: [
                "Site créé rapidement au départ.",
                "Site ancien.",
                "Changement d'activité.",
                "Nouvelle identité visuelle.",
                "Offres restructurées.",
                "Pages devenues trop nombreuses.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Quelques corrections ponctuelles suffisent.",
                "Le vrai besoin n'est pas encore identifié : mieux vaut commencer par un Diagnostic web.",
                "Tu cherches uniquement un audit sans mise en œuvre.",
                "Tu veux ajouter une boutique, un espace membre ou une formation complète dans le même socle.",
                "Tu attends une refonte sans arbitrer les contenus, les pages ou les priorités.",
            ],
        },
        orientations: [
            {
                label: "Diagnostic web",
                href: offerRoutes.diagnosticWeb,
            },
            {
                label: "Maintenance",
                href: offerRoutes.maintenance,
            },
            {
                label: "Site vitrine",
                href: offerRoutes.siteVitrine,
            },
            {
                label: "Projet sur mesure",
                href: offerRoutes.projetSurMesure,
            },
        ],
    },
    scope: {
        title: "Une refonte standard doit être cadrée avant production.",
        note:
            "Une refonte peut vite devenir très large. Le périmètre standard se concentre sur les pages utiles, la structure, le design, le mobile, les CTA et la mise en ligne. Les chantiers avancés doivent être décidés à part.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Analyse de l'existant.",
                    "Clarification des nouveaux objectifs.",
                    "Décision sur ce qui est gardé, supprimé, fusionné ou créé.",
                    "Nouvelle arborescence.",
                    "Périmètre des pages prioritaires.",
                ],
            },
            {
                title: "Création",
                items: [
                    "Restructuration des pages utiles.",
                    "Organisation ou adaptation des contenus existants.",
                    "Direction visuelle revue.",
                    "Refonte du design.",
                    "Développement responsive.",
                    "Optimisation mobile.",
                ],
            },
            {
                title: "Lancement",
                items: [
                    "SEO de base.",
                    "Vérification des liens, formulaires et CTA.",
                    "Redirections simples si nécessaires.",
                    "Vérifications avant mise en ligne.",
                    "Mise en ligne.",
                    "Conseils de prise en main.",
                ],
            },
        ],
        excluded: [
            "La création d'un tout nouveau projet à partir de zéro (c'est une refonte de l'existant).",
            "L'ajout d'une boutique, d'un espace membre ou de modules complexes non prévus.",
            "La rédaction complète de tous les nouveaux contenus.",
            "Une nouvelle identité de marque ou un logo complet.",
            "La récupération de contenus perdus ou non fournis.",
            "Le suivi et les évolutions après la bascule (voir Maintenance).",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Reconstruire sans repartir dans le flou.",
        description:
            "La refonte suit une progression claire : comprendre l'existant, clarifier les nouveaux besoins, restructurer les pages, designer, développer, vérifier et relancer.",
        steps: [
            {
                title: "Comprendre l'existant",
                description:
                    "Observer le site actuel, son contexte, ses difficultés et les éléments à préserver.",
            },
            {
                title: "Clarifier les nouveaux besoins",
                description:
                    "Définir ce que le site doit maintenant transmettre, présenter ou permettre.",
            },
            {
                title: "Restructurer les pages",
                description:
                    "Revoir l'arborescence, les sections importantes et le parcours du visiteur.",
            },
            {
                title: "Recréer le design",
                description:
                    "Créer une direction visuelle plus alignée, lisible et professionnelle.",
            },
            {
                title: "Développer la nouvelle version",
                description:
                    "Construire un site responsive, propre et fonctionnel selon le périmètre retenu.",
            },
            {
                title: "Vérifier et relancer",
                description:
                    "Tester les pages, le mobile, les liens, les formulaires, les anciennes URLs si nécessaire et la cohérence globale.",
            },
        ],
    },
    split: {
        title: "Ton historique, tes objectifs, une nouvelle direction claire.",
        client: {
            title: "Tu apportes",
            items: [
                "Le lien du site existant.",
                "Le contexte du projet.",
                "Les objectifs actuels.",
                "Les contenus disponibles.",
                "Les éléments à garder.",
                "Les éléments à modifier.",
                "Les contraintes connues.",
                "Tes retours et validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "Le regard sur l'existant.",
                "La nouvelle structure.",
                "La direction visuelle.",
                "Le design.",
                "Le développement.",
                "Les vérifications.",
                "L'accompagnement.",
            ],
        },
    },
    result: {
        title: "Un site réaligné avec ton projet actuel.",
        description:
            "La refonte doit remettre chaque élément à sa juste place pour que le site représente à nouveau ton activité avec clarté, confiance et cohérence.",
        items: [
            "Une structure plus claire.",
            "Des pages mieux organisées.",
            "Un message plus aligné avec ton activité.",
            "Un design plus cohérent.",
            "Une version mobile plus agréable.",
            "Un parcours utilisateur plus fluide.",
            "Des appels à l'action mieux placés.",
            "Une mise en ligne cadrée de la nouvelle version.",
        ],
    },
    pricing: {
        title: "Un prix de départ pour reconstruire une base plus claire.",
        price: "À partir de 2 500 €",
        description:
            "Le tarif final dépend de l'état du site existant, du nombre de pages à reprendre, du niveau de restructuration, du design, des contenus à adapter et des contraintes techniques. Si le besoin est flou, le Diagnostic web peut être la première étape.",
        included: [
            "Analyse de l'existant.",
            "Cadrage du nouveau besoin.",
            "Nouvelle arborescence.",
            "Restructuration des pages prioritaires.",
            "Direction visuelle revue.",
            "Refonte du design.",
            "Développement responsive.",
            "Optimisation mobile.",
            "Adaptation des contenus selon le périmètre.",
            "SEO de base.",
            "Vérifications avant mise en ligne.",
            "Mise en ligne.",
        ],
        factors: [
            "Nombre de pages à refondre.",
            "Niveau de restructuration.",
            "Niveau de refonte graphique.",
            "Volume de contenus à adapter.",
            "Migration de contenus.",
            "Formulaire avancé.",
            "Contraintes techniques du site existant.",
            "Maintenance après refonte.",
        ],
        options: [
            "Diagnostic web préalable si les problèmes ne sont pas encore clairs.",
            "Page supplémentaire.",
            "Accompagnement contenu.",
            "Migration de contenus existants.",
            "Blog simple.",
            "Formulaire avancé.",
            "Animations légères.",
            "Maintenance post-livraison.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ta refonte est menée.",
        description:
            "Refaire un site sans casser l'existant demande de la méthode : voici le déroulé réel, en trois temps, de l'audit à la bascule.",
        count: 18,
        countLabel: "18 étapes réelles",
        groups: [
            {
                verb: "Clarifier",
                summary: "Comprendre l'existant et décider la nouvelle direction.",
                steps: [
                    {
                        name: "Kickoff et collecte",
                        objective:
                            "Récupérer les accès, ressources et contraintes avant de toucher à l'existant.",
                    },
                    {
                        name: "Audit de l'existant",
                        objective:
                            "Comprendre ce qui doit être gardé, corrigé, supprimé ou sécurisé.",
                    },
                    {
                        name: "Cadrage de la refonte",
                        objective:
                            "Définir la nouvelle intention du site sans perdre les acquis utiles.",
                    },
                    {
                        name: "Inventaire contenus et URLs",
                        objective:
                            "Sécuriser les contenus et les URLs avant de reconstruire.",
                    },
                    {
                        name: "Nouvelle architecture",
                        objective:
                            "Construire une structure plus claire, en tenant compte de l'existant.",
                    },
                    {
                        name: "Stratégie contenus et SEO",
                        objective:
                            "Réécrire, optimiser et sécuriser les bases SEO avant design et migration.",
                    },
                ],
            },
            {
                verb: "Designer",
                summary: "Faire évoluer l'univers visuel et valider les écrans.",
                steps: [
                    {
                        name: "Direction artistique refonte",
                        objective:
                            "Faire évoluer l'univers visuel sans perdre la reconnaissance de la marque.",
                    },
                    {
                        name: "Maquettes refonte",
                        objective:
                            "Visualiser le nouveau site avant développement et valider les écrans clés.",
                    },
                ],
            },
            {
                verb: "Lancer",
                summary: "Migrer proprement, sans casser l'existant.",
                steps: [
                    {
                        name: "Mapping et redirections",
                        objective:
                            "Préparer la migration sans casser les URLs importantes.",
                    },
                    {
                        name: "Setup technique et migration",
                        objective:
                            "Préparer la base technique et la stratégie de migration.",
                    },
                    {
                        name: "Développement refonte",
                        objective:
                            "Construire la nouvelle version selon le périmètre validé.",
                    },
                    {
                        name: "Migration contenus",
                        objective:
                            "Intégrer les contenus validés et vérifier les traces SEO.",
                    },
                    {
                        name: "Fonctionnalités et formulaires",
                        objective:
                            "Vérifier que les fonctions utiles marchent avant la QA.",
                    },
                    {
                        name: "QA avant après",
                        objective:
                            "Contrôler la nouvelle version et comparer les points sensibles avec l'ancienne.",
                    },
                    {
                        name: "Recette client",
                        objective:
                            "Te faire valider la refonte en cadrant les retours et le hors périmètre.",
                    },
                    {
                        name: "Mise en ligne et migration",
                        objective:
                            "Basculer en production sans perdre accès, URLs et contrôles essentiels.",
                    },
                    {
                        name: "Livraison et passation",
                        objective:
                            "Livrer, expliquer les changements et te rendre autonome.",
                    },
                    {
                        name: "Stabilisation et RETEX",
                        objective:
                            "Surveiller l'après-bascule et qualifier les demandes.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "Vais-je perdre mon référencement (SEO) ?",
            answer:
                "C'est un point clé : on inventorie les URLs, on prépare les redirections et on sécurise les bases SEO avant la bascule, pour préserver ton acquis.",
        },
        {
            question: "Peux-tu refondre un site que je n'ai pas fait avec toi ?",
            answer:
                "Oui. On commence par un audit de l'existant pour comprendre ce qui doit être gardé, corrigé ou reconstruit.",
        },
        {
            question: "Combien de temps ça prend ?",
            answer:
                "Selon l'ampleur et le volume de contenus à migrer, compte généralement de quatre à huit semaines.",
        },
        {
            question: "Le prix est-il fixe ?",
            answer:
                "« À partir de 2 500 € » est un point de départ ; le devis dépend de l'état de l'existant, du volume à migrer et du périmètre de la nouvelle version.",
        },
    ],

};
