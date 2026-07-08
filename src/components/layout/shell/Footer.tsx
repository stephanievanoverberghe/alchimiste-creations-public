import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui";
import {
    footerNavigationLinks,
    footerOfferLinks,
    legalNavigationLinks,
    publicCtas,
    publicRoutes,
    socialLinks,
    type SocialPlatform,
} from "@/config";

import { CurrentYear } from "./CurrentYear";
import { FooterAccountLink } from "./FooterAccountLink";

type BrandIconProps = { className?: string };

/**
 * Glyphes de marque (LinkedIn, Instagram) en SVG inline : lucide-react ne
 * fournit plus les icônes de marque. Tracé officiel, `currentColor` pour
 * hériter de la couleur du lien.
 */
function LinkedinIcon({ className }: BrandIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function InstagramIcon({ className }: BrandIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    );
}

const socialIcons: Record<SocialPlatform, ComponentType<BrandIconProps>> = {
    linkedin: LinkedinIcon,
    instagram: InstagramIcon,
};

/**
 * Pied de page public : grande bande d'appel à l'action en display,
 * colonnes de navigation, bloc contact avec délai annoncé, wordmark en
 * filigrane, puis barre légale (cibles 44 px, © à année automatique,
 * accès espace privé selon la session).
 */
export function Footer() {
    return (
        <footer className="relative isolate overflow-hidden bg-[var(--color-bg-deep)]">
            <Image
                src="/images/backgrounds/footer.png"
                alt=""
                fill
                sizes="100vw"
                className="z-0 hidden object-cover opacity-70 md:block"
            />
            <span
                className="absolute inset-0 z-10 hidden bg-[linear-gradient(180deg,rgba(15,14,11,0.55)_0%,rgba(15,14,11,0.82)_100%)] md:block"
                aria-hidden="true"
            />
            <span
                className="absolute inset-0 z-10 bg-[image:var(--gradient-hero)] md:hidden"
                aria-hidden="true"
            />

            <div className="relative z-20 mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
                <div className="flex flex-col items-start gap-6 border-b border-[color:var(--color-border-subtle)] py-14 md:py-20 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                    <div className="flex max-w-[720px] flex-col gap-4">
                        <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                            Un projet en tête ?
                        </p>
                        <p className="max-w-[16ch] text-balance font-[family-name:var(--font-display)] text-h1 text-[color:var(--color-text-default)]">
                            Donnons une vraie direction à ton site.
                        </p>
                        <p className="max-w-[480px] text-body-small text-[color:var(--color-text-muted)]">
                            Pas besoin d&apos;un brief parfait : présente ton
                            idée, je réponds sous 48 h ouvrées avec une suite
                            claire.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-fit sm:flex-row sm:items-center lg:shrink-0">
                        <Button
                            href={publicCtas.presentProject.href}
                            variant="primary"
                            size="lg"
                            className="shadow-[var(--glow-action)]"
                            iconRight={
                                <ArrowUpRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            }
                        >
                            {publicCtas.presentProject.label}
                        </Button>
                        <Button
                            href={publicRoutes.contact}
                            variant="ghost"
                            iconLeft={
                                <MessageCircle
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            }
                        >
                            Écrire un message
                        </Button>
                    </div>
                </div>

                <div className="grid gap-10 py-12 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
                    <div className="flex max-w-[460px] flex-col gap-5">
                        <Link
                            href={publicRoutes.home}
                            className="focus-ring group flex w-fit items-center gap-3 rounded-full no-underline"
                            aria-label="Accueil Alchimiste Créations"
                        >
                            <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-[color:var(--color-decor-gold)]/55 bg-[var(--color-bg-deep)] transition-[border-color,box-shadow] duration-200 ease-standard group-hover:border-[color:var(--color-action-hover)] group-hover:shadow-[var(--glow-action)]">
                                <Image
                                    src="/images/brand/logo-primary.png"
                                    alt=""
                                    fill
                                    sizes="44px"
                                    className="object-contain p-2"
                                />
                            </span>
                            <span className="flex flex-col">
                                <span className="font-[family-name:var(--font-display)] text-body font-semibold tracking-tight text-[color:var(--color-text-default)]">
                                    Alchimiste Créations
                                </span>
                                <span className="text-caption uppercase tracking-[0.22em] text-[color:var(--color-decor-gold)]">
                                    Clarifier. Designer. Lancer.
                                </span>
                            </span>
                        </Link>

                        <p className="text-body-small text-[color:var(--color-text-muted)]">
                            Studio web indépendant : cadrage, design sur mesure
                            et développement moderne avancent ensemble, du
                            premier échange à la mise en ligne.
                        </p>

                        <FooterSocialLinks />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
                        <FooterNav
                            title="Navigation"
                            links={footerNavigationLinks}
                        />
                        <FooterNav title="Offres" links={footerOfferLinks} />
                        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                            <p className="text-caption font-medium uppercase tracking-[0.08em] text-[color:var(--color-decor-gold)]">
                                Suivi de projet
                            </p>
                            <p className="text-body-small text-[color:var(--color-text-muted)]">
                                Client d&apos;Alchimiste Créations ? Ton espace
                                suit ton projet en continu : avancement,
                                documents et validations.
                            </p>
                            <FooterAccountLink />
                        </div>
                    </div>
                </div>

                <p
                    className="pointer-events-none select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[clamp(1.6rem,7.6vw,8.25rem)] font-semibold leading-none tracking-tight text-[color:var(--color-text-default)] opacity-[0.05]"
                    aria-hidden="true"
                >
                    Alchimiste Créations
                </p>

                <div className="mt-4 flex flex-col gap-x-6 gap-y-1 border-t border-[color:var(--color-border-subtle)] pb-4 pt-2 lg:flex-row lg:items-center lg:justify-between">
                    <nav
                        className="flex flex-wrap items-center gap-x-5"
                        aria-label="Liens légaux"
                    >
                        {legalNavigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="inline-flex min-h-11 items-center text-caption text-[color:var(--color-text-muted)] no-underline transition-colors duration-150 hover:text-[color:var(--color-text-default)]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <p className="pb-3 text-caption text-[color:var(--color-text-subtle)] lg:pb-0">
                        &copy; <CurrentYear /> Alchimiste Créations. Tous
                        droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}

/**
 * Liens vers les réseaux sociaux du studio (config `socialLinks`) : boutons
 * ronds à cibles ≥ 44 px, ouverts dans un nouvel onglet en `rel=noopener`,
 * chaque icône doublée d'un libellé accessible.
 */
function FooterSocialLinks() {
    return (
        <ul className="flex flex-wrap items-center gap-3">
            {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];

                return (
                    <li key={social.href}>
                        <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${social.label} — Alchimiste Créations (nouvel onglet)`}
                            className="focus-ring inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[var(--color-surface-default)] text-[color:var(--color-text-muted)] transition-[border-color,color,transform] duration-200 ease-standard hover:-translate-y-0.5 hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-default)] motion-reduce:hover:translate-y-0"
                        >
                            <Icon className="size-5" aria-hidden="true" />
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}

type FooterNavProps = {
    links: readonly {
        href: string;
        label: string;
    }[];
    title: string;
};

function FooterNav({ links, title }: FooterNavProps) {
    return (
        <nav className="flex flex-col gap-2" aria-label={title}>
            <p className="text-caption font-medium uppercase tracking-[0.08em] text-[color:var(--color-decor-gold)]">
                {title}
            </p>
            <ul className="flex flex-col">
                {links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                        <Link
                            href={link.href}
                            className="focus-ring inline-flex min-h-11 items-center rounded-full text-body-small text-[color:var(--color-text-muted)] no-underline transition-colors duration-150 hover:text-[color:var(--color-text-default)]"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
