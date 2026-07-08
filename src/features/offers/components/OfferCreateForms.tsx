import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui";
import { type MediaImageFieldAsset } from "@/components/ui/forms";
import { offerDetailPages } from "@/content/offers";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { OfferFamilyWorkflowForm } from "@/features/offers/components/OfferFamilyWorkflowForm";
import { OfferWorkflowForm } from "@/features/offers/components/OfferWorkflowForm";
import {
    createOfferAction,
    createOfferFamilyAction,
    updateOfferAction,
    updateOfferFamilyAction,
} from "@/server/offers/actions";
import {
    getAdminOffer,
    getAdminOfferFamily,
    getAdminOffers,
} from "@/server/offers/offers";

type OfferFamily = Awaited<
    ReturnType<typeof getAdminOffers>
>["families"][number];

type EditableOffer = NonNullable<Awaited<ReturnType<typeof getAdminOffer>>>;

type EditableOfferFamily = NonNullable<
    Awaited<ReturnType<typeof getAdminOfferFamily>>
>;

export function AdminOfferCreatePage({
    families,
    mediaAssets,
    offer,
}: {
    families: OfferFamily[];
    mediaAssets: MediaImageFieldAsset[];
    offer?: EditableOffer;
}) {
    const isEditing = Boolean(offer);
    const publicOffers = offerDetailPages.map((publicOffer) => ({
        description: publicOffer.hero.description,
        family: publicOffer.family,
        href: `/offres/${publicOffer.slug}`,
        image: {
            alt: publicOffer.hero.images.alt,
            desktop: publicOffer.hero.images.desktop,
            src: publicOffer.hero.images.mobile,
            tablet: publicOffer.hero.images.tablet,
        },
        name: publicOffer.hero.eyebrow,
        price: publicOffer.hero.price,
        slug: publicOffer.slug,
    }));

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Catalogue"
                title={isEditing ? "Modifier une offre" : "Créer une offre"}
                description={
                    isEditing
                        ? "Mets à jour une offre du catalogue CRM sans dupliquer le contenu public déjà présent."
                        : "Ajoute une offre au catalogue CRM en la reliant si possible au contenu public existant."
                }
                actions={
                    <Button
                        href="/admin/offres"
                        variant="secondary"
                        size="sm"
                        iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                        Retour au catalogue
                    </Button>
                }
            />

            <OfferWorkflowForm
                action={isEditing ? updateOfferAction : createOfferAction}
                cloudinary={getCloudinaryConfig()}
                families={families}
                mediaAssets={mediaAssets}
                offer={offer}
                publicOffers={publicOffers}
                isEditing={isEditing}
            />
        </AdminPageShell>
    );
}

export function AdminOfferFamilyCreatePage({
    family,
    mediaAssets,
}: {
    family?: EditableOfferFamily;
    mediaAssets: MediaImageFieldAsset[];
}) {
    const isEditing = Boolean(family);

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Catalogue"
                title={isEditing ? "Modifier une famille" : "Créer une famille"}
                description={
                    isEditing
                        ? "Mets à jour une famille commerciale existante avec ses textes, images, statut et ordre."
                        : "Ajoute une famille commerciale pour classer les offres dans le CRM et garder le catalogue lisible."
                }
                actions={
                    <Button
                        href="/admin/offres"
                        variant="secondary"
                        size="sm"
                        iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                        Retour au catalogue
                    </Button>
                }
            />

            <OfferFamilyWorkflowForm
                action={isEditing ? updateOfferFamilyAction : createOfferFamilyAction}
                cloudinary={getCloudinaryConfig()}
                family={family}
                mediaAssets={mediaAssets}
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
