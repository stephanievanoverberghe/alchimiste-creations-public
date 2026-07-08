import { Footer, Header, PrivateAccessProvider } from "@/components/layout";
import { notFoundPageContent } from "@/content/system";
import { SystemMessagePage } from "@/features/public/system";

/**
 * 404 racine — hors du groupe (public), elle rend elle-même le shell
 * (header fixe + footer + provider de session partagée) que le layout public
 * fournit aux autres pages.
 */
export default function NotFound() {
    return (
        <PrivateAccessProvider>
            <Header />
            <SystemMessagePage
                content={notFoundPageContent}
                icon="not-found"
            />
            <Footer />
        </PrivateAccessProvider>
    );
}
