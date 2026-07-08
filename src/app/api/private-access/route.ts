import { NextResponse } from "next/server";

import { privateRoutes } from "@/config";
import { auth } from "@/server/auth";
import { isAdminRole, isClientPortalRole } from "@/server/auth/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const session = await auth();
    const role = session?.user.role;

    if (!role || !isClientPortalRole(role)) {
        return NextResponse.json(null, {
            headers: {
                "Cache-Control": "no-store",
            },
        });
    }

    return NextResponse.json(
        {
            adminPath: isAdminRole(role) ? privateRoutes.admin : undefined,
            clientPath: privateRoutes.clientSpace,
            isAdmin: isAdminRole(role),
        },
        {
            headers: {
                "Cache-Control": "no-store",
            },
        },
    );
}
