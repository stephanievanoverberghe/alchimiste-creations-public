-- CreateTable
CREATE TABLE "PlaybookTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceProjectOsId" TEXT,
    "sourceTemplateId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "priority" TEXT NOT NULL DEFAULT 'PRIORITY',
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookPhaseTemplate" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sourceLotKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookPhaseTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookGateTemplate" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "objectType" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "unblocks" JSONB,
    "proofRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookGateTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookActionTemplate" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sourcePhaseKey" TEXT,
    "ownerRole" TEXT,
    "isBlocking" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookActionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookDeliverableTemplate" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "sourcePhaseKey" TEXT,
    "documentTemplateKey" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookDeliverableTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookDocumentTemplate" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "usage" TEXT,
    "recommendedFormat" TEXT,
    "recommendedDrivePath" TEXT,
    "visibility" TEXT,
    "status" TEXT,
    "sourcePhaseKey" TEXT,
    "producesDeliverableKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookDocumentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookTemplate_key_key" ON "PlaybookTemplate"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookTemplate_sourceProjectOsId_key" ON "PlaybookTemplate"("sourceProjectOsId");

-- CreateIndex
CREATE INDEX "PlaybookTemplate_status_priority_sortOrder_idx" ON "PlaybookTemplate"("status", "priority", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookPhaseTemplate_playbookId_key_key" ON "PlaybookPhaseTemplate"("playbookId", "key");

-- CreateIndex
CREATE INDEX "PlaybookPhaseTemplate_playbookId_sortOrder_idx" ON "PlaybookPhaseTemplate"("playbookId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlaybookPhaseTemplate_sourceLotKey_idx" ON "PlaybookPhaseTemplate"("sourceLotKey");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookGateTemplate_playbookId_key_key" ON "PlaybookGateTemplate"("playbookId", "key");

-- CreateIndex
CREATE INDEX "PlaybookGateTemplate_playbookId_sortOrder_idx" ON "PlaybookGateTemplate"("playbookId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlaybookGateTemplate_type_idx" ON "PlaybookGateTemplate"("type");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookActionTemplate_playbookId_key_key" ON "PlaybookActionTemplate"("playbookId", "key");

-- CreateIndex
CREATE INDEX "PlaybookActionTemplate_playbookId_sortOrder_idx" ON "PlaybookActionTemplate"("playbookId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlaybookActionTemplate_sourcePhaseKey_idx" ON "PlaybookActionTemplate"("sourcePhaseKey");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookDeliverableTemplate_playbookId_key_key" ON "PlaybookDeliverableTemplate"("playbookId", "key");

-- CreateIndex
CREATE INDEX "PlaybookDeliverableTemplate_playbookId_sortOrder_idx" ON "PlaybookDeliverableTemplate"("playbookId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlaybookDeliverableTemplate_sourcePhaseKey_idx" ON "PlaybookDeliverableTemplate"("sourcePhaseKey");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookDocumentTemplate_playbookId_key_key" ON "PlaybookDocumentTemplate"("playbookId", "key");

-- CreateIndex
CREATE INDEX "PlaybookDocumentTemplate_playbookId_sortOrder_idx" ON "PlaybookDocumentTemplate"("playbookId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlaybookDocumentTemplate_sourcePhaseKey_idx" ON "PlaybookDocumentTemplate"("sourcePhaseKey");

-- CreateIndex
CREATE INDEX "PlaybookDocumentTemplate_visibility_idx" ON "PlaybookDocumentTemplate"("visibility");

-- AddForeignKey
ALTER TABLE "PlaybookPhaseTemplate" ADD CONSTRAINT "PlaybookPhaseTemplate_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "PlaybookTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookGateTemplate" ADD CONSTRAINT "PlaybookGateTemplate_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "PlaybookTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookActionTemplate" ADD CONSTRAINT "PlaybookActionTemplate_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "PlaybookTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookDeliverableTemplate" ADD CONSTRAINT "PlaybookDeliverableTemplate_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "PlaybookTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookDocumentTemplate" ADD CONSTRAINT "PlaybookDocumentTemplate_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "PlaybookTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
