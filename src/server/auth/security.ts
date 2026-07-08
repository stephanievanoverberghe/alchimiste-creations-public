import { getPrismaClient } from "@/server/db/client";

export async function getAccountSecurity(userId: string) {
    const prisma = getPrismaClient();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            email: true,
            lastLoginAt: true,
            passwordSetAt: true,
            role: true,
        },
    });

    return {
        email: user?.email ?? "",
        hasPassword: Boolean(user?.passwordSetAt),
        lastLoginAt: user?.lastLoginAt ?? null,
        passwordSetAt: user?.passwordSetAt ?? null,
        role: user?.role ?? null,
    };
}
