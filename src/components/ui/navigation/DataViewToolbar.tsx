"use client";

import type { ReactNode } from "react";

import { ViewModeSwitch } from "@/components/ui/forms/ViewModeSwitch";
import { cn } from "@/components/ui/forms/shared";

type DataViewToolbarOption = {
    icon: ReactNode;
    label: string;
    value: string;
};

type DataViewToolbarProps = {
    children: ReactNode;
    className?: string;
    countLabel?: string;
    filtersClassName?: string;
    viewLabel?: string;
    viewMode?: string;
    viewOptions?: DataViewToolbarOption[];
    onViewModeChange?: (value: string) => void;
};

export function DataViewToolbar({
    children,
    className,
    countLabel,
    filtersClassName,
    onViewModeChange,
    viewLabel = "Vue",
    viewMode,
    viewOptions,
}: DataViewToolbarProps) {
    const showViewSwitch = Boolean(viewMode && viewOptions && onViewModeChange);

    return (
        <div className="grid min-w-0 max-w-full gap-3">
            {countLabel ? (
                <p className="text-right text-body-small text-[color:var(--color-text-muted)]">
                    {countLabel}
                </p>
            ) : null}
            <div
                className={cn(
                    "flex flex-col gap-3 rounded-2xl border border-[color:var(--color-action-subtle)] bg-[var(--color-surface-default)] p-3 lg:flex-row lg:items-start lg:justify-between",
                    className,
                )}
            >
                <div
                    className={cn(
                        "grid min-w-0 flex-1 gap-3 md:grid-cols-[minmax(220px,340px)_minmax(180px,240px)]",
                        filtersClassName,
                    )}
                >
                    {children}
                </div>

                {showViewSwitch ? (
                    <ViewModeSwitch
                        label={viewLabel}
                        value={viewMode ?? ""}
                        onValueChange={onViewModeChange}
                        options={viewOptions ?? []}
                        hideOptionLabels
                        className="w-[104px] lg:shrink-0"
                    />
                ) : null}
            </div>
        </div>
    );
}
