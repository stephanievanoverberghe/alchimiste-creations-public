import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Montserrat } from "next/font/google";

import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/seo";

import "./globals.css";

// Pairing A (sprint F1) : Fraunces porte les titres, Montserrat le texte.
// Les variables alimentent --font-display / --font-sans via
// src/styles/tokens/typography.css — ne jamais référencer les fontes ailleurs.
const fraunces = Fraunces({
    axes: ["opsz"],
    display: "swap",
    style: ["normal", "italic"],
    subsets: ["latin"],
    variable: "--font-fraunces",
});

const montserrat = Montserrat({
    display: "swap",
    subsets: ["latin"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: siteConfig.name,
    description: siteConfig.description,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="fr" className={`${fraunces.variable} ${montserrat.variable}`}>
            <body>
                <main className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-default)]">
                    {children}
                </main>
            </body>
        </html>
    );
}
