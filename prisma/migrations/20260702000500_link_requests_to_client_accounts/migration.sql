-- AlterTable
ALTER TABLE "ProjectRequest" ADD COLUMN "clientAccountId" TEXT;
ALTER TABLE "ProjectRequest" ADD COLUMN "contactId" TEXT;

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN "clientAccountId" TEXT;
ALTER TABLE "Opportunity" ADD COLUMN "contactId" TEXT;

-- CreateIndex
CREATE INDEX "ProjectRequest_clientAccountId_idx" ON "ProjectRequest"("clientAccountId");

-- CreateIndex
CREATE INDEX "ProjectRequest_contactId_idx" ON "ProjectRequest"("contactId");

-- CreateIndex
CREATE INDEX "Opportunity_clientAccountId_idx" ON "Opportunity"("clientAccountId");

-- CreateIndex
CREATE INDEX "Opportunity_contactId_idx" ON "Opportunity"("contactId");

-- AddForeignKey
ALTER TABLE "ProjectRequest" ADD CONSTRAINT "ProjectRequest_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRequest" ADD CONSTRAINT "ProjectRequest_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
