import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// La server action tire tout le serveur auth (Auth.js, Prisma) : on la
// remplace pour tester le composant en isolation.
vi.mock("@/server/auth/actions", () => ({ signOutAction: vi.fn() }));

import { HeaderAccountMenu } from "./HeaderAccountMenu";

const adminAccess = {
    isAdmin: true,
    adminPath: "/admin",
    clientPath: "/espace-client",
} as const;

const clientAccess = {
    isAdmin: false,
    clientPath: "/espace-client",
} as const;

function openMenu() {
    fireEvent.click(screen.getByRole("button", { name: /mon compte/i }));
}

describe("HeaderAccountMenu", () => {
    it("est fermé par défaut", () => {
        render(<HeaderAccountMenu privateAccess={adminAccess} />);

        expect(
            screen.getByRole("button", { name: /mon compte/i }),
        ).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("ouvre le menu au clic (admin) avec accès admin + déconnexion", () => {
        render(<HeaderAccountMenu privateAccess={adminAccess} />);
        openMenu();

        expect(screen.getByRole("menu")).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", { name: /ouvrir l'admin/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", { name: /se déconnecter/i }),
        ).toBeInTheDocument();
    });

    it("propose « Mon espace » pour un client (non admin)", () => {
        render(<HeaderAccountMenu privateAccess={clientAccess} />);
        openMenu();

        expect(
            screen.getByRole("menuitem", { name: /mon espace/i }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("menuitem", { name: /ouvrir l'admin/i }),
        ).not.toBeInTheDocument();
    });

    it("se ferme après le choix d'une entrée", () => {
        render(<HeaderAccountMenu privateAccess={adminAccess} />);
        openMenu();

        fireEvent.click(
            screen.getByRole("menuitem", { name: /présenter mon projet/i }),
        );

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("se ferme à Échap", () => {
        render(<HeaderAccountMenu privateAccess={adminAccess} />);
        openMenu();

        fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
});
