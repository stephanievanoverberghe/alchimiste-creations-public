import { LoaderCircle } from "lucide-react";

import { loginPageContent } from "@/content/auth";

const { redirect } = loginPageContent;

/**
 * Écran de transition de `/connexion/redirect` : affiché pendant que le
 * serveur vérifie la session avant de router vers le bon espace (fallback
 * Suspense de la route). Évite le flash blanc ; le spinner s'immobilise si
 * l'utilisateur a désactivé les animations.
 */
export function LoginRedirectPending() {
    return (
        <div
            className="flex min-h-[100svh] flex-col items-center justify-center gap-5 bg-[color:var(--color-bg-main)] bg-[image:var(--gradient-hero)] px-6 text-center"
            role="status"
            aria-live="polite"
        >
            <span className="inline-flex size-14 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] text-[color:var(--color-action-default)]">
                <LoaderCircle
                    className="size-6 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                />
            </span>
            <div className="flex flex-col gap-2">
                <h1 className="text-h3 text-[color:var(--color-text-default)]">
                    {redirect.title}
                </h1>
                <p className="text-body-small text-[color:var(--color-text-muted)]">
                    {redirect.subtitle}
                </p>
            </div>
        </div>
    );
}
