import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

import { cn } from "@/components/ui/forms/shared";

export type BreadcrumbItem = {
    href?: string;
    label: string;
};

export type BreadcrumbSize = "sm" | "md";

export type BreadcrumbProps = {
    className?: string;
    items: readonly BreadcrumbItem[];
    size?: BreadcrumbSize;
};

const sizeClasses: Record<BreadcrumbSize, string> = {
    sm: "text-caption",
    md: "text-body-small",
};

export function Breadcrumb({
    className,
    items,
    size = "sm",
}: BreadcrumbProps) {
    return (
        <nav
            aria-label="Fil d'Ariane"
            className={cn("max-w-full overflow-hidden", className)}
        >
            <ol
                className={cn(
                    "flex min-w-0 flex-wrap items-center gap-1.5 text-[color:var(--color-text-muted)]",
                    sizeClasses[size],
                )}
            >
                {items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            className="flex min-w-0 items-center gap-1.5"
                        >
                            {isFirst ? (
                                <Home
                                    className="size-3.5 shrink-0"
                                    aria-hidden="true"
                                />
                            ) : (
                                <ChevronRight
                                    className="size-3 shrink-0 text-[color:var(--color-decor-gold)]"
                                    aria-hidden="true"
                                />
                            )}

                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="truncate no-underline transition-colors duration-150 hover:text-[color:var(--color-action-hover)]"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className="truncate text-[color:var(--color-decor-gold)]"
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
