import { publicRoutes } from "@/config/navigation";

export type SystemPageAction = {
    href: string;
    label: string;
    variant: "primary" | "secondary";
};

export type SystemPageContent = {
    actions: readonly SystemPageAction[];
    eyebrow: string;
    message: string;
    title: string;
};

export const notFoundPageContent = {
    eyebrow: "Page introuvable",
    title: "Cette page n’existe pas ou a changé d’adresse.",
    message:
        "Tu peux revenir à l’accueil, explorer les offres ou me contacter si tu cherchais une information précise.",
    actions: [
        {
            href: publicRoutes.home,
            label: "Retour à l’accueil",
            variant: "primary",
        },
        {
            href: publicRoutes.contact,
            label: "Contacter le studio",
            variant: "secondary",
        },
    ],
} as const satisfies SystemPageContent;
