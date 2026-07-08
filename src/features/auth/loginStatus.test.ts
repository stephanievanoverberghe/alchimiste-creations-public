import { describe, expect, it } from "vitest";

import { getSafeCallbackUrl, resolveLoginError } from "./loginStatus";

describe("getSafeCallbackUrl", () => {
    it("conserve un chemin interne valide", () => {
        expect(getSafeCallbackUrl("/espace-client")).toBe("/espace-client");
    });

    it("retombe sur l'écran de redirection quand l'URL est absente", () => {
        expect(getSafeCallbackUrl(undefined)).toBe("/connexion/redirect");
    });

    it("rejette une URL externe (anti open-redirect)", () => {
        expect(getSafeCallbackUrl("https://evil.example")).toBe(
            "/connexion/redirect",
        );
    });

    it("rejette une URL protocol-relative (//)", () => {
        expect(getSafeCallbackUrl("//evil.example")).toBe("/connexion/redirect");
    });

    it("rejette un chemin ne commençant pas par /", () => {
        expect(getSafeCallbackUrl("espace-client")).toBe("/connexion/redirect");
    });
});

describe("resolveLoginError", () => {
    it("renvoie null quand il n'y a pas d'erreur", () => {
        expect(resolveLoginError(undefined)).toBeNull();
    });

    it("mappe AccessDenied sur un ton danger avec un message", () => {
        const message = resolveLoginError("AccessDenied");

        expect(message?.tone).toBe("danger");
        expect(message?.title).toBeTruthy();
        expect(message?.message).toBeTruthy();
    });

    it("mappe EmailRequired sur un ton warning", () => {
        expect(resolveLoginError("EmailRequired")?.tone).toBe("warning");
    });

    it("mappe CredentialsSignin sur un ton danger", () => {
        expect(resolveLoginError("CredentialsSignin")?.tone).toBe("danger");
    });

    it("mappe une erreur inconnue sur le message générique (danger)", () => {
        expect(resolveLoginError("SomethingUnexpected")?.tone).toBe("danger");
    });
});
