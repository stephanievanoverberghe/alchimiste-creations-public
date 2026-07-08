import type { Metadata } from "next";

import { MethodPage } from "@/features/public/method";
import { methodPageContent } from "@/content/method";

export const metadata: Metadata = {
    title: "Méthode Alchimiste — Créer un site web clair, structuré et sur mesure",
    description:
        "Découvrez la Méthode Alchimiste : une façon claire et progressive de créer un site web sur mesure, avec un projet mieux compris, mieux structuré et mieux accompagné.",
};

export default function MethodeAlchimistePage() {
    return <MethodPage content={methodPageContent} />;
}
