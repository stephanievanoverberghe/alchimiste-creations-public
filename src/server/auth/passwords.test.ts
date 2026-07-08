import { describe, expect, it } from "vitest";

import { hashPassword, validateNewPassword, verifyPassword } from "./passwords";

describe("validateNewPassword", () => {
    it("rejette deux mots de passe différents (mismatch)", () => {
        const result = validateNewPassword({
            password: "MotDePasse123",
            confirmPassword: "MotDePasse124",
        });

        expect(result).toEqual({ ok: false, code: "PASSWORD_MISMATCH" });
    });

    it("rejette un mot de passe trop court (< 12)", () => {
        const result = validateNewPassword({
            password: "Court1",
            confirmPassword: "Court1",
        });

        expect(result).toEqual({ ok: false, code: "PASSWORD_TOO_WEAK" });
    });

    it("rejette un mot de passe sans chiffre", () => {
        expect(
            validateNewPassword({
                password: "MotDePasseSansChiffre",
                confirmPassword: "MotDePasseSansChiffre",
            }),
        ).toEqual({ ok: false, code: "PASSWORD_TOO_WEAK" });
    });

    it("rejette un mot de passe sans lettre", () => {
        expect(
            validateNewPassword({
                password: "123456789012",
                confirmPassword: "123456789012",
            }),
        ).toEqual({ ok: false, code: "PASSWORD_TOO_WEAK" });
    });

    it("accepte un mot de passe ≥ 12 avec lettre et chiffre", () => {
        expect(
            validateNewPassword({
                password: "MonMotDePasse2026",
                confirmPassword: "MonMotDePasse2026",
            }),
        ).toEqual({ ok: true });
    });
});

describe("hashPassword / verifyPassword", () => {
    it("vérifie le bon mot de passe après hachage (round-trip)", async () => {
        const hash = await hashPassword("MonMotDePasse2026");

        expect(hash.startsWith("scrypt$")).toBe(true);
        await expect(
            verifyPassword({ password: "MonMotDePasse2026", passwordHash: hash }),
        ).resolves.toBe(true);
    });

    it("rejette un mauvais mot de passe", async () => {
        const hash = await hashPassword("MonMotDePasse2026");

        await expect(
            verifyPassword({ password: "MauvaisMotDePasse", passwordHash: hash }),
        ).resolves.toBe(false);
    });

    it("renvoie false pour un hash absent ou malformé", async () => {
        await expect(
            verifyPassword({ password: "peu importe", passwordHash: null }),
        ).resolves.toBe(false);
        await expect(
            verifyPassword({ password: "peu importe", passwordHash: "invalide" }),
        ).resolves.toBe(false);
    });

    it("produit un hash différent à chaque appel (sel aléatoire)", async () => {
        const first = await hashPassword("MonMotDePasse2026");
        const second = await hashPassword("MonMotDePasse2026");

        expect(first).not.toBe(second);
    });
});
