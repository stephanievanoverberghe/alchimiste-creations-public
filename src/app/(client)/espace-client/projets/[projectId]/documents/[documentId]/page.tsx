import type { Metadata } from "next";

import { ClientDocumentPage } from "@/features/client-portal/components/ClientDocumentPage";
import { requireClientPortalSession } from "@/server/auth/client";
import { getClientComposedDocument } from "@/server/client-portal/portal";

export const metadata: Metadata = {
    robots: { follow: false, index: false },
    title: "Document — Espace client Alchimiste Créations",
};

export const dynamic = "force-dynamic";

type ClientDocumentRouteProps = {
    params: Promise<{
        documentId: string;
        projectId: string;
    }>;
    searchParams: Promise<{
        validation?: string;
    }>;
};

export default async function ClientDocumentRoute({
    params,
    searchParams,
}: ClientDocumentRouteProps) {
    const session = await requireClientPortalSession();

    const { documentId, projectId } = await params;
    const status = await searchParams;
    const document = await getClientComposedDocument({
        documentId,
        projectId,
        role: session.user.role,
        userId: session.user.id,
    });

    return (
        <ClientDocumentPage
            document={document}
            validationStatus={status.validation}
        />
    );
}
