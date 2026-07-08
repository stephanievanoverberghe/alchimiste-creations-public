import type { ReactNode } from "react";

import { Container } from "@/components/layout";

type AdminPageShellProps = {
    children: ReactNode;
};

type AdminPageHeaderProps = {
    actions?: ReactNode;
    description: string;
    eyebrow: string;
    metrics?: ReactNode;
    title: string;
};

export function AdminPageShell({ children }: AdminPageShellProps) {
    return (
        <section className="min-w-0 overflow-x-hidden py-4 md:py-5 lg:py-6">
            <Container className="max-w-none px-3 md:px-4 lg:px-5">
                <div className="flex min-w-0 flex-col gap-5">{children}</div>
            </Container>
        </section>
    );
}

export function AdminPageHeader({
    actions,
    description,
    eyebrow,
    metrics,
    title,
}: AdminPageHeaderProps) {
    return (
        <header className="min-w-0 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 md:p-5">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex max-w-[860px] flex-col gap-2">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        {eyebrow}
                    </p>
                    <h1 className="text-h2 text-[color:var(--color-text-default)]">
                        {title}
                    </h1>
                    <p className="max-w-[760px] text-body-small text-[color:var(--color-text-muted)]">
                        {description}
                    </p>
                </div>
                {actions ? (
                    <div className="flex shrink-0 flex-col gap-3 lg:items-end">
                        {actions}
                    </div>
                ) : null}
            </div>
            {metrics ? <div className="mt-5 min-w-0">{metrics}</div> : null}
        </header>
    );
}
