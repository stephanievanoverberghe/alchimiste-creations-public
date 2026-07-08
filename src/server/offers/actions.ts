"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";

const offerPayloadSchema = z.object({
    family: z.string().trim().max(80).optional(),
    familyId: z.string().trim().optional(),
    id: z.string().trim().optional(),
    imageAlt: z.string().trim().max(240).optional(),
    imageSrc: z.string().trim().max(300).optional(),
    isActive: z.boolean(),
    name: z.string().trim().min(1).max(160),
    publicHref: z.string().trim().max(240).optional(),
    slug: z.string().trim().max(120).optional(),
    sortOrder: z.number().int().min(0).max(9999),
    startingPriceCents: z.number().int().min(0).optional(),
    startingPriceLabel: z.string().trim().max(120).optional(),
});

const offerFamilyPayloadSchema = z.object({
    badge: z.string().trim().max(80).optional(),
    description: z.string().trim().max(280).optional(),
    eyebrow: z.string().trim().max(120).optional(),
    id: z.string().trim().optional(),
    imageAlt: z.string().trim().max(240).optional(),
    imageDesktop: z.string().trim().max(300).optional(),
    imageSrc: z.string().trim().max(300).optional(),
    imageTablet: z.string().trim().max(300).optional(),
    isActive: z.boolean(),
    name: z.string().trim().min(1).max(120),
    publicHref: z.string().trim().max(240).optional(),
    slug: z.string().trim().max(80).optional(),
    sortOrder: z.number().int().min(0).max(9999),
    title: z.string().trim().max(160).optional(),
});

export async function createOfferAction(formData: FormData) {
    await requireAdminSession();

    const parsed = parseOfferPayload(formData);
    const slug = normalizeSlug(parsed.slug || parsed.name);
    if (!slug) redirect("/admin/offres?status=invalid-slug");

    const prisma = getPrismaClient();
    const existingOffer = await prisma.offer.findUnique({
        where: { slug },
        select: { id: true },
    });

    if (existingOffer) {
        redirect("/admin/offres?status=duplicate-slug");
    }

    const family = await resolveOfferFamily({
        fallbackFamily: parsed.family,
        familyId: parsed.familyId,
    });

    await prisma.offer.create({
        data: {
            family: family.family,
            familyId: family.familyId,
            imageAlt: nullableString(parsed.imageAlt),
            imageSrc: nullableString(parsed.imageSrc),
            isActive: parsed.isActive,
            name: parsed.name,
            publicHref: nullableString(parsed.publicHref),
            slug,
            sortOrder: parsed.sortOrder,
            startingPriceCents: parsed.startingPriceCents ?? null,
            startingPriceLabel: nullableString(parsed.startingPriceLabel),
        },
    });

    revalidateOffers();
    redirect("/admin/offres?status=created");
}

export async function updateOfferAction(formData: FormData) {
    await requireAdminSession();

    const parsed = parseOfferPayload(formData);
    const offerId = parsed.id?.trim();
    if (!offerId) redirect("/admin/offres?status=missing-offer");

    const slug = normalizeSlug(parsed.slug || parsed.name);
    if (!slug) redirect("/admin/offres?status=invalid-slug");

    const prisma = getPrismaClient();
    const duplicatedOffer = await prisma.offer.findFirst({
        where: {
            slug,
            NOT: { id: offerId },
        },
        select: { id: true },
    });

    if (duplicatedOffer) {
        redirect("/admin/offres?status=duplicate-slug");
    }

    const family = await resolveOfferFamily({
        fallbackFamily: parsed.family,
        familyId: parsed.familyId,
    });

    await prisma.offer.update({
        where: { id: offerId },
        data: {
            family: family.family,
            familyId: family.familyId,
            imageAlt: nullableString(parsed.imageAlt),
            imageSrc: nullableString(parsed.imageSrc),
            isActive: parsed.isActive,
            name: parsed.name,
            publicHref: nullableString(parsed.publicHref),
            slug,
            sortOrder: parsed.sortOrder,
            startingPriceCents: parsed.startingPriceCents ?? null,
            startingPriceLabel: nullableString(parsed.startingPriceLabel),
        },
    });

    revalidateOffers();
    redirect("/admin/offres?status=updated");
}

export async function createOfferFamilyAction(formData: FormData) {
    await requireAdminSession();

    const parsed = parseOfferFamilyPayload(formData);
    const slug = normalizeSlug(parsed.slug || parsed.name);
    if (!slug) redirect("/admin/offres?status=invalid-family-slug");

    const prisma = getPrismaClient();
    const existingFamily = await prisma.offerFamily.findUnique({
        where: { slug },
        select: { id: true },
    });

    if (existingFamily) {
        redirect("/admin/offres?status=duplicate-family");
    }

    await prisma.offerFamily.create({
        data: {
            badge: nullableString(parsed.badge),
            description: nullableString(parsed.description),
            eyebrow: nullableString(parsed.eyebrow),
            imageAlt: nullableString(parsed.imageAlt),
            imageDesktop: nullableString(parsed.imageDesktop),
            imageSrc: nullableString(parsed.imageSrc),
            imageTablet: nullableString(parsed.imageTablet),
            isActive: parsed.isActive,
            name: parsed.name,
            publicHref: nullableString(parsed.publicHref),
            slug,
            sortOrder: parsed.sortOrder,
            title: nullableString(parsed.title),
        },
    });

    revalidateOffers();
    redirect("/admin/offres?status=family-created");
}

export async function updateOfferFamilyAction(formData: FormData) {
    await requireAdminSession();

    const parsed = parseOfferFamilyPayload(formData);
    const familyId = parsed.id?.trim();
    if (!familyId) redirect("/admin/offres?status=missing-family");

    const slug = normalizeSlug(parsed.slug || parsed.name);
    if (!slug) redirect("/admin/offres?status=invalid-family-slug");

    const prisma = getPrismaClient();
    const duplicatedFamily = await prisma.offerFamily.findFirst({
        where: {
            slug,
            NOT: { id: familyId },
        },
        select: { id: true },
    });

    if (duplicatedFamily) {
        redirect("/admin/offres?status=duplicate-family");
    }

    await prisma.offerFamily.update({
        where: { id: familyId },
        data: {
            badge: nullableString(parsed.badge),
            description: nullableString(parsed.description),
            eyebrow: nullableString(parsed.eyebrow),
            imageAlt: nullableString(parsed.imageAlt),
            imageDesktop: nullableString(parsed.imageDesktop),
            imageSrc: nullableString(parsed.imageSrc),
            imageTablet: nullableString(parsed.imageTablet),
            isActive: parsed.isActive,
            name: parsed.name,
            publicHref: nullableString(parsed.publicHref),
            slug,
            sortOrder: parsed.sortOrder,
            title: nullableString(parsed.title),
        },
    });

    revalidateOffers();
    redirect("/admin/offres?status=family-updated");
}

export async function deleteOfferFamilyAction(formData: FormData) {
    await requireAdminSession();

    const familyId = String(formData.get("id") ?? "").trim();
    if (!familyId) redirect("/admin/offres?status=missing-family");

    const prisma = getPrismaClient();
    const family = await prisma.offerFamily.findUnique({
        where: { id: familyId },
        select: {
            _count: {
                select: {
                    offers: true,
                },
            },
        },
    });

    if (!family) redirect("/admin/offres?status=missing-family");

    if (family._count.offers > 0) {
        redirect("/admin/offres?status=family-delete-blocked");
    }

    await prisma.offerFamily.delete({
        where: { id: familyId },
    });

    revalidateOffers();
    redirect("/admin/offres?status=family-deleted");
}

export async function deleteOfferAction(formData: FormData) {
    await requireAdminSession();

    const offerId = String(formData.get("id") ?? "").trim();
    if (!offerId) redirect("/admin/offres?status=missing-offer");

    const prisma = getPrismaClient();
    const offer = await prisma.offer.findUnique({
        where: { id: offerId },
        select: {
            _count: {
                select: {
                    financialDocuments: true,
                    opportunities: true,
                    projects: true,
                },
            },
        },
    });

    if (!offer) {
        redirect("/admin/offres?status=missing-offer");
    }

    const relationCount =
        offer._count.financialDocuments +
        offer._count.opportunities +
        offer._count.projects;

    if (relationCount > 0) {
        redirect("/admin/offres?status=delete-blocked");
    }

    await prisma.offer.delete({
        where: { id: offerId },
    });

    revalidateOffers();
    redirect("/admin/offres?status=deleted");
}

function parseOfferPayload(formData: FormData) {
    return offerPayloadSchema.parse({
        family: optionalFormString(formData.get("family")),
        familyId: optionalFormString(formData.get("familyId")),
        id: optionalFormString(formData.get("id")),
        imageAlt: optionalFormString(formData.get("imageAlt")),
        imageSrc: optionalFormString(formData.get("imageSrc")),
        isActive: formData.get("isActive") === "on",
        name: formData.get("name"),
        publicHref: optionalFormString(formData.get("publicHref")),
        slug: optionalFormString(formData.get("slug")),
        sortOrder: parseInteger(formData.get("sortOrder")) ?? 0,
        startingPriceCents: parseMoneyCents(formData.get("startingPrice")),
        startingPriceLabel: optionalFormString(formData.get("startingPriceLabel")),
    });
}

function parseOfferFamilyPayload(formData: FormData) {
    return offerFamilyPayloadSchema.parse({
        badge: optionalFormString(formData.get("badge")),
        description: optionalFormString(formData.get("description")),
        eyebrow: optionalFormString(formData.get("eyebrow")),
        id: optionalFormString(formData.get("id")),
        imageAlt: optionalFormString(formData.get("imageAlt")),
        imageDesktop: optionalFormString(formData.get("imageDesktop")),
        imageSrc: optionalFormString(formData.get("imageSrc")),
        imageTablet: optionalFormString(formData.get("imageTablet")),
        isActive: formData.get("isActive") === "on",
        name: formData.get("name"),
        publicHref: optionalFormString(formData.get("publicHref")),
        slug: optionalFormString(formData.get("slug")),
        sortOrder: parseInteger(formData.get("sortOrder")) ?? 100,
        title: optionalFormString(formData.get("title")),
    });
}

async function resolveOfferFamily({
    fallbackFamily,
    familyId,
}: {
    fallbackFamily: string | undefined;
    familyId: string | undefined;
}) {
    const prisma = getPrismaClient();
    const normalizedFamilyId = familyId?.trim();

    if (normalizedFamilyId) {
        const family = await prisma.offerFamily.findUnique({
            where: { id: normalizedFamilyId },
            select: {
                id: true,
                slug: true,
            },
        });

        if (!family) redirect("/admin/offres?status=missing-family");

        return {
            family: family.slug,
            familyId: family.id,
        };
    }

    const family = fallbackFamily?.trim();
    if (!family) redirect("/admin/offres?status=missing-family");

    return {
        family,
        familyId: null,
    };
}

function optionalFormString(value: FormDataEntryValue | null) {
    if (typeof value !== "string") return undefined;

    return value;
}

function nullableString(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}

function normalizeSlug(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120);
}

function parseInteger(value: FormDataEntryValue | null) {
    const normalized = String(value ?? "").trim();
    if (!normalized) return undefined;

    const parsed = Number.parseInt(normalized, 10);

    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMoneyCents(value: FormDataEntryValue | null) {
    const normalized = String(value ?? "").trim().replace(",", ".");
    if (!normalized) return undefined;

    const amount = Number(normalized);
    if (!Number.isFinite(amount)) return undefined;

    return Math.round(amount * 100);
}

function revalidateOffers() {
    revalidatePath("/admin");
    revalidatePath("/admin/offres");
}
