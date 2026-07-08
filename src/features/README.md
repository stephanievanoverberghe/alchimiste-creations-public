# src/features

Écrans par domaine : orchestrateurs de page et sections de présentation.

## Architecture cible (règles d'or, phase 6)

```txt
src/app/<groupe>/<route>/page.tsx     → MINCE (~50 lignes max) : metadata, auth,
                                        chargement des données, rendu <XPage data={…}/>
src/features/<domaine>/
  <X>Page.tsx                         → ORCHESTRATEUR : compose les sections, zéro logique métier
  sections/<Section>.tsx              → une section = un fichier, props sérialisables, présentation pure
  components/<Piece>.tsx              → pièces propres au domaine (réutilisées entre ses sections)
```

Modèle de référence : `src/features/projects/cockpit/` (découpage du sprint F4).

## Règles

- Une section = un fichier ; l'orchestrateur ne fait que composer et distribuer les props.
- Un composant utilisé 2 fois monte de couche : `sections/` → `features/<domaine>/components/` → `src/components` s'il sert 2 domaines.
- **Jamais de formatter ni de mapping de statut local** : dates et montants via
  `src/lib/formatters`, statuts → libellés/tons via `src/lib/status-labels`
  (audience admin ou client explicite). Une copie locale est une régression.
- Les textes éditoriaux du public et de l'espace client vivent dans `src/content`.
- Les données descendent (props sérialisables), les actions remontent (server
  actions) — jamais de client Prisma dans une feature.
- JSDoc en français sur toute fonction exportée ; pas de commentaires de narration.
- Les features n'exposent pas de fichiers de route.
