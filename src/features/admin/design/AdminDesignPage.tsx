import { AdminPageShell } from "@/features/admin/components/AdminPageShell";
import { PageHeader } from "@/components/layout";

import { CardsSection } from "./sections/CardsSection";
import { FeedbackSection } from "./sections/FeedbackSection";
import { FeedSection } from "./sections/FeedSection";
import { FormFieldsSection } from "./sections/FormFieldsSection";
import { FoundationsSection } from "./sections/FoundationsSection";
import { HeadersSection } from "./sections/HeadersSection";
import { PrimitivesSection } from "./sections/PrimitivesSection";
import { SteppersSection } from "./sections/SteppersSection";

/**
 * Référence visuelle vivante du design system (DoD du sprint F3) :
 * fondations F1-F2 puis composants transverses avec leurs états.
 * Cette page remplace un Storybook — tout écart visuel se juge ici.
 */
export function AdminDesignPage() {
    return (
        <AdminPageShell>
            <PageHeader
                variant="admin"
                eyebrow="Système"
                title="Design system vivant"
                description="Les fondations (couleurs, typographie, tokens) et les composants transverses de la refonte, avec leurs états. Toute nouvelle UI se compose à partir d'ici."
            />
            <FoundationsSection />
            <PrimitivesSection />
            <FormFieldsSection />
            <FeedbackSection />
            <SteppersSection />
            <CardsSection />
            <FeedSection />
            <HeadersSection />
        </AdminPageShell>
    );
}
