"use client";

import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    Circle,
    Eye,
    Hash,
    Image as ImageIcon,
    Link as LinkIcon,
    Save,
    Sparkles,
    Type,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { Badge, Button } from "@/components/ui";
import {
    type CloudinaryImageUploadConfig,
    MediaImageField,
    type MediaImageFieldAsset,
    Switch,
    Textarea,
    TextField,
} from "@/components/ui/forms";
import { cn } from "@/components/ui/forms/shared";

type OfferFamilyFormModel = {
    id?: string;
    badge: string | null;
    description: string | null;
    eyebrow: string | null;
    imageAlt: string | null;
    imageDesktop: string | null;
    imageSrc: string | null;
    imageTablet: string | null;
    isActive: boolean;
    name: string;
    publicHref: string | null;
    slug: string;
    sortOrder: number;
    title: string | null;
};

type FamilyFormValues = {
    badge: string;
    description: string;
    eyebrow: string;
    imageAlt: string;
    imageDesktop: string;
    imageSrc: string;
    imageTablet: string;
    isActive: boolean;
    name: string;
    publicHref: string;
    slug: string;
    sortOrder: string;
    title: string;
};

type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const familySteps = [
    {
        id: "identity",
        title: "Identité",
        icon: Hash,
        fields: ["name", "slug", "badge", "sortOrder"],
    },
    {
        id: "marketing",
        title: "Contenu marketing",
        icon: Type,
        fields: ["eyebrow", "title", "description"],
    },
    {
        id: "visuals",
        title: "Visuels",
        icon: ImageIcon,
        fields: ["imageSrc", "imageTablet", "imageDesktop", "imageAlt"],
    },
    {
        id: "publication",
        title: "Publication",
        icon: BadgeCheck,
        fields: ["publicHref", "isActive"],
    },
] as const;

export function OfferFamilyWorkflowForm({
    action,
    cloudinary,
    family,
    mediaAssets,
    isEditing,
}: {
    action: (formData: FormData) => void | Promise<void>;
    cloudinary?: CloudinaryImageUploadConfig;
    family?: OfferFamilyFormModel;
    mediaAssets: MediaImageFieldAsset[];
    isEditing: boolean;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const submitIntentRef = useRef(false);
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>(
        isEditing ? familySteps.map((_, index) => index) : [],
    );
    const [values, setValues] = useState<FamilyFormValues>(() =>
        getInitialFamilyValues(family),
    );

    function syncPreview() {
        const form = formRef.current;
        if (!form) return;

        setValues(getFamilyValuesFromForm(form));
    }

    function validateStep(stepIndex: number) {
        const form = formRef.current;
        if (!form) return false;

        const controls = familySteps[stepIndex].fields.flatMap((fieldName) =>
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
            Math.min(current + 1, familySteps.length - 1),
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        syncPreview();

        if (!submitIntentRef.current) {
            event.preventDefault();

            if (!validateStep(activeStep)) return;

            if (activeStep < familySteps.length - 1) {
                setActiveStep((current) =>
                    Math.min(current + 1, familySteps.length - 1),
                );
            }
            return;
        }

        submitIntentRef.current = false;

        for (let stepIndex = 0; stepIndex < familySteps.length; stepIndex += 1) {
            if (!validateStep(stepIndex)) {
                event.preventDefault();
                setActiveStep(stepIndex);
                return;
            }
        }
    }

    return (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <form
                ref={formRef}
                action={action}
                onChange={syncPreview}
                onSubmit={handleSubmit}
                className="flex flex-col gap-2"
            >
                {family ? <input type="hidden" name="id" value={family.id} /> : null}

                <div className="h-fit rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Fil rouge
                    </p>
                    <ol className="mt-4 grid gap-2 md:grid-cols-4">
                        {familySteps.map((step, index) => {
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

                <FamilyStepPanel
                    icon={<Hash className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 0}
                    title="Identité"
                    description="Choisis le nom affiché, l'adresse courte, le badge et l'ordre d'affichage."
                >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
                        <TextField
                            name="name"
                            label="Nom"
                            placeholder="Créer"
                            defaultValue={family?.name ?? ""}
                            required
                        />
                        <TextField
                            name="slug"
                            label="Slug"
                            placeholder="creer"
                            defaultValue={family?.slug ?? ""}
                            helperText="Optionnel : généré depuis le nom si vide."
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                            name="badge"
                            label="Badge"
                            placeholder="01 — Créer"
                            defaultValue={family?.badge ?? ""}
                        />
                        <TextField
                            name="sortOrder"
                            type="number"
                            min={0}
                            label="Ordre"
                            defaultValue={family?.sortOrder ?? 100}
                        />
                    </div>
                </FamilyStepPanel>

                <FamilyStepPanel
                    icon={<Type className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 1}
                    title="Contenu marketing"
                    description="Rédige les textes visibles sur la carte : petite accroche, grand titre et résumé."
                >
                    <TextField
                        name="eyebrow"
                        label="Accroche courte"
                        placeholder="Partir d'une base claire"
                        defaultValue={family?.eyebrow ?? ""}
                    />
                    <TextField
                        name="title"
                        label="Titre marketing"
                        placeholder="Créer une présence claire et vendable"
                        defaultValue={family?.title ?? ""}
                        required
                    />
                    <Textarea
                        name="description"
                        label="Description"
                        placeholder="Décris en une ou deux phrases ce que cette famille regroupe."
                        defaultValue={family?.description ?? ""}
                        maxLength={280}
                        required
                        helperText="Maximum 280 caractères pour rester exploitable dans les cartes."
                    />
                </FamilyStepPanel>

                <FamilyStepPanel
                    icon={<ImageIcon className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 2}
                    title="Visuels"
                    description="Ajoute les images et le texte alternatif pour reconnaître la famille facilement."
                >
                    <MediaImageField
                        name="imageSrc"
                        label="Image principale"
                        assets={mediaAssets}
                        assetAlt={values.imageAlt}
                        assetTitle={values.name || values.title || "Famille d'offres"}
                        cloudinary={cloudinary}
                        folder="alchimiste-creations/offer-families"
                        helperText="Image utilisée en priorité pour la carte et l'aperçu."
                        defaultValue={family?.imageSrc ?? ""}
                        onValueChange={syncPreview}
                        required
                        usage="OFFER_FAMILY"
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <MediaImageField
                            name="imageTablet"
                            label="Image tablette"
                            assets={mediaAssets}
                            assetAlt={values.imageAlt}
                            assetTitle={values.name || values.title || "Famille d'offres"}
                            cloudinary={cloudinary}
                            folder="alchimiste-creations/offer-families"
                            defaultValue={family?.imageTablet ?? ""}
                            onValueChange={syncPreview}
                            usage="OFFER_FAMILY"
                        />
                        <MediaImageField
                            name="imageDesktop"
                            label="Image desktop"
                            assets={mediaAssets}
                            assetAlt={values.imageAlt}
                            assetTitle={values.name || values.title || "Famille d'offres"}
                            cloudinary={cloudinary}
                            folder="alchimiste-creations/offer-families"
                            defaultValue={family?.imageDesktop ?? ""}
                            onValueChange={syncPreview}
                            usage="OFFER_FAMILY"
                        />
                    </div>
                    <TextField
                        name="imageAlt"
                        label="Texte alternatif"
                        placeholder="Interface, atelier ou extrait visuel de la famille"
                        defaultValue={family?.imageAlt ?? ""}
                        required
                    />
                </FamilyStepPanel>

                <FamilyStepPanel
                    icon={<BadgeCheck className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 3}
                    title="Publication"
                    description="Définis le lien de référence et indique si cette famille est utilisable dans l'admin."
                >
                    <TextField
                        name="publicHref"
                        label="Lien public"
                        placeholder="/offres#creer"
                        defaultValue={family?.publicHref ?? ""}
                        iconLeft={<LinkIcon className="size-4" aria-hidden="true" />}
                    />
                    <Switch
                        name="isActive"
                        label="Famille active"
                        helperText="Disponible dans les formulaires d'offres et les vues admin."
                        checked={values.isActive}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                isActive: event.target.checked,
                            }))
                        }
                    />
                </FamilyStepPanel>

                <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-surface-default)_92%,transparent)] p-3 shadow-xl shadow-black/25 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {activeStep < familySteps.length - 1
                            ? "Valide cette étape pour ouvrir la suite."
                            : isEditing
                                ? "Enregistre les modifications quand tout est correct."
                                : "Crée la famille quand tout est prêt."}
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
                        {activeStep < familySteps.length - 1 ? (
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
                                {isEditing
                                    ? "Enregistrer les modifications"
                                    : "Créer la famille"}
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            <aside className="grid content-start gap-4 xl:sticky xl:top-24">
                <FamilyPreviewCard values={values} />
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                            <Sparkles className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                Données attendues
                            </p>
                            <p className="text-caption text-[color:var(--color-text-subtle)]">
                                Même logique que `src/content/offers`
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-3 text-body-small text-[color:var(--color-text-muted)]">
                        <p>
                            Le slug correspond à l&apos;id stable de la famille, le nom au label public, puis les textes et images reprennent les cartes marketing.
                        </p>
                        <p>
                            Le site public reste indépendant tant qu&apos;il n&apos;est pas branché aux données en base.
                        </p>
                    </div>
                </div>
            </aside>
        </section>
    );
}

function FamilyStepPanel({
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

function FamilyPreviewCard({ values }: { values: FamilyFormValues }) {
    const title = values.title || values.name || "Nouvelle famille";
    const description =
        values.description ||
        "L'aperçu se met à jour pendant la saisie pour vérifier le rendu de la carte.";
    const imageSrc = values.imageDesktop || values.imageSrc;
    const label = values.name || "Famille";
    const publicHref = values.publicHref || "/offres#...";

    return (
        <article className="overflow-hidden rounded-3xl border border-[color:rgba(255,243,224,0.18)] bg-[var(--color-bg-deep)] shadow-lg shadow-black/25">
            <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden p-4">
                {imageSrc ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                        style={{ backgroundImage: `url(${imageSrc})` }}
                        aria-hidden="true"
                    />
                ) : null}
                <div
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,14,11,0.18)_0%,rgba(15,14,11,0.52)_48%,rgba(15,14,11,0.94)_100%)]"
                    aria-hidden="true"
                />
                <div className="relative z-10 flex items-start justify-between gap-4">
                    <Badge tone={values.isActive ? "brand" : "draft"} size="sm" className="backdrop-blur-sm">
                        {label}
                    </Badge>
                </div>

                <div className="relative z-10 flex min-w-0 flex-col gap-3">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h2 className="text-h3 text-[var(--color-text-default)]">
                            {title}
                        </h2>
                        <p className="line-clamp-3 text-body-small text-[var(--color-text-muted)]">
                            {description}
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full py-2 text-label text-[var(--color-text-muted)]">
                        Explorer
                        <Eye className="size-4" aria-hidden="true" />
                    </span>
                </div>
            </div>
            <div className="grid gap-2 p-4">
                <FamilyDataRow label="id / slug" value={values.slug || slugify(values.name) || "creer"} />
                <FamilyDataRow label="label" value={values.name || "Créer"} />
                <FamilyDataRow label="badge" value={values.badge || "01 — Créer"} />
                <FamilyDataRow label="href" value={publicHref} />
                <Button
                    href={publicHref}
                    variant="secondary"
                    size="sm"
                    iconLeft={<Eye className="size-4" aria-hidden="true" />}
                >
                    Voir le contexte
                </Button>
            </div>
        </article>
    );
}

function FamilyDataRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {label}
            </span>
            <span className="truncate text-caption text-[color:var(--color-text-muted)]">
                {value}
            </span>
        </div>
    );
}

function getInitialFamilyValues(
    family: OfferFamilyFormModel | undefined,
): FamilyFormValues {
    return {
        badge: family?.badge ?? "",
        description: family?.description ?? "",
        eyebrow: family?.eyebrow ?? "",
        imageAlt: family?.imageAlt ?? "",
        imageDesktop: family?.imageDesktop ?? "",
        imageSrc: family?.imageSrc ?? "",
        imageTablet: family?.imageTablet ?? "",
        isActive: family?.isActive ?? true,
        name: family?.name ?? "",
        publicHref: family?.publicHref ?? "",
        slug: family?.slug ?? "",
        sortOrder: String(family?.sortOrder ?? 100),
        title: family?.title ?? "",
    };
}

function getFamilyValuesFromForm(form: HTMLFormElement): FamilyFormValues {
    const formData = new FormData(form);

    return {
        badge: getFormString(formData, "badge"),
        description: getFormString(formData, "description"),
        eyebrow: getFormString(formData, "eyebrow"),
        imageAlt: getFormString(formData, "imageAlt"),
        imageDesktop: getFormString(formData, "imageDesktop"),
        imageSrc: getFormString(formData, "imageSrc"),
        imageTablet: getFormString(formData, "imageTablet"),
        isActive: formData.get("isActive") === "on",
        name: getFormString(formData, "name"),
        publicHref: getFormString(formData, "publicHref"),
        slug: getFormString(formData, "slug"),
        sortOrder: getFormString(formData, "sortOrder"),
        title: getFormString(formData, "title"),
    };
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

function slugify(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
