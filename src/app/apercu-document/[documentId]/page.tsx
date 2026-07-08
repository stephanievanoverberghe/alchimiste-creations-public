import type { Metadata } from "next";

import { ComposedDocumentArticle } from "@/features/documents/components/ComposedDocumentArticle";
import { PrintDocumentButton } from "@/features/documents/components/PrintDocumentButton";
import { requireAdminSession } from "@/server/auth/admin";
import { getComposedDocumentById } from "@/server/documents/composer";

export const metadata: Metadata = {
    robots: { follow: false, index: false },
    title: "Aperçu document — Alchimiste Créations",
};

export const dynamic = "force-dynamic";

type DocumentPreviewRouteProps = {
    params: Promise<{
        documentId: string;
    }>;
};

// Print-ready branded render, outside the admin chrome: paper-like
// light layout so the exported PDF reads like an official document.
export default async function DocumentPreviewRoute({
    params,
}: DocumentPreviewRouteProps) {
    await requireAdminSession();

    const { documentId } = await params;
    const document = await getComposedDocumentById(documentId);

    return (
        <div className="min-h-screen bg-[var(--paper-bg)] px-4 py-8 print:bg-white print:p-0">
            <div className="mx-auto flex max-w-[820px] items-center justify-between gap-4 pb-6 print:hidden">
                <p className="text-sm text-[var(--paper-ink-muted)]">
                    Aperçu — utilise « Imprimer / PDF » pour produire la version
                    à archiver dans Drive.
                </p>
                <PrintDocumentButton />
            </div>

            <ComposedDocumentArticle
                clientName={document.clientName}
                content={document.content}
                issuedAt={document.updatedAt}
                reference={document.reference}
                sections={document.model.sections}
                title={document.title}
                version={document.currentVersion}
                versionNote={
                    document.status === "DRAFT" ? "(brouillon de travail)" : undefined
                }
            />
        </div>
    );
}
