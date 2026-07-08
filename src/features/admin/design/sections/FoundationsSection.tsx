import { DesignSection, DesignSpecimen } from "./shared";

const paletteGroups: { label: string; swatches: { name: string; varName: string }[] }[] = [
    {
        label: "Fond et surfaces",
        swatches: [
            { name: "bg-main", varName: "--color-bg-main" },
            { name: "bg-deep", varName: "--color-bg-deep" },
            { name: "surface-default", varName: "--color-surface-default" },
            { name: "surface-raised", varName: "--color-surface-raised" },
            { name: "surface-interactive", varName: "--color-surface-interactive" },
        ],
    },
    {
        label: "Texte",
        swatches: [
            { name: "text-default", varName: "--color-text-default" },
            { name: "text-muted", varName: "--color-text-muted" },
            { name: "text-subtle", varName: "--color-text-subtle" },
            { name: "text-disabled", varName: "--color-text-disabled" },
        ],
    },
    {
        label: "Action et décor",
        swatches: [
            { name: "action-default", varName: "--color-action-default" },
            { name: "action-hover", varName: "--color-action-hover" },
            { name: "action-pressed", varName: "--color-action-pressed" },
            { name: "decor-gold", varName: "--color-decor-gold" },
        ],
    },
    {
        label: "Statuts (fonds)",
        swatches: [
            { name: "success", varName: "--color-success-solid" },
            { name: "warning", varName: "--color-warning-solid" },
            { name: "danger", varName: "--color-danger-solid" },
            { name: "info", varName: "--color-info-solid" },
            { name: "neutral", varName: "--color-neutral-solid" },
            { name: "draft", varName: "--color-draft-solid" },
        ],
    },
    {
        label: "Thème papier",
        swatches: [
            { name: "paper-bg", varName: "--paper-bg" },
            { name: "paper-sheet", varName: "--paper-sheet" },
            { name: "paper-ink", varName: "--paper-ink" },
            { name: "paper-accent", varName: "--paper-accent" },
        ],
    },
];

const typeScale: { className: string; label: string; sample: string; display?: boolean }[] = [
    { className: "text-display", label: "display", sample: "Fais émerger le site", display: true },
    { className: "text-h1", label: "h1", sample: "Transforme ton idée en site clair", display: true },
    { className: "text-h2", label: "h2", sample: "Une méthode claire, un projet maîtrisé", display: true },
    { className: "text-h3", label: "h3", sample: "Cadrage stratégique", display: true },
    { className: "text-h4", label: "h4", sample: "Livrables de la phase", display: true },
    { className: "text-body", label: "body", sample: "Alchimiste Créations clarifie ton message, organise ton parcours et donne forme à une présence web sur mesure." },
    { className: "text-body-small", label: "body-small", sample: "Texte courant de l'interface — cartes, descriptions, formulaires." },
    { className: "text-label", label: "label", sample: "Libellés, boutons et métadonnées" },
    { className: "text-caption", label: "caption", sample: "EYEBROWS ET CAPTIONS" },
];

/**
 * Fondations F1-F2 : palette, échelle typographique, ombres, rayons,
 * motion et effets — la matière première de tous les composants.
 */
export function FoundationsSection() {
    return (
        <DesignSection
            title="Fondations"
            note="Couleurs, typographie et tokens F2. Aucune valeur en dur : tout composant se construit avec ces variables."
        >
            <DesignSpecimen label="Palette (survol = nom du token)">
                <div className="flex flex-col gap-4">
                    {paletteGroups.map((group) => (
                        <div key={group.label} className="min-w-0">
                            <p className="mb-2 text-caption text-[color:var(--color-text-muted)]">
                                {group.label}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {group.swatches.map((swatch) => (
                                    <div
                                        key={swatch.varName}
                                        title={`var(${swatch.varName})`}
                                        className="flex min-w-24 flex-col overflow-hidden rounded-control border border-[color:var(--color-border-subtle)]"
                                    >
                                        <span
                                            className="h-12 w-full"
                                            style={{
                                                background: `var(${swatch.varName})`,
                                            }}
                                        />
                                        <span className="bg-[var(--color-surface-default)] px-2 py-1 text-caption text-[color:var(--color-text-muted)]">
                                            {swatch.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DesignSpecimen>

            <DesignSpecimen label="Échelle typographique (Fraunces display · Montserrat texte)">
                <div className="flex flex-col gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 md:p-5">
                    {typeScale.map((step) => (
                        <div
                            key={step.label}
                            className="flex min-w-0 flex-col gap-0.5 border-b border-[color:var(--color-border-subtle)] pb-3 last:border-b-0 last:pb-0"
                        >
                            <span className="text-caption text-[color:var(--color-decor-gold)]">
                                {step.label}
                            </span>
                            <p
                                className={`${step.className} ${step.display ? "font-[family-name:var(--font-display)]" : ""} truncate text-[color:var(--color-text-default)]`}
                            >
                                {step.sample}
                            </p>
                        </div>
                    ))}
                </div>
            </DesignSpecimen>

            <div className="grid gap-6 md:grid-cols-2">
                <DesignSpecimen label="Élévation (ombres chaudes)">
                    <div className="flex flex-wrap gap-4 rounded-card bg-[var(--color-bg-main)] p-5">
                        {(
                            [
                                [1, "shadow-elevation-1"],
                                [2, "shadow-elevation-2"],
                                [3, "shadow-elevation-3"],
                            ] as const
                        ).map(([level, shadowClass]) => (
                            <div
                                key={level}
                                className={`flex h-20 w-28 items-center justify-center rounded-card bg-[var(--color-surface-raised)] text-label text-[color:var(--color-text-muted)] ${shadowClass}`}
                            >
                                niveau {level}
                            </div>
                        ))}
                    </div>
                </DesignSpecimen>

                <DesignSpecimen label="Rayons (échelle sémantique)">
                    <div className="flex flex-wrap items-end gap-4 rounded-card bg-[var(--color-bg-main)] p-5">
                        <div className="flex h-16 w-24 items-center justify-center rounded-control border border-[color:var(--color-border-strong)] bg-[var(--color-surface-raised)] text-caption text-[color:var(--color-text-muted)]">
                            control
                        </div>
                        <div className="flex h-20 w-28 items-center justify-center rounded-card border border-[color:var(--color-border-strong)] bg-[var(--color-surface-raised)] text-caption text-[color:var(--color-text-muted)]">
                            card
                        </div>
                        <div className="flex h-24 w-32 items-center justify-center rounded-panel border border-[color:var(--color-border-strong)] bg-[var(--color-surface-raised)] text-caption text-[color:var(--color-text-muted)]">
                            panel
                        </div>
                    </div>
                </DesignSpecimen>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <DesignSpecimen label="Effets DA — gradient héros et glow action">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex h-28 flex-1 items-end rounded-panel border border-[color:var(--color-border-subtle)] bg-[image:var(--gradient-hero)] bg-[var(--color-bg-main)] p-4 text-label text-[color:var(--color-text-muted)]">
                            --gradient-hero
                        </div>
                        <div className="flex h-28 items-center px-6">
                            <span className="inline-flex h-12 items-center rounded-full bg-[var(--color-action-default)] px-6 text-label font-semibold text-[color:var(--color-text-inverse)] shadow-[var(--glow-action)]">
                                --glow-action
                            </span>
                        </div>
                    </div>
                </DesignSpecimen>

                <DesignSpecimen label="Motion — survole les pastilles (150 / 200 / 300 ms)">
                    <div className="flex items-center gap-6 rounded-card bg-[var(--color-bg-main)] p-6">
                        {(
                            [
                                ["fast", "--motion-duration-fast"],
                                ["base", "--motion-duration-base"],
                                ["slow", "--motion-duration-slow"],
                            ] as const
                        ).map(([label, varName]) => (
                            <div
                                key={label}
                                className="flex flex-col items-center gap-2"
                            >
                                <span
                                    className="size-10 rounded-full bg-[var(--color-decor-gold)] transition-transform ease-standard hover:-translate-y-2 hover:scale-110 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
                                    style={{
                                        transitionDuration: `var(${varName})`,
                                    }}
                                />
                                <span className="text-caption text-[color:var(--color-text-subtle)]">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </DesignSpecimen>
            </div>
        </DesignSection>
    );
}
