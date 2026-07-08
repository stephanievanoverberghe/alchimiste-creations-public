import type { ReactNode } from "react";

import { AdminLayoutShell } from "@/features/admin/components/AdminLayoutShell";
import { requireAdminSession } from "@/server/auth/admin";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    await requireAdminSession();

    return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
