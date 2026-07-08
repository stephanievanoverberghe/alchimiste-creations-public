import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Config Vitest — tests unitaires et composant du repo.
 * `vite-tsconfig-paths` résout l'alias `@/*` de tsconfig ; environnement
 * jsdom pour les tests de composants React (Testing Library).
 */
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        css: false,
    },
});
