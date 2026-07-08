import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout";
import { Button, StatusBadge } from "@/components/ui";

import { DesignSection, DesignSpecimen } from "./shared";

/**
 * L'en-tête unifié dans ses trois densités — mêmes fondations,
 * territoires différents. Remplacera AdminPageHeader et les en-têtes
 * ad hoc pendant les lots B, C et D.
 */
export function HeadersSection() {
    return (
        <DesignSection
            title="PageHeader — trois territoires, une identité"
            note="Toujours : eyebrow or, titre display, description. Le variant règle la densité, jamais la personnalité."
        >
            <DesignSpecimen label="Variant admin (dense) — avec retour et actions">
                <PageHeader
                    variant="admin"
                    eyebrow="Cockpit projet"
                    title="TEST Audit UX — La Fabrique du Thé"
                    description="Site vitrine · Playbook « Site vitrine » · le fil rouge se pilote ici."
                    backHref="/admin/design"
                    backLabel="Tous les projets"
                    actions={
                        <>
                            <StatusBadge tone="action" label="1 retouche" pulse />
                            <Button size="sm" variant="secondary">
                                Partager
                            </Button>
                        </>
                    }
                />
            </DesignSpecimen>

            <DesignSpecimen label="Variant client (chaleureux)">
                <PageHeader
                    variant="client"
                    eyebrow="Votre projet"
                    title="La Fabrique du Thé"
                    description="Suivez l'avancement, retrouvez vos documents et répondez aux validations — tout se passe ici."
                />
            </DesignSpecimen>

            <DesignSpecimen label="Variant public (ample)">
                <PageHeader
                    variant="public"
                    eyebrow="Contact"
                    title="Parlons de ton projet."
                    description="Réponse sous 48 h ouvrées — et si ton besoin est déjà clair, le parcours guidé va plus vite."
                    actions={
                        <Button size="sm" iconLeft={<Plus />}>
                            Présenter mon projet
                        </Button>
                    }
                />
            </DesignSpecimen>
        </DesignSection>
    );
}
