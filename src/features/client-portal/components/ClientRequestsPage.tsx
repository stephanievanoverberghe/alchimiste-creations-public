import { ArrowRight, Inbox } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import type { getClientRequests } from "@/server/client-portal/portal";

type ClientRequest = Awaited<ReturnType<typeof getClientRequests>>[number];

// A request is not a project: this page follows the pre-project journey
// only (received -> studied -> proposal -> accepted/closed).
export function ClientRequestsPage({
    requests,
}: {
    requests: ClientRequest[];
}) {
    return (
        <div className="grid gap-5">
            <header>
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Mes demandes
                </p>
                <h1 className="mt-2 text-h1 text-[color:var(--color-text-default)]">
                    Le suivi de tes demandes
                </h1>
                <p className="mt-2 max-w-[640px] text-body-small text-[color:var(--color-text-muted)]">
                    Chaque demande suit son propre chemin : étude, proposition,
                    puis — si on avance ensemble — elle devient un projet que tu
                    retrouves dans « Mes projets ».
                </p>
            </header>

            {requests.length ? (
                <ul className="grid gap-3">
                    {requests.map((request) => {
                        const journey = getRequestJourney(request);

                        return (
                            <li
                                key={request.id}
                                className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-label text-[color:var(--color-text-default)]">
                                            {request.projectName ||
                                                request.projectTypeLabel ||
                                                request.projectTypeRaw}
                                        </p>
                                        <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                                            {request.requestId} · envoyée le{" "}
                                            {formatDate(request.createdAt, "long")}
                                        </p>
                                    </div>
                                    <Badge tone={journey.tone}>
                                        {journey.label}
                                    </Badge>
                                </div>
                                <p className="mt-3 max-w-[640px] text-body-small text-[color:var(--color-text-muted)]">
                                    {journey.detail}
                                </p>
                                {request.opportunity?.convertedProject ? (
                                    <Button
                                        href={`/espace-client/projets/${request.opportunity.convertedProject.id}`}
                                        variant="primary"
                                        size="sm"
                                        iconRight={
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        }
                                        className="mt-4"
                                    >
                                        Suivre le projet
                                    </Button>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
                    <Inbox
                        className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                        aria-hidden="true"
                    />
                    <p className="mt-3 text-body text-[color:var(--color-text-default)]">
                        Aucune demande pour le moment.
                    </p>
                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                        Une idée de projet ? Présente-la en quelques minutes.
                    </p>
                    <Button
                        href="/demande-de-projet"
                        variant="primary"
                        size="sm"
                        className="mt-4"
                    >
                        Présenter mon projet
                    </Button>
                </div>
            )}
        </div>
    );
}

// Internal pipeline statuses never leak: the client reads a simple
// journey vocabulary (blueprint docs/crm/08 §2.3).
function getRequestJourney(request: ClientRequest): {
    detail: string;
    label: string;
    tone: "info" | "neutral" | "success" | "warning";
} {
    const status = request.opportunity?.status;

    if (request.opportunity?.convertedProject) {
        return {
            detail: "Cette demande est devenue un projet : tout son suivi (avancement, documents, validations) se passe maintenant côté projet.",
            label: "Devenue projet",
            tone: "success",
        };
    }

    if (!status || ["NOUVEAU", "A_QUALIFIER"].includes(status)) {
        return {
            detail: "Ta demande est bien reçue. Elle est en cours d'étude — tu seras recontacté(e) rapidement pour la suite.",
            label: "Reçue — en cours d'étude",
            tone: "info",
        };
    }

    if (["APPEL_A_PLANIFIER", "APPEL_PREVU"].includes(status)) {
        return {
            detail: "Un échange est prévu (ou en cours de planification) pour bien cerner ton besoin avant toute proposition.",
            label: "Échange en cours",
            tone: "info",
        };
    }

    if (
        [
            "CADRAGE_A_PRODUIRE",
            "PROPOSITION_A_ENVOYER",
            "DEVIS_ENVOYE",
            "NEGOCIATION_AJUSTEMENT",
            "RELANCE_A_FAIRE",
        ].includes(status)
    ) {
        return {
            detail: "Ta proposition est en préparation ou entre tes mains : n'hésite pas à poser tes questions avant de décider.",
            label: "Proposition en cours",
            tone: "warning",
        };
    }

    if (status === "ACCEPTE") {
        return {
            detail: "C'est validé ! Le projet est en cours de préparation — il apparaîtra très vite dans « Mes projets ».",
            label: "Acceptée",
            tone: "success",
        };
    }

    return {
        detail: "Cette demande est clôturée. Si ton besoin évolue, tu peux repartir d'une nouvelle demande quand tu veux.",
        label: "Clôturée",
        tone: "neutral",
    };
}
