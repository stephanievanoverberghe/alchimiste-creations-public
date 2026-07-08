import { describe, expect, it } from "vitest";

import {
    getGateStatus,
    getOpportunityStatus,
    getProjectStatusForAdmin,
    getProjectStatusForClient,
    getRequestStatusForClient,
} from "./status-labels";

describe("status-labels — vocabulaire client (jamais de statut brut)", () => {
    it("traduit les statuts de demande en langage client", () => {
        expect(getRequestStatusForClient("NOUVEAU").label).toBe("Demande reçue");
        expect(getRequestStatusForClient("ACCEPTE").label).toBe("Acceptée");
    });

    it("ne laisse jamais fuir le code brut pour un statut de demande connu", () => {
        const knownCodes = [
            "NOUVEAU",
            "A_QUALIFIER",
            "DEVIS_ENVOYE",
            "ACCEPTE",
            "REFUSE",
            "ARCHIVE",
        ];

        for (const code of knownCodes) {
            expect(getRequestStatusForClient(code).label).not.toBe(code);
        }
    });

    it("raconte le projet au client plutôt que la mécanique interne", () => {
        expect(getProjectStatusForClient("PREPARATION").label).toBe(
            "On prépare ton projet",
        );
        expect(getProjectStatusForClient("EN_VALIDATION").label).toBe(
            "En attente de ton retour",
        );
        expect(getProjectStatusForClient("EN_VALIDATION").label).not.toBe(
            "EN_VALIDATION",
        );
    });
});

describe("status-labels — comportement de resolve", () => {
    it("renvoie « — » pour null / undefined", () => {
        expect(getRequestStatusForClient(null).label).toBe("—");
        expect(getProjectStatusForClient(undefined).label).toBe("—");
    });

    it("retombe sur la valeur brute pour un statut inconnu", () => {
        expect(getProjectStatusForAdmin("STATUT_INCONNU").label).toBe(
            "STATUT_INCONNU",
        );
    });

    it("associe un ton cohérent à chaque statut connu", () => {
        expect(getRequestStatusForClient("ACCEPTE").tone).toBe("success");
        expect(getGateStatus("BLOCKED").tone).toBe("danger");
    });
});

describe("status-labels — vocabulaire admin", () => {
    it("traduit les statuts d'opportunité du pipeline", () => {
        expect(getOpportunityStatus("NOUVEAU").label).toBe("Nouveau");
        expect(getOpportunityStatus("DEVIS_ENVOYE").tone).toBe("info");
    });

    it("traduit les gates (PENDING → En attente)", () => {
        expect(getGateStatus("PENDING").label).toBe("En attente");
    });
});
