import { Textarea } from "@/components/ui";
import type { ProjectRequestPageContent } from "@/content/project-request";

import type {
    RequestFormErrors,
    RequestFormState,
    UpdateRequestField,
} from "../projectRequestWizardTypes";
import { ChoiceChips, FieldGroup } from "./shared";

/** Étape « besoin & objectif » : deux textes libres + l'état d'avancement. */
export function NeedObjectiveStep({
    content,
    errors,
    form,
    hasNeed,
    hasObjective,
    isResponsive,
    updateField,
}: {
    content: ProjectRequestPageContent["wizard"];
    errors: RequestFormErrors;
    form: RequestFormState;
    hasNeed: boolean;
    hasObjective: boolean;
    isResponsive: boolean;
    updateField: UpdateRequestField;
}) {
    if (isResponsive && hasNeed && hasObjective) {
        return (
            <div className="grid gap-8 xl:grid-cols-2 xl:gap-10">
                <FieldGroup
                    eyebrow="Besoin"
                    title="Ce que tu veux faire"
                    description="Décris le projet avec tes mots. Même une version courte permet déjà de comprendre la direction."
                >
                    <Textarea
                        label="Besoin"
                        name="description"
                        value={form.description}
                        errorMessage={errors.description}
                        placeholder="Créer, améliorer, vendre, clarifier..."
                        required
                        onChange={(event) => updateField("description", event.target.value)}
                    />
                </FieldGroup>

                <FieldGroup
                    eyebrow="Objectif"
                    title="Le résultat attendu"
                    description="On précise pourquoi ce projet compte et où il en est aujourd'hui."
                >
                    <Textarea
                        label="Objectif principal"
                        name="objective"
                        value={form.objective}
                        errorMessage={errors.objective}
                        placeholder="Exemple : présenter une activité, vendre une offre, structurer une formation..."
                        required
                        onChange={(event) => updateField("objective", event.target.value)}
                    />
                    <ChoiceChips
                        label="État d'avancement"
                        required
                        options={content.maturityOptions}
                        value={form.maturity}
                        error={errors.maturity}
                        onSelect={(value) => updateField("maturity", value)}
                    />
                </FieldGroup>
            </div>
        );
    }

    return (
        <div className="grid gap-5">
            {hasNeed ? (
                <Textarea
                    label="Besoin"
                    name="description"
                    value={form.description}
                    errorMessage={errors.description}
                    placeholder="Explique ce que tu veux créer, améliorer ou clarifier."
                    required
                    onChange={(event) => updateField("description", event.target.value)}
                />
            ) : null}

            {hasObjective ? (
                <>
                    <Textarea
                        label="Objectif principal"
                        name="objective"
                        value={form.objective}
                        errorMessage={errors.objective}
                        placeholder="Ce que le projet doit changer concrètement."
                        required
                        onChange={(event) => updateField("objective", event.target.value)}
                    />
                    <ChoiceChips
                        label="État d'avancement"
                        required
                        options={content.maturityOptions}
                        value={form.maturity}
                        error={errors.maturity}
                        onSelect={(value) => updateField("maturity", value)}
                    />
                </>
            ) : null}
        </div>
    );
}
