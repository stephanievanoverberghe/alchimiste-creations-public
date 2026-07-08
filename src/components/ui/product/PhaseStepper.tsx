import { Check } from "lucide-react";

import { cn } from "@/components/ui/forms/shared";

export type PhaseStepperState = "done" | "current" | "todo";

export type PhaseStepperPhase = {
    key: string;
    /** Libellé de la phase, déjà dans le vocabulaire de l'audience. */
    label: string;
    state: PhaseStepperState;
};

export type PhaseStepperVariant = "admin" | "client";

export type PhaseStepperProps = {
    phases: PhaseStepperPhase[];
    /**
     * admin = dense, toutes les phases visibles ; client = célébrant,
     * coches larges et pourcentage d'avancement.
     */
    variant?: PhaseStepperVariant;
    className?: string;
};

/**
 * Stepper du fil rouge (cascade) — la colonne vertébrale visuelle du
 * projet, côté cockpit comme côté espace client. Défilement horizontal
 * au doigt avec fondu de débordement, phase courante mise en lumière.
 */
export function PhaseStepper({
    className,
    phases,
    variant = "admin",
}: PhaseStepperProps) {
    const doneCount = phases.filter((phase) => phase.state === "done").length;
    const progress = phases.length
        ? Math.round((doneCount / phases.length) * 100)
        : 0;
    const isClient = variant === "client";

    return (
        <div className={cn("min-w-0", className)}>
            {isClient ? (
                <div className="mb-4 flex items-end justify-between gap-4">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Avancement du projet
                    </p>
                    <p className="font-[family-name:var(--font-display)] text-h3 leading-none text-[color:var(--color-text-default)]">
                        {progress}
                        <span className="text-body-small text-[color:var(--color-text-muted)]">
                            {" "}
                            %
                        </span>
                    </p>
                </div>
            ) : null}

            <div className="relative">
                <div
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-[linear-gradient(to_left,var(--color-bg-main),transparent)]"
                    aria-hidden="true"
                />
                <ol
                    className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    aria-label="Phases du projet"
                >
                    {phases.map((phase, index) => {
                        const isDone = phase.state === "done";
                        const isCurrent = phase.state === "current";

                        return (
                            <li
                                key={phase.key}
                                className="min-w-0 shrink-0 snap-start"
                                aria-current={isCurrent ? "step" : undefined}
                            >
                                <div
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-control border px-3 transition-[border-color,background-color,box-shadow] duration-200 ease-standard",
                                        isClient ? "h-14 pr-4" : "h-11",
                                        isCurrent
                                            ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] shadow-[var(--glow-action)]"
                                            : isDone
                                              ? "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]"
                                              : "border-[color:var(--color-border-subtle)] bg-transparent",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "inline-flex shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)]",
                                            isClient
                                                ? "size-7 text-body-small"
                                                : "size-6 text-caption",
                                            isDone
                                                ? "bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]"
                                                : isCurrent
                                                  ? "bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)]"
                                                  : "border border-[color:var(--color-border-strong)] text-[color:var(--color-text-subtle)]",
                                        )}
                                        aria-hidden="true"
                                    >
                                        {isDone ? (
                                            <Check
                                                className={
                                                    isClient
                                                        ? "size-4"
                                                        : "size-3.5"
                                                }
                                                strokeWidth={3}
                                            />
                                        ) : (
                                            index + 1
                                        )}
                                    </span>
                                    <span
                                        className={cn(
                                            "whitespace-nowrap",
                                            isClient
                                                ? "text-body-small"
                                                : "text-label",
                                            isCurrent
                                                ? "font-semibold text-[color:var(--color-action-default)]"
                                                : isDone
                                                  ? "text-[color:var(--color-text-muted)]"
                                                  : "text-[color:var(--color-text-subtle)]",
                                        )}
                                    >
                                        {phase.label}
                                    </span>
                                    {isDone ? (
                                        <span className="sr-only">
                                            (terminée)
                                        </span>
                                    ) : null}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>

            {isClient ? (
                <div
                    className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-interactive)]"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Pourcentage de phases terminées"
                >
                    <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-decor-gold),var(--color-action-default))] transition-[width] duration-300 ease-standard"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            ) : null}
        </div>
    );
}
