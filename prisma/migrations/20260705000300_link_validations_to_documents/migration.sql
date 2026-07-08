-- AlterTable
ALTER TABLE "Validation" ADD COLUMN "realDocumentId" TEXT;

-- CreateIndex
CREATE INDEX "Validation_realDocumentId_idx" ON "Validation"("realDocumentId");

-- AddForeignKey
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_realDocumentId_fkey" FOREIGN KEY ("realDocumentId") REFERENCES "RealDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
