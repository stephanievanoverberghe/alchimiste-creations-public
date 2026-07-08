import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { accountSecurityContent } from "@/content/auth";
import { AccountSecurityPage } from "@/features/account/components/AccountSecurityPage";
import { ClientLayoutShell } from "@/features/client-portal/components/ClientLayoutShell";
import { auth } from "@/server/auth";
import { getAuthenticatedHomePath } from "@/server/auth/roles";
import { getAccountSecurity } from "@/server/auth/security";

export const metadata: Metadata = {
    title: accountSecurityContent.seo.title,
    description: accountSecurityContent.seo.description,
};

export const dynamic = "force-dynamic";

type AccountSecurityRouteProps = {
    searchParams: Promise<{
        status?: string;
    }>;
};

export default async function AccountSecurityRoute({
    searchParams,
}: AccountSecurityRouteProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/connexion?callbackUrl=/compte/securite");
    }

    const homePath = getAuthenticatedHomePath(session.user.role);

    if (!homePath) {
        redirect("/connexion?error=AccessDenied");
    }

    const [params, account] = await Promise.all([
        searchParams,
        getAccountSecurity(session.user.id),
    ]);

    // Page réservée à l'espace client pour l'instant (le pendant admin
    // viendra plus tard) : on la rend dans le shell client.
    return (
        <ClientLayoutShell
            session={session}
            topbarTitle="Sécurité du compte"
            topbarSubtitle="Gère ta connexion et protège ton accès."
        >
            <AccountSecurityPage account={account} status={params.status} />
        </ClientLayoutShell>
    );
}
