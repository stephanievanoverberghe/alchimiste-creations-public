import { mutedTextClass } from "./shared";

/** Étape d'accueil : cadre rassurant et les 3 temps du parcours. */
export function StartStep() {
    const points = [
        {
            title: "Choisir le bon point de départ",
            description: "Le format le plus proche de ton besoin — ajustable après lecture.",
        },
        {
            title: "Décrire le besoin avec tes mots",
            description: "Pas besoin d'un brief parfait, une version courte suffit.",
        },
        {
            title: "Relire avant d'envoyer",
            description: "Un récapitulatif clair, modifiable champ par champ.",
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <p className="max-w-[560px] border-l-2 border-[color:var(--color-decor-gold)]/45 pl-4 text-body text-[color:var(--color-text-default)]">
                Pas besoin d&apos;un dossier complet : on cherche seulement les
                informations qui permettent de te répondre correctement.
            </p>

            <ol className="grid gap-5">
                {points.map((point, index) => (
                    <li key={point.title} className="flex items-start gap-4">
                        <span
                            className="font-[family-name:var(--font-display)] text-h2 leading-none text-[color:var(--color-decor-gold)]/50"
                            aria-hidden="true"
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
                            <span className="text-body font-semibold text-[color:var(--color-text-default)]">
                                {point.title}
                            </span>
                            <span className={mutedTextClass}>
                                {point.description}
                            </span>
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
