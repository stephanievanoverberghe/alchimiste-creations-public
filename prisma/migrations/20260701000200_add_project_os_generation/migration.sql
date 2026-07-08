-- CreateTable
CREATE TABLE "ProjectLot" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPhase" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "lotId" TEXT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phaseId" TEXT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "documentUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phaseId" TEXT,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "ownerRole" TEXT,
    "dueAt" TIMESTAMP(3),
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Validation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "deliverableId" TEXT,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INTERNAL',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requestedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "responseComment" TEXT,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Validation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectOsGeneration" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "templateId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "summary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectOsGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLot_projectId_key_key" ON "ProjectLot"("projectId", "key");

-- CreateIndex
CREATE INDEX "ProjectLot_projectId_sortOrder_idx" ON "ProjectLot"("projectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPhase_projectId_key_key" ON "ProjectPhase"("projectId", "key");

-- CreateIndex
CREATE INDEX "ProjectPhase_projectId_sortOrder_idx" ON "ProjectPhase"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectPhase_lotId_idx" ON "ProjectPhase"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "Deliverable_projectId_key_key" ON "Deliverable"("projectId", "key");

-- CreateIndex
CREATE INDEX "Deliverable_projectId_sortOrder_idx" ON "Deliverable"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "Deliverable_phaseId_idx" ON "Deliverable"("phaseId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTask_projectId_key_key" ON "ProjectTask"("projectId", "key");

-- CreateIndex
CREATE INDEX "ProjectTask_projectId_sortOrder_idx" ON "ProjectTask"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectTask_phaseId_idx" ON "ProjectTask"("phaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Validation_projectId_key_key" ON "Validation"("projectId", "key");

-- CreateIndex
CREATE INDEX "Validation_projectId_sortOrder_idx" ON "Validation"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "Validation_deliverableId_idx" ON "Validation"("deliverableId");

-- CreateIndex
CREATE INDEX "Validation_type_status_idx" ON "Validation"("type", "status");

-- CreateIndex
CREATE INDEX "ProjectOsGeneration_projectId_createdAt_idx" ON "ProjectOsGeneration"("projectId", "createdAt");

-- AddForeignKey
ALTER TABLE "ProjectLot" ADD CONSTRAINT "ProjectLot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPhase" ADD CONSTRAINT "ProjectPhase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPhase" ADD CONSTRAINT "ProjectPhase_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "ProjectLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "Deliverable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectOsGeneration" ADD CONSTRAINT "ProjectOsGeneration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
