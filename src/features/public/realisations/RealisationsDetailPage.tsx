import { Container } from "@/components/layout";
import {
    realisationsProjectPages,
    type RealisationsProjectContent,
} from "@/content/realisations";

import {
    ProjectApproachSection,
    ProjectContextSection,
    ProjectGallerySection,
    ProjectNextSection,
    ProjectObjectivesSection,
    ProjectOverviewSection,
    ProjectResultSection,
    RealisationDetailHeroSection,
} from "./detail";

type RealisationsDetailPageProps = {
    project: RealisationsProjectContent;
};

/**
 * Gabarit commun des études de cas — un seul récit storytelling du 375 au
 * desktop (fin du carrousel mobile), aligné sur l'intention A6 du plan :
 * le projet → le contexte → les objectifs → l'approche (les choix) → le
 * résultat, puis le projet suivant. L'appel final est porté par la bande
 * CTA du footer.
 */
export function RealisationsDetailPage({
    project,
}: RealisationsDetailPageProps) {
    const currentIndex = realisationsProjectPages.findIndex(
        (candidate) => candidate.slug === project.slug,
    );
    const nextProject =
        realisationsProjectPages[
            (currentIndex + 1) % realisationsProjectPages.length
        ];

    return (
        <div className="flex flex-col">
            <RealisationDetailHeroSection project={project} />
            <Container>
                <ProjectOverviewSection content={project.overview} />
                <ProjectGallerySection content={project.gallery} />
                <ProjectContextSection content={project.context} />
                <ProjectObjectivesSection content={project.objectives} />
                <ProjectApproachSection
                    method={project.method}
                    work={project.work}
                />
                <ProjectResultSection content={project.proof} />
                {nextProject ? (
                    <ProjectNextSection project={nextProject} />
                ) : null}
            </Container>
        </div>
    );
}
