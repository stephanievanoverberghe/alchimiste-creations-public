import type { Metadata } from "next";

import { ComposedDocumentEditorPage } from "@/features/documents/components/ComposedDocumentEditorPage";
import { requireAdminSession } from "@/server/auth/admin";
import { getComposedDocument } from "@/server/documents/composer";

export const metadata: Metadata = {
    title: "Éditeur de document — Alchimiste Créations",
    description: "Rédaction d'un document composé pré-rempli depuis le projet.",
};

export const dynamic = "force-dynamic";

type ComposedDocumentRouteProps = {
    params: Promise<{
        documentId: string;
        projectId: string;
    }>;
    searchParams: Promise<{
        document?: string;
    }>;
};

export default async function ComposedDocumentRoute({
    params,
    searchParams,
}: ComposedDocumentRouteProps) {
    await requireAdminSession();

    const { documentId, projectId } = await params;
    const status = await searchParams;
    const document = await getComposedDocument(projectId, documentId);

    return (
        <ComposedDocumentEditorPage
            document={document}
            documentStatus={status.document}
        />
    );
}
