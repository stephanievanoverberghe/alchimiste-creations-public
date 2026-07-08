import { Checkbox } from "@/components/ui";
import type { ProjectRequestPageContent } from "@/content/project-request";

import type {
    RequestFormState,
    UpdateRequestField,
} from "../projectRequestWizardTypes";

/** Étape « consentement » : case à cocher requise + lien confidentialité. */
export function ConsentStep({
    content,
    error,
    form,
    updateField,
}: {
    content: ProjectRequestPageContent["wizard"];
    error?: string;
    form: RequestFormState;
    updateField: UpdateRequestField;
}) {
    return (
        <div className="grid gap-4 border-l-2 border-[color:var(--color-decor-gold)]/45 pl-4 md:pl-5">
            <Checkbox
                label="J'accepte que les informations transmises soient utilisées pour répondre à ma demande."
                name="consent"
                checked={form.consent}
                errorMessage={error}
                onChange={(event) => updateField("consent", event.target.checked)}
            />
            <p className="text-body-small text-[color:var(--color-text-muted)]">
                Consulte la{" "}
                <a
                    href={content.privacyHref}
                    className="font-medium text-[color:var(--color-action-default)] underline underline-offset-4 hover:text-[color:var(--color-action-hover)]"
                >
                    politique de confidentialité
                </a>
                .
            </p>
        </div>
    );
}
