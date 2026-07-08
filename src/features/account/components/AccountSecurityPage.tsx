import Link from "next/link";

import { PageHeader } from "@/components/layout/shell/PageHeader";
import { Toast } from "@/components/ui";
import { accountSecurityContent } from "@/content/auth";
import { resolveAccountStatus } from "@/features/account/accountStatus";
import { AccountMethodsSection } from "@/features/account/sections/AccountMethodsSection";
import { AccountPasswordSection } from "@/features/account/sections/AccountPasswordSection";
import { AccountProtectionSection } from "@/features/account/sections/AccountProtectionSection";
import { AccountSnapshot } from "@/features/account/sections/AccountSnapshot";
import type { getAccountSecurity } from "@/server/auth/security";

type AccountSecurityPageProps = {
    account: Awaited<ReturnType<typeof getAccountSecurity>>;
    status?: string;
};

const { header, snapshot, methods, password, protection, privacy } =
    accountSecurityContent;

/**
 * Page /compte/securite : véritable page de sécurité alignée sur le gabarit
 * espace client. Compose l'en-tête + carte d'identité, les méthodes de
 * connexion, la gestion du mot de passe, les garanties de protection et la
 * session. La logique (hash, validation, déconnexion) vit dans
 * `src/server/auth` ; cette page n'orchestre que la présentation.
 */
export function AccountSecurityPage({
    account,
    status,
}: AccountSecurityPageProps) {
    const statusMessage = resolveAccountStatus(status);

    return (
        <>
            {statusMessage ? (
                <Toast
                    autoDismiss={statusMessage.isSuccess}
                    dismissible
                    durationMs={7000}
                    placement="top"
                    showProgress={statusMessage.isSuccess}
                    tone={statusMessage.tone}
                    title={statusMessage.title}
                >
                    {statusMessage.message}
                </Toast>
            ) : null}

            <section className="min-w-0 overflow-x-hidden py-4 md:py-5 lg:py-6">
                <div className="mx-auto flex w-full min-w-0 max-w-[1040px] flex-col gap-6 px-3 md:px-4 lg:px-5">
                    <PageHeader
                        variant="client"
                        eyebrow={header.eyebrow}
                        title={header.title}
                        description={header.description}
                    >
                        <AccountSnapshot account={account} content={snapshot} />
                    </PageHeader>

                    <AccountMethodsSection
                        content={methods}
                        hasPassword={account.hasPassword}
                    />

                    <AccountPasswordSection
                        content={password}
                        hasPassword={account.hasPassword}
                    />

                    <AccountProtectionSection content={protection} />

                    <p className="text-body-small text-[color:var(--color-text-subtle)]">
                        {privacy.text}{" "}
                        <Link
                            href={privacy.href}
                            className="font-medium text-[color:var(--color-action-default)] underline-offset-2 hover:text-[color:var(--color-action-hover)]"
                        >
                            {privacy.linkLabel}
                        </Link>
                    </p>
                </div>
            </section>
        </>
    );
}
