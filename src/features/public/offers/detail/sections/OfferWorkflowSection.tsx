import { Section } from "@/components/layout";
import type { OfferDetailPageContent } from "@/content/offers";

type OfferWorkflowSectionProps = {
    content: OfferDetailPageContent;
};

/**
 * Le déroulé réel : quand l'offre expose son `workflow`, on montre les
 * vraies étapes du playbook regroupées en trois temps, avec le compte
 * total en preuve de rigueur (la vitrine du Project OS). À défaut, on
 * retombe sur les étapes rédigées de `method` en fil simple.
 */
export function OfferWorkflowSection({ content }: OfferWorkflowSectionProps) {
    const { workflow, method } = content;

    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            {workflow ? (
                <WorkflowReal workflow={workflow} />
            ) : (
                <WorkflowFallback method={method} />
            )}
        </Section>
    );
}

function WorkflowReal({
    workflow,
}: {
    workflow: NonNullable<OfferDetailPageContent["workflow"]>;
}) {
    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
                <div className="flex max-w-[720px] flex-col gap-4">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        04 — Le déroulé
                    </p>
                    <h2 className="text-balance">{workflow.title}</h2>
                    <p className="text-body text-[color:var(--color-text-muted)]">
                        {workflow.description}
                    </p>
                </div>
                <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[color:var(--color-decor-gold)]/50 bg-[rgba(255,243,224,0.05)] px-4 py-2 text-body-small font-semibold text-[color:var(--color-decor-gold)]">
                    {workflow.countLabel}
                </span>
            </div>

            <div className="mt-8 flex flex-col gap-6 md:mt-12 lg:gap-8">
                {workflow.groups.map((group, index) => (
                    <div
                        key={group.verb}
                        className="grid gap-5 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10"
                    >
                        <div className="flex flex-col gap-1.5 border-l-2 border-[color:var(--color-decor-gold)] pl-5 lg:sticky lg:top-24 lg:self-start lg:border-l-0 lg:pl-0">
                            <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                                {`Temps ${String(index + 1).padStart(2, "0")}`}
                            </span>
                            <span className="font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                                {group.verb}
                            </span>
                            <span className="text-body-small text-[color:var(--color-text-muted)]">
                                {group.summary}
                            </span>
                        </div>

                        <ol className="flex flex-col gap-3">
                            {group.steps.map((step) => (
                                <li
                                    key={step.name}
                                    className="flex flex-col gap-1 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 md:p-5"
                                >
                                    <span className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                                        {step.name}
                                    </span>
                                    <span className="text-body-small text-[color:var(--color-text-muted)]">
                                        {step.objective}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
        </>
    );
}

function WorkflowFallback({
    method,
}: {
    method: OfferDetailPageContent["method"];
}) {
    return (
        <>
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    04 — Le déroulé
                </p>
                <h2 className="text-balance">{method.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {method.description}
                </p>
            </div>

            <ol className="relative mt-8 flex flex-col gap-6 md:mt-12">
                <span
                    className="pointer-events-none absolute bottom-3 left-[15px] top-3 w-px bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))] opacity-70"
                    aria-hidden="true"
                />
                {method.steps.map((step, index) => (
                    <li key={step.title} className="relative flex gap-4">
                        <span
                            className="relative z-10 mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/50 bg-[var(--color-surface-default)] font-[family-name:var(--font-display)] text-body-small italic text-[color:var(--color-decor-gold)]"
                            aria-hidden="true"
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-1 pb-1">
                            <h3 className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                                {step.title}
                            </h3>
                            <p className="text-body-small text-[color:var(--color-text-muted)]">
                                {step.description}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </>
    );
}
