# src/features/public

Public site feature layer.

This folder contains the page orchestrators and domain UI for the public website:

- home
- method
- offers
- realisations
- about
- contact
- project request
- legal and system pages

Rules:

- Public routes must keep their existing URLs.
- Public UX must not depend on CRM admin UI.
- Shared layout and reusable primitives stay in `src/components`.
- Static copy stays in `src/content`.
- Public API behavior must be preserved unless a sprint explicitly changes it.
