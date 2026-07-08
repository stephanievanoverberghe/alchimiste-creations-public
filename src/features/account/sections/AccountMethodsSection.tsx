import { KeyRound, Wand2 } from "lucide-react";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/ui";
import type { StatusBadgeTone } from "@/components/ui";
import type { AccountSecurityContent } from "@/content/auth";

type AccountMethodsSectionProps = {
    content: AccountSecurityContent["methods"];
    hasPassword: boolean;
};

/**
 * Section « comment tu te connectes » : présente les deux méthodes d'accès
 * (lien magique toujours actif, mot de passe optionnel) avec leur état réel
 * sous forme de badge — pour comprendre d'un regard ce qui est en place.
 */
export function AccountMethodsSection({
    content,
    hasPassword,
}: AccountMethodsSectionProps) {
    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-h3 text-[color:var(--color-text-default)]">
                    {content.title}
                </h2>
                <p className="max-w-[60ch] text-body-small text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <MethodCard
                    icon={<Wand2 aria-hidden="true" />}
                    title={content.magicLink.title}
                    statusLabel={content.magicLink.statusLabel}
                    statusTone="success"
                    description={content.magicLink.description}
                />
                <MethodCard
                    icon={<KeyRound aria-hidden="true" />}
                    title={content.password.title}
                    statusLabel={
                        hasPassword
                            ? content.password.statusSet
                            : content.password.statusUnset
                    }
                    statusTone={hasPassword ? "success" : "neutral"}
                    description={
                        hasPassword
                            ? content.password.descriptionSet
                            : content.password.descriptionUnset
                    }
                />
            </div>
        </section>
    );
}

function MethodCard({
    icon,
    title,
    statusLabel,
    statusTone,
    description,
}: {
    icon: ReactNode;
    title: string;
    statusLabel: string;
    statusTone: StatusBadgeTone;
    description: string;
}) {
    return (
        <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] p-5 shadow-elevation-1">
            <div className="flex items-center justify-between gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-raised)] text-[color:var(--color-decor-gold)] [&>svg]:size-4">
                    {icon}
                </span>
                <StatusBadge tone={statusTone} label={statusLabel} size="sm" />
            </div>
            <div className="flex flex-col gap-1.5">
                <h3 className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                    {title}
                </h3>
                <p className="text-body-small text-[color:var(--color-text-muted)]">
                    {description}
                </p>
            </div>
        </div>
    );
}
