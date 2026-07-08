import Image from "next/image";
import type { ReactNode } from "react";

export type PublicHeroImages = {
    alt: string;
    desktop: string;
    mobile: string;
    tablet: string;
};

type PublicHeroProps = {
    /** @deprecated Le header global détecte la page active via le pathname. */
    activeHref?: string;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    images: PublicHeroImages;
    overlayClassName?: string;
};

export function PublicHero({
    children,
    className = "",
    contentClassName = "",
    images,
    overlayClassName = "bg-[linear-gradient(180deg,rgba(15,14,11,0.48)_0%,rgba(15,14,11,0.68)_46%,rgba(15,14,11,0.56)_100%)] md:bg-[linear-gradient(100deg,rgba(15,14,11,0.90)_0%,rgba(15,14,11,0.74)_46%,rgba(15,14,11,0.36)_100%)]",
}: PublicHeroProps) {
    return (
        <section
            className={`relative isolate overflow-hidden rounded-b-4xl border-b-2 border-[var(--color-decor-gold)] bg-[var(--color-bg-deep)] ${className}`}
        >
            <HeroImage images={images} />

            <span
                className={`absolute inset-0 z-0 ${overlayClassName}`}
                aria-hidden="true"
            />

            <span
                className="absolute inset-x-0 bottom-0 z-0 hidden h-40 bg-[linear-gradient(180deg,transparent_0%,rgba(15,14,11,0.74)_100%)] md:block"
                aria-hidden="true"
            />

            <div
                className={`relative z-10 mx-auto grid w-full max-w-[1440px] gap-8 p-5 pt-24 md:px-8 md:pt-28 lg:px-12 lg:pt-36 ${contentClassName}`}
            >
                {children}
            </div>
        </section>
    );
}

const heroZoom =
    "motion-safe:animate-[hero-zoom_1600ms_var(--ease-enter)_both]";

/**
 * Image de héros en art direction : une variante par viewport (mobile
 * portrait, tablette et desktop paysage), chacune un `<Image>` next/image
 * masqué par CSS hors de son format. Seule la variante mobile est
 * `priority` (LCP) ; les autres restent en `loading="lazy"` et, comme
 * elles sont `display:none` sur les formats plus petits, ne se chargent
 * que sur leur propre viewport — le mobile ne paie plus tablette+desktop
 * (audit F0 n° 8), sans le bug de sélection du `<picture>`.
 */
function HeroImage({ images }: { images: PublicHeroImages }) {
    return (
        <>
            <Image
                src={images.mobile}
                alt={images.alt}
                fill
                priority
                sizes="100vw"
                className={`z-0 object-cover md:hidden ${heroZoom}`}
            />
            <Image
                src={images.tablet}
                alt=""
                fill
                sizes="100vw"
                className={`z-0 hidden object-cover md:block lg:hidden ${heroZoom}`}
            />
            <Image
                src={images.desktop}
                alt=""
                fill
                sizes="100vw"
                className={`z-0 hidden object-cover lg:block ${heroZoom}`}
            />
        </>
    );
}
