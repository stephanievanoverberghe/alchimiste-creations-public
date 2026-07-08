import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui";
import { type MediaImageFieldAsset } from "@/components/ui/forms";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { PortfolioProjectWorkflowForm } from "@/features/portfolio/components/PortfolioProjectWorkflowForm";
import {
    createPortfolioProjectAction,
    updatePortfolioProjectAction,
} from "@/server/portfolio/actions";
import {
    getAdminPortfolioProject,
    getPortfolioOfferOptions,
} from "@/server/portfolio/realisations";

type EditablePortfolioProject = NonNullable<
    Awaited<ReturnType<typeof getAdminPortfolioProject>>
>;

type PortfolioOfferOption = Awaited<
    ReturnType<typeof getPortfolioOfferOptions>
>[number];

export function PortfolioProjectCreatePage({
    mediaAssets,
    offers,
    project,
}: {
    mediaAssets: MediaImageFieldAsset[];
    offers: PortfolioOfferOption[];
    project?: EditablePortfolioProject;
}) {
    const isEditing = Boolean(project);

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Portfolio"
                title={isEditing ? "Modifier une réalisation" : "Créer une réalisation"}
                description={
                    isEditing
                        ? "Mets à jour un cas portfolio administrable sans modifier la page publique actuelle."
                        : "Ajoute une réalisation côté admin pour préparer le futur pilotage du portfolio."
                }
                actions={
                    <Button
                        href="/admin/realisations"
                        variant="secondary"
                        size="sm"
                        iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                        Retour au portfolio
                    </Button>
                }
            />

            <PortfolioProjectWorkflowForm
                action={
                    isEditing
                        ? updatePortfolioProjectAction
                        : createPortfolioProjectAction
                }
                cloudinary={getCloudinaryConfig()}
                mediaAssets={mediaAssets}
                offers={offers}
                project={project}
                isEditing={isEditing}
            />
        </AdminPageShell>
    );
}

function getCloudinaryConfig() {
    return {
        apiKey:
            process.env.CLOUDINARY_API_KEY ??
            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        cloudName:
            process.env.CLOUDINARY_CLOUD_NAME ??
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    };
}
