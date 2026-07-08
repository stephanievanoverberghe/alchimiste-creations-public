import { ArrowRight, KeyRound, Mail } from "lucide-react";
import Link from "next/link";

import { Button, TextField } from "@/components/ui";
import { loginPageContent } from "@/content/auth";
import { signInWithPasswordAction } from "@/server/auth/actions";

const { password } = loginPageContent.form;

type PasswordLoginFormProps = {
    callbackUrl: string;
};

/**
 * Formulaire secondaire : connexion par mot de passe.
 * Proposé en repli du lien magique ; renvoie vers le mode par défaut.
 * La logique (lockout, credentials) reste dans `signInWithPasswordAction`.
 */
export function PasswordLoginForm({ callbackUrl }: PasswordLoginFormProps) {
    return (
        <form
            action={signInWithPasswordAction}
            className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] p-5 shadow-elevation-1 md:p-6"
        >
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <TextField
                name="email"
                type="email"
                label={password.emailLabel}
                required
                autoComplete="email"
                inputMode="email"
                iconLeft={<Mail aria-hidden="true" />}
            />
            <TextField
                name="password"
                type="password"
                label={password.passwordLabel}
                helperText={password.passwordHelper}
                required
                autoComplete="current-password"
                iconLeft={<KeyRound aria-hidden="true" />}
            />
            <Button
                type="submit"
                iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
            >
                {password.submitLabel}
            </Button>
            <Link
                href={`/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="flex min-h-11 items-center justify-center text-label text-[color:var(--color-action-default)] no-underline hover:text-[color:var(--color-action-hover)]"
            >
                {password.switchLabel}
            </Link>
        </form>
    );
}
