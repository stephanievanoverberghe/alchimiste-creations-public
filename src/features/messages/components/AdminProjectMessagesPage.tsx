import { ArrowLeft, MessageSquareText } from "lucide-react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, Select, Textarea } from "@/components/ui";
import { createAdminProjectMessageAction } from "@/server/messages/actions";
import { getAdminProjectMessages } from "@/server/messages/messages";

type AdminProjectMessagesPageProps = {
    data: Awaited<ReturnType<typeof getAdminProjectMessages>>;
    messageStatus?: string;
};

export function AdminProjectMessagesPage({
    data,
    messageStatus,
}: AdminProjectMessagesPageProps) {
    return (
        <Section
            spacing="none"
            className="min-h-[calc(100vh-56px)] py-4 md:py-5 lg:py-6"
        >
            <Container>
                <div className="flex flex-col gap-8">
                    <header className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-8">
                        <Button
                            href={`/admin/projets/${data.project.id}/roadmap`}
                            variant="ghost"
                            size="sm"
                            iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                            className="w-fit"
                        >
                            Roadmap projet
                        </Button>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge tone="info">Messages</Badge>
                            <Badge tone="neutral">{data.project.opportunity.prospectName}</Badge>
                        </div>
                        <h1 className="mt-3 text-h1 text-[color:var(--color-text-default)]">
                            Échanges projet
                        </h1>
                        <p className="mt-3 max-w-[760px] text-body text-[color:var(--color-text-muted)]">
                            Les messages visibles client apparaissent dans l’espace client.
                            Les notes internes restent réservées à l’admin.
                        </p>
                    </header>

                    {messageStatus ? (
                        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
                            Message ajouté.
                        </div>
                    ) : null}

                    <form
                        action={createAdminProjectMessageAction}
                        className="grid gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:grid-cols-[240px_minmax(0,1fr)]"
                    >
                        <input type="hidden" name="projectId" value={data.project.id} />
                        <Select
                            name="visibility"
                            label="Visibilité"
                            defaultValue="CLIENT_VISIBLE"
                            options={[
                                {
                                    value: "CLIENT_VISIBLE",
                                    label: "Visible client",
                                },
                                {
                                    value: "INTERNAL",
                                    label: "Note interne",
                                },
                            ]}
                        />
                        <Textarea
                            name="body"
                            label="Message"
                            required
                            rows={4}
                        />
                        <div className="md:col-start-2">
                            <Button type="submit" variant="solid" tone="info">
                                Ajouter le message
                            </Button>
                        </div>
                    </form>

                    <div className="grid gap-5 lg:grid-cols-2">
                        {data.conversations.length > 0 ? (
                            data.conversations.map((conversation) => (
                                <ConversationCard
                                    key={conversation.id}
                                    conversation={conversation}
                                />
                            ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function ConversationCard({
    conversation,
}: {
    conversation: AdminProjectMessagesPageProps["data"]["conversations"][number];
}) {
    const isInternal = conversation.visibility === "INTERNAL";

    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-wrap items-center gap-2">
                <Badge tone={isInternal ? "warning" : "success"}>
                    {isInternal ? "Interne" : "Visible client"}
                </Badge>
                <Badge tone="neutral">{conversation.messages.length} message(s)</Badge>
            </div>
            <h2 className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                {conversation.title}
            </h2>

            <div className="mt-5 flex flex-col gap-3">
                {conversation.messages.length > 0 ? (
                    conversation.messages.map((message) => (
                        <div
                            key={message.id}
                            className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                        >
                            <div className="flex flex-wrap gap-2">
                                <Badge tone={message.authorRole === "ADMIN" ? "info" : "brand"} size="sm">
                                    {message.authorName ?? message.authorRole}
                                </Badge>
                                {message.internalNote ? (
                                    <Badge tone="warning" size="sm">
                                        Note interne
                                    </Badge>
                                ) : null}
                            </div>
                            <p className="mt-3 whitespace-pre-wrap text-body-small text-[color:var(--color-text-muted)]">
                                {message.body}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        Aucun message pour le moment.
                    </p>
                )}
            </div>
        </article>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center lg:col-span-2">
            <MessageSquareText
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun échange projet.
            </p>
            <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                Ajoute un premier message visible client ou une note interne.
            </p>
        </div>
    );
}
