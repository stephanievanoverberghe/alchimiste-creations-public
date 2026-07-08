import { Toast } from "@/components/ui";

import { DesignSection, DesignSpecimen } from "./shared";

/**
 * Retours d'action : le Toast dans ses tons. Trois placements possibles —
 * `top` (confirmation en haut d'écran, ex. message de contact envoyé),
 * `bottom-right` (admin), `inline` (dans le flux, montré ici). `showProgress`
 * ajoute la barre de temps ; `autoDismiss` fait disparaître au bout de
 * `durationMs`.
 */
export function FeedbackSection() {
    return (
        <DesignSection
            title="Retour d'action — Toast"
            note="Notification de statut. En haut d'écran avec barre de progression du temps pour les confirmations (message de contact envoyé), en bas à droite en admin, ou inline. Ici en placement inline pour rester visible ; showProgress anime la barre de temps une fois."
        >
            <div className="grid gap-4 md:grid-cols-2">
                <DesignSpecimen label="Succès — barre de temps (showProgress)">
                    <Toast
                        tone="success"
                        title="Message envoyé"
                        durationMs={7000}
                        showProgress
                        dismissible
                    >
                        Ton message est bien parti. Réponse sous 2 jours ouvrés.
                    </Toast>
                </DesignSpecimen>

                <DesignSpecimen label="Info">
                    <Toast tone="info" title="Brouillon enregistré" dismissible>
                        Tes modifications sont sauvegardées automatiquement.
                    </Toast>
                </DesignSpecimen>

                <DesignSpecimen label="Avertissement">
                    <Toast tone="warning" title="Sections à compléter">
                        Deux sections ne sont pas encore remplies.
                    </Toast>
                </DesignSpecimen>

                <DesignSpecimen label="Erreur">
                    <Toast tone="danger" title="Envoi impossible" dismissible>
                        Vérifie ta connexion puis réessaie.
                    </Toast>
                </DesignSpecimen>
            </div>
        </DesignSection>
    );
}
