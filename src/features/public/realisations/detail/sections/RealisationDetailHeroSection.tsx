import { ArrowUpRight, ChevronRight } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Badge, Breadcrumb, Button } from "@/components/ui";
import { publicRoutes } from "@/config/navigation";
import type { RealisationsProjectContent } from "@/content/realisations";

type RealisationDetailHeroSectionProps = {
    project: RealisationsProjectContent;
};

/**
 * Héros commun des études de cas : le vrai site en fond plein cadre (capture
 * réelle, portrait sur mobile, accueil desktop au-delà), assombri par un
 * dégradé, avec le texte du projet par-dessus. Composition partagée par les
 * 5 fiches.
 */
export function RealisationDetailHeroSection({
    project,
}: RealisationDetailHeroSectionProps) {
    const { hero, badge, website } = project;

    return (
        <PublicHero
            images={hero.images}
            contentClassName="min-h-[82svh] content-end pb-10 md:min-h-[64svh] md:pb-14 lg:min-h-[66svh] lg:pb-16"
        >
            <div className="flex max-w-[760px] flex-col gap-5 md:gap-6">
                <Breadcrumb
                    className="anim-rise"
                    items={[
                        { href: publicRoutes.home, label: "Accueil" },
                        { href: publicRoutes.realisations, label: "Réalisations" },
                        { label: project.title },
                    ]}
                />

                <div className="anim-rise flex flex-wrap items-center gap-2.5">
                    <Badge tone="brand" size="sm">
                        {badge}
                    </Badge>
                    <span className="inline-flex items-center rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.42)] px-3 py-1 text-caption text-[color:var(--color-text-muted)] backdrop-blur-sm">
                        {hero.type}
                    </span>
                </div>

                <h1 className="anim-rise-2 max-w-[18ch] text-balance text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]">
                    {hero.title}
                </h1>

                <p className="anim-rise-3 max-w-[600px] text-body text-[color:var(--color-text-muted)]">
                    {hero.description}
                </p>

                <div className="anim-rise-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                        href={hero.primaryAction.href}
                        variant="primary"
                        size="lg"
                        className="shadow-[var(--glow-action)]"
                        iconRight={
                            <ChevronRight className="size-4" aria-hidden="true" />
                        }
                    >
                        {hero.primaryAction.label}
                    </Button>
                    {website ? (
                        <Button
                            href={website.href}
                            variant="secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                            iconRight={
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            }
                        >
                            {website.label}
                        </Button>
                    ) : null}
                </div>
            </div>
        </PublicHero>
    );
}
