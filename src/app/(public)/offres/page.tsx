import type { Metadata } from "next";

import { OffersPage } from "@/features/public/offers";
import { offersPageContent } from "@/content/offers";

export const metadata: Metadata = {
    title: "Offres — Sites web sur mesure : vitrine, one-page, landing, refonte",
    description:
        "Les offres web d'Alchimiste Créations : site vitrine, one-page, landing page, diagnostic et refonte aux tarifs clairs, plus des accompagnements sur devis (boutique, formation, projet sur mesure).",
};

export default function OffresPage() {
    return <OffersPage content={offersPageContent} />;
}
