import { Badge, Button } from "@/components/ui";
import { getProjectItemStatus } from "@/lib/status-labels";
import { updateProjectItemStatusAction } from "@/server/projects/actions";

/**
 * Ligne actionnable d'un livrable ou d'une tâche bloquante : statut +
 * bascule Terminer/Rouvrir (miroir ProjectAction ↔ ProjectTask géré
 * côté server action).
 */
export function PhaseItemRow({
    itemId,
    kind,
    label,
    projectId,
    status,
}: {
    itemId: string;
    kind: "deliverable" | "action";
    label: string;
    projectId: string;
    status: string;
}) {
    const isDone = status === "DONE";

    return (
        <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--color-surface-interactive)] px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-body-small text-[color:var(--color-text-default)]">
                {label}
            </span>
            <span className="flex shrink-0 items-center gap-2">
                <Badge tone={isDone ? "success" : "neutral"} size="sm">
                    {getProjectItemStatus(status).label}
                </Badge>
                <form action={updateProjectItemStatusAction}>
                    <input type="hidden" name="itemId" value={itemId} />
                    <input type="hidden" name="kind" value={kind} />
                    <input type="hidden" name="projectId" value={projectId} />
                    <input
                        type="hidden"
                        name="status"
                        value={isDone ? "TODO" : "DONE"}
                    />
                    <Button type="submit" variant="ghost" size="sm">
                        {isDone ? "Rouvrir" : "Terminer"}
                    </Button>
                </form>
            </span>
        </li>
    );
}
