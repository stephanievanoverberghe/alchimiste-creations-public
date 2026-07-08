import { type TextareaHTMLAttributes } from "react";

import {
    cn,
    FormLabel,
    FormMessage,
    formRootClasses,
    getFieldFrameClasses,
    useFormField,
} from "@/components/ui/forms/shared";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    helperText?: string;
    errorMessage?: string;
    required?: boolean;
};

export function Textarea({
    label,
    helperText,
    errorMessage,
    required = false,
    disabled,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}: TextareaProps) {
    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        id,
        name: props.name,
        message,
        ariaDescribedBy,
    });

    const textareaClasses = cn(
        "min-h-40 w-full resize-y px-4 py-3.5 text-body text-[var(--color-text-default)] caret-[var(--color-action-default)] outline-none placeholder:text-[var(--color-text-subtle)] selection:bg-[var(--color-action-subtle)] focus-visible:outline-none focus-visible:shadow-none",
        getFieldFrameClasses({ disabled, hasError }),
        disabled &&
            "opacity-100 placeholder:text-[var(--color-text-disabled)] disabled:opacity-100",
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

            <textarea
                {...props}
                id={fieldId}
                className={textareaClasses}
                data-focus-ring="none"
                required={required}
                disabled={disabled}
                aria-invalid={hasError || ariaInvalid || undefined}
                aria-describedby={describedBy}
            />

            <FormMessage
                id={messageId}
                message={message}
                disabled={disabled}
                hasError={hasError}
            />
        </div>
    );
}
