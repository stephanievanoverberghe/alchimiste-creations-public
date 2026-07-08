import {
    ArrowLeft,
    Check,
    CheckCircle2,
    ChevronRight,
    LockKeyhole,
} from "lucide-react";

import { Button } from "@/components/ui";

import { ProjectRequestStepContent } from "./ProjectRequestStepContent";
import type { ProjectRequestWizardLayoutProps } from "./projectRequestWizardTypes";

/**
 * Shell tablette/desktop du wizard — design éditorial ouvert : liseré doré,
 * question en grande typo display, champs aérés sur le fond. À 1280 px, un
 * rail typographique collant (fait / en cours / verrouillé) accompagne la
 * lecture ; à 768 px, la progression reste en tête. « Retour » n'apparaît
 * qu'à partir de la 2ᵉ étape (friction F0 #6).
 */
export function ProjectRequestResponsiveWizard({
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
    highestUnlockedIndex,
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
            className="relative border-t-2 border-[color:var(--color-decor-gold)]/50 pt-8 md:pt-10"
            onSubmit={handleSubmit}
            noValidate
        >
            <HoneypotField form={form} updateField={updateField} />

            <div className="grid gap-8 lg:grid-cols-[minmax(230px,0.3fr)_minmax(0,1fr)] lg:gap-14">
                <aside>
                    <div className="grid gap-4 lg:hidden">
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
                    </div>

                    <nav
                        className="hidden lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-6"
                        aria-label="Étapes de la demande"
                    >
                        <div className="grid gap-3">
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
                        </div>

                        <ol className="grid gap-0.5">
                            {flowSteps.map((step, index) => (
                                <li key={step.id}>
                                    <StepRailButton
                                        index={index}
                                        isActive={index === activeIndex}
                                        isDone={index < highestUnlockedIndex}
                                        isUnlocked={index <= highestUnlockedIndex}
                                        stepTitle={step.title}
                                        onClick={() => goToStep(index)}
                                    />
                                </li>
                            ))}
                        </ol>
                    </nav>
                </aside>

                <div className="flex min-w-0 flex-col gap-7 lg:min-h-[560px] lg:max-w-[860px]">
                    <header className="flex flex-col gap-2">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {currentStep.eyebrow}
                        </span>
                        <h2 className="max-w-[24ch] text-balance font-[family-name:var(--font-display)] text-[clamp(1.7rem,2.6vw,2.5rem)] leading-[1.15] tracking-[-0.01em] text-[color:var(--color-text-default)]">
                            {currentStep.title}
                        </h2>
                        <p className="max-w-[640px] text-body text-[color:var(--color-text-muted)]">
                            {currentStep.description}
                        </p>
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
                            variant="responsive"
                        />
                    </div>

                    <footer className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--color-border-subtle)] pt-5">
                        {isFirstStep ? (
                            <span aria-hidden="true" />
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                                onClick={goPrevious}
                                disabled={isSubmitting}
                                className="w-fit"
                            >
                                Retour
                            </Button>
                        )}

                        {isReviewStep ? (
                            <Button
                                key="project-request-submit"
                                type="submit"
                                variant="primary"
                                iconRight={<CheckCircle2 className="size-4" aria-hidden="true" />}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                className="w-fit shadow-[var(--glow-action)]"
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
                                className="w-fit shadow-[var(--glow-action)]"
                            >
                                Continuer
                            </Button>
                        )}
                    </footer>
                </div>
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
            <label htmlFor="project-request-company">Entreprise</label>
            <input
                id="project-request-company"
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

/**
 * Entrée du rail d'étapes desktop : typographique (numéro fin + titre),
 * l'étape courante est marquée d'un liseré doré, les étapes faites d'une
 * coche, les étapes verrouillées restent visibles mais inertes.
 */
function StepRailButton({
    index,
    isActive,
    isDone,
    isUnlocked,
    onClick,
    stepTitle,
}: {
    index: number;
    isActive: boolean;
    isDone: boolean;
    isUnlocked: boolean;
    onClick: () => void;
    stepTitle: string;
}) {
    return (
        <button
            type="button"
            className={`focus-ring grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-card border-l-2 py-2.5 pl-3 pr-2 text-left transition-[border-color,color,background-color] duration-200 ease-standard ${
                isActive
                    ? "border-[color:var(--color-decor-gold)] bg-[var(--color-surface-default)]"
                    : !isUnlocked
                        ? "cursor-not-allowed border-transparent opacity-40"
                        : "border-transparent hover:border-[color:var(--color-decor-gold)]/45 hover:bg-[var(--color-surface-default)]"
            }`}
            disabled={!isUnlocked}
            aria-current={isActive ? "step" : undefined}
            onClick={onClick}
        >
            <span
                className={`w-6 text-caption font-semibold tabular-nums ${
                    isActive
                        ? "text-[color:var(--color-decor-gold)]"
                        : "text-[color:var(--color-text-subtle)]"
                }`}
                aria-hidden="true"
            >
                {isDone ? (
                    <Check className="size-4 text-[color:var(--color-decor-gold)]" />
                ) : (
                    String(index + 1).padStart(2, "0")
                )}
            </span>
            <span
                className={`min-w-0 truncate text-body-small ${
                    isActive
                        ? "font-semibold text-[color:var(--color-text-default)]"
                        : "font-medium text-[color:var(--color-text-muted)]"
                }`}
            >
                {stepTitle}
            </span>
            {!isUnlocked ? (
                <LockKeyhole
                    className="size-3.5 shrink-0 text-[color:var(--color-text-subtle)]"
                    aria-hidden="true"
                />
            ) : null}
        </button>
    );
}
