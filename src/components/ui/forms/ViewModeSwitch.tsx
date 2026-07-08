"use client";

import { type HTMLAttributes, type ReactNode } from "react";

import {
    cn,
    FormLabel,
    FormMessage,
    getFieldFrameClasses,
    useFormField,
} from "@/components/ui/forms/shared";

export type ViewModeSwitchOption = {
    icon?: ReactNode;
    label: string;
    value: string;
};

export type ViewModeSwitchProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
> & {
    disabled?: boolean;
    errorMessage?: string;
    helperText?: string;
    hideOptionLabels?: boolean;
    label: string;
    name?: string;
    onValueChange?: (value: string) => void;
    options: ViewModeSwitchOption[];
    value: string;
};

export function ViewModeSwitch({
    disabled = false,
    errorMessage,
    helperText,
    hideOptionLabels = false,
    id,
    label,
    name,
    onValueChange,
    options,
    value,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}: ViewModeSwitchProps) {
    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        id,
        name,
        message,
        ariaDescribedBy,
    });

    return (
        <div
            className={cn("relative flex flex-col gap-2", className ?? "w-full")}
            {...props}
        >
            <FormLabel
                htmlFor={`${fieldId}-${value}`}
                label={label}
                disabled={disabled}
                hasError={hasError}
            />

            <input name={name} type="hidden" value={value} />

            <div
                className={cn(
                    "grid h-14 gap-1 p-1",
                    getFieldFrameClasses({ disabled, hasError }),
                )}
                style={{
                    gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
                }}
                role="radiogroup"
                aria-describedby={describedBy}
                aria-invalid={hasError || ariaInvalid || undefined}
            >
                {options.map((option) => {
                    const isActive = option.value === value;

                    return (
                        <button
                            key={option.value}
                            id={`${fieldId}-${option.value}`}
                            type="button"
                            className={getViewModeButtonClasses({
                                disabled,
                                hideOptionLabels,
                                isActive,
                            })}
                            disabled={disabled}
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => onValueChange?.(option.value)}
                        >
                            {option.icon ? (
                                <span className="shrink-0" aria-hidden="true">
                                    {option.icon}
                                </span>
                            ) : null}
                            <span className={hideOptionLabels ? "sr-only" : "truncate"}>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
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

function getViewModeButtonClasses({
    disabled,
    hideOptionLabels,
    isActive,
}: {
    disabled: boolean;
    hideOptionLabels: boolean;
    isActive: boolean;
}) {
    return cn(
        "focus-ring inline-flex h-full min-w-0 items-center justify-center rounded-xl transition",
        hideOptionLabels ? "px-0" : "gap-2 px-3 text-caption",
        disabled && "cursor-not-allowed opacity-60",
        !disabled &&
            isActive &&
            "bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)]",
        !disabled &&
            !isActive &&
            "text-[color:var(--color-text-muted)] hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]",
    );
}
