import { ArrowLeft, CheckCircle2, CircleAlert, ExternalLink } from "lucide-react";

import { Badge, Button, Select, Textarea, TextField } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { formatDateInputValue } from "@/lib/formatters";
import {
    getOpportunityPriority,
    getOpportunityStatus,
    opportunityPriorityOptions,
    opportunityStatusOptions,
} from "@/lib/status-labels";
import { updateOpportunityDetailAction } from "@/server/crm/opportunity-actions";
import {
    getOpportunityConversionGates,
    type CrmCommercialProgress,
    type CrmOpportunityDetail,
} from "@/server/crm/opportunities";
import {
    calculateOpportunityQualificationScore,
    getOpportunityQualificationChecklist,
} from "@/server/crm/qualification";

type DemandOpportunityDetailPageProps = {
    commercialProgress: CrmCommercialProgress | null;
    conversionStatus?: string;
    offers: Array<{ id: string; name: string }>;
    opportunity: CrmOpportunityDetail;
    projectOsStatus?: string;
    projectId?: string;
    projectTypes: Array<{ id: string; name: string }>;
    qualificationStatus?: string;
};

const fitOptions = [
    { value: "UNKNOWN", label: "Non évalué" },
    { value: "LOW", label: "Faible" },
    { value: "MEDIUM", label: "Moyen" },
    { value: "HIGH", label: "Bon" },
    { value: "EXCELLENT", label: "Excellent" },
];

export function DemandOpportunityDetailPage({
    commercialProgress,
    conversionStatus,
    offers,
    opportunity,
    projectOsStatus,
    projectId,
    projectTypes,
    qualificationStatus,
}: DemandOpportunityDetailPageProps) {
    const readiness = getOpportunityConversionGates(opportunity);
    const qualificationInput = getQualificationInput(opportunity);
    const qualificationChecklist =
        getOpportunityQualificationChecklist(qualificationInput);
    const qualificationScore =
        calculateOpportunityQualificationScore(qualificationInput);

    return (
        <AdminPageShell>
            <div className="flex flex-col gap-5">
                <AdminPageHeader
                    eyebrow="Fiche demande"
                    title={opportunity.title}
                    description="Pilote cette demande depuis sa capture initiale jusqu'à la conversion en fiche projet centrale. La référence est créée automatiquement quand le formulaire public est envoyé."
                    actions={
                        <Button
                            href="/admin/demandes"
                            variant="secondary"
                            size="sm"
                            iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                        >
                            Demandes
                        </Button>
                    }
                    metrics={
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <RequestDetailMetricCard
                                label="Référence"
                                value={getDemandReference(opportunity)}
                                tone={opportunity.projectRequest ? "info" : "warning"}
                            />
                            <RequestDetailMetricCard
                                label="Statut"
                                value={getOpportunityStatus(opportunity.status).label}
                                tone={getOpportunityStatus(opportunity.status).tone}
                            />
                            <RequestDetailMetricCard
                                label="Qualification"
                                value={`${qualificationScore}/100`}
                                tone={getQualificationTone(qualificationScore)}
                            />
                            <RequestDetailMetricCard
                                label="Conversion"
                                value={readiness.readyToConvert ? "Prête" : "À compléter"}
                                tone={readiness.readyToConvert ? "success" : "warning"}
                            />
                        </div>
                    }
                />

                {qualificationStatus ? (
                    <QualificationStatus status={qualificationStatus} />
                ) : null}

                <ContactSummary opportunity={opportunity} />

                    <div className="hidden">
                        <div className="flex max-w-[860px] flex-col gap-3">
                            <Button
                                href="/admin/demandes"
                                variant="ghost"
                                size="sm"
                                iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                                className="w-fit"
                            >
                                Demandes
                            </Button>
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                Fiche opportunité
                            </p>
                            <h1 className="text-h1 text-[color:var(--color-text-default)]">
                                {opportunity.title}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                <Badge tone={getOpportunityStatus(opportunity.status).tone}>
                                    {getOpportunityStatus(opportunity.status).label}
                                </Badge>
                                <Badge
                                    tone={getOpportunityPriority(opportunity.priority).tone}
                                >
                                    {getOpportunityPriority(opportunity.priority).label}
                                </Badge>
                                <Badge
                                    tone={
                                        readiness.readyToConvert ? "success" : "warning"
                                    }
                                >
                                    {readiness.readyToConvert
                                        ? "Prête à convertir"
                                        : "Gates incomplètes"}
                                </Badge>
                                <Badge tone={getQualificationTone(qualificationScore)}>
                                    Score {qualificationScore}/100
                                </Badge>
                            </div>
                            {qualificationStatus ? (
                                <QualificationStatus status={qualificationStatus} />
                            ) : null}
                        </div>

                        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 lg:min-w-[360px]">
                            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                                Contact
                            </p>
                            <p className="mt-2 text-label text-[color:var(--color-text-default)]">
                                {opportunity.prospectName}
                            </p>
                            <p className="break-all text-body-small text-[color:var(--color-text-muted)]">
                                {opportunity.prospectEmail}
                            </p>
                            {opportunity.clientAccount ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge tone="neutral" size="sm">
                                        Compte : {opportunity.clientAccount.name}
                                    </Badge>
                                    <Badge tone="brand" size="sm">
                                        {opportunity.clientAccount.status}
                                    </Badge>
                                </div>
                            ) : null}
                            {opportunity.contact ? (
                                <p className="mt-2 text-caption text-[color:var(--color-text-subtle)]">
                                    Contact : {opportunity.contact.status}
                                </p>
                            ) : null}
                            {opportunity.phone ? (
                                <p className="text-body-small text-[color:var(--color-text-muted)]">
                                    {opportunity.phone}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {commercialProgress ? (
                        <CommercialProgressPanel progress={commercialProgress} />
                    ) : null}

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <form
                            action={updateOpportunityDetailAction}
                            className="flex flex-col gap-6 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6"
                        >
                            <input type="hidden" name="id" value={opportunity.id} />

                            <FormSection title="Qualification">
                                <DeclaredVsConfirmedType opportunity={opportunity} />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <TextField
                                        name="title"
                                        label="Titre opportunité"
                                        defaultValue={opportunity.title}
                                        required
                                    />
                                    <TextField
                                        name="organizationName"
                                        label="Organisation"
                                        defaultValue={opportunity.organizationName ?? ""}
                                    />
                                    <TextField
                                        name="phone"
                                        label="Téléphone"
                                        defaultValue={opportunity.phone ?? ""}
                                    />
                                    <TextField
                                        name="conversionChannel"
                                        label="Canal de conversion"
                                        defaultValue={opportunity.conversionChannel ?? ""}
                                    />
                                    <Select
                                        name="status"
                                        label="Statut"
                                        defaultValue={opportunity.status}
                                        options={[...opportunityStatusOptions]}
                                    />
                                    <Select
                                        name="priority"
                                        label="Priorité"
                                        defaultValue={opportunity.priority}
                                        options={[...opportunityPriorityOptions]}
                                    />
                                    <Select
                                        name="fit"
                                        label="Fit commercial"
                                        defaultValue={opportunity.fit}
                                        options={fitOptions}
                                    />
                                    <TextField
                                        name="qualificationScore"
                                        type="number"
                                        min={0}
                                        max={100}
                                        label="Évaluation interne"
                                        defaultValue={opportunity.qualificationScore ?? ""}
                                        helperText="Optionnel. Le score affiché est recalculé depuis les données actuelles."
                                    />
                                    <Select
                                        name="offerId"
                                        label="Offre pressentie"
                                        defaultValue={opportunity.offerId ?? ""}
                                        options={[
                                            { value: "", label: "Non définie" },
                                            ...offers.map((offer) => ({
                                                value: offer.id,
                                                label: offer.name,
                                            })),
                                        ]}
                                    />
                                    <Select
                                        name="projectTypeId"
                                        label="Type confirmé"
                                        defaultValue={opportunity.projectTypeId ?? ""}
                                        options={[
                                            { value: "", label: "Non défini" },
                                            ...projectTypes.map((projectType) => ({
                                                value: projectType.id,
                                                label: projectType.name,
                                            })),
                                        ]}
                                    />
                                    <TextField
                                        name="estimatedBudgetRange"
                                        label="Budget estimé"
                                        defaultValue={opportunity.estimatedBudgetRange ?? ""}
                                    />
                                    <TextField
                                        name="estimatedValue"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        label="Valeur estimée (€)"
                                        defaultValue={formatCents(opportunity.estimatedValueCents)}
                                    />
                                    <TextField
                                        name="probability"
                                        type="number"
                                        min={0}
                                        max={100}
                                        label="Probabilité (%)"
                                        defaultValue={opportunity.probability ?? ""}
                                    />
                                    <TextField
                                        name="urgency"
                                        label="Urgence"
                                        defaultValue={opportunity.urgency ?? ""}
                                    />
                                    <TextField
                                        name="decisionExpected"
                                        type="date"
                                        label="Décision attendue"
                                        defaultValue={formatDateInputValue(opportunity.decisionExpected)}
                                    />
                                    <TextField
                                        name="lastContactAt"
                                        type="date"
                                        label="Dernier contact"
                                        defaultValue={formatDateInputValue(opportunity.lastContactAt)}
                                        disabled
                                    />
                                </div>
                                <Textarea
                                    name="rawNeed"
                                    label="Besoin qualifié"
                                    defaultValue={opportunity.rawNeed ?? ""}
                                    rows={5}
                                />
                                <Textarea
                                    name="mainObjection"
                                    label="Objection principale"
                                    defaultValue={opportunity.mainObjection ?? ""}
                                    rows={3}
                                />
                            </FormSection>

                            <FormSection title="Proposition, devis et acompte">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <TextField
                                        name="commercialScopeUrl"
                                        label="Lien cadrage commercial"
                                        defaultValue={opportunity.commercialScopeUrl ?? ""}
                                    />
                                    <TextField
                                        name="commercialDriveUrl"
                                        label="Dossier Drive commercial"
                                        defaultValue={opportunity.commercialDriveUrl ?? ""}
                                    />
                                    <TextField
                                        name="proposalUrl"
                                        label="Lien proposition"
                                        defaultValue={opportunity.proposalUrl ?? ""}
                                    />
                                    <TextField
                                        name="proposalSentAt"
                                        type="date"
                                        label="Proposition envoyée le"
                                        defaultValue={formatDateInputValue(opportunity.proposalSentAt)}
                                    />
                                    <TextField
                                        name="quoteUrl"
                                        label="Lien devis"
                                        defaultValue={opportunity.quoteUrl ?? ""}
                                    />
                                    <TextField
                                        name="quoteSentAt"
                                        type="date"
                                        label="Devis envoyé le"
                                        defaultValue={formatDateInputValue(opportunity.quoteSentAt)}
                                    />
                                    <TextField
                                        name="quoteAcceptedAt"
                                        type="date"
                                        label="Devis accepté le"
                                        defaultValue={formatDateInputValue(opportunity.quoteAcceptedAt)}
                                    />
                                    <TextField
                                        name="depositRequestedAt"
                                        type="date"
                                        label="Acompte demandé le"
                                        defaultValue={formatDateInputValue(
                                            opportunity.depositRequestedAt,
                                        )}
                                    />
                                    <TextField
                                        name="depositReceivedAt"
                                        type="date"
                                        label="Acompte reçu le"
                                        defaultValue={formatDateInputValue(opportunity.depositReceivedAt)}
                                    />
                                    <TextField
                                        name="depositAmount"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        label="Montant acompte (€)"
                                        defaultValue={formatCents(opportunity.depositAmountCents)}
                                    />
                                </div>
                                <Textarea
                                    name="conversionExceptionReason"
                                    label="Exception conversion sans acompte"
                                    defaultValue={
                                        opportunity.conversionExceptionReason ?? ""
                                    }
                                    helperText="À renseigner uniquement si la conversion est validée sans acompte reçu."
                                    rows={3}
                                />
                            </FormSection>

                            <FormSection title="Pilotage">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <TextField
                                        name="nextGate"
                                        label="Gate suivante"
                                        defaultValue={opportunity.nextGate ?? ""}
                                    />
                                    <TextField
                                        name="nextFollowUpAt"
                                        type="date"
                                        label="Prochaine relance"
                                        defaultValue={formatDateInputValue(opportunity.nextFollowUpAt)}
                                    />
                                </div>
                                <Textarea
                                    name="nextAction"
                                    label="Prochaine action"
                                    defaultValue={opportunity.nextAction ?? ""}
                                    errorMessage={
                                        qualificationStatus === "missing-next-action"
                                            ? "Une opportunité active doit avoir une prochaine action."
                                            : undefined
                                    }
                                    helperText="Obligatoire tant que l'opportunité n'est pas acceptée, refusée, perdue ou archivée."
                                    rows={3}
                                />
                                <Textarea
                                    name="commercialBlocker"
                                    label="Blocage commercial"
                                    defaultValue={opportunity.commercialBlocker ?? ""}
                                    rows={3}
                                />
                                <Textarea
                                    name="notes"
                                    label="Notes internes"
                                    defaultValue={opportunity.notes ?? ""}
                                    rows={5}
                                />
                            </FormSection>

                            <Button type="submit" className="w-fit">
                                Enregistrer la fiche
                            </Button>
                        </form>

                        <aside className="flex flex-col gap-4">
                            <QualificationPanel
                                checklist={qualificationChecklist}
                                opportunity={opportunity}
                                score={qualificationScore}
                            />
                            <ConversionPanel
                                conversionStatus={conversionStatus}
                                opportunity={opportunity}
                                projectOsStatus={projectOsStatus}
                                projectId={projectId}
                                readiness={readiness}
                            />
                            <GatePanel readiness={readiness} />
                            <RequestSnapshot opportunity={opportunity} />
                            <LinksPanel opportunity={opportunity} />
                        </aside>
                    </div>
            </div>
        </AdminPageShell>
    );
}

function RequestDetailMetricCard({
    label,
    tone = "neutral",
    value,
}: {
    label: string;
    tone?:
        | "brand"
        | "danger"
        | "draft"
        | "info"
        | "neutral"
        | "success"
        | "warning";
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="flex items-start justify-between gap-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    {label}
                </p>
                <Badge tone={tone} size="sm">
                    {label === "Référence" ? "Auto" : "Suivi"}
                </Badge>
            </div>
            <p className="mt-3 truncate text-h3 text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}

function ContactSummary({
    opportunity,
}: {
    opportunity: CrmOpportunityDetail;
}) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Contexte de la demande
                    </p>
                    <h2 className="mt-2 text-h3 text-[color:var(--color-text-default)]">
                        {opportunity.prospectName}
                    </h2>
                    <p className="mt-1 break-all text-body-small text-[color:var(--color-text-muted)]">
                        {opportunity.prospectEmail}
                    </p>
                </div>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:min-w-[560px]">
                    <SummaryItem
                        label="Référence demande"
                        value={getDemandReference(opportunity)}
                    />
                    <SummaryItem
                        label="Compte client"
                        value={opportunity.clientAccount?.name ?? null}
                    />
                    <SummaryItem
                        label="Type déclaré"
                        value={
                            opportunity.projectRequest?.projectTypeLabel ??
                            opportunity.projectRequest?.projectTypeRaw ??
                            null
                        }
                    />
                    <SummaryItem
                        label="Téléphone"
                        value={opportunity.phone ?? opportunity.contact?.phone ?? null}
                    />
                </div>
            </div>
        </section>
    );
}

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value: string | null;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3">
            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {label}
            </p>
            <p className="mt-1 truncate text-body-small text-[color:var(--color-text-default)]">
                {value?.trim() || "Non renseigné"}
            </p>
        </div>
    );
}

function CommercialProgressPanel({
    progress,
}: {
    progress: CrmCommercialProgress;
}) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-[760px]">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Avancement commercial
                    </p>
                    <h2 className="mt-2 text-h2 text-[color:var(--color-text-default)]">
                        Étape {progress.currentStep.order} - {progress.currentStep.title}
                    </h2>
                    <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        La demande suit l&apos;avant-projet. La conversion crée seulement
                        la fiche projet centrale, puis Project OS reste une action
                        explicite.
                    </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4 lg:min-w-[220px]">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                            Progression
                        </span>
                        <Badge tone="info">{progress.completionPercent}%</Badge>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-default)]">
                        <div
                            className="h-full rounded-full bg-[var(--color-info-text)]"
                            style={{ width: `${progress.completionPercent}%` }}
                        />
                    </div>
                    <p className="text-caption text-[color:var(--color-text-subtle)]">
                        Prochaine étape :{" "}
                        {progress.nextStep
                            ? progress.nextStep.title
                            : "passation terminée"}
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-2 xl:grid-cols-[repeat(13,minmax(0,1fr))]">
                {progress.steps.map((step) => (
                    <div
                        key={step.order}
                        className={`min-h-16 rounded-xl border p-2 ${
                            step.isCurrent
                                ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)]"
                                : step.isDone
                                  ? "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)]"
                                  : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-muted)]"
                        }`}
                    >
                        <p
                            className={`text-label ${
                                step.isCurrent
                                    ? "text-[color:var(--color-action-default)]"
                                    : step.isDone
                                      ? "text-[color:var(--color-success-text)]"
                                      : "text-[color:var(--color-text-subtle)]"
                            }`}
                        >
                            {step.order}
                        </p>
                        <p className="mt-1 line-clamp-2 text-caption text-[color:var(--color-text-muted)]">
                            {step.title}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-5">
                <CommercialProgressItem
                    label="Action admin"
                    value={progress.nextAction}
                    tone="info"
                />
                <CommercialProgressItem
                    label="Action client"
                    value={progress.clientAction}
                    tone="neutral"
                />
                <CommercialProgressItem
                    label="Document"
                    value={progress.documents.join(", ")}
                    tone="brand"
                />
                <CommercialProgressItem
                    label="Validation"
                    value={progress.validation}
                    tone="success"
                />
                <CommercialProgressItem
                    label="Relance"
                    value={progress.followUp}
                    tone={progress.isFollowUpOverdue ? "warning" : "neutral"}
                />
            </div>

            {progress.expectedOutput ? (
                <div className="mt-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4">
                    <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                        Sortie attendue
                    </p>
                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                        {progress.expectedOutput}
                    </p>
                </div>
            ) : null}
        </section>
    );
}

function CommercialProgressItem({
    label,
    tone,
    value,
}: {
    label: string;
    tone: "brand" | "info" | "neutral" | "success" | "warning";
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    {label}
                </p>
                <Badge tone={tone} size="sm">
                    {label === "Relance" ? "Timing" : "Étape"}
                </Badge>
            </div>
            <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                {value || "Non défini"}
            </p>
        </div>
    );
}

function FormSection({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <section className="flex flex-col gap-4 border-b border-[color:var(--color-border-subtle)] pb-6 last:border-b-0 last:pb-0">
            <h2 className="text-h3 text-[color:var(--color-text-default)]">
                {title}
            </h2>
            {children}
        </section>
    );
}

function DeclaredVsConfirmedType({
    opportunity,
}: {
    opportunity: CrmOpportunityDetail;
}) {
    return (
        <div className="grid gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4 md:grid-cols-2">
            <div>
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    Type déclaré
                </p>
                <p className="mt-1 text-body-small text-[color:var(--color-text-default)]">
                    {opportunity.projectRequest?.projectTypeLabel ??
                        opportunity.projectRequest?.projectTypeRaw ??
                        "Non renseigné"}
                </p>
            </div>
            <div>
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    Type confirmé
                </p>
                <div className="mt-1">
                    <Badge tone={opportunity.projectType ? "success" : "warning"}>
                        {opportunity.projectType?.name ?? "À confirmer"}
                    </Badge>
                </div>
            </div>
        </div>
    );
}

function QualificationPanel({
    checklist,
    opportunity,
    score,
}: {
    checklist: ReturnType<typeof getOpportunityQualificationChecklist>;
    opportunity: CrmOpportunityDetail;
    score: number;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        Qualification
                    </h2>
                    <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                        Type demandé, fit, score et points à compléter.
                    </p>
                </div>
                <Badge tone={getQualificationTone(score)}>{score}/100</Badge>
            </div>
            <dl className="mt-4 grid gap-3 text-body-small">
                <DetailItem
                    label="Type déclaré"
                    value={
                        opportunity.projectRequest?.projectTypeLabel ??
                        opportunity.projectRequest?.projectTypeRaw ??
                        null
                    }
                />
                <DetailItem
                    label="Type confirmé"
                    value={opportunity.projectType?.name ?? null}
                />
                <DetailItem label="Fit" value={opportunity.fit} />
            </dl>
            <div className="mt-4 flex flex-col gap-3">
                {checklist.map((item) => (
                    <div key={item.key} className="flex items-start gap-3">
                        {item.passed ? (
                            <CheckCircle2
                                className="mt-0.5 size-4 shrink-0 text-[color:var(--color-success-text)]"
                                aria-hidden="true"
                            />
                        ) : (
                            <CircleAlert
                                className="mt-0.5 size-4 shrink-0 text-[color:var(--color-warning-text)]"
                                aria-hidden="true"
                            />
                        )}
                        <p className="text-body-small text-[color:var(--color-text-muted)]">
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ConversionPanel({
    conversionStatus,
    opportunity,
    projectOsStatus,
    projectId,
    readiness,
}: {
    conversionStatus?: string;
    opportunity: CrmOpportunityDetail;
    projectOsStatus?: string;
    projectId?: string;
    readiness: ReturnType<typeof getOpportunityConversionGates>;
}) {
    const convertedProjectId = opportunity.convertedProject?.id ?? projectId;
    const projectOsCounts = opportunity.convertedProject?._count;
    const hasProjectOsStructure = projectOsCounts
        ? Object.values(projectOsCounts).some((count) => count > 0)
        : false;

    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        Conversion projet
                    </h2>
                    <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        Cette action crée le projet central, active le client et
                        ouvre l’accès espace client. Project OS reste manuel.
                    </p>
                </div>
                <Badge tone={convertedProjectId ? "success" : "neutral"}>
                    {convertedProjectId ? "Convertie" : "Demande"}
                </Badge>
            </div>

            {conversionStatus ? (
                <ConversionStatus status={conversionStatus} />
            ) : null}
            {projectOsStatus ? (
                <ProjectOsStatus status={projectOsStatus} />
            ) : null}

            {convertedProjectId ? (
                <div className="mt-4 flex flex-col gap-3">
                    <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3">
                        <p className="text-body-small text-[color:var(--color-success-text)]">
                            Projet créé : {convertedProjectId}
                        </p>
                        <p className="mt-1 text-caption text-[color:var(--color-success-text)]">
                            Le client est activé, Gate 0 est préparée, et Project
                            OS ne se construit qu’avec l’action explicite ci-dessous.
                        </p>
                    </div>

                    {hasProjectOsStructure && projectOsCounts ? (
                        <>
                            <ProjectOsCounts counts={projectOsCounts} />
                            <Button
                                href={`/admin/projets/${convertedProjectId}/roadmap`}
                                variant="secondary"
                                size="sm"
                                className="w-fit"
                            >
                                Ouvrir la roadmap
                            </Button>
                        </>
                    ) : (
                        <div>
                            <Button
                                href={`/admin/demandes/${opportunity.id}/convertir`}
                                variant="primary"
                            >
                                Appliquer le playbook
                            </Button>
                            <p className="mt-3 text-caption text-[color:var(--color-text-subtle)]">
                                Ouvre l’assistant : choix des modules
                                optionnels, puis génération de la roadmap, des
                                gates, des tâches, des livrables et des
                                validations.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4">
                    <Button
                        href={`/admin/demandes/${opportunity.id}/convertir`}
                        variant={
                            readiness.readyToConvert ? "primary" : "secondary"
                        }
                    >
                        Ouvrir l’assistant de conversion
                    </Button>
                    <p className="mt-3 text-caption text-[color:var(--color-text-subtle)]">
                        {readiness.readyToConvert
                            ? "Pré-conditions remplies : type de projet, modules, puis génération du fil rouge."
                            : "Des pré-conditions manquent — l’assistant les liste et reste bloqué tant qu’elles ne sont pas levées."}
                    </p>
                </div>
            )}
        </div>
    );
}

function ProjectOsCounts({
    counts,
}: {
    counts: {
        deliverables: number;
        lots: number;
        phases: number;
        tasks: number;
        validations: number;
    };
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-info-border)] bg-[var(--color-info-bg)] p-3">
            <p className="text-body-small text-[color:var(--color-info-text)]">
                Playbook Project OS appliqué.
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-caption text-[color:var(--color-info-text)]">
                <CountItem label="Lots" value={counts.lots} />
                <CountItem label="Phases" value={counts.phases} />
                <CountItem label="Livrables" value={counts.deliverables} />
                <CountItem label="Tâches" value={counts.tasks} />
                <CountItem label="Validations" value={counts.validations} />
            </dl>
        </div>
    );
}

function CountItem({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div>
            <dt className="uppercase">{label}</dt>
            <dd className="text-label">{value}</dd>
        </div>
    );
}

function ProjectOsStatus({ status }: { status: string }) {
    const message = getProjectOsStatusMessage(status);

    if (!message) return null;

    return (
        <div
            className={`mt-4 rounded-2xl border p-3 text-body-small ${
                message.kind === "success"
                    ? "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]"
                    : "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[color:var(--color-warning-text)]"
            }`}
            role="status"
        >
            {message.text}
        </div>
    );
}

function getProjectOsStatusMessage(status: string) {
    if (status === "generated") {
        return {
            kind: "success" as const,
            text: "Playbook Project OS appliqué depuis le référentiel.",
        };
    }

    if (status === "already-generated") {
        return {
            kind: "success" as const,
            text: "La structure Project OS existait déjà pour ce projet.",
        };
    }

    if (status === "missing-project") {
        return {
            kind: "warning" as const,
            text: "Génération impossible : la fiche projet centrale est introuvable.",
        };
    }

    if (status === "missing-template") {
        return {
            kind: "warning" as const,
            text: "Génération impossible : aucun template Project OS n’est relié à ce type de projet.",
        };
    }

    return null;
}

function ConversionStatus({ status }: { status: string }) {
    const message = getConversionStatusMessage(status);

    if (!message) return null;

    return (
        <div
            className={`mt-4 rounded-2xl border p-3 text-body-small ${
                message.kind === "success"
                    ? "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]"
                    : "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[color:var(--color-warning-text)]"
            }`}
            role="status"
        >
            {message.text}
        </div>
    );
}

function getConversionStatusMessage(status: string) {
    if (status === "converted") {
        return {
            kind: "success" as const,
            text: "Conversion réussie. Le projet central, le client actif et l'accès espace client ont été créés.",
        };
    }

    if (status === "already-converted") {
        return {
            kind: "success" as const,
            text: "Cette opportunité avait déjà été convertie.",
        };
    }

    if (status === "blocked") {
        return {
            kind: "warning" as const,
            text: "Conversion bloquée : toutes les validations commerciales doivent être complètes.",
        };
    }

    return null;
}

function GatePanel({
    readiness,
}: {
    readiness: ReturnType<typeof getOpportunityConversionGates>;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-h3 text-[color:var(--color-text-default)]">
                    Gates conversion
                </h2>
                <Badge tone={readiness.readyToConvert ? "success" : "warning"}>
                    {readiness.readyToConvert ? "OK" : "À compléter"}
                </Badge>
            </div>
            <div className="mt-4 flex flex-col gap-3">
                {readiness.gates.map((gate) => (
                    <div key={gate.key} className="flex items-start gap-3">
                        {gate.passed ? (
                            <CheckCircle2
                                className="mt-0.5 size-4 shrink-0 text-[color:var(--color-success-text)]"
                                aria-hidden="true"
                            />
                        ) : (
                            <CircleAlert
                                className="mt-0.5 size-4 shrink-0 text-[color:var(--color-warning-text)]"
                                aria-hidden="true"
                            />
                        )}
                        <p className="text-body-small text-[color:var(--color-text-muted)]">
                            {gate.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RequestSnapshot({
    opportunity,
}: {
    opportunity: CrmOpportunityDetail;
}) {
    const request = opportunity.projectRequest;

    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <h2 className="text-h3 text-[color:var(--color-text-default)]">
                Demande brute
            </h2>
            {request ? (
                <dl className="mt-4 flex flex-col gap-3 text-body-small">
                    <DetailItem label="Référence" value={request.requestId} />
                    <DetailItem label="Projet" value={request.projectName} />
                    <DetailItem label="Type demandé" value={request.projectTypeLabel} />
                    <DetailItem
                        label="Compte"
                        value={opportunity.clientAccount?.name ?? null}
                    />
                    <DetailItem
                        label="Contact"
                        value={formatContactName(opportunity)}
                    />
                    <DetailItem label="Budget" value={request.budget} />
                    <DetailItem label="Échéance" value={request.deadline} />
                    <DetailItem label="Site" value={request.website} />
                    {request.attachmentUrl ? (
                        <div>
                            <dt className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                                Document joint
                            </dt>
                            <dd className="mt-1">
                                <a
                                    href={request.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 break-all text-[color:var(--color-action-default)] underline underline-offset-2 hover:text-[color:var(--color-action-hover)]"
                                >
                                    {request.attachmentName || "Ouvrir le document"}
                                </a>
                            </dd>
                        </div>
                    ) : null}
                </dl>
            ) : (
                <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                    Aucune demande brute liée.
                </p>
            )}
        </div>
    );
}

function LinksPanel({
    opportunity,
}: {
    opportunity: CrmOpportunityDetail;
}) {
    const links = [
        { href: opportunity.commercialScopeUrl, label: "Cadrage" },
        { href: opportunity.proposalUrl, label: "Proposition" },
        { href: opportunity.quoteUrl, label: "Devis" },
        { href: opportunity.commercialDriveUrl, label: "Drive commercial" },
    ].filter((link): link is { href: string; label: string } =>
        Boolean(link.href?.trim()),
    );

    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <h2 className="text-h3 text-[color:var(--color-text-default)]">
                Liens commerciaux
            </h2>
            {links.length > 0 ? (
                <div className="mt-4 flex flex-col gap-2">
                    {links.map((link) => (
                        <Button
                            key={link.label}
                            href={link.href}
                            variant="secondary"
                            size="sm"
                            iconRight={<ExternalLink className="size-4" aria-hidden="true" />}
                        >
                            {link.label}
                        </Button>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                    Aucun lien renseigné.
                </p>
            )}
        </div>
    );
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string | null;
}) {
    return (
        <div>
            <dt className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {label}
            </dt>
            <dd className="mt-1 break-words text-[color:var(--color-text-muted)]">
                {value?.trim() || "Non renseigné"}
            </dd>
        </div>
    );
}

function formatContactName(opportunity: CrmOpportunityDetail) {
    if (!opportunity.contact) return null;

    const fullName = [
        opportunity.contact.firstName,
        opportunity.contact.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || opportunity.contact.email;
}

function getQualificationInput(opportunity: CrmOpportunityDetail) {
    return {
        commercialBlocker: opportunity.commercialBlocker,
        estimatedBudgetRange: opportunity.estimatedBudgetRange,
        fit: opportunity.fit,
        nextAction: opportunity.nextAction,
        nextFollowUpAt: opportunity.nextFollowUpAt,
        offerId: opportunity.offerId,
        projectTypeId: opportunity.projectTypeId,
        rawNeed: opportunity.rawNeed,
    };
}

function getQualificationTone(score: number) {
    if (score >= 80) return "success";
    if (score >= 55) return "info";
    if (score >= 30) return "warning";

    return "danger";
}

function getDemandReference(opportunity: CrmOpportunityDetail) {
    return opportunity.projectRequest?.requestId ?? "Sans référence";
}

function QualificationStatus({ status }: { status: string }) {
    if (status !== "missing-next-action") return null;

    return (
        <div className="mt-3 rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-3 text-body-small text-[color:var(--color-warning-text)]">
            Sauvegarde refusée : une opportunité active doit garder une
            prochaine action claire.
        </div>
    );
}

function formatCents(value: number | null) {
    if (value === null) return "";

    return (value / 100).toFixed(2);
}
