import { PhaseStepper } from "@/components/ui";

import { DesignSection, DesignSpecimen } from "./shared";

const samplePhases = [
    { key: "kickoff", label: "Kickoff projet", state: "done" as const },
    { key: "cadrage", label: "Cadrage stratégique", state: "done" as const },
    { key: "archi", label: "Architecture du site", state: "done" as const },
    { key: "contenus", label: "Contenus et SEO", state: "current" as const },
    { key: "da", label: "Direction artistique", state: "todo" as const },
    { key: "maquettes", label: "Maquettes UI", state: "todo" as const },
    { key: "dev", label: "Développement", state: "todo" as const },
    { key: "recette", label: "Recette client", state: "todo" as const },
    { key: "mise-en-ligne", label: "Mise en ligne", state: "todo" as const },
];

/**
 * Le fil rouge en deux densités : cockpit (admin) et miroir client
 * (célébrant, avec pourcentage). Remplace les deux implémentations
 * ad hoc existantes lors des lots C et D.
 */
export function SteppersSection() {
    return (
        <DesignSection
            title="PhaseStepper — la cascade"
            note="Défilement horizontal au doigt, fondu de débordement, phase courante sous halo cuivre. aria-current='step' sur la phase active."
        >
            <DesignSpecimen label="Variante admin (cockpit, dense)">
                <PhaseStepper phases={samplePhases} variant="admin" />
            </DesignSpecimen>
            <DesignSpecimen label="Variante client (miroir simplifié, célébrant)">
                <PhaseStepper phases={samplePhases} variant="client" />
            </DesignSpecimen>
        </DesignSection>
    );
}
