import { expect, test } from "@playwright/test";

test.describe("Demande de projet (tunnel de conversion)", () => {
    test("le tunnel se charge avec le wizard et sa progression", async ({
        page,
    }) => {
        await page.goto("/demande-de-projet");

        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        // Le wizard est monté : sa barre de progression est présente.
        await expect(page.getByRole("progressbar").first()).toBeVisible();
    });

    test("la première étape propose les types de projet", async ({ page }) => {
        await page.goto("/demande-de-projet");

        // Présence d'un choix de type de projet (chip), sans jamais soumettre
        // (aucune vraie demande n'est créée). Deux wizards mobile/desktop
        // coexistent dans le DOM, d'où le .first().
        await expect(page.getByText("Site vitrine").first()).toBeVisible();
    });
});
