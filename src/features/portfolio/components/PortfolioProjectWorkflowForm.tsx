"use client";

import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    Circle,
    Eye,
    FileText,
    Image as ImageIcon,
    Link as LinkIcon,
    Save,
    Sparkles,
    Target,
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
    Textarea,
    TextField,
} from "@/components/ui/forms";
import { cn } from "@/components/ui/forms/shared";

type PortfolioOfferOption = {
    id: string;
    isActive: boolean;
    name: string;
    slug: string;
};

type PortfolioProjectFormModel = {
    contextDescription: string | null;
    contextTitle: string | null;
    coverImageUrl: string | null;
    heroImageUrl: string | null;
    highlights: string[];
    id?: string;
    imageAlt: string | null;
    isFeatured: boolean;
    kind: string;
    objectives: string[];
    proofs: string[];
    publicHref: string | null;
    publicationStatus: string;
    relatedOfferId: string | null;
    shortDescription: string;
    slug: string;
    sortOrder: number;
    status: string | null;
    tags: string[];
    title: string;
    typeLabel: string | null;
    websiteUrl: string | null;
};

type PortfolioProjectValues = {
    contextDescription: string;
    contextTitle: string;
    coverImageUrl: string;
    heroImageUrl: string;
    highlights: string;
    imageAlt: string;
    isFeatured: boolean;
    kind: string;
    objectives: string;
    proofs: string;
    publicHref: string;
    publicationStatus: string;
    relatedOfferId: string;
    shortDescription: string;
    slug: string;
    sortOrder: string;
    status: string;
    tags: string;
    title: string;
    typeLabel: string;
    websiteUrl: string;
};

type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const portfolioSteps = [
    {
        id: "identity",
        title: "Identité",
        icon: FileText,
        fields: ["title", "slug", "kind", "relatedOfferId"],
    },
    {
        id: "presentation",
        title: "Présentation",
        icon: Sparkles,
        fields: ["shortDescription", "contextTitle", "contextDescription"],
    },
    {
        id: "proofs",
        title: "Preuves",
        icon: Target,
        fields: ["objectives", "proofs", "tags", "highlights"],
    },
    {
        id: "visuals",
        title: "Visuels",
        icon: ImageIcon,
        fields: ["coverImageUrl", "heroImageUrl", "imageAlt"],
    },
    {
        id: "publication",
        title: "Publication",
        icon: BadgeCheck,
        fields: ["publicationStatus", "sortOrder", "publicHref"],
    },
] as const;

const kindOptions = [
    { value: "CLIENT", label: "Réalisation client" },
    { value: "DEMO", label: "Démonstration personnelle" },
    { value: "REFONTE", label: "Projet en refonte" },
    { value: "CONCEPT", label: "Concept" },
];

const publicationOptions = [
    { value: "DRAFT", label: "Brouillon" },
    { value: "STANDBY", label: "Stand-by" },
    { value: "PUBLISHED", label: "Publiée côté admin" },
    { value: "ARCHIVED", label: "Archivée" },
];

export function PortfolioProjectWorkflowForm({
    action,
    cloudinary,
    mediaAssets,
    offers,
    project,
    isEditing,
}: {
    action: (formData: FormData) => void | Promise<void>;
    cloudinary?: CloudinaryImageUploadConfig;
    mediaAssets: MediaImageFieldAsset[];
    offers: PortfolioOfferOption[];
    project?: PortfolioProjectFormModel;
    isEditing: boolean;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const submitIntentRef = useRef(false);
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>(
        isEditing ? portfolioSteps.map((_, index) => index) : [],
    );
    const [values, setValues] = useState<PortfolioProjectValues>(() =>
        getInitialPortfolioProjectValues(project),
    );
    const selectedOffer = offers.find((offer) => offer.id === values.relatedOfferId);

    function updateRelatedOffer(nextValue: string) {
        const offer = offers.find((item) => item.id === nextValue);

        setValues((current) => ({
            ...current,
            relatedOfferId: nextValue,
            typeLabel: offer?.name ?? "",
        }));
    }

    function syncPreview() {
        const form = formRef.current;
        if (!form) return;

        setValues(getPortfolioProjectValuesFromForm(form));
    }

    function validateStep(stepIndex: number) {
        const form = formRef.current;
        if (!form) return false;

        const controls = portfolioSteps[stepIndex].fields.flatMap((fieldName) =>
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
            Math.min(current + 1, portfolioSteps.length - 1),
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        syncPreview();

        if (!submitIntentRef.current) {
            event.preventDefault();

            if (!validateStep(activeStep)) return;

            if (activeStep < portfolioSteps.length - 1) {
                setActiveStep((current) =>
                    Math.min(current + 1, portfolioSteps.length - 1),
                );
            }
            return;
        }

        submitIntentRef.current = false;

        for (let stepIndex = 0; stepIndex < portfolioSteps.length; stepIndex += 1) {
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
                {project ? <input type="hidden" name="id" value={project.id} /> : null}
                <input type="hidden" name="typeLabel" value={values.typeLabel} />

                <div className="h-fit rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Fil rouge
                    </p>
                    <ol className="mt-4 grid gap-2 md:grid-cols-5">
                        {portfolioSteps.map((step, index) => {
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

                <PortfolioStepPanel
                    icon={<FileText className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 0}
                    title="Identité"
                    description="Pose les repères de classement : nom, adresse courte, nature métier et offre associée."
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                            name="title"
                            label="Titre"
                            value={values.title}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                            placeholder="Norel Art"
                            required
                            helperText="Nom visible dans l’admin et futur titre public si cette fiche est publiée plus tard."
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
                            placeholder="norel-art"
                            helperText="Optionnel : généré depuis le titre si vide."
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Select
                            name="kind"
                            label="Nature"
                            value={values.kind}
                            onValueChange={(nextValue) =>
                                setValues((current) => ({
                                    ...current,
                                    kind: nextValue,
                                }))
                            }
                            options={kindOptions}
                            helperText="La nature précise si c’est un client réel, une démo, une refonte ou un concept."
                        />
                        <Select
                            name="relatedOfferId"
                            label="Offre / type associé"
                            value={values.relatedOfferId}
                            onValueChange={updateRelatedOffer}
                            helperText="Le type affiché reprend le nom de l’offre associée."
                            options={[
                                { value: "", label: "Aucune offre associée" },
                                ...offers.map((offer) => ({
                                    value: offer.id,
                                    label: offer.isActive
                                        ? offer.name
                                        : `${offer.name} · stand-by`,
                                })),
                            ]}
                        />
                    </div>
                    <TextField
                        name="status"
                        label="Note de statut"
                        value={values.status}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                status: event.target.value,
                            }))
                        }
                        placeholder="Exemple : projet client réel, publié avec les éléments autorisés."
                        helperText="Note interne courte pour comprendre le contexte du cas portfolio."
                    />
                </PortfolioStepPanel>

                <PortfolioStepPanel
                    icon={<Sparkles className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 1}
                    title="Présentation"
                    description="Rédige ce qui permettra de comprendre vite le projet : carte, contexte et histoire courte."
                >
                    <Textarea
                        name="shortDescription"
                        label="Résumé de carte"
                        value={values.shortDescription}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                shortDescription: event.target.value,
                            }))
                        }
                        maxLength={360}
                        required
                        helperText="Texte court affiché dans le catalogue admin et les cartes. Maximum 360 caractères."
                    />
                    <TextField
                        name="contextTitle"
                        label="Titre du contexte"
                        value={values.contextTitle}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                contextTitle: event.target.value,
                            }))
                        }
                        placeholder="Un projet entre portfolio, boutique et expérience de marque."
                        helperText="Titre de section pour expliquer pourquoi ce projet existe."
                    />
                    <Textarea
                        name="contextDescription"
                        label="Contexte détaillé"
                        value={values.contextDescription}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                contextDescription: event.target.value,
                            }))
                        }
                        helperText="Décris le point de départ, les enjeux et ce que la réalisation doit prouver."
                    />
                </PortfolioStepPanel>

                <PortfolioStepPanel
                    icon={<Target className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 2}
                    title="Preuves"
                    description="Structure les éléments qui prouvent la valeur du projet. Pour les listes, une ligne = un élément."
                >
                    <Textarea
                        name="objectives"
                        label="Objectifs du projet"
                        value={values.objectives}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                objectives: event.target.value,
                            }))
                        }
                        helperText="Une ligne par objectif : ce que le projet devait clarifier, vendre, organiser ou améliorer."
                    />
                    <Textarea
                        name="proofs"
                        label="Preuves et résultats"
                        value={values.proofs}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                proofs: event.target.value,
                            }))
                        }
                        helperText="Une ligne par preuve : livrable, résultat, décision, amélioration ou élément concret."
                    />
                    <TextField
                        name="tags"
                        label="Tags"
                        value={values.tags}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                tags: event.target.value,
                            }))
                        }
                        placeholder="Projet client, E-commerce, Portfolio"
                        helperText="Sépare les tags par des virgules. Ils servent aux filtres et au repérage admin."
                    />
                    <Textarea
                        name="highlights"
                        label="Points forts affichables"
                        value={values.highlights}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                highlights: event.target.value,
                            }))
                        }
                        helperText="Une ligne par point fort. À utiliser pour les accroches ou blocs courts."
                    />
                </PortfolioStepPanel>

                <PortfolioStepPanel
                    icon={<ImageIcon className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 3}
                    title="Visuels"
                    description="Choisis les images depuis la médiathèque ou ajoute une nouvelle image Cloudinary."
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <MediaImageField
                            name="coverImageUrl"
                            label="Image de carte"
                            assets={mediaAssets}
                            assetAlt={values.imageAlt}
                            assetTitle={values.title || "Réalisation"}
                            cloudinary={cloudinary}
                            defaultValue={values.coverImageUrl}
                            folder="alchimiste-creations/realisations"
                            helperText="Image principale de la carte admin. Format conseillé : visuel lisible même en petit."
                            onValueChange={syncPreview}
                            usage="REALISATION"
                        />
                        <MediaImageField
                            name="heroImageUrl"
                            label="Image héro"
                            assets={mediaAssets}
                            assetAlt={values.imageAlt}
                            assetTitle={values.title || "Réalisation"}
                            cloudinary={cloudinary}
                            defaultValue={values.heroImageUrl}
                            folder="alchimiste-creations/realisations"
                            helperText="Image large prévue pour une future page publique ou une présentation détaillée."
                            onValueChange={syncPreview}
                            usage="REALISATION"
                        />
                    </div>
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
                        placeholder="Aperçu du site Norel Art sur ordinateur"
                        helperText="Fortement recommandé : décris l’image pour l’accessibilité et le futur SEO."
                    />
                </PortfolioStepPanel>

                <PortfolioStepPanel
                    icon={<BadgeCheck className="size-4" aria-hidden="true" />}
                    isActive={activeStep === 4}
                    title="Publication"
                    description="Définis l’état admin, l’ordre, la mise en avant et les liens. Cette étape ne publie pas le site public."
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <Select
                            name="publicationStatus"
                            label="Statut publication"
                            value={values.publicationStatus}
                            onValueChange={(nextValue) =>
                                setValues((current) => ({
                                    ...current,
                                    publicationStatus: nextValue,
                                }))
                            }
                            options={publicationOptions}
                            helperText="Statut interne uniquement : le portfolio public reste alimenté par le content."
                        />
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
                            helperText="Plus le nombre est petit, plus la réalisation remonte dans l’admin."
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
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
                            placeholder="/realisations/norel-art"
                            iconLeft={<LinkIcon className="size-4" aria-hidden="true" />}
                            helperText="Lien de référence vers une page publique existante, sans branchement automatique."
                        />
                        <TextField
                            name="websiteUrl"
                            label="Site externe"
                            value={values.websiteUrl}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    websiteUrl: event.target.value,
                                }))
                            }
                            placeholder="https://..."
                            helperText="Lien externe optionnel vers le site du client ou une démo."
                        />
                    </div>
                    <Switch
                        name="isFeatured"
                        label="Mettre en avant"
                        helperText="Repère admin pour les cas prioritaires du portfolio."
                        checked={values.isFeatured}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                isFeatured: event.target.checked,
                            }))
                        }
                    />
                </PortfolioStepPanel>

                <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-surface-default)_92%,transparent)] p-3 shadow-xl shadow-black/25 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {activeStep < portfolioSteps.length - 1
                            ? "Valide cette étape pour ouvrir la suite."
                            : isEditing
                                ? "Enregistre les modifications quand tout est correct."
                                : "Crée la réalisation quand tout est prêt."}
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
                        {activeStep < portfolioSteps.length - 1 ? (
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
                                {isEditing ? "Enregistrer les modifications" : "Créer la réalisation"}
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            <aside className="grid content-start gap-4 xl:sticky xl:top-24">
                <PortfolioPreviewCard selectedOffer={selectedOffer} values={values} />
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                            <Sparkles className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                Garde-fou
                            </p>
                            <p className="text-caption text-[color:var(--color-text-subtle)]">
                                Le public reste sur le content.
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-body-small text-[color:var(--color-text-muted)]">
                        Cette fiche prépare le futur pilotage du portfolio, mais ne remplace pas encore `src/content/realisations`.
                    </p>
                </div>
            </aside>
        </section>
    );
}

function PortfolioStepPanel({
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

function PortfolioPreviewCard({
    selectedOffer,
    values,
}: {
    selectedOffer?: PortfolioOfferOption;
    values: PortfolioProjectValues;
}) {
    const imageSrc = values.coverImageUrl || values.heroImageUrl;
    const title = values.title || "Nouvelle réalisation";
    const description =
        values.shortDescription ||
        "L’aperçu se met à jour pendant la saisie pour vérifier la carte admin.";

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
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.30),rgba(10,8,5,0.62)_44%,rgba(10,8,5,0.95))]"
                aria-hidden="true"
            />
            <div className="relative z-10 flex min-h-[390px] flex-col justify-between gap-8 p-4">
                <div className="flex flex-wrap gap-2">
                    <Badge tone={values.publicationStatus === "PUBLISHED" ? "success" : "draft"} size="sm">
                        {getPublicationLabel(values.publicationStatus)}
                    </Badge>
                    <Badge tone="info" size="sm">
                        {getKindLabel(values.kind)}
                    </Badge>
                </div>

                <div className="grid gap-4">
                    <div>
                        <p className="text-caption uppercase text-[color:var(--color-decor-gold)]">
                            {values.typeLabel || selectedOffer?.name || "Portfolio"}
                        </p>
                        <h3 className="mt-2 text-h3 text-white">{title}</h3>
                        <p className="mt-2 line-clamp-3 text-body-small text-white/76">
                            {description}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <PortfolioDataRow label="slug" value={values.slug || slugify(values.title) || "nouvelle-realisation"} />
                        <PortfolioDataRow label="offre" value={selectedOffer?.name ?? "Non reliée"} />
                        <PortfolioDataRow label="ordre" value={values.sortOrder || "100"} />
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

function PortfolioDataRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-sm">
            <span className="text-caption uppercase text-white/58">{label}</span>
            <span className="truncate text-caption text-white/80">{value}</span>
        </div>
    );
}

function getInitialPortfolioProjectValues(
    project: PortfolioProjectFormModel | undefined,
): PortfolioProjectValues {
    return {
        contextDescription: project?.contextDescription ?? "",
        contextTitle: project?.contextTitle ?? "",
        coverImageUrl: project?.coverImageUrl ?? "",
        heroImageUrl: project?.heroImageUrl ?? "",
        highlights: (project?.highlights ?? []).join("\n"),
        imageAlt: project?.imageAlt ?? "",
        isFeatured: project?.isFeatured ?? false,
        kind: project?.kind ?? "DEMO",
        objectives: (project?.objectives ?? []).join("\n"),
        proofs: (project?.proofs ?? []).join("\n"),
        publicHref: project?.publicHref ?? "",
        publicationStatus: project?.publicationStatus ?? "DRAFT",
        relatedOfferId: project?.relatedOfferId ?? "",
        shortDescription: project?.shortDescription ?? "",
        slug: project?.slug ?? "",
        sortOrder: String(project?.sortOrder ?? 100),
        status: project?.status ?? "",
        tags: (project?.tags ?? []).join(", "),
        title: project?.title ?? "",
        typeLabel: project?.typeLabel ?? "",
        websiteUrl: project?.websiteUrl ?? "",
    };
}

function getPortfolioProjectValuesFromForm(
    form: HTMLFormElement,
): PortfolioProjectValues {
    const formData = new FormData(form);

    return {
        contextDescription: getFormString(formData, "contextDescription"),
        contextTitle: getFormString(formData, "contextTitle"),
        coverImageUrl: getFormString(formData, "coverImageUrl"),
        heroImageUrl: getFormString(formData, "heroImageUrl"),
        highlights: getFormString(formData, "highlights"),
        imageAlt: getFormString(formData, "imageAlt"),
        isFeatured: formData.get("isFeatured") === "on",
        kind: getFormString(formData, "kind") || "DEMO",
        objectives: getFormString(formData, "objectives"),
        proofs: getFormString(formData, "proofs"),
        publicHref: getFormString(formData, "publicHref"),
        publicationStatus: getFormString(formData, "publicationStatus") || "DRAFT",
        relatedOfferId: getFormString(formData, "relatedOfferId"),
        shortDescription: getFormString(formData, "shortDescription"),
        slug: getFormString(formData, "slug"),
        sortOrder: getFormString(formData, "sortOrder"),
        status: getFormString(formData, "status"),
        tags: getFormString(formData, "tags"),
        title: getFormString(formData, "title"),
        typeLabel: getFormString(formData, "typeLabel"),
        websiteUrl: getFormString(formData, "websiteUrl"),
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

function getPublicationLabel(value: string) {
    const labels: Record<string, string> = {
        ARCHIVED: "Archivée",
        DRAFT: "Brouillon",
        PUBLISHED: "Publiée",
        STANDBY: "Stand-by",
    };

    return labels[value] ?? value;
}

function getKindLabel(value: string) {
    const labels: Record<string, string> = {
        CLIENT: "Client",
        CONCEPT: "Concept",
        DEMO: "Démo",
        REFONTE: "Refonte",
    };

    return labels[value] ?? value;
}

function slugify(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
