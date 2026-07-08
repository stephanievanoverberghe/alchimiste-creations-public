import { type InputHTMLAttributes } from "react";

import {
    cn,
    getChoiceLabelClasses,
    getChoiceMessageClasses,
    getChoiceRootClasses,
    useFormField,
} from "@/components/ui/forms/shared";

export type SwitchProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
> & {
    label: string;
    helperText?: string;
    errorMessage?: string;
};

export function Switch({
    label,
    helperText,
    errorMessage,
    disabled,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}: SwitchProps) {
    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        id,
        name: props.name,
        message,
        ariaDescribedBy,
    });

    const trackClasses = cn(
        "mt-px flex h-7 w-12 shrink-0 items-center rounded-full border p-[3px] transition-[background-color,border-color,box-shadow] peer-checked:[&>span]:translate-x-5",
        disabled
            ? "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]"
            : hasError
                ? "border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] shadow-[0_0_0_1px_var(--color-danger-border)] peer-checked:bg-[var(--color-action-default)] peer-checked:[&>span]:bg-[var(--color-text-inverse)] peer-focus-visible:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]"
                : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] group-hover:border-[color:var(--color-action-hover)] peer-checked:border-[color:var(--color-action-default)] peer-checked:bg-[var(--color-action-default)] peer-checked:[&>span]:bg-[var(--color-text-inverse)] peer-focus-visible:border-[color:var(--color-border-focus)] peer-focus-visible:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]",
    );

    const thumbClasses = cn(
        "size-5 rounded-full transition-[transform,background-color,box-shadow]",
        disabled
            ? "bg-[var(--color-text-disabled)]"
            : hasError
                ? "bg-[var(--color-danger-text)]"
                : "bg-[var(--color-text-default)] shadow-md shadow-black/25",
    );

    return (
        <label className={getChoiceRootClasses({ disabled, hasError, className })}>
            <input
                {...props}
                id={fieldId}
                type="checkbox"
                role="switch"
                className="peer sr-only"
                data-focus-ring="none"
                disabled={disabled}
                aria-invalid={hasError || ariaInvalid || undefined}
                aria-describedby={describedBy}
            />

            <span className={trackClasses} aria-hidden="true">
                <span className={thumbClasses} />
            </span>

            <span className="flex min-w-0 flex-col gap-1">
                <span className={getChoiceLabelClasses({ disabled, hasError })}>
                    {label}
                </span>

                <span
                    className={cn(
                        getChoiceMessageClasses({ disabled, hasError }),
                        "min-h-[var(--text-caption-line-height)]",
                    )}
                    id={message ? messageId : undefined}
                    aria-live={hasError ? "polite" : undefined}
                >
                    {message ?? ""}
                </span>
            </span>
        </label>
    );
}
