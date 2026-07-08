import { CheckCircle2, CircleDashed } from "lucide-react";

/**
 * Ligne de definition of done : coche verte quand la condition est
 * remplie, cercle pointillé ambre sinon. Le libellé dit toujours l'état
 * réel (« 2 livrables encore ouverts »), jamais une consigne.
 */
export function DodItem({ label, ok }: { label: string; ok: boolean }) {
    return (
        <li className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-interactive)] px-3 py-2">
            {ok ? (
                <CheckCircle2
                    className="size-4 shrink-0 text-[color:var(--color-success-text)]"
                    aria-hidden="true"
                />
            ) : (
                <CircleDashed
                    className="size-4 shrink-0 text-[color:var(--color-warning-text)]"
                    aria-hidden="true"
                />
            )}
            <span className="text-body-small text-[color:var(--color-text-default)]">
                {label}
            </span>
        </li>
    );
}
