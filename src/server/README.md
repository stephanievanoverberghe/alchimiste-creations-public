# src/server

Server-only application layer.

Use this folder for:

- services;
- repositories;
- mappers;
- server actions;
- authentication guards;
- business workflows that use Prisma or secrets.

Rules:

- Server modules may use Prisma and environment variables.
- Public route handlers should delegate work here.
- Keep CRM, auth, projects, finance and documents separated by domain.
- Never import server modules into client components.
