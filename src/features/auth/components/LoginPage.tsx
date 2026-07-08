import { redirect } from "next/navigation";

import { Toast } from "@/components/ui";
import { loginPageContent } from "@/content/auth";
import { LoginFormSection } from "@/features/auth/sections/LoginFormSection";
import { LoginPromiseSection } from "@/features/auth/sections/LoginPromiseSection";
import { LoginSentSection } from "@/features/auth/sections/LoginSentSection";
import { getSafeCallbackUrl, resolveLoginError } from "@/features/auth/loginStatus";
import { auth } from "@/server/auth";
import { getAuthenticatedHomePath } from "@/server/auth/roles";

type LoginPageProps = {
    callbackUrl?: string;
    error?: string;
    mode?: string;
    sent?: string;
    sentEmail?: string;
};

/**
 * Page de connexion (B1) en split-screen : promesse de l'espace privé à
 * gauche, entrée à droite. La colonne droite affiche, selon l'état, le
 * formulaire (lien magique par défaut, mot de passe en repli) ou l'écran
 * d'attente « regarde ta boîte mail » après envoi du lien (B2). Redirige
 * les sessions déjà authentifiées ; la logique d'auth vit dans
 * `src/server/auth`, cette page n'orchestre que la présentation.
 */
export async function LoginPage({
    callbackUrl,
    error,
    mode,
    sent,
    sentEmail,
}: LoginPageProps) {
    const session = await auth();
    const authenticatedHomePath = getAuthenticatedHomePath(session?.user.role);

    if (authenticatedHomePath) {
        redirect(authenticatedHomePath);
    }

    const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);
    const isSent = sent === "1";
    const isPasswordMode = mode === "password";
    // L'écran « lien envoyé » remplace le formulaire ; l'erreur n'existe que
    // hors de cet état. Convention feedback : l'erreur reste jusqu'à fermeture.
    const errorMessage = isSent ? null : resolveLoginError(error);

    return (
        <>
            {errorMessage ? (
                <Toast
                    dismissible
                    placement="top"
                    tone={errorMessage.tone}
                    title={errorMessage.title}
                >
                    {errorMessage.message}
                </Toast>
            ) : null}

            <div className="min-h-[100svh] lg:grid lg:grid-cols-[1.05fr_1fr]">
                <LoginPromiseSection content={loginPageContent.promise} />
                {isSent ? (
                    <LoginSentSection
                        content={loginPageContent.sent}
                        email={sentEmail}
                        callbackUrl={safeCallbackUrl}
                    />
                ) : (
                    <LoginFormSection
                        content={loginPageContent.form}
                        callbackUrl={safeCallbackUrl}
                        isPasswordMode={isPasswordMode}
                    />
                )}
            </div>
        </>
    );
}
