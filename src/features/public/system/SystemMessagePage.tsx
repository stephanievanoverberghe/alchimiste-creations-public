import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { mainNavigationLinks, publicRoutes } from "@/config";
import type { SystemPageContent } from "@/content/system";

type SystemMessagePageProps = {
    content: SystemPageContent;
    icon?: "check" | "not-found";
};

/**
 * Page message système — aujourd'hui la 404 (table rase, avec personnalité) :
 * grand « 404 » en display dégradé, message clair, actions, puis une rangée
 * d'accès rapides aux pages clés (mini plan de site) pour rebondir plutôt que
 * quitter. Le cas « check » reste géré pour un éventuel réemploi.
 */
export function SystemMessagePage({
    content,
    icon = "check",
}: SystemMessagePageProps) {
    const isNotFound = icon === "not-found";
    const quickLinks = mainNavigationLinks.filter(
        (link) => link.href !== publicRoutes.home,
    );

    return (
        <div className="flex min-h-[100svh] flex-col">
            <Section
                spacing="none"
                className="relative flex flex-1 items-center overflow-hidden bg-[radial-gradient(circle_at_18%_-10%,rgba(255,232,184,0.09),transparent_46%),var(--color-bg-main)]"
            >
                <Container
                    width="content"
                    className="pt-28 pb-16 md:pt-32 md:pb-20 lg:pt-36"
                >
                    <div className="flex max-w-[760px] flex-col gap-6">
                        <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                            {content.eyebrow}
                        </p>

                        {isNotFound ? (
                            <span
                                className="anim-rise-2 bg-[linear-gradient(105deg,var(--color-decor-gold),var(--color-action-default))] bg-clip-text font-[family-name:var(--font-display)] text-[clamp(4.5rem,17vw,11rem)] font-semibold leading-[0.9] tracking-[-0.02em] text-transparent"
                                aria-hidden="true"
                            >
                                404
                            </span>
                        ) : (
                            <span className="anim-rise-2 inline-flex size-14 items-center justify-center rounded-full bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)] shadow-[var(--glow-action)]">
                                <CheckCircle2 className="size-7" aria-hidden="true" />
                            </span>
                        )}

                        <div className="anim-rise-3 flex flex-col gap-3">
                            <h1 className="max-w-[18ch] text-balance text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.1] tracking-[-0.02em]">
                                {content.title}
                            </h1>
                            <p className="max-w-[600px] text-body text-[color:var(--color-text-muted)]">
                                {content.message}
                            </p>
                        </div>

                        <div className="anim-rise-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                            {content.actions.map((action, index) => (
                                <Button
                                    key={action.href}
                                    href={action.href}
                                    variant={action.variant}
                                    className={
                                        index === 0
                                            ? "w-full shadow-[var(--glow-action)] sm:w-fit"
                                            : "w-full sm:w-fit"
                                    }
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>

                        {isNotFound ? (
                            <div className="anim-rise-4 mt-4 flex flex-col gap-4 border-t border-[color:var(--color-border-subtle)] pt-6">
                                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                                    Ou rejoins une page directement
                                </p>
                                <ul className="flex flex-wrap gap-2.5">
                                    {quickLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] px-4 text-body-small font-medium text-[color:var(--color-text-muted)] no-underline transition-[border-color,color] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/60 hover:text-[color:var(--color-text-default)]"
                                            >
                                                {link.label}
                                                <ArrowUpRight
                                                    className="size-3.5 text-[color:var(--color-action-default)] transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </Container>
            </Section>
        </div>
    );
}
