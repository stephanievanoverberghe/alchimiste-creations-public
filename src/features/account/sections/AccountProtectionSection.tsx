import { Link2, Lock, MonitorCheck, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

import type {
    AccountProtectionIcon,
    AccountSecurityContent,
} from "@/content/auth";

type AccountProtectionSectionProps = {
    content: AccountSecurityContent["protection"];
};

/** Icônes des garanties de sécurité (contenu sérialisable). */
const protectionIcons: Record<
    AccountProtectionIcon,
    ComponentType<{ className?: string }>
> = {
    invitation: ShieldCheck,
    link: Link2,
    lock: Lock,
    session: MonitorCheck,
};

/**
 * Bande compacte des garanties de sécurité (accès sur invitation, lien à
 * usage unique, chiffrement, session privée) : une seule ligne de
 * réassurance, sans occuper toute la page.
 */
export function AccountProtectionSection({
    content,
}: AccountProtectionSectionProps) {
    return (
        <section className="flex flex-col gap-3">
            <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                {content.eyebrow}
            </p>
            <ul className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3 md:px-5">
                {content.points.map((point) => {
                    const Icon = protectionIcons[point.icon];

                    return (
                        <li
                            key={point.label}
                            className="flex items-center gap-2.5 text-body-small text-[color:var(--color-text-default)]"
                        >
                            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-raised)] text-[color:var(--color-decor-gold)] [&>svg]:size-3.5">
                                <Icon />
                            </span>
                            {point.label}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
