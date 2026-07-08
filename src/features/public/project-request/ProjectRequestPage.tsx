import type { ProjectRequestPageContent } from "@/content/project-request";

import { ProjectRequestHeroSection } from "./sections/ProjectRequestHeroSection";
import { ProjectRequestJourneySection } from "./sections/ProjectRequestJourneySection";

type ProjectRequestPageProps = {
    content: ProjectRequestPageContent;
};

export function ProjectRequestPage({ content }: ProjectRequestPageProps) {
    return (
        <div className="flex flex-col gap-5">
            <ProjectRequestHeroSection
                activeHref={content.activeHref}
                content={content.hero}
            />
            <ProjectRequestJourneySection content={content} />
        </div>
    );
}
