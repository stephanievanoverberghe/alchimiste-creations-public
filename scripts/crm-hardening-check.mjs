import { readFile } from "node:fs/promises";

const checks = [
    {
        file: "src/app/(admin)/layout.tsx",
        includes: ["requireAdminSession"],
        name: "admin layout requires admin session",
    },
    {
        file: "src/app/(admin)/admin/demandes/page.tsx",
        includes: ["requireAdminSession"],
        name: "admin demandes requires admin session",
    },
    {
        file: "src/app/(admin)/admin/demandes/[opportunityId]/page.tsx",
        includes: ["requireAdminSession"],
        name: "demande detail requires admin session",
    },
    {
        file: "src/app/(admin)/admin/documents/page.tsx",
        includes: ["requireAdminSession"],
        name: "admin documents requires admin session",
    },
    {
        file: "src/app/(admin)/admin/finance/page.tsx",
        includes: ["requireAdminSession"],
        name: "admin finance requires admin session",
    },
    {
        file: "src/app/(client)/espace-client/page.tsx",
        includes: ["requireClientPortalSession", "getClientPortalHome"],
        name: "client portal home requires client session",
    },
    {
        file: "src/app/(client)/espace-client/projets/[projectId]/page.tsx",
        includes: ["requireClientPortalSession", "getClientPortalProject"],
        name: "client project route requires client session",
    },
    {
        file: "src/server/client-portal/portal.ts",
        includes: [
            "ClientPortalAccess",
            "status\" = 'ACTIVE'",
            "notFound()",
            "isClientVisible: true",
            'type: "CLIENT"',
        ],
        name: "client portal filters by access and visible client data",
    },
    {
        file: "src/server/client-portal/actions.ts",
        includes: [
            "requireClientPortalSession",
            "canReadProject",
            "updateMany",
            "isClientVisible: true",
            'type: "CLIENT"',
            "result.count === 0",
        ],
        name: "client validation response is permission checked",
    },
    {
        file: "src/server/client-portal/admin-actions.ts",
        includes: [
            "requireAdminSession",
            "findUnique",
            "user.create",
            "ClientPortalAccess",
            "ON CONFLICT",
        ],
        name: "admin grants client access without demoting existing users",
    },
    {
        file: "src/server/crm/opportunity-actions.ts",
        includes: [
            "getOpportunityConversionGates",
            "readyToConvert",
            "tx.project.create",
            "Project OS non",
        ],
        name: "conversion remains gated and does not generate Project OS",
    },
    {
        file: "src/server/project-os/actions.ts",
        includes: ["requireAdminSession", "generateProjectOsStructure"],
        name: "Project OS generation remains explicit admin action",
    },
];

let failed = false;

for (const check of checks) {
    const content = await readFile(check.file, "utf8");
    const missing = check.includes.filter((needle) => !content.includes(needle));

    if (missing.length > 0) {
        failed = true;
        console.error(`FAIL ${check.name}`);
        console.error(`  ${check.file}`);
        console.error(`  Missing: ${missing.join(", ")}`);
        continue;
    }

    console.info(`PASS ${check.name}`);
}

if (failed) {
    process.exitCode = 1;
}
