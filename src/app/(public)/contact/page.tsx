import type { Metadata } from "next";

import { ContactPage } from "@/features/public/contact";
import { contactPageContent } from "@/content/contact";

export const metadata: Metadata = {
    title: contactPageContent.seo.title,
    description: contactPageContent.seo.description,
};

export default function ContactPageRoute() {
    return <ContactPage content={contactPageContent} />;
}
