"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { Section } from "@/components/layout";
import type { RealisationsProjectContent } from "@/content/realisations";

type ProjectGallerySectionProps = {
    content: RealisationsProjectContent["gallery"];
};

/**
 * Le site en images : des vignettes compactes de captures réelles, et une
 * lightbox pour les voir en grand sans allonger la page. Navigation clavier
 * (Échap / flèches) et clic sur le fond pour fermer.
 */
export function ProjectGallerySection({ content }: ProjectGallerySectionProps) {
    const images = content.images;
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const close = useCallback(() => setOpenIndex(null), []);
    const go = useCallback(
        (delta: number) =>
            setOpenIndex((current) =>
                current === null
                    ? current
                    : (current + delta + images.length) % images.length,
            ),
        [images.length],
    );

    useEffect(() => {
        if (openIndex === null) {
            return;
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
            if (event.key === "ArrowLeft") go(-1);
            if (event.key === "ArrowRight") go(1);
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [openIndex, close, go]);

    const active = openIndex === null ? null : images[openIndex];

    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    02 — Le site en images
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-10 sm:grid-cols-4 lg:gap-4">
                {images.map((image, index) => (
                    <li key={image.src}>
                        <button
                            type="button"
                            onClick={() => setOpenIndex(index)}
                            aria-label={`Agrandir : ${image.alt}`}
                            className="focus-ring group relative block aspect-[4/3] w-full overflow-hidden rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] shadow-elevation-1 transition-[border-color] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/55"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(min-width: 640px) 23vw, 45vw"
                                className="object-cover object-top transition-transform duration-500 ease-standard group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
                            />
                            <span
                                className="absolute inset-0 flex items-center justify-center bg-[rgba(15,14,11,0.35)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                aria-hidden="true"
                            >
                                <span className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/60 bg-[rgba(15,14,11,0.6)] text-[color:var(--color-decor-gold)] backdrop-blur-sm">
                                    <Expand className="size-4" />
                                </span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            {active ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={active.alt}
                    className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
                >
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Fermer"
                        className="absolute inset-0 cursor-zoom-out bg-[rgba(10,9,8,0.92)] backdrop-blur-sm"
                    />

                    <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                        {`${(openIndex ?? 0) + 1} / ${images.length}`}
                    </span>

                    <button
                        type="button"
                        onClick={close}
                        aria-label="Fermer"
                        className="focus-ring absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.6)] text-[color:var(--color-text-default)] backdrop-blur-sm hover:border-[color:var(--color-decor-gold)]/60"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>

                    {images.length > 1 ? (
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Image précédente"
                            className="focus-ring absolute left-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.6)] text-[color:var(--color-text-default)] backdrop-blur-sm hover:border-[color:var(--color-decor-gold)]/60 sm:left-6"
                        >
                            <ChevronLeft className="size-5" aria-hidden="true" />
                        </button>
                    ) : null}

                    <div className="relative z-[1] max-h-[85vh] max-w-[92vw]">
                        <Image
                            src={active.src}
                            alt={active.alt}
                            width={active.width ?? 2160}
                            height={active.height ?? 1350}
                            sizes="92vw"
                            className="max-h-[85vh] w-auto rounded-panel border border-[color:var(--color-border-subtle)] object-contain shadow-elevation-3"
                        />
                    </div>

                    {images.length > 1 ? (
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Image suivante"
                            className="focus-ring absolute right-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.6)] text-[color:var(--color-text-default)] backdrop-blur-sm hover:border-[color:var(--color-decor-gold)]/60 sm:right-6"
                        >
                            <ChevronRight className="size-5" aria-hidden="true" />
                        </button>
                    ) : null}
                </div>
            ) : null}
        </Section>
    );
}
