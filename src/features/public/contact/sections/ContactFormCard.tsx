"use client";

import { Mail, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

import {
    Button,
    Checkbox,
    Select,
    Textarea,
    TextField,
    Toast,
} from "@/components/ui";
import type { ContactPageContent } from "@/content/contact";

type ContactFormCardProps = {
    content: ContactPageContent["form"];
};

type ContactFormValues = {
    consent: boolean;
    email: string;
    honeypot: string;
    message: string;
    name: string;
    subject: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const initialValues: ContactFormValues = {
    consent: false,
    email: "",
    honeypot: "",
    message: "",
    name: "",
    subject: "",
};

const contactFormFields = [
    "consent",
    "email",
    "honeypot",
    "message",
    "name",
    "subject",
] as const satisfies readonly (keyof ContactFormValues)[];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactFormCard({ content }: ContactFormCardProps) {
    const [values, setValues] = useState<ContactFormValues>(initialValues);
    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [submitError, setSubmitError] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Clés incrémentées à chaque succès / erreur : forcent le remontage du
    // toast (donc relancent son minuteur) même sur deux envois successifs.
    const [successKey, setSuccessKey] = useState(0);
    const [submitErrorKey, setSubmitErrorKey] = useState(0);

    const showSubmitError = (message: string) => {
        setSubmitError(message);
        setSubmitErrorKey((key) => key + 1);
    };

    const updateValue = <Key extends keyof ContactFormValues>(
        key: Key,
        value: ContactFormValues[Key],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
        setErrors((currentErrors) => ({
            ...currentErrors,
            [key]: undefined,
        }));
        setSubmitError(undefined);
    };

    const handleTextChange =
        (key: "email" | "honeypot" | "message" | "name") =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                updateValue(key, event.target.value);
            };

    const validate = () => {
        const nextErrors: ContactFormErrors = {};

        if (!values.name.trim()) {
            nextErrors.name = content.errors.name;
        }

        if (!emailPattern.test(values.email.trim())) {
            nextErrors.email = content.errors.email;
        }

        if (!values.subject) {
            nextErrors.subject = content.errors.subject;
        }

        if (!values.message.trim()) {
            nextErrors.message = content.errors.message;
        }

        if (!values.consent) {
            nextErrors.consent = content.errors.consent;
        }

        return nextErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        const nextErrors = validate();

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(undefined);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const result = await readContactResponse(response);
            const isSuccessfulResponse = isRecord(result) && result.ok === true;

            if (!response.ok || !isSuccessfulResponse) {
                const fieldErrors = getContactFieldErrors(result);

                if (fieldErrors) {
                    setErrors(fieldErrors);
                }

                showSubmitError(
                    getContactErrorMessage(result) ??
                        "L'envoi n'a pas pu aboutir. Vérifie les informations puis réessaie.",
                );
                return;
            }

            setValues(initialValues);
            setSuccessKey((current) => current + 1);
        } catch {
            showSubmitError(
                "L'envoi n'a pas pu aboutir. Vérifie ta connexion puis réessaie.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            {successKey > 0 ? (
                <Toast
                    key={successKey}
                    autoDismiss
                    dismissible
                    durationMs={7000}
                    placement="top"
                    showProgress
                    tone="success"
                    title="Message envoyé"
                >
                    Ton message est bien parti. Je te réponds sous 2 jours
                    ouvrés sur l&apos;adresse indiquée.
                </Toast>
            ) : null}

            {submitError ? (
                <Toast
                    key={`error-${submitErrorKey}`}
                    dismissible
                    placement="top"
                    tone="danger"
                    title="Envoi impossible"
                >
                    {submitError}
                </Toast>
            ) : null}

            <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-honeypot">
                    Ne pas remplir ce champ
                </label>
                <input
                    id="contact-honeypot"
                    name="honeypot"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.honeypot}
                    onChange={handleTextChange("honeypot")}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label={content.fields.name.label}
                    name="name"
                    autoComplete="name"
                    placeholder={content.fields.name.placeholder}
                    helperText={content.fields.name.helper}
                    errorMessage={errors.name}
                    required
                    disabled={isSubmitting}
                    value={values.name}
                    iconLeft={<User />}
                    onChange={handleTextChange("name")}
                />

                <TextField
                    label={content.fields.email.label}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder={content.fields.email.placeholder}
                    helperText={content.fields.email.helper}
                    errorMessage={errors.email}
                    required
                    disabled={isSubmitting}
                    value={values.email}
                    iconLeft={<Mail />}
                    onChange={handleTextChange("email")}
                />
            </div>

            <Select
                label={content.fields.subject.label}
                name="subject"
                placeholder={content.fields.subject.placeholder}
                helperText={content.fields.subject.helper}
                errorMessage={errors.subject}
                required
                value={values.subject}
                options={[...content.subjectOptions]}
                disabled={isSubmitting}
                onValueChange={(value) => updateValue("subject", value)}
            />

            <Textarea
                label={content.fields.message.label}
                name="message"
                placeholder={content.fields.message.placeholder}
                helperText={content.fields.message.helper}
                errorMessage={errors.message}
                required
                disabled={isSubmitting}
                value={values.message}
                onChange={handleTextChange("message")}
            />

            <Checkbox
                label={content.fields.consent.label}
                helperText={content.fields.consent.helper}
                errorMessage={errors.consent}
                name="consent"
                checked={values.consent}
                disabled={isSubmitting}
                onChange={(event) => updateValue("consent", event.target.checked)}
            />

            <p className="text-caption text-[color:var(--color-text-subtle)]">
                En envoyant ce formulaire, tu acceptes le traitement des informations
                indiquées pour répondre à ton message. Tu peux consulter la{" "}
                <Link
                    href={content.privacyHref}
                    className="text-[color:var(--color-action-default)] no-underline hover:text-[color:var(--color-action-hover)]"
                >
                    politique de confidentialité
                </Link>
                .
            </p>

            <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                iconRight={
                    isSubmitting ? undefined : (
                        <MessageSquare className="size-4" aria-hidden="true" />
                    )
                }
                className="w-full md:w-fit"
            >
                {isSubmitting ? "Envoi en cours..." : content.submitLabel}
            </Button>
        </form>
    );
}

async function readContactResponse(response: Response) {
    try {
        return (await response.json()) as unknown;
    } catch {
        return null;
    }
}

function getContactErrorMessage(payload: unknown) {
    if (!isRecord(payload) || typeof payload.message !== "string") {
        return undefined;
    }

    return payload.message;
}

function getContactFieldErrors(payload: unknown): ContactFormErrors | undefined {
    if (!isRecord(payload) || !isRecord(payload.fieldErrors)) {
        return undefined;
    }

    const errors: ContactFormErrors = {};

    for (const field of contactFormFields) {
        const message = payload.fieldErrors[field];

        if (typeof message === "string") {
            errors[field] = message;
        }
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
