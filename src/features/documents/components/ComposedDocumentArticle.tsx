import type {
    ComposedContent,
    DocumentModelSection,
} from "@/server/documents/composer";

/**
 * Rendu « papier » brandé d'un document composé, sur le thème --paper-*.
 * Source de vérité unique du rendu officiel : utilisé par l'aperçu
 * imprimable admin et par la page de lecture client.
 */
export function ComposedDocumentArticle({
    clientName,
    content,
    issuedAt,
    reference,
    sections,
    title,
    version,
    versionNote,
}: {
    clientName: string;
    content: ComposedContent;
    issuedAt: Date;
    reference: string;
    sections: DocumentModelSection[];
    title: string;
    version: number;
    versionNote?: string;
}) {
    const issuedLabel = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
    }).format(issuedAt);

    return (
        <article className="mx-auto max-w-[820px] rounded-2xl bg-[var(--paper-sheet)] p-8 text-[var(--paper-ink)] shadow-xl sm:p-12 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
            <header className="border-b-2 border-[var(--paper-accent)] pb-6">
                <p className="text-lg font-bold tracking-tight">
                    Alchimiste Créations
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--paper-accent)]">
                    Clarifier. Designer. Lancer.
                </p>
                <h1 className="mt-6 text-3xl font-bold leading-tight">{title}</h1>
                <dl className="mt-4 grid gap-x-8 gap-y-1 text-sm text-[var(--paper-ink-muted)] sm:grid-cols-2">
                    <div className="flex gap-2">
                        <dt className="font-semibold">Client :</dt>
                        <dd>{clientName}</dd>
                    </div>
                    <div className="flex gap-2">
                        <dt className="font-semibold">Date :</dt>
                        <dd>{issuedLabel}</dd>
                    </div>
                    <div className="flex gap-2">
                        <dt className="font-semibold">Référence :</dt>
                        <dd className="break-all">{reference}</dd>
                    </div>
                    <div className="flex gap-2">
                        <dt className="font-semibold">Version :</dt>
                        <dd>
                            v{String(version).padStart(2, "0")}
                            {versionNote ? ` ${versionNote}` : ""}
                        </dd>
                    </div>
                </dl>
            </header>

            <main>
                {sections.map((section, index) => {
                    const sectionContent = content.sections[section.key]?.trim();

                    return (
                        <section
                            key={section.key}
                            className="mt-8 break-inside-avoid"
                        >
                            <h2 className="text-lg font-bold">
                                <span className="mr-2 text-[var(--paper-accent)]">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                {section.title}
                            </h2>
                            <div className="mt-2 whitespace-pre-line border-l-2 border-[var(--paper-border)] pl-4 text-[15px] leading-relaxed">
                                {sectionContent || (
                                    <em className="text-[var(--paper-ink-subtle)]">
                                        Section à compléter.
                                    </em>
                                )}
                            </div>
                        </section>
                    );
                })}
            </main>

            <footer className="mt-12 border-t border-[var(--paper-border)] pt-4 text-xs text-[var(--paper-ink-subtle)]">
                Alchimiste Créations — document établi le {issuedLabel}.
                Référence {reference}.
            </footer>
        </article>
    );
}
