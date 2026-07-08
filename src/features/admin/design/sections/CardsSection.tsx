import {
    BriefcaseBusiness,
    FileCheck2,
    Inbox,
    Wallet,
} from "lucide-react";

import {
    ActionRequiredCard,
    Button,
    DataCard,
    EmptyState,
    NextActionCard,
} from "@/components/ui";

import { DesignSection, DesignSpecimen } from "./shared";

/**
 * Cartes de pilotage : l'action attendue (magnétique), la prochaine
 * action (boussole), les métriques display et l'état vide avec sortie.
 */
export function CardsSection() {
    return (
        <DesignSection
            title="Cartes — ActionRequired, NextAction, DataCard, EmptyState"
            note="Une ActionRequiredCard maximum en haut d'écran ; les DataCard se scannent en une seconde ; un état vide propose toujours une suite."
        >
            <DesignSpecimen label="ActionRequiredCard — ton action puis warning (retard)">
                <div className="grid gap-4 lg:grid-cols-2">
                    <ActionRequiredCard
                        eyebrow="Votre décision est attendue"
                        title="Valider le cahier des charges v02"
                        description="La nouvelle version intègre vos ajustements sur le périmètre et le planning."
                        meta="La Fabrique du Thé · demandé aujourd'hui"
                        action={<Button size="sm">Lire et décider</Button>}
                    />
                    <ActionRequiredCard
                        tone="warning"
                        eyebrow="En attente depuis 6 jours"
                        title="Relancer le devis WoodBox Créations"
                        description="Le devis est parti sans relance planifiée — le pipeline attend."
                        meta="AC-DEM-20260702-001"
                        action={
                            <Button size="sm" variant="secondary">
                                Ouvrir la demande
                            </Button>
                        }
                    />
                </div>
            </DesignSpecimen>

            <DesignSpecimen label="NextActionCard — qui agit maintenant">
                <div className="grid gap-4 md:grid-cols-2">
                    <NextActionCard
                        title="Préparer la liste des contenus attendus"
                        context="Phase Kickoff projet · gate « Projet prêt à lancer »"
                        owner="moi"
                    />
                    <NextActionCard
                        title="Transmettre les accès à l'hébergement"
                        context="Nécessaire pour ouvrir le setup technique"
                        owner="client"
                        action={
                            <Button size="sm" variant="ghost">
                                Envoyer un rappel
                            </Button>
                        }
                    />
                </div>
            </DesignSpecimen>

            <DesignSpecimen label="DataCard — métriques (accent, tendances, cliquable)">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DataCard
                        label="À qualifier"
                        value="3"
                        tone="accent"
                        icon={<Inbox />}
                        trend={{ direction: "up", label: "+2 cette semaine" }}
                        href="/admin/demandes"
                    />
                    <DataCard
                        label="Projets actifs"
                        value="4"
                        icon={<BriefcaseBusiness />}
                        trend={{
                            direction: "flat",
                            label: "stable",
                        }}
                    />
                    <DataCard
                        label="Validations en attente"
                        value="2"
                        icon={<FileCheck2 />}
                        trend={{
                            direction: "down",
                            label: "-1 depuis hier",
                            positive: true,
                        }}
                        hint="côté client"
                    />
                    <DataCard
                        label="À encaisser"
                        value="1 750 €"
                        icon={<Wallet />}
                        hint="solde Maison Nova"
                        href="/admin/finance"
                    />
                </div>
            </DesignSpecimen>

            <DesignSpecimen label="EmptyState — avec action de sortie">
                <EmptyState
                    icon={<Inbox />}
                    title="Aucune demande à qualifier"
                    description="Les nouvelles demandes du formulaire public arrivent ici avec leur opportunité prête à travailler."
                    action={
                        <Button size="sm" variant="secondary">
                            Voir le pipeline
                        </Button>
                    }
                />
            </DesignSpecimen>
        </DesignSection>
    );
}
