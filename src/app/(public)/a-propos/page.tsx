import type { Metadata } from "next";

import { AboutPage } from "@/features/public/about";
import { aboutPageContent } from "@/content/about";

export const metadata: Metadata = {
    title: aboutPageContent.seo.title,
    description: aboutPageContent.seo.description,
};

export default function AProposPage() {
    return <AboutPage content={aboutPageContent} />;
}
