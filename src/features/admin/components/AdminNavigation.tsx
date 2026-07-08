"use client";

import {
    BookOpenCheck,
    BriefcaseBusiness,
    FileText,
    ImagePlus,
    Images,
    KanbanSquare,
    LayoutDashboard,
    PackageOpen,
    Receipt,
    SwatchBook,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

import { Button } from "@/components/ui";

type ShellNavItem = {
    description: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
};

type ShellNavGroup = {
    items: ShellNavItem[];
    label: string;
};

const adminNavigationGroups: ShellNavGroup[] = [
    {
        label: "Pilotage",
        items: [
            {
                description: "Priorités, alertes et activité",
                href: "/admin",
                icon: LayoutDashboard,
                label: "Dashboard",
            },
            {
                description: "Demandes, opportunités et pipeline",
                href: "/admin/demandes",
                icon: KanbanSquare,
                label: "Demandes",
            },
            {
                description: "Projets convertis, roadmaps et production",
                href: "/admin/projets",
                icon: BriefcaseBusiness,
                label: "Projets",
            },
            {
                description: "Comptes, prospects et clients",
                href: "/admin/clients",
                icon: Users,
                label: "Clients",
            },
        ],
    },
    {
        label: "Catalogue",
        items: [
            {
                description: "Offres, familles et disponibilité",
                href: "/admin/offres",
                icon: PackageOpen,
                label: "Offres",
            },
            {
                description: "Images Cloudinary réutilisables",
                href: "/admin/mediatheque",
                icon: ImagePlus,
                label: "Médiathèque",
            },
            {
                description: "Cas portfolio et preuves publiques",
                href: "/admin/realisations",
                icon: Images,
                label: "Réalisations",
            },
            {
                description: "Templates Project OS",
                href: "/admin/playbooks",
                icon: BookOpenCheck,
                label: "Playbooks",
            },
        ],
    },
    {
        label: "Opérations",
        items: [
            {
                description: "Liens Drive, livrables et preuves",
                href: "/admin/documents",
                icon: FileText,
                label: "Documents",
            },
            {
                description: "Devis, acomptes et encaissements",
                href: "/admin/finance",
                icon: Receipt,
                label: "Finance",
            },
            {
                description: "Fondations et composants transverses",
                href: "/admin/design",
                icon: SwatchBook,
                label: "Design",
            },
        ],
    },
];

const adminNavigation = adminNavigationGroups.flatMap((group) => group.items);

export function AdminSidebarNavigation({
    collapsed = false,
}: {
    collapsed?: boolean;
}) {
    const pathname = usePathname();

    return (
        <nav
            className={`flex flex-1 flex-col overflow-y-auto py-5 ${
                collapsed ? "gap-4 px-3" : "gap-6 px-4"
            }`}
            aria-label="Navigation admin"
        >
            {adminNavigationGroups.map((group) => (
                <section key={group.label} className="flex flex-col gap-1.5">
                    {!collapsed ? (
                        <p className="px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-subtle)]">
                            {group.label}
                        </p>
                    ) : null}
                    <div className="flex flex-col gap-1">
                        {group.items.map((item) => (
                            <SidebarLink
                                key={item.href}
                                item={item}
                                active={isActivePath(pathname, item.href)}
                                collapsed={collapsed}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </nav>
    );
}

export function AdminMobileNavigation() {
    const pathname = usePathname();

    return (
        <nav
            className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:hidden"
            aria-label="Navigation admin mobile"
        >
            {adminNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);

                return (
                    <Button
                        key={item.href}
                        href={item.href}
                        variant={active ? "secondary" : "ghost"}
                        size="sm"
                        iconLeft={<Icon className="size-4" aria-hidden="true" />}
                        className="shrink-0"
                    >
                        {item.label}
                    </Button>
                );
            })}
        </nav>
    );
}

function SidebarLink({
    active,
    collapsed,
    item,
}: {
    active: boolean;
    collapsed: boolean;
    item: ShellNavItem;
}) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            aria-label={`${item.label} - ${item.description}`}
            title={collapsed ? item.label : undefined}
            className={`focus-ring group relative flex min-h-11 items-center rounded-2xl no-underline transition-colors ${
                active
                    ? "bg-[var(--color-surface-interactive)] text-[color:var(--color-text-default)]"
                    : "text-[color:var(--color-text-muted)] hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
            } ${collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"}`}
        >
            {active ? (
                <span
                    className="absolute left-0 top-2.5 h-6 w-1 rounded-r-full bg-[var(--color-action-default)]"
                    aria-hidden="true"
                />
            ) : null}
            <span
                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    active
                        ? "bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                        : "bg-[var(--color-surface-interactive)] text-[color:var(--color-text-subtle)] group-hover:text-[color:var(--color-action-default)]"
                }`}
            >
                <Icon className="size-4" aria-hidden="true" />
            </span>
            {!collapsed ? (
                <span className="min-w-0 truncate text-label">{item.label}</span>
            ) : null}
        </Link>
    );
}

function isActivePath(pathname: string, href: string) {
    if (href === "/admin") return pathname === href;

    return pathname === href || pathname.startsWith(`${href}/`);
}
