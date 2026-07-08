import type { Metadata } from "next";

import { LegalPage } from "@/features/public/legal";
import { legalPagesContent } from "@/content/legal";
import { noIndexRobots } from "@/lib/seo";

const content = legalPagesContent.cgu;

export const metadata: Metadata = {
    title: content.seo.title,
    description: content.seo.description,
    robots: noIndexRobots,
};

export default function ConditionsGeneralesUtilisationPage() {
    return <LegalPage content={content} />;
}
