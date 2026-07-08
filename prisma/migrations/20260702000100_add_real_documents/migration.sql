-- CreateEnum
CREATE TYPE "RealDocumentType" AS ENUM ('PROPOSAL', 'CONTRACT', 'BRIEF', 'DELIVERABLE', 'ASSET', 'REPORT', 'HANDOVER', 'OTHER');

-- CreateEnum
CREATE TYPE "RealDocumentStatus" AS ENUM ('DRAFT', 'REFERENCED', 'SHARED', 'SENT', 'APPROVED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "RealDocument" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "RealDocumentType" NOT NULL,
    "status" "RealDocumentStatus" NOT NULL DEFAULT 'REFERENCED',
    "title" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "notes" TEXT,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "opportunityId" TEXT,
    "projectId" TEXT NOT NULL,
    "deliverableId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RealDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RealDocument_reference_key" ON "RealDocument"("reference");

-- CreateIndex
CREATE INDEX "RealDocument_type_status_idx" ON "RealDocument"("type", "status");

-- CreateIndex
CREATE INDEX "RealDocument_projectId_idx" ON "RealDocument"("projectId");

-- CreateIndex
CREATE INDEX "RealDocument_opportunityId_idx" ON "RealDocument"("opportunityId");

-- CreateIndex
CREATE INDEX "RealDocument_deliverableId_idx" ON "RealDocument"("deliverableId");

-- AddForeignKey
ALTER TABLE "RealDocument" ADD CONSTRAINT "RealDocument_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealDocument" ADD CONSTRAINT "RealDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealDocument" ADD CONSTRAINT "RealDocument_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "Deliverable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
