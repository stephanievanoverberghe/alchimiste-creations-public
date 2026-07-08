import { MailCheck, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";
import type { LoginPageContent } from "@/content/auth";
import { requestMagicLinkAction } from "@/server/auth/actions";

type LoginSentSectionProps = {
    content: LoginPageContent["sent"];
    email?: string;
    callbackUrl: string;
};

/**
 * Colonne de droite lorsque le lien magique vient d'être envoyé : écran
 * d'attente « regarde ta boîte mail » (à la place du formulaire). Rappelle
 * l'adresse, permet de renvoyer le lien (même server action) ou de repartir
 * sur une autre adresse. Sans e-mail connu, seul le retour est proposé.
 */
export function LoginSentSection({
    content,
    email,
    callbackUrl,
}: LoginSentSectionProps) {
    return (
        <section className="flex items-center justify-center px-6 py-10 lg:min-h-[100svh] lg:px-12">
            <div className="flex w-full max-w-[440px] flex-col gap-6">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] text-[color:var(--color-action-default)]">
                    <MailCheck className="size-5" aria-hidden="true" />
                </span>

                <div className="flex flex-col gap-2">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        {content.eyebrow}
                    </p>
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        {content.title}
                    </h2>
                    <p className="text-body text-[color:var(--color-text-muted)]">
                        {email ? (
                            <>
                                {content.bodyBefore}
                                <span className="font-semibold text-[color:var(--color-text-default)]">
                                    {email}
                                </span>
                                {content.bodyAfter}
                            </>
                        ) : (
                            content.bodyNoEmail
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] p-5 shadow-elevation-1 md:p-6">
                    <p className="text-body-small text-[color:var(--color-text-subtle)]">
                        {content.spamNote}
                    </p>
                    {email ? (
                        <form action={requestMagicLinkAction}>
                            <input type="hidden" name="email" value={email} />
                            <input
                                type="hidden"
                                name="callbackUrl"
                                value={callbackUrl}
                            />
                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full"
                                iconLeft={
                                    <RotateCcw
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                {content.resendLabel}
                            </Button>
                        </form>
                    ) : null}
                    <Link
                        href="/connexion"
                        className="flex min-h-11 items-center justify-center text-label text-[color:var(--color-action-default)] no-underline hover:text-[color:var(--color-action-hover)]"
                    >
                        {content.changeEmailLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
}
