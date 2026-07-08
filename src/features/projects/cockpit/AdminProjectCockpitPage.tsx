import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";

import { ClosureSection } from "./sections/ClosureSection";
import { GateNotice, GenerationNotice } from "./sections/CockpitNotices";
import { CockpitSidebar } from "./sections/CockpitSidebar";
import { CurrentPhaseSection } from "./sections/CurrentPhaseSection";
import { NowSection } from "./sections/NowSection";
import { PhaseGateSection } from "./sections/PhaseGateSection";
import { RedThreadSection } from "./sections/RedThreadSection";
import type { CockpitProject, GateBlockedDetails } from "./types";

/**
 * Cockpit projet — l'écran de pilotage quotidien. Orchestre les deux
 * lectures du plan : la cascade (fil rouge, gate suivant) et Scrum
 * (maintenant, phase courante), plus la colonne latérale de contexte.
 * Découpage de référence de l'architecture front (sprint F4).
 */
export function AdminProjectCockpitPage({
    gateBlockedDetails,
    gateStatus,
    generationStatus,
    project,
}: {
    gateBlockedDetails: GateBlockedDetails | null;
    gateStatus?: string;
    generationStatus?: string;
    project: CockpitProject;
}) {
    const currentPhase = project.currentPhase;

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Cockpit projet"
                title={project.name}
                description={`${project.opportunity.prospectName} · ${
                    project.offer?.name ?? "Offre non renseignée"
                }${
                    project.playbookInstance
                        ? ` · Playbook « ${project.playbookInstance.playbookTemplate.name} »`
                        : " · Playbook non appliqué"
                }`}
                actions={
                    <Button
                        href="/admin/projets"
                        variant="secondary"
                        size="sm"
                        iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                        Tous les projets
                    </Button>
                }
            />

            {generationStatus ? (
                <GenerationNotice status={generationStatus} />
            ) : null}
            {gateStatus ? (
                <GateNotice details={gateBlockedDetails} status={gateStatus} />
            ) : null}

            <RedThreadSection project={project} />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
                <div className="grid gap-4">
                    <NowSection project={project} />
                    {currentPhase ? (
                        <>
                            <PhaseGateSection
                                nextGate={project.nextGate}
                                phase={currentPhase}
                                project={project}
                            />
                            <CurrentPhaseSection
                                phase={currentPhase}
                                projectId={project.id}
                            />
                        </>
                    ) : project.phases.length ? (
                        <ClosureSection project={project} />
                    ) : null}
                </div>
                <CockpitSidebar project={project} />
            </div>
        </AdminPageShell>
    );
}
