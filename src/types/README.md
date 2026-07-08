# src/types

Shared TypeScript types.

Use this folder only for cross-domain types that are not owned by Prisma, a feature or a content module.

Rules:

- Prefer local feature types when the type has one owner.
- Prefer Prisma-generated types for database models.
- Do not create broad catch-all type files.
