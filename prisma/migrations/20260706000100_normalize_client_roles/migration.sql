-- AlterTable: V2 roles become the defaults (LEAD/CLIENT are legacy,
-- kept in the enum for old sessions but no longer issued)
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CLIENT_OWNER';
ALTER TABLE "Invitation" ALTER COLUMN "targetRole" SET DEFAULT 'CLIENT_OWNER';

-- Data: normalize existing legacy roles in place
UPDATE "User" SET "role" = 'CLIENT_OWNER' WHERE "role" IN ('CLIENT', 'LEAD');
UPDATE "Invitation" SET "targetRole" = 'CLIENT_OWNER' WHERE "targetRole" IN ('CLIENT', 'LEAD');
