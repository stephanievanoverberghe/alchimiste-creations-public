import { useId, type ReactNode } from "react";

export type FormFieldState = {
    disabled?: boolean;
    hasError?: boolean;
};

export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function useFormField({
    id,
    name,
    message,
    ariaDescribedBy,
}: {
    id?: string;
    name?: string;
    message?: string;
    ariaDescribedBy?: string;
}) {
    const generatedId = useId();
    const fieldId = id ?? name ?? generatedId;
    const messageId = `${fieldId}-message`;
    const describedBy =
        [ariaDescribedBy, message ? messageId : undefined]
            .filter(Boolean)
            .join(" ") || undefined;

    return {
        fieldId,
        messageId,
        describedBy,
    };
}

export const formRootClasses = "flex w-full flex-col gap-2";

export function getLabelClasses({ disabled, hasError }: FormFieldState) {
    if (disabled) {
        return "text-label text-[var(--color-text-disabled)]";
    }

    if (hasError) {
        return "text-label text-[var(--color-danger-text)]";
    }

    return "text-label text-[var(--color-text-default)]";
}

export function getMessageClasses({ disabled, hasError }: FormFieldState) {
    if (hasError) {
        return "text-caption text-[var(--color-danger-text)]";
    }

    if (disabled) {
        return "text-caption text-[var(--color-text-disabled)]";
    }

    return "text-caption text-[var(--color-text-subtle)]";
}

export function FormLabel({
    htmlFor,
    label,
    required,
    disabled,
    hasError,
}: FormFieldState & {
    htmlFor: string;
    label: ReactNode;
    required?: boolean;
}) {
    return (
        <label className={getLabelClasses({ disabled, hasError })} htmlFor={htmlFor}>
            {label}
            {required ? (
                <span
                    className="ml-1 text-[var(--color-danger-text)]"
                    aria-hidden="true"
                >
                    *
                </span>
            ) : null}
        </label>
    );
}

export function FormMessage({
    id,
    message,
    disabled,
    hasError,
}: FormFieldState & {
    id?: string;
    message?: string;
}) {
    return (
        <p
            className={cn(
                getMessageClasses({ disabled, hasError }),
                "min-h-[var(--text-caption-line-height)] transition-colors",
            )}
            id={message ? id : undefined}
            aria-live={hasError ? "polite" : undefined}
        >
            {message ?? ""}
        </p>
    );
}

export function getFieldFrameClasses({ disabled, hasError }: FormFieldState) {
    const baseClasses =
        "rounded-2xl border shadow-inner transition-[background-color,border-color,box-shadow,color] duration-200 ease-out";

    if (disabled) {
        return cn(
            baseClasses,
            "cursor-not-allowed border-[color:var(--color-border-subtle)] !bg-[var(--color-surface-interactive)] text-[var(--color-text-disabled)] shadow-none",
        );
    }

    if (hasError) {
        return cn(
            baseClasses,
            "border-[color:var(--color-danger-border)] bg-[linear-gradient(180deg,var(--color-surface-default),var(--color-danger-bg))] shadow-[0_0_0_1px_var(--color-danger-border)] focus-within:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]",
        );
    }

    return cn(
        baseClasses,
        "border-[color:var(--color-border-control)] bg-[linear-gradient(180deg,var(--color-surface-default),var(--color-bg-deep))] hover:border-[color:var(--color-action-hover)] focus-within:border-[color:var(--color-border-focus)] focus-within:shadow-[0_0_0_4px_rgba(255,193,159,0.22)]",
    );
}

export function getChoiceRootClasses({
    disabled,
    hasError,
    className,
}: FormFieldState & {
    className?: string;
}) {
    const baseClasses =
        "group grid w-full grid-cols-[auto_1fr] items-start gap-3 rounded-2xl border p-4 transition-[background-color,border-color,box-shadow,transform,color] duration-200 ease-out";

    if (disabled) {
        return cn(
            baseClasses,
            "cursor-not-allowed border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)]",
            className,
        );
    }

    if (hasError) {
        return cn(
            baseClasses,
            "cursor-pointer border-[color:var(--color-danger-border)] bg-[linear-gradient(180deg,var(--color-danger-bg),var(--color-surface-default))] shadow-[0_0_0_1px_var(--color-danger-border)]",
            className,
        );
    }

    return cn(
        baseClasses,
        "cursor-pointer border-[color:var(--color-border-subtle)] bg-[linear-gradient(180deg,var(--color-surface-default),var(--color-bg-deep))] hover:-translate-y-px hover:border-[color:var(--color-action-hover)] hover:shadow-lg hover:shadow-black/25 has-[:checked]:border-[color:var(--color-action-default)] has-[:checked]:bg-[var(--color-action-subtle)]",
        className,
    );
}

export function getChoiceLabelClasses({ disabled, hasError }: FormFieldState) {
    if (disabled) {
        return "text-body text-[var(--color-text-disabled)]";
    }

    if (hasError) {
        return "text-body text-[var(--color-danger-text)]";
    }

    return "text-body text-[var(--color-text-default)]";
}

export function getChoiceMessageClasses({ disabled, hasError }: FormFieldState) {
    if (hasError) {
        return "text-caption text-[var(--color-danger-text)]";
    }

    if (disabled) {
        return "text-caption text-[var(--color-text-disabled)]";
    }

    return "text-caption text-[var(--color-text-subtle)]";
}
