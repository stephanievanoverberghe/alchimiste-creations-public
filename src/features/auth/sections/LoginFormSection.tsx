import { MagicLinkForm } from "@/features/auth/components/MagicLinkForm";
import { PasswordLoginForm } from "@/features/auth/components/PasswordLoginForm";
import type { LoginPageContent } from "@/content/auth";

type LoginFormSectionProps = {
    content: LoginPageContent["form"];
    callbackUrl: string;
    isPasswordMode: boolean;
};

/**
 * Colonne de droite du split-screen : l'entrée pratique.
 * Bascule entre lien magique (défaut) et mot de passe selon `isPasswordMode`.
 * Les états (succès comme erreur) sont rendus en toast par l'orchestrateur.
 */
export function LoginFormSection({
    content,
    callbackUrl,
    isPasswordMode,
}: LoginFormSectionProps) {
    return (
        <section className="flex items-center justify-center px-6 py-10 lg:min-h-[100svh] lg:px-12">
            <div className="flex w-full max-w-[440px] flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        {content.eyebrow}
                    </p>
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        {content.title}
                    </h2>
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {content.subtitle}
                    </p>
                </div>

                {isPasswordMode ? (
                    <PasswordLoginForm callbackUrl={callbackUrl} />
                ) : (
                    <MagicLinkForm callbackUrl={callbackUrl} />
                )}
            </div>
        </section>
    );
}
