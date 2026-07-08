import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { isAdminRole } from "@/server/auth/roles";

export async function requireAdminSession() {
    const session = await auth();

    if (!session?.user) {
        redirect("/connexion?callbackUrl=/admin");
    }

    if (!isAdminRole(session.user.role)) {
        redirect("/connexion?error=AccessDenied");
    }

    return session;
}
