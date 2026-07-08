import type { ReactNode } from "react";

import { AdminLayoutFrame } from "@/features/admin/components/AdminLayoutFrame";
import { signOutAction } from "@/server/auth/actions";

type AdminLayoutShellProps = {
    children: ReactNode;
};

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
    return (
        <AdminLayoutFrame signOutAction={signOutAction}>
            {children}
        </AdminLayoutFrame>
    );
}
