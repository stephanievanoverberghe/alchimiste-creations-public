import { Globe, Mail, PenLine, UserRound } from "lucide-react";

import { TextField } from "@/components/ui";

import type {
    RequestFormErrors,
    RequestFormState,
    UpdateRequestField,
} from "../projectRequestWizardTypes";
import { FieldGroup } from "./shared";

/** Étape « contact & contexte » : identité (requise) + projet/site (facultatif). */
export function ContactContextStep({
    errors,
    form,
    hasIdentity,
    hasProjectContext,
    isResponsive,
    updateField,
}: {
    errors: RequestFormErrors;
    form: RequestFormState;
    hasIdentity: boolean;
    hasProjectContext: boolean;
    isResponsive: boolean;
    updateField: UpdateRequestField;
}) {
    if (isResponsive && hasIdentity && hasProjectContext) {
        return (
            <div className="grid gap-8 xl:grid-cols-2 xl:gap-10">
                <FieldGroup
                    eyebrow="Contact"
                    title="La personne à recontacter"
                    description="Un nom et un e-mail suffisent pour rattacher la demande au bon échange."
                >
                    <IdentityFields
                        errors={errors}
                        form={form}
                        updateField={updateField}
                    />
                </FieldGroup>

                <FieldGroup
                    eyebrow="Projet"
                    title="Le contexte de départ"
                    description="Facultatif — mais ça évite les allers-retours inutiles."
                >
                    <ProjectContextFields
                        form={form}
                        updateField={updateField}
                    />
                </FieldGroup>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {hasIdentity ? (
                <IdentityFields
                    errors={errors}
                    form={form}
                    updateField={updateField}
                />
            ) : null}

            {hasProjectContext ? (
                <ProjectContextFields
                    form={form}
                    updateField={updateField}
                />
            ) : null}
        </div>
    );
}

function IdentityFields({
    errors,
    form,
    updateField,
}: {
    errors: RequestFormErrors;
    form: RequestFormState;
    updateField: UpdateRequestField;
}) {
    return (
        <div className="grid gap-4">
            <TextField
                label="Nom ou prénom"
                name="fullName"
                autoComplete="name"
                value={form.fullName}
                errorMessage={errors.fullName}
                placeholder="Ton nom"
                iconLeft={<UserRound />}
                required
                onChange={(event) => updateField("fullName", event.target.value)}
            />
            <TextField
                label="Adresse e-mail"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                errorMessage={errors.email}
                placeholder="ton@email.com"
                iconLeft={<Mail />}
                required
                onChange={(event) => updateField("email", event.target.value)}
            />
        </div>
    );
}

function ProjectContextFields({
    form,
    updateField,
}: {
    form: RequestFormState;
    updateField: UpdateRequestField;
}) {
    return (
        <div className="grid gap-4">
            <TextField
                label="Nom du projet"
                name="projectName"
                value={form.projectName}
                placeholder="Nom, marque, activité..."
                iconLeft={<PenLine />}
                onChange={(event) => updateField("projectName", event.target.value)}
            />
            <TextField
                label="Site existant"
                name="website"
                type="url"
                inputMode="url"
                autoComplete="url"
                value={form.website}
                placeholder="https://..."
                iconLeft={<Globe />}
                onChange={(event) => updateField("website", event.target.value)}
            />
        </div>
    );
}
