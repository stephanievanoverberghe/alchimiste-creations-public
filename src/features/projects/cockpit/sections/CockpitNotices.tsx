import { CheckCircle2, CircleAlert } from "lucide-react";

import type { GateBlockedDetails } from "../types";

/**
 * Retour de la génération du fil rouge (après conversion) — succès,
 * structure déjà en place ou playbook introuvable.
 */
export function GenerationNotice({ status }: { status: string }) {
    const isSuccess = status === "generated";
    const message = isSuccess
        ? "Fil rouge généré : le projet est prêt à être piloté."
        : status === "already-generated"
          ? "La structure existait déjà : rien n’a été régénéré."
          : status === "missing-template"
            ? "Aucun playbook trouvé pour ce type de projet — structure non générée."
            : null;

    if (!message) return null;

    return (
        <p
            className={`flex items-start gap-2 rounded-2xl border p-4 text-body-small ${
                isSuccess
                    ? "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]"
                    : "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[color:var(--color-warning-text)]"
            }`}
        >
            {isSuccess ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            ) : (
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            )}
            {message}
        </p>
    );
}

/**
 * Résultat d'une tentative de validation de gate : validé, refusé
 * (avec le détail chiffré de ce qui manque) ou déjà validé.
 */
export function GateNotice({
    details,
    status,
}: {
    details: GateBlockedDetails | null;
    status: string;
}) {
    if (status === "validated") {
        return (
            <p className="flex items-start gap-2 rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-4 text-body-small text-[color:var(--color-success-text)]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Gate validé. Le fil rouge avance.
            </p>
        );
    }

    if (status === "blocked" && details) {
        const reasons = [
            details.openDeliverables
                ? `${details.openDeliverables} livrable(s) ouvert(s)`
                : null,
            details.openBlockingActions
                ? `${details.openBlockingActions} tâche(s) bloquante(s)`
                : null,
            details.blockerActive ? "un blocage projet actif" : null,
        ].filter(Boolean);

        return (
            <p className="flex items-start gap-2 rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-body-small text-[color:var(--color-warning-text)]">
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Gate refusé : il reste {reasons.join(", ")}.
            </p>
        );
    }

    if (status === "already-validated") {
        return (
            <p className="flex items-start gap-2 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4 text-body-small text-[color:var(--color-text-muted)]">
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Ce gate était déjà validé.
            </p>
        );
    }

    return null;
}
