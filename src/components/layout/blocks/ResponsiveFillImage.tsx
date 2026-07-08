import Image from "next/image";

export type ResponsiveImageSources = {
    alt: string;
    desktop?: string;
    mobile?: string;
    src: string;
    tablet?: string;
};

type ResponsiveFillImageProps = {
    className?: string;
    image: ResponsiveImageSources;
    sizes: string;
};

export function ResponsiveFillImage({
    className = "",
    image,
    sizes,
}: ResponsiveFillImageProps) {
    const tabletSrc = image.tablet ?? image.src;
    const desktopSrc = image.desktop ?? image.tablet ?? image.src;

    if (tabletSrc === desktopSrc) {
        return (
            <Image
                src={tabletSrc}
                alt={image.alt}
                fill
                sizes={sizes}
                className={className}
            />
        );
    }

    return (
        <>
            <Image
                src={tabletSrc}
                alt={image.alt}
                fill
                sizes={sizes}
                className={`${className} lg:hidden`}
            />
            <Image
                src={desktopSrc}
                alt={image.alt}
                fill
                sizes={sizes}
                className={`${className} hidden lg:block`}
            />
        </>
    );
}
