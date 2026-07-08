// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { contactPageContent } from "@/content/contact";
import { sendContactEmail } from "@/lib/contact/email";
import { checkRateLimit } from "@/lib/rate-limit";

import { POST } from "./route";

vi.mock("@/lib/contact/email", () => ({
    sendContactEmail: vi.fn(async () => ({ ok: true, provider: "resend" })),
}));

vi.mock("@/lib/rate-limit", () => ({
    checkRateLimit: vi.fn(() => ({ ok: true, retryAfterSeconds: 0 })),
    getClientIp: vi.fn(() => "test-ip"),
}));

const validSubject = contactPageContent.form.subjectOptions[0];

const validBody = {
    name: "Camille Laurent",
    email: "camille@exemple.com",
    subject: validSubject.value,
    message: "Bonjour, une question rapide.",
    consent: true,
    honeypot: "",
};

function postRequest(body: unknown) {
    return new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: typeof body === "string" ? body : JSON.stringify(body),
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true, retryAfterSeconds: 0 });
    vi.mocked(sendContactEmail).mockResolvedValue({
        ok: true,
        provider: "resend",
    });
});

describe("POST /api/contact", () => {
    it("transmet un message valide (200) et envoie l'e-mail", async () => {
        const response = await POST(postRequest(validBody));
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.ok).toBe(true);
        expect(sendContactEmail).toHaveBeenCalledTimes(1);
    });

    it("répond 422 avec les erreurs de champ si l'e-mail est invalide", async () => {
        const response = await POST(
            postRequest({ ...validBody, email: "pas-un-email" }),
        );
        const json = await response.json();

        expect(response.status).toBe(422);
        expect(json.code).toBe("VALIDATION_ERROR");
        expect(json.fieldErrors.email).toBeTruthy();
        expect(sendContactEmail).not.toHaveBeenCalled();
    });

    it("avale le spam en silence (200) sans envoyer d'e-mail", async () => {
        const response = await POST(
            postRequest({ ...validBody, honeypot: "bot" }),
        );
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.ok).toBe(true);
        expect(sendContactEmail).not.toHaveBeenCalled();
    });

    it("répond 400 pour un corps JSON illisible", async () => {
        const response = await POST(postRequest("{ pas du json"));

        expect(response.status).toBe(400);
        expect((await response.json()).code).toBe("INVALID_JSON");
    });

    it("répond 429 quand la limite de débit est atteinte", async () => {
        vi.mocked(checkRateLimit).mockReturnValueOnce({
            ok: false,
            retryAfterSeconds: 60,
        });

        const response = await POST(postRequest(validBody));

        expect(response.status).toBe(429);
        expect(response.headers.get("Retry-After")).toBe("60");
        expect(sendContactEmail).not.toHaveBeenCalled();
    });

    it("répond 503 si l'envoi e-mail n'est pas configuré", async () => {
        vi.mocked(sendContactEmail).mockResolvedValueOnce({
            ok: false,
            reason: "not-configured",
            message: "non configuré",
        });

        const response = await POST(postRequest(validBody));

        expect(response.status).toBe(503);
        expect((await response.json()).code).toBe("EMAIL_NOT_CONFIGURED");
    });
});
