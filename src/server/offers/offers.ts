import { offerDetailPages } from "@/content/offers";
import { getPrismaClient } from "@/server/db/client";

const offerFamilySelect = {
    id: true,
    slug: true,
    name: true,
    badge: true,
    description: true,
    eyebrow: true,
    imageAlt: true,
    imageDesktop: true,
    imageSrc: true,
    imageTablet: true,
    isActive: true,
    publicHref: true,
    sortOrder: true,
    title: true,
    _count: {
        select: {
            offers: true,
        },
    },
} as const;

const offerSelect = {
    id: true,
    slug: true,
    name: true,
    family: true,
    familyId: true,
    imageAlt: true,
    imageSrc: true,
    familyRecord: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
    startingPriceCents: true,
    startingPriceLabel: true,
    publicHref: true,
    isActive: true,
    sortOrder: true,
    _count: {
        select: {
            opportunities: true,
            projects: true,
            financialDocuments: true,
        },
    },
} as const;

export async function getAdminOffers() {
    const prisma = getPrismaClient();

    const [offers, families] = await Promise.all([
        prisma.offer.findMany({
            orderBy: [{ family: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
            select: offerSelect,
        }),
        prisma.offerFamily.findMany({
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: offerFamilySelect,
        }),
    ]);

    const enrichedOffers = offers.map(enrichOffer);

    const legacyFamilies = Array.from(
        new Set(enrichedOffers.map((offer) => offer.family)),
    );

    return {
        families,
        offers: enrichedOffers,
        totals: {
            offers: enrichedOffers.length,
            active: enrichedOffers.filter((offer) => offer.isActive).length,
            standby: enrichedOffers.filter((offer) => !offer.isActive).length,
            families: families.length || legacyFamilies.length,
        },
    };
}

export async function getAdminOfferFamily(familyId: string) {
    const prisma = getPrismaClient();

    return prisma.offerFamily.findUnique({
        where: { id: familyId },
        select: offerFamilySelect,
    });
}

export async function getAdminOffer(offerId: string) {
    const offer = await getAdminOfferFromDb(offerId);

    return offer ? enrichOffer(offer) : null;
}

function enrichOffer(offer: NonNullable<Awaited<ReturnType<typeof getAdminOfferFromDb>>>) {
    const publicContent = offerDetailPages.find(
        (detail) => detail.slug === offer.slug,
    );
    const dbImage = offer.imageSrc
        ? {
              alt: offer.imageAlt ?? offer.name,
              desktop: offer.imageSrc,
              src: offer.imageSrc,
              tablet: offer.imageSrc,
          }
        : null;

    return {
        ...offer,
        familyLabel: offer.familyRecord?.name ?? offer.family,
        publicContent: publicContent
            ? {
                  description: publicContent.hero.description,
                  image: dbImage ?? {
                      alt: publicContent.hero.images.alt,
                      desktop: publicContent.hero.images.desktop,
                      src: publicContent.hero.images.mobile,
                      tablet: publicContent.hero.images.tablet,
                  },
                  price: publicContent.hero.price,
                  pricingTitle: publicContent.pricing.title,
                  included: publicContent.pricing.included,
                  options: publicContent.pricing.options,
                  factors: publicContent.pricing.factors,
                  scopeGroups: publicContent.scope.groups,
                  seoTitle: publicContent.seo.title,
              }
            : dbImage
                ? {
                      description: "",
                      image: dbImage,
                      price: offer.startingPriceLabel ?? "",
                      pricingTitle: "",
                      included: [],
                      options: [],
                      factors: [],
                      scopeGroups: [],
                      seoTitle: offer.name,
                  }
                : null,
    };
}

async function getAdminOfferFromDb(offerId: string) {
    return getPrismaClient().offer.findUnique({
        where: { id: offerId },
        select: offerSelect,
    });
}
