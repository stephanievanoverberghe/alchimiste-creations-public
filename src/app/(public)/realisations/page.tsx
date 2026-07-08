import type { Metadata } from "next";

import { RealisationsPage } from "@/features/public/realisations";
import { realisationsPageContent } from "@/content/realisations";

export const metadata: Metadata = {
    title: realisationsPageContent.seo.title,
    description: realisationsPageContent.seo.description,
};

export default function RealisationsRoutePage() {
    return <RealisationsPage content={realisationsPageContent} />;
}
