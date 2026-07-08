import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type CommercialPlaybookReference = {
    adminView: string[];
    clientView: string[];
    conversionRule: {
        allowedWhen: string[];
        creates: string[];
        doesNotCreate: string[];
    };
    followUps: string[];
    objective: string;
    role: string;
    steps: CommercialPlaybookReferenceStep[];
};

export type CommercialPlaybookReferenceStep = {
    adminSees: string[];
    clientSees: string;
    documents: string[];
    expectedOutput: string;
    followUp: string;
    objective: string;
    order: number;
    title: string;
    todos: string[];
    validation: string;
};

const COMMERCIAL_PLAYBOOK_PATH = "data/playbooks-v2/commercial/playbook.md";

export function getCommercialPlaybookReference(): CommercialPlaybookReference | null {
    const absolutePath = path.join(process.cwd(), COMMERCIAL_PLAYBOOK_PATH);

    if (!existsSync(absolutePath)) {
        return null;
    }

    const markdown = readFileSync(absolutePath, "utf8");

    return {
        adminView: readListSection(markdown, "Vue admin cible"),
        clientView: readListSection(markdown, "Vue client cible"),
        conversionRule: {
            allowedWhen: readListAfterLine(markdown, "On peut convertir seulement si :"),
            creates: readListAfterLine(markdown, "La conversion crée seulement :"),
            doesNotCreate: readListAfterLine(markdown, "Elle ne crée pas :"),
        },
        followUps: readListSection(markdown, "Règles de relance globales"),
        objective: readTextSection(markdown, "Objectif"),
        role: readTextSection(markdown, "Rôle"),
        steps: readCommercialSteps(markdown),
    };
}

function readCommercialSteps(markdown: string): CommercialPlaybookReferenceStep[] {
    const matches = Array.from(markdown.matchAll(/^## Étape (\d+) - (.+)$/gm));

    return matches.map((match, index) => {
        const startIndex = match.index ?? 0;
        const nextMatch = matches[index + 1];
        const endIndex = nextMatch?.index ?? markdown.length;
        const chunk = markdown.slice(startIndex, endIndex);

        return {
            adminSees: readSubsectionList(chunk, "Admin voit"),
            clientSees: readSubsectionText(chunk, "Client voit"),
            documents: readSubsectionList(chunk, "Documents"),
            expectedOutput: readSubsectionText(chunk, "Sortie attendue"),
            followUp: readSubsectionText(chunk, "Relance"),
            objective: readSubsectionText(chunk, "Objectif"),
            order: Number(match[1]),
            title: match[2]?.trim() ?? `Étape ${match[1]}`,
            todos: readSubsectionList(chunk, "À faire"),
            validation:
                readSubsectionText(chunk, "Validation de sortie") ||
                readSubsectionText(chunk, "Gate de sortie"),
        };
    });
}

function readTextSection(markdown: string, title: string) {
    return normalizeText(readSection(markdown, `## ${title}`));
}

function readListSection(markdown: string, title: string) {
    return readList(readSection(markdown, `## ${title}`));
}

function readSubsectionText(markdown: string, title: string) {
    return normalizeText(readSection(markdown, `### ${title}`));
}

function readSubsectionList(markdown: string, title: string) {
    return readList(readSection(markdown, `### ${title}`));
}

function readSection(markdown: string, heading: string) {
    const headingIndex = markdown.indexOf(heading);

    if (headingIndex === -1) return "";

    const contentStart = headingIndex + heading.length;
    const headingLevel = heading.startsWith("### ") ? "### " : "## ";
    const nextHeadingIndex = markdown.indexOf(`\n${headingLevel}`, contentStart);
    const contentEnd = nextHeadingIndex === -1 ? markdown.length : nextHeadingIndex;

    return markdown.slice(contentStart, contentEnd);
}

function readListAfterLine(markdown: string, line: string) {
    const lineIndex = markdown.indexOf(line);

    if (lineIndex === -1) return [];

    const contentStart = lineIndex + line.length;
    const nextHeadingIndex = markdown.indexOf("\n## ", contentStart);
    const contentEnd = nextHeadingIndex === -1 ? markdown.length : nextHeadingIndex;

    const items: string[] = [];
    const lines = markdown.slice(contentStart, contentEnd).split(/\r?\n/);
    let hasStartedList = false;

    for (const lineContent of lines) {
        const trimmedLine = lineContent.trim();

        if (!trimmedLine) {
            continue;
        }

        if (trimmedLine.startsWith("- ")) {
            hasStartedList = true;
            items.push(trimmedLine.slice(2).trim());
            continue;
        }

        if (hasStartedList) {
            break;
        }
    }

    return items.filter(Boolean);
}

function readList(markdown: string) {
    return markdown
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).trim())
        .filter(Boolean);
}

function normalizeText(markdown: string) {
    return markdown
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("- "))
        .map((line) => line.replace(/^#{1,6}\s+/u, ""))
        .join("\n")
        .trim();
}
