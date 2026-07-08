CREATE TYPE "TimelineEventKind" AS ENUM (
    'PROJECT',
    'MESSAGE',
    'QUESTIONNAIRE',
    'DOCUMENT',
    'VALIDATION',
    'DECISION',
    'STATUS_CHANGE',
    'CLIENT_ACTION',
    'INTERNAL_NOTE'
);

CREATE TYPE "TimelineEventVisibility" AS ENUM (
    'ADMIN_ONLY',
    'CLIENT_VISIBLE'
);

CREATE TYPE "NotificationPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);

CREATE TYPE "NotificationStatus" AS ENUM (
    'UNREAD',
    'READ',
    'ARCHIVED'
);

CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "kind" "TimelineEventKind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "TimelineEventVisibility" NOT NULL DEFAULT 'ADMIN_ONLY',
    "projectId" TEXT,
    "projectRequestId" TEXT,
    "opportunityId" TEXT,
    "actorUserId" TEXT,
    "metadata" JSONB,
    "happenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientUserId" TEXT NOT NULL,
    "projectId" TEXT,
    "opportunityId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "actionHref" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TimelineEvent_projectId_visibility_happenedAt_idx" ON "TimelineEvent"("projectId", "visibility", "happenedAt");
CREATE INDEX "TimelineEvent_projectRequestId_visibility_happenedAt_idx" ON "TimelineEvent"("projectRequestId", "visibility", "happenedAt");
CREATE INDEX "TimelineEvent_opportunityId_visibility_happenedAt_idx" ON "TimelineEvent"("opportunityId", "visibility", "happenedAt");
CREATE INDEX "TimelineEvent_actorUserId_happenedAt_idx" ON "TimelineEvent"("actorUserId", "happenedAt");
CREATE INDEX "TimelineEvent_kind_happenedAt_idx" ON "TimelineEvent"("kind", "happenedAt");

CREATE INDEX "Notification_recipientUserId_status_createdAt_idx" ON "Notification"("recipientUserId", "status", "createdAt");
CREATE INDEX "Notification_projectId_createdAt_idx" ON "Notification"("projectId", "createdAt");
CREATE INDEX "Notification_opportunityId_createdAt_idx" ON "Notification"("opportunityId", "createdAt");
CREATE INDEX "Notification_priority_status_idx" ON "Notification"("priority", "status");

ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_projectRequestId_fkey" FOREIGN KEY ("projectRequestId") REFERENCES "ProjectRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
