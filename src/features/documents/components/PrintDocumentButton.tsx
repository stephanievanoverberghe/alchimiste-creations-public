"use client";

/**
 * Bouton d'impression de l'aperçu papier (window.print), masqué à
 * l'impression. Habillé sur le thème --paper-* comme le document.
 */
export function PrintDocumentButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="focus-ring inline-flex min-h-11 items-center rounded-full bg-[var(--paper-accent)] px-5 text-sm font-semibold text-white print:hidden"
        >
            Imprimer / Enregistrer en PDF
        </button>
    );
}
