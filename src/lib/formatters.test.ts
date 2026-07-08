import { describe, expect, it } from "vitest";

import {
    formatDate,
    formatDateInputValue,
    formatEurosInputValue,
    formatMoneyFromCents,
} from "./formatters";

// Date fixe à midi UTC pour éviter tout décalage de fuseau sur les
// fonctions qui passent par toISOString.
const sampleDate = new Date(Date.UTC(2026, 6, 6, 12, 0, 0));

describe("formatDate", () => {
    it("renvoie le fallback quand la date est absente", () => {
        expect(formatDate(null)).toBe("—");
        expect(formatDate(undefined, "long", "Non disponible")).toBe(
            "Non disponible",
        );
    });

    it("formate en français (contient l'année et le mois)", () => {
        const formatted = formatDate(sampleDate, "long");

        expect(formatted).toContain("2026");
        expect(formatted.toLowerCase()).toContain("juillet");
    });
});

describe("formatDateInputValue", () => {
    it("renvoie une valeur ISO yyyy-mm-dd", () => {
        expect(formatDateInputValue(sampleDate)).toBe("2026-07-06");
    });

    it("renvoie une chaîne vide sans date", () => {
        expect(formatDateInputValue(null)).toBe("");
    });
});

describe("formatMoneyFromCents", () => {
    it("renvoie le fallback pour null/undefined", () => {
        expect(formatMoneyFromCents(null)).toBe("—");
        expect(formatMoneyFromCents(undefined, "Sur devis")).toBe("Sur devis");
    });

    it("formate des centimes en euros (montant + symbole €)", () => {
        const formatted = formatMoneyFromCents(175000);

        expect(formatted).toContain("750");
        expect(formatted).toContain("€");
    });

    it("gère zéro (0 n'est pas traité comme absent)", () => {
        expect(formatMoneyFromCents(0)).toContain("€");
    });
});

describe("formatEurosInputValue", () => {
    it("convertit les centimes en euros décimaux", () => {
        expect(formatEurosInputValue(175000)).toBe("1750");
        expect(formatEurosInputValue(150)).toBe("1.5");
    });

    it("renvoie une chaîne vide sans montant", () => {
        expect(formatEurosInputValue(null)).toBe("");
    });
});
