import { HelpCircle } from "lucide-react";

export function HelpTooltip({ text }: { text: string }) {
    return (
        <span className="group relative inline-flex">
            <button
                type="button"
                className="focus-ring inline-flex size-5 items-center justify-center text-[color:var(--color-info-text)] transition-colors hover:text-[color:var(--color-info-solid-hover)]"
                aria-label={text}
            >
                <HelpCircle className="size-4" aria-hidden="true" />
            </button>
            <span className="pointer-events-none absolute left-1/2 top-9 z-20 hidden w-72 -translate-x-1/2 rounded-xl border border-[color:var(--color-info-border)] bg-[var(--color-info-bg)] p-3 text-caption text-[color:var(--color-info-text)] shadow-xl shadow-black/25 group-hover:block group-focus-within:block">
                {text}
            </span>
        </span>
    );
}
