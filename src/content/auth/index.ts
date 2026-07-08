/**
 * Contenu éditorial de la page de connexion (Lot B — auth, phase 6).
 * Textes seulement : la logique d'authentification vit dans
 * `src/server/auth`, la présentation dans `src/features/auth`.
 * Le mapping code d'erreur → message est dans `loginStatus.ts`
 * (ce module ne fournit que les chaînes).
 */

import { publicRoutes } from "@/config/navigation";

/** Icône associée à un repère de réassurance (mappée côté section). */
export type LoginPromiseIcon = "shield" | "wand" | "route";

export const loginPageContent = {
    seo: {
        title: "Connexion — Alchimiste Créations",
        description:
            "Connexion privée à l'espace Alchimiste Créations par lien magique sécurisé.",
    },

    /** Colonne de gauche : la promesse de l'espace privé. */
    promise: {
        backHref: "/",
        backLabel: "Retour à l'accueil",
        eyebrow: "Espace privé",
        titleBefore: "Ton projet, ",
        titleAccent: "au clair",
        titleAfter: ".",
        description:
            "L'espace où tu retrouves l'avancement de ton projet, les documents à valider et les échanges — au même endroit, du premier échange à la mise en ligne.",
        points: [
            {
                icon: "shield" as LoginPromiseIcon,
                title: "Un accès sur invitation",
                description:
                    "Pas d'inscription libre : ton accès est lié à une demande, une invitation ou un compte client.",
            },
            {
                icon: "wand" as LoginPromiseIcon,
                title: "Le lien magique d'abord",
                description:
                    "Reçois un lien de connexion par e-mail — rien à retenir, rien à réinitialiser.",
            },
            {
                icon: "route" as LoginPromiseIcon,
                title: "Ton projet suivi de bout en bout",
                description:
                    "Étapes, livrables et décisions restent visibles et à jour à chaque connexion.",
            },
        ],
    },

    /** Colonne de droite : le formulaire d'entrée. */
    form: {
        eyebrow: "Connexion",
        title: "Entre ton adresse autorisée",
        subtitle: "Pour accéder à ton espace client.",
        magicLink: {
            emailLabel: "Adresse e-mail",
            emailHelper:
                "L'accès dépend d'une invitation, d'une demande ou d'un compte client — pas d'inscription libre.",
            submitLabel: "Recevoir le lien",
            switchLabel: "Utiliser plutôt un mot de passe",
        },
        password: {
            emailLabel: "Adresse e-mail",
            passwordLabel: "Mot de passe",
            passwordHelper:
                "Disponible seulement si tu as défini un mot de passe depuis un compte autorisé.",
            submitLabel: "Se connecter",
            switchLabel: "Recevoir plutôt un lien magique",
        },
    },

    /**
     * État « lien envoyé » : panneau d'attente affiché à la place du
     * formulaire (remplace l'ancien toast). {email} interpolé côté section.
     */
    sent: {
        eyebrow: "Lien envoyé",
        title: "Regarde ta boîte mail",
        bodyBefore: "On vient d'envoyer un lien de connexion à ",
        bodyAfter:
            ". Ouvre-le depuis cet appareil pour entrer — il reste valable quelques minutes.",
        bodyNoEmail:
            "On vient d'envoyer ton lien de connexion. Ouvre-le depuis cet appareil pour entrer — il reste valable quelques minutes.",
        spamNote: "Rien reçu ? Jette un œil aux spams, puis renvoie le lien.",
        resendLabel: "Renvoyer le lien",
        changeEmailLabel: "Utiliser une autre adresse",
    },

    /** Écran de transition de /connexion/redirect (attente du routage). */
    redirect: {
        title: "Connexion en cours…",
        subtitle: "On t'emmène vers ton espace.",
    },

    /**
     * Copie des messages d'erreur, indexée par situation.
     * `resolveLoginError` choisit lequel afficher (en toast) selon l'URL.
     */
    statuses: {
        accessDenied: {
            title: "Accès pas encore ouvert",
            message:
                "Cette adresse n'est pas encore autorisée. Fais une demande de projet ou utilise l'invitation envoyée par Alchimiste Créations.",
        },
        emailRequired: {
            title: "Adresse e-mail requise",
            message: "Indique une adresse e-mail pour recevoir le lien.",
        },
        credentials: {
            title: "Connexion refusée",
            message:
                "Vérifie l'adresse et le mot de passe, ou reçois plutôt un lien magique.",
        },
        generic: {
            title: "Connexion impossible",
            message:
                "La connexion n'a pas pu aboutir. Réessaie avec ton adresse autorisée.",
        },
    },
} as const;

export type LoginPageContent = typeof loginPageContent;

/** Libellés humains des rôles (jamais l'enum brut affiché à l'écran). */
const accountRoleLabels: Record<string, string> = {
    SUPER_ADMIN: "Administration",
    ADMIN: "Administration",
    PROJECT_MANAGER: "Gestion de projet",
    CLIENT_OWNER: "Espace client",
    CLIENT_MEMBER: "Espace client",
    CLIENT: "Espace client",
};

/**
 * Contenu de la page /compte/securite (B3) — vraie page de sécurité :
 * snapshot du compte, méthodes de connexion, mot de passe optionnel,
 * protection et session. Aligné sur le gabarit espace client.
 */
export const accountSecurityContent = {
    seo: {
        title: "Sécurité du compte — Alchimiste Créations",
        description:
            "Gérer la connexion et la sécurité d'un compte autorisé : lien magique, mot de passe optionnel, session.",
    },
    header: {
        eyebrow: "Sécurité du compte",
        title: "Ton compte, bien protégé",
        description:
            "Retrouve ici comment tu te connectes, l'état de ton mot de passe et ce qui garde ton accès en sécurité.",
    },
    snapshot: {
        accountLabel: "Compte",
        accessLabel: "Accès",
        roleFallback: "Non défini",
        roleLabels: accountRoleLabels,
        lastLoginLabel: "Dernière connexion",
        lastLoginFallback: "Première visite",
        statusLabel: "Compte actif",
    },
    methods: {
        eyebrow: "01 — Tes accès",
        title: "Comment tu te connectes",
        description:
            "Deux façons d'entrer dans ton espace. Le lien magique suffit toujours ; le mot de passe est un raccourci facultatif.",
        magicLink: {
            title: "Lien magique",
            statusLabel: "Toujours actif",
            description:
                "Un lien à usage unique envoyé par e-mail. Rien à mémoriser, rien à réinitialiser — c'est le moyen le plus sûr d'entrer.",
        },
        password: {
            title: "Mot de passe",
            statusSet: "Défini",
            statusUnset: "Optionnel",
            descriptionSet:
                "Il te reconnecte sans attendre l'e-mail. Le lien magique reste disponible à tout moment.",
            descriptionUnset:
                "Facultatif : à définir seulement si tu veux te reconnecter plus vite, sans passer par ta boîte mail.",
        },
    },
    password: {
        eyebrow: "02 — Mot de passe",
        titleSet: "Modifier ton mot de passe",
        titleUnset: "Ajouter un mot de passe",
        descriptionSet:
            "Choisis un nouveau mot de passe. L'ancien est remplacé dès l'enregistrement.",
        descriptionUnset:
            "Définis un mot de passe pour te reconnecter plus vite. Tu pourras toujours utiliser le lien magique.",
        nudgeTitle: "Va plus vite la prochaine fois",
        nudgeDescription:
            "Sans mot de passe, chaque connexion passe par un e-mail. En définir un te fait gagner ce détour — c'est optionnel.",
        requirementsLabel: "Il doit contenir",
        requirements: [
            "Au moins 12 caractères",
            "Au moins une lettre",
            "Au moins un chiffre",
        ],
        passwordLabelSet: "Nouveau mot de passe",
        passwordLabelUnset: "Mot de passe",
        confirmLabel: "Confirmer le mot de passe",
        submitSet: "Modifier le mot de passe",
        submitUnset: "Définir le mot de passe",
    },
    protection: {
        eyebrow: "03 — Ta protection",
        points: [
            { icon: "invitation", label: "Accès sur invitation" },
            { icon: "link", label: "Lien à usage unique" },
            { icon: "lock", label: "Connexion chiffrée" },
            { icon: "session", label: "Session privée" },
        ] as const,
    },
    privacy: {
        text: "Tu souhaites supprimer ton compte et tes données ?",
        linkLabel: "Fais-en la demande",
        href: publicRoutes.contact,
    },
    statuses: {
        updated: {
            title: "Mot de passe enregistré",
            message:
                "C'est fait. Le lien magique reste disponible quand tu veux.",
        },
        mismatch: {
            title: "Les deux ne correspondent pas",
            message: "Le mot de passe et sa confirmation sont différents.",
        },
        tooWeak: {
            title: "Mot de passe trop court",
            message:
                "Il faut au moins 12 caractères, avec une lettre et un chiffre.",
        },
    },
} as const;

export type AccountSecurityContent = typeof accountSecurityContent;

/** Icône d'un point de protection (mappée côté section). */
export type AccountProtectionIcon =
    (typeof accountSecurityContent.protection.points)[number]["icon"];
