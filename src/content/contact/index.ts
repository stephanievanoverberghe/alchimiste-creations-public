import { legalRoutes, publicRoutes } from "@/config/navigation";

const subjectOptions = [
    { value: "question-generale", label: "Question générale" },
    { value: "probleme-site", label: "Problème sur le site" },
    { value: "collaboration", label: "Collaboration" },
    { value: "presse-partenariat", label: "Presse / partenariat" },
    { value: "donnees-personnelles", label: "Données personnelles" },
    { value: "mentions-legales", label: "Mentions légales" },
    { value: "autre", label: "Autre demande" },
] as const;

export const contactPageContent = {
    seo: {
        title: "Contact — Alchimiste Créations",
        description:
            "Une question, une information ou un sujet lié au site ? Écris à Alchimiste Créations et reçois une réponse en personne sous deux jours ouvrés. Pour cadrer un projet web, la demande de projet est faite pour ça.",
    },
    hero: {
        eyebrow: "Contact",
        titleBefore: "Une question ? ",
        titleAccent: "Écris-moi",
        titleAfter: ".",
        description:
            "Un doute, une information à demander ou un sujet lié au site : laisse un message, je te réponds en personne. Pour cadrer un vrai projet, la demande de projet pose les bonnes bases dès le départ.",
        primaryAction: {
            href: "#message",
            label: "Écrire un message",
        },
        secondaryAction: {
            href: publicRoutes.projectRequest,
            label: "Présenter un projet",
        },
        expectationsLabel: "Ce à quoi t'attendre",
        expectations: [
            {
                title: "Réponse sous 2 jours ouvrés",
                description:
                    "Du lundi au vendredi, une vraie réponse écrite — jamais un accusé automatique.",
            },
            {
                title: "Une interlocutrice unique",
                description:
                    "Tu écris directement à Stéphanie, pas à un standard ni à un robot.",
            },
            {
                title: "Sans engagement",
                description:
                    "Un message n'est ni un devis ni un contrat : on avance à ton rythme.",
            },
        ],
    },
    orientation: {
        eyebrow: "01 — Le bon point d'entrée",
        title: "Message libre ou parcours projet ?",
        description:
            "Deux chemins selon ta demande. Le message convient aux questions simples et rapides ; la demande de projet cadre un site avec les bonnes informations dès le départ.",
        cards: [
            {
                title: "Une question, une info",
                description:
                    "Sujet administratif, collaboration, souci sur le site ou demande ponctuelle : le message libre suffit.",
                href: "#message",
                actionLabel: "Écrire ici",
                meta: "Réponse rapide",
            },
            {
                title: "Un projet à cadrer",
                description:
                    "Créer, vendre, améliorer ou refondre un site : la demande guide tes réponses et évite les allers-retours.",
                href: publicRoutes.projectRequest,
                actionLabel: "Ouvrir la demande",
                meta: "≈ 10 min guidées",
            },
        ],
    },
    form: {
        eyebrow: "02 — Ton message",
        title: "Va à l'essentiel.",
        description:
            "Choisis un sujet, ajoute le contexte utile, puis envoie. Je te réponds sur l'adresse indiquée — rien d'autre n'en est fait.",
        subjectOptions,
        fields: {
            name: {
                label: "Prénom et nom",
                placeholder: "Ton nom",
                helper: "Le nom à utiliser pour te répondre.",
            },
            email: {
                label: "Email",
                placeholder: "ton@email.com",
                helper: "Cette adresse sert uniquement à te répondre.",
            },
            subject: {
                label: "Sujet",
                placeholder: "Choisir un sujet",
                helper: "Si tu hésites, choisis Autre demande.",
            },
            message: {
                label: "Message",
                placeholder: "Explique ta demande en quelques lignes...",
                helper: "Contexte, question, lien utile si besoin.",
            },
            consent: {
                label:
                    "J'accepte que mes informations soient utilisées pour répondre à mon message.",
                helper: "Tes données ne sont pas utilisées pour autre chose.",
            },
        },
        errors: {
            name: "Indique ton nom.",
            email: "Indique un email valide.",
            subject: "Choisis un sujet.",
            message: "Ajoute un message.",
            consent: "Le consentement est nécessaire pour envoyer le message.",
        },
        submitLabel: "Envoyer le message",
        privacyHref: legalRoutes.privacy,
    },
    practicalLinks: {
        eyebrow: "03 — Liens utiles",
        title: "Aller directement à la bonne page.",
        links: [
            { href: publicRoutes.projectRequest, label: "Demande de projet" },
            { href: legalRoutes.legalNotice, label: "Mentions légales" },
            { href: legalRoutes.privacy, label: "Confidentialité" },
            { href: legalRoutes.cookies, label: "Gestion des cookies" },
            { href: legalRoutes.cgu, label: "CGU" },
            { href: legalRoutes.cgs, label: "CGS" },
        ],
    },
} as const;

export type ContactPageContent = typeof contactPageContent;
