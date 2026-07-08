# Alchimiste Créations

Site freelance de création de sites web, **CRM interne** et **espace client**, réunis dans un seul dépôt. L'application pilote les projets clients de bout en bout — demande entrante → qualification → devis → conversion → production → livraison → feedback — en suivant un fil rouge par offre.

Trois territoires, une même identité :

- **Public (marketing)** — le site vitrine qui vend : home, méthode, offres, réalisations, à-propos, contact, demande de projet, pages légales.
- **Admin (CRM / Project OS)** — pipeline commercial, cockpit projet, documents, playbooks, finance, médiathèque.
- **Espace client** — accueil, projets, messages, questionnaires, timeline, boucle de validation des livrables.

Le CRM n'est pas un SaaS séparé : il vit dans ce repo et ne doit jamais dégrader le site public.

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript** strict
- **Tailwind CSS 4** + tokens CSS (`src/styles/`)
- **Prisma 7** + **PostgreSQL** (Neon serverless)
- **Auth.js v5** (magic link Resend + credentials, JWT)
- **pnpm** (via corepack), **Node ≥ 24.15**

## Démarrage

```bash
# 1. Dépendances (pnpm est géré par corepack)
corepack enable
corepack pnpm install

# 2. Variables d'environnement
cp .env.example .env   # puis renseigner les valeurs (voir ci-dessous)

# 3. Client Prisma + base
corepack pnpm prisma:generate
corepack pnpm exec prisma migrate deploy   # applique les migrations sur la base

# 4. Développement
corepack pnpm dev        # http://localhost:3000
```

## Commandes

| Commande | Rôle |
|---|---|
| `corepack pnpm dev` | Serveur de développement |
| `corepack pnpm build` | Build de production (`prisma generate` + `next build`) |
| `corepack pnpm start` | Serveur de production |
| `corepack pnpm lint` | ESLint |
| `corepack pnpm typecheck` | Vérification TypeScript (`tsc --noEmit`) |
| `corepack pnpm test` | Tests unitaires et d'intégration (Vitest) |
| `corepack pnpm test:e2e` | Tests e2e des parcours (Playwright) |
| `corepack pnpm test:crm-hardening` | Contrôles de sécurité auth / admin / espace client |
| `corepack pnpm test:project-os` | Contrôles qualité du référentiel Project OS |
| `corepack pnpm prisma:validate` | Validation du schéma Prisma |
| `corepack pnpm prisma:generate` | Génération du client Prisma typé |

> Le client Prisma doit être généré avant `typecheck` (de nombreux fichiers dépendent des types générés). `pnpm dev`/`build` s'en chargent ; sur un clone frais, lance `prisma:generate` d'abord.

## Variables d'environnement

Voir [`.env.example`](.env.example) pour la liste complète. Principales :

- **Base** : `DATABASE_URL`, `DIRECT_URL` (Neon)
- **Auth** : `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`, `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM`, `AUTH_ADMIN_EMAILS`
- **E-mails** : `RESEND_API_KEY`, `PROJECT_REQUEST_EMAIL_*`, `CONTACT_EMAIL_*`
- **Médias** : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Architecture

```txt
src/app/<groupe>/<route>/page.tsx   Routes minces : metadata, auth, données, rendu d'un <X>Page
src/features/<domaine>/             Orchestrateurs <X>Page + sections/ (présentation)
src/content/<domaine>/              Textes et contenus éditoriaux (public + espace client)
src/server/<domaine>/               Métier : seul endroit qui touche Prisma (actions, règles)
src/lib/                            Utilitaires purs partagés (formatters, mappings de statuts)
src/components/ui | layout          Composants réutilisables transverses
src/config/                         Navigation, offres, pages publiques
src/styles/                         Reset, tokens (couleurs, typo, élévation, motion…)
prisma/                             Schéma + migrations SQL (additives)
data/project-os/                    Référentiels Project OS (lots, phases, livrables, statuts…)
e2e/                                Tests e2e Playwright (parcours public et connexion)
```

Règles clés : toute lecture/écriture DB passe par `src/server/*` ; chaque page/action admin revérifie `requireAdminSession`, chaque page client `requireClientPortalSession` ; tout ce qui est montré au client passe par un flag de visibilité. **Mobile-first** sur toute l'UI. JSDoc en français sur les fonctions exportées.

## Workflow Git

- `main` = stable. Le travail se fait sur une **branche de feature par lot/chantier** (ex. `auth`).
- Jamais de merge/push sur `main` sans demande explicite.
- Un objectif par commit ; validations (lint, typecheck, build + tests selon le périmètre) avant push.

## Intégration continue

Le workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) rejoue, sur chaque push et pull request : install (lockfile figé) → génération Prisma → lint → typecheck → tests Vitest → contrôles CRM / Project OS → validation Prisma → build.
