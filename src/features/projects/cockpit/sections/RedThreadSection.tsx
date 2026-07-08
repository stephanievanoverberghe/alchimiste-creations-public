import { CheckCircle2 } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import { getProjectItemStatus, getProjectStatusForAdmin } from "@/lib/status-labels";

import type { CockpitProject } from "../types";

/**
 * Le fil rouge (cascade) : stepper horizontal des phases avec la phase
 * courante en évidence. Sans phases, propose d'appliquer le playbook —
 * la génération reste une action explicite, jamais automatique.
 */
export function RedThreadSection({ project }: { project: CockpitProject }) {
    const currentPhase = project.currentPhase;

    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Fil rouge
                </p>
                <Badge tone={project.hasActiveBlocker ? "warning" : "info"}>
                    {getProjectStatusForAdmin(project.status).label}
                </Badge>
            </div>
            {project.phases.length ? (
                <ol className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {project.phases.map((phase, index) => {
                        const isCurrent = currentPhase?.id === phase.id;
                        const isDone = phase.status === "DONE";

                        return (
                            <li
                                key={phase.id}
                                className={`flex min-w-[180px] shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2.5 ${
                                    isCurrent
                                        ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)]"
                                        : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)]"
                                }`}
                                aria-current={isCurrent ? "step" : undefined}
                            >
                                <span
                                    className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-caption ${
                                        isDone
                                            ? "bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]"
                                            : isCurrent
                                              ? "bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)]"
                                              : "bg-[var(--color-surface-default)] text-[color:var(--color-text-subtle)]"
                                    }`}
                                >
                                    {isDone ? (
                                        <CheckCircle2
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        index + 1
                                    )}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-label text-[color:var(--color-text-default)]">
                                        {phase.name}
                                    </span>
                                    <span className="block text-caption text-[color:var(--color-text-muted)]">
                                        {getProjectItemStatus(phase.status).label}
                                    </span>
                                </span>
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <div className="mt-4 rounded-xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4">
                    <p className="text-body-small text-[color:var(--color-warning-text)]">
                        Aucune phase générée : le playbook n’a pas encore été
                        appliqué à ce projet.
                    </p>
                    <Button
                        href={`/admin/demandes/${project.opportunity.id}/convertir`}
                        variant="secondary"
                        size="sm"
                        className="mt-3"
                    >
                        Appliquer le playbook
                    </Button>
                </div>
            )}
        </section>
    );
}
