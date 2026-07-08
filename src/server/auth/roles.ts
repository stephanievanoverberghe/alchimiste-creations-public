import type { UserRole } from "@prisma/client";

export const ADMIN_ROLES: readonly UserRole[] = ["SUPER_ADMIN", "ADMIN"];

export const CLIENT_PORTAL_ROLES = [
    "SUPER_ADMIN",
    "ADMIN",
    "PROJECT_MANAGER",
    "CLIENT_OWNER",
    "CLIENT_MEMBER",
    "LEAD",
    "CLIENT",
] as const satisfies readonly UserRole[];

export function isAdminRole(role: UserRole | null | undefined) {
    return Boolean(role && ADMIN_ROLES.includes(role));
}

export function isClientPortalRole(role: UserRole | null | undefined) {
    return Boolean(role && CLIENT_PORTAL_ROLES.includes(role));
}

export function canBypassClientProjectAccess(role: UserRole | null | undefined) {
    return isAdminRole(role);
}

export function getAuthenticatedHomePath(role: UserRole | null | undefined) {
    if (isAdminRole(role)) return "/admin";
    if (isClientPortalRole(role)) return "/espace-client";

    return null;
}
