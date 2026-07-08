import type { ReactNode } from "react";

import { Footer, Header, PrivateAccessProvider } from "@/components/layout";

export default function PublicLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <PrivateAccessProvider>
            <Header />
            {children}
            <Footer />
        </PrivateAccessProvider>
    );
}
