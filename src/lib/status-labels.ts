/**
 * Statuts internes → libellés et tons par audience (sprint F4).
 * Source de vérité unique du vocabulaire : l'admin lit la mécanique,
 * le client lit un parcours humain — jamais un statut brut (PENDING,
 * one-month…) ne doit atteindre un écran. Toute traduction locale dans
 * src/features est une régression (blueprint 08 §2.3, règle d'or n° 5).
 */

export type StatusTone =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "draft"
    | "brand";

export type LabeledStatus = {
    label: string;
    tone: StatusTone;
};

export type StatusOption = { label: string; value: string };

function resolve(
    dictionary: Record<string, LabeledStatus>,
    status: string | null | undefined,
    fallbackTone: StatusTone = "neutral",
): LabeledStatus {
    if (!status) return { label: "—", tone: fallbackTone };

    return dictionary[status] ?? { label: status, tone: fallbackTone };
}

function toOptions(dictionary: Record<string, LabeledStatus>): StatusOption[] {
    return Object.entries(dictionary).map(([value, { label }]) => ({
        label,
        value,
    }));
}

/* ------------------------------------------------------------------ */
/* Opportunités (Request OS) — audience admin                          */
/* ------------------------------------------------------------------ */

const opportunityStatuses: Record<string, LabeledStatus> = {
    NOUVEAU: { label: "Nouveau", tone: "brand" },
    A_QUALIFIER: { label: "À qualifier", tone: "brand" },
    APPEL_A_PLANIFIER: { label: "Appel à planifier", tone: "brand" },
    APPEL_PREVU: { label: "Appel prévu", tone: "brand" },
    CADRAGE_A_PRODUIRE: { label: "Cadrage à produire", tone: "brand" },
    PROPOSITION_A_ENVOYER: { label: "Proposition à envoyer", tone: "brand" },
    DEVIS_ENVOYE: { label: "Devis envoyé", tone: "info" },
    NEGOCIATION_AJUSTEMENT: { label: "Négociation", tone: "info" },
    RELANCE_A_FAIRE: { label: "Relance à faire", tone: "warning" },
    ACCEPTE: { label: "Accepté", tone: "success" },
    REFUSE: { label: "Refusé", tone: "danger" },
    PERDU_SANS_SUITE: { label: "Perdu sans suite", tone: "danger" },
    ARCHIVE: { label: "Archive", tone: "neutral" },
};

export const opportunityStatusOptions = toOptions(opportunityStatuses);

/** Statut d'opportunité, vocabulaire admin (pipeline commercial). */
export function getOpportunityStatus(status: string | null | undefined) {
    return resolve(opportunityStatuses, status, "brand");
}

const opportunityPriorities: Record<string, LabeledStatus> = {
    LOW: { label: "Basse", tone: "neutral" },
    NORMAL: { label: "Normale", tone: "info" },
    HIGH: { label: "Haute", tone: "warning" },
    URGENT: { label: "Urgente", tone: "danger" },
};

export const opportunityPriorityOptions = toOptions(opportunityPriorities);

/** Priorité d'opportunité (admin). */
export function getOpportunityPriority(priority: string | null | undefined) {
    return resolve(opportunityPriorities, priority, "info");
}

/* ------------------------------------------------------------------ */
/* Demandes vues par le client — vocabulaire du parcours humain        */
/* ------------------------------------------------------------------ */

const requestStatusesForClient: Record<string, LabeledStatus> = {
    NOUVEAU: { label: "Demande reçue", tone: "info" },
    A_QUALIFIER: { label: "Qualification", tone: "info" },
    APPEL_A_PLANIFIER: { label: "Appel à planifier", tone: "info" },
    APPEL_PREVU: { label: "Appel prévu", tone: "info" },
    CADRAGE_A_PRODUIRE: { label: "Cadrage", tone: "info" },
    PROPOSITION_A_ENVOYER: { label: "Proposition", tone: "info" },
    DEVIS_ENVOYE: { label: "Devis envoyé", tone: "warning" },
    NEGOCIATION_AJUSTEMENT: { label: "Ajustement", tone: "warning" },
    RELANCE_A_FAIRE: { label: "Relance", tone: "warning" },
    ACCEPTE: { label: "Acceptée", tone: "success" },
    REFUSE: { label: "Refusée", tone: "neutral" },
    PERDU_SANS_SUITE: { label: "Sans suite", tone: "neutral" },
    ARCHIVE: { label: "Archivée", tone: "neutral" },
};

/** Statut de demande côté espace client (« Demande reçue », jamais NOUVEAU). */
export function getRequestStatusForClient(status: string | null | undefined) {
    return resolve(requestStatusesForClient, status, "info");
}

/* ------------------------------------------------------------------ */
/* Projets — deux audiences                                            */
/* ------------------------------------------------------------------ */

const projectStatusesForAdmin: Record<string, LabeledStatus> = {
    PREPARATION: { label: "Préparation", tone: "info" },
    EN_COURS: { label: "En cours", tone: "info" },
    EN_VALIDATION: { label: "En validation", tone: "warning" },
    LIVRE: { label: "Livré", tone: "success" },
    CLOTURE: { label: "Clôturé", tone: "success" },
    ARCHIVE: { label: "Archivé", tone: "draft" },
};

/** Statut projet, vocabulaire admin. */
export function getProjectStatusForAdmin(status: string | null | undefined) {
    return resolve(projectStatusesForAdmin, status, "info");
}

const projectStatusesForClient: Record<string, LabeledStatus> = {
    PREPARATION: { label: "On prépare ton projet", tone: "neutral" },
    EN_COURS: { label: "En production", tone: "info" },
    EN_VALIDATION: { label: "En attente de ton retour", tone: "warning" },
    LIVRE: { label: "Livré 🎉", tone: "success" },
    CLOTURE: { label: "Terminé", tone: "success" },
    ARCHIVE: { label: "Archivé", tone: "neutral" },
};

/** Statut projet raconté au client (« On prépare ton projet »). */
export function getProjectStatusForClient(status: string | null | undefined) {
    return resolve(projectStatusesForClient, status, "neutral");
}

const projectStages: Record<string, LabeledStatus> = {
    CADRAGE: { label: "Cadrage", tone: "neutral" },
    UX: { label: "UX", tone: "neutral" },
    UI: { label: "UI", tone: "neutral" },
    CONTENUS: { label: "Contenus", tone: "neutral" },
    DEVELOPPEMENT: { label: "Développement", tone: "neutral" },
    QA: { label: "QA", tone: "neutral" },
    LIVRAISON: { label: "Livraison", tone: "neutral" },
};

/** Étape macro d'un projet (colonne « Étape » des listes admin). */
export function getProjectStage(stage: string | null | undefined) {
    return resolve(projectStages, stage);
}

/* ------------------------------------------------------------------ */
/* Project OS — livrables, tâches, gates, validations (admin)          */
/* ------------------------------------------------------------------ */

const projectItemStatuses: Record<string, LabeledStatus> = {
    TODO: { label: "À faire", tone: "neutral" },
    IN_PROGRESS: { label: "En cours", tone: "info" },
    IN_REVIEW: { label: "En revue", tone: "warning" },
    DONE: { label: "Terminé", tone: "success" },
    SKIPPED: { label: "Non retenu", tone: "draft" },
};

/** Statut d'un livrable, d'une tâche ou d'une action Project OS. */
export function getProjectItemStatus(status: string | null | undefined) {
    return resolve(projectItemStatuses, status);
}

const gateStatuses: Record<string, LabeledStatus> = {
    PENDING: { label: "En attente", tone: "neutral" },
    READY: { label: "Prêt à valider", tone: "warning" },
    PASSED: { label: "Validé", tone: "success" },
    BLOCKED: { label: "Bloqué", tone: "danger" },
};

/** Statut d'un gate de phase (cascade). */
export function getGateStatus(status: string | null | undefined) {
    return resolve(gateStatuses, status);
}

const validationStatuses: Record<string, LabeledStatus> = {
    PENDING: { label: "En attente", tone: "neutral" },
    REQUESTED: { label: "Demandée", tone: "warning" },
    APPROVED: { label: "Validée", tone: "success" },
    CHANGES_REQUESTED: { label: "Retouche demandée", tone: "warning" },
    REFUSED: { label: "Refusée", tone: "danger" },
};

/** Statut d'une validation client (admin). */
export function getValidationStatus(status: string | null | undefined) {
    return resolve(validationStatuses, status);
}

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */

const documentStatuses: Record<string, LabeledStatus> = {
    REFERENCED: { label: "Référencé", tone: "neutral" },
    DRAFT: { label: "Brouillon", tone: "draft" },
    SHARED: { label: "Partagé", tone: "info" },
    SENT: { label: "Envoyé", tone: "info" },
    APPROVED: { label: "Validé", tone: "success" },
    ARCHIVED: { label: "Archivé", tone: "neutral" },
};

export const documentStatusOptions = toOptions(documentStatuses);

/** Statut d'un document (référencé ou composé). */
export function getDocumentStatus(status: string | null | undefined) {
    return resolve(documentStatuses, status);
}

const documentTypes: Record<string, LabeledStatus> = {
    PROPOSAL: { label: "Proposition", tone: "neutral" },
    CONTRACT: { label: "Contrat", tone: "neutral" },
    BRIEF: { label: "Cadrage", tone: "neutral" },
    DELIVERABLE: { label: "Livrable", tone: "neutral" },
    ASSET: { label: "Ressource", tone: "neutral" },
    REPORT: { label: "Rapport", tone: "neutral" },
    HANDOVER: { label: "Passation", tone: "neutral" },
    OTHER: { label: "Autre", tone: "neutral" },
};

export const documentTypeOptions = toOptions(documentTypes);

/** Type métier d'un document. */
export function getDocumentType(type: string | null | undefined) {
    return resolve(documentTypes, type);
}

/* ------------------------------------------------------------------ */
/* Finance                                                             */
/* ------------------------------------------------------------------ */

const financialStatuses: Record<string, LabeledStatus> = {
    DRAFT: { label: "Brouillon", tone: "draft" },
    SENT: { label: "Envoyé", tone: "info" },
    ACCEPTED: { label: "Accepté", tone: "success" },
    REFUSED: { label: "Refusé", tone: "danger" },
    TO_INVOICE: { label: "À facturer", tone: "neutral" },
    ISSUED: { label: "Émis", tone: "info" },
    PAID: { label: "Payé", tone: "success" },
    LATE: { label: "En retard", tone: "danger" },
    CANCELLED: { label: "Annulé", tone: "neutral" },
};

export const financialStatusOptions = toOptions(financialStatuses);

/** Statut d'un document financier (devis, facture, avoir). */
export function getFinancialStatus(status: string | null | undefined) {
    return resolve(financialStatuses, status);
}

const financialTypes: Record<string, LabeledStatus> = {
    QUOTE: { label: "Devis", tone: "neutral" },
    DEPOSIT_INVOICE: { label: "Facture acompte", tone: "neutral" },
    BALANCE_INVOICE: { label: "Facture solde", tone: "neutral" },
    MAINTENANCE_INVOICE: { label: "Facture maintenance", tone: "neutral" },
    CREDIT_NOTE: { label: "Avoir", tone: "neutral" },
};

export const financialTypeOptions = toOptions(financialTypes);

/** Type d'un document financier. */
export function getFinancialType(type: string | null | undefined) {
    return resolve(financialTypes, type);
}

/* ------------------------------------------------------------------ */
/* Comptes clients et playbooks (admin)                                */
/* ------------------------------------------------------------------ */

const clientAccountStatuses: Record<string, LabeledStatus> = {
    LEAD: { label: "Lead", tone: "neutral" },
    QUALIFIED_PROSPECT: { label: "Prospect qualifié", tone: "info" },
    ACTIVE_CLIENT: { label: "Client actif", tone: "success" },
    FORMER_CLIENT: { label: "Ancien client", tone: "neutral" },
    SUSPENDED: { label: "Suspendu", tone: "draft" },
    ARCHIVED: { label: "Archivé", tone: "draft" },
};

/** Statut d'un compte client (CRM). */
export function getClientAccountStatus(status: string | null | undefined) {
    return resolve(clientAccountStatuses, status);
}

const playbookStatuses: Record<string, LabeledStatus> = {
    ACTIVE: { label: "Actif", tone: "success" },
    DRAFT: { label: "Brouillon", tone: "draft" },
    ARCHIVED: { label: "Archivé", tone: "neutral" },
};

/** Statut d'un playbook template. */
export function getPlaybookStatus(status: string | null | undefined) {
    return resolve(playbookStatuses, status);
}
