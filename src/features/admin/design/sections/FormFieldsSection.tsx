import { Mail, User } from "lucide-react";

import { Checkbox, Select, Textarea, TextField } from "@/components/ui";

import { DesignSection, DesignSpecimen } from "./shared";

const demoSubjects = [
    { value: "question", label: "Question générale" },
    { value: "collaboration", label: "Collaboration" },
    { value: "presse", label: "Presse / partenariat" },
    { value: "donnees", label: "Données personnelles" },
    { value: "autre", label: "Autre demande" },
];

/**
 * Champs de formulaire transverses : cadre unifié (hauteur ≥ 56 px, icône,
 * focus visible, message d'aide/erreur) et Select listbox WAI-ARIA au
 * clavier complet — la référence pour tout formulaire public ou admin.
 */
export function FormFieldsSection() {
    return (
        <DesignSection
            title="Champs de formulaire — TextField, Select, Textarea, Checkbox"
            note="Cadre unifié : hauteur ≥ 56 px, icône optionnelle, focus visible, message d'aide ou d'erreur. Le Select est un listbox WAI-ARIA piloté au clavier — flèches (l'option active est ramenée dans la vue), Entrée/Espace pour valider, Début/Fin pour les extrêmes, saisie au clavier (typeahead) pour sauter à une option, Échap et Tab pour fermer."
        >
            <div className="grid gap-6 md:grid-cols-2">
                <DesignSpecimen label="TextField — icône + aide">
                    <TextField
                        label="Prénom et nom"
                        name="demo-name"
                        placeholder="Ton nom"
                        helperText="Le nom à utiliser pour te répondre."
                        iconLeft={<User />}
                        autoComplete="name"
                    />
                </DesignSpecimen>

                <DesignSpecimen label="TextField — état d'erreur">
                    <TextField
                        label="Email"
                        name="demo-email"
                        type="email"
                        placeholder="ton@email.com"
                        errorMessage="Indique une adresse email valide."
                        iconLeft={<Mail />}
                    />
                </DesignSpecimen>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <DesignSpecimen label="Select — clavier complet (typeahead, Début/Fin)">
                    <Select
                        label="Sujet"
                        name="demo-subject"
                        placeholder="Choisir un sujet"
                        options={demoSubjects}
                        defaultValue="collaboration"
                        helperText="Ouvre puis tape une lettre pour sauter à une option."
                    />
                </DesignSpecimen>

                <DesignSpecimen label="Select — désactivé">
                    <Select
                        label="Sujet"
                        name="demo-subject-disabled"
                        placeholder="Indisponible pour l'instant"
                        options={demoSubjects}
                        disabled
                    />
                </DesignSpecimen>
            </div>

            <DesignSpecimen label="Textarea — message long">
                <Textarea
                    label="Message"
                    name="demo-message"
                    placeholder="Explique ta demande en quelques lignes..."
                    helperText="Contexte, question, lien utile si besoin."
                />
            </DesignSpecimen>

            <DesignSpecimen label="Checkbox — consentement">
                <Checkbox
                    label="J'accepte que mes informations soient utilisées pour répondre à mon message."
                    helperText="Tes données ne sont pas utilisées pour autre chose."
                    name="demo-consent"
                    defaultChecked
                />
            </DesignSpecimen>
        </DesignSection>
    );
}
