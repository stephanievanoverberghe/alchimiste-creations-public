import { Flag, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui";
import {
    closePhaseAction,
    validateProjectGateAction,
} from "@/server/projects/actions";

import { DodItem } from "../components/DodItem";
import type { CockpitPhase, CockpitProject } from "../types";

/**
 * L'avancée de la cascade : gate suivant à valider, ou fermeture
 * directe pour une phase sans gate requis (ex. module optionnel).
 * Même DoD vérifiée serveur dans les deux cas — le bouton reste
 * désactivé tant qu'elle n'est pas complète.
 */
export function PhaseGateSection({
    nextGate,
    phase,
    project,
}: {
    nextGate: CockpitProject["nextGate"];
    phase: CockpitPhase;
    project: CockpitProject;
}) {
    const dod = phase.dod;
    const hasGate = Boolean(nextGate);

    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    {hasGate ? "Gate suivant" : "Fin de phase"}
                </p>
                {hasGate ? (
                    <Flag
                        className="size-4 text-[color:var(--color-action-default)]"
                        aria-hidden="true"
                    />
                ) : null}
            </div>
            <p className="mt-3 text-body text-[color:var(--color-text-default)]">
                {hasGate
                    ? nextGate?.title
                    : `« ${phase.name} » n’a pas de validation requise : termine ses éléments puis clôture-la directement.`}
            </p>
            <ul className="mt-4 grid gap-2">
                <DodItem
                    ok={dod.openDeliverables.length === 0}
                    label={
                        dod.openDeliverables.length === 0
                            ? "Tous les livrables de la phase sont terminés"
                            : `${dod.openDeliverables.length} livrable(s) encore ouvert(s)`
                    }
                />
                <DodItem
                    ok={dod.openBlockingActions.length === 0}
                    label={
                        dod.openBlockingActions.length === 0
                            ? "Aucune tâche bloquante ouverte"
                            : `${dod.openBlockingActions.length} tâche(s) bloquante(s) ouverte(s)`
                    }
                />
                <DodItem
                    ok={!project.hasActiveBlocker}
                    label={
                        project.hasActiveBlocker
                            ? "Un blocage projet est actif"
                            : "Aucun blocage projet actif"
                    }
                />
            </ul>
            <form
                action={hasGate ? validateProjectGateAction : closePhaseAction}
                className="mt-4"
            >
                {hasGate ? (
                    <input type="hidden" name="gateId" value={nextGate?.id} />
                ) : (
                    <input type="hidden" name="phaseId" value={phase.id} />
                )}
                <input type="hidden" name="projectId" value={project.id} />
                <Button
                    type="submit"
                    variant="solid"
                    tone={dod.readyToClose ? "success" : "neutral"}
                    disabled={!dod.readyToClose}
                    iconLeft={
                        <ShieldCheck className="size-4" aria-hidden="true" />
                    }
                >
                    {hasGate ? "Valider le gate" : "Terminer la phase"}
                </Button>
                {!dod.readyToClose ? (
                    <p className="mt-3 text-caption text-[color:var(--color-text-subtle)]">
                        Le gate se débloquera quand la definition of done
                        ci-dessus sera complète.
                    </p>
                ) : null}
            </form>
        </section>
    );
}
