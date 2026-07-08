import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
    ariaLabel?: string;
    className?: string;
    currentPage: number;
    getHref?: (page: number) => string;
    onPageChange?: (page: number) => void;
    totalPages: number;
};

const pageButtonClasses =
    "focus-ring inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold leading-none no-underline transition-[background-color,border-color,color,transform] duration-150 hover:scale-[1.03]";

const pageArrowClasses =
    "focus-ring inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] text-[color:var(--color-text-muted)] no-underline transition-[border-color,color,transform] duration-150 hover:scale-[1.03] hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-hover)]";

export function Pagination({
    ariaLabel = "Pagination",
    className = "",
    currentPage,
    getHref,
    onPageChange,
    totalPages,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const getSafeHref = (page: number) => getHref?.(page) ?? "#";

    return (
        <nav
            aria-label={ariaLabel}
            className={`flex items-center justify-center gap-2 ${className}`}
        >
            <PaginationArrow
                direction="previous"
                disabled={safeCurrentPage === 1}
                href={getSafeHref(Math.max(safeCurrentPage - 1, 1))}
                onClick={
                    onPageChange
                        ? () => onPageChange(Math.max(safeCurrentPage - 1, 1))
                        : undefined
                }
            />

            <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isCurrent = page === safeCurrentPage;
                    const className = `${pageButtonClasses} ${
                        isCurrent
                            ? "border-[color:var(--color-action-default)] bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)]"
                            : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-hover)]"
                    }`;

                    if (onPageChange) {
                        return (
                            <button
                                key={page}
                                type="button"
                                aria-current={isCurrent ? "page" : undefined}
                                className={className}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={page}
                            href={getSafeHref(page)}
                            aria-current={isCurrent ? "page" : undefined}
                            className={className}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            <PaginationArrow
                direction="next"
                disabled={safeCurrentPage === totalPages}
                href={getSafeHref(Math.min(safeCurrentPage + 1, totalPages))}
                onClick={
                    onPageChange
                        ? () => onPageChange(Math.min(safeCurrentPage + 1, totalPages))
                        : undefined
                }
            />
        </nav>
    );
}

function PaginationArrow({
    direction,
    disabled,
    href,
    onClick,
}: {
    direction: "next" | "previous";
    disabled: boolean;
    href: string;
    onClick?: () => void;
}) {
    const label = direction === "previous" ? "Page précédente" : "Page suivante";
    const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

    if (disabled) {
        return (
            <span
                aria-disabled="true"
                aria-label={label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] text-[color:var(--color-text-disabled)] opacity-60"
            >
                <Icon className="size-4" aria-hidden="true" />
            </span>
        );
    }

    if (onClick) {
        return (
            <button
                type="button"
                aria-label={label}
                className={pageArrowClasses}
                onClick={onClick}
            >
                <Icon className="size-4" aria-hidden="true" />
            </button>
        );
    }

    return (
        <Link href={href} aria-label={label} className={pageArrowClasses}>
            <Icon className="size-4" aria-hidden="true" />
        </Link>
    );
}
