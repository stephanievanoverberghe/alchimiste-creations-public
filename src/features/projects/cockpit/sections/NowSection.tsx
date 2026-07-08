import { Badge } from "@/components/ui";

import type { CockpitProject } from "../types";

/**
 * La zone « Maintenant » (Scrum) : prochaine action, charge des deux
 * côtés (moi / client) et retouches demandées avec le commentaire
 * client verbatim — c'est la boussole de la journée.
 */
export function NowSection({ project }: { project: CockpitProject }) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                Maintenant
            </p>
            <p className="mt-3 text-body text-[color:var(--color-text-default)]">
                {project.nextAction ?? "Aucune prochaine action définie."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                {project.hasActiveBlocker ? (
                    <Badge tone="warning">Blocage actif</Badge>
                ) : null}
                <Badge tone="info">
                    Moi : {project.openTasks.length} tâche(s) en cours
                </Badge>
                <Badge
                    tone={
                        project.pendingClientValidations.length
                            ? "warning"
                            : "neutral"
                    }
                >
                    Client : {project.pendingClientValidations.length}{" "}
                    validation(s) attendue(s)
                </Badge>
                {project.changesRequested.length ? (
                    <Badge tone="warning">
                        {project.changesRequested.length} retouche(s)
                        demandée(s)
                    </Badge>
                ) : null}
            </div>
            {project.changesRequested.length ? (
                <ul className="mt-4 grid gap-2">
                    {project.changesRequested.map((validation) => (
                        <li
                            key={validation.id}
                            className="rounded-xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-3"
                        >
                            <p className="text-body-small text-[color:var(--color-warning-text)]">
                                Retouche demandée : {validation.title}
                            </p>
                            {validation.responseComment ? (
                                <p className="mt-1 text-caption text-[color:var(--color-warning-text)]">
                                    « {validation.responseComment} »
                                </p>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : null}
        </section>
    );
}
