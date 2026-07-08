import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { ResponsiveFillImage, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { HomePageContent } from "@/content/home";

type ProjectsSectionProps = {
    content: HomePageContent["projects"];
    projects: HomePageContent["featuredProjects"];
};

/**
 * La preuve, en matière : deux réalisations plein cadre en grille
 * éditoriale décalée — visuel immersif du projet, titre display posé
 * dessus, survol vivant (zoom lent + flèche). La section ouvre la home
 * juste après le héros : montrer avant d'expliquer.
 */
export function ProjectsSection({ content, projects }: ProjectsSectionProps) {
    const [featured, second] = projects;

    return (
        <Section spacing="lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
                <div className="flex max-w-[640px] flex-col gap-3">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        {content.eyebrow}
                    </p>
                    <h2 className="text-balance">{content.title}</h2>
                    <p className="max-w-[520px] text-body-small text-[color:var(--color-text-muted)]">
                        {content.description}
                    </p>
                </div>
                <Button
                    href={content.action.href}
                    variant="ghost"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    className="shrink-0 self-start md:self-end"
                >
                    {content.action.label}
                </Button>
            </div>

            <div className="mt-8 grid gap-5 md:mt-12 lg:grid-cols-12 lg:gap-6">
                {featured ? (
                    <ProjectShowcaseCard
                        project={featured}
                        className="lg:col-span-7"
                        priorityHeight="h-[440px] sm:h-[520px] lg:h-[600px]"
                        sizes="(min-width: 1024px) 56vw, 100vw"
                    />
                ) : null}
                {second ? (
                    <ProjectShowcaseCard
                        project={second}
                        className="lg:col-span-5 lg:mt-20"
                        priorityHeight="h-[440px] sm:h-[520px] lg:h-[520px]"
                        sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                ) : null}
            </div>
        </Section>
    );
}

function ProjectShowcaseCard({
    className,
    priorityHeight,
    project,
    sizes,
}: {
    className?: string;
    priorityHeight: string;
    project: HomePageContent["featuredProjects"][number];
    sizes: string;
}) {
    return (
        <Link
            href={project.href}
            className={`focus-ring group relative isolate block overflow-hidden rounded-panel border border-[color:var(--color-border-subtle)] no-underline shadow-elevation-1 transition-[border-color,box-shadow] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/60 hover:shadow-elevation-3 ${priorityHeight} ${className ?? ""}`}
        >
            <ResponsiveFillImage
                image={project.image}
                sizes={sizes}
                className="z-0 object-cover transition-transform duration-700 ease-standard group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            />
            <span
                className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0.18)_0%,rgba(15,14,11,0.06)_40%,rgba(15,14,11,0.88)_100%)]"
                aria-hidden="true"
            />

            <span className="absolute left-4 top-4 z-20 inline-flex h-7 items-center rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.55)] px-3 text-caption font-medium text-[color:var(--color-text-muted)] backdrop-blur-sm md:left-5 md:top-5">
                {project.meta}
            </span>
            <span
                className="absolute right-4 top-4 z-20 inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/60 bg-[rgba(15,14,11,0.55)] text-[color:var(--color-decor-gold)] backdrop-blur-sm transition-[opacity,transform] duration-200 ease-standard md:right-5 md:top-5 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 motion-reduce:md:translate-y-0 motion-reduce:md:opacity-100"
                aria-hidden="true"
            >
                <ArrowUpRight className="size-4" />
            </span>

            <span className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 p-5 md:p-6">
                <span className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                    {project.title}
                </span>
                <span className="max-w-[440px] text-body-small text-[color:var(--color-text-muted)]">
                    {project.description}
                </span>
                <span className="mt-1 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex h-6 items-center rounded-full bg-[rgba(255,243,224,0.08)] px-2.5 text-caption text-[color:var(--color-text-muted)]"
                        >
                            {tag}
                        </span>
                    ))}
                </span>
            </span>
        </Link>
    );
}
