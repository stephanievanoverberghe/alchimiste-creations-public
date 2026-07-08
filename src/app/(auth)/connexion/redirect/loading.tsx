import { LoginRedirectPending } from "@/features/auth/sections/LoginRedirectPending";

/**
 * Fallback affiché pendant la résolution de la route `/connexion/redirect`
 * (vérification de session côté serveur avant redirection).
 */
export default function ConnexionRedirectLoading() {
    return <LoginRedirectPending />;
}
