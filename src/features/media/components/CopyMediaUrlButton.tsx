"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyMediaUrlButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    async function copyUrl() {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    }

    return (
        <button
            type="button"
            className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
            onClick={copyUrl}
            title={copied ? "URL copiée" : "Copier l'URL"}
        >
            {copied ? (
                <Check className="size-4" aria-hidden="true" />
            ) : (
                <Copy className="size-4" aria-hidden="true" />
            )}
            <span className="sr-only">
                {copied ? "URL copiée" : "Copier l'URL"}
            </span>
        </button>
    );
}
