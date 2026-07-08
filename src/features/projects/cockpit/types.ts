import type { getAdminProjectCockpit } from "@/server/projects/cockpit";

/** Projection complète du cockpit, telle que chargée par la route. */
export type CockpitProject = Awaited<
    ReturnType<typeof getAdminProjectCockpit>
>;

/** Une phase du fil rouge avec sa definition of done. */
export type CockpitPhase = CockpitProject["phases"][number];

/** Détail du refus de gate remonté par la server action via l'URL. */
export type GateBlockedDetails = {
    blockerActive: boolean;
    openBlockingActions: number;
    openDeliverables: number;
};
