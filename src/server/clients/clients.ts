import { getPrismaClient } from "@/server/db/client";

export async function getAdminClients() {
    const prisma = getPrismaClient();

    const clients = await prisma.clientAccount.findMany({
        orderBy: [{ updatedAt: "desc" }],
        select: {
            id: true,
            name: true,
            type: true,
            status: true,
            companyName: true,
            brandName: true,
            billingEmail: true,
            source: true,
            updatedAt: true,
            contacts: {
                orderBy: [{ createdAt: "asc" }],
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    status: true,
                    roleInProject: true,
                },
            },
            _count: {
                select: {
                    contacts: true,
                    opportunities: true,
                    projectRequests: true,
                },
            },
        },
    });

    return {
        clients,
        totals: {
            accounts: clients.length,
            activeClients: clients.filter(
                (client) => client.status === "ACTIVE_CLIENT",
            ).length,
            leads: clients.filter((client) => client.status === "LEAD").length,
        },
    };
}
