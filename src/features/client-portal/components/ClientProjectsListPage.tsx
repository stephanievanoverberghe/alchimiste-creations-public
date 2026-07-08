import { ArrowRight, FolderOpen } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import { getProjectStatusForClient } from "@/lib/status-labels";
import type { getClientProjects } from "@/server/client-portal/portal";

type ClientProject = Awaited<ReturnType<typeof getClientProjects>>[number];

export function ClientProjectsListPage({
    projects,
}: {
    projects: ClientProject[];
}) {
    return (
        <div className="grid gap-5">
            <header>
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Mes projets
                </p>
                <h1 className="mt-2 text-h1 text-[color:var(--color-text-default)]">
                    Tes projets en production
                </h1>
                <p className="mt-2 max-w-[640px] text-body-small text-[color:var(--color-text-muted)]">
                    Ici, tout ce qui est engagé : l’avancement, les documents à
                    lire et les validations qui t’attendent.
                </p>
            </header>

            {projects.length ? (
                <ul className="grid gap-3">
                    {projects.map((project) => {
                        const pendingValidations = project._count.validations;
                        const currentPhase = project.phases[0]?.name ?? null;

                        return (
                            <li
                                key={project.id}
                                className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-label text-[color:var(--color-text-default)]">
                                            {project.name}
                                        </p>
                                        <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                                            {currentPhase
                                                ? `Étape en cours : ${currentPhase}`
                                                : "Préparation en cours"}
                                        </p>
                                    </div>
                                    <Badge
                                        tone={getProjectStatusForClient(project.status).tone}
                                    >
                                        {getProjectStatusForClient(project.status).label}
                                    </Badge>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <Button
                                        href={`/espace-client/projets/${project.id}`}
                                        variant="primary"
                                        size="sm"
                                        iconRight={
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Ouvrir le projet
                                    </Button>
                                    {pendingValidations > 0 ? (
                                        <Badge tone="warning">
                                            {pendingValidations} validation(s) à
                                            donner
                                        </Badge>
                                    ) : null}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
                    <FolderOpen
                        className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                        aria-hidden="true"
                    />
                    <p className="mt-3 text-body text-[color:var(--color-text-default)]">
                        Aucun projet en production pour le moment.
                    </p>
                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                        Tes demandes en cours d’étude sont dans « Mes demandes »
                        — dès qu’une demande est acceptée, le projet apparaît
                        ici.
                    </p>
                    <Button
                        href="/espace-client/demandes"
                        variant="secondary"
                        size="sm"
                        className="mt-4"
                    >
                        Voir mes demandes
                    </Button>
                </div>
            )}
        </div>
    );
}
