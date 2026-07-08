"use client";

import {
    ArrowUpRight,
    ChevronDown,
    LogOut,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import {
    useEffect,
    useId,
    useRef,
    useState,
    type ComponentType,
    type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { privateRoutes, publicCtas } from "@/config";
import { signOutAction } from "@/server/auth/actions";

import type { PrivateAccess } from "./PrivateAccess";

type HeaderAccountMenuProps = {
    /** Session connectée (jamais `null` ici — l'anonyme voit le CTA direct). */
    privateAccess: NonNullable<PrivateAccess>;
};

/**
 * Menu compte du header (desktop), affiché quand la personne est connectée :
 * un déclencheur discret ouvre un panneau avec l'accès à son espace (ou à
 * l'admin), le raccourci « présenter un projet » et la déconnexion. Pattern
 * « menu button » accessible : ouverture au clic ou flèche bas, focus sur le
 * premier élément, navigation flèches / Home / End, fermeture au clic
 * extérieur, à Échap (avec retour du focus) et après un choix.
 */
export function HeaderAccountMenu({ privateAccess }: HeaderAccountMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuId = useId();

    const isAdmin = privateAccess.isAdmin;
    const accessHref = isAdmin
        ? privateAccess.adminPath ?? privateRoutes.admin
        : privateAccess.clientPath;

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", onPointerDown);

        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    // À l'ouverture, on porte le focus sur le premier élément du menu.
    useEffect(() => {
        if (!open) return;

        getMenuItems(menuRef.current)[0]?.focus();
    }, [open]);

    const closeAndRefocus = () => {
        setOpen(false);
        triggerRef.current?.focus();
    };

    const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
        }
    };

    const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeAndRefocus();

            return;
        }

        const items = getMenuItems(menuRef.current);

        if (items.length === 0) return;

        const currentIndex = items.indexOf(
            document.activeElement as HTMLElement,
        );

        if (event.key === "ArrowDown") {
            event.preventDefault();
            items[(currentIndex + 1) % items.length]?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            items[(currentIndex - 1 + items.length) % items.length]?.focus();
        } else if (event.key === "Home") {
            event.preventDefault();
            items[0]?.focus();
        } else if (event.key === "End") {
            event.preventDefault();
            items[items.length - 1]?.focus();
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((current) => !current)}
                onKeyDown={onTriggerKeyDown}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[rgba(15,14,11,0.48)] pl-2.5 pr-3 text-label uppercase tracking-[0.08em] text-[color:var(--color-text-default)] backdrop-blur-md transition-colors duration-150 hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-hover)]"
            >
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                    {isAdmin ? (
                        <ShieldCheck className="size-3.5" aria-hidden="true" />
                    ) : (
                        <UserRound className="size-3.5" aria-hidden="true" />
                    )}
                </span>
                Mon compte
                <ChevronDown
                    className={`size-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>

            {open ? (
                <div
                    ref={menuRef}
                    id={menuId}
                    role="menu"
                    aria-label="Menu du compte"
                    onKeyDown={onMenuKeyDown}
                    className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-60 flex-col gap-1 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-2 shadow-elevation-2"
                >
                    <AccountMenuLink
                        href={accessHref}
                        icon={isAdmin ? ShieldCheck : UserRound}
                        label={isAdmin ? "Ouvrir l'admin" : "Mon espace"}
                        onSelect={() => setOpen(false)}
                    />
                    <AccountMenuLink
                        href={publicCtas.presentProject.href}
                        icon={ArrowUpRight}
                        label={publicCtas.presentProject.label}
                        onSelect={() => setOpen(false)}
                    />
                    <div className="my-1 h-px bg-[color:var(--color-border-subtle)]" />
                    <form action={signOutAction}>
                        <button
                            type="submit"
                            role="menuitem"
                            tabIndex={-1}
                            className="focus-ring flex w-full items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-left text-body-small text-[color:var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                        >
                            <LogOut className="size-4" aria-hidden="true" />
                            Se déconnecter
                        </button>
                    </form>
                </div>
            ) : null}
        </div>
    );
}

/** Éléments focusables du menu (pattern roving : navigation aux flèches). */
function getMenuItems(menu: HTMLElement | null) {
    if (!menu) return [] as HTMLElement[];

    return Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
}

function AccountMenuLink({
    href,
    icon: Icon,
    label,
    onSelect,
}: {
    href: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
    onSelect: () => void;
}) {
    return (
        <Link
            href={href}
            role="menuitem"
            tabIndex={-1}
            onClick={onSelect}
            className="focus-ring flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-body-small text-[color:var(--color-text-default)] no-underline transition-colors duration-150 hover:bg-[var(--color-surface-interactive)]"
        >
            <span className="text-[color:var(--color-action-default)]">
                <Icon className="size-4" />
            </span>
            {label}
        </Link>
    );
}
