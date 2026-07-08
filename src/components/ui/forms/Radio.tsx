import { type InputHTMLAttributes } from "react";

import {
    cn,
    getChoiceLabelClasses,
    getChoiceMessageClasses,
    getChoiceRootClasses,
    useFormField,
} from "@/components/ui/forms/shared";

export type RadioProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "aria-invalid"
> & {
    label: string;
    helperText?: string;
    errorMessage?: string;
};

export function Radio({
    label,
    helperText,
    errorMessage,
    disabled,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    ...props
}: RadioProps) {
    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        id,
        name: props.name,
        message,
        ariaDescribedBy,
    });

    const controlClasses = cn(
        "mt-px flex size-6 shrink-0 items-center justify-center rounded-full border text-transparent transition-[background-color,border-color,box-shadow,color]",
        disabled
            ? "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] peer-checked:text-[var(--color-text-disabled)]"
            : hasError
                ? "border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] peer-checked:text-[var(--color-danger-text)] peer-focus-visible:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]"
                : "border-[color:var(--color-border-control)] bg-[var(--color-surface-default)] group-hover:border-[color:var(--color-action-hover)] peer-checked:border-[color:var(--color-action-default)] peer-checked:text-[var(--color-action-default)] peer-focus-visible:border-[color:var(--color-border-focus)] peer-focus-visible:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]",
    );

    return (
        <label className={getChoiceRootClasses({ disabled, hasError, className })}>
            <input
                {...props}
                id={fieldId}
                type="radio"
                className="peer sr-only"
                data-focus-ring="none"
                disabled={disabled}
                aria-describedby={describedBy}
            />

            <span className={controlClasses} aria-hidden="true">
                <span className="size-2.5 rounded-full bg-current" />
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
