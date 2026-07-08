import { ArrowRight, Plus } from "lucide-react";

import { Badge, Button, StatusBadge } from "@/components/ui";

import { DesignSection, DesignSpecimen } from "./shared";

const statusTones = [
    ["success", "Validé"],
    ["warning", "En attente"],
    ["danger", "Bloqué"],
    ["info", "Partagé"],
    ["neutral", "À faire"],
    ["draft", "Brouillon"],
    ["action", "Votre décision"],
] as const;

/**
 * Primitifs interactifs : boutons (états complets) et badges de statut
 * unifiés — les libellés viennent toujours de status-labels (F4).
 */
export function PrimitivesSection() {
    return (
        <DesignSection
            title="Primitifs — Button, Badge, StatusBadge"
            note="Chaque état est exigible : hover, focus clavier (Tab), actif, désactivé, chargement. Le StatusBadge remplace tous les badges de statut ad hoc."
        >
            <DesignSpecimen label="Button — variantes et états">
                <div className="flex flex-wrap items-center gap-3">
                    <Button iconRight={<ArrowRight />}>Action principale</Button>
                    <Button variant="secondary" iconLeft={<Plus />}>
                        Secondaire
                    </Button>
                    <Button variant="ghost">Discret</Button>
                    <Button loading>Chargement</Button>
                    <Button disabled>Désactivé</Button>
                    <Button variant="solid" tone="success">
                        Valider le gate
                    </Button>
                    <Button variant="solid" tone="danger">
                        Refuser
                    </Button>
                </div>
            </DesignSpecimen>

            <div className="grid gap-6 md:grid-cols-2">
                <DesignSpecimen label="StatusBadge — tons par audience">
                    <div className="flex flex-wrap items-center gap-2.5">
                        {statusTones.map(([tone, label]) => (
                            <StatusBadge key={tone} tone={tone} label={label} />
                        ))}
                    </div>
                </DesignSpecimen>

                <DesignSpecimen label="StatusBadge — tailles et pastille animée">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <StatusBadge
                            tone="action"
                            label="Validation attendue"
                            pulse
                        />
                        <StatusBadge
                            tone="danger"
                            label="Blocage actif"
                            pulse
                            size="sm"
                        />
                        <StatusBadge tone="success" label="Phase terminée" size="sm" />
                        <Badge tone="brand">Badge libre</Badge>
                    </div>
                </DesignSpecimen>
            </div>
        </DesignSection>
    );
}
