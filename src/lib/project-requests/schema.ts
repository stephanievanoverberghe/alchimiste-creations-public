import { projectRequestPageContent } from "@/content/project-request";

const wizardContent = projectRequestPageContent.wizard;

const projectTypeValues = new Set<string>(
    wizardContent.projectTypes.map((option) => option.value),
);
const maturityValues = new Set<string>(
    wizardContent.maturityOptions.map((option) => option.value),
);
const budgetValues = new Set<string>(
    wizardContent.budgetOptions.map((option) => option.value),
);
const deadlineValues = new Set<string>(
    wizardContent.deadlineOptions.map((option) => option.value),
);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const projectRequestServerSchema = {
    projectType: { required: true, maxLength: 80 },
    fullName: { required: true, maxLength: 120 },
    email: { required: true, maxLength: 254 },
    projectName: { required: false, maxLength: 160 },
    website: { required: false, maxLength: 300 },
    description: { required: true, maxLength: 4000 },
    objective: { required: true, maxLength: 2500 },
    maturity: { required: true, maxLength: 80 },
    budget: { required: false, maxLength: 80 },
    deadline: { required: false, maxLength: 80 },
    constraints: { required: false, maxLength: 3000 },
    attachmentUrl: { required: false, maxLength: 600 },
    attachmentName: { required: false, maxLength: 200 },
    consent: { required: true },
    honeypot: { required: false, maxLength: 200 },
} as const;

export const projectRequestFields = Object.keys(
    projectRequestServerSchema,
) as ProjectRequestField[];

export type ProjectRequestField = keyof typeof projectRequestServerSchema;

export type ProjectRequestFieldErrors = Partial<
    Record<ProjectRequestField, string>
>;

export type ProjectRequestLabels = {
    budget: string;
    deadline: string;
    maturity: string;
    projectType: string;
};

export type ProjectRequestData = {
    projectType: string;
    fullName: string;
    email: string;
    projectName: string;
    website: string;
    description: string;
    objective: string;
    maturity: string;
    budget: string;
    deadline: string;
    constraints: string;
    attachmentUrl: string;
    attachmentName: string;
    consent: true;
    labels: ProjectRequestLabels;
};

export type ProjectRequestValidationResult =
    | {
          success: true;
          data: ProjectRequestData;
          isSpam: false;
      }
    | {
          success: false;
          errors: ProjectRequestFieldErrors;
          isSpam: false;
      }
    | {
          success: false;
          errors: ProjectRequestFieldErrors;
          isSpam: true;
      };

type StringFieldResult = {
    value: string;
    error?: string;
};

export function validateProjectRequestPayload(
    payload: unknown,
): ProjectRequestValidationResult {
    if (!isRecord(payload)) {
        return {
            success: false,
            errors: {
                projectType: "La demande envoyée est invalide.",
            },
            isSpam: false,
        };
    }

    const honeypot = readString(payload, "honeypot", false);

    if (honeypot.value.trim()) {
        return {
            success: false,
            errors: {},
            isSpam: true,
        };
    }

    const errors: ProjectRequestFieldErrors = {};

    const projectType = readString(payload, "projectType", true);
    const fullName = readString(payload, "fullName", true);
    const emailField = readString(payload, "email", true);
    const email = emailField.value.toLowerCase();
    const projectName = readString(payload, "projectName", false);
    const rawWebsite = readString(payload, "website", false);
    const description = readString(payload, "description", true);
    const objective = readString(payload, "objective", true);
    const maturity = readString(payload, "maturity", true);
    const budget = readString(payload, "budget", false);
    const deadline = readString(payload, "deadline", false);
    const constraints = readString(payload, "constraints", false);
    const attachmentUrl = readString(payload, "attachmentUrl", false);
    const attachmentName = readString(payload, "attachmentName", false);

    collectStringError(errors, "projectType", projectType);
    collectStringError(errors, "fullName", fullName);
    collectStringError(errors, "email", emailField);
    collectStringError(errors, "projectName", projectName);
    collectStringError(errors, "website", rawWebsite);
    collectStringError(errors, "description", description);
    collectStringError(errors, "objective", objective);
    collectStringError(errors, "maturity", maturity);
    collectStringError(errors, "budget", budget);
    collectStringError(errors, "deadline", deadline);
    collectStringError(errors, "constraints", constraints);

    // La pièce jointe ne bloque jamais l'envoi : une URL non-Cloudinary
    // (injection ou copier-coller) est ignorée, et un nom de fichier trop long
    // est tronqué plutôt que de produire une erreur de validation — le champ
    // n'est pas éditable par l'utilisateur, une erreur y serait un cul-de-sac.
    const safeAttachmentUrl = sanitizeAttachmentUrl(attachmentUrl.value);
    const safeAttachmentName = safeAttachmentUrl
        ? attachmentName.value.slice(0, 200)
        : "";

    if (projectType.value && !projectTypeValues.has(projectType.value)) {
        errors.projectType = "Choisis un type de projet valide.";
    }

    if (email && !emailPattern.test(email)) {
        errors.email = "Indique une adresse e-mail valide.";
    }

    const website = normalizeWebsite(rawWebsite.value);
    if (rawWebsite.value && !website) {
        errors.website = "Indique une adresse de site valide.";
    }

    if (maturity.value && !maturityValues.has(maturity.value)) {
        errors.maturity = "Sélectionne un état d'avancement valide.";
    }

    if (budget.value && !budgetValues.has(budget.value)) {
        errors.budget = "Sélectionne une enveloppe valide.";
    }

    if (deadline.value && !deadlineValues.has(deadline.value)) {
        errors.deadline = "Sélectionne un délai valide.";
    }

    if (payload.consent !== true) {
        errors.consent =
            "Le consentement est nécessaire pour envoyer la demande.";
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
            isSpam: false,
        };
    }

    return {
        success: true,
        data: {
            projectType: projectType.value,
            fullName: fullName.value,
            email,
            projectName: projectName.value,
            website,
            description: description.value,
            objective: objective.value,
            maturity: maturity.value,
            budget: budget.value,
            deadline: deadline.value,
            constraints: constraints.value,
            attachmentUrl: safeAttachmentUrl,
            attachmentName: safeAttachmentName,
            consent: true,
            labels: {
                budget: getOptionLabel(wizardContent.budgetOptions, budget.value),
                deadline: getOptionLabel(
                    wizardContent.deadlineOptions,
                    deadline.value,
                ),
                maturity: getOptionLabel(
                    wizardContent.maturityOptions,
                    maturity.value,
                ),
                projectType: getOptionLabel(
                    wizardContent.projectTypes,
                    projectType.value,
                ),
            },
        },
        isSpam: false,
    };
}

function readString(
    payload: Record<string, unknown>,
    field: ProjectRequestField,
    required: boolean,
) {
    const rawValue = payload[field];
    const limit = projectRequestServerSchema[field];

    if (typeof rawValue !== "string") {
        if (required) {
            return {
                value: "",
                error: "Ce champ est nécessaire.",
            };
        }

        return {
            value: "",
            error: undefined,
        };
    }

    const value = rawValue.trim();

    if (required && !value) {
        return {
            value,
            error: "Ce champ est nécessaire.",
        };
    }

    if ("maxLength" in limit && value.length > limit.maxLength) {
        return {
            value,
            error: `Ce champ doit rester sous ${limit.maxLength} caractères.`,
        };
    }

    return {
        value,
        error: undefined,
    };
}

function collectStringError(
    errors: ProjectRequestFieldErrors,
    field: ProjectRequestField,
    result: StringFieldResult,
) {
    if (result.error) {
        errors[field] = result.error;
    }
}

function normalizeWebsite(value: string) {
    if (!value) return "";

    const candidate = /^[a-z][a-z\d+\-.]*:\/\//i.test(value)
        ? value
        : `https://${value}`;

    try {
        const url = new URL(candidate);
        const isHttp = url.protocol === "http:" || url.protocol === "https:";

        if (!isHttp || !url.hostname.includes(".")) {
            return "";
        }

        return url.toString();
    } catch {
        return "";
    }
}

function getOptionLabel(
    options: readonly { label: string; value: string }[],
    value: string,
) {
    return options.find((option) => option.value === value)?.label ?? "";
}

/**
 * N'accepte que les URLs de médias Cloudinary (`https://res.cloudinary.com/…`),
 * seule destination possible de l'upload du wizard. Toute autre URL est
 * rejetée pour empêcher qu'un lien arbitraire soit stocké et présenté comme
 * une pièce jointe de confiance.
 */
function sanitizeAttachmentUrl(value: string) {
    if (!value) return "";

    try {
        const url = new URL(value);

        if (url.protocol !== "https:") return "";
        if (url.hostname !== "res.cloudinary.com") return "";

        return url.toString();
    } catch {
        return "";
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
