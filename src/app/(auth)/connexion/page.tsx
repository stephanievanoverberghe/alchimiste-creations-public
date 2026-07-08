import type { Metadata } from "next";
import { cookies } from "next/headers";

import { loginPageContent } from "@/content/auth";
import { LoginPage } from "@/features/auth/components/LoginPage";

export const metadata: Metadata = {
    title: loginPageContent.seo.title,
    description: loginPageContent.seo.description,
};

export const dynamic = "force-dynamic";

type ConnexionPageProps = {
    searchParams: Promise<{
        callbackUrl?: string;
        email?: string;
        error?: string;
        mode?: string;
        sent?: string;
    }>;
};

export default async function ConnexionPage({
    searchParams,
}: ConnexionPageProps) {
    const params = await searchParams;
    const cookieStore = await cookies();
    const sentEmail =
        params.sent === "1"
            ? params.email ?? cookieStore.get("auth:last-magic-link-email")?.value
            : undefined;

    return <LoginPage {...params} sentEmail={sentEmail} />;
}
