-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "ProjectRequestSource" AS ENUM ('PROJECT_FORM', 'MANUAL');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('NOT_SENT', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('NOUVEAU', 'A_QUALIFIER', 'APPEL_A_PLANIFIER', 'APPEL_PREVU', 'CADRAGE_A_PRODUIRE', 'PROPOSITION_A_ENVOYER', 'DEVIS_ENVOYE', 'NEGOCIATION_AJUSTEMENT', 'RELANCE_A_FAIRE', 'ACCEPTE', 'REFUSE', 'PERDU_SANS_SUITE', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "OpportunityPhase" AS ENUM ('LEAD', 'OPPORTUNITE', 'DEVIS', 'CLIENT', 'POST_PROJET', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "OpportunityPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "OpportunityFit" AS ENUM ('UNKNOWN', 'LOW', 'MEDIUM', 'HIGH', 'EXCELLENT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PREPARATION', 'EN_COURS', 'EN_VALIDATION', 'LIVRE', 'CLOTURE', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('CADRAGE', 'UX', 'UI', 'CONTENUS', 'DEVELOPPEMENT', 'QA', 'LIVRAISON');

-- CreateEnum
CREATE TYPE "FinancialDocumentType" AS ENUM ('QUOTE', 'DEPOSIT_INVOICE', 'BALANCE_INVOICE', 'MAINTENANCE_INVOICE', 'CREDIT_NOTE');

-- CreateEnum
CREATE TYPE "FinancialDocumentStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REFUSED', 'TO_INVOICE', 'ISSUED', 'PAID', 'LATE', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "startingPriceCents" INTEGER,
    "startingPriceLabel" TEXT,
    "publicHref" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "projectOsId" TEXT,
    "name" TEXT NOT NULL,
    "templateId" TEXT,
    "publicLabel" TEXT,
    "recommendedArchitecture" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRequest" (
    "id" TEXT NOT NULL,
    "source" "ProjectRequestSource" NOT NULL DEFAULT 'PROJECT_FORM',
    "requestId" TEXT NOT NULL,
    "projectTypeRaw" TEXT NOT NULL,
    "projectTypeLabel" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "projectName" TEXT,
    "website" TEXT,
    "description" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "maturity" TEXT NOT NULL,
    "budget" TEXT,
    "deadline" TEXT,
    "constraints" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT true,
    "payloadSnapshot" JSONB NOT NULL,
    "emailProviderId" TEXT,
    "emailStatus" "EmailStatus" NOT NULL DEFAULT 'NOT_SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'NOUVEAU',
    "phase" "OpportunityPhase" NOT NULL DEFAULT 'LEAD',
    "prospectName" TEXT NOT NULL,
    "prospectEmail" TEXT NOT NULL,
    "phone" TEXT,
    "organizationName" TEXT,
    "source" TEXT,
    "conversionChannel" TEXT,
    "rawNeed" TEXT,
    "objective" TEXT,
    "notes" TEXT,
    "maturity" TEXT,
    "estimatedBudgetRange" TEXT,
    "estimatedValueCents" INTEGER,
    "probability" INTEGER,
    "urgency" TEXT,
    "priority" "OpportunityPriority" NOT NULL DEFAULT 'NORMAL',
    "fit" "OpportunityFit" NOT NULL DEFAULT 'UNKNOWN',
    "qualificationScore" INTEGER,
    "decisionExpected" TIMESTAMP(3),
    "mainObjection" TEXT,
    "nextGate" TEXT,
    "nextAction" TEXT,
    "nextFollowUpAt" TIMESTAMP(3),
    "lastContactAt" TIMESTAMP(3),
    "commercialBlocker" TEXT,
    "lostReason" TEXT,
    "readyToConvert" BOOLEAN NOT NULL DEFAULT false,
    "commercialScopeUrl" TEXT,
    "proposalUrl" TEXT,
    "proposalSentAt" TIMESTAMP(3),
    "quoteUrl" TEXT,
    "quoteSentAt" TIMESTAMP(3),
    "quoteAcceptedAt" TIMESTAMP(3),
    "depositRequestedAt" TIMESTAMP(3),
    "depositReceivedAt" TIMESTAMP(3),
    "depositAmountCents" INTEGER,
    "commercialDriveUrl" TEXT,
    "projectRequestId" TEXT,
    "offerId" TEXT,
    "projectTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PREPARATION',
    "stage" "ProjectStage" NOT NULL DEFAULT 'CADRAGE',
    "opportunityId" TEXT NOT NULL,
    "projectTypeId" TEXT,
    "offerId" TEXT,
    "driveFolderUrl" TEXT,
    "githubRepoUrl" TEXT,
    "targetDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "nextAction" TEXT,
    "notes" TEXT,
    "hasActiveBlocker" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialDocument" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "FinancialDocumentType" NOT NULL,
    "status" "FinancialDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "clientName" TEXT NOT NULL,
    "amountCents" INTEGER,
    "depositPercent" INTEGER,
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "notes" TEXT,
    "offerId" TEXT,
    "opportunityId" TEXT,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_slug_key" ON "Offer"("slug");

-- CreateIndex
CREATE INDEX "Offer_family_idx" ON "Offer"("family");

-- CreateIndex
CREATE INDEX "Offer_isActive_sortOrder_idx" ON "Offer"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectType_slug_key" ON "ProjectType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectType_projectOsId_key" ON "ProjectType"("projectOsId");

-- CreateIndex
CREATE INDEX "ProjectType_isActive_sortOrder_idx" ON "ProjectType"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRequest_requestId_key" ON "ProjectRequest"("requestId");

-- CreateIndex
CREATE INDEX "ProjectRequest_email_idx" ON "ProjectRequest"("email");

-- CreateIndex
CREATE INDEX "ProjectRequest_createdAt_idx" ON "ProjectRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_projectRequestId_key" ON "Opportunity"("projectRequestId");

-- CreateIndex
CREATE INDEX "Opportunity_status_phase_idx" ON "Opportunity"("status", "phase");

-- CreateIndex
CREATE INDEX "Opportunity_nextFollowUpAt_idx" ON "Opportunity"("nextFollowUpAt");

-- CreateIndex
CREATE INDEX "Opportunity_prospectEmail_idx" ON "Opportunity"("prospectEmail");

-- CreateIndex
CREATE INDEX "Opportunity_offerId_idx" ON "Opportunity"("offerId");

-- CreateIndex
CREATE INDEX "Opportunity_projectTypeId_idx" ON "Opportunity"("projectTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_opportunityId_key" ON "Project"("opportunityId");

-- CreateIndex
CREATE INDEX "Project_status_stage_idx" ON "Project"("status", "stage");

-- CreateIndex
CREATE INDEX "Project_offerId_idx" ON "Project"("offerId");

-- CreateIndex
CREATE INDEX "Project_projectTypeId_idx" ON "Project"("projectTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialDocument_reference_key" ON "FinancialDocument"("reference");

-- CreateIndex
CREATE INDEX "FinancialDocument_type_status_idx" ON "FinancialDocument"("type", "status");

-- CreateIndex
CREATE INDEX "FinancialDocument_dueAt_idx" ON "FinancialDocument"("dueAt");

-- CreateIndex
CREATE INDEX "FinancialDocument_offerId_idx" ON "FinancialDocument"("offerId");

-- CreateIndex
CREATE INDEX "FinancialDocument_opportunityId_idx" ON "FinancialDocument"("opportunityId");

-- CreateIndex
CREATE INDEX "FinancialDocument_projectId_idx" ON "FinancialDocument"("projectId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_projectRequestId_fkey" FOREIGN KEY ("projectRequestId") REFERENCES "ProjectRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "ProjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "ProjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialDocument" ADD CONSTRAINT "FinancialDocument_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialDocument" ADD CONSTRAINT "FinancialDocument_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialDocument" ADD CONSTRAINT "FinancialDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
