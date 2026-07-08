import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { getAuthenticatedHomePath } from "@/server/auth/roles";

export const metadata: Metadata = {
    title: "Redirection — Alchimiste Créations",
    description: "Redirection vers l'espace privé autorisé.",
};

export const dynamic = "force-dynamic";

export default async function ConnexionRedirectPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/connexion");
    }

    const homePath = getAuthenticatedHomePath(session.user.role);

    if (!homePath) {
        redirect("/connexion?error=AccessDenied");
    }

    redirect(homePath);
}
