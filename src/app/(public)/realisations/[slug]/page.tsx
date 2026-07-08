import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RealisationsDetailPage } from "@/features/public/realisations";
import {
    getRealisationsProjectBySlug,
    realisationsProjectPages,
} from "@/content/realisations";

type RealisationDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
    return realisationsProjectPages.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({
    params,
}: RealisationDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getRealisationsProjectBySlug(slug);

    if (!project) {
        return {};
    }

    return {
        title: project.seo.title,
        description: project.seo.description,
    };
}

export default async function RealisationSlugPage({
    params,
}: RealisationDetailPageProps) {
    const { slug } = await params;
    const project = getRealisationsProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return <RealisationsDetailPage project={project} />;
}
