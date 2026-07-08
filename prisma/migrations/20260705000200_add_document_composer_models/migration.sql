-- CreateEnum
CREATE TYPE "DocumentHandling" AS ENUM ('IN_APP', 'COMPOSED', 'FILE_LINK');

-- AlterTable: classify playbook document templates by handling family
ALTER TABLE "PlaybookDocumentTemplate" ADD COLUMN "handling" "DocumentHandling" NOT NULL DEFAULT 'FILE_LINK';

-- AlterTable: composed documents on RealDocument (documentUrl becomes optional)
ALTER TABLE "RealDocument" ALTER COLUMN "documentUrl" DROP NOT NULL;
ALTER TABLE "RealDocument" ADD COLUMN "contentJson" JSONB;
ALTER TABLE "RealDocument" ADD COLUMN "documentModelKey" TEXT;
ALTER TABLE "RealDocument" ADD COLUMN "currentVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DocumentModel" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "realDocumentType" "RealDocumentType" NOT NULL DEFAULT 'OTHER',
    "sections" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealDocumentVersion" (
    "id" TEXT NOT NULL,
    "realDocumentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentSnapshot" JSONB NOT NULL,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sharedByUserId" TEXT,

    CONSTRAINT "RealDocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentModel_key_key" ON "DocumentModel"("key");

-- CreateIndex
CREATE INDEX "DocumentModel_isActive_sortOrder_idx" ON "DocumentModel"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "PlaybookDocumentTemplate_handling_idx" ON "PlaybookDocumentTemplate"("handling");

-- CreateIndex
CREATE INDEX "RealDocument_documentModelKey_idx" ON "RealDocument"("documentModelKey");

-- CreateIndex
CREATE UNIQUE INDEX "RealDocumentVersion_realDocumentId_version_key" ON "RealDocumentVersion"("realDocumentId", "version");

-- CreateIndex
CREATE INDEX "RealDocumentVersion_realDocumentId_sharedAt_idx" ON "RealDocumentVersion"("realDocumentId", "sharedAt");

-- CreateIndex
CREATE INDEX "RealDocumentVersion_sharedByUserId_idx" ON "RealDocumentVersion"("sharedByUserId");

-- AddForeignKey
ALTER TABLE "RealDocumentVersion" ADD CONSTRAINT "RealDocumentVersion_realDocumentId_fkey" FOREIGN KEY ("realDocumentId") REFERENCES "RealDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealDocumentVersion" ADD CONSTRAINT "RealDocumentVersion_sharedByUserId_fkey" FOREIGN KEY ("sharedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
