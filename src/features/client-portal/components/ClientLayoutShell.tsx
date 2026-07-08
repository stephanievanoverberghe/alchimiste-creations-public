import {
    Bell,
    FolderKanban,
    Home,
    LayoutDashboard,
    LockKeyhole,
    LogOut,
    MessageSquareText,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import type { Session } from "next-auth";
import type { ComponentType, ReactNode, SVGProps } from "react";

import { Badge, Button } from "@/components/ui";
import { signOutAction } from "@/server/auth/actions";

type ClientLayoutShellProps = {
    children: ReactNode;
    session: Session;
    /** Titre de la topbar — surchargé par les pages hors dashboard. */
    topbarTitle?: string;
    /** Sous-titre de la topbar (contexte court sous le titre). */
    topbarSubtitle?: string;
};

type ShellNavItem = {
    description: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
};

// A request is not a project: the two journeys have their own routes
// (a request may never convert).
const clientNavigation: ShellNavItem[] = [
    {
        description: "Ta vue d'ensemble et tes prochaines actions",
        href: "/espace-client",
        icon: LayoutDashboard,
        label: "Dashboard",
    },
    {
        description: "Tes demandes en cours d'étude ou de proposition",
        href: "/espace-client/demandes",
        icon: MessageSquareText,
        label: "Mes demandes",
    },
    {
        description: "Tes projets engagés : avancement, documents, validations",
        href: "/espace-client/projets",
        icon: FolderKanban,
        label: "Mes projets",
    },
];

export function ClientLayoutShell({
    children,
    session,
    topbarTitle = "Dashboard client",
    topbarSubtitle = "Tu suis tes demandes, tes projets et tes actions.",
}: ClientLayoutShellProps) {
    const isAdmin = session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN";

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-default)] lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
            <aside className="sticky top-0 hidden h-screen border-r border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] lg:flex lg:flex-col">
                <div className="flex min-h-24 items-center gap-3 border-b border-[color:var(--color-border-subtle)] px-5">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] text-[color:var(--color-action-default)]">
                        <UserRound className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-label text-[color:var(--color-text-default)]">
                            Ton espace
                        </p>
                        <p className="truncate text-caption text-[color:var(--color-text-subtle)]">
                            Alchimiste Créations
                        </p>
                    </div>
                </div>

                <nav
                    className="flex flex-1 flex-col gap-2 p-4"
                    aria-label="Navigation espace client"
                >
                    {clientNavigation.map((item) => (
                        <SidebarLink key={`${item.label}-${item.href}`} item={item} />
                    ))}
                </nav>

                <div className="border-t border-[color:var(--color-border-subtle)] p-4">
                    <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
                        <Badge tone="success" size="sm">
                            Connecté
                        </Badge>
                        <p className="mt-3 truncate text-body-small text-[color:var(--color-text-default)]">
                            {session.user.email}
                        </p>
                        {isAdmin ? (
                            <Button
                                href="/admin"
                                variant="secondary"
                                size="sm"
                                iconLeft={
                                    <ShieldCheck
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                className="mt-4 w-full"
                            >
                                Espace admin
                            </Button>
                        ) : null}
                    </div>
                </div>
            </aside>

            <div className="min-w-0">
                <header className="sticky top-0 z-40 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-overlay)] backdrop-blur-xl">
                    <div className="flex min-h-16 flex-col gap-3 px-4 py-3 md:px-6 lg:min-h-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] text-[color:var(--color-action-default)] lg:hidden">
                                <UserRound className="size-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-label text-[color:var(--color-text-default)]">
                                    {topbarTitle}
                                </p>
                                <p className="truncate text-caption text-[color:var(--color-text-subtle)]">
                                    {topbarSubtitle}
                                </p>
                            </div>
                        </div>

                        <nav
                            className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:hidden"
                            aria-label="Navigation espace client mobile"
                        >
                            {clientNavigation.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Button
                                        key={`${item.label}-${item.href}`}
                                        href={item.href}
                                        variant="ghost"
                                        size="sm"
                                        iconLeft={<Icon className="size-4" aria-hidden="true" />}
                                        className="shrink-0"
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </nav>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-1">
                                <IconTopbarButton
                                    href="/espace-client"
                                    icon={<Bell className="size-4" aria-hidden="true" />}
                                    label="Notifications"
                                />
                                <IconTopbarButton
                                    href="/compte/securite"
                                    icon={<LockKeyhole className="size-4" aria-hidden="true" />}
                                    label="Sécurité"
                                />
                                {isAdmin ? (
                                    <IconTopbarButton
                                        href="/admin"
                                        icon={<ShieldCheck className="size-4" aria-hidden="true" />}
                                        label="Espace admin"
                                    />
                                ) : null}
                            </div>
                            <Button
                                href="/"
                                variant="ghost"
                                size="sm"
                                iconLeft={<Home className="size-4" aria-hidden="true" />}
                            >
                                Site public
                            </Button>
                            <form action={signOutAction}>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    size="sm"
                                    iconLeft={<LogOut className="size-4" aria-hidden="true" />}
                                >
                                    Déconnexion
                                </Button>
                            </form>
                        </div>
                    </div>
                </header>

                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}

function IconTopbarButton({
    href,
    icon,
    label,
}: {
    href: string;
    icon: ReactNode;
    label: string;
}) {
    return (
        <Button
            href={href}
            variant="ghost"
            size="sm"
            iconLeft={icon}
            aria-label={label}
            className="size-9 px-0"
        >
            <span className="sr-only">{label}</span>
        </Button>
    );
}

function SidebarLink({ item }: { item: ShellNavItem }) {
    const Icon = item.icon;

    return (
        <a
            href={item.href}
            className="focus-ring group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 no-underline transition-colors hover:border-[color:var(--color-border-subtle)] hover:bg-[var(--color-surface-interactive)]"
        >
            <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-interactive)] text-[color:var(--color-action-default)]">
                <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
                <span className="block text-label text-[color:var(--color-text-default)]">
                    {item.label}
                </span>
                <span className="mt-1 block text-caption text-[color:var(--color-text-subtle)]">
                    {item.description}
                </span>
            </span>
        </a>
    );
}
