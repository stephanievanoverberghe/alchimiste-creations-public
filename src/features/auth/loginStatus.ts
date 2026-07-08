import { loginPageContent } from "@/content/auth";

const { statuses } = loginPageContent;

/** Message d'erreur résolu, rendu en toast persistant près du formulaire. */
export type LoginErrorMessage = {
    tone: "warning" | "danger";
    title: string;
    message: string;
};

/**
 * Restreint l'URL de retour post-connexion aux chemins internes.
 * Toute valeur absente, externe ou protocol-relative (`//`) retombe sur
 * l'écran de redirection interne — garde-fou anti open-redirect.
 */
export function getSafeCallbackUrl(callbackUrl: string | undefined): string {
    if (!callbackUrl) return "/connexion/redirect";
    if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
        return "/connexion/redirect";
    }

    return callbackUrl;
}

/**
 * Traduit le paramètre d'URL `error` en message humain à afficher en toast.
 * L'état de succès (« lien envoyé ») n'est plus un toast mais un panneau
 * dédié, géré par l'orchestrateur. Renvoie `null` s'il n'y a pas d'erreur.
 */
export function resolveLoginError(error?: string): LoginErrorMessage | null {
    if (error === "AccessDenied") {
        return {
            tone: "danger",
            title: statuses.accessDenied.title,
            message: statuses.accessDenied.message,
        };
    }

    if (error === "EmailRequired") {
        return {
            tone: "warning",
            title: statuses.emailRequired.title,
            message: statuses.emailRequired.message,
        };
    }

    if (error === "CredentialsSignin") {
        return {
            tone: "danger",
            title: statuses.credentials.title,
            message: statuses.credentials.message,
        };
    }

    if (error) {
        return {
            tone: "danger",
            title: statuses.generic.title,
            message: statuses.generic.message,
        };
    }

    return null;
}
