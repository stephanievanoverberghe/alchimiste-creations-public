import { describe, expect, it } from "vitest";

import { resolveAccountStatus } from "./accountStatus";

describe("resolveAccountStatus", () => {
    it("renvoie null sans statut", () => {
        expect(resolveAccountStatus(undefined)).toBeNull();
    });

    it("password-updated = succès jetable (barre de temps)", () => {
        const message = resolveAccountStatus("password-updated");

        expect(message?.tone).toBe("success");
        expect(message?.isSuccess).toBe(true);
    });

    it("PASSWORD_MISMATCH = avertissement persistant", () => {
        const message = resolveAccountStatus("PASSWORD_MISMATCH");

        expect(message?.tone).toBe("warning");
        expect(message?.isSuccess).toBe(false);
    });

    it("PASSWORD_TOO_WEAK = avertissement", () => {
        expect(resolveAccountStatus("PASSWORD_TOO_WEAK")?.tone).toBe("warning");
    });

    it("renvoie null pour un statut inconnu", () => {
        expect(resolveAccountStatus("statut-inexistant")).toBeNull();
    });
});
