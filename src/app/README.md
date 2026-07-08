# src/app

Route-level only.

This folder contains Next.js routes, layouts, route handlers and metadata.

Rules:

- Keep pages thin.
- Import page orchestrators from `src/features`.
- Keep route handlers thin and delegate server work to `src/server`.
- Do not place reusable UI, business services or static content here.
- Route groups such as `(public)`, `(admin)` and `(auth)` are organizational only and must not change URLs.
