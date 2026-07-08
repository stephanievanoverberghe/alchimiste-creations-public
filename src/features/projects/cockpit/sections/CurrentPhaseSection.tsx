import { PhaseItemRow } from "../components/PhaseItemRow";
import type { CockpitPhase } from "../types";

/**
 * Le travail de la phase courante : livrables à produire et tâches
 * bloquantes, actionnables directement (Terminer / Rouvrir).
 */
export function CurrentPhaseSection({
    phase,
    projectId,
}: {
    phase: CockpitPhase;
    projectId: string;
}) {
    const blockingActions = phase.actions.filter((action) => action.isBlocking);

    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                Phase courante : {phase.name}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                    <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                        Livrables à produire
                    </p>
                    <ul className="mt-2 grid gap-1.5">
                        {phase.deliverables.length ? (
                            phase.deliverables.map((deliverable) => (
                                <PhaseItemRow
                                    key={deliverable.id}
                                    itemId={deliverable.id}
                                    kind="deliverable"
                                    label={deliverable.name}
                                    projectId={projectId}
                                    status={deliverable.status}
                                />
                            ))
                        ) : (
                            <li className="text-body-small text-[color:var(--color-text-muted)]">
                                Aucun livrable sur cette phase.
                            </li>
                        )}
                    </ul>
                </div>
                <div>
                    <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                        Tâches bloquantes
                    </p>
                    <ul className="mt-2 grid gap-1.5">
                        {blockingActions.length ? (
                            blockingActions.map((action) => (
                                <PhaseItemRow
                                    key={action.id}
                                    itemId={action.id}
                                    kind="action"
                                    label={action.title}
                                    projectId={projectId}
                                    status={action.status}
                                />
                            ))
                        ) : (
                            <li className="text-body-small text-[color:var(--color-text-muted)]">
                                Aucune tâche bloquante sur cette phase.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
}
