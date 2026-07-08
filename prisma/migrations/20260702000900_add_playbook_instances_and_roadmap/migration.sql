-- CreateTable
CREATE TABLE "PlaybookInstance" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "playbookTemplateId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedByUserId" TEXT,
    "scopeSnapshot" JSONB,
    "generationSummary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectGate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phaseId" TEXT,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "objectType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "proofRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceTemplateKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectGate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phaseId" TEXT,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "ownerRole" TEXT,
    "isBlocking" BOOLEAN NOT NULL DEFAULT false,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "dueAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceTemplateKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookInstance_projectId_key" ON "PlaybookInstance"("projectId");

-- CreateIndex
CREATE INDEX "PlaybookInstance_playbookTemplateId_idx" ON "PlaybookInstance"("playbookTemplateId");

-- CreateIndex
CREATE INDEX "PlaybookInstance_status_appliedAt_idx" ON "PlaybookInstance"("status", "appliedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectGate_projectId_key_key" ON "ProjectGate"("projectId", "key");

-- CreateIndex
CREATE INDEX "ProjectGate_projectId_sortOrder_idx" ON "ProjectGate"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectGate_phaseId_idx" ON "ProjectGate"("phaseId");

-- CreateIndex
CREATE INDEX "ProjectGate_type_status_idx" ON "ProjectGate"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAction_projectId_key_key" ON "ProjectAction"("projectId", "key");

-- CreateIndex
CREATE INDEX "ProjectAction_projectId_sortOrder_idx" ON "ProjectAction"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectAction_phaseId_idx" ON "ProjectAction"("phaseId");

-- CreateIndex
CREATE INDEX "ProjectAction_ownerRole_status_idx" ON "ProjectAction"("ownerRole", "status");

-- AddForeignKey
ALTER TABLE "PlaybookInstance" ADD CONSTRAINT "PlaybookInstance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookInstance" ADD CONSTRAINT "PlaybookInstance_playbookTemplateId_fkey" FOREIGN KEY ("playbookTemplateId") REFERENCES "PlaybookTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectGate" ADD CONSTRAINT "ProjectGate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectGate" ADD CONSTRAINT "ProjectGate_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAction" ADD CONSTRAINT "ProjectAction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAction" ADD CONSTRAINT "ProjectAction_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
