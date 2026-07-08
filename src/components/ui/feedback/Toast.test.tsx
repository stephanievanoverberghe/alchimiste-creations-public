import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Toast } from "./Toast";

afterEach(() => {
    vi.useRealTimers();
});

describe("Toast", () => {
    it("affiche le titre et le contenu", () => {
        render(<Toast title="Message envoyé">Ton message est parti.</Toast>);

        expect(screen.getByText("Message envoyé")).toBeInTheDocument();
        expect(screen.getByText("Ton message est parti.")).toBeInTheDocument();
    });

    it("se ferme au clic sur la croix quand il est dismissible", () => {
        render(
            <Toast title="Connexion refusée" dismissible tone="danger">
                Vérifie tes identifiants.
            </Toast>,
        );

        fireEvent.click(screen.getByLabelText("Fermer la notification"));

        expect(screen.queryByText("Connexion refusée")).not.toBeInTheDocument();
    });

    it("n'affiche pas de bouton de fermeture par défaut", () => {
        render(<Toast title="Info">Une information.</Toast>);

        expect(
            screen.queryByLabelText("Fermer la notification"),
        ).not.toBeInTheDocument();
    });

    it("disparaît seul après durationMs quand autoDismiss est actif", () => {
        vi.useFakeTimers();

        render(
            <Toast title="Lien envoyé" autoDismiss durationMs={5000} tone="success">
                Regarde ta boîte mail.
            </Toast>,
        );

        expect(screen.getByText("Lien envoyé")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.queryByText("Lien envoyé")).not.toBeInTheDocument();
    });

    it("reste affiché sans autoDismiss (erreur persistante)", () => {
        vi.useFakeTimers();

        render(
            <Toast title="Erreur" dismissible tone="danger">
                À corriger.
            </Toast>,
        );

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(screen.getByText("Erreur")).toBeInTheDocument();
    });
});
