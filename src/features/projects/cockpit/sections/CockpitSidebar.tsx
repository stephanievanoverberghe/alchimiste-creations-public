import {
    CalendarClock,
    ExternalLink,
    FileText,
    ListChecks,
    MessageSquareText,
    Route,
    UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge, Button, TextField } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import { updateProjectLinksAction } from "@/server/projects/actions";

import { DodItem } from "../components/DodItem";
import type { CockpitProject } from "../types";

/**
 * Colonne latérale du cockpit : checklist kickoff (accès client,
 * Drive, GitHub avec conventions de nommage), raccourcis vers les
 * espaces du projet et repères client/type/date.
 */
export function CockpitSidebar({ project }: { project: CockpitProject }) {
    return (
        <aside className="grid content-start gap-4">
            <KickoffChecklist project={project} />
            <ProjectSpaces projectId={project.id} />
            <ProjectFacts project={project} />
        </aside>
    );
}

function KickoffChecklist({ project }: { project: CockpitProject }) {
    const hasDrive = Boolean(project.driveFolderUrl);
    const hasRepo = Boolean(project.githubRepoUrl);
    const hasClientAccess = project.clientPortalAccesses.length > 0;
    const isComplete = hasDrive && hasRepo && hasClientAccess;

    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Checklist kickoff
                </p>
                <Badge tone={isComplete ? "success" : "warning"}>
                    {isComplete ? "Complète" : "À finir"}
                </Badge>
            </div>
            <ul className="mt-3 grid gap-2">
                <DodItem
                    ok={hasClientAccess}
                    label={
                        hasClientAccess
                            ? "Accès espace client actif"
                            : "Aucun accès espace client actif"
                    }
                />
                <DodItem
                    ok={hasDrive}
                    label={
                        hasDrive
                            ? "Dossier Drive relié"
                            : "Dossier Drive à créer et relier"
                    }
                />
                <DodItem
                    ok={hasRepo}
                    label={
                        hasRepo
                            ? "Repo GitHub relié"
                            : "Repo GitHub à créer et relier"
                    }
                />
            </ul>
            <details className="group mt-3" open={!isComplete}>
                <summary className="focus-ring inline-flex min-h-11 cursor-pointer list-none items-center rounded-full text-label text-[color:var(--color-action-default)] underline-offset-4 hover:underline">
                    <span className="group-open:hidden">Relier les liens</span>
                    <span className="hidden group-open:inline">Replier</span>
                </summary>
                <form action={updateProjectLinksAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="projectId" value={project.id} />
                    <TextField
                        label="Dossier Drive"
                        helperText="Convention : AC-PRO-YYYYMMDD-NNN_client-type"
                        name="driveFolderUrl"
                        type="url"
                        inputMode="url"
                        placeholder="https://drive.google.com/…"
                        defaultValue={project.driveFolderUrl ?? ""}
                        maxLength={500}
                    />
                    <TextField
                        label="Repo GitHub"
                        helperText="Convention : ac-client-type-projet"
                        name="githubRepoUrl"
                        type="url"
                        inputMode="url"
                        placeholder="https://github.com/…"
                        defaultValue={project.githubRepoUrl ?? ""}
                        maxLength={500}
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="justify-self-start"
                    >
                        Enregistrer les liens
                    </Button>
                </form>
            </details>
        </section>
    );
}

function ProjectSpaces({ projectId }: { projectId: string }) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                Espaces du projet
            </p>
            <div className="mt-3 grid gap-2">
                <ShortcutLink
                    href={`/admin/projets/${projectId}/documents`}
                    icon={<FileText className="size-4" aria-hidden="true" />}
                    label="Documents"
                />
                <ShortcutLink
                    href={`/admin/projets/${projectId}/roadmap`}
                    icon={<Route className="size-4" aria-hidden="true" />}
                    label="Roadmap complète"
                />
                <ShortcutLink
                    href={`/admin/projets/${projectId}/messages`}
                    icon={
                        <MessageSquareText
                            className="size-4"
                            aria-hidden="true"
                        />
                    }
                    label="Messages"
                />
                <ShortcutLink
                    href={`/admin/projets/${projectId}/questionnaires`}
                    icon={<ListChecks className="size-4" aria-hidden="true" />}
                    label="Questionnaires"
                />
                <ShortcutLink
                    href={`/admin/projets/${projectId}/timeline`}
                    icon={
                        <CalendarClock className="size-4" aria-hidden="true" />
                    }
                    label="Timeline"
                />
            </div>
        </section>
    );
}

function ProjectFacts({ project }: { project: CockpitProject }) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                Repères
            </p>
            <dl className="mt-3 grid gap-3">
                <InfoRow
                    icon={<UserRound className="size-4" aria-hidden="true" />}
                    label="Client"
                    value={`${project.opportunity.prospectName} · ${project.opportunity.prospectEmail}`}
                />
                <InfoRow
                    icon={<FileText className="size-4" aria-hidden="true" />}
                    label="Type de projet"
                    value={project.projectType?.name ?? "Non renseigné"}
                />
                <InfoRow
                    icon={
                        <CalendarClock className="size-4" aria-hidden="true" />
                    }
                    label="Date cible"
                    value={formatDate(project.targetDate, "medium", "Non définie")}
                />
            </dl>
            <div className="mt-4 grid gap-2">
                {project.driveFolderUrl ? (
                    <ExternalShortcut
                        href={project.driveFolderUrl}
                        label="Dossier Drive"
                    />
                ) : null}
                {project.githubRepoUrl ? (
                    <ExternalShortcut
                        href={project.githubRepoUrl}
                        label="Repo GitHub"
                    />
                ) : null}
            </div>
        </section>
    );
}

function ShortcutLink({
    href,
    icon,
    label,
}: {
    href: string;
    icon: ReactNode;
    label: string;
}) {
    return (
        <Button
            href={href}
            variant="secondary"
            size="sm"
            iconLeft={icon}
            className="justify-start"
        >
            {label}
        </Button>
    );
}

function ExternalShortcut({ href, label }: { href: string; label: string }) {
    return (
        <Button
            href={href}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            size="sm"
            iconLeft={<ExternalLink className="size-4" aria-hidden="true" />}
            className="justify-start"
        >
            {label}
        </Button>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-[color:var(--color-text-subtle)]">
                {icon}
            </span>
            <div className="min-w-0">
                <dt className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    {label}
                </dt>
                <dd className="mt-0.5 break-words text-body-small text-[color:var(--color-text-default)]">
                    {value}
                </dd>
            </div>
        </div>
    );
}
