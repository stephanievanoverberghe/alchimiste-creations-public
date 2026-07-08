import { Check } from "lucide-react";
import { type InputHTMLAttributes } from "react";

import {
    cn,
    getChoiceLabelClasses,
    getChoiceMessageClasses,
    getChoiceRootClasses,
    useFormField,
} from "@/components/ui/forms/shared";

export type CheckboxProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
> & {
    label: string;
    helperText?: string;
    errorMessage?: string;
};

export function Checkbox({
    label,
    helperText,
    errorMessage,
    disabled,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}: CheckboxProps) {
    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        id,
        name: props.name,
        message,
        ariaDescribedBy,
    });

    const controlClasses = cn(
        "mt-px flex size-6 shrink-0 items-center justify-center rounded-lg border text-transparent transition-[background-color,border-color,box-shadow,color,transform]",
        disabled
            ? "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] peer-checked:text-[var(--color-text-disabled)]"
            : hasError
                ? "border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] peer-checked:bg-[var(--color-danger-border)] peer-checked:text-[var(--color-text-inverse)] peer-focus-visible:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]"
                : "border-[color:var(--color-border-control)] bg-[var(--color-surface-default)] group-hover:border-[color:var(--color-action-hover)] peer-checked:border-[color:var(--color-action-default)] peer-checked:bg-[var(--color-action-default)] peer-checked:text-[var(--color-text-inverse)] peer-focus-visible:border-[color:var(--color-border-focus)] peer-focus-visible:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]",
    );

    return (
        <label className={getChoiceRootClasses({ disabled, hasError, className })}>
            <input
                {...props}
                id={fieldId}
                type="checkbox"
                className="peer sr-only"
                data-focus-ring="none"
                disabled={disabled}
                aria-invalid={hasError || ariaInvalid || undefined}
                aria-describedby={describedBy}
            />

            <span className={controlClasses} aria-hidden="true">
                <Check className="size-4" strokeWidth={3} />
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
