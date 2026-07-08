import { ArrowLeft, MessageSquareText } from "lucide-react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, Textarea } from "@/components/ui";
import { createClientProjectMessageAction } from "@/server/messages/actions";
import { getClientProjectMessages } from "@/server/messages/messages";

type ClientProjectMessagesPageProps = {
    data: Awaited<ReturnType<typeof getClientProjectMessages>>;
    messageStatus?: string;
};

export function ClientProjectMessagesPage({
    data,
    messageStatus,
}: ClientProjectMessagesPageProps) {
    return (
        <Section spacing="lg" className="min-h-[calc(100vh-220px)]">
            <Container>
                <div className="flex flex-col gap-8">
                    <header className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-8">
                        <Button
                            href={`/espace-client/projets/${data.project.id}`}
                            variant="ghost"
                            size="sm"
                            iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                            className="w-fit"
                        >
                            Projet
                        </Button>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge tone="info">Messages</Badge>
                            <Badge tone="neutral">{data.project.name}</Badge>
                        </div>
                        <h1 className="mt-3 text-h1 text-[color:var(--color-text-default)]">
                            Échanges avec Alchimiste Créations
                        </h1>
                        <p className="mt-3 max-w-[760px] text-body text-[color:var(--color-text-muted)]">
                            Les messages ici sont liés au projet et visibles par l’équipe
                            Alchimiste Créations.
                        </p>
                    </header>

                    {messageStatus ? (
                        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
                            Message transmis.
                        </div>
                    ) : null}

                    <form
                        action={createClientProjectMessageAction}
                        className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                    >
                        <input type="hidden" name="projectId" value={data.project.id} />
                        <Textarea
                            name="body"
                            label="Nouveau message"
                            required
                            rows={4}
                        />
                        <Button type="submit" variant="solid" tone="info" className="mt-4">
                            Envoyer
                        </Button>
                    </form>

                    <div className="grid gap-5">
                        {data.conversations.length > 0 ? (
                            data.conversations.map((conversation) => (
                                <article
                                    key={conversation.id}
                                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                                >
                                    <div className="flex flex-wrap gap-2">
                                        <Badge tone="success">Visible client</Badge>
                                        <Badge tone="neutral">
                                            {conversation.messages.length} message(s)
                                        </Badge>
                                    </div>
                                    <h2 className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                                        {conversation.title}
                                    </h2>

                                    <div className="mt-5 flex flex-col gap-3">
                                        {conversation.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                                            >
                                                <Badge
                                                    tone={
                                                        message.authorRole === "ADMIN"
                                                            ? "info"
                                                            : "brand"
                                                    }
                                                    size="sm"
                                                >
                                                    {message.authorName ?? message.authorRole}
                                                </Badge>
                                                <p className="mt-3 whitespace-pre-wrap text-body-small text-[color:var(--color-text-muted)]">
                                                    {message.body}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </article>
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

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <MessageSquareText
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun message pour le moment.
            </p>
        </div>
    );
}
