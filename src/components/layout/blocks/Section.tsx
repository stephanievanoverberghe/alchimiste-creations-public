import type { HTMLAttributes, ReactNode } from "react";

export type SectionSpacing = "none" | "sm" | "md" | "lg";

type SectionProps = HTMLAttributes<HTMLElement> & {
    children: ReactNode;
    spacing?: SectionSpacing;
};

const spacingClasses: Record<SectionSpacing, string> = {
    none: "",
    sm: "py-8 md:py-14 lg:py-20",
    md: "py-10 md:py-16 lg:py-24",
    lg: "py-12 md:py-24 lg:py-32",
};

export function Section({
    children,
    className,
    spacing = "md",
    ...props
}: SectionProps) {
    return (
        <section
            className={`${spacingClasses[spacing]} ${className ?? ""}`}
            {...props}
        >
            {children}
        </section>
    );
}
