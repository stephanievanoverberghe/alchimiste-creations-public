# prisma

Database schema and migrations.

`prisma/schema.prisma` is the source of truth for database models.

Rules:

- Add model changes through Prisma migrations.
- Keep seeds idempotent.
- Do not duplicate public content in database seeds without an explicit mapping decision.
- Do not generate Project OS production data automatically from CRM conversion.
