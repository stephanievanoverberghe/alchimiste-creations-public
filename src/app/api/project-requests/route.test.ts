// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { projectRequestPageContent } from "@/content/project-request";
import { sendProjectRequestEmail } from "@/lib/project-requests/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { createProjectRequestOpportunity } from "@/server/crm/project-requests";

import { POST } from "./route";

vi.mock("@/lib/project-requests/email", () => ({
    sendProjectRequestEmail: vi.fn(async () => ({ ok: true, provider: "resend" })),
}));

// `vi.hoisted` : la valeur est disponible dans la factory de `vi.mock`
// (elle-même hoistée au-dessus des imports).
const { opportunityResult } = vi.hoisted(() => ({
    opportunityResult: {
        clientAccountId: "acc_1",
        contactId: "contact_1",
        opportunityId: "opp_1",
        projectRequestId: "req_1",
    },
}));

vi.mock("@/server/crm/project-requests", () => ({
    createProjectRequestOpportunity: vi.fn(async () => opportunityResult),
    markProjectRequestEmailResult: vi.fn(async () => {}),
}));

vi.mock("@/lib/rate-limit", () => ({
    checkRateLimit: vi.fn(() => ({ ok: true, retryAfterSeconds: 0 })),
    getClientIp: vi.fn(() => "test-ip"),
}));

const wizard = projectRequestPageContent.wizard;

const validBody = {
    projectType: wizard.projectTypes[0].value,
    fullName: "Camille Laurent",
    email: "camille@exemple.com",
    description: "Un site vitrine pour ma maison de thé.",
    objective: "Attirer des clients locaux.",
    maturity: wizard.maturityOptions[0].value,
    consent: true,
    honeypot: "",
};

function postRequest(body: unknown) {
    return new Request("http://localhost/api/project-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: typeof body === "string" ? body : JSON.stringify(body),
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true, retryAfterSeconds: 0 });
    vi.mocked(sendProjectRequestEmail).mockResolvedValue({
        ok: true,
        provider: "resend",
    });
    vi.mocked(createProjectRequestOpportunity).mockResolvedValue(
        opportunityResult,
    );
});

describe("POST /api/project-requests", () => {
    it("enregistre et transmet une demande valide (200)", async () => {
        const response = await POST(postRequest(validBody));
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.ok).toBe(true);
        expect(json.requestId).toMatch(/^AC-DEM-/);
        expect(createProjectRequestOpportunity).toHaveBeenCalledTimes(1);
        expect(sendProjectRequestEmail).toHaveBeenCalledTimes(1);
    });

    it("répond 422 sans rien enregistrer si un champ est invalide", async () => {
        const response = await POST(
            postRequest({ ...validBody, email: "pas-un-email" }),
        );
        const json = await response.json();

        expect(response.status).toBe(422);
        expect(json.fieldErrors.email).toBeTruthy();
        expect(createProjectRequestOpportunity).not.toHaveBeenCalled();
    });

    it("avale le spam en silence (200) sans enregistrer ni envoyer", async () => {
        const response = await POST(
            postRequest({ ...validBody, honeypot: "bot" }),
        );

        expect(response.status).toBe(200);
        expect(createProjectRequestOpportunity).not.toHaveBeenCalled();
        expect(sendProjectRequestEmail).not.toHaveBeenCalled();
    });

    it("répond 400 pour un JSON illisible", async () => {
        const response = await POST(postRequest("{ pas du json"));

        expect(response.status).toBe(400);
        expect((await response.json()).code).toBe("INVALID_JSON");
    });

    it("répond 500 si l'enregistrement échoue", async () => {
        vi.mocked(createProjectRequestOpportunity).mockRejectedValueOnce(
            new Error("db down"),
        );

        const response = await POST(postRequest(validBody));

        expect(response.status).toBe(500);
        expect((await response.json()).code).toBe("REQUEST_SAVE_FAILED");
        expect(sendProjectRequestEmail).not.toHaveBeenCalled();
    });

    it("répond 429 quand la limite de débit est atteinte", async () => {
        vi.mocked(checkRateLimit).mockReturnValueOnce({
            ok: false,
            retryAfterSeconds: 60,
        });

        const response = await POST(postRequest(validBody));

        expect(response.status).toBe(429);
        expect(createProjectRequestOpportunity).not.toHaveBeenCalled();
    });

    it("répond 503 si l'e-mail n'est pas configuré (demande déjà enregistrée)", async () => {
        vi.mocked(sendProjectRequestEmail).mockResolvedValueOnce({
            ok: false,
            reason: "not-configured",
            message: "non configuré",
        });

        const response = await POST(postRequest(validBody));

        expect(response.status).toBe(503);
        expect((await response.json()).code).toBe("EMAIL_NOT_CONFIGURED");
        expect(createProjectRequestOpportunity).toHaveBeenCalledTimes(1);
    });
});
