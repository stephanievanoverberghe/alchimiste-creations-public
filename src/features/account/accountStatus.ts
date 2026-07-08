import { accountSecurityContent } from "@/content/auth";

const { statuses } = accountSecurityContent;

/** Message d'état de /compte/securite, rendu en toast. */
export type AccountStatusMessage = {
    tone: "success" | "warning";
    title: string;
    message: string;
    /** Vrai pour le succès : toast à barre de temps qui s'efface seul. */
    isSuccess: boolean;
};

/**
 * Traduit le paramètre `status` (posé par `setPasswordAction`) en message.
 * Convention de feedback : le succès s'efface seul (barre de temps),
 * l'erreur persiste jusqu'à fermeture. `null` s'il n'y a rien à signaler.
 */
export function resolveAccountStatus(
    status: string | undefined,
): AccountStatusMessage | null {
    if (status === "password-updated") {
        return {
            tone: "success",
            title: statuses.updated.title,
            message: statuses.updated.message,
            isSuccess: true,
        };
    }

    if (status === "PASSWORD_MISMATCH") {
        return {
            tone: "warning",
            title: statuses.mismatch.title,
            message: statuses.mismatch.message,
            isSuccess: false,
        };
    }

    if (status === "PASSWORD_TOO_WEAK") {
        return {
            tone: "warning",
            title: statuses.tooWeak.title,
            message: statuses.tooWeak.message,
            isSuccess: false,
        };
    }

    return null;
}
