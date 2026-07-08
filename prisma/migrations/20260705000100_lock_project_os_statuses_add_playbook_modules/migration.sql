-- CreateEnum
CREATE TYPE "ProjectItemStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ProjectGateStatus" AS ENUM ('PENDING', 'VALIDATED', 'REFUSED', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "ProjectValidationStatus" AS ENUM ('PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'NOT_APPLICABLE');

-- AlterTable: convert free-text statuses to enums, preserving existing rows
ALTER TABLE "ProjectLot" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProjectLot" ALTER COLUMN "status" TYPE "ProjectItemStatus" USING "status"::"ProjectItemStatus";
ALTER TABLE "ProjectLot" ALTER COLUMN "status" SET DEFAULT 'TODO';

ALTER TABLE "ProjectPhase" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProjectPhase" ALTER COLUMN "status" TYPE "ProjectItemStatus" USING "status"::"ProjectItemStatus";
ALTER TABLE "ProjectPhase" ALTER COLUMN "status" SET DEFAULT 'TODO';

ALTER TABLE "Deliverable" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Deliverable" ALTER COLUMN "status" TYPE "ProjectItemStatus" USING "status"::"ProjectItemStatus";
ALTER TABLE "Deliverable" ALTER COLUMN "status" SET DEFAULT 'TODO';

ALTER TABLE "ProjectTask" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProjectTask" ALTER COLUMN "status" TYPE "ProjectItemStatus" USING "status"::"ProjectItemStatus";
ALTER TABLE "ProjectTask" ALTER COLUMN "status" SET DEFAULT 'TODO';

ALTER TABLE "ProjectAction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProjectAction" ALTER COLUMN "status" TYPE "ProjectItemStatus" USING "status"::"ProjectItemStatus";
ALTER TABLE "ProjectAction" ALTER COLUMN "status" SET DEFAULT 'TODO';

ALTER TABLE "ProjectGate" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProjectGate" ALTER COLUMN "status" TYPE "ProjectGateStatus" USING "status"::"ProjectGateStatus";
ALTER TABLE "ProjectGate" ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "Validation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Validation" ALTER COLUMN "status" TYPE "ProjectValidationStatus" USING "status"::"ProjectValidationStatus";
ALTER TABLE "Validation" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable: optional module key on playbook sub-templates
ALTER TABLE "PlaybookPhaseTemplate" ADD COLUMN "moduleKey" TEXT;
ALTER TABLE "PlaybookGateTemplate" ADD COLUMN "moduleKey" TEXT;
ALTER TABLE "PlaybookActionTemplate" ADD COLUMN "moduleKey" TEXT;
ALTER TABLE "PlaybookDeliverableTemplate" ADD COLUMN "moduleKey" TEXT;
ALTER TABLE "PlaybookDocumentTemplate" ADD COLUMN "moduleKey" TEXT;

-- CreateTable
CREATE TABLE "PlaybookModuleTemplate" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookModuleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookModuleTemplate_playbookId_key_key" ON "PlaybookModuleTemplate"("playbookId", "key");

-- CreateIndex
CREATE INDEX "PlaybookModuleTemplate_playbookId_sortOrder_idx" ON "PlaybookModuleTemplate"("playbookId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlaybookPhaseTemplate_moduleKey_idx" ON "PlaybookPhaseTemplate"("moduleKey");

-- CreateIndex
CREATE INDEX "PlaybookGateTemplate_moduleKey_idx" ON "PlaybookGateTemplate"("moduleKey");

-- CreateIndex
CREATE INDEX "PlaybookActionTemplate_moduleKey_idx" ON "PlaybookActionTemplate"("moduleKey");

-- CreateIndex
CREATE INDEX "PlaybookDeliverableTemplate_moduleKey_idx" ON "PlaybookDeliverableTemplate"("moduleKey");

-- CreateIndex
CREATE INDEX "PlaybookDocumentTemplate_moduleKey_idx" ON "PlaybookDocumentTemplate"("moduleKey");

-- AddForeignKey
ALTER TABLE "PlaybookModuleTemplate" ADD CONSTRAINT "PlaybookModuleTemplate_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "PlaybookTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
