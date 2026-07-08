CREATE TABLE "OfferFamily" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferFamily_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OfferFamily_slug_key" ON "OfferFamily"("slug");
CREATE INDEX "OfferFamily_isActive_sortOrder_idx" ON "OfferFamily"("isActive", "sortOrder");

ALTER TABLE "Offer" ADD COLUMN "familyId" TEXT;

INSERT INTO "OfferFamily" (
    "id",
    "slug",
    "name",
    "sortOrder",
    "createdAt",
    "updatedAt"
)
SELECT
    CONCAT('family_', MD5("family")),
    "family",
    INITCAP(REPLACE("family", '-', ' ')),
    ROW_NUMBER() OVER (ORDER BY "family") * 10,
    NOW(),
    NOW()
FROM (
    SELECT DISTINCT "family"
    FROM "Offer"
    WHERE "family" IS NOT NULL AND TRIM("family") <> ''
) AS families
ON CONFLICT ("slug") DO NOTHING;

UPDATE "Offer"
SET "familyId" = "OfferFamily"."id"
FROM "OfferFamily"
WHERE "Offer"."family" = "OfferFamily"."slug";

CREATE INDEX "Offer_familyId_idx" ON "Offer"("familyId");

ALTER TABLE "Offer" ADD CONSTRAINT "Offer_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "OfferFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;
