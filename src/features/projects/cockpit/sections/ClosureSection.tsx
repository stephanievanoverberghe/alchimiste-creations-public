import { Badge, Button } from "@/components/ui";
import { getFinancialStatus } from "@/lib/status-labels";
import { createComposedDocumentAction } from "@/server/documents/actions";
import { closeProjectAction } from "@/server/projects/actions";

import { DodItem } from "../components/DodItem";
import type { CockpitProject } from "../types";

/**
 * Carte de clôture, affichée quand toutes les phases sont terminées :
 * solde (informatif, ne bloque pas), RETEX obligatoire (c'est lui qui
 * améliore le playbook), puis clôture qui remercie le client et
 * l'invite à laisser un avis.
 */
export function ClosureSection({ project }: { project: CockpitProject }) {
    const isClosed = project.status === "CLOTURE";
    const hasRetex = project.realDocuments.length > 0;
    const balance = project.financialDocuments[0] ?? null;
    const balancePaid = balance?.status === "PAID";

    return (
        <section className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    {isClosed ? "Projet clôturé 🎉" : "Clôture du projet"}
                </p>
                <Badge tone={isClosed ? "success" : "info"}>
                    {isClosed ? "Terminé" : "Livré — à clôturer"}
                </Badge>
            </div>
            {!isClosed ? (
                <p className="mt-2 max-w-[640px] text-body-small text-[color:var(--color-text-muted)]">
                    Toutes les phases sont terminées. Dernière ligne droite :
                    le RETEX (obligatoire — c’est lui qui améliore le
                    playbook), le solde, puis la clôture qui remercie le client
                    et l’invite à laisser un avis.
                </p>
            ) : null}
            <ul className="mt-4 grid gap-2">
                <DodItem
                    ok={balancePaid}
                    label={
                        balance
                            ? balancePaid
                                ? `Solde encaissé (${balance.reference})`
                                : `Solde ${getFinancialStatus(balance.status).label.toLowerCase()} (${balance.reference})`
                            : "Solde non référencé"
                    }
                />
                <DodItem
                    ok={hasRetex}
                    label={hasRetex ? "RETEX rédigé" : "RETEX à rédiger"}
                />
            </ul>
            {!isClosed ? (
                <div className="mt-4 flex flex-wrap gap-3">
                    {!hasRetex ? (
                        <form action={createComposedDocumentAction}>
                            <input
                                type="hidden"
                                name="projectId"
                                value={project.id}
                            />
                            <input type="hidden" name="modelKey" value="retex" />
                            <Button type="submit" variant="secondary" size="sm">
                                Créer le RETEX (pré-rempli)
                            </Button>
                        </form>
                    ) : null}
                    <form action={closeProjectAction}>
                        <input
                            type="hidden"
                            name="projectId"
                            value={project.id}
                        />
                        <Button
                            type="submit"
                            variant="solid"
                            tone={hasRetex ? "success" : "neutral"}
                            disabled={!hasRetex}
                            size="sm"
                        >
                            Clôturer et remercier le client
                        </Button>
                    </form>
                </div>
            ) : (
                <p className="mt-4 text-body-small text-[color:var(--color-text-muted)]">
                    Le client a été remercié (avec l’invitation à laisser un
                    avis). La suite recommandée pour ce client est dans le
                    RETEX.
                </p>
            )}
            {!isClosed && !balancePaid ? (
                <p className="mt-3 text-caption text-[color:var(--color-text-subtle)]">
                    Le solde ne bloque pas la clôture, mais pense à l’émettre
                    dans ton outil de facturation (suivi dans /admin/finance).
                </p>
            ) : null}
        </section>
    );
}
