import { KeyRound } from "lucide-react";

import { Button, TextField } from "@/components/ui";
import type { AccountSecurityContent } from "@/content/auth";
import { setPasswordAction } from "@/server/auth/actions";

type AccountPasswordFormProps = {
    content: AccountSecurityContent["password"];
    hasPassword: boolean;
};

/**
 * Formulaire de définition / modification du mot de passe optionnel. Les
 * libellés s'adaptent à l'existence d'un mot de passe ; la validation
 * (longueur, correspondance) reste dans `setPasswordAction`.
 */
export function AccountPasswordForm({
    content,
    hasPassword,
}: AccountPasswordFormProps) {
    return (
        <form
            action={setPasswordAction}
            className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-default)] p-5 shadow-elevation-1 md:p-6"
        >
            <TextField
                name="password"
                type="password"
                label={
                    hasPassword
                        ? content.passwordLabelSet
                        : content.passwordLabelUnset
                }
                required
                autoComplete="new-password"
                iconLeft={<KeyRound aria-hidden="true" />}
            />
            <TextField
                name="confirmPassword"
                type="password"
                label={content.confirmLabel}
                required
                autoComplete="new-password"
                iconLeft={<KeyRound aria-hidden="true" />}
            />
            <Button type="submit" className="w-full sm:w-fit">
                {hasPassword ? content.submitSet : content.submitUnset}
            </Button>
        </form>
    );
}
