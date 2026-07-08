import type { Metadata } from "next";

import { AdminClientsPage } from "@/features/clients/components";
import { getAdminClients } from "@/server/clients/clients";

export const metadata: Metadata = {
    title: "Clients — Admin Alchimiste Créations",
    description: "Comptes clients, prospects et contacts rattachés.",
};

export const dynamic = "force-dynamic";

export default async function AdminClientsRoute() {
    const data = await getAdminClients();

    return <AdminClientsPage data={data} />;
}
