import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const diagnosticWebOffer: OfferDetailContent = {
    slug: "diagnostic-web",
    family: "Améliorer l'existant",
    seo: {
        title: "Diagnostic web — Alchimiste Créations",
        description:
            "Alchimiste Créations analyse ton site existant pour identifier les points de flou, prioriser les améliorations et décider si une refonte est nécessaire.",
    },
    hero: {
        eyebrow: "Diagnostic web",
        title: "Diagnostic web pour site existant.",

        description:
            "L'offre d'entrée pour prendre du recul sur un site déjà en ligne, comprendre ce qui freine le parcours et décider quoi corriger, clarifier ou refondre.",
        price: "À partir de 350 €",
        images: createOfferHeroImages({
            category: "improve",
            folder: "diagnostic-web",
            alt: "Ambiance d'analyse pour un diagnostic web",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Comprendre ce qui bloque avant d'investir plus loin.",
        description:
            "Le Diagnostic web observe ton site comme un visiteur : clarté du message, structure des pages, appels à l'action, confiance, expérience mobile et priorités d'amélioration.",
        questions: [
            "Est-ce que le visiteur comprend vite ce que tu proposes ?",
            "Où le parcours devient-il flou ou inconfortable ?",
            "Quels contenus, pages ou CTA doivent être revus ?",
            "Est-ce que le site inspire encore confiance ?",
            "Faut-il corriger l'existant ou préparer une refonte ?",
            "Quelles actions sont vraiment prioritaires ?",
        ],
        message:
            "Le diagnostic transforme une impression floue en décisions plus claires.",
    },
    qualification: {
        title: "Le bon point d'entrée quand le site existe déjà.",
        adapted: {
            title: "Adapté si",
            items: [
                "Ton site existe déjà, mais tu ne sais pas exactement ce qui freine.",
                "Tu hésites entre quelques corrections et une refonte plus large.",
                "Tu veux une lecture extérieure avant d'engager un budget important.",
                "Tu as besoin de priorités concrètes, pas d'un audit interminable.",
                "Tu veux comprendre si le site doit être amélioré, maintenu ou refondu.",
            ],
        },
        examples: {
            title: "Situations concernées",
            items: [
                "Page d'accueil confuse.",
                "Offres mal comprises.",
                "Mobile inconfortable.",
                "Peu de demandes via le site.",
                "Design qui ne reflète plus le projet.",
                "Refonte envisagée sans priorité claire.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Tu n'as pas encore de site à analyser.",
                "Tu veux directement concevoir et développer un nouveau site.",
                "Tu cherches une analyse SEO très technique ou un audit publicitaire.",
                "Tu attends des corrections complètes dans le diagnostic lui-même.",
                "Le périmètre de refonte est déjà clair, validé et priorisé.",
            ],
        },
        orientations: [
            {
                label: "Site vitrine",
                href: offerRoutes.siteVitrine,
            },
            {
                label: "One-page",
                href: offerRoutes.onePage,
            },
            {
                label: "Refonte",
                href: offerRoutes.refonte,
            },
            {
                label: "Maintenance",
                href: offerRoutes.maintenance,
            },
        ],
    },
    scope: {
        title: "Une lecture structurée, avec un livrable exploitable.",
        note:
            "Pour un site simple, le diagnostic peut généralement être réalisé en 3 à 5 jours ouvrés. Pour un périmètre plus large, il faut plutôt prévoir une semaine selon le nombre de pages et le niveau de restitution attendu.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange pour comprendre le contexte.",
                    "Lien du site et pages prioritaires à observer.",
                    "Objectifs actuels du site.",
                    "Difficultés ressenties et questions à éclaircir.",
                ],
            },
            {
                title: "Analyse",
                items: [
                    "Lecture du message et de la structure.",
                    "Analyse de la page d'accueil et des pages clés.",
                    "Observation du parcours, des CTA et de la confiance.",
                    "Analyse mobile ciblée.",
                    "Identification des points de flou.",
                ],
            },
            {
                title: "Restitution",
                items: [
                    "Synthèse PDF ou compte-rendu clair.",
                    "Points forts et points à améliorer.",
                    "Priorités hiérarchisées.",
                    "Recommandations concrètes.",
                    "Prochaine étape recommandée.",
                ],
            },
        ],
        excluded: [
            "La correction ou la refonte du site : le diagnostic observe et recommande.",
            "La production de nouveaux contenus ou visuels.",
            "Un audit SEO expert exhaustif ou un audit de sécurité approfondi.",
            "La mise en place d'outils de tracking ou d'analytics.",
            "Un accompagnement de suivi dans la durée.",
            "Les développements ou correctifs techniques (voir Refonte ou Maintenance).",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Observer, comprendre, prioriser.",
        description:
            "Le diagnostic reprend l'esprit de la Méthode Alchimiste : clarifier le contexte, regarder ce qui crée du flou, puis préparer une suite réaliste.",
        steps: [
            {
                title: "Comprendre le contexte",
                description:
                    "Identifier l'activité, les objectifs du site et les difficultés ressenties.",
            },
            {
                title: "Observer le site",
                description:
                    "Parcourir les pages principales, la navigation, le design, les CTA et la version mobile.",
            },
            {
                title: "Repérer les points de flou",
                description:
                    "Identifier ce qui peut empêcher le visiteur de comprendre, de faire confiance ou de passer à l'action.",
            },
            {
                title: "Prioriser les améliorations",
                description:
                    "Différencier ce qui est important, utile ou secondaire pour éviter de tout traiter en même temps.",
            },
            {
                title: "Recommander la suite",
                description:
                    "Proposer une direction : ajustements, maintenance, refonte ou nouveau cadrage.",
            },
        ],
    },
    split: {
        title: "Ton site, ton ressenti, un regard extérieur cadré.",
        client: {
            title: "Tu apportes",
            items: [
                "Le lien du site existant.",
                "Le contexte du projet.",
                "Les objectifs du site.",
                "Les difficultés ressenties.",
                "Les pages importantes à analyser.",
                "Les éléments disponibles : retours, analytics ou messages si tu en as.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le regard extérieur.",
                "La méthode d'analyse.",
                "La clarté des observations.",
                "La priorisation.",
                "Les recommandations.",
                "L'accompagnement vers la suite.",
            ],
        },
    },
    result: {
        title: "Une vision claire de ce qu'il faut améliorer.",
        description:
            "À la fin du diagnostic, tu sais mieux ce qui fonctionne, ce qui bloque et quelle suite envisager sans avancer au hasard.",
        items: [
            "Un document clair pour comprendre ce qui bloque.",
            "Une liste de points forts.",
            "Une liste de points à améliorer.",
            "Des priorités hiérarchisées.",
            "Des recommandations concrètes.",
            "Une recommandation : corriger, maintenir, clarifier ou refondre.",
            "Une base de décision avant d'engager un budget plus important.",
        ],
    },
    pricing: {
        title: "Un prix d'entrée pour décider avec plus de recul.",
        price: "À partir de 350 €",
        description:
            "Le tarif final dépend du nombre de pages analysées, du niveau de détail, de la restitution souhaitée et du besoin éventuel de pré-cadrage. Le diagnostic peut être déduit d'un projet complet seulement si cette condition est validée au devis.",
        included: [
            "Premier échange pour comprendre le contexte.",
            "Analyse ciblée du site existant.",
            "Analyse de la page d'accueil et des pages clés.",
            "Lecture du message, du parcours et des appels à l'action.",
            "Analyse mobile ciblée.",
            "Identification des freins principaux.",
            "Livrable synthétique avec constats, priorités et recommandations.",
            "Restitution courte pour clarifier la suite.",
        ],
        factors: [
            "Nombre de pages analysées.",
            "Niveau de détail du diagnostic.",
            "Analyse mobile plus approfondie.",
            "Analyse de parcours plus complexe.",
            "Restitution orale.",
            "Plan d'action détaillé.",
            "Pré-cadrage de refonte.",
        ],
        options: [
            "Restitution en visio.",
            "Analyse d'une page ou d'un parcours supplémentaire.",
            "Plan d'action détaillé.",
            "Cadrage d'une refonte à partir du diagnostic.",
            "Suivi après diagnostic.",
            "Déduction possible du diagnostic sur un projet complet, à confirmer au devis.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ton diagnostic est mené.",
        description:
            "Le diagnostic n'est pas un avis en survol : il suit un déroulé d'analyse réel, en trois temps, jusqu'à un livrable exploitable.",
        count: 14,
        countLabel: "14 étapes réelles",
        groups: [
            {
                verb: "Explorer",
                summary: "Comprendre le contexte et cartographier l'existant.",
                steps: [
                    {
                        name: "Kickoff et collecte",
                        objective:
                            "Récupérer les infos, accès et objectifs pour observer le site efficacement.",
                    },
                    {
                        name: "Cadrage d'audit",
                        objective:
                            "Définir les axes observés, la profondeur et la forme de décision attendue.",
                    },
                    {
                        name: "Inventaire du site",
                        objective:
                            "Cartographier l'existant pour repérer les zones à risque.",
                    },
                ],
            },
            {
                verb: "Analyser",
                summary: "Passer le site au crible, angle par angle.",
                steps: [
                    {
                        name: "Positionnement et message",
                        objective:
                            "Vérifier si le site dit clairement qui il aide, ce qu'il propose et pourquoi le choisir.",
                    },
                    {
                        name: "UX et conversion",
                        objective:
                            "Évaluer si le parcours aide à comprendre, décider et passer à l'action.",
                    },
                    {
                        name: "Contenus",
                        objective:
                            "Évaluer l'utilité, la cohérence et les manques des contenus.",
                    },
                    {
                        name: "SEO",
                        objective:
                            "Évaluer les bases SEO utiles, sans audit expert illimité.",
                    },
                    {
                        name: "Technique et performance",
                        objective:
                            "Repérer les problèmes techniques qui freinent l'expérience ou la confiance.",
                    },
                    {
                        name: "Mesure et tracking",
                        objective:
                            "Évaluer si le site permet de comprendre ce qui fonctionne.",
                    },
                    {
                        name: "Benchmark ciblé",
                        objective:
                            "Comparer quelques références utiles pour nourrir les recommandations.",
                    },
                ],
            },
            {
                verb: "Restituer",
                summary: "Transformer les constats en décisions claires.",
                steps: [
                    {
                        name: "Synthèse et priorisation",
                        objective:
                            "Transformer les constats en plan d'action priorisé et exploitable.",
                    },
                    {
                        name: "Rapport diagnostic",
                        objective:
                            "Produire un livrable clair et orienté décision, pas un pavé d'audit.",
                    },
                    {
                        name: "Restitution",
                        objective:
                            "Présenter les constats pour t'aider à comprendre, prioriser et décider.",
                    },
                    {
                        name: "Livraison et clôture",
                        objective: "Livrer les documents finaux et cadrer la suite.",
                    },
                ],
            },
        ],
    },
    faq: [
        {
            question: "Je repars avec quoi, concrètement ?",
            answer:
                "Un livrable clair (synthèse ou compte-rendu) : points forts, points à améliorer, priorités hiérarchisées et une prochaine étape recommandée — exploitable même sans moi.",
        },
        {
            question: "Est-ce que tu corriges les problèmes trouvés ?",
            answer:
                "Le diagnostic observe et recommande. Les corrections relèvent ensuite d'une refonte ou d'une maintenance, selon l'ampleur — et le diagnostic peut être déduit si tu enchaînes.",
        },
        {
            question: "Combien de temps ça prend ?",
            answer:
                "Pour un site simple, 3 à 5 jours ouvrés ; une semaine pour un périmètre plus large.",
        },
        {
            question: "C'est utile même si je compte tout refaire ?",
            answer:
                "Oui : le diagnostic évite de refaire à l'aveugle. Il clarifie ce qui bloque vraiment avant d'investir dans une refonte.",
        },
    ],

};
