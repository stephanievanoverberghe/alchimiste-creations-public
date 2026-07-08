-- CreateEnum
CREATE TYPE "PortfolioProjectKind" AS ENUM ('CLIENT', 'DEMO', 'REFONTE', 'CONCEPT');

-- CreateEnum
CREATE TYPE "PortfolioPublicationStatus" AS ENUM ('DRAFT', 'STANDBY', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "PortfolioProject" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "status" TEXT,
    "kind" "PortfolioProjectKind" NOT NULL DEFAULT 'DEMO',
    "typeLabel" TEXT,
    "publicationStatus" "PortfolioPublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "coverImageUrl" TEXT,
    "heroImageUrl" TEXT,
    "imageAlt" TEXT,
    "contextTitle" TEXT,
    "contextDescription" TEXT,
    "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "proofs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "websiteUrl" TEXT,
    "publicHref" TEXT,
    "relatedOfferId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");

-- CreateIndex
CREATE INDEX "PortfolioProject_publicationStatus_sortOrder_idx" ON "PortfolioProject"("publicationStatus", "sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioProject_kind_idx" ON "PortfolioProject"("kind");

-- CreateIndex
CREATE INDEX "PortfolioProject_relatedOfferId_idx" ON "PortfolioProject"("relatedOfferId");

-- CreateIndex
CREATE INDEX "PortfolioProject_isFeatured_sortOrder_idx" ON "PortfolioProject"("isFeatured", "sortOrder");

-- AddForeignKey
ALTER TABLE "PortfolioProject" ADD CONSTRAINT "PortfolioProject_relatedOfferId_fkey" FOREIGN KEY ("relatedOfferId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
