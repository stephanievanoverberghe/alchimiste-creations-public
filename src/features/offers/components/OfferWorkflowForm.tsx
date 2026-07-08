"use client";

import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    Circle,
    Eye,
    Image as ImageIcon,
    Link as LinkIcon,
    Save,
    Sparkles,
    Tag,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { Badge, Button } from "@/components/ui";
import {
    type CloudinaryImageUploadConfig,
    MediaImageField,
    type MediaImageFieldAsset,
    Select,
    Switch,
    TextField,
} from "@/components/ui/forms";
import { cn } from "@/components/ui/forms/shared";
import { formatEurosInputValue } from "@/lib/formatters";

type OfferFamilyOption = {
    id: string;
    name: string;
    slug: string;
};

type PublicOfferOption = {
    description: string;
    family: string;
    href: string;
    image: {
        alt: string;
        desktop: string;
        src: string;
        tablet: string;
    };
    name: string;
    price: string;
    slug: string;
};

type OfferFormModel = {
    id?: string;
    family: string;
    familyId: string | null;
    imageAlt: string | null;
    imageSrc: string | null;
    isActive: boolean;
    name: string;
    publicHref: string | null;
    slug: string;
    sortOrder: number;
    startingPriceCents: number | null;
    startingPriceLabel: string | null;
};

type OfferFormValues = {
    familyId: string;
    imageAlt: string;
    imageSrc: string;
    isActive: boolean;
    name: string;
    publicHref: string;
    publicOfferSlug: string;
    slug: string;
    sortOrder: string;
    startingPrice: string;
    startingPriceLabel: string;
};

type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const offerSteps = [
    {
        id: "mapping",
        title: "Correspondance",
        icon: LinkIcon,
        fields: ["publicOfferSlug", "name", "slug", "familyId"],
    },
    {
        id: "commercial",
        title: "Commercial",
        icon: Tag,
        fields: ["startingPrice", "startingPriceLabel"],
    },
    {
        id: "visuals",
        title: "Visuel",
        icon: ImageIcon,
        fields: ["imageSrc", "imageAlt"],
    },
    {
        id: "publication",
        title: "Publication",
        icon: BadgeCheck,
        fields: ["publicHref", "sortOrder", "isActive"],
    },
] as const;

export function OfferWorkflowForm({
    action,
    cloudinary,
    families,
    mediaAssets,
    offer,
    publicOffers,
    isEditing,
}: {
    action: (formData: FormData) => void | Promise<void>;
    cloudinary?: CloudinaryImageUploadConfig;
    families: OfferFamilyOption[];
    mediaAssets: MediaImageFieldAsset[];
    offer?: OfferFormModel;
    publicOffers: PublicOfferOption[];
    isEditing: boolean;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const submitIntentRef = useRef(false);
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>(
        isEditing ? offerSteps.map((_, index) => index) : [],
    );
    const [values, setValues] = useState<OfferFormValues>(() =>
        getInitialOfferValues({ families, offer, publicOffers }),
    );
    const selectedPublicOffer = publicOffers.find(
        (publicOffer) => publicOffer.slug === values.publicOfferSlug,
    );
    const selectedFamily = families.find(
        (family) => family.id === values.familyId,
    );

    function syncPreview() {
        const form = formRef.current;
        if (!form) return;

        setValues(getOfferValuesFromForm(form));
    }

    function applyPublicOffer(slug: string) {
        const publicOffer = publicOffers.find((item) => item.slug === slug);
        if (!publicOffer) {
            setValues((current) => ({ ...current, publicOfferSlug: "" }));
            return;
        }

        const familyMatch = findFamilyForPublicOffer(families, publicOffer);

        setValues((current) => ({
            ...current,
            publicOfferSlug: publicOffer.slug,
            name: publicOffer.name,
            slug: publicOffer.slug,
            familyId: familyMatch?.id ?? current.familyId,
            publicHref: publicOffer.href,
            imageAlt: current.imageAlt || publicOffer.image.alt,
            startingPriceLabel: publicOffer.price,
        }));
    }

    function validateStep(stepIndex: number) {
        const form = formRef.current;
        if (!form) return false;

        const controls = offerSteps[stepIndex].fields.flatMap((fieldName) =>
            getNamedControls(form, fieldName),
        );
        const invalidControl = controls.find((control) => !control.checkValidity());

        if (invalidControl) {
            invalidControl.reportValidity();
            invalidControl.focus();
            return false;
        }

        setCompletedSteps((current) =>
            current.includes(stepIndex) ? current : [...current, stepIndex],
        );
        return true;
    }

    function goToStep(stepIndex: number) {
        if (stepIndex <= activeStep || completedSteps.includes(stepIndex - 1)) {
            setActiveStep(stepIndex);
        }
    }

    function goNext() {
        if (!validateStep(activeStep)) return;

        setActiveStep((current) =>
            Math.min(current + 1, offerSteps.length - 1),
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        syncPreview();

        if (!submitIntentRef.current) {
            event.preventDefault();

            if (!validateStep(activeStep)) return;

            if (activeStep < offerSteps.length - 1) {
                setActiveStep((current) =>
                    Math.min(current + 1, offerSteps.length - 1),
                );
            }
            return;
        }

        submitIntentRef.current = false;

        for (let stepIndex = 0; stepIndex < offerSteps.length; stepIndex += 1) {
            if (!validateStep(stepIndex)) {
                event.preventDefault();
                setActiveStep(stepIndex);
                return;
            }
        }
    }

    return (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <form
                ref={formRef}
                action={action}
                onChange={syncPreview}
                onSubmit={handleSubmit}
                className="flex flex-col gap-2"
            >
                {offer ? <input type="hidden" name="id" value={offer.id} /> : null}

                <div className="h-fit rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Fil rouge
                    </p>
                    <ol className="mt-4 grid gap-2 md:grid-cols-4">
                        {offerSteps.map((step, index) => {
                            const isActive = activeStep === index;
                            const isComplete = completedSteps.includes(index);
                            const StepIcon = step.icon;

                            return (
                                <li key={step.id}>
                                    <button
                                        type="button"
                                        onClick={() => goToStep(index)}
                                        className={cn(
                                            "focus-ring flex h-full w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                                            isActive
                                                ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)]"
                                                : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-muted)] hover:border-[color:var(--color-action-hover)]",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                                                isComplete
                                                    ? "bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]"
                                                    : isActive
                                                        ? "bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)]"
                                                        : "bg-[var(--color-surface-interactive)] text-[color:var(--color-text-subtle)]",
                                            )}
                                        >
                                            {isComplete ? (
                                                <CheckCircle2 className="size-4" aria-hidden="true" />
                                            ) : isActive ? (
                                                <StepIcon className="size-4" aria-hidden="true" />
                                            ) : (
                                                <Circle className="size-4" aria-hidden="true" />
                                            )}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-label text-[color:var(--color-text-default)]">
                                                {step.title}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <OfferStepPanel
                    icon={<LinkIcon className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 0}
                    title="Correspondance"
                    description="Relie l'offre CRM à une offre publique existante, puis vérifie son nom, son slug et sa famille."
                >
                    <Select
                        name="publicOfferSlug"
                        label="Offre publique existante"
                        value={values.publicOfferSlug}
                        onValueChange={applyPublicOffer}
                        options={[
                            { value: "", label: "Aucune correspondance" },
                            ...publicOffers.map((publicOffer) => ({
                                value: publicOffer.slug,
                                label: publicOffer.name,
                            })),
                        ]}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                            name="name"
                            label="Nom"
                            value={values.name}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    name: event.target.value,
                                }))
                            }
                            placeholder="Site vitrine"
                            required
                        />
                        <TextField
                            name="slug"
                            label="Slug"
                            value={values.slug}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    slug: event.target.value,
                                }))
                            }
                            placeholder="site-vitrine"
                            helperText="Optionnel : généré depuis le nom si vide."
                        />
                    </div>
                    <Select
                        name="familyId"
                        label="Famille"
                        value={values.familyId}
                        onValueChange={(nextValue) =>
                            setValues((current) => ({
                                ...current,
                                familyId: nextValue,
                            }))
                        }
                        options={families.map((family) => ({
                            value: family.id,
                            label: family.name,
                        }))}
                    />
                </OfferStepPanel>

                <OfferStepPanel
                    icon={<Tag className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 1}
                    title="Commercial"
                    description="Pose les repères utiles au CRM : prix de départ lisible, montant de départ et statut vendable."
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                            name="startingPrice"
                            type="number"
                            min={0}
                            step="0.01"
                            label="Prix à partir de (€)"
                            value={values.startingPrice}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    startingPrice: event.target.value,
                                }))
                            }
                            placeholder="2000"
                        />
                        <TextField
                            name="startingPriceLabel"
                            label="Libellé prix"
                            value={values.startingPriceLabel}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    startingPriceLabel: event.target.value,
                                }))
                            }
                            placeholder="À partir de 2 000 €"
                        />
                    </div>
                </OfferStepPanel>

                <OfferStepPanel
                    icon={<ImageIcon className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 2}
                    title="Visuel"
                    description="Ajoute une image de secours pour l'admin quand l'offre n'est pas encore reliée à un contenu public complet."
                >
                    <MediaImageField
                        name="imageSrc"
                        label="Image de l'offre"
                        assets={mediaAssets}
                        assetAlt={values.imageAlt || values.name}
                        assetTitle={values.name || "Offre"}
                        cloudinary={cloudinary}
                        defaultValue={values.imageSrc}
                        folder="alchimiste-creations/offers"
                        helperText="Image de secours pour le catalogue admin."
                        onValueChange={syncPreview}
                        usage="OFFER"
                    />
                    <TextField
                        name="imageAlt"
                        label="Texte alternatif"
                        value={values.imageAlt}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                imageAlt: event.target.value,
                            }))
                        }
                        placeholder="Aperçu de l'offre"
                    />
                </OfferStepPanel>

                <OfferStepPanel
                    icon={<BadgeCheck className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 3}
                    title="Publication"
                    description="Vérifie le lien public, l'ordre d'affichage et si l'offre est vendable dans l'admin."
                >
                    <TextField
                        name="publicHref"
                        label="Lien public"
                        value={values.publicHref}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                publicHref: event.target.value,
                            }))
                        }
                        placeholder="/offres/site-vitrine"
                        iconLeft={<LinkIcon className="size-4" aria-hidden="true" />}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                            name="sortOrder"
                            type="number"
                            min={0}
                            label="Ordre"
                            value={values.sortOrder}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    sortOrder: event.target.value,
                                }))
                            }
                        />
                        <Switch
                            name="isActive"
                            label="Offre active"
                            helperText="Disponible comme offre vendable dans le CRM."
                            checked={values.isActive}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    isActive: event.target.checked,
                                }))
                            }
                        />
                    </div>
                </OfferStepPanel>

                <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-surface-default)_92%,transparent)] p-3 shadow-xl shadow-black/25 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {activeStep < offerSteps.length - 1
                            ? "Valide cette étape pour ouvrir la suite."
                            : isEditing
                                ? "Enregistre les modifications quand tout est correct."
                                : "Crée l'offre quand tout est prêt."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {activeStep > 0 ? (
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setActiveStep((current) => current - 1);
                                }}
                            >
                                Retour
                            </Button>
                        ) : null}
                        {activeStep < offerSteps.length - 1 ? (
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                                onClick={goNext}
                            >
                                Valider et continuer
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                iconLeft={<Save className="size-4" aria-hidden="true" />}
                                onClick={() => {
                                    submitIntentRef.current = true;
                                }}
                            >
                                {isEditing ? "Enregistrer les modifications" : "Créer l'offre"}
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            <aside className="grid content-start gap-4 xl:sticky xl:top-24">
                <OfferPreviewCard
                    familyLabel={selectedFamily?.name ?? selectedPublicOffer?.family}
                    publicOffer={selectedPublicOffer}
                    values={values}
                />
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                            <Sparkles className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                Zéro doublon inutile
                            </p>
                            <p className="text-caption text-[color:var(--color-text-subtle)]">
                                Le détail marketing reste dans le content.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-3 text-body-small text-[color:var(--color-text-muted)]">
                        <p>
                            En base, l&apos;offre sert au CRM : pipeline, devis, projets et filtres.
                        </p>
                        <p>
                            Les blocs longs comme le périmètre, la méthode, les options et le SEO restent dans `src/content/offers/details` tant que le site public n&apos;est pas branché à la DB.
                        </p>
                    </div>
                </div>
            </aside>
        </section>
    );
}

function OfferStepPanel({
    children,
    description,
    icon,
    isActive,
    title,
}: {
    children: ReactNode;
    description: string;
    icon: ReactNode;
    isActive: boolean;
    title: string;
}) {
    return (
        <section
            className={cn(
                "rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5",
                !isActive && "hidden",
            )}
        >
            <div className="mb-5 flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                    {icon}
                </span>
                <div>
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        {title}
                    </h2>
                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                        {description}
                    </p>
                </div>
            </div>
            <div className="grid gap-4">{children}</div>
        </section>
    );
}

function OfferPreviewCard({
    familyLabel,
    publicOffer,
    values,
}: {
    familyLabel?: string;
    publicOffer?: PublicOfferOption;
    values: OfferFormValues;
}) {
    const imageSrc = values.imageSrc || publicOffer?.image.desktop || publicOffer?.image.src;
    const title = values.name || publicOffer?.name || "Nouvelle offre";
    const description =
        publicOffer?.description ||
        "L'aperçu se met à jour pendant la saisie pour vérifier le rendu dans le catalogue admin.";
    const price = values.startingPriceLabel || publicOffer?.price || "Prix à cadrer";

    return (
        <article className="group relative min-h-[390px] overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            {imageSrc ? (
                <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${imageSrc})` }}
                    aria-hidden="true"
                />
            ) : null}
            <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.32),rgba(10,8,5,0.62)_46%,rgba(10,8,5,0.95))]"
                aria-hidden="true"
            />
            <div className="relative z-10 flex min-h-[390px] flex-col justify-between gap-8 p-4">
                <div className="flex flex-wrap gap-2">
                    <Badge tone={values.isActive ? "success" : "draft"} size="sm">
                        {values.isActive ? "Active" : "Stand-by"}
                    </Badge>
                    {familyLabel ? (
                        <Badge tone="info" size="sm">
                            {familyLabel}
                        </Badge>
                    ) : null}
                </div>

                <div className="grid gap-4">
                    <div>
                        <p className="text-caption uppercase text-[color:var(--color-decor-gold)]">
                            {price}
                        </p>
                        <h3 className="mt-2 text-h3 text-white">{title}</h3>
                        <p className="mt-2 line-clamp-3 text-body-small text-white/76">
                            {description}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <OfferDataRow label="slug" value={values.slug || slugify(values.name) || "nouvelle-offre"} />
                        <OfferDataRow label="href" value={values.publicHref || "/offres/..."} />
                        <OfferDataRow label="source" value={publicOffer ? "content public relié" : "offre CRM seule"} />
                    </div>
                    {values.publicHref ? (
                        <Button
                            href={values.publicHref}
                            variant="secondary"
                            size="sm"
                            iconLeft={<Eye className="size-4" aria-hidden="true" />}
                        >
                            Voir le contexte
                        </Button>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

function OfferDataRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-sm">
            <span className="text-caption uppercase text-white/58">{label}</span>
            <span className="truncate text-caption text-white/80">{value}</span>
        </div>
    );
}

function getInitialOfferValues({
    families,
    offer,
    publicOffers,
}: {
    families: OfferFamilyOption[];
    offer?: OfferFormModel;
    publicOffers: PublicOfferOption[];
}): OfferFormValues {
    const publicOffer = offer
        ? publicOffers.find((item) => item.slug === offer.slug)
        : undefined;
    const familyId =
        offer?.familyId ??
        families.find((family) => family.slug === offer?.family)?.id ??
        findFamilyForPublicOffer(families, publicOffer)?.id ??
        families[0]?.id ??
        "";

    return {
        familyId,
        imageAlt: offer?.imageAlt ?? publicOffer?.image.alt ?? "",
        imageSrc: offer?.imageSrc ?? "",
        isActive: offer?.isActive ?? true,
        name: offer?.name ?? publicOffer?.name ?? "",
        publicHref: offer?.publicHref ?? publicOffer?.href ?? "",
        publicOfferSlug: publicOffer?.slug ?? "",
        slug: offer?.slug ?? publicOffer?.slug ?? "",
        sortOrder: String(offer?.sortOrder ?? 100),
        startingPrice: formatEurosInputValue(offer?.startingPriceCents ?? null),
        startingPriceLabel: offer?.startingPriceLabel ?? publicOffer?.price ?? "",
    };
}

function getOfferValuesFromForm(form: HTMLFormElement): OfferFormValues {
    const formData = new FormData(form);

    return {
        familyId: getFormString(formData, "familyId"),
        imageAlt: getFormString(formData, "imageAlt"),
        imageSrc: getFormString(formData, "imageSrc"),
        isActive: formData.get("isActive") === "on",
        name: getFormString(formData, "name"),
        publicHref: getFormString(formData, "publicHref"),
        publicOfferSlug: getFormString(formData, "publicOfferSlug"),
        slug: getFormString(formData, "slug"),
        sortOrder: getFormString(formData, "sortOrder"),
        startingPrice: getFormString(formData, "startingPrice"),
        startingPriceLabel: getFormString(formData, "startingPriceLabel"),
    };
}

function findFamilyForPublicOffer(
    families: OfferFamilyOption[],
    publicOffer: PublicOfferOption | undefined,
) {
    if (!publicOffer) return undefined;

    const normalizedFamily = normalizeLabel(publicOffer.family);

    return families.find((family) => {
        const normalizedName = normalizeLabel(family.name);
        const normalizedSlug = normalizeLabel(family.slug);

        return (
            normalizedFamily.includes(normalizedName) ||
            normalizedFamily.includes(normalizedSlug) ||
            normalizedName.includes(normalizedFamily)
        );
    });
}

function getFormString(formData: FormData, name: string) {
    const value = formData.get(name);

    return typeof value === "string" ? value : "";
}

function getNamedControls(form: HTMLFormElement, name: string): FormControl[] {
    const element = form.elements.namedItem(name);
    if (!element) return [];

    if (element instanceof RadioNodeList) {
        return Array.from(element).filter(
            (item) => item instanceof HTMLInputElement,
        );
    }

    if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
    ) {
        return [element];
    }

    return [];
}

function normalizeLabel(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
}

function slugify(value: string) {
    return normalizeLabel(value).replace(/^-+|-+$/g, "");
}
