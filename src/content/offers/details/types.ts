import type { PublicHeroImages } from "@/components/layout";

export type OfferDetailAction = {
    href: string;
    label: string;
};

export type OfferDetailChecklist = {
    title: string;
    items: readonly string[];
};

export type OfferDetailStep = {
    description: string;
    title: string;
};

export type OfferDetailRelatedOffer = {
    href: string;
    label: string;
};

/** Une étape réelle du playbook (lot), montrée côté public. */
export type OfferDetailWorkflowStep = {
    name: string;
    objective: string;
};

/** Un des trois temps (Clarifier/Designer/Lancer) et ses étapes réelles. */
export type OfferDetailWorkflowGroup = {
    verb: string;
    summary: string;
    steps: readonly OfferDetailWorkflowStep[];
};

/**
 * Le déroulé réel de l'offre, dérivé du playbook canonique et regroupé en
 * trois temps. `count` porte le nombre total d'étapes réelles (preuve de
 * rigueur). Optionnel : déployé offre par offre.
 */
export type OfferDetailWorkflow = {
    eyebrow: string;
    title: string;
    description: string;
    count: number;
    countLabel: string;
    groups: readonly OfferDetailWorkflowGroup[];
};

/** Une question courte de la FAQ d'offre. Optionnel : déployé offre par offre. */
export type OfferDetailFaqItem = {
    question: string;
    answer: string;
};

export type OfferDetailContent = {
    family: string;
    hero: {
        description: string;
        eyebrow: string;
        images: PublicHeroImages;
        price: string;
        primaryAction: OfferDetailAction;
        title: string;
    };
    method: {
        description: string;
        eyebrow: string;
        steps: readonly OfferDetailStep[];
        title: string;
    };
    pricing: {
        description: string;
        factors: readonly string[];
        included: readonly string[];
        options: readonly string[];
        price: string;
        title: string;
    };
    purpose: {
        description: string;
        message: string;
        questions: readonly string[];
        title: string;
    };
    qualification: {
        adapted: OfferDetailChecklist;
        examples?: OfferDetailChecklist;
        notAdapted: OfferDetailChecklist;
        orientations: readonly OfferDetailRelatedOffer[];
        title: string;
    };
    result: {
        description: string;
        items: readonly string[];
        title: string;
    };
    scope: {
        groups: readonly OfferDetailChecklist[];
        note: string;
        title: string;
        /** Ce qui n'est pas dans le périmètre livrable — déployé offre par offre. */
        excluded?: readonly string[];
    };
    seo: {
        description: string;
        title: string;
    };
    slug: string;
    split: {
        client: OfferDetailChecklist;
        studio: OfferDetailChecklist;
        title: string;
    };
    /** Déroulé réel (playbook) regroupé en trois temps — déployé offre par offre. */
    workflow?: OfferDetailWorkflow;
    /** FAQ courte — déployée offre par offre. */
    faq?: readonly OfferDetailFaqItem[];
};
