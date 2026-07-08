import type { WizardFlowStep } from "./projectRequestWizardTypes";

/**
 * Parcours unifié du wizard en 6 temps groupés, identique sur tous les écrans
 * (fini les 10 étapes du mobile, jugées trop longues) : chaque temps a du
 * contenu réel. Seul le shell diffère selon la largeur, pas la structure.
 */
export const projectRequestFlowSteps: WizardFlowStep[] = [
    {
        id: "project-type",
        eyebrow: "01 — Projet",
        title: "Quel type de projet veux-tu lancer ?",
        description:
            "Choisis le point de départ le plus proche. Ce choix pourra être ajusté après lecture.",
        stepIds: ["project-type"],
    },
    {
        id: "identity-context",
        eyebrow: "02 — Contact & contexte",
        title: "Qui porte le projet, et de quoi parle-t-on ?",
        description:
            "On relie la demande à une personne, puis au projet ou au site existant si tu en as déjà un.",
        stepIds: ["identity", "project-context"],
    },
    {
        id: "need",
        eyebrow: "03 — Besoin & objectif",
        title: "Ton besoin, et ce qu'il doit changer.",
        description:
            "On comprend ce que tu veux faire, pourquoi, et où le projet en est aujourd'hui.",
        stepIds: ["need", "objective"],
    },
    {
        id: "frame",
        eyebrow: "04 — Cadre & précisions",
        title: "Budget, délai et précisions utiles.",
        description:
            "Ces éléments restent indicatifs, mais ils aident à proposer une suite réaliste. Tu peux aussi joindre un document.",
        stepIds: ["frame", "details"],
    },
    {
        id: "consent",
        eyebrow: "05 — Consentement",
        title: "Dernier point avant le récapitulatif.",
        description:
            "Le consentement concerne uniquement le traitement de ta demande et les échanges autour de ton projet.",
        stepIds: ["consent"],
    },
    {
        id: "review",
        eyebrow: "06 — Récapitulatif",
        title: "Vérifie ta demande avant envoi.",
        description:
            "Relis les informations importantes avant l'envoi. Tu peux corriger ce qui manque ou ce qui n'est pas encore clair.",
        stepIds: ["review"],
    },
];
