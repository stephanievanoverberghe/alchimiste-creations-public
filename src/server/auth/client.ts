import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { isClientPortalRole } from "@/server/auth/roles";

export async function requireClientPortalSession() {
    const session = await auth();

    if (!session?.user) {
        redirect("/connexion?callbackUrl=/espace-client");
    }

    if (!isClientPortalRole(session.user.role)) {
        redirect("/connexion?error=AccessDenied");
    }

    return session;
}
