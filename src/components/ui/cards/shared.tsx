import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export const clickableClasses =
    "transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[color:var(--color-action-hover)] hover:shadow-xl hover:shadow-black/30";

export function CardAction({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full py-3 text-label text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-default)]">
            {children}
            <ChevronRight
                className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-active:translate-x-1 motion-reduce:translate-x-0"
                aria-hidden="true"
            />
        </span>
    );
}

export function CardImage({
    imageSrc,
    imageAlt = "",
    className,
}: {
    imageSrc?: string;
    imageAlt?: string;
    className: string;
}) {
    if (!imageSrc) {
        return null;
    }

    return (
        <div className={className}>
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
            />
        </div>
    );
}

export function MaybeLink({
    href,
    className,
    children,
}: {
    href?: string;
    className: string;
    children: ReactNode;
}) {
    if (href) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }

    return <article className={className}>{children}</article>;
}
