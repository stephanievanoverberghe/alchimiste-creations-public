"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Toast } from "@/components/ui";
import type { ProjectRequestPageContent } from "@/content/project-request";

import { ConfirmationPanel } from "./ConfirmationPanel";
import { ProjectRequestMobileWizard } from "./ProjectRequestMobileWizard";
import { ProjectRequestResponsiveWizard } from "./ProjectRequestResponsiveWizard";
import { projectRequestFlowSteps } from "./projectRequestFlowSteps";
import {
    getFlowStepIndex,
    getOptionLabel,
    getProjectRequestErrorMessage,
    getProjectRequestFieldErrors,
    goToFirstFieldError,
    isRecord,
    readProjectRequestResponse,
    scrollToWizard,
} from "./projectRequestWizardHelpers";
import type {
    RequestFormErrors,
    RequestFormLabels,
    RequestFormState,
    ReviewStepTargets,
} from "./projectRequestWizardTypes";
import { useMediaQuery } from "./useMediaQuery";

type ProjectRequestWizardProps = {
    confirmation: ProjectRequestPageContent["confirmation"];
    content: ProjectRequestPageContent["wizard"];
};

const initialFormState: RequestFormState = {
    projectType: "",
    fullName: "",
    email: "",
    projectName: "",
    website: "",
    description: "",
    objective: "",
    maturity: "",
    budget: "",
    deadline: "",
    constraints: "",
    attachmentUrl: "",
    attachmentName: "",
    consent: false,
    honeypot: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProjectRequestWizard({
    confirmation,
    content,
}: ProjectRequestWizardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [highestUnlockedIndex, setHighestUnlockedIndex] = useState(0);
    const [form, setForm] = useState<RequestFormState>(initialFormState);
    const [errors, setErrors] = useState<RequestFormErrors>({});
    const [submitError, setSubmitError] = useState<string>();
    // Clé incrémentée à chaque nouvelle erreur : force le remontage du toast
    // (donc relance son minuteur) même si le message est identique.
    const [submitErrorKey, setSubmitErrorKey] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const showSubmitError = (message: string) => {
        setSubmitError(message);
        setSubmitErrorKey((key) => key + 1);
    };
    const wizardRef = useRef<HTMLDivElement>(null);
    const isWideFlow = useMediaQuery("(min-width: 768px)");

    // Parcours unifié en 6 temps groupés (défini dans projectRequestFlowSteps).
    const flowSteps = projectRequestFlowSteps;

    const activeIndex = Math.min(currentIndex, flowSteps.length - 1);
    const currentStep = flowSteps[activeIndex];
    // Progression = distance parcourue : 0 % à la 1re étape (rien rempli),
    // 100 % sur le récapitulatif (tout est saisi, il reste à envoyer).
    const progress =
        flowSteps.length > 1
            ? (activeIndex / (flowSteps.length - 1)) * 100
            : 0;

    const labels = useMemo<RequestFormLabels>(
        () => ({
            budget: getOptionLabel(content.budgetOptions, form.budget),
            deadline: getOptionLabel(content.deadlineOptions, form.deadline),
            maturity: getOptionLabel(content.maturityOptions, form.maturity),
            projectType: getOptionLabel(content.projectTypes, form.projectType),
        }),
        [
            content.budgetOptions,
            content.deadlineOptions,
            content.maturityOptions,
            content.projectTypes,
            form.budget,
            form.deadline,
            form.maturity,
            form.projectType,
        ],
    );

    const reviewStepTargets = useMemo<ReviewStepTargets>(
        () => ({
            projectType: getFlowStepIndex(flowSteps, "project-type"),
            identity: getFlowStepIndex(flowSteps, "identity"),
            context: getFlowStepIndex(flowSteps, "project-context"),
            need: getFlowStepIndex(flowSteps, "need"),
            objective: getFlowStepIndex(flowSteps, "objective"),
            frame: getFlowStepIndex(flowSteps, "frame"),
            details: getFlowStepIndex(flowSteps, "details"),
        }),
        [flowSteps],
    );

    const updateField = <Field extends keyof RequestFormState>(
        field: Field,
        value: RequestFormState[Field],
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
        setSubmitError(undefined);
        setErrors((current) => {
            if (!current[field]) return current;

            const next = { ...current };
            delete next[field];
            return next;
        });
    };

    const validateCurrentStep = () => {
        const nextErrors: RequestFormErrors = {};
        const stepIds = currentStep.stepIds;

        if (stepIds.includes("project-type") && !form.projectType) {
            nextErrors.projectType = "Choisis une option pour continuer.";
        }

        if (stepIds.includes("identity")) {
            if (!form.fullName.trim()) {
                nextErrors.fullName = "Indique ton nom ou ton prénom.";
            }

            if (!emailPattern.test(form.email.trim())) {
                nextErrors.email = "Indique une adresse e-mail valide.";
            }
        }

        if (stepIds.includes("need") && !form.description.trim()) {
            nextErrors.description = "Explique ton besoin en quelques lignes.";
        }

        if (stepIds.includes("objective")) {
            if (!form.objective.trim()) {
                nextErrors.objective = "Indique l’objectif principal du projet.";
            }

            if (!form.maturity) {
                nextErrors.maturity = "Sélectionne l’état d’avancement le plus proche.";
            }
        }

        if (stepIds.includes("consent") && !form.consent) {
            nextErrors.consent = "Le consentement est nécessaire pour envoyer la demande.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const goToStep = (index: number) => {
        if (index > highestUnlockedIndex) return;

        setCurrentIndex(index);
        setErrors({});
        scrollToWizard(wizardRef.current);
    };

    const goNext = () => {
        if (!validateCurrentStep()) return;

        setCurrentIndex(() => {
            const next = Math.min(activeIndex + 1, flowSteps.length - 1);
            setHighestUnlockedIndex((unlocked) => Math.max(unlocked, next));
            return next;
        });
        scrollToWizard(wizardRef.current);
    };

    const goPrevious = () => {
        setCurrentIndex(Math.max(activeIndex - 1, 0));
        setErrors({});
        scrollToWizard(wizardRef.current);
    };

    // Avance automatique quand un choix suffit à compléter l'étape (façon
    // quiz) : type de projet choisi, ou budget + délai tous deux choisis sur
    // l'étape cadre mobile. Le court délai laisse voir l'état sélectionné.
    const previousFormRef = useRef(form);
    useEffect(() => {
        const previous = previousFormRef.current;
        previousFormRef.current = form;

        const stepIds = currentStep.stepIds;
        const hasChanged = (field: keyof RequestFormState) =>
            previous[field] !== form[field] && Boolean(form[field]);

        const completesProjectType =
            stepIds.length === 1 &&
            stepIds[0] === "project-type" &&
            hasChanged("projectType");

        if (!completesProjectType) return;

        const timeoutId = window.setTimeout(() => {
            goNext();
        }, 350);

        return () => window.clearTimeout(timeoutId);
        // goNext est recréé à chaque rendu : l'effet ne dépend que des saisies.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, currentStep]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        if (!currentStep.stepIds.includes("review")) {
            goNext();
            return;
        }

        if (!validateCurrentStep()) return;

        setIsSubmitting(true);
        setSubmitError(undefined);

        try {
            const response = await fetch("/api/project-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const result = await readProjectRequestResponse(response);
            const isSuccessfulResponse = isRecord(result) && result.ok === true;

            if (!response.ok || !isSuccessfulResponse) {
                const fieldErrors = getProjectRequestFieldErrors(result);

                if (fieldErrors) {
                    setErrors(fieldErrors);
                    goToFirstFieldError(fieldErrors, flowSteps, setCurrentIndex);
                    scrollToWizard(wizardRef.current);
                }

                showSubmitError(
                    getProjectRequestErrorMessage(result) ??
                        "L'envoi n'a pas pu aboutir. Vérifie les informations puis réessaie.",
                );
                return;
            }

            setIsSubmitted(true);
            setHighestUnlockedIndex(flowSteps.length - 1);
            setCurrentIndex(flowSteps.length - 1);
            setErrors({});
        } catch {
            showSubmitError(
                "L'envoi n'a pas pu aboutir. Vérifie ta connexion puis réessaie.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetWizard = () => {
        setForm(initialFormState);
        setCurrentIndex(0);
        setHighestUnlockedIndex(0);
        setErrors({});
        setSubmitError(undefined);
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <ConfirmationPanel
                confirmation={confirmation}
                email={form.email}
                labels={labels}
                onReset={resetWizard}
            />
        );
    }

    const WizardLayout = isWideFlow
        ? ProjectRequestResponsiveWizard
        : ProjectRequestMobileWizard;

    return (
        <>
            {submitError ? (
                <Toast
                    key={submitErrorKey}
                    tone="danger"
                    title="Envoi impossible"
                    placement="top"
                    dismissible
                >
                    {submitError}
                </Toast>
            ) : null}

            <div ref={wizardRef} className="scroll-mt-24 md:scroll-mt-28">
                <WizardLayout
                    activeIndex={activeIndex}
                    content={content}
                    currentStep={currentStep}
                    errors={errors}
                    flowSteps={flowSteps}
                    form={form}
                    goNext={goNext}
                    goPrevious={goPrevious}
                    goToStep={goToStep}
                    handleSubmit={handleSubmit}
                    highestUnlockedIndex={highestUnlockedIndex}
                    isSubmitting={isSubmitting}
                    labels={labels}
                    progress={progress}
                    reviewStepTargets={reviewStepTargets}
                    updateField={updateField}
                />
            </div>
        </>
    );
}

