import type { HTMLAttributes, ReactNode } from "react";

export type ContainerWidth = "page" | "content" | "narrow";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    width?: ContainerWidth;
};

const widthClasses: Record<ContainerWidth, string> = {
    page: "max-w-[1440px]",
    content: "max-w-[1120px]",
    narrow: "max-w-[760px]",
};

export function Container({
    children,
    className,
    width = "page",
    ...props
}: ContainerProps) {
    return (
        <div
            className={`mx-auto w-full px-5 md:px-8 lg:px-12 ${widthClasses[width]} ${className ?? ""}`}
            {...props}
        >
            {children}
        </div>
    );
}
