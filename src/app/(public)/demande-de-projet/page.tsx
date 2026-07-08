import type { Metadata } from "next";

import { ProjectRequestPage } from "@/features/public/project-request";
import { projectRequestPageContent } from "@/content/project-request";

export const metadata: Metadata = {
    title: projectRequestPageContent.seo.title,
    description: projectRequestPageContent.seo.description,
};

export default function DemandeDeProjetPage() {
    return <ProjectRequestPage content={projectRequestPageContent} />;
}
