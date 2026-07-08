import { offerRoutes } from "@/config/navigation";

import type { OfferDetailContent } from "./types";
import {

    createOfferHeroImages,
    offerDetailActions,
} from "./shared";

export const formationEnLigneOffer: OfferDetailContent = {
    slug: "formation-en-ligne",
    family: "Vendre ou transmettre",
    seo: {
        title: "Formation en ligne sur mesure — Alchimiste Créations",
        description:
            "Alchimiste Créations crée des espaces de formation en ligne sur mesure pour présenter ton parcours, organiser tes modules et offrir une expérience claire aux apprenants.",
    },
    hero: {
        eyebrow: "Formation en ligne",
        title: "Création de formation en ligne sur mesure.",

        description:
            "Un espace de formation clair pour organiser tes modules, structurer tes contenus et offrir une expérience simple aux apprenants.",
        price: "Sur devis, après échange",
        images: createOfferHeroImages({
            category: "sell",
            folder: "formation",
            alt: "Ambiance de conception pour une formation en ligne",
        }),
        primaryAction: offerDetailActions.presentProject,

    },
    purpose: {
        title: "Transmettre avec un parcours clair.",
        description:
            "Une formation en ligne ne consiste pas seulement à déposer des vidéos ou des PDF. Elle doit organiser un savoir, guider l'apprenant et rendre chaque étape facile à retrouver.",
        questions: [
            "Que doit apprendre ou suivre l'apprenant ?",
            "Comment organiser les modules et les leçons ?",
            "Quels contenus doivent être accessibles ?",
            "Quels accès doivent être protégés ou ouverts ?",
            "Faut-il prévoir une inscription ou un paiement ?",
            "Comment rendre l'expérience mobile confortable ?",
        ],
        message:
            "Une bonne formation en ligne rend le parcours simple à suivre, même quand le contenu est riche.",
    },
    qualification: {
        title: "Le bon cadre pour transmettre un contenu organisé.",
        adapted: {
            title: "Adapté si",
            items: [
                "Tu veux vendre ou diffuser une formation.",
                "Tu as besoin d'organiser des modules, leçons ou ressources.",
                "Tu souhaites proposer un espace apprenant ou membre simple.",
                "Tu veux structurer un parcours pédagogique lisible.",
                "Tu veux rendre ton contenu plus clair et plus accessible.",
            ],
        },
        examples: {
            title: "Exemples de projets concernés",
            items: [
                "Formation en ligne payante.",
                "Formation gratuite avec accès privé.",
                "Programme d'accompagnement.",
                "Bibliothèque de ressources.",
                "Mini-formation.",
                "Méthode à transmettre étape par étape.",
            ],
        },
        notAdapted: {
            title: "Pas adapté si",
            items: [
                "Tu veux seulement une page de présentation sans accès aux contenus.",
                "Ta formation, tes modules ou ton parcours ne sont pas encore cadrés.",
                "Tu as besoin d'une plateforme SaaS de formation.",
                "Tu veux un CRM complet ou des automatisations avancées dès le départ.",
                "Tu attends la création complète des contenus pédagogiques, vidéos ou montages.",
            ],
        },
        orientations: [
            {
                label: "Landing page",
                href: offerRoutes.landingPage,
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
                label: "Projet sur mesure",
                href: offerRoutes.projetSurMesure,
            },
        ],
    },
    scope: {
        title: "Un accompagnement pour structurer et rendre accessible ta formation.",
        note:
            "La structure exacte dépend du type de formation, des contenus, du niveau d'accès, du mode de vente et du degré d'autonomie attendu pour l'apprenant.",
        groups: [
            {
                title: "Cadrage",
                items: [
                    "Premier échange et clarification du besoin.",
                    "Objectif du parcours.",
                    "Public visé.",
                    "Nombre de modules et de leçons.",
                    "Formats des contenus : vidéo, audio, texte, PDF ou ressources.",
                ],
            },
            {
                title: "Création",
                items: [
                    "Structure des modules.",
                    "Pages de présentation et de consultation.",
                    "Réflexion sur les accès.",
                    "Direction visuelle.",
                    "Design de l'interface.",
                    "Développement responsive.",
                ],
            },
            {
                title: "Lancement",
                items: [
                    "Espace apprenant ou membre simple selon le périmètre.",
                    "Paiement ou inscription si prévu.",
                    "Intégration des contenus selon le volume prévu.",
                    "Optimisation mobile.",
                    "Vérifications avant mise en ligne.",
                    "Conseils de prise en main.",
                ],
            },
        ],
        excluded: [
            "La création de tes contenus pédagogiques (cours, vidéos, exercices — le fond reste le tien).",
            "Le tournage ou le montage vidéo.",
            "La stratégie de vente, le tunnel marketing ou la publicité.",
            "Une plateforme LMS complexe (certifications, quiz avancés, communauté) — à étudier à part.",
            "La gestion quotidienne des apprenants et du support.",
            "La comptabilité, la facturation ou les obligations fiscales.",
        ],
    },
    method: {
        eyebrow: "Méthode appliquée",
        title: "Structurer avant de transmettre.",
        description:
            "La méthode permet d'organiser le contenu, de définir les accès, de penser l'expérience apprenant et de vérifier que le parcours reste simple à suivre.",
        steps: [
            {
                title: "Comprendre la formation",
                description:
                    "Identifier ce qui est transmis, à qui, avec quel objectif et quel niveau d'accompagnement.",
            },
            {
                title: "Clarifier le parcours",
                description:
                    "Organiser les modules, les étapes et les contenus importants.",
            },
            {
                title: "Structurer l'espace",
                description:
                    "Définir les pages, les accès, le tableau de bord et les zones de consultation.",
            },
            {
                title: "Créer le design",
                description:
                    "Créer une interface claire, rassurante et agréable pour apprendre.",
            },
            {
                title: "Développer l'espace",
                description:
                    "Construire une base responsive, fonctionnelle et adaptée au contenu.",
            },
            {
                title: "Vérifier et lancer",
                description:
                    "Tester l'accès, la navigation, les contenus, le mobile, les liens et les éventuels paiements ou inscriptions.",
            },
        ],
    },
    split: {
        title: "Ton savoir, organisé dans un cadre clair.",
        client: {
            title: "Tu apportes",
            items: [
                "Ton savoir ou ta méthode.",
                "Les contenus de formation.",
                "Les modules ou idées de modules.",
                "Les ressources disponibles.",
                "Les informations de vente si besoin.",
                "Ton univers.",
                "Tes retours et validations.",
            ],
        },
        studio: {
            title: "Alchimiste Créations apporte",
            items: [
                "Le cadre.",
                "La structure pédagogique web.",
                "La direction visuelle.",
                "Le design.",
                "Le développement.",
                "La logique d'accès.",
                "La clarté du parcours.",
                "L'accompagnement.",
            ],
        },
    },
    result: {
        title: "Un espace de formation clair et agréable à parcourir.",
        description:
            "La formation doit donner envie d'apprendre, mais surtout permettre d'avancer sans confusion : l'apprenant sait où il est, ce qu'il peut consulter et quelle est la prochaine étape.",
        items: [
            "Une présentation claire de la formation.",
            "Un parcours structuré.",
            "Des modules organisés.",
            "Une expérience apprenant simple.",
            "Un accès aux contenus selon le périmètre.",
            "Une version mobile soignée.",
            "Une base prête à évoluer.",
            "Une mise en ligne cadrée.",
        ],
    },
    pricing: {
        title: "Un tarif défini sur devis, après un premier échange.",
        price: "Sur devis",
        description:
            "La formation en ligne se chiffre sur mesure : le tarif dépend du nombre de modules, du type de contenus, des accès à prévoir, du règlement éventuel, de l'espace apprenant et du niveau d'accompagnement souhaité. On le définit ensemble après avoir cadré ton besoin.",
        included: [
            "Cadrage du parcours de formation.",
            "Structure des modules.",
            "Page de présentation de la formation.",
            "Organisation des contenus.",
            "Réflexion sur les accès.",
            "Design sur mesure.",
            "Développement responsive.",
            "Optimisation mobile.",
            "Espace apprenant ou membre simple selon le périmètre.",
            "Intégration des contenus selon le volume prévu.",
            "Vérifications avant mise en ligne.",
            "Mise en ligne.",
        ],
        factors: [
            "Nombre de modules.",
            "Nombre de leçons.",
            "Volume de contenus à intégrer.",
            "Format des contenus.",
            "Niveau de protection des accès.",
            "Paiement ou inscription.",
            "Ressources téléchargeables.",
            "Suivi de progression.",
            "Connexion à des outils externes.",
        ],
        options: [
            "Module supplémentaire.",
            "Leçon supplémentaire.",
            "Intégration de ressources.",
            "Espace apprenant enrichi.",
            "Paiement ou inscription.",
            "Suivi de progression simple.",
            "Accompagnement à l'organisation des contenus.",
            "Formation ou prise en main.",
            "Maintenance post-livraison.",
        ],
    },
    workflow: {
        eyebrow: "Le déroulé réel",
        title: "Exactement comment ta formation en ligne est produite.",
        description:
            "Transmettre demande de la structure : la formation suit un déroulé de production réel, en trois temps, du cadrage pédagogique à la mise en ligne.",
        count: 21,
        countLabel: "21 étapes réelles",
        groups: [
            {
                verb: "Clarifier",
                summary: "Poser la pédagogie, les contenus et l'expérience apprenant.",
                steps: [
                    {
                        name: "Kickoff et collecte",
                        objective:
                            "Installer le cadre et récupérer contenus pédagogiques et accès indispensables.",
                    },
                    {
                        name: "Cadrage pédagogique",
                        objective:
                            "Clarifier le résultat promis et la transformation attendue pour l'apprenant.",
                    },
                    {
                        name: "Profil apprenant",
                        objective:
                            "Comprendre l'apprenant pour concevoir un parcours qui l'aide à avancer.",
                    },
                    {
                        name: "Architecture pédagogique",
                        objective:
                            "Transformer la méthode en modules, leçons, ressources et progression claire.",
                    },
                    {
                        name: "Leçon type",
                        objective:
                            "Définir la structure répétable d'une leçon pour une expérience homogène.",
                    },
                    {
                        name: "Contenus et ressources",
                        objective:
                            "Préparer, trier et formaliser les contenus à intégrer.",
                    },
                    {
                        name: "Pages publiques et SEO",
                        objective:
                            "Préparer les contenus publics pour présenter ou vendre la formation.",
                    },
                    {
                        name: "Expérience apprenant",
                        objective:
                            "Concevoir une expérience simple pour suivre les modules et reprendre sa progression.",
                    },
                    {
                        name: "Accès et rôles",
                        objective:
                            "Définir qui accède à quoi, et comment l'accès est donné ou suspendu.",
                    },
                ],
            },
            {
                verb: "Designer",
                summary: "Rendre la formation claire, crédible et agréable à suivre.",
                steps: [
                    {
                        name: "Direction artistique",
                        objective:
                            "Fixer une direction visuelle claire, crédible et agréable à suivre.",
                    },
                    {
                        name: "Maquettes UI",
                        objective:
                            "Concevoir les écrans clés de la formation avant développement.",
                    },
                ],
            },
            {
                verb: "Lancer",
                summary: "Construire l'espace apprenant et publier proprement.",
                steps: [
                    {
                        name: "Setup technique",
                        objective:
                            "Préparer une base fiable pour gérer contenus, comptes, droits et progression.",
                    },
                    {
                        name: "Développement public",
                        objective:
                            "Développer les pages publiques qui présentent et orientent vers l'accès.",
                    },
                    {
                        name: "Espace apprenant",
                        objective:
                            "Construire l'espace de consultation des modules, leçons et ressources.",
                    },
                    {
                        name: "Intégration contenus",
                        objective:
                            "Intégrer modules, leçons, vidéos, textes et ressources validés.",
                    },
                    {
                        name: "Emails et automatisations",
                        objective:
                            "Prévoir les messages et automatisations strictement nécessaires au lancement.",
                    },
                    {
                        name: "QA interne",
                        objective:
                            "Contrôler l'expérience complète, de l'accès à la consultation des leçons.",
                    },
                    {
                        name: "Recette client",
                        objective:
                            "Te faire valider la formation sans transformer la recette en refonte du programme.",
                    },
                    {
                        name: "Mise en ligne",
                        objective:
                            "Publier en vérifiant les accès, contenus et pages publiques en production.",
                    },
                    {
                        name: "Livraison et passation",
                        objective:
                            "Te rendre capable de gérer contenus, accès et opérations prévues.",
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
            question: "Faut-il que mes contenus soient déjà prêts ?",
            answer:
                "Pas forcément finalisés, mais on cadre l'architecture pédagogique tôt. Plus tes contenus sont avancés, plus l'intégration est fluide — on définit ensemble ce qui manque.",
        },
        {
            question: "Les apprenants auront un espace avec suivi ?",
            answer:
                "Oui : un espace pour consulter les modules, reprendre leur progression et retrouver les ressources. Le niveau exact se cadre selon ton besoin.",
        },
        {
            question: "Pourquoi sur devis ?",
            answer:
                "Une formation varie beaucoup selon le nombre de modules, les accès, le paiement et l'espace apprenant. On chiffre après avoir cadré le vrai périmètre.",
        },
        {
            question: "Je pourrai ajouter des modules plus tard ?",
            answer:
                "Oui : la base est pensée pour évoluer. On peut ajouter des contenus et des modules après le lancement.",
        },
    ],

};
