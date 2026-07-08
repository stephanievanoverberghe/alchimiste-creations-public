# src/lib

Pure utilities and client-safe helpers.

Use this folder for validation, formatting and small helpers that can safely run outside server-only contexts.

Rules:

- No Prisma client here.
- No server-only business workflows here.
- No secrets or direct environment-dependent services unless the helper is explicitly server-safe and isolated.
- Move server logic to `src/server`.
