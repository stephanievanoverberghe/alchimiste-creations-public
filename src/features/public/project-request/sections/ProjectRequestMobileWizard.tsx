import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui";

import { ProjectRequestStepContent } from "./ProjectRequestStepContent";
import type { ProjectRequestWizardLayoutProps } from "./projectRequestWizardTypes";

/**
 * Shell mobile du wizard — design éditorial ouvert : plus de boîte, le
 * formulaire vit sur le fond avec un liseré doré, une question en display et
 * une barre d'action **collante en bas** (« Continuer » au pouce, friction
 * F0 #6). « Retour » n'apparaît qu'à partir de la 2ᵉ étape. Le contenu est
 * re-monté à chaque étape (`key`) pour rejouer l'animation d'entrée.
 */
export function ProjectRequestMobileWizard({
    activeIndex,
    content,
    currentStep,
    errors,
    flowSteps,
    form,
    goNext,
    goPrevious,
    goToStep,
    handleSubmit,
    isSubmitting,
    labels,
    progress,
    reviewStepTargets,
    updateField,
}: ProjectRequestWizardLayoutProps) {
    const isFirstStep = activeIndex === 0;
    const isReviewStep = currentStep.stepIds.includes("review");

    return (
        <form
            className="relative border-t-2 border-[color:var(--color-decor-gold)]/50 pt-6"
            onSubmit={handleSubmit}
            noValidate
        >
            <HoneypotField form={form} updateField={updateField} />

            <div className="flex flex-col gap-6">
                <header className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                            Étape{" "}
                            <span className="text-[color:var(--color-decor-gold)]">
                                {activeIndex + 1}
                            </span>{" "}
                            / {flowSteps.length}
                        </span>
                        <span className="text-caption font-medium text-[color:var(--color-text-subtle)]">
                            {Math.round(progress)} %
                        </span>
                    </div>

                    <ProgressBar progress={progress} />

                    <div className="grid gap-1.5 pt-1">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {currentStep.eyebrow}
                        </span>
                        <h2 className="text-balance font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                            {currentStep.title}
                        </h2>
                    </div>
                </header>

                <div key={currentStep.id} className="anim-rise flex flex-1 flex-col">
                    <ProjectRequestStepContent
                        content={content}
                        errors={errors}
                        form={form}
                        labels={labels}
                        reviewStepTargets={reviewStepTargets}
                        stepIds={currentStep.stepIds}
                        updateField={updateField}
                        goToStep={goToStep}
                        variant="mobile"
                    />
                </div>

                <footer className="sticky bottom-0 z-20 -mx-5 mt-1 grid gap-1 border-t border-[color:var(--color-border-subtle)] bg-[color-mix(in_oklab,var(--color-bg-main)_88%,transparent)] px-5 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-3 backdrop-blur-md">
                    {isReviewStep ? (
                        <Button
                            key="project-request-submit"
                            type="submit"
                            variant="primary"
                            iconRight={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="w-full shadow-[var(--glow-action)]"
                        >
                            {isSubmitting ? "Envoi en cours" : "Valider et envoyer"}
                        </Button>
                    ) : (
                        <Button
                            key="project-request-next"
                            type="button"
                            variant="primary"
                            iconRight={<ChevronRight className="size-4" aria-hidden="true" />}
                            onClick={(event) => {
                                event.preventDefault();
                                goNext();
                            }}
                            disabled={isSubmitting}
                            className="w-full shadow-[var(--glow-action)]"
                        >
                            Continuer
                        </Button>
                    )}

                    {!isFirstStep ? (
                        <Button
                            type="button"
                            variant="ghost"
                            iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                            onClick={goPrevious}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            Revenir à l&apos;étape précédente
                        </Button>
                    ) : null}
                </footer>
            </div>
        </form>
    );
}

function HoneypotField({
    form,
    updateField,
}: Pick<ProjectRequestWizardLayoutProps, "form" | "updateField">) {
    return (
        <div
            className="pointer-events-none absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
        >
            <label htmlFor="project-request-company-mobile">Entreprise</label>
            <input
                id="project-request-company-mobile"
                name="companyName"
                type="text"
                value={form.honeypot}
                tabIndex={-1}
                autoComplete="off"
                onChange={(event) => updateField("honeypot", event.target.value)}
            />
        </div>
    );
}

function ProgressBar({ progress }: { progress: number }) {
    return (
        <div
            className="h-1 overflow-hidden rounded-full bg-[rgba(255,243,224,0.08)]"
            role="progressbar"
            aria-label="Progression de la demande"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-decor-gold),var(--color-action-default))] transition-[width] duration-300 ease-standard"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
