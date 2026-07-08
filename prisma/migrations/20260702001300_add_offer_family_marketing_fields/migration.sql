ALTER TABLE "OfferFamily"
ADD COLUMN "badge" TEXT,
ADD COLUMN "eyebrow" TEXT,
ADD COLUMN "title" TEXT,
ADD COLUMN "publicHref" TEXT,
ADD COLUMN "imageSrc" TEXT,
ADD COLUMN "imageTablet" TEXT,
ADD COLUMN "imageDesktop" TEXT,
ADD COLUMN "imageAlt" TEXT;

UPDATE "OfferFamily"
SET
    "badge" = '01 — Créer',
    "name" = 'Créer',
    "eyebrow" = 'Partir d''une base claire',
    "title" = 'Créer un site depuis zéro.',
    "description" = 'Pour transformer une idée, une activité ou une offre en présence web claire, structurée et crédible.',
    "publicHref" = '/offres#creer',
    "imageSrc" = '/images/pages/offers/categories/create/cover-offres-mobile.png',
    "imageTablet" = '/images/pages/offers/categories/create/cover-tablet.png',
    "imageDesktop" = '/images/pages/offers/categories/create/cover-tablet.png',
    "imageAlt" = 'Interface web en création sur un écran'
WHERE "slug" = 'creer';

UPDATE "OfferFamily"
SET
    "badge" = '02 — Vendre',
    "name" = 'Vendre',
    "eyebrow" = 'Structurer une offre',
    "title" = 'Vendre ou transmettre en ligne.',
    "description" = 'Pour présenter une proposition, organiser un parcours et accompagner la décision en ligne.',
    "publicHref" = '/offres#vendre',
    "imageSrc" = '/images/pages/offers/categories/sell/cover-offres-mobile.png',
    "imageTablet" = '/images/pages/offers/categories/sell/cover-tablet.png',
    "imageDesktop" = '/images/pages/offers/categories/sell/cover-tablet.png',
    "imageAlt" = 'Interface de vente et présentation d''offre en ligne'
WHERE "slug" = 'vendre';

UPDATE "OfferFamily"
SET
    "badge" = '03 — Améliorer',
    "name" = 'Améliorer',
    "eyebrow" = 'Réparer ce qui bloque',
    "title" = 'Améliorer un site existant.',
    "description" = 'Pour retrouver de la clarté, corriger ce qui freine le parcours et remettre ton site au service du projet.',
    "publicHref" = '/offres#ameliorer',
    "imageSrc" = '/images/pages/offers/categories/improve/cover-offres-mobile.png',
    "imageTablet" = '/images/pages/offers/categories/improve/cover-tablet.png',
    "imageDesktop" = '/images/pages/offers/categories/improve/cover-tablet.png',
    "imageAlt" = 'Interface web en amélioration et optimisation'
WHERE "slug" = 'ameliorer';

UPDATE "OfferFamily"
SET
    "badge" = '04 — Sur mesure',
    "name" = 'Sur mesure',
    "eyebrow" = 'Adapter le cadre',
    "title" = 'Construire un accompagnement adapté.',
    "description" = 'Pour les projets qui sortent du cadre classique et demandent une approche plus fine.',
    "publicHref" = '/offres#sur-mesure',
    "imageSrc" = '/images/pages/offers/categories/custom/cover-offres-mobile.png',
    "imageTablet" = '/images/pages/offers/categories/custom/cover-tablet.png',
    "imageDesktop" = '/images/pages/offers/categories/custom/cover-tablet.png',
    "imageAlt" = 'Projet web sur mesure avec ambiance créative'
WHERE "slug" = 'sur-mesure';
