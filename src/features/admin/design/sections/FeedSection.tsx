import {
    FileCheck2,
    MessageSquareText,
    Rocket,
    ShieldAlert,
} from "lucide-react";

import { ActivityFeed } from "@/components/ui";

import { DesignSection, DesignSpecimen } from "./shared";

const sampleItems = [
    {
        id: "1",
        title: "Cahier des charges validé par le client",
        description: "« Parfait pour moi, on peut avancer ! »",
        timestamp: "il y a 2 h",
        tone: "success" as const,
        icon: <FileCheck2 />,
    },
    {
        id: "2",
        title: "Retouche demandée sur le cadrage commercial",
        description: "Le client souhaite préciser la section « Hors périmètre ».",
        timestamp: "hier",
        tone: "action" as const,
        icon: <MessageSquareText />,
    },
    {
        id: "3",
        title: "Blocage signalé : accès hébergeur manquant",
        timestamp: "3 juillet",
        tone: "danger" as const,
        icon: <ShieldAlert />,
    },
    {
        id: "4",
        title: "Phase Kickoff terminée — Cadrage ouvert",
        timestamp: "2 juillet",
        tone: "neutral" as const,
        icon: <Rocket />,
    },
];

/**
 * Le fil d'activité unifié qui fusionnera les timelines admin et
 * client (même composant, données filtrées par audience côté serveur).
 */
export function FeedSection() {
    return (
        <DesignSection
            title="ActivityFeed — la ligne de vie"
            note="Événements datés, ton par nature d'événement, ligne de vie dorée. Les horodatages arrivent déjà formatés (formatters F4)."
        >
            <DesignSpecimen label="Fil type (cockpit ou espace client)">
                <div className="max-w-[640px]">
                    <ActivityFeed items={sampleItems} />
                </div>
            </DesignSpecimen>
        </DesignSection>
    );
}
