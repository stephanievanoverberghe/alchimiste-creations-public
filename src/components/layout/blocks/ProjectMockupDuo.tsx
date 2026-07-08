import Image from "next/image";

export type ProjectMockupImage = {
    alt: string;
    src: string;
};

type ProjectMockupDuoProps = {
    className?: string;
    desktop: ProjectMockupImage;
    mobile: ProjectMockupImage;
    priority?: boolean;
    sizes?: string;
};

/**
 * Met en scène un projet en deux formats : le mockup navigateur (desktop) et
 * le mockup téléphone qui flotte en surimpression. Utilisé dans les cartes de
 * réalisations (home, galerie, projet suivant) pour montrer le vrai site,
 * responsive, d'un coup d'œil. Le téléphone est décoratif (aria-hidden) car le
 * mockup desktop porte déjà l'alternative textuelle.
 */
export function ProjectMockupDuo({
    className = "",
    desktop,
    mobile,
    priority = false,
    sizes = "(min-width: 768px) 46vw, 92vw",
}: ProjectMockupDuoProps) {
    return (
        <div className={`relative ${className}`}>
            <Image
                src={desktop.src}
                alt={desktop.alt}
                width={2370}
                height={1598}
                sizes={sizes}
                priority={priority}
                className="h-auto w-full"
            />
            <Image
                src={mobile.src}
                alt=""
                aria-hidden="true"
                width={1008}
                height={1917}
                sizes="20vw"
                className="absolute -bottom-2 right-0 hidden h-auto w-[22%] drop-shadow-xl sm:block lg:-right-2 lg:w-[24%]"
            />
        </div>
    );
}
