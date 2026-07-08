import type {
    RequestFormErrors,
    RequestFormState,
    WizardFlowStep,
    WizardStepId,
} from "./projectRequestWizardTypes";

/** Libellé d'une option à partir de sa valeur (chaîne vide si absente). */
export function getOptionLabel(
    options: readonly { label: string; value: string }[],
    value: string,
) {
    return options.find((option) => option.value === value)?.label ?? "";
}

/** Index de l'étape du parcours qui contient un `stepId` donné. */
export function getFlowStepIndex(
    flowSteps: WizardFlowStep[],
    stepId: WizardStepId,
) {
    const index = flowSteps.findIndex((step) => step.stepIds.includes(stepId));
    return Math.max(index, 0);
}

/** Parse la réponse JSON de l'API sans jeter en cas de corps illisible. */
export async function readProjectRequestResponse(response: Response) {
    try {
        return (await response.json()) as unknown;
    } catch {
        return null;
    }
}

/** Message d'erreur global renvoyé par l'API, s'il existe. */
export function getProjectRequestErrorMessage(result: unknown) {
    if (!isRecord(result) || typeof result.message !== "string") return undefined;

    return result.message;
}

/** Erreurs par champ renvoyées par l'API, filtrées aux champs connus. */
export function getProjectRequestFieldErrors(result: unknown) {
    if (!isRecord(result) || !isRecord(result.fieldErrors)) return undefined;

    const fieldErrors: RequestFormErrors = {};

    for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (typeof message === "string" && isRequestFormField(field)) {
            fieldErrors[field] = message;
        }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

/** Ramène le wizard sur l'étape du premier champ en erreur (ordre du formulaire). */
export function goToFirstFieldError(
    fieldErrors: RequestFormErrors,
    flowSteps: WizardFlowStep[],
    setCurrentIndex: (index: number) => void,
) {
    const fieldOrder: Array<keyof RequestFormState> = [
        "projectType",
        "fullName",
        "email",
        "projectName",
        "website",
        "description",
        "objective",
        "maturity",
        "budget",
        "deadline",
        "constraints",
        "consent",
    ];
    const fieldStepMap: Partial<Record<keyof RequestFormState, WizardStepId>> = {
        projectType: "project-type",
        fullName: "identity",
        email: "identity",
        projectName: "project-context",
        website: "project-context",
        description: "need",
        objective: "objective",
        maturity: "objective",
        budget: "frame",
        deadline: "frame",
        constraints: "details",
        consent: "consent",
    };
    const firstField = fieldOrder.find((field) => Boolean(fieldErrors[field]));
    const targetStep = firstField ? fieldStepMap[firstField] : undefined;

    if (!targetStep) return;

    setCurrentIndex(getFlowStepIndex(flowSteps, targetStep));
}

function isRequestFormField(field: string): field is keyof RequestFormState {
    return [
        "projectType",
        "fullName",
        "email",
        "projectName",
        "website",
        "description",
        "objective",
        "maturity",
        "budget",
        "deadline",
        "constraints",
        "consent",
        "honeypot",
    ].includes(field);
}

/** Garde de type : l'inconnu est un objet simple (record). */
export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Fait défiler jusqu'au wizard (respecte `prefers-reduced-motion`). */
export function scrollToWizard(element: HTMLDivElement | null) {
    if (!element) return;

    window.requestAnimationFrame(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        element.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
        });
    });
}
