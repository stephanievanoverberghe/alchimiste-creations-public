import { contactPageContent } from "@/content/contact";

const contactFormContent = contactPageContent.form;

const subjectValues = new Set<string>(
    contactFormContent.subjectOptions.map((option) => option.value),
);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contactServerSchema = {
    name: { required: true, maxLength: 120 },
    email: { required: true, maxLength: 254 },
    subject: { required: true, maxLength: 80 },
    message: { required: true, maxLength: 4000 },
    consent: { required: true },
    honeypot: { required: false, maxLength: 200 },
} as const;

export const contactFields = Object.keys(contactServerSchema) as ContactField[];

export type ContactField = keyof typeof contactServerSchema;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactMessageData = {
    consent: true;
    email: string;
    message: string;
    name: string;
    subject: string;
    subjectLabel: string;
};

export type ContactValidationResult =
    | {
          success: true;
          data: ContactMessageData;
          isSpam: false;
      }
    | {
          success: false;
          errors: ContactFieldErrors;
          isSpam: false;
      }
    | {
          success: false;
          errors: ContactFieldErrors;
          isSpam: true;
      };

type StringFieldResult = {
    value: string;
    error?: string;
};

export function validateContactPayload(
    payload: unknown,
): ContactValidationResult {
    if (!isRecord(payload)) {
        return {
            success: false,
            errors: {
                message: "Le message envoyé est invalide.",
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

    const errors: ContactFieldErrors = {};

    const name = readString(payload, "name", true);
    const emailField = readString(payload, "email", true);
    const email = emailField.value.toLowerCase();
    const subject = readString(payload, "subject", true);
    const message = readString(payload, "message", true);

    collectStringError(errors, "name", name);
    collectStringError(errors, "email", emailField);
    collectStringError(errors, "subject", subject);
    collectStringError(errors, "message", message);

    if (email && !emailPattern.test(email)) {
        errors.email = "Indique une adresse e-mail valide.";
    }

    if (subject.value && !subjectValues.has(subject.value)) {
        errors.subject = "Choisis un sujet valide.";
    }

    if (payload.consent !== true) {
        errors.consent =
            "Le consentement est nécessaire pour envoyer le message.";
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
            name: name.value,
            email,
            subject: subject.value,
            subjectLabel: getSubjectLabel(subject.value),
            message: message.value,
            consent: true,
        },
        isSpam: false,
    };
}

function readString(
    payload: Record<string, unknown>,
    field: ContactField,
    required: boolean,
) {
    const rawValue = payload[field];
    const limit = contactServerSchema[field];

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
    errors: ContactFieldErrors,
    field: ContactField,
    result: StringFieldResult,
) {
    if (result.error) {
        errors[field] = result.error;
    }
}

function getSubjectLabel(value: string) {
    return (
        contactFormContent.subjectOptions.find((option) => option.value === value)
            ?.label ?? value
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
