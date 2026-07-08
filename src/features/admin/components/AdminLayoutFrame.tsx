"use client";

import {
    Bell,
    Home,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
    Settings,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui";
import {
    AdminMobileNavigation,
    AdminSidebarNavigation,
} from "@/features/admin/components/AdminNavigation";

type AdminLayoutFrameProps = {
    children: ReactNode;
    signOutAction: () => Promise<void>;
};

export function AdminLayoutFrame({
    children,
    signOutAction,
}: AdminLayoutFrameProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <motion.div
            initial={false}
            animate={{
                gridTemplateColumns: isSidebarCollapsed
                    ? "76px minmax(0, 1fr)"
                    : "268px minmax(0, 1fr)",
            }}
            transition={{
                damping: 34,
                mass: 0.8,
                stiffness: 420,
                type: "spring",
            }}
            className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-default)] lg:grid"
        >
            <aside className="sticky top-0 z-50 hidden h-screen border-r border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] lg:flex lg:flex-col">
                <button
                    type="button"
                    className="focus-ring absolute -right-4 top-8 z-[60] inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-overlay)] text-[color:var(--color-text-muted)] shadow-lg shadow-black/20 backdrop-blur transition hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]"
                    onClick={() => setIsSidebarCollapsed((current) => !current)}
                    aria-label={
                        isSidebarCollapsed
                            ? "Déplier la sidebar"
                            : "Réduire la sidebar"
                    }
                    title={
                        isSidebarCollapsed
                            ? "Déplier la sidebar"
                            : "Réduire la sidebar"
                    }
                >
                    {isSidebarCollapsed ? (
                        <PanelLeftOpen className="size-4" aria-hidden="true" />
                    ) : (
                        <PanelLeftClose className="size-4" aria-hidden="true" />
                    )}
                </button>

                <div
                    className={`flex min-h-24 items-center gap-3 border-b border-[color:var(--color-border-subtle)] px-5 ${isSidebarCollapsed ? "justify-center" : ""
                        }`}
                >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] text-[color:var(--color-action-default)]">
                        <ShieldCheck className="size-5" aria-hidden="true" />
                    </span>
                    {!isSidebarCollapsed ? (
                        <div className="min-w-0">
                            <p className="text-label text-[color:var(--color-text-default)]">
                                Alchimiste Admin
                            </p>
                            <p className="truncate text-caption text-[color:var(--color-text-subtle)]">
                                Pilotage interne
                            </p>
                        </div>
                    ) : null}
                </div>

                <AdminSidebarNavigation collapsed={isSidebarCollapsed} />

                <div className="border-t border-[color:var(--color-border-subtle)] p-3">
                    {isSidebarCollapsed ? (
                        <div className="grid justify-center gap-2 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-2">
                            <CompactFooterLink
                                href="/"
                                icon={<Home className="size-4" aria-hidden="true" />}
                                label="Site public"
                            />
                            <CompactFooterLink
                                href="/espace-client"
                                icon={
                                    <UserRound
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Espace client"
                            />
                        </div>
                    ) : (
                        <div className="grid gap-2 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
                            <Button
                                href="/"
                                variant="secondary"
                                size="sm"
                                iconLeft={
                                    <Home className="size-4" aria-hidden="true" />
                                }
                                className="w-full"
                            >
                                Site public
                            </Button>
                            <Button
                                href="/espace-client"
                                variant="secondary"
                                size="sm"
                                iconLeft={
                                    <UserRound
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                className="w-full"
                            >
                                Espace client
                            </Button>
                        </div>
                    )}
                </div>
            </aside>

            <div className="min-w-0 overflow-x-hidden">
                <header className="sticky top-0 z-40 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-overlay)] backdrop-blur-xl">
                    <div className="flex min-h-14 flex-col gap-2 px-4 py-2 md:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] text-[color:var(--color-action-default)] lg:hidden">
                                <ShieldCheck className="size-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-label text-[color:var(--color-text-default)]">
                                    Admin
                                </p>
                            </div>
                        </div>

                        <AdminMobileNavigation />

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-1">
                                <IconTopbarButton
                                    href="/admin"
                                    icon={<Search className="size-4" aria-hidden="true" />}
                                    label="Recherche"
                                />
                                <IconTopbarButton
                                    href="/admin"
                                    icon={<Bell className="size-4" aria-hidden="true" />}
                                    label="Notifications"
                                />
                                <IconTopbarButton
                                    href="/compte/securite"
                                    icon={
                                        <Settings
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    }
                                    label="Réglages"
                                />
                            </div>
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

                <div className="min-w-0 overflow-x-hidden">{children}</div>
            </div>
        </motion.div>
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

function CompactFooterLink({
    href,
    icon,
    label,
}: {
    href: string;
    icon: ReactNode;
    label: string;
}) {
    return (
        <Link
            href={href}
            aria-label={label}
            title={label}
            className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-action-default)] text-[color:var(--color-action-default)] no-underline transition hover:border-[color:var(--color-action-hover)] hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-hover)]"
        >
            <span className="inline-flex size-4 items-center justify-center">
                {icon}
            </span>
            <span className="sr-only">{label}</span>
        </Link>
    );
}
