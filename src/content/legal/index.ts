import {
    legalRoutes,
    publicRoutes,
} from "@/config/navigation";

export type LegalLink = {
    href: string;
    label: string;
};

export type LegalSection = {
    title: string;
    description?: string;
    items?: readonly string[];
    links?: readonly LegalLink[];
    note?: string;
};

export type LegalPageContent = {
    hero: {
        eyebrow: string;
        title: string;
        description: string;
        lastUpdated: string;
    };
    seo: {
        title: string;
        description: string;
    };
    sections: readonly LegalSection[];
};

const pendingLegalInfoNote =
    "Informations administratives à compléter avec les données officielles avant publication définitive.";

/**
 * Date « dernière mise à jour » : volontairement manuelle par page (bonne
 * pratique juridique). Quand le fond d'une page est finalisé ou modifié,
 * remplacer `pendingLastUpdated` par une vraie date (ex. « 8 juillet 2026 »).
 * Tant qu'une page garde des « À compléter », elle reste sur ce placeholder.
 */
const pendingLastUpdated = "À compléter — date de mise à jour";

export const legalPagesContent = {
    legalNotice: {
        seo: {
            title: "Mentions légales — Alchimiste Créations",
            description:
                "Mentions légales du site Alchimiste Créations : éditeur, hébergement, propriété intellectuelle, données personnelles et informations de contact.",
        },
        hero: {
            eyebrow: "Cadre légal",
            title: "Mentions légales",
            description:
                "Les informations utiles pour identifier l’éditeur du site, l’hébergement, les règles de propriété intellectuelle et les contacts légaux.",
            lastUpdated: pendingLastUpdated,
        },
        sections: [
            {
                title: "Éditeur du site",
                description:
                    "Le site Alchimiste Créations est édité par l’activité indiquée ci-dessous.",
                items: [
                    "À compléter — nom / raison sociale",
                    "Nom commercial : Alchimiste Créations",
                    "À compléter — statut juridique",
                    "À compléter — adresse professionnelle",
                    "À compléter — adresse e-mail légale",
                    "À compléter — SIRET si applicable",
                    "À compléter — numéro de TVA intracommunautaire si applicable",
                ],
                note: pendingLegalInfoNote,
            },
            {
                title: "Responsable de publication",
                description:
                    "La responsable de publication du site sera indiquée ici avec ses coordonnées professionnelles.",
                items: [
                    "À compléter — nom de la responsable de publication",
                    "Fonction : Fondatrice d’Alchimiste Créations",
                    "À compléter — contact légal",
                ],
                note: pendingLegalInfoNote,
            },
            {
                title: "Hébergement",
                description:
                    "Le site est hébergé par le prestataire technique retenu pour la mise en production.",
                items: [
                    "À compléter — nom de l’hébergeur",
                    "À compléter — adresse de l’hébergeur",
                    "À compléter — site web de l’hébergeur",
                    "À compléter — contact de l’hébergeur si disponible",
                ],
                note: "À compléter uniquement avec le prestataire réellement utilisé pour la mise en ligne.",
            },
            {
                title: "Propriété intellectuelle",
                description:
                    "Les textes, interfaces, éléments graphiques, visuels, structures de pages, icônes et éléments de design présents sur le site sont protégés par le droit de la propriété intellectuelle. Sauf mention contraire, ces éléments appartiennent à Alchimiste Créations ou font l’objet d’une autorisation d’utilisation.",
                items: [
                    "Toute reproduction ou exploitation sans autorisation préalable est interdite.",
                    "Les projets présentés peuvent appartenir à leurs propriétaires respectifs.",
                    "Les autorisations liées aux visuels, captures et ressources tierces doivent être vérifiées.",
                ],
            },
            {
                title: "Données personnelles et cookies",
                description:
                    "Les traitements de données personnelles et les cookies sont détaillés dans les pages dédiées.",
                links: [
                    {
                        href: legalRoutes.privacy,
                        label: "Politique de confidentialité",
                    },
                    {
                        href: legalRoutes.cookies,
                        label: "Gestion des cookies",
                    },
                ],
            },
            {
                title: "Contact légal",
                description:
                    "Pour toute question concernant le site, ses contenus ou les informations légales, utilise la page contact. Les coordonnées professionnelles seront ajoutées dans les mentions légales lorsqu’elles seront finalisées.",
                links: [{ href: publicRoutes.contact, label: "Contact" }],
            },
        ],
    },
    privacy: {
        seo: {
            title: "Politique de confidentialité — Alchimiste Créations",
            description:
                "Politique de confidentialité du site Alchimiste Créations : données collectées, finalités, droits, cookies et informations de contact.",
        },
        hero: {
            eyebrow: "Données personnelles",
            title: "Politique de confidentialité",
            description:
                "Cette page explique comment les données transmises via le site, les formulaires et les futurs espaces privés sont collectées, utilisées et protégées.",
            lastUpdated: pendingLastUpdated,
        },
        sections: [
            {
                title: "Responsable du traitement",
                description:
                    "Le responsable du traitement sera l’éditeur du site Alchimiste Créations.",
                items: [
                    "À compléter — nom / raison sociale",
                    "Nom commercial : Alchimiste Créations",
                    "À compléter — adresse professionnelle",
                    "À compléter — adresse e-mail d’exercice des droits",
                    "À compléter — statut juridique",
                    "À compléter — SIRET si applicable",
                ],
                links: [{ href: legalRoutes.legalNotice, label: "Mentions légales" }],
                note: pendingLegalInfoNote,
            },
            {
                title: "Données collectées",
                description:
                    "Alchimiste Créations peut collecter uniquement les informations nécessaires pour répondre à une demande, comprendre un projet ou suivre un échange.",
                items: [
                    "Données d’identité et de contact : nom, prénom, e-mail, activité ou structure.",
                    "Données liées à une demande : type de projet, contexte, objectif, délai, budget indicatif, message.",
                    "Données de compte ou d’espace privé uniquement si ces fonctionnalités sont activées.",
                    "Données techniques nécessaires au bon fonctionnement et à la sécurité du site.",
                ],
            },
            {
                title: "Finalités",
                description:
                    "Les données sont utilisées pour répondre aux messages, traiter les demandes de projet, préparer un échange, suivre une relation avec un prospect ou un client, gérer les accès privés et respecter les obligations applicables.",
            },
            {
                title: "Bases légales",
                description:
                    "Selon la situation, les traitements peuvent reposer sur une mesure précontractuelle, l’exécution d’un contrat, l’intérêt légitime, le consentement ou une obligation légale.",
                note: "À vérifier lorsque les formulaires, comptes et services tiers réellement utilisés seront finalisés.",
            },
            {
                title: "Destinataires et services tiers",
                description:
                    "Les données sont destinées à Alchimiste Créations et ne sont pas vendues. Certains prestataires techniques peuvent y avoir accès lorsque leur intervention est nécessaire au fonctionnement du site ou des services.",
                items: [
                    "À compléter — hébergeur",
                    "À compléter — base de données si applicable",
                    "À compléter — authentification si applicable",
                    "À compléter — service d’e-mail transactionnel si applicable",
                    "À compléter — anti-spam, analytics ou outils tiers si applicable",
                ],
            },
            {
                title: "Durée de conservation",
                description:
                    "Les données sont conservées uniquement pendant la durée nécessaire à leur finalité, puis supprimées ou archivées selon les obligations applicables.",
                items: [
                    "À compléter — durée de conservation des messages de contact",
                    "À compléter — durée de conservation des demandes de projet sans suite",
                    "À compléter — durée de conservation des comptes utilisateurs inactifs si applicable",
                    "À compléter — durée de conservation des données clients, devis et documents contractuels",
                    "À compléter — durée de conservation des logs techniques",
                ],
                note: "Durées à publier uniquement lorsqu’elles sont réellement retenues.",
            },
            {
                title: "Vos droits",
                description:
                    "Tu peux demander l’accès à tes données, leur rectification, leur effacement, la limitation du traitement, l’opposition à certains traitements, la portabilité lorsque cela s’applique ou le retrait de ton consentement.",
                items: ["À compléter — adresse d’exercice des droits"],
                note: "Une réclamation peut également être déposée auprès de la CNIL.",
            },
            {
                title: "Cookies et traceurs",
                description:
                    "Les cookies et technologies similaires sont détaillés dans la page Gestion des cookies.",
                links: [{ href: legalRoutes.cookies, label: "Gestion des cookies" }],
            },
        ],
    },
    cookies: {
        seo: {
            title: "Gestion des cookies — Alchimiste Créations",
            description:
                "Le site Alchimiste Créations n’utilise que des cookies strictement nécessaires à la connexion et à la session : aucune mesure d’audience, aucune publicité, aucun traceur tiers.",
        },
        hero: {
            eyebrow: "Cookies",
            title: "Gestion des cookies",
            description:
                "Le site n’utilise que des cookies strictement nécessaires à son fonctionnement et à ta connexion. Aucun cookie de mesure d’audience, de publicité ou de traceur tiers n’est déposé — aucune bannière de consentement n’est donc requise.",
            lastUpdated: "8 juillet 2026",
        },
        sections: [
            {
                title: "Cookies strictement nécessaires",
                description:
                    "Ces cookies sont indispensables au fonctionnement du site et de l’espace privé : ils gèrent ta session, ta connexion et la sécurité des formulaires. Sans eux, la connexion ne peut pas fonctionner.",
                note:
                    "Conformément à la réglementation, les cookies strictement nécessaires au service demandé sont déposés sans consentement préalable.",
            },
            {
                title: "Aucune mesure d’audience ni traceur tiers",
                description:
                    "Le site ne dépose aucun cookie de statistiques (analytics), de publicité, de réseaux sociaux ou de service tiers. Aucune donnée de navigation n’est collectée ou partagée à des fins de suivi.",
                note:
                    "Si un tel outil était ajouté un jour, cette page serait mise à jour et ton consentement serait recueilli au préalable, avec un refus aussi simple que l’acceptation.",
            },
            {
                title: "Liste des cookies utilisés",
                description:
                    "Tous les cookies ci-dessous sont déposés par Alchimiste Créations (aucun tiers) et sont strictement nécessaires. Format : nom — finalité — durée.",
                items: [
                    "Session de connexion (authjs.session-token) — maintient ta session ouverte dans l’espace privé — durée de la session — nécessaire",
                    "Sécurité de connexion (authjs.csrf-token, authjs.callback-url) — protège le formulaire de connexion et gère la redirection après connexion — le temps de la connexion — nécessaire",
                    "Lien magique (auth:last-magic-link-email) — mémorise ton adresse le temps de recevoir et d’utiliser ton lien de connexion — 10 minutes — nécessaire",
                ],
                note:
                    "Aucun de ces cookies ne requiert de consentement. En production (site en HTTPS), ces cookies portent un préfixe de sécurité (« __Secure- » ou « __Host- »).",
            },
            {
                title: "Gérer les cookies depuis ton navigateur",
                description:
                    "Tu peux à tout moment consulter, bloquer ou supprimer les cookies depuis les réglages de ton navigateur. Bloquer les cookies strictement nécessaires empêche toutefois la connexion à l’espace privé.",
            },
            {
                title: "Données personnelles",
                description:
                    "Le détail des traitements de données personnelles figure dans la politique de confidentialité.",
                links: [
                    {
                        href: legalRoutes.privacy,
                        label: "Politique de confidentialité",
                    },
                ],
            },
        ],
    },
    cgu: {
        seo: {
            title: "Conditions générales d’utilisation — Alchimiste Créations",
            description:
                "Conditions générales d’utilisation du site et de la plateforme Alchimiste Créations : accès, compte utilisateur, espace privé, documents, messages et responsabilités.",
        },
        hero: {
            eyebrow: "Utilisation du site",
            title: "Conditions générales d’utilisation",
            description:
                "Ces conditions encadrent l’utilisation du site, des formulaires et des futurs espaces privés liés à Alchimiste Créations.",
            lastUpdated: pendingLastUpdated,
        },
        sections: [
            {
                title: "Objet",
                description:
                    "Les présentes conditions définissent les règles d’accès et d’utilisation du site Alchimiste Créations, ainsi que des éventuels espaces privés lorsqu’ils sont mis à disposition.",
            },
            {
                title: "Accès au site public",
                description:
                    "Le site public permet de découvrir le studio, la méthode, les offres, les réalisations, les pages légales, le formulaire contact et le parcours de demande de projet.",
            },
            {
                title: "Demande de projet",
                description:
                    "L’envoi d’une demande de projet ne vaut pas acceptation automatique du projet et ne crée pas automatiquement de contrat de prestation.",
                links: [
                    {
                        href: publicRoutes.projectRequest,
                        label: "Demande de projet",
                    },
                ],
            },
            {
                title: "Compte utilisateur et espace privé",
                description:
                    "Certaines fonctionnalités pourront nécessiter un compte ou un accès sécurisé lorsqu’elles seront disponibles.",
                note:
                    "À compléter lorsque les fonctionnalités de compte ou d’espace privé seront finalisées.",
            },
            {
                title: "Obligations de l’utilisateur",
                description:
                    "L’utilisateur s’engage à utiliser le site de manière loyale, à fournir des informations exactes, à ne pas contourner les mesures de sécurité et à ne pas transmettre de contenus illicites, dangereux ou portant atteinte aux droits de tiers.",
            },
            {
                title: "Disponibilité",
                description:
                    "Alchimiste Créations s’efforce de maintenir le site accessible, mais ne peut garantir une disponibilité permanente, continue ou sans erreur.",
            },
            {
                title: "Données personnelles et cookies",
                description:
                    "Les règles liées aux données personnelles et aux cookies sont détaillées dans les pages dédiées.",
                links: [
                    {
                        href: legalRoutes.privacy,
                        label: "Politique de confidentialité",
                    },
                    {
                        href: legalRoutes.cookies,
                        label: "Gestion des cookies",
                    },
                ],
            },
        ],
    },
    cgs: {
        seo: {
            title: "Conditions générales de services — Alchimiste Créations",
            description:
                "Conditions générales de services d’Alchimiste Créations : prestations web, devis, acompte, paiement, périmètre, validations, livraison et responsabilités.",
        },
        hero: {
            eyebrow: "Prestations",
            title: "Conditions générales de services",
            description:
                "Ces conditions encadrent les prestations web proposées par Alchimiste Créations : demande, devis, périmètre, production, validation, livraison et paiement.",
            lastUpdated: pendingLastUpdated,
        },
        sections: [
            {
                title: "Prestataire",
                description:
                    "Les prestations sont proposées par Alchimiste Créations. Les informations juridiques exactes doivent être cohérentes avec les mentions légales.",
                links: [{ href: legalRoutes.legalNotice, label: "Mentions légales" }],
                note: pendingLegalInfoNote,
            },
            {
                title: "Objet des services",
                description:
                    "Alchimiste Créations propose des prestations de conception, design, développement, accompagnement, audit, refonte, maintenance et structuration de projets web.",
                items: [
                    "Site vitrine, one-page ou landing page",
                    "Boutique en ligne ou formation en ligne",
                    "Diagnostic, refonte, maintenance",
                    "Projet sur mesure",
                ],
            },
            {
                title: "Demande, qualification et devis",
                description:
                    "Une demande de projet peut être analysée, complétée, réorientée ou refusée si elle ne correspond pas au cadre, aux disponibilités ou aux conditions de réalisation. Toute prestation fait l’objet d’un devis ou d’une proposition écrite.",
            },
            {
                title: "Acceptation, acompte et paiement",
                description:
                    "La commande est validée selon les modalités prévues dans le devis. Un acompte peut être demandé avant le démarrage du projet.",
                items: [
                    "À compléter — durée de validité d’un devis",
                    "À compléter — acompte par défaut",
                    "À compléter — moyens de paiement",
                    "À compléter — délais et conditions en cas de retard",
                    "À compléter — application ou non de la TVA",
                ],
                note: "Conditions commerciales à valider avant publication définitive.",
            },
            {
                title: "Périmètre et demandes complémentaires",
                description:
                    "Le périmètre est défini dans le devis ou le cadrage. Tout élément non prévu est considéré comme hors périmètre et peut faire l’objet d’un ajustement de planning ou d’un devis complémentaire.",
            },
            {
                title: "Obligations du client",
                description:
                    "Le client fournit les informations, contenus, accès, documents, validations et retours nécessaires à la bonne réalisation de la prestation.",
            },
            {
                title: "Validations, livraison et maintenance",
                description:
                    "Les étapes importantes peuvent nécessiter une validation écrite. La livraison intervient lorsque les éléments prévus sont remis, mis en ligne ou rendus accessibles. La maintenance n’est incluse que si elle est prévue dans le devis.",
            },
            {
                title: "Propriété intellectuelle et portfolio",
                description:
                    "Les droits d’utilisation des livrables, leurs limites et les éventuelles références portfolio doivent être précisés dans le devis ou les conditions particulières.",
                note:
                    "À compléter — modalités de cession ou de licence d’utilisation des livrables.",
            },
            {
                title: "Annulation, rétractation et litiges",
                description:
                    "Les conditions d’annulation, de report, de rétractation éventuelle, de médiation et de juridiction compétente seront finalisées selon le statut réel de l’activité et la clientèle visée.",
                note:
                    "À compléter — cadre d’annulation, médiation et juridiction compétente.",
            },
        ],
    },
} as const satisfies Record<string, LegalPageContent>;
