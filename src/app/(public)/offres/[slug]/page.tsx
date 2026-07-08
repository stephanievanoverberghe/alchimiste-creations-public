import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferDetailPage } from "@/features/public/offers";
import {
    getOfferDetailBySlug,
    offerDetailPages,
} from "@/content/offers";

type OfferDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
    return offerDetailPages.map((offer) => ({
        slug: offer.slug,
    }));
}

export async function generateMetadata({
    params,
}: OfferDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const offer = getOfferDetailBySlug(slug);

    if (!offer) {
        return {};
    }

    return {
        title: offer.seo.title,
        description: offer.seo.description,
    };
}

export default async function OfferSlugPage({
    params,
}: OfferDetailPageProps) {
    const { slug } = await params;
    const offer = getOfferDetailBySlug(slug);

    if (!offer) {
        notFound();
    }

    return <OfferDetailPage content={offer} />;
}
