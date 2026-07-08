import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectMockupDuo, Section } from "@/components/layout";
import { Badge } from "@/components/ui";
import { publicRoutes } from "@/config/navigation";
import type { RealisationsProjectContent } from "@/content/realisations";

type ProjectNextSectionProps = {
    project: RealisationsProjectContent;
};

/**
 * Projet suivant : la fin de l'étude de cas relance la lecture vers une
 * autre réalisation plutôt que dans le vide, avec le vrai site du projet en
 * duo desktop + mobile.
 */
export function ProjectNextSection({ project }: ProjectNextSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                Projet suivant
            </p>

            <Link
                href={`${publicRoutes.realisations}/${project.slug}`}
                className="focus-ring group mt-6 grid items-center gap-2 overflow-hidden rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] no-underline shadow-elevation-1 transition-[border-color,box-shadow] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/60 hover:shadow-elevation-3 md:mt-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
            >
                <div className="relative isolate overflow-hidden bg-[image:var(--gradient-hero)] bg-[var(--color-bg-deep)] px-5 pb-2 pt-7 sm:px-8 md:pt-8">
                    <span
                        className="pointer-events-none absolute -top-16 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,154,91,0.14),transparent_65%)]"
                        aria-hidden="true"
                    />
                    <ProjectMockupDuo
                        desktop={project.mockups.desktop}
                        mobile={project.mockups.mobile}
                        sizes="(min-width: 768px) 52vw, 92vw"
                        className="transition-transform duration-500 ease-standard group-hover:-translate-y-1 motion-reduce:transform-none"
                    />
                </div>

                <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Badge tone="brand" size="sm">
                            {project.badge}
                        </Badge>
                        <span className="text-caption text-[color:var(--color-text-muted)]">
                            {project.hero.type}
                        </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)] transition-colors duration-200 group-hover:text-[color:var(--color-action-default)]">
                        {project.title}
                    </h3>
                    <p className="max-w-[440px] text-body-small text-[color:var(--color-text-muted)]">
                        {project.card.description}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-2 text-body-small font-semibold text-[color:var(--color-action-default)]">
                        Voir le projet
                        <ArrowUpRight
                            className="size-4 transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                            aria-hidden="true"
                        />
                    </span>
                </div>
            </Link>
        </Section>
    );
}
