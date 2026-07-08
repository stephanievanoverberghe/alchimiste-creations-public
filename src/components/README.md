# src/components

UI transverse uniquement — les seuls composants stylés « from scratch ».

## Contenu

- `ui/` : primitifs (Button, Badge, StatusBadge), formulaires, cartes
  (DataCard…), feedback (EmptyState, Toast…), produit (PhaseStepper,
  ActionRequiredCard, NextActionCard, ActivityFeed…), overlays, navigation.
- `layout/` : blocs de mise en page (Container, Section, PublicHero…) et
  shell (Header, Footer, PageHeader).

La référence visuelle vivante est `/admin/design` : chaque composant transverse
y est exposé avec ses états. Toute évolution visuelle se juge là, avec les
tokens de `src/styles/tokens/` exclusivement (aucune valeur en dur).

## Règles

- Ici ne vivent que des composants réutilisés par au moins deux domaines ;
  une pièce propre à un domaine reste dans `src/features/<domaine>/components`.
- Présentation pure : props sérialisables, libellés déjà traduits par
  l'appelant (`src/lib/status-labels`), horodatages déjà formatés
  (`src/lib/formatters`).
- États complets exigés (hover, focus-visible, active, disabled) et motion
  sur les tokens (`--motion-duration-*`, `ease-standard`), avec repli
  `prefers-reduced-motion`.
- Pas de sections de page, pas d'écrans CRM, pas de services serveur, pas de
  contenu statique.
