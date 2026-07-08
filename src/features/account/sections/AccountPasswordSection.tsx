import { Check, Sparkles } from "lucide-react";

import type { AccountSecurityContent } from "@/content/auth";
import { AccountPasswordForm } from "@/features/account/sections/AccountPasswordForm";

type AccountPasswordSectionProps = {
    content: AccountSecurityContent["password"];
    hasPassword: boolean;
};

/**
 * Section de gestion du mot de passe optionnel : titre et discours adaptés
 * selon qu'un mot de passe existe déjà, invitation douce à en définir un
 * quand il manque, puis les règles (visibles) à gauche et le formulaire à
 * droite sur grand écran.
 */
export function AccountPasswordSection({
    content,
    hasPassword,
}: AccountPasswordSectionProps) {
    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-h3 text-[color:var(--color-text-default)]">
                    {hasPassword ? content.titleSet : content.titleUnset}
                </h2>
                <p className="max-w-[60ch] text-body-small text-[color:var(--color-text-muted)]">
                    {hasPassword
                        ? content.descriptionSet
                        : content.descriptionUnset}
                </p>
            </div>

            {hasPassword ? null : (
                <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] bg-[image:var(--gradient-hero)] p-4 md:p-5">
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-raised)] text-[color:var(--color-decor-gold)] [&>svg]:size-4">
                        <Sparkles aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-1">
                        <p className="text-body font-semibold text-[color:var(--color-text-default)]">
                            {content.nudgeTitle}
                        </p>
                        <p className="text-body-small text-[color:var(--color-text-muted)]">
                            {content.nudgeDescription}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
                <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-raised)] p-5 md:p-6">
                    <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                        {content.requirementsLabel}
                    </p>
                    <ul className="flex flex-col gap-2.5">
                        {content.requirements.map((requirement) => (
                            <li
                                key={requirement}
                                className="flex items-center gap-2.5 text-body-small text-[color:var(--color-text-muted)]"
                            >
                                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-action-subtle)] text-[color:var(--color-action-default)] [&>svg]:size-3">
                                    <Check aria-hidden="true" />
                                </span>
                                {requirement}
                            </li>
                        ))}
                    </ul>
                </div>

                <AccountPasswordForm content={content} hasPassword={hasPassword} />
            </div>
        </section>
    );
}
