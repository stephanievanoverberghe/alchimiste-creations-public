import { Textarea } from "@/components/ui";
import type { ProjectRequestPageContent } from "@/content/project-request";

import { ProjectRequestAttachmentField } from "../ProjectRequestAttachmentField";
import type {
    RequestFormState,
    UpdateRequestField,
} from "../projectRequestWizardTypes";
import { ChoiceChips, FieldGroup } from "./shared";

/** Étape « cadre & précisions » : budget/délai en chips + précisions + pièce jointe. */
export function FrameDetailsStep({
    content,
    form,
    hasDetails,
    hasFrame,
    isResponsive,
    updateField,
}: {
    content: ProjectRequestPageContent["wizard"];
    form: RequestFormState;
    hasDetails: boolean;
    hasFrame: boolean;
    isResponsive: boolean;
    updateField: UpdateRequestField;
}) {
    if (isResponsive && hasFrame && hasDetails) {
        return (
            <div className="grid gap-8">
                <FieldGroup
                    eyebrow="Cadre"
                    title="Budget et délai"
                    description="Ces réponses restent indicatives. Elles aident surtout à proposer une suite réaliste."
                >
                    <div className="grid gap-5">
                        <ChoiceChips
                            label="Budget indicatif"
                            options={content.budgetOptions}
                            value={form.budget}
                            onSelect={(value) => updateField("budget", value)}
                        />
                        <ChoiceChips
                            label="Délai souhaité"
                            options={content.deadlineOptions}
                            value={form.deadline}
                            onSelect={(value) => updateField("deadline", value)}
                        />
                    </div>
                </FieldGroup>

                <FieldGroup
                    eyebrow="Précisions"
                    title="Ce qui peut aider"
                    description="Ajoute les contraintes, contenus prêts, inspirations ou points sensibles — et un document si tu en as un."
                >
                    <Textarea
                        label="Précisions"
                        name="constraints"
                        value={form.constraints}
                        placeholder="Contraintes, inspirations, contenus prêts, point sensible..."
                        onChange={(event) => updateField("constraints", event.target.value)}
                    />
                    <AttachmentField form={form} updateField={updateField} />
                </FieldGroup>
            </div>
        );
    }

    return (
        <div className="grid gap-5">
            {hasFrame ? (
                <>
                    <ChoiceChips
                        label="Budget indicatif"
                        options={content.budgetOptions}
                        value={form.budget}
                        onSelect={(value) => updateField("budget", value)}
                    />
                    <ChoiceChips
                        label="Délai souhaité"
                        options={content.deadlineOptions}
                        value={form.deadline}
                        onSelect={(value) => updateField("deadline", value)}
                    />
                </>
            ) : null}

            {hasDetails ? (
                <>
                    <Textarea
                        label="Précisions"
                        name="constraints"
                        value={form.constraints}
                        placeholder="Contraintes, inspirations, contenus prêts, point sensible..."
                        onChange={(event) => updateField("constraints", event.target.value)}
                    />
                    <AttachmentField form={form} updateField={updateField} />
                </>
            ) : null}
        </div>
    );
}

/**
 * Passerelle entre l'état du wizard et le champ d'upload : relie
 * `attachmentUrl`/`attachmentName` du formulaire au composant d'envoi.
 */
function AttachmentField({
    form,
    updateField,
}: {
    form: RequestFormState;
    updateField: UpdateRequestField;
}) {
    return (
        <ProjectRequestAttachmentField
            value={{ url: form.attachmentUrl, name: form.attachmentName }}
            onChange={(next) => {
                updateField("attachmentUrl", next.url);
                updateField("attachmentName", next.name);
            }}
        />
    );
}
