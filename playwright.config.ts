import { defineConfig, devices } from "@playwright/test";

/**
 * Config Playwright — tests e2e des parcours public et connexion.
 * Réutilise un serveur dev déjà lancé sur :3000 (sinon en démarre un).
 * Les specs vivent dans `e2e/` (séparées des tests Vitest de `src/`).
 */
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: "list",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: {
        command: "corepack pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
    },
});
