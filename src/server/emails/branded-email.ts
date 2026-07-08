// Gabarit d'e-mail transactionnel unique (auth, notifications, contact,
// demande de projet). Les couleurs reprennent les tokens du design
// (src/styles/tokens/colors.css) — un e-mail ne peut pas consommer les
// variables CSS, donc on fige les mêmes valeurs. Titres en display
// (Fraunces, fallback serif), corps en sans.

import { homeHeaderContent } from "@/content/home";

/** Couleurs figées, alignées sur les tokens `--color-*` du site. */
const COLORS = {
    bg: "#0F0E0B",
    surface: "#211D18",
    raised: "#2B251E",
    text: "#FFF3E0",
    muted: "#D8C6AF",
    subtle: "#B79F86",
    inverse: "#211D18",
    action: "#F4A782",
    gold: "#C99A5B",
    borderSoft: "rgba(255,243,224,0.12)",
    borderAction: "rgba(244,167,130,0.30)",
    actionSubtle: "rgba(244,167,130,0.08)",
    footer: "#7C7062",
} as const;

const FONT_DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif";
const FONT_SANS = "'Montserrat', Arial, 'Helvetica Neue', Helvetica, sans-serif";

const FONTS_LINK =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Montserrat:wght@400;500;600&display=swap";

export type BrandedEmailCta = {
    label: string;
    url: string;
};

/** Encart secondaire optionnel (ex. proposition de mot de passe). */
export type BrandedEmailPanel = {
    title: string;
    body: string;
    cta?: BrandedEmailCta;
};

export type BrandedEmailDetailRow = {
    label: string;
    value: string;
};

/** Groupe de détails label/valeur (ex. « Contexte », « Besoin exprimé »). */
export type BrandedEmailDetailGroup = {
    title?: string;
    rows: BrandedEmailDetailRow[];
};

export type BrandedEmailInput = {
    /** Texte de prévisualisation masqué, affiché par la boîte mail. */
    preheader?: string;
    eyebrow: string;
    title: string;
    /** Paragraphes du corps (texte brut ; échappés au rendu). */
    paragraphs: string[];
    primaryCta?: BrandedEmailCta;
    /** Bouton fantôme affiché à côté du CTA principal. */
    secondaryCta?: BrandedEmailCta;
    panel?: BrandedEmailPanel;
    /** Blocs de données structurées (formulaires reçus côté admin). */
    details?: BrandedEmailDetailGroup[];
    /** Note discrète en bas de carte (sécurité, envoi automatique…). */
    footerNote: string;
};

/**
 * Rend un e-mail transactionnel de marque en HTML (tables inline, compatible
 * clients mail). Structure commune : en-tête marque, carte (eyebrow, titre
 * display, corps, CTA, encart et détails optionnels, note), pied de page.
 */
export function renderBrandedEmailHtml(input: BrandedEmailInput): string {
    const brand = escapeHtml(homeHeaderContent.brandLabel);
    const signature = escapeHtml(homeHeaderContent.signature);
    const preheader = input.preheader
        ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(input.preheader)}</div>`
        : "";

    const paragraphs = input.paragraphs
        .map(
            (paragraph) =>
                `<p style="margin:16px 0 0;color:${COLORS.muted};font-family:${FONT_SANS};font-size:15px;line-height:1.75;">${escapeHtml(paragraph)}</p>`,
        )
        .join("");

    const ctaRow = renderCtaRow(input.primaryCta, input.secondaryCta);
    const panel = input.panel ? renderPanel(input.panel) : "";
    const details = (input.details ?? []).map(renderDetailGroup).join("");

    return `<!doctype html>
<html lang="fr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(input.title)}</title>
    <link href="${FONTS_LINK}" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:${COLORS.bg};color:${COLORS.text};font-family:${FONT_SANS};">
    ${preheader}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.bg};padding:32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
            <tr>
              <td style="padding:0 0 20px;text-align:center;">
                <p style="margin:0;color:${COLORS.text};font-family:${FONT_DISPLAY};font-size:20px;font-weight:600;line-height:1.1;">${brand}</p>
                <p style="margin:6px 0 0;color:${COLORS.subtle};font-family:${FONT_SANS};font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;">${signature}</p>
              </td>
            </tr>
            <tr>
              <td style="border:1px solid ${COLORS.borderSoft};border-radius:24px;background:${COLORS.surface};padding:32px 30px;">
                <p style="margin:0;color:${COLORS.gold};font-family:${FONT_SANS};font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;">${escapeHtml(input.eyebrow)}</p>
                <h1 style="margin:12px 0 0;color:${COLORS.text};font-family:${FONT_DISPLAY};font-size:28px;line-height:1.2;font-weight:600;">${escapeHtml(input.title)}</h1>
                ${paragraphs}
                ${ctaRow}
                ${panel}
                ${details}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 0;border-top:1px solid ${COLORS.borderSoft};">
                  <tr>
                    <td style="padding-top:20px;">
                      <p style="margin:0;color:${COLORS.subtle};font-family:${FONT_SANS};font-size:13px;line-height:1.7;">${escapeHtml(input.footerNote)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 10px 0;">
                <p style="margin:0;color:${COLORS.footer};font-family:${FONT_SANS};font-size:12px;line-height:1.6;">${brand} · Site public, CRM interne et espace client privé</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Version texte de l'e-mail : lisible seule, avec les URLs en clair.
 * Aucune boîte mail ne doit dépendre du HTML pour comprendre le message.
 */
export function renderBrandedEmailText(input: BrandedEmailInput): string {
    const lines: string[] = [input.title, ""];

    for (const paragraph of input.paragraphs) {
        lines.push(paragraph);
    }

    if (input.primaryCta) {
        lines.push("", `${input.primaryCta.label} :`, input.primaryCta.url);
    }

    if (input.secondaryCta) {
        lines.push("", `${input.secondaryCta.label} :`, input.secondaryCta.url);
    }

    if (input.panel) {
        lines.push("", `— ${input.panel.title} —`, input.panel.body);

        if (input.panel.cta) {
            lines.push(`${input.panel.cta.label} :`, input.panel.cta.url);
        }
    }

    for (const group of input.details ?? []) {
        lines.push("");

        if (group.title) {
            lines.push(`— ${group.title} —`);
        }

        for (const row of group.rows) {
            lines.push(`${row.label} : ${row.value || "Non renseigné"}`);
        }
    }

    lines.push(
        "",
        input.footerNote,
        "",
        `${homeHeaderContent.brandLabel} — ${homeHeaderContent.signature}`,
    );

    return lines.join("\n");
}

function renderCtaRow(primary?: BrandedEmailCta, secondary?: BrandedEmailCta) {
    if (!primary && !secondary) return "";

    const cells = [
        primary ? renderButtonCell(primary, "primary") : "",
        primary && secondary ? `<td width="12" style="width:12px;">&nbsp;</td>` : "",
        secondary ? renderButtonCell(secondary, "ghost") : "",
    ].join("");

    return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0 0;">
                  <tr>${cells}</tr>
                </table>`;
}

function renderButtonCell(cta: BrandedEmailCta, variant: "primary" | "ghost") {
    const isPrimary = variant === "primary";
    const anchorStyle = isPrimary
        ? `display:inline-block;border-radius:999px;background:${COLORS.action};color:${COLORS.inverse};font-family:${FONT_SANS};font-size:15px;font-weight:600;text-decoration:none;padding:14px 24px;`
        : `display:inline-block;border:1px solid ${COLORS.action};border-radius:999px;color:${COLORS.action};font-family:${FONT_SANS};font-size:14px;font-weight:600;text-decoration:none;padding:13px 22px;`;
    const cellStyle = isPrimary ? `border-radius:999px;background:${COLORS.action};` : "";

    return `<td style="${cellStyle}"><a href="${escapeHtml(cta.url)}" style="${anchorStyle}">${escapeHtml(cta.label)}</a></td>`;
}

function renderPanel(panel: BrandedEmailPanel) {
    const cta = panel.cta
        ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:16px 0 0;"><tr>${renderButtonCell(panel.cta, "ghost")}</tr></table>`
        : "";

    return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 0;border:1px solid ${COLORS.borderAction};border-radius:18px;background:${COLORS.actionSubtle};">
                  <tr>
                    <td style="padding:20px;">
                      <p style="margin:0;color:${COLORS.text};font-family:${FONT_SANS};font-size:16px;font-weight:600;line-height:1.4;">${escapeHtml(panel.title)}</p>
                      <p style="margin:8px 0 0;color:${COLORS.muted};font-family:${FONT_SANS};font-size:14px;line-height:1.7;">${escapeHtml(panel.body)}</p>
                      ${cta}
                    </td>
                  </tr>
                </table>`;
}

function renderDetailGroup(group: BrandedEmailDetailGroup) {
    const title = group.title
        ? `<p style="margin:0 0 12px;color:${COLORS.gold};font-family:${FONT_SANS};font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;">${escapeHtml(group.title)}</p>`
        : "";

    const rows = group.rows
        .map(
            (row) => `<tr>
                          <td style="padding:10px 0;border-top:1px solid ${COLORS.borderSoft};vertical-align:top;width:34%;">
                            <p style="margin:0;color:${COLORS.subtle};font-family:${FONT_SANS};font-size:12px;font-weight:600;line-height:1.45;">${escapeHtml(row.label)}</p>
                          </td>
                          <td style="padding:10px 0 10px 14px;border-top:1px solid ${COLORS.borderSoft};vertical-align:top;">
                            <p style="margin:0;color:${COLORS.muted};font-family:${FONT_SANS};font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(row.value || "Non renseigné")}</p>
                          </td>
                        </tr>`,
        )
        .join("");

    return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 0;border:1px solid ${COLORS.borderSoft};border-radius:18px;background:${COLORS.raised};">
                  <tr>
                    <td style="padding:20px;">
                      ${title}
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
                    </td>
                  </tr>
                </table>`;
}

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
