import { readFile, readdir } from "node:fs/promises";

import "dotenv/config";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const isDryRun = process.argv.includes("--dry-run");

const offerFamilies = [
    {
        slug: "creer",
        name: "Créer",
        badge: "01 — Créer",
        eyebrow: "Partir d'une base claire",
        title: "Créer un site depuis zéro.",
        description:
            "Pour transformer une idée, une activité ou une offre en présence web claire, structurée et crédible.",
        publicHref: "/offres#creer",
        imageSrc: "/images/pages/offers/categories/create/cover-offres-mobile.png",
        imageTablet: "/images/pages/offers/categories/create/cover-tablet.png",
        imageDesktop: "/images/pages/offers/categories/create/cover-tablet.png",
        imageAlt: "Interface web en création sur un écran",
        sortOrder: 10,
        isActive: true,
    },
    {
        slug: "vendre",
        name: "Vendre",
        badge: "02 — Vendre",
        eyebrow: "Structurer une offre",
        title: "Vendre ou transmettre en ligne.",
        description:
            "Pour présenter une proposition, organiser un parcours et accompagner la décision en ligne.",
        publicHref: "/offres#vendre",
        imageSrc: "/images/pages/offers/categories/sell/cover-offres-mobile.png",
        imageTablet: "/images/pages/offers/categories/sell/cover-tablet.png",
        imageDesktop: "/images/pages/offers/categories/sell/cover-tablet.png",
        imageAlt: "Interface de vente et présentation d'offre en ligne",
        sortOrder: 20,
        isActive: true,
    },
    {
        slug: "ameliorer",
        name: "Améliorer",
        badge: "03 — Améliorer",
        eyebrow: "Réparer ce qui bloque",
        title: "Améliorer un site existant.",
        description:
            "Pour retrouver de la clarté, corriger ce qui freine le parcours et remettre ton site au service du projet.",
        publicHref: "/offres#ameliorer",
        imageSrc: "/images/pages/offers/categories/improve/cover-offres-mobile.png",
        imageTablet: "/images/pages/offers/categories/improve/cover-tablet.png",
        imageDesktop: "/images/pages/offers/categories/improve/cover-tablet.png",
        imageAlt: "Interface web en amélioration et optimisation",
        sortOrder: 30,
        isActive: true,
    },
    {
        slug: "sur-mesure",
        name: "Sur mesure",
        badge: "04 — Sur mesure",
        eyebrow: "Adapter le cadre",
        title: "Construire un accompagnement adapté.",
        description:
            "Pour les projets qui sortent du cadre classique et demandent une approche plus fine.",
        publicHref: "/offres#sur-mesure",
        imageSrc: "/images/pages/offers/categories/custom/cover-offres-mobile.png",
        imageTablet: "/images/pages/offers/categories/custom/cover-tablet.png",
        imageDesktop: "/images/pages/offers/categories/custom/cover-tablet.png",
        imageAlt: "Projet web sur mesure avec ambiance créative",
        sortOrder: 40,
        isActive: true,
    },
];

const offers = [
    {
        slug: "site-vitrine",
        name: "Site vitrine",
        family: "creer",
        startingPriceCents: 200000,
        startingPriceLabel: "A partir de 2 000 EUR",
        publicHref: "/offres/site-vitrine",
        sortOrder: 10,
        isActive: true,
    },
    {
        slug: "one-page",
        name: "One-page",
        family: "creer",
        startingPriceCents: 90000,
        startingPriceLabel: "A partir de 900 EUR",
        publicHref: "/offres/one-page",
        sortOrder: 20,
        isActive: true,
    },
    {
        slug: "landing-page",
        name: "Landing page",
        family: "creer",
        startingPriceCents: 110000,
        startingPriceLabel: "A partir de 1 100 EUR",
        publicHref: "/offres/landing-page",
        sortOrder: 30,
        isActive: true,
    },
    {
        slug: "boutique-en-ligne",
        name: "Boutique en ligne",
        family: "vendre",
        startingPriceCents: 400000,
        startingPriceLabel: "A partir de 4 000 EUR",
        publicHref: "/offres/boutique-en-ligne",
        sortOrder: 40,
        isActive: true,
    },
    {
        slug: "formation-en-ligne",
        name: "Formation en ligne",
        family: "vendre",
        startingPriceCents: 450000,
        startingPriceLabel: "A partir de 4 500 EUR",
        publicHref: "/offres/formation-en-ligne",
        sortOrder: 50,
        isActive: true,
    },
    {
        slug: "diagnostic-web",
        name: "Diagnostic web",
        family: "ameliorer",
        startingPriceCents: 35000,
        startingPriceLabel: "A partir de 350 EUR",
        publicHref: "/offres/diagnostic-web",
        sortOrder: 60,
        isActive: true,
    },
    {
        slug: "refonte",
        name: "Refonte",
        family: "ameliorer",
        startingPriceCents: 250000,
        startingPriceLabel: "A partir de 2 500 EUR",
        publicHref: "/offres/refonte",
        sortOrder: 70,
        isActive: true,
    },
    {
        slug: "maintenance",
        name: "Maintenance",
        family: "ameliorer",
        startingPriceCents: 18000,
        startingPriceLabel: "A partir de 180 EUR / intervention",
        publicHref: "/offres/maintenance",
        sortOrder: 80,
        isActive: true,
    },
    {
        slug: "projet-sur-mesure",
        name: "Projet sur mesure",
        family: "sur-mesure",
        startingPriceCents: 550000,
        startingPriceLabel: "Sur devis, a partir de 5 500 EUR",
        publicHref: "/offres/projet-sur-mesure",
        sortOrder: 90,
        isActive: true,
    },
];

const portfolioProjects = [
    {
        slug: "norel-art",
        title: "Norel Art",
        shortDescription:
            "Un projet client e-commerce presente avec prudence : boutique-portfolio, univers artistique et parcours d'achat.",
        status: "Projet client reel, publie uniquement avec les elements autorises.",
        kind: "CLIENT",
        typeLabel: "Boutique en ligne",
        publicationStatus: "PUBLISHED",
        isFeatured: true,
        sortOrder: 10,
        coverImageUrl: "/images/pages/projects/norel-art/cover-mobile.png",
        heroImageUrl: "/images/pages/projects/norel-art/cover-mobile.png",
        imageAlt: "Couverture du projet Norel Art",
        contextTitle: "Un projet entre portfolio, boutique et experience de marque.",
        contextDescription:
            "Norel Art reunit plusieurs intentions : presenter une artiste, montrer des creations, permettre l'achat et preparer une base evolutive.",
        objectives: [
            "Creer une presence en ligne forte et coherente.",
            "Structurer l'univers artistique de Norel Art.",
            "Presenter les creations de maniere claire et esthetique.",
            "Creer une experience d'achat simple.",
        ],
        proofs: [
            "Cadrage d'un projet e-commerce creatif.",
            "Structuration d'un projet artistique.",
            "Mise en valeur d'un univers sensible.",
            "Preparation d'une base evolutive.",
        ],
        tags: [
            "Projet client",
            "E-commerce",
            "Portfolio artistique",
            "Direction artistique",
        ],
        highlights: [
            "Cadrage d'un projet e-commerce creatif.",
            "Structuration d'un projet artistique.",
            "Mise en valeur d'un univers sensible.",
        ],
        websiteUrl: "https://norel-art.vercel.app/",
        publicHref: "/realisations/norel-art",
        relatedOfferSlug: "boutique-en-ligne",
    },
    {
        slug: "rivage-photo",
        title: "Rivage Photo",
        shortDescription:
            "Un portfolio visuel pour valoriser les images, guider la navigation et donner envie de decouvrir l'univers du photographe.",
        status: "Demonstrateur personnel - preuve site vitrine visuel.",
        kind: "DEMO",
        typeLabel: "Site vitrine",
        publicationStatus: "PUBLISHED",
        isFeatured: true,
        sortOrder: 20,
        coverImageUrl: "/images/pages/projects/rivage-photo/cover-mobile.png",
        heroImageUrl: "/images/pages/projects/rivage-photo/cover-mobile.png",
        imageAlt: "Couverture de la demonstration personnelle Rivage Photo",
        contextTitle: "Un portfolio visuel demande de la retenue et de la structure.",
        contextDescription:
            "La navigation, les espacements, la hierarchie et les transitions doivent aider le visiteur a entrer dans l'univers visuel sans distraction.",
        objectives: [
            "Presenter l'univers du photographe.",
            "Mettre en valeur les images.",
            "Organiser les series ou galeries.",
            "Proposer une navigation fluide.",
        ],
        proofs: [
            "Creation d'un portfolio sensible.",
            "Structuration de contenus visuels.",
            "Mise en valeur d'un univers photographique.",
            "Experience de consultation mobile.",
        ],
        tags: [
            "Demonstrateur personnel",
            "Portfolio photographe",
            "Galerie visuelle",
            "Direction artistique",
        ],
        highlights: [
            "Creation d'un portfolio sensible.",
            "Structuration de contenus visuels.",
            "Mise en valeur d'un univers photographique.",
        ],
        websiteUrl: "https://rivage-photo.vercel.app/",
        publicHref: "/realisations/rivage-photo",
        relatedOfferSlug: "site-vitrine",
    },
    {
        slug: "mysteres-a-la-carte",
        title: "Mysteres a la carte",
        shortDescription:
            "Un parcours guide pour aider une personne a formuler une demande precise, etape par etape.",
        status: "Demonstrateur personnel - preuve UX et formulaire avance.",
        kind: "DEMO",
        typeLabel: "Landing page",
        publicationStatus: "PUBLISHED",
        isFeatured: true,
        sortOrder: 30,
        coverImageUrl: "/images/pages/projects/mysteres-a-la-carte/cover-mobile.png",
        heroImageUrl: "/images/pages/projects/mysteres-a-la-carte/cover-mobile.png",
        imageAlt: "Couverture de la demonstration personnelle Mysteres a la carte",
        contextTitle: "Une demande personnalisee demande plus qu'un simple formulaire.",
        contextDescription:
            "Lorsque la demande depend de choix, de preferences ou d'un contexte specifique, le parcours doit aider l'utilisateur a avancer etape par etape.",
        objectives: [
            "Presenter clairement le concept.",
            "Guider l'utilisateur vers la bonne action.",
            "Structurer la demande ou la reservation.",
            "Simplifier la collecte d'informations.",
        ],
        proofs: [
            "Structuration d'un parcours utilisateur.",
            "Conception d'un formulaire avance comprehensible.",
            "Demande rendue plus claire.",
            "Capacite a imaginer un projet plus avance qu'un site vitrine.",
        ],
        tags: [
            "Demonstrateur personnel",
            "Formulaire avance",
            "Parcours guide",
            "UX de demande",
        ],
        highlights: [
            "Structuration d'un parcours utilisateur.",
            "Conception d'un formulaire avance comprehensible.",
            "Demande rendue plus claire.",
        ],
        websiteUrl: "https://mysteres-a-la-carte.vercel.app/",
        publicHref: "/realisations/mysteres-a-la-carte",
        relatedOfferSlug: "landing-page",
    },
    {
        slug: "ancre-toi",
        title: "Ancre-toi",
        shortDescription:
            "Un demonstrateur en refonte autour d'une formation en ligne, d'un espace membre et d'un parcours apprenant a clarifier.",
        status: "Demonstrateur personnel en refonte.",
        kind: "REFONTE",
        typeLabel: "Formation en ligne",
        publicationStatus: "STANDBY",
        isFeatured: false,
        sortOrder: 40,
        coverImageUrl: "/images/pages/projects/ancre-toi/cover-mobile.png",
        heroImageUrl: "/images/pages/projects/ancre-toi/cover-mobile.png",
        imageAlt: "Couverture de la demonstration personnelle Ancre-toi",
        contextTitle: "Une formation en ligne en refonte demande une vraie structure.",
        contextDescription:
            "Le projet est conserve comme demonstrateur de formation en ligne, mais il est en reconstruction pour clarifier le parcours, les modules et l'espace membre.",
        objectives: [
            "Presenter la formation clairement.",
            "Expliquer le parcours propose.",
            "Donner acces a un espace membre.",
            "Organiser les modules de formation.",
        ],
        proofs: [
            "Architecture de formation en cours de refonte.",
            "Reflexion sur un parcours pedagogique.",
            "Organisation d'un espace membre.",
            "Experience apprenante a reconstruire.",
        ],
        tags: [
            "Demonstrateur personnel",
            "En refonte",
            "Formation en ligne",
            "Espace membre",
        ],
        highlights: [
            "Architecture de formation en cours de refonte.",
            "Reflexion sur un parcours pedagogique.",
            "Organisation d'un espace membre.",
        ],
        websiteUrl: null,
        publicHref: "/realisations/ancre-toi",
        relatedOfferSlug: "formation-en-ligne",
    },
    {
        slug: "explor-art",
        title: "Explor'Art",
        shortDescription:
            "Un projet editorial pour organiser des contenus, mettre en avant des videos et rendre la decouverte plus immersive.",
        status: "Demonstrateur personnel - preuve architecture editoriale.",
        kind: "DEMO",
        typeLabel: "Projet sur mesure",
        publicationStatus: "PUBLISHED",
        isFeatured: false,
        sortOrder: 50,
        coverImageUrl: "/images/pages/projects/explor-art/cover-mobile.png",
        heroImageUrl: "/images/pages/projects/explor-art/cover-mobile.png",
        imageAlt: "Couverture de la demonstration personnelle Explor'Art",
        contextTitle: "Un projet editorial demande une architecture claire.",
        contextDescription:
            "Un projet riche en contenus peut vite devenir confus si les articles, videos et categories ne sont pas organises des le depart.",
        objectives: [
            "Presenter le concept Explor'Art.",
            "Organiser les contenus editoriaux.",
            "Creer une structure de blog claire.",
            "Proposer une experience mobile lisible.",
        ],
        proofs: [
            "Creation d'une architecture editoriale.",
            "Organisation d'articles et de videos.",
            "Structuration d'un blog.",
            "Base administrable preparee.",
        ],
        tags: [
            "Demonstrateur personnel",
            "Blog video",
            "Architecture de contenus",
            "Experience de lecture",
        ],
        highlights: [
            "Creation d'une architecture editoriale.",
            "Organisation d'articles et de videos.",
            "Structuration d'un blog.",
        ],
        websiteUrl: "https://explorart-blog.vercel.app/",
        publicHref: "/realisations/explor-art",
        relatedOfferSlug: "projet-sur-mesure",
    },
];

const projectTypeFallbacks = [
    {
        slug: "unknown",
        projectOsId: null,
        name: "Je ne sais pas encore",
        templateId: null,
        publicLabel: "Je ne sais pas encore",
        recommendedArchitecture: null,
        sortOrder: 1000,
        isActive: true,
    },
];

const projectOsIdToPublicSlug = {
    site_vitrine: "site-vitrine",
    landing_page: "landing-page",
    one_page: "one-page",
    boutique_en_ligne: "boutique-en-ligne",
    formation_en_ligne: "formation-en-ligne",
    refonte: "refonte",
    diagnostic_web: "diagnostic-web",
    maintenance: "maintenance",
    projet_avance_saas: "projet-sur-mesure",
};

const projectTypeSortOrder = {
    "site-vitrine": 10,
    "one-page": 20,
    "landing-page": 30,
    "boutique-en-ligne": 40,
    "formation-en-ligne": 50,
    "diagnostic-web": 60,
    refonte: 70,
    maintenance: 80,
    "projet-sur-mesure": 90,
};

const projectTypePublicLabels = {
    "site-vitrine": "Site vitrine",
    "one-page": "One Page",
    "landing-page": "Landing Page",
    "boutique-en-ligne": "Boutique en ligne",
    "formation-en-ligne": "Formation en ligne",
    "diagnostic-web": "Diagnostic Web",
    refonte: "Refonte",
    maintenance: "Maintenance",
    "projet-sur-mesure": "Projet sur mesure",
};

const projectOsIdToPlaybookKey = {
    site_vitrine: "site-vitrine",
    landing_page: "landing-page",
    one_page: "one-page",
    boutique_en_ligne: "boutique-en-ligne",
    formation_en_ligne: "formation-en-ligne",
    refonte: "refonte",
    diagnostic_web: "diagnostic-web",
    maintenance: "maintenance",
    projet_avance_saas: "projet-avance",
};

const priorityPlaybookKeys = new Set([
    "diagnostic-web",
    "one-page",
    "landing-page",
    "site-vitrine",
    "refonte",
]);

async function main() {
    const projectTypes = await loadProjectTypes();
    const playbookSeedData = await loadPlaybookSeedData();
    const documentModels = await loadDocumentModels();

    if (isDryRun) {
        console.info(
            `Dry run: ${offerFamilies.length} CRM offer families, ${offers.length} CRM offers, ${projectTypes.length} CRM project types, ${playbookSeedData.length} playbooks (${playbookSeedData.reduce(
                (total, playbook) => total + (playbook.modules?.length ?? 0),
                0,
            )} optional modules) and ${documentModels.length} document models ready to seed.`,
        );
        return;
    }

    const prisma = createPrismaClient();

    try {
        await seedOfferFamilies(prisma);
        await seedOffers(prisma);
        await seedPortfolioProjects(prisma);
        await seedProjectTypes(prisma, projectTypes);
        await seedPlaybooks(prisma, playbookSeedData);
        await seedDocumentModels(prisma, documentModels);
    } finally {
        await prisma.$disconnect();
    }
}

async function loadDocumentModels() {
    const fileUrl = new URL(
        "../data/project-os/document-models.json",
        import.meta.url,
    );
    const content = await readFile(fileUrl, "utf8");
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
        throw new Error("data/project-os/document-models.json must be an array.");
    }

    return parsed;
}

async function seedDocumentModels(prisma, documentModels) {
    for (const model of documentModels) {
        await prisma.documentModel.upsert({
            where: { key: model.key },
            update: model,
            create: model,
        });
    }

    console.info(`Seeded ${documentModels.length} document models.`);
}

// Family classification (docs/project-os/15_systeme-documents.md):
// COMPOSED = official documents written in the app; IN_APP = workflows
// that are app features, not documents; FILE_LINK = raw files in Drive.
function resolveDocumentHandling(name) {
    const normalized = String(name ?? "").toLowerCase();

    if (
        /cadrage|proposition|cahier des charges|brief projet|sp[eé]cification|compte rendu|guide client|bilan|pv de recette|plan seo|note technique/.test(
            normalized,
        )
    ) {
        return "COMPOSED";
    }

    if (
        /checklist|questionnaire|e-?mail|relance|tableau|retours|fiche opportunit|fiche qualification|trace acompte|notes|script|trame|matrice|retex|passation commerciale/.test(
            normalized,
        )
    ) {
        return "IN_APP";
    }

    return "FILE_LINK";
}

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is required to seed CRM data.");
    }

    const adapter = new PrismaNeon({ connectionString });

    return new PrismaClient({ adapter });
}

async function seedOfferFamilies(prisma) {
    for (const family of offerFamilies) {
        await prisma.offerFamily.upsert({
            where: { slug: family.slug },
            update: family,
            create: family,
        });
    }

    console.info(`Seeded ${offerFamilies.length} CRM offer families.`);
}

async function seedOffers(prisma) {
    for (const offer of offers) {
        const family = offerFamilies.find((item) => item.slug === offer.family);
        const data = {
            ...offer,
            ...(family
                ? {
                      familyRecord: {
                          connect: { slug: family.slug },
                      },
                  }
                : {}),
        };

        await prisma.offer.upsert({
            where: { slug: offer.slug },
            update: data,
            create: data,
        });
    }

    console.info(`Seeded ${offers.length} CRM offers.`);
}

async function seedPortfolioProjects(prisma) {
    for (const project of portfolioProjects) {
        const { relatedOfferSlug, ...projectData } = project;
        const data = {
            ...projectData,
            relatedOffer: relatedOfferSlug
                ? {
                      connect: { slug: relatedOfferSlug },
                  }
                : undefined,
        };

        await prisma.portfolioProject.upsert({
            where: { slug: project.slug },
            update: data,
            create: data,
        });
    }

    console.info(`Seeded ${portfolioProjects.length} portfolio projects.`);
}

async function seedProjectTypes(prisma, projectTypes) {
    for (const projectType of projectTypes) {
        await prisma.projectType.upsert({
            where: { slug: projectType.slug },
            update: projectType,
            create: projectType,
        });
    }

    console.info(`Seeded ${projectTypes.length} CRM project types.`);
}

async function seedPlaybooks(prisma, playbooks) {
    for (const playbook of playbooks) {
        await prisma.$transaction(async (tx) => {
            const template = await tx.playbookTemplate.upsert({
                where: { key: playbook.template.key },
                update: playbook.template,
                create: playbook.template,
                select: { id: true },
            });

            await Promise.all([
                tx.playbookPhaseTemplate.deleteMany({
                    where: { playbookId: template.id },
                }),
                tx.playbookGateTemplate.deleteMany({
                    where: { playbookId: template.id },
                }),
                tx.playbookActionTemplate.deleteMany({
                    where: { playbookId: template.id },
                }),
                tx.playbookDeliverableTemplate.deleteMany({
                    where: { playbookId: template.id },
                }),
                tx.playbookDocumentTemplate.deleteMany({
                    where: { playbookId: template.id },
                }),
                tx.playbookModuleTemplate.deleteMany({
                    where: { playbookId: template.id },
                }),
            ]);

            await Promise.all([
                playbook.phases.length
                    ? tx.playbookPhaseTemplate.createMany({
                          data: playbook.phases.map((phase) => ({
                              ...phase,
                              playbookId: template.id,
                          })),
                      })
                    : Promise.resolve(),
                playbook.gates.length
                    ? tx.playbookGateTemplate.createMany({
                          data: playbook.gates.map((gate) => ({
                              ...gate,
                              playbookId: template.id,
                          })),
                      })
                    : Promise.resolve(),
                playbook.actions.length
                    ? tx.playbookActionTemplate.createMany({
                          data: playbook.actions.map((action) => ({
                              ...action,
                              playbookId: template.id,
                          })),
                      })
                    : Promise.resolve(),
                playbook.deliverables.length
                    ? tx.playbookDeliverableTemplate.createMany({
                          data: playbook.deliverables.map((deliverable) => ({
                              ...deliverable,
                              playbookId: template.id,
                          })),
                      })
                    : Promise.resolve(),
                playbook.documents.length
                    ? tx.playbookDocumentTemplate.createMany({
                          data: playbook.documents.map((document) => ({
                              ...document,
                              playbookId: template.id,
                          })),
                      })
                    : Promise.resolve(),
                (playbook.modules ?? []).length
                    ? tx.playbookModuleTemplate.createMany({
                          data: playbook.modules.map((moduleTemplate) => ({
                              ...moduleTemplate,
                              playbookId: template.id,
                          })),
                      })
                    : Promise.resolve(),
            ]);
        });
    }

    console.info(`Seeded ${playbooks.length} playbooks.`);
}

async function loadProjectTypes() {
    const projectOsTypes = await readProjectOsTypes();
    const projectTypesBySlug = new Map();

    for (const projectOsType of projectOsTypes) {
        const slug = projectOsIdToPublicSlug[projectOsType.id];

        if (!slug) continue;

        projectTypesBySlug.set(slug, {
            slug,
            projectOsId: projectOsType.id,
            name: projectOsType.name,
            templateId: projectOsType.templateId ?? null,
            publicLabel: projectTypePublicLabels[slug] ?? projectOsType.name,
            recommendedArchitecture:
                projectOsType.recommendedArchitectureId ?? null,
            sortOrder: projectTypeSortOrder[slug] ?? 500,
            isActive: true,
        });
    }

    for (const fallback of projectTypeFallbacks) {
        if (!projectTypesBySlug.has(fallback.slug)) {
            projectTypesBySlug.set(fallback.slug, fallback);
        }
    }

    return Array.from(projectTypesBySlug.values()).sort(
        (left, right) => left.sortOrder - right.sortOrder,
    );
}

async function readProjectOsTypes() {
    const [projectOsTypes, standalonePlaybooks] = await Promise.all([
        readProjectOsJson("project-types.json"),
        readStandaloneProjectOsPlaybooks(),
    ]);

    return mergeProjectTypesWithStandalonePlaybooks(
        projectOsTypes,
        standalonePlaybooks,
    );
}

async function readProjectOsJson(fileName) {
    const fileUrl = new URL(`../data/project-os/${fileName}`, import.meta.url);
    const content = await readFile(fileUrl, "utf8");
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
        throw new Error(`data/project-os/${fileName} must be an array.`);
    }

    return parsed;
}

async function readStandaloneProjectOsPlaybooks() {
    const directoryUrl = new URL(
        "../data/project-os/playbooks/",
        import.meta.url,
    );

    let fileNames = [];

    try {
        fileNames = await readdir(directoryUrl);
    } catch (error) {
        if (error?.code === "ENOENT") return [];

        throw error;
    }

    const playbooks = await Promise.all(
        fileNames
            .filter((fileName) => fileName.endsWith(".json"))
            .map(async (fileName) => {
                const fileUrl = new URL(
                    `../data/project-os/playbooks/${fileName}`,
                    import.meta.url,
                );
                const content = await readFile(fileUrl, "utf8");
                const parsed = JSON.parse(content);

                if (parsed.kind !== "project-os-playbook") {
                    throw new Error(
                        `data/project-os/playbooks/${fileName} must be a project-os-playbook.`,
                    );
                }

                if (!parsed.projectType?.id) {
                    throw new Error(
                        `data/project-os/playbooks/${fileName} must include projectType.id.`,
                    );
                }

                return parsed;
            }),
    );

    return playbooks;
}

async function readStandaloneRequestOsPlaybooks() {
    const directoryUrl = new URL(
        "../data/request-os/playbooks/",
        import.meta.url,
    );

    let fileNames = [];

    try {
        fileNames = await readdir(directoryUrl);
    } catch (error) {
        if (error?.code === "ENOENT") return [];

        throw error;
    }

    const playbooks = await Promise.all(
        fileNames
            .filter((fileName) => fileName.endsWith(".json"))
            .map(async (fileName) => {
                const fileUrl = new URL(
                    `../data/request-os/playbooks/${fileName}`,
                    import.meta.url,
                );
                const content = await readFile(fileUrl, "utf8");
                const parsed = JSON.parse(content);

                if (parsed.kind !== "request-os-playbook") {
                    throw new Error(
                        `data/request-os/playbooks/${fileName} must be a request-os-playbook.`,
                    );
                }

                if (!parsed.id) {
                    throw new Error(
                        `data/request-os/playbooks/${fileName} must include id.`,
                    );
                }

                return parsed;
            }),
    );

    return playbooks;
}

function mergeProjectTypesWithStandalonePlaybooks(
    projectOsTypes,
    standalonePlaybooks,
) {
    const projectTypesById = new Map(
        projectOsTypes.map((projectOsType) => [projectOsType.id, projectOsType]),
    );

    for (const playbook of standalonePlaybooks) {
        projectTypesById.set(playbook.projectType.id, playbook.projectType);
    }

    return Array.from(projectTypesById.values());
}

async function loadPlaybookSeedData() {
    const [
        projectOsTypes,
        lots,
        phases,
        deliverables,
        tasks,
        validations,
        documentTemplates,
        standalonePlaybooks,
        requestOsPlaybooks,
    ] = await Promise.all([
        readProjectOsTypes(),
        readProjectOsJson("lots.json"),
        readProjectOsJson("phases.json"),
        readProjectOsJson("deliverables.json"),
        readProjectOsJson("tasks.json"),
        readProjectOsJson("validations.json"),
        readProjectOsJson("document-templates.json"),
        readStandaloneProjectOsPlaybooks(),
        readStandaloneRequestOsPlaybooks(),
    ]);

    const lotsById = indexById(lots);
    const phasesById = indexById(phases);
    const deliverablesById = indexById(deliverables);
    const tasksById = indexById(tasks);
    const validationsById = indexById(validations);
    const documentTemplatesById = indexById(documentTemplates);
    const standalonePlaybooksByProjectOsId = new Map(
        standalonePlaybooks.map((playbook) => [playbook.projectType.id, playbook]),
    );

    const projectOsPlaybookSeedData = projectOsTypes
        .map((projectOsType) => {
            const key = projectOsIdToPlaybookKey[projectOsType.id];

            if (!key) return null;

            const standalonePlaybook = standalonePlaybooksByProjectOsId.get(
                projectOsType.id,
            );
            const sourceProjectOsType =
                standalonePlaybook?.projectType ?? projectOsType;
            const sourceLotsById = standalonePlaybook
                ? indexById(standalonePlaybook.lots ?? [])
                : lotsById;
            const sourcePhasesById = standalonePlaybook
                ? indexById(standalonePlaybook.phases ?? [])
                : phasesById;
            const sourceDeliverablesById = standalonePlaybook
                ? indexById(standalonePlaybook.deliverables ?? [])
                : deliverablesById;
            const sourceTasksById = standalonePlaybook
                ? indexById(standalonePlaybook.tasks ?? [])
                : tasksById;
            const sourceValidationsById = standalonePlaybook
                ? indexById(standalonePlaybook.validations ?? [])
                : validationsById;
            const sourceDocumentTemplates = standalonePlaybook
                ? (standalonePlaybook.documentTemplates ?? [])
                : documentTemplates;
            const sourceDocumentTemplatesById = standalonePlaybook
                ? indexById(standalonePlaybook.documentTemplates ?? [])
                : documentTemplatesById;
            const priority =
                standalonePlaybook?.priority ??
                (priorityPlaybookKeys.has(key) ? "PRIORITY" : "PARKING");

            // Optional lots live in the shared referential, not in the
            // standalone playbook files: resolve modules from shared data.
            const moduleData = mapModuleTemplates(sourceProjectOsType, {
                deliverablesById,
                lotsById,
                phasesById,
                tasksById,
                validationsById,
            });

            return {
                template: {
                    key,
                    name: sourceProjectOsType.name,
                    sourceProjectOsId: sourceProjectOsType.id,
                    sourceTemplateId: sourceProjectOsType.templateId ?? null,
                    status: "ACTIVE",
                    priority,
                    description: sourceProjectOsType.objective ?? null,
                    sortOrder:
                        projectTypeSortOrder[
                            projectOsIdToPublicSlug[sourceProjectOsType.id]
                        ] ?? 500,
                    sourceSnapshot: standalonePlaybook ?? sourceProjectOsType,
                },
                phases: dedupeByKey([
                    ...mapPhaseTemplates(
                        sourceProjectOsType,
                        sourcePhasesById,
                        sourceLotsById,
                    ),
                    ...moduleData.phases,
                ]),
                gates: dedupeByKey([
                    ...mapGateTemplates(sourceProjectOsType, sourceValidationsById),
                    ...moduleData.gates,
                ]),
                actions: dedupeByKey([
                    ...mapActionTemplates(sourceProjectOsType, sourceTasksById),
                    ...moduleData.actions,
                ]),
                deliverables: dedupeByKey([
                    ...mapDeliverableTemplates(
                        sourceProjectOsType,
                        sourceDeliverablesById,
                    ),
                    ...moduleData.deliverables,
                ]),
                documents: mapDocumentTemplates(
                    sourceProjectOsType,
                    sourceDocumentTemplates,
                    sourceDocumentTemplatesById,
                ),
                modules: moduleData.modules,
            };
        })
        .filter(Boolean)
        .sort((left, right) => left.template.sortOrder - right.template.sortOrder);

    return [
        ...requestOsPlaybooks.map(mapRequestOsPlaybookToSeedData),
        ...projectOsPlaybookSeedData,
    ].sort((left, right) => left.template.sortOrder - right.template.sortOrder);
}

function mapModuleTemplates(
    projectOsType,
    { deliverablesById, lotsById, phasesById, tasksById, validationsById },
) {
    const modules = [];
    const phases = [];
    const gates = [];
    const actions = [];
    const deliverables = [];

    (projectOsType.optionalLotIds ?? []).forEach((lotId, moduleIndex) => {
        const lot = lotsById.get(lotId);

        if (!lot) {
            // The playbook references an optional lot that has no shared
            // definition yet: seed an empty module shell so the option is
            // not silently lost (content to author in /admin/playbooks).
            console.warn(
                `Playbook ${projectOsType.id}: optional lot "${lotId}" has no shared definition, seeding empty module shell.`,
            );

            modules.push({
                key: lotId,
                name: humanizeLotId(lotId),
                description: null,
                isDefault: false,
                sortOrder: moduleIndex + 1,
                sourceSnapshot: { missingSharedLot: true, optionalLotId: lotId },
            });

            return;
        }

        // Keep module content sorted after the core playbook content.
        const baseSortOrder = 100 + moduleIndex * 20;

        modules.push({
            key: lot.id,
            name: lot.name,
            description: toNullableText(lot.objective),
            isDefault: false,
            sortOrder: moduleIndex + 1,
            sourceSnapshot: lot,
        });

        (lot.defaultPhaseIds ?? []).forEach((phaseId, index) => {
            const phase = phasesById.get(phaseId);

            if (!phase) return;

            phases.push({
                key: phase.id,
                name: phase.name,
                description: toNullableText(phase.definitionOfDone),
                sourceLotKey: lot.id,
                moduleKey: lot.id,
                sortOrder: baseSortOrder + index + 1,
                sourceSnapshot: phase,
            });
        });

        (lot.defaultDeliverableIds ?? []).forEach((deliverableId, index) => {
            const deliverable = deliverablesById.get(deliverableId);

            if (!deliverable) return;

            deliverables.push({
                key: deliverable.id,
                name: deliverable.name,
                description: deliverable.description ?? null,
                category: deliverable.category ?? null,
                sourcePhaseKey: deliverable.phaseId ?? null,
                documentTemplateKey: deliverable.documentTemplateId ?? null,
                isRequired: false,
                isClientVisible: deliverable.visibility === "client",
                moduleKey: lot.id,
                sortOrder: baseSortOrder + index + 1,
                sourceSnapshot: deliverable,
            });
        });

        (lot.defaultTaskIds ?? []).forEach((taskId, index) => {
            const task = tasksById.get(taskId);

            if (!task) return;

            actions.push({
                key: task.id,
                title: task.name,
                description: task.description ?? null,
                sourcePhaseKey: task.phaseId ?? null,
                ownerRole: task.type ?? null,
                isBlocking: task.blocking ?? false,
                moduleKey: lot.id,
                sortOrder: baseSortOrder + index + 1,
                sourceSnapshot: task,
            });
        });

        (lot.defaultValidationIds ?? []).forEach((validationId, index) => {
            const validation = validationsById.get(validationId);

            if (!validation) return;

            gates.push({
                key: validation.id,
                name: validation.name,
                type: validation.type ?? null,
                objectType: validation.objectType ?? null,
                required: validation.required ?? true,
                unblocks: validation.unblocks ?? [],
                proofRequired: validation.proofRequired ?? false,
                moduleKey: lot.id,
                sortOrder: baseSortOrder + index + 1,
                sourceSnapshot: validation,
            });
        });
    });

    return { actions, deliverables, gates, modules, phases };
}

function humanizeLotId(lotId) {
    const label = lotId.replace(/^lot_/, "").replaceAll("_", " ");

    return label.charAt(0).toUpperCase() + label.slice(1);
}

function dedupeByKey(items) {
    const seen = new Set();

    return items.filter((item) => {
        if (seen.has(item.key)) return false;

        seen.add(item.key);

        return true;
    });
}

function mapRequestOsPlaybookToSeedData(playbook) {
    return {
        template: {
            key: playbook.slug ?? playbook.id,
            name: playbook.name,
            sourceProjectOsId: null,
            sourceTemplateId: playbook.sourceTemplateId ?? `request-os-${playbook.id}`,
            status: playbook.status ?? "ACTIVE",
            priority: playbook.priority ?? "PRIORITY",
            description: playbook.objective ?? null,
            sortOrder: 0,
            sourceSnapshot: playbook,
        },
        phases: (playbook.steps ?? []).map((step, index) => ({
            key: step.id,
            name: step.name,
            description: step.objective ?? null,
            sourceLotKey: step.groupId ?? null,
            sortOrder: step.order ?? index + 1,
            sourceSnapshot: step,
        })),
        gates: (playbook.gates ?? []).map((gate, index) => ({
            key: gate.id,
            name: gate.name,
            type: gate.type ?? "request-os",
            objectType: gate.objectType ?? "opportunity",
            required: gate.required ?? true,
            unblocks: gate.unblocks ?? [],
            proofRequired: gate.proofRequired ?? false,
            sortOrder: index + 1,
            sourceSnapshot: gate,
        })),
        actions: (playbook.tasks ?? []).map((task, index) => ({
            key: task.id,
            title: task.title,
            description: task.description ?? null,
            sourcePhaseKey: task.stepId ?? null,
            ownerRole: task.ownerRole ?? "admin",
            isBlocking: task.isBlocking ?? false,
            sortOrder: task.sortOrder ?? index + 1,
            sourceSnapshot: task,
        })),
        deliverables: (playbook.outputs ?? []).map((output, index) => ({
            key: output.id,
            name: output.name,
            description: output.description ?? null,
            category: output.category ?? "commercial",
            sourcePhaseKey: output.stepId ?? null,
            documentTemplateKey: null,
            isRequired: output.isRequired ?? true,
            isClientVisible: output.isClientVisible ?? false,
            sortOrder: index + 1,
            sourceSnapshot: output,
        })),
        documents: (playbook.documents ?? []).map((document, index) => ({
            key: document.id,
            name: document.name,
            category: document.category ?? "commercial",
            usage: document.usage ?? document.description ?? null,
            recommendedFormat: document.recommendedFormat ?? null,
            recommendedDrivePath: document.recommendedDrivePath ?? null,
            visibility: document.visibility ?? "admin",
            status: document.status ?? null,
            sourcePhaseKey: document.stepId ?? null,
            producesDeliverableKey: null,
            handling: resolveDocumentHandling(document.name),
            sortOrder: index + 1,
            sourceSnapshot: document,
        })),
    };
}

function mapPhaseTemplates(projectOsType, phasesById, lotsById) {
    return (projectOsType.includedPhaseIds ?? [])
        .map((phaseId, index) => {
            const phase = phasesById.get(phaseId);

            if (!phase) return null;

            const lot = phase.lotId ? lotsById.get(phase.lotId) : null;

            return {
                key: phase.id,
                name: phase.name,
                description: toNullableText(phase.definitionOfDone),
                sourceLotKey: lot?.id ?? phase.lotId ?? null,
                sortOrder: phase.order ?? index + 1,
                sourceSnapshot: phase,
            };
        })
        .filter(Boolean);
}

function toNullableText(value) {
    if (Array.isArray(value)) {
        return value.join(" ");
    }

    if (typeof value === "string") {
        return value;
    }

    return null;
}

function mapGateTemplates(projectOsType, validationsById) {
    return (projectOsType.validationIds ?? [])
        .map((validationId, index) => {
            const validation = validationsById.get(validationId);

            if (!validation) return null;

            return {
                key: validation.id,
                name: validation.name,
                type: validation.type ?? null,
                objectType: validation.objectType ?? null,
                required: validation.required ?? true,
                unblocks: validation.unblocks ?? [],
                proofRequired: validation.proofRequired ?? false,
                sortOrder: index + 1,
                sourceSnapshot: validation,
            };
        })
        .filter(Boolean);
}

function mapActionTemplates(projectOsType, tasksById) {
    return (projectOsType.taskIds ?? [])
        .map((taskId, index) => {
            const task = tasksById.get(taskId);

            if (!task) return null;

            return {
                key: task.id,
                title: task.name,
                description: task.description ?? null,
                sourcePhaseKey: task.phaseId ?? null,
                ownerRole: task.type ?? null,
                isBlocking: task.blocking ?? false,
                sortOrder: index + 1,
                sourceSnapshot: task,
            };
        })
        .filter(Boolean);
}

function mapDeliverableTemplates(projectOsType, deliverablesById) {
    return (projectOsType.requiredDeliverableIds ?? [])
        .map((deliverableId, index) => {
            const deliverable = deliverablesById.get(deliverableId);

            if (!deliverable) return null;

            return {
                key: deliverable.id,
                name: deliverable.name,
                description: deliverable.description ?? null,
                category: deliverable.category ?? null,
                sourcePhaseKey: deliverable.phaseId ?? null,
                documentTemplateKey: deliverable.documentTemplateId ?? null,
                isRequired: deliverable.required ?? true,
                isClientVisible: deliverable.visibility === "client",
                sortOrder: index + 1,
                sourceSnapshot: deliverable,
            };
        })
        .filter(Boolean);
}

function mapDocumentTemplates(
    projectOsType,
    documentTemplates,
    documentTemplatesById,
) {
    const explicitIds = projectOsType.documentTemplateIds ?? [];
    const selected = explicitIds.length
        ? explicitIds.map((id) => documentTemplatesById.get(id)).filter(Boolean)
        : documentTemplates.filter((documentTemplate) => {
              const projectTypeIds = documentTemplate.projectTypeIds ?? [];

              return (
                  projectTypeIds.includes("all") ||
                  projectTypeIds.includes(projectOsType.id)
              );
          });

    return selected.map((documentTemplate, index) => ({
        key: documentTemplate.id,
        name: documentTemplate.name,
        category: documentTemplate.category ?? null,
        usage: documentTemplate.usage ?? null,
        recommendedFormat: documentTemplate.recommendedFormat ?? null,
        recommendedDrivePath: documentTemplate.recommendedDrivePath ?? null,
        visibility: documentTemplate.visibility ?? null,
        status: documentTemplate.status ?? null,
        sourcePhaseKey: documentTemplate.phaseId ?? null,
        producesDeliverableKey: documentTemplate.producesDeliverableId ?? null,
        handling: resolveDocumentHandling(documentTemplate.name),
        sortOrder: index + 1,
        sourceSnapshot: documentTemplate,
    }));
}

function indexById(items) {
    return new Map(items.map((item) => [item.id, item]));
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
