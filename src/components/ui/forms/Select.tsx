"use client";

import { Check, ChevronDown } from "lucide-react";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type HTMLAttributes,
    type KeyboardEvent,
} from "react";

import {
    cn,
    FormLabel,
    FormMessage,
    formRootClasses,
    getFieldFrameClasses,
    useFormField,
} from "@/components/ui/forms/shared";

export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

export type SelectProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
> & {
    label: string;
    helperText?: string;
    errorMessage?: string;
    required?: boolean;
    name?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
};

/** Délai (ms) avant remise à zéro du tampon de recherche au clavier. */
const TYPEAHEAD_RESET_MS = 600;

/**
 * Champ de sélection accessible (pattern listbox WAI-ARIA), stylé sur le
 * design system. Clavier complet : flèches (option active suivie et
 * ramenée dans la vue), Entrée/Espace pour valider, Échap pour fermer,
 * Début/Fin pour aller au premier/dernier, saisie au clavier (typeahead)
 * pour sauter à une option par son libellé, Tab pour fermer en sortant.
 */
export function Select({
    label,
    helperText,
    errorMessage,
    required = false,
    disabled = false,
    id,
    className,
    name,
    placeholder = "Sélectionner une option",
    options,
    value,
    defaultValue = "",
    onValueChange,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}: SelectProps) {
    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const { fieldId, messageId, describedBy } = useFormField({
        id,
        name,
        message,
        ariaDescribedBy,
    });
    const listboxId = `${fieldId}-listbox`;

    const rootRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const typeahead = useRef<{
        query: string;
        timer: ReturnType<typeof setTimeout> | null;
    }>({ query: "", timer: null });
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const selectedValue = isControlled ? value : internalValue;
    const selectedOption = options.find((option) => option.value === selectedValue);
    const activeOption = options[activeIndex];

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isOpen]);

    // Ramène l'option active dans la zone visible lors de la navigation
    // clavier (indispensable pour les listes plus longues que le panneau).
    useEffect(() => {
        if (!isOpen) return;

        optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, isOpen]);

    useEffect(() => {
        const state = typeahead.current;

        return () => {
            if (state.timer) clearTimeout(state.timer);
        };
    }, []);

    const selectableIndexes = useMemo(
        () =>
            options
                .map((option, index) => (option.disabled ? null : index))
                .filter((index): index is number => index !== null),
        [options],
    );

    const getInitialActiveIndex = () => {
        const selectedIndex = options.findIndex(
            (option) => option.value === selectedValue && !option.disabled,
        );
        const firstEnabledIndex = options.findIndex((option) => !option.disabled);

        return selectedIndex >= 0 ? selectedIndex : Math.max(firstEnabledIndex, 0);
    };

    const updateValue = (nextValue: string) => {
        if (!isControlled) {
            setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
        setIsOpen(false);
    };

    const getNextEnabledIndex = (
        currentIndex: number,
        direction: 1 | -1,
    ) => {
        if (selectableIndexes.length === 0) return currentIndex;

        const currentPosition = selectableIndexes.includes(currentIndex)
            ? selectableIndexes.indexOf(currentIndex)
            : 0;
        const nextPosition =
            (currentPosition + direction + selectableIndexes.length) %
            selectableIndexes.length;

        return selectableIndexes[nextPosition];
    };

    /**
     * Cherche l'option activable dont le libellé commence par la recherche
     * en cours, en partant après l'option active (pour cycler entre les
     * initiales identiques) puis en bouclant.
     */
    const getTypeaheadIndex = (query: string) => {
        if (selectableIndexes.length === 0) return -1;

        const currentPosition = Math.max(
            selectableIndexes.indexOf(activeIndex),
            0,
        );
        // Une seule lettre : on avance à l'occurrence suivante ; plusieurs
        // lettres : on affine sur place sans sauter la correspondance courante.
        const startOffset = query.length <= 1 ? 1 : 0;

        for (let step = 0; step < selectableIndexes.length; step += 1) {
            const position =
                (currentPosition + startOffset + step) % selectableIndexes.length;
            const index = selectableIndexes[position];

            if (options[index].label.toLowerCase().startsWith(query)) {
                return index;
            }
        }

        return -1;
    };

    const runTypeahead = (character: string) => {
        const state = typeahead.current;

        if (state.timer) clearTimeout(state.timer);
        state.query += character.toLowerCase();
        state.timer = setTimeout(() => {
            state.query = "";
            state.timer = null;
        }, TYPEAHEAD_RESET_MS);

        const matchIndex = getTypeaheadIndex(state.query);

        if (matchIndex < 0) return;

        if (isOpen) {
            setActiveIndex(matchIndex);
        } else {
            updateValue(options[matchIndex].value);
        }
    };

    const openListbox = () => {
        setActiveIndex(getInitialActiveIndex());
        setIsOpen(true);
    };

    const toggleListbox = () => {
        if (isOpen) {
            setIsOpen(false);
            return;
        }

        openListbox();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!isOpen) {
                openListbox();
                return;
            }

            setActiveIndex((currentIndex) => getNextEnabledIndex(currentIndex, 1));
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!isOpen) {
                openListbox();
                return;
            }

            setActiveIndex((currentIndex) => getNextEnabledIndex(currentIndex, -1));
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            if (!isOpen) openListbox();
            if (selectableIndexes.length > 0) {
                setActiveIndex(selectableIndexes[0]);
            }
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            if (!isOpen) openListbox();
            if (selectableIndexes.length > 0) {
                setActiveIndex(selectableIndexes[selectableIndexes.length - 1]);
            }
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (!isOpen) {
                openListbox();
                return;
            }

            if (activeOption && !activeOption.disabled) {
                updateValue(activeOption.value);
            }
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            setIsOpen(false);
            return;
        }

        // Tab : on ferme sans empêcher le déplacement naturel du focus.
        if (event.key === "Tab") {
            setIsOpen(false);
            return;
        }

        // Saisie au clavier : saut à une option par son libellé.
        if (
            event.key.length === 1 &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey
        ) {
            event.preventDefault();
            runTypeahead(event.key);
        }
    };

    const triggerClasses = cn(
        "group flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left text-body",
        getFieldFrameClasses({ disabled, hasError }),
        isOpen &&
            !disabled &&
            !hasError &&
            "border-[color:var(--color-border-focus)] shadow-[0_0_0_4px_rgba(255,193,159,0.22)]",
    );

    const valueClasses = selectedOption
        ? disabled
            ? "truncate text-[var(--color-text-disabled)]"
            : "truncate text-[var(--color-text-default)]"
        : disabled
            ? "truncate text-[var(--color-text-disabled)]"
            : "truncate text-[var(--color-text-subtle)]";

    const iconClasses = cn(
        "pointer-events-none inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[var(--color-text-subtle)] transition-[background-color,color,transform]",
        isOpen && "rotate-180 bg-[var(--color-action-default)] text-[var(--color-text-inverse)]",
        disabled && "bg-[var(--color-surface-default)] text-[var(--color-text-disabled)]",
    );

    // Positionné dans le wrapper du seul déclencheur (pas de la racine) : le
    // menu s'ouvre juste sous le champ, sans le décalage du message d'aide.
    // Scrollbar fine et thématisée pour les listes plus longues.
    const listboxClasses =
        "absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[22rem] overflow-y-auto rounded-2xl border border-[color:var(--color-action-hover)] bg-[linear-gradient(180deg,var(--color-surface-raised),var(--color-bg-deep))] p-2 shadow-2xl shadow-black/45 [scrollbar-color:var(--color-border-strong)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-border-strong)] [&::-webkit-scrollbar-track]:bg-transparent";

    const optionBaseClasses =
        "grid min-h-11 w-full grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 text-left text-body transition-[background-color,color,transform]";

    return (
        <div
            ref={rootRef}
            className={cn("relative", formRootClasses, className)}
            {...props}
        >
            <FormLabel
                htmlFor={fieldId}
                label={label}
                required={required}
                disabled={disabled}
                hasError={hasError}
            />

            <input name={name} type="hidden" value={selectedValue ?? ""} />

            <div className="relative">
                <button
                id={fieldId}
                type="button"
                className={triggerClasses}
                data-focus-ring="none"
                disabled={disabled}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-describedby={describedBy}
                aria-invalid={hasError || ariaInvalid || undefined}
                aria-required={required || undefined}
                aria-activedescendant={
                    isOpen && activeOption
                        ? `${fieldId}-option-${activeOption.value}`
                        : undefined
                }
                onClick={toggleListbox}
                onKeyDown={handleKeyDown}
            >
                <span className={valueClasses}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={iconClasses} aria-hidden="true">
                    <ChevronDown className="size-4" />
                </span>
            </button>

            {isOpen && !disabled ? (
                <div
                    id={listboxId}
                    role="listbox"
                    aria-labelledby={fieldId}
                    className={listboxClasses}
                >
                    {options.map((option, index) => {
                        const isSelected = option.value === selectedValue;
                        const isActive = index === activeIndex;
                        const optionClasses = cn(
                            optionBaseClasses,
                            option.disabled &&
                                "cursor-not-allowed text-[var(--color-text-disabled)]",
                            !option.disabled &&
                                isSelected &&
                                "cursor-pointer bg-[var(--color-action-subtle)] text-[var(--color-action-hover)]",
                            !option.disabled &&
                                !isSelected &&
                                isActive &&
                                "cursor-pointer bg-[var(--color-surface-interactive)] text-[var(--color-text-default)]",
                            !option.disabled &&
                                !isSelected &&
                                !isActive &&
                                "cursor-pointer text-[var(--color-text-muted)] hover:bg-[var(--color-surface-interactive)] hover:text-[var(--color-text-default)]",
                        );

                        return (
                            <button
                                id={`${fieldId}-option-${option.value}`}
                                key={option.value}
                                ref={(node) => {
                                    optionRefs.current[index] = node;
                                }}
                                type="button"
                                role="option"
                                className={optionClasses}
                                disabled={option.disabled}
                                aria-selected={isSelected}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => updateValue(option.value)}
                            >
                                <span className="truncate">{option.label}</span>
                                {isSelected ? (
                                    <Check className="size-4" aria-hidden="true" />
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            ) : null}
            </div>

            <FormMessage
                id={messageId}
                message={message}
                disabled={disabled}
                hasError={hasError}
            />
        </div>
    );
}
