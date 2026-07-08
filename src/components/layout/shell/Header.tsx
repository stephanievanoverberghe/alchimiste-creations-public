"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
    ArrowUpRight,
    LogIn,
    LogOut,
    Menu,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import {
    mainNavigationLinks,
    privateRoutes,
    publicCtas,
    publicRoutes,
} from "@/config";
import { homeHeaderContent } from "@/content/home";
import { signOutAction } from "@/server/auth/actions";

import { HeaderAccountMenu } from "./HeaderAccountMenu";
import { usePrivateAccess, type PrivateAccess } from "./PrivateAccess";

/**
 * En-tête public global, fixé en haut de toutes les pages (rendu par le
 * layout (public)) : posé transparent sur les héros puis verre flouté
 * dès le scroll. Navigation desktop soulignée à l'or, menu plein écran
 * en display pour tablette/mobile, accès privé contextualisé (Connexion /
 * Mon espace / Admin — jamais exposé aux anonymes).
 */
export function Header({ className }: { className?: string }) {
    const pathname = usePathname();
    const privateAccess = usePrivateAccess();
    const scrolled = useScrolled();

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200 ease-standard ${
                scrolled
                    ? "border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-overlay)] shadow-elevation-1 backdrop-blur-xl"
                    : "border-b border-transparent bg-[linear-gradient(180deg,rgba(15,14,11,0.62)_0%,rgba(15,14,11,0.18)_70%,transparent_100%)]"
            } ${className ?? ""}`}
        >
            <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-5 md:px-8 lg:h-20 lg:px-6 xl:gap-4 xl:px-12">
                <BrandLink />

                <nav
                    className="hidden items-center gap-0.5 lg:flex"
                    aria-label="Navigation principale"
                >
                    {mainNavigationLinks
                        .filter(
                            (item) =>
                                item.href !== publicRoutes.home &&
                                item.href !== publicRoutes.contact,
                        )
                        .map((item) => (
                            <DesktopNavigationLink
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                active={isActive(pathname, item.href)}
                            />
                        ))}
                </nav>

                <div className="hidden shrink-0 items-center lg:flex">
                    {privateAccess ? (
                        <HeaderAccountMenu privateAccess={privateAccess} />
                    ) : (
                        <Button
                            href={publicCtas.presentProject.href}
                            variant="secondary"
                            size="sm"
                            iconRight={
                                <ArrowUpRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            }
                        >
                            {publicCtas.presentProject.label}
                        </Button>
                    )}
                </div>

                <FullScreenMenu
                    pathname={pathname}
                    privateAccess={privateAccess}
                />
            </div>
        </header>
    );
}

/** Le header se solidifie (verre flouté) dès que la page défile. */
function useScrolled() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return scrolled;
}

/**
 * Lien actif : correspondance exacte pour l'accueil, préfixe pour les
 * autres — les pages détail (/offres/site-vitrine) allument leur parent.
 */
function isActive(pathname: string | null, href: string) {
    if (!pathname) return false;
    if (href === publicRoutes.home) return pathname === href;

    return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLink() {
    const content = homeHeaderContent;

    return (
        <Link
            href={publicRoutes.home}
            className="focus-ring group inline-flex min-w-0 shrink-0 items-center gap-3 rounded-full no-underline"
            aria-label={content.homeLabel}
        >
            <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/55 bg-[rgba(15,14,11,0.52)] transition-[border-color,box-shadow] duration-200 ease-standard group-hover:border-[color:var(--color-action-hover)] group-hover:shadow-[var(--glow-action)] lg:size-11">
                <span
                    className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_50%_42%,rgba(244,167,130,0.24),transparent_62%)]"
                    aria-hidden="true"
                />
                <Image
                    src={content.logo.src}
                    alt=""
                    width={44}
                    height={44}
                    className="relative size-8 object-contain lg:size-9"
                    priority
                />
            </span>

            <span className="flex min-w-0 flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] text-body font-semibold tracking-tight text-[color:var(--color-text-default)] transition-colors duration-150 group-hover:text-[color:var(--color-action-hover)]">
                    {content.brandLabel}
                </span>
                <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--color-decor-gold)] md:block">
                    {content.signature}
                </span>
            </span>
        </Link>
    );
}

function DesktopNavigationLink({
    active,
    href,
    label,
}: {
    active: boolean;
    href: string;
    label: string;
}) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`focus-ring group relative inline-flex h-11 items-center whitespace-nowrap rounded-full px-3 text-label uppercase tracking-[0.1em] no-underline transition-colors duration-150 ${
                active
                    ? "text-[color:var(--color-action-default)]"
                    : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-default)]"
            }`}
        >
            {label}
            <span
                className={`absolute inset-x-3 bottom-2 h-px origin-left rounded-full bg-[linear-gradient(90deg,var(--color-decor-gold),var(--color-action-default))] transition-transform duration-200 ease-standard ${
                    active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                }`}
                aria-hidden="true"
            />
        </Link>
    );
}

/**
 * Menu tablette/mobile plein écran : les pages en display géant,
 * numérotées et révélées en vague, l'action principale et l'accès privé
 * ancrés en bas. Les liens légaux vivent au footer, pas ici.
 */
function FullScreenMenu({
    pathname,
    privateAccess,
}: {
    pathname: string | null;
    privateAccess: ReturnType<typeof usePrivateAccess>;
}) {
    const content = homeHeaderContent;

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    type="button"
                    className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[rgba(15,14,11,0.48)] px-4 text-label uppercase tracking-[0.12em] text-[color:var(--color-text-default)] backdrop-blur-md transition-colors duration-150 hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-hover)] lg:hidden"
                    aria-label={content.menuLabel}
                >
                    <Menu className="size-4" aria-hidden="true" />
                    Menu
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[90] bg-[rgba(15,14,11,0.6)] data-[state=closed]:animate-[mobile-menu-overlay-out_180ms_ease-in] data-[state=open]:animate-[mobile-menu-overlay-in_200ms_ease-out]" />

                <Dialog.Content
                    className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[image:var(--gradient-hero)] bg-[var(--color-bg-main)] outline-none data-[state=closed]:animate-[mobile-menu-overlay-out_180ms_ease-in] data-[state=open]:animate-[mobile-menu-overlay-in_240ms_ease-out] lg:hidden"
                    aria-describedby={undefined}
                >
                    <Dialog.Title className="sr-only">Menu</Dialog.Title>

                    <div className="flex h-16 items-center justify-between px-5 md:px-8">
                        <Dialog.Close asChild>
                            <span>
                                <BrandLink />
                            </span>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="focus-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] text-[color:var(--color-text-default)] transition-[border-color,color,transform] duration-150 hover:rotate-90 hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-hover)] motion-reduce:hover:rotate-0"
                                aria-label="Fermer le menu"
                            >
                                <X className="size-5" aria-hidden="true" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <nav
                        className="flex flex-1 flex-col justify-center gap-1 px-6 py-8 md:px-12"
                        aria-label="Navigation mobile"
                    >
                        {mainNavigationLinks
                            .filter((item) => item.href !== publicRoutes.contact)
                            .map((item, index) => (
                                <FullScreenMenuLink
                                    key={item.href}
                                    active={isActive(pathname, item.href)}
                                    href={item.href}
                                    index={index}
                                    label={item.label}
                                />
                            ))}
                    </nav>

                    <div className="flex flex-col gap-4 border-t border-[color:var(--color-border-subtle)] px-6 pb-8 pt-5 md:px-12">
                        <Dialog.Close asChild>
                            <Button
                                href={publicCtas.presentProject.href}
                                variant="primary"
                                size="lg"
                                className="w-full shadow-[var(--glow-action)]"
                                iconRight={
                                    <ArrowUpRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                {publicCtas.presentProject.label}
                            </Button>
                        </Dialog.Close>

                        <MobileMenuAccount privateAccess={privateAccess} />

                        <p className="text-center text-caption uppercase tracking-[0.22em] text-[color:var(--color-decor-gold)]">
                            {content.signature}
                        </p>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

/**
 * Bloc « compte » du menu plein écran : pour un anonyme, un bouton
 * « Se connecter » ; pour une session active, un panneau avec l'accès à son
 * espace (ou à l'admin) et la déconnexion. La déconnexion passe par
 * `signOutAction` (Auth.js).
 */
function MobileMenuAccount({
    privateAccess,
}: {
    privateAccess: PrivateAccess;
}) {
    if (!privateAccess) {
        return (
            <Dialog.Close asChild>
                <Button
                    href={privateRoutes.login}
                    variant="secondary"
                    size="sm"
                    iconLeft={<LogIn className="size-4" aria-hidden="true" />}
                    className="w-full sm:w-fit"
                >
                    Se connecter
                </Button>
            </Dialog.Close>
        );
    }

    const isAdmin = privateAccess.isAdmin;
    const accessHref = isAdmin
        ? privateAccess.adminPath ?? privateRoutes.admin
        : privateAccess.clientPath;

    return (
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="flex items-center gap-2.5">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                    {isAdmin ? (
                        <ShieldCheck className="size-4" aria-hidden="true" />
                    ) : (
                        <UserRound className="size-4" aria-hidden="true" />
                    )}
                </span>
                <span className="text-body-small font-semibold text-[color:var(--color-text-default)]">
                    Accès privé
                </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Dialog.Close asChild>
                    <Button
                        href={accessHref}
                        variant="secondary"
                        size="sm"
                        iconLeft={
                            isAdmin ? (
                                <ShieldCheck
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            ) : (
                                <UserRound
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            )
                        }
                        className="w-full sm:flex-1"
                    >
                        {isAdmin ? "Ouvrir l'admin" : "Mon espace"}
                    </Button>
                </Dialog.Close>
                <form action={signOutAction} className="w-full sm:flex-1">
                    <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        iconLeft={<LogOut className="size-4" aria-hidden="true" />}
                        className="w-full"
                    >
                        Se déconnecter
                    </Button>
                </form>
            </div>
        </div>
    );
}

function FullScreenMenuLink({
    active,
    href,
    index,
    label,
}: {
    active: boolean;
    href: string;
    index: number;
    label: string;
}) {
    return (
        <Dialog.Close asChild>
            <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="anim-rise focus-ring group flex items-baseline gap-4 rounded-control py-2 no-underline md:gap-6"
                style={{ animationDelay: `${80 + index * 60}ms` }}
            >
                <span
                    className="w-7 shrink-0 text-right font-[family-name:var(--font-display)] text-body-small text-[color:var(--color-decor-gold)] opacity-70"
                    aria-hidden="true"
                >
                    {String(index + 1).padStart(2, "0")}
                </span>
                <span
                    className={`font-[family-name:var(--font-display)] text-[clamp(2.1rem,7.5vw,3.6rem)] font-semibold leading-[1.15] tracking-tight transition-[color,transform] duration-200 ease-standard group-hover:translate-x-2 motion-reduce:group-hover:translate-x-0 ${
                        active
                            ? "text-[color:var(--color-action-default)]"
                            : "text-[color:var(--color-text-default)] group-hover:text-[color:var(--color-action-hover)]"
                    }`}
                >
                    {label}
                </span>
            </Link>
        </Dialog.Close>
    );
}
