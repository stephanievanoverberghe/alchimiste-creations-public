import type { ReactNode } from "react";

import { ClientLayoutShell } from "@/features/client-portal/components/ClientLayoutShell";
import { requireClientPortalSession } from "@/server/auth/client";

export default async function ClientLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const session = await requireClientPortalSession();

    return <ClientLayoutShell session={session}>{children}</ClientLayoutShell>;
}
