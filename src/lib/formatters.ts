/**
 * Formatters partagés (sprint F4) — l'unique endroit où l'on formate
 * dates et montants pour l'affichage. Toute copie locale dans
 * src/features est une régression d'architecture (règle d'or n° 5).
 * Tout est en fr-FR ; les montants circulent en centimes.
 */

export type DateFormatStyle = "numeric" | "abbr" | "medium" | "long";

const dateFormatters: Record<DateFormatStyle, Intl.DateTimeFormat> = {
    /** 06/07/2026 — tableaux denses. */
    numeric: new Intl.DateTimeFormat("fr-FR"),
    /** 06 juil. 2026 — cartes et listes. */
    abbr: new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }),
    /** 6 juil. 2026 — usage courant. */
    medium: new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }),
    /** 6 juillet 2026 — documents et espace client. */
    long: new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }),
};

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
});

const moneyFormatter = new Intl.NumberFormat("fr-FR", {
    currency: "EUR",
    style: "currency",
});

/**
 * Formate une date pour l'affichage.
 * @param style numeric (06/07/2026) · abbr (06 juil. 2026) ·
 *              medium (6 juil. 2026) · long (6 juillet 2026)
 * @param fallback texte rendu si la date est absente (défaut « — »)
 */
export function formatDate(
    value: Date | null | undefined,
    style: DateFormatStyle = "medium",
    fallback = "—",
) {
    if (!value) return fallback;

    return dateFormatters[style].format(value);
}

/** Date + heure courte (6 juil. 2026, 14:30) — timelines et journaux. */
export function formatDateTime(
    value: Date | null | undefined,
    fallback = "—",
) {
    if (!value) return fallback;

    return dateTimeFormatter.format(value);
}

/** Valeur ISO (yyyy-mm-dd) pour un `<input type="date">`. */
export function formatDateInputValue(value: Date | null | undefined) {
    if (!value) return "";

    return value.toISOString().slice(0, 10);
}

/** Montant en euros depuis des centimes (1 750,00 €). */
export function formatMoneyFromCents(
    amountCents: number | null | undefined,
    fallback = "—",
) {
    if (amountCents === null || amountCents === undefined) return fallback;

    return moneyFormatter.format(amountCents / 100);
}

/** Valeur décimale brute pour un `<input type="number">` en euros. */
export function formatEurosInputValue(
    amountCents: number | null | undefined,
) {
    if (amountCents === null || amountCents === undefined) return "";

    return String(amountCents / 100);
}
