import { StatusBadge } from "@/components/ui";
import type { AccountSecurityContent } from "@/content/auth";
import { formatDateTime } from "@/lib/formatters";
import type { getAccountSecurity } from "@/server/auth/security";

type AccountSnapshotProps = {
    account: Awaited<ReturnType<typeof getAccountSecurity>>;
    content: AccountSecurityContent["snapshot"];
};

/**
 * Carte d'identité du compte, affichée sous l'en-tête : e-mail, type d'accès
 * (rôle traduit, jamais l'enum brut) et dernière connexion, avec un badge
 * d'état lisible. Répond d'un coup d'œil à « de quel compte s'agit-il ».
 */
export function AccountSnapshot({ account, content }: AccountSnapshotProps) {
    const roleValue = account.role
        ? content.roleLabels[account.role] ?? account.role
        : content.roleFallback;

    return (
        <div className="flex flex-col gap-5 border-t border-[color:var(--color-border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <dl className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <SnapshotItem label={content.accountLabel} value={account.email} />
                <SnapshotItem label={content.accessLabel} value={roleValue} />
                <SnapshotItem
                    label={content.lastLoginLabel}
                    value={formatDateTime(
                        account.lastLoginAt,
                        content.lastLoginFallback,
                    )}
                />
            </dl>
            <StatusBadge
                tone="success"
                label={content.statusLabel}
                pulse
                className="w-fit shrink-0"
            />
        </div>
    );
}

function SnapshotItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex min-w-0 flex-col gap-1">
            <dt className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                {label}
            </dt>
            <dd className="min-w-0 break-words text-body-small text-[color:var(--color-text-default)]">
                {value}
            </dd>
        </div>
    );
}
