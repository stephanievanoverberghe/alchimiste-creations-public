import { expect, test } from "@playwright/test";

test.describe("Connexion", () => {
    test("affiche le formulaire de lien magique", async ({ page }) => {
        await page.goto("/connexion");

        await expect(page.getByRole("heading", { level: 1 })).toContainText(
            /au clair/i,
        );
        await expect(
            page.getByRole("button", { name: /recevoir le lien/i }),
        ).toBeVisible();
    });

    test("bascule vers le mot de passe", async ({ page }) => {
        await page.goto("/connexion");

        await page
            .getByRole("link", { name: /utiliser plutôt un mot de passe/i })
            .click();

        await expect(page).toHaveURL(/mode=password/);
        await expect(page.getByLabel("Mot de passe")).toBeVisible();
    });

    test("affiche l'écran « lien envoyé » avec l'adresse", async ({ page }) => {
        await page.goto("/connexion?sent=1&email=test%40exemple.com");

        await expect(page.getByText(/regarde ta boîte mail/i)).toBeVisible();
        await expect(page.getByText("test@exemple.com")).toBeVisible();
        await expect(
            page.getByRole("button", { name: /renvoyer le lien/i }),
        ).toBeVisible();
    });
});
