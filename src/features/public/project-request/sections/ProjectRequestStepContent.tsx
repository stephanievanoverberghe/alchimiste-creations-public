import type { ProjectRequestPageContent } from "@/content/project-request";

import type {
    RequestFormErrors,
    RequestFormLabels,
    RequestFormState,
    ReviewStepTargets,
    UpdateRequestField,
    WizardStepId,
} from "./projectRequestWizardTypes";
import { ConsentStep } from "./steps/ConsentStep";
import { ContactContextStep } from "./steps/ContactContextStep";
import { FrameDetailsStep } from "./steps/FrameDetailsStep";
import { NeedObjectiveStep } from "./steps/NeedObjectiveStep";
import { ProjectTypeStep } from "./steps/ProjectTypeStep";
import { ReviewStep } from "./steps/ReviewStep";
import { StartStep } from "./steps/StartStep";

type ProjectRequestStepContentProps = {
    content: ProjectRequestPageContent["wizard"];
    errors: RequestFormErrors;
    form: RequestFormState;
    goToStep: (index: number) => void;
    labels: RequestFormLabels;
    reviewStepTargets: ReviewStepTargets;
    stepIds: WizardStepId[];
    updateField: UpdateRequestField;
    variant: "mobile" | "responsive";
};

/**
 * Aiguillage du contenu d'une étape du wizard, partagé par les deux shells :
 * il choisit la bonne étape (`steps/*`) selon les `stepIds` courants et lui
 * distribue les props. Chaque étape vit dans son propre fichier ; aucune
 * logique de validation ici, les saisies remontent via `updateField`.
 */
export function ProjectRequestStepContent({
    content,
    errors,
    form,
    goToStep,
    labels,
    reviewStepTargets,
    stepIds,
    updateField,
    variant,
}: ProjectRequestStepContentProps) {
    const hasStep = (stepId: WizardStepId) => stepIds.includes(stepId);
    const isResponsive = variant === "responsive";

    if (hasStep("start")) {
        return <StartStep />;
    }

    if (hasStep("project-type")) {
        return (
            <ProjectTypeStep
                content={content}
                error={errors.projectType}
                form={form}
                isResponsive={isResponsive}
                updateField={updateField}
            />
        );
    }

    if (hasStep("identity") || hasStep("project-context")) {
        return (
            <ContactContextStep
                errors={errors}
                form={form}
                hasIdentity={hasStep("identity")}
                hasProjectContext={hasStep("project-context")}
                isResponsive={isResponsive}
                updateField={updateField}
            />
        );
    }

    if (hasStep("need") || hasStep("objective")) {
        return (
            <NeedObjectiveStep
                content={content}
                errors={errors}
                form={form}
                hasNeed={hasStep("need")}
                hasObjective={hasStep("objective")}
                isResponsive={isResponsive}
                updateField={updateField}
            />
        );
    }

    if (hasStep("frame") || hasStep("details")) {
        return (
            <FrameDetailsStep
                content={content}
                form={form}
                hasDetails={hasStep("details")}
                hasFrame={hasStep("frame")}
                isResponsive={isResponsive}
                updateField={updateField}
            />
        );
    }

    if (hasStep("consent")) {
        return (
            <ConsentStep
                content={content}
                error={errors.consent}
                form={form}
                updateField={updateField}
            />
        );
    }

    return (
        <ReviewStep
            form={form}
            labels={labels}
            reviewStepTargets={reviewStepTargets}
            goToStep={goToStep}
        />
    );
}
