"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectMockupDuo, Section } from "@/components/layout";
import { Badge } from "@/components/ui";
import type { RealisationsPageContent } from "@/content/realisations";

type RealisationsGallerySectionProps = {
    content: RealisationsPageContent["gallery"];
};

type GalleryProject = RealisationsPageContent["gallery"]["projects"][number];

/**
 * La galerie, cœur de la page : filtres par type de projet (client, sans
 * rechargement), puis les réalisations en cartes où le vrai site est mis en
 * scène dans un mockup navigateur posé sur un fond de marque. Grille
 * verticale dès le mobile.
 */
export function RealisationsGallerySection({
    content,
}: RealisationsGallerySectionProps) {
    const types = useMemo(() => {
        const unique = Array.from(
            new Set(content.projects.map((project) => project.type)),
        );
        return [content.allLabel, ...unique];
    }, [content.projects, content.allLabel]);

    const [activeType, setActiveType] = useState<string>(content.allLabel);

    const visibleProjects = useMemo(() => {
        if (activeType === content.allLabel) {
            return content.projects;
        }
        return content.projects.filter((project) => project.type === activeType);
    }, [activeType, content.projects, content.allLabel]);

    return (
        <Section
            id="galerie"
            className="scroll-mt-24 border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 md:mt-10">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.filterLabel}
                </p>
                <div
                    className="flex flex-wrap gap-2.5"
                    role="group"
                    aria-label={content.filterLabel}
                >
                    {types.map((type) => {
                        const isActive = type === activeType;
                        return (
                            <button
                                key={type}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => setActiveType(type)}
                                className={`focus-ring inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-body-small font-medium transition-[background-color,border-color,color] duration-200 ease-standard ${
                                    isActive
                                        ? "border-[color:var(--color-decor-gold)] bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                                        : "border-[color:var(--color-border-strong)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-decor-gold)]/60 hover:text-[color:var(--color-text-default)]"
                                }`}
                            >
                                {type}
                            </button>
                        );
                    })}
                </div>
            </div>

            {visibleProjects.length > 0 ? (
                <ul className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:gap-6">
                    {visibleProjects.map((project) => (
                        <li key={project.id}>
                            <GalleryProjectCard project={project} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-8 text-body text-[color:var(--color-text-muted)]">
                    {content.emptyLabel}
                </p>
            )}
        </Section>
    );
}

function GalleryProjectCard({ project }: { project: GalleryProject }) {
    return (
        <Link
            href={project.href}
            className="focus-ring group flex h-full flex-col overflow-hidden rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] no-underline shadow-elevation-1 transition-[border-color,box-shadow,transform] duration-300 ease-standard hover:-translate-y-1 hover:border-[color:var(--color-decor-gold)]/55 hover:shadow-elevation-3 motion-reduce:hover:translate-y-0"
        >
            <div className="relative isolate overflow-hidden border-b border-[color:var(--color-border-subtle)] bg-[image:var(--gradient-hero)] bg-[var(--color-bg-deep)] px-4 pb-2 pt-6 sm:px-6 sm:pt-8">
                <span
                    className="pointer-events-none absolute -top-16 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,154,91,0.16),transparent_65%)]"
                    aria-hidden="true"
                />
                <span
                    className="absolute inset-x-6 top-0 z-10 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)]"
                    aria-hidden="true"
                />
                <ProjectMockupDuo
                    desktop={project.mockup}
                    mobile={project.mockupMobile}
                    sizes="(min-width: 768px) 46vw, 92vw"
                    className="z-0 translate-y-1 transition-transform duration-500 ease-standard group-hover:translate-y-0 motion-reduce:transform-none"
                />
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2.5">
                    <Badge tone="brand" size="sm">
                        {project.badge}
                    </Badge>
                    <span className="inline-flex items-center rounded-full border border-[color:var(--color-border-strong)] px-3 py-1 text-caption text-[color:var(--color-text-muted)]">
                        {project.type}
                    </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)] transition-colors duration-200 group-hover:text-[color:var(--color-action-default)]">
                    {project.title}
                </h3>
                <p className="text-body-small text-[color:var(--color-text-muted)]">
                    {project.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-2 text-body-small font-semibold text-[color:var(--color-action-default)]">
                    {"Voir l'étude de cas"}
                    <ArrowUpRight
                        className="size-4 transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                    />
                </span>
            </div>
        </Link>
    );
}
