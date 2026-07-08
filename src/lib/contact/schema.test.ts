import { describe, expect, it } from "vitest";

import { contactPageContent } from "@/content/contact";

import { validateContactPayload } from "./schema";

const validSubject = contactPageContent.form.subjectOptions[0];

const validPayload = {
    name: "Camille Laurent",
    email: "Camille@Exemple.com",
    subject: validSubject.value,
    message: "Bonjour, j'aimerais en savoir plus.",
    consent: true,
    honeypot: "",
};

describe("validateContactPayload", () => {
    it("accepte un message valide et normalise l'e-mail", () => {
        const result = validateContactPayload(validPayload);

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.email).toBe("camille@exemple.com");
            expect(result.data.subjectLabel).toBe(validSubject.label);
            expect(result.isSpam).toBe(false);
        }
    });

    it("détecte le spam quand le honeypot est rempli", () => {
        const result = validateContactPayload({
            ...validPayload,
            honeypot: "je-suis-un-bot",
        });

        expect(result.success).toBe(false);
        expect(result.isSpam).toBe(true);
    });

    it("rejette un payload qui n'est pas un objet", () => {
        const result = validateContactPayload(null);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors.message).toBeTruthy();
        }
    });

    it("signale un e-mail invalide", () => {
        const result = validateContactPayload({
            ...validPayload,
            email: "pas-un-email",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors.email).toBeTruthy();
        }
    });

    it("signale un sujet hors liste", () => {
        const result = validateContactPayload({
            ...validPayload,
            subject: "sujet-inexistant",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors.subject).toBeTruthy();
        }
    });

    it("exige le consentement", () => {
        const result = validateContactPayload({
            ...validPayload,
            consent: false,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors.consent).toBeTruthy();
        }
    });

    it("exige les champs obligatoires (nom vide)", () => {
        const result = validateContactPayload({ ...validPayload, name: "  " });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors.name).toBeTruthy();
        }
    });
});
