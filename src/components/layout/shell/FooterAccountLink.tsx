"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { privateRoutes } from "@/config";

import { usePrivateAccess } from "./PrivateAccess";

/**
 * Lien d'accès privé du footer, adapté à la session : « Accéder à mon
 * espace » pour un client connecté, « Ouvrir l'admin » pour l'admin,
 * « Se connecter » sinon.
 */
export function FooterAccountLink() {
    const privateAccess = usePrivateAccess();

    const { href, label } = privateAccess?.isAdmin
        ? {
              href: privateAccess.adminPath ?? privateRoutes.admin,
              label: "Ouvrir l'admin",
          }
        : privateAccess
          ? { href: privateAccess.clientPath, label: "Accéder à mon espace" }
          : { href: privateRoutes.login, label: "Se connecter" };

    return (
        <Link
            href={href}
            className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-full text-body-small font-semibold text-[color:var(--color-action-default)] no-underline transition-colors duration-150 hover:text-[color:var(--color-action-hover)]"
        >
            {label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
    );
}
