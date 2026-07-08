import { describe, expect, it } from "vitest";

import { projectRequestPageContent } from "@/content/project-request";

import { validateProjectRequestPayload } from "./schema";

const wizard = projectRequestPageContent.wizard;
const validProjectType = wizard.projectTypes[0];
const validMaturity = wizard.maturityOptions[0];

const validPayload = {
    projectType: validProjectType.value,
    fullName: "Camille Laurent",
    email: "Camille@Exemple.com",
    description: "Un site vitrine chaleureux pour ma maison de thé.",
    objective: "Attirer de nouveaux clients locaux.",
    maturity: validMaturity.value,
    consent: true,
    honeypot: "",
};

describe("validateProjectRequestPayload", () => {
    it("accepte une demande valide, normalise l'e-mail et résout les libellés", () => {
        const result = validateProjectRequestPayload(validPayload);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.email).toBe("camille@exemple.com");
            expect(result.data.labels.projectType).toBe(validProjectType.label);
            expect(result.isSpam).toBe(false);
        }
    });

    it("détecte le spam quand le honeypot est rempli (sans erreurs)", () => {
        const result = validateProjectRequestPayload({
            ...validPayload,
            honeypot: "bot",
        });

        expect(result.success).toBe(false);
        expect(result.isSpam).toBe(true);
    });

    it("rejette un payload qui n'est pas un objet", () => {
        expect(validateProjectRequestPayload(null).success).toBe(false);
    });

    it("signale un e-mail invalide", () => {
        const result = validateProjectRequestPayload({
            ...validPayload,
            email: "pas-un-email",
        });

        expect(result.success).toBe(false);
        if (!result.success) expect(result.errors.email).toBeTruthy();
    });

    it("signale un type de projet hors liste", () => {
        const result = validateProjectRequestPayload({
            ...validPayload,
            projectType: "type-inexistant",
        });

        expect(result.success).toBe(false);
        if (!result.success) expect(result.errors.projectType).toBeTruthy();
    });

    it("signale un état d'avancement invalide", () => {
        const result = validateProjectRequestPayload({
            ...validPayload,
            maturity: "avancement-inexistant",
        });

        expect(result.success).toBe(false);
        if (!result.success) expect(result.errors.maturity).toBeTruthy();
    });

    it("exige les champs obligatoires (nom, description, objectif)", () => {
        const result = validateProjectRequestPayload({
            ...validPayload,
            fullName: "  ",
            description: "",
            objective: "",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors.fullName).toBeTruthy();
            expect(result.errors.description).toBeTruthy();
            expect(result.errors.objective).toBeTruthy();
        }
    });

    it("exige le consentement", () => {
        const result = validateProjectRequestPayload({
            ...validPayload,
            consent: false,
        });

        expect(result.success).toBe(false);
        if (!result.success) expect(result.errors.consent).toBeTruthy();
    });

    it("ignore une pièce jointe non-Cloudinary sans bloquer l'envoi", () => {
        const result = validateProjectRequestPayload({
            ...validPayload,
            attachmentUrl: "https://evil.example/malware.exe",
            attachmentName: "malware.exe",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.attachmentUrl).toBe("");
            expect(result.data.attachmentName).toBe("");
        }
    });
});
