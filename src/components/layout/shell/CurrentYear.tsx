"use client";

/**
 * Année courante rendue côté navigateur : le copyright reste juste même
 * sur les pages statiques générées une fois par build (le HTML serveur
 * porte l'année du build, l'hydratation la remplace — d'où le
 * suppressHydrationWarning).
 */
export function CurrentYear() {
    return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
