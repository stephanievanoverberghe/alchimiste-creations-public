import type { FormEvent } from "react";

import type { ProjectRequestPageContent } from "@/content/project-request";

export type RequestFormState = {
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
    consent: boolean;
    honeypot: string;
};

export type RequestFormErrors = Partial<Record<keyof RequestFormState, string>>;

export type RequestFormLabels = {
    budget: string;
    deadline: string;
    maturity: string;
    projectType: string;
};

export type WizardStepId = ProjectRequestPageContent["wizard"]["steps"][number]["id"];

export type WizardFlowStep = {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    stepIds: WizardStepId[];
};

export type ReviewStepTargets = {
    projectType: number;
    identity: number;
    context: number;
    need: number;
    objective: number;
    frame: number;
    details: number;
};

export type UpdateRequestField = <Field extends keyof RequestFormState>(
    field: Field,
    value: RequestFormState[Field],
) => void;

export type ProjectRequestWizardLayoutProps = {
    activeIndex: number;
    content: ProjectRequestPageContent["wizard"];
    currentStep: WizardFlowStep;
    errors: RequestFormErrors;
    flowSteps: WizardFlowStep[];
    form: RequestFormState;
    goNext: () => void;
    goPrevious: () => void;
    goToStep: (index: number) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    highestUnlockedIndex: number;
    isSubmitting: boolean;
    labels: RequestFormLabels;
    progress: number;
    reviewStepTargets: ReviewStepTargets;
    updateField: UpdateRequestField;
};
