import { type InputHTMLAttributes, type ReactNode } from "react";

import {
    cn,
    FormLabel,
    FormMessage,
    formRootClasses,
    getFieldFrameClasses,
    useFormField,
} from "@/components/ui/forms/shared";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    helperText?: string;
    errorMessage?: string;
    required?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
};

export function TextField({
    label,
    helperText,
    errorMessage,
    required = false,
    disabled,
    id,
    className,
    iconLeft,
    iconRight,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}: TextFieldProps) {
    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        id,
        name: props.name,
        message,
        ariaDescribedBy,
    });

    const fieldClasses = cn(
        "group flex min-h-14 w-full items-center gap-3 px-4",
        getFieldFrameClasses({ disabled, hasError }),
    );

    const inputClasses = cn(
        "min-w-0 flex-1 !bg-transparent text-body text-[var(--color-text-default)] caret-[var(--color-action-default)] outline-none placeholder:text-[var(--color-text-subtle)] selection:bg-[var(--color-action-subtle)] focus-visible:outline-none focus-visible:shadow-none",
        "disabled:cursor-not-allowed disabled:!bg-transparent disabled:text-[var(--color-text-disabled)] disabled:placeholder:text-[var(--color-text-disabled)]",
    );

    const iconClasses = cn(
        "pointer-events-none inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,color] [&>svg]:size-4",
        disabled
            ? "bg-[var(--color-surface-default)] text-[var(--color-text-disabled)]"
            : hasError
                ? "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]"
                : "bg-[var(--color-action-subtle)] text-[var(--color-text-subtle)] group-focus-within:bg-[var(--color-action-default)] group-focus-within:text-[var(--color-text-inverse)]",
    );

    return (
        <div className={cn(formRootClasses, className)}>
            <FormLabel
                htmlFor={fieldId}
                label={label}
                required={required}
                disabled={disabled}
                hasError={hasError}
            />

            <div className={fieldClasses}>
                {iconLeft ? (
                    <span className={iconClasses} aria-hidden="true">
                        {iconLeft}
                    </span>
                ) : null}

                <input
                    {...props}
                    id={fieldId}
                    className={inputClasses}
                    data-focus-ring="none"
                    required={required}
                    disabled={disabled}
                    aria-invalid={hasError || ariaInvalid || undefined}
                    aria-describedby={describedBy}
                />

                {iconRight ? (
                    <span className={iconClasses} aria-hidden="true">
                        {iconRight}
                    </span>
                ) : null}
            </div>

            <FormMessage
                id={messageId}
                message={message}
                disabled={disabled}
                hasError={hasError}
            />
        </div>
    );
}
