CREATE TYPE "ConversationScope" AS ENUM (
    'PROJECT',
    'PROJECT_REQUEST',
    'OPPORTUNITY'
);

CREATE TYPE "ConversationVisibility" AS ENUM (
    'CLIENT_VISIBLE',
    'INTERNAL'
);

CREATE TYPE "MessageAuthorRole" AS ENUM (
    'ADMIN',
    'CLIENT',
    'SYSTEM'
);

CREATE TYPE "QuestionnaireStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'IN_PROGRESS',
    'COMPLETED',
    'ARCHIVED'
);

CREATE TYPE "QuestionType" AS ENUM (
    'TEXT',
    'LONG_TEXT',
    'URL',
    'EMAIL',
    'DATE',
    'FILE_LINK'
);

CREATE TYPE "QuestionnaireAnswerStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED'
);

CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "scope" "ConversationScope" NOT NULL DEFAULT 'PROJECT',
    "visibility" "ConversationVisibility" NOT NULL DEFAULT 'CLIENT_VISIBLE',
    "title" TEXT NOT NULL,
    "projectId" TEXT,
    "projectRequestId" TEXT,
    "opportunityId" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "authorUserId" TEXT,
    "authorName" TEXT,
    "authorRole" "MessageAuthorRole" NOT NULL DEFAULT 'CLIENT',
    "body" TEXT NOT NULL,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT true,
    "internalNote" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "QuestionnaireStatus" NOT NULL DEFAULT 'DRAFT',
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT,
    "projectRequestId" TEXT,
    "opportunityId" TEXT,
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionnaireQuestion" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "helpText" TEXT,
    "type" "QuestionType" NOT NULL DEFAULT 'LONG_TEXT',
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionnaireQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionnaireAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "authorUserId" TEXT,
    "value" TEXT NOT NULL,
    "status" "QuestionnaireAnswerStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionnaireAnswer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Conversation_projectId_visibility_updatedAt_idx" ON "Conversation"("projectId", "visibility", "updatedAt");
CREATE INDEX "Conversation_projectRequestId_visibility_updatedAt_idx" ON "Conversation"("projectRequestId", "visibility", "updatedAt");
CREATE INDEX "Conversation_opportunityId_visibility_updatedAt_idx" ON "Conversation"("opportunityId", "visibility", "updatedAt");
CREATE INDEX "Conversation_createdByUserId_idx" ON "Conversation"("createdByUserId");

CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");
CREATE INDEX "Message_authorUserId_createdAt_idx" ON "Message"("authorUserId", "createdAt");
CREATE INDEX "Message_isClientVisible_internalNote_idx" ON "Message"("isClientVisible", "internalNote");

CREATE INDEX "Questionnaire_projectId_status_updatedAt_idx" ON "Questionnaire"("projectId", "status", "updatedAt");
CREATE INDEX "Questionnaire_projectRequestId_status_updatedAt_idx" ON "Questionnaire"("projectRequestId", "status", "updatedAt");
CREATE INDEX "Questionnaire_opportunityId_status_updatedAt_idx" ON "Questionnaire"("opportunityId", "status", "updatedAt");
CREATE INDEX "Questionnaire_isClientVisible_status_idx" ON "Questionnaire"("isClientVisible", "status");

CREATE UNIQUE INDEX "QuestionnaireQuestion_questionnaireId_key_key" ON "QuestionnaireQuestion"("questionnaireId", "key");
CREATE INDEX "QuestionnaireQuestion_questionnaireId_sortOrder_idx" ON "QuestionnaireQuestion"("questionnaireId", "sortOrder");

CREATE INDEX "QuestionnaireAnswer_questionId_createdAt_idx" ON "QuestionnaireAnswer"("questionId", "createdAt");
CREATE INDEX "QuestionnaireAnswer_authorUserId_createdAt_idx" ON "QuestionnaireAnswer"("authorUserId", "createdAt");
CREATE INDEX "QuestionnaireAnswer_status_idx" ON "QuestionnaireAnswer"("status");

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_projectRequestId_fkey" FOREIGN KEY ("projectRequestId") REFERENCES "ProjectRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_projectRequestId_fkey" FOREIGN KEY ("projectRequestId") REFERENCES "ProjectRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "QuestionnaireQuestion" ADD CONSTRAINT "QuestionnaireQuestion_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "QuestionnaireAnswer" ADD CONSTRAINT "QuestionnaireAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionnaireQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionnaireAnswer" ADD CONSTRAINT "QuestionnaireAnswer_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
