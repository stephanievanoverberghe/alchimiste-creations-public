import { Container } from "@/components/layout";
import type { MethodPageContent } from "@/content/method";

import {
    MethodAdaptationSection,
    MethodHeroSection,
    MethodIntentionSection,
    MethodJourneySection,
    MethodRolesSection,
} from "./sections";

type MethodPageProps = {
    content: MethodPageContent;
};

/**
 * Page méthode publique — la « visite guidée » du Project OS en un seul
 * récit vertical, du 375 au desktop : héros à rail des trois temps, puis
 * pourquoi une méthode (01), le parcours en sept étapes livrable + rôle
 * client (02, la vitrine), la collaboration (03) et l'adaptation par type
 * de projet (04). L'appel final est porté par la bande CTA du footer.
 */
export function MethodPage({ content }: MethodPageProps) {
    return (
        <div className="flex flex-col">
            <MethodHeroSection content={content.hero} />
            <Container>
                <MethodIntentionSection content={content.intention} />
                <MethodJourneySection content={content.journey} />
                <MethodRolesSection content={content.roles} />
                <MethodAdaptationSection content={content.adaptation} />
            </Container>
        </div>
    );
}
