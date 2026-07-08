import { Container } from "@/components/layout";
import type { HomePageContent } from "@/content/home";

import {
    HomeHeroSection,
    MethodSection,
    OffersSection,
    ProblemSection,
    ProjectsSection,
    StudioSection,
} from "./sections";

type HomePageProps = {
    content: HomePageContent;
};

/**
 * Home publique — un seul récit vertical, identique à tous les formats
 * (fin du carrousel-teaser mobile de l'audit F0) : héros display,
 * preuve immédiate par les réalisations, puis problème → méthode →
 * offres → studio → appel à l'action.
 */
export function HomePage({ content }: HomePageProps) {
    return (
        <div className="flex flex-col">
            <HomeHeroSection content={content.hero} />
            <Container>
                <ProjectsSection
                    content={content.projects}
                    projects={content.featuredProjects}
                />
                <ProblemSection content={content.problem} />
                <MethodSection content={content.method} />
                <OffersSection
                    categories={content.offerCategories}
                    content={content.offers}
                />
                <StudioSection content={content.studio} />
            </Container>
        </div>
    );
}
