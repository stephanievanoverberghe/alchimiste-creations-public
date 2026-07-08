"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Children,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

export type MobileCarouselProps = {
    ariaLabel: string;
    children: ReactNode;
    className?: string;
    showArrows?: boolean;
};

export function MobileCarousel({
    ariaLabel,
    children,
    className,
    showArrows = false,
}: MobileCarouselProps) {
    const slides = Children.toArray(children);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "center",
        containScroll: "trimSnaps",
    }, [
        Autoplay({
            delay: 4500,
            stopOnInteraction: false,
            stopOnLastSnap: true,
            stopOnMouseEnter: true,
        }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [maxSlideHeight, setMaxSlideHeight] = useState<number | null>(null);
    const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

    const updateCarouselState = useCallback(() => {
        if (!emblaApi) {
            return;
        }

        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    const updateMaxSlideHeight = useCallback(() => {
        const heights = slideRefs.current.map((slide) => {
            const content = slide?.firstElementChild;

            if (content instanceof HTMLElement) {
                return Math.max(
                    content.scrollHeight,
                    content.getBoundingClientRect().height,
                );
            }

            return slide?.scrollHeight ?? 0;
        });
        const nextMaxHeight = Math.max(0, ...heights);

        setMaxSlideHeight((currentHeight) =>
            currentHeight === nextMaxHeight ? currentHeight : nextMaxHeight,
        );
    }, []);

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        const frame = window.requestAnimationFrame(updateCarouselState);
        emblaApi.on("select", updateCarouselState);
        emblaApi.on("reInit", updateCarouselState);

        return () => {
            window.cancelAnimationFrame(frame);
            emblaApi.off("select", updateCarouselState);
            emblaApi.off("reInit", updateCarouselState);
        };
    }, [emblaApi, updateCarouselState]);

    useEffect(() => {
        let frame = 0;
        const scheduleHeightUpdate = () => {
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(updateMaxSlideHeight);
        };

        scheduleHeightUpdate();

        const observer = new ResizeObserver(scheduleHeightUpdate);

        slideRefs.current.forEach((slide) => {
            if (!slide) {
                return;
            }

            observer.observe(slide);

            if (slide.firstElementChild) {
                observer.observe(slide.firstElementChild);
            }
        });

        return () => {
            window.cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [slides.length, updateMaxSlideHeight]);

    useEffect(() => {
        emblaApi?.reInit();
    }, [emblaApi, maxSlideHeight]);

    return (
        <div
            className={`flex flex-col gap-5 ${className ?? ""}`}
            aria-label={ariaLabel}
            role="region"
        >
            <div className="-mx-5 overflow-hidden px-5 py-1" ref={emblaRef}>
                <div className="flex touch-pan-y items-stretch gap-3">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            ref={(node) => {
                                slideRefs.current[index] = node;
                            }}
                            className="min-w-0 flex-[0_0_88%]"
                            style={
                                maxSlideHeight
                                    ? { height: `${maxSlideHeight}px` }
                                    : undefined
                            }
                            aria-label={`Slide ${index + 1} sur ${slides.length}`}
                        >
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            <div
                className={`flex items-center gap-4 ${
                    showArrows ? "justify-between" : "justify-center"
                }`}
            >
                {showArrows ? (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] text-[color:var(--color-text-default)] transition-colors duration-150 hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-hover)] disabled:pointer-events-none disabled:opacity-40"
                            onClick={() => emblaApi?.scrollPrev()}
                            disabled={!canScrollPrev}
                            aria-label="Slide précédente"
                        >
                            <ChevronLeft className="size-4" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] text-[color:var(--color-text-default)] transition-colors duration-150 hover:border-[color:var(--color-action-hover)] hover:text-[color:var(--color-action-hover)] disabled:pointer-events-none disabled:opacity-40"
                            onClick={() => emblaApi?.scrollNext()}
                            disabled={!canScrollNext}
                            aria-label="Slide suivante"
                        >
                            <ChevronRight className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                ) : null}

                <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`h-1.5 rounded-full transition-[width,background-color] duration-150 ${
                                selectedIndex === index
                                    ? "w-6 bg-[var(--color-action-default)]"
                                    : "w-1.5 bg-[var(--color-border-subtle)]"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
