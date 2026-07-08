import { expect, test } from "@playwright/test";

test.describe("Parcours public", () => {
    test("l'accueil se charge avec le héros et la navigation", async ({
        page,
    }) => {
        await page.goto("/");

        await expect(page.getByRole("heading", { level: 1 })).toContainText(
            /projet/i,
        );
        await expect(
            page.getByRole("link", { name: "Méthode" }).first(),
        ).toBeVisible();
    });

    test("navigue de l'accueil vers les offres", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", { name: "Offres" }).first().click();

        await expect(page).toHaveURL(/\/offres$/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("la page contact affiche le formulaire", async ({ page }) => {
        await page.goto("/contact");

        await expect(
            page.getByRole("heading", { level: 1 }),
        ).toBeVisible();
        await expect(page.getByLabel(/email/i).first()).toBeVisible();
    });
});
