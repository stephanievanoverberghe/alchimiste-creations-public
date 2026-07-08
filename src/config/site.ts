export const siteConfig = {
    name: "Alchimiste Créations",
    url: "https://alchimiste-creations.fr",
    description:
        "Alchimiste Créations conçoit des sites web sur mesure avec une méthode claire, un design soigné et un développement moderne.",
} as const;

/**
 * Réseaux sociaux du studio — source unique, consommée par le footer (donc
 * présents sur toutes les pages publiques). Données pures : le rendu associe
 * `platform` à son icône. Retirer une entrée la fait disparaître partout.
 */
export const socialLinks = [
    {
        platform: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/stephanie-vanoverberghe/",
    },
    {
        platform: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/lalchimiste_creations/",
    },
] as const;

export type SocialPlatform = (typeof socialLinks)[number]["platform"];
