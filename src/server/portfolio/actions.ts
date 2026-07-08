"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";

const portfolioProjectPayloadSchema = z.object({
    contextDescription: z.string().trim().max(1200).optional(),
    contextTitle: z.string().trim().max(180).optional(),
    coverImageUrl: z.string().trim().max(300).optional(),
    heroImageUrl: z.string().trim().max(300).optional(),
    highlights: z.array(z.string().trim().min(1).max(220)).max(12),
    id: z.string().trim().optional(),
    imageAlt: z.string().trim().max(240).optional(),
    isFeatured: z.boolean(),
    kind: z.enum(["CLIENT", "DEMO", "REFONTE", "CONCEPT"]),
    objectives: z.array(z.string().trim().min(1).max(220)).max(12),
    proofs: z.array(z.string().trim().min(1).max(220)).max(12),
    publicHref: z.string().trim().max(240).optional(),
    publicationStatus: z.enum(["DRAFT", "STANDBY", "PUBLISHED", "ARCHIVED"]),
    relatedOfferId: z.string().trim().optional(),
    shortDescription: z.string().trim().min(1).max(360),
    slug: z.string().trim().max(120).optional(),
    sortOrder: z.number().int().min(0).max(9999),
    status: z.string().trim().max(220).optional(),
    tags: z.array(z.string().trim().min(1).max(80)).max(16),
    title: z.string().trim().min(1).max(160),
    typeLabel: z.string().trim().max(120).optional(),
    websiteUrl: z.string().trim().max(240).optional(),
});

export async function createPortfolioProjectAction(formData: FormData) {
    await requireAdminSession();

    const parsed = parsePortfolioProjectPayload(formData);
    const slug = normalizeSlug(parsed.slug || parsed.title);
    if (!slug) redirect("/admin/realisations?status=invalid-slug");

    const prisma = getPrismaClient();
    const existingProject = await prisma.portfolioProject.findUnique({
        where: { slug },
        select: { id: true },
    });

    if (existingProject) {
        redirect("/admin/realisations?status=duplicate-slug");
    }

    await prisma.portfolioProject.create({
        data: {
            ...getPortfolioProjectData(parsed),
            slug,
        },
    });

    revalidatePortfolio();
    redirect("/admin/realisations?status=created");
}

export async function updatePortfolioProjectAction(formData: FormData) {
    await requireAdminSession();

    const parsed = parsePortfolioProjectPayload(formData);
    const projectId = parsed.id?.trim();
    if (!projectId) redirect("/admin/realisations?status=missing-project");

    const slug = normalizeSlug(parsed.slug || parsed.title);
    if (!slug) redirect("/admin/realisations?status=invalid-slug");

    const prisma = getPrismaClient();
    const duplicatedProject = await prisma.portfolioProject.findFirst({
        where: {
            slug,
            NOT: { id: projectId },
        },
        select: { id: true },
    });

    if (duplicatedProject) {
        redirect("/admin/realisations?status=duplicate-slug");
    }

    await prisma.portfolioProject.update({
        where: { id: projectId },
        data: {
            ...getPortfolioProjectData(parsed),
            slug,
        },
    });

    revalidatePortfolio();
    redirect("/admin/realisations?status=updated");
}

export async function archivePortfolioProjectAction(formData: FormData) {
    await requireAdminSession();

    const projectId = String(formData.get("id") ?? "").trim();
    if (!projectId) redirect("/admin/realisations?status=missing-project");

    const prisma = getPrismaClient();
    await prisma.portfolioProject.update({
        where: { id: projectId },
        data: { publicationStatus: "ARCHIVED" },
        select: { id: true },
    });

    revalidatePortfolio();
    redirect("/admin/realisations?status=archived");
}

export async function restorePortfolioProjectAction(formData: FormData) {
    await requireAdminSession();

    const projectId = String(formData.get("id") ?? "").trim();
    if (!projectId) redirect("/admin/realisations?status=missing-project");

    const prisma = getPrismaClient();
    await prisma.portfolioProject.update({
        where: { id: projectId },
        data: { publicationStatus: "STANDBY" },
        select: { id: true },
    });

    revalidatePortfolio();
    redirect("/admin/realisations?status=restored");
}

function parsePortfolioProjectPayload(formData: FormData) {
    return portfolioProjectPayloadSchema.parse({
        contextDescription: optionalFormString(formData.get("contextDescription")),
        contextTitle: optionalFormString(formData.get("contextTitle")),
        coverImageUrl: optionalFormString(formData.get("coverImageUrl")),
        heroImageUrl: optionalFormString(formData.get("heroImageUrl")),
        highlights: parseLines(formData.get("highlights")),
        id: optionalFormString(formData.get("id")),
        imageAlt: optionalFormString(formData.get("imageAlt")),
        isFeatured: formData.get("isFeatured") === "on",
        kind: formData.get("kind"),
        objectives: parseLines(formData.get("objectives")),
        proofs: parseLines(formData.get("proofs")),
        publicHref: optionalFormString(formData.get("publicHref")),
        publicationStatus: formData.get("publicationStatus"),
        relatedOfferId: optionalFormString(formData.get("relatedOfferId")),
        shortDescription: formData.get("shortDescription"),
        slug: optionalFormString(formData.get("slug")),
        sortOrder: parseInteger(formData.get("sortOrder")) ?? 100,
        status: optionalFormString(formData.get("status")),
        tags: parseTags(formData.get("tags")),
        title: formData.get("title"),
        typeLabel: optionalFormString(formData.get("typeLabel")),
        websiteUrl: optionalFormString(formData.get("websiteUrl")),
    });
}

function getPortfolioProjectData(
    parsed: z.infer<typeof portfolioProjectPayloadSchema>,
) {
    return {
        contextDescription: nullableString(parsed.contextDescription),
        contextTitle: nullableString(parsed.contextTitle),
        coverImageUrl: nullableString(parsed.coverImageUrl),
        heroImageUrl: nullableString(parsed.heroImageUrl),
        highlights: parsed.highlights,
        imageAlt: nullableString(parsed.imageAlt),
        isFeatured: parsed.isFeatured,
        kind: parsed.kind,
        objectives: parsed.objectives,
        proofs: parsed.proofs,
        publicHref: nullableString(parsed.publicHref),
        publicationStatus: parsed.publicationStatus,
        relatedOfferId: nullableString(parsed.relatedOfferId),
        shortDescription: parsed.shortDescription,
        sortOrder: parsed.sortOrder,
        status: nullableString(parsed.status),
        tags: parsed.tags,
        title: parsed.title,
        typeLabel: nullableString(parsed.typeLabel),
        websiteUrl: nullableString(parsed.websiteUrl),
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

function parseInteger(value: FormDataEntryValue | null) {
    const normalized = String(value ?? "").trim();
    if (!normalized) return undefined;

    const parsed = Number.parseInt(normalized, 10);

    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseLines(value: FormDataEntryValue | null) {
    if (typeof value !== "string") return [];

    return value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function parseTags(value: FormDataEntryValue | null) {
    if (typeof value !== "string") return [];

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
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

function revalidatePortfolio() {
    revalidatePath("/admin");
    revalidatePath("/admin/realisations");
}
