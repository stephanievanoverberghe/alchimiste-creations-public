import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import { Button, TextField } from "@/components/ui";
import { loginPageContent } from "@/content/auth";
import { requestMagicLinkAction } from "@/server/auth/actions";

const { magicLink } = loginPageContent.form;

type MagicLinkFormProps = {
    callbackUrl: string;
};

/**
 * Formulaire principal : demande d'un lien magique par e-mail.
 * Le mot de passe est proposé en repli via un lien qui bascule le mode.
 * La logique d'envoi reste dans `requestMagicLinkAction` (Resend).
 */
export function MagicLinkForm({ callbackUrl }: MagicLinkFormProps) {
    return (
        <form
            action={requestMagicLinkAction}
            className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] p-5 shadow-elevation-1 md:p-6"
        >
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <TextField
                name="email"
                type="email"
                label={magicLink.emailLabel}
                helperText={magicLink.emailHelper}
                required
                autoComplete="email"
                inputMode="email"
                iconLeft={<Mail aria-hidden="true" />}
            />
            <Button
                type="submit"
                iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
            >
                {magicLink.submitLabel}
            </Button>
            <Link
                href={`/connexion?mode=password&callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="flex min-h-11 items-center justify-center text-label text-[color:var(--color-action-default)] no-underline hover:text-[color:var(--color-action-hover)]"
            >
                {magicLink.switchLabel}
            </Link>
        </form>
    );
}
