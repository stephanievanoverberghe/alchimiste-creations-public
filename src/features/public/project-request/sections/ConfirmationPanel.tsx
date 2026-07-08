import { Check, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui";
import { publicRoutes } from "@/config/navigation";
import type { ProjectRequestPageContent } from "@/content/project-request";

import type { RequestFormLabels } from "./projectRequestWizardTypes";

/**
 * Écran de confirmation affiché après un envoi réussi : accusé de réception,
 * suite prévue (type + e-mail + prochaines étapes) et relance vers une
 * nouvelle demande ou l'accueil.
 */
export function ConfirmationPanel({
    confirmation,
    email,
    labels,
    onReset,
}: {
    confirmation: ProjectRequestPageContent["confirmation"];
    email: string;
    labels: RequestFormLabels;
    onReset: () => void;
}) {
    return (
        <article className="relative isolate overflow-hidden rounded-[1.75rem] border border-[color:var(--color-decor-gold)]/45 bg-[linear-gradient(180deg,var(--color-surface-default),var(--color-bg-deep))] p-6 shadow-elevation-3 md:p-8">
            <span
                className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)]"
                aria-hidden="true"
            />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.68fr)] lg:items-start">
                <div className="anim-rise flex flex-col gap-5">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)] shadow-[var(--glow-action)]">
                        <CheckCircle2 className="size-6" aria-hidden="true" />
                    </span>

                    <div className="flex flex-col gap-2">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {confirmation.eyebrow}
                        </span>
                        <h2 className="text-balance">{confirmation.title}</h2>
                        <p className="text-body text-[color:var(--color-text-muted)]">
                            {confirmation.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            variant="primary"
                            className="shadow-[var(--glow-action)]"
                            onClick={onReset}
                        >
                            Faire une autre demande
                        </Button>
                        <Button href={publicRoutes.home} variant="secondary">
                            Retour à l&apos;accueil
                        </Button>
                    </div>
                </div>

                <aside className="rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 shadow-elevation-1">
                    <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                        Suite prévue
                    </span>

                    <dl className="mt-4 grid gap-3 border-b border-[color:var(--color-border-subtle)] pb-4">
                        <div>
                            <dt className="text-caption uppercase tracking-[0.02em] text-[color:var(--color-text-subtle)]">
                                Type transmis
                            </dt>
                            <dd className="mt-1 text-body-small font-medium text-[color:var(--color-text-default)]">
                                {labels.projectType || "À confirmer"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-caption uppercase tracking-[0.02em] text-[color:var(--color-text-subtle)]">
                                E-mail associé
                            </dt>
                            <dd className="mt-1 break-words text-body-small font-medium text-[color:var(--color-text-default)]">
                                {email}
                            </dd>
                        </div>
                    </dl>

                    <ul className="mt-4 grid gap-3">
                        {confirmation.nextSteps.map((step) => (
                            <li
                                key={step}
                                className="flex items-start gap-3 text-body-small text-[color:var(--color-text-muted)]"
                            >
                                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                                    <Check className="size-3.5" aria-hidden="true" />
                                </span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </article>
    );
}
