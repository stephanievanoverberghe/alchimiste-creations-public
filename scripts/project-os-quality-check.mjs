import fs from "node:fs";

const dataDir = "data/project-os";
const standalonePlaybooks = readStandalonePlaybooks();

const lots = mergeItems(
  readJson("lots.json"),
  standalonePlaybooks.flatMap((playbook) => playbook.lots ?? []),
);
const phases = mergeItems(
  readJson("phases.json"),
  standalonePlaybooks.flatMap((playbook) => playbook.phases ?? []),
);
const tasks = mergeItems(
  readJson("tasks.json"),
  standalonePlaybooks.flatMap((playbook) => playbook.tasks ?? []),
);
const deliverables = mergeItems(
  readJson("deliverables.json"),
  standalonePlaybooks.flatMap((playbook) => playbook.deliverables ?? []),
);
const validations = mergeItems(
  readJson("validations.json"),
  standalonePlaybooks.flatMap((playbook) => playbook.validations ?? []),
);
const projectTypes = mergeItems(
  readJson("project-types.json"),
  standalonePlaybooks.map((playbook) => playbook.projectType).filter(Boolean),
);

const strictArg = process.argv.find((arg) => arg.startsWith("--strict="));
const strictIds = new Set(
  strictArg
    ? strictArg
        .replace("--strict=", "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [],
);

const lotById = mapById(lots);
const phaseById = mapById(phases);
const taskById = mapById(tasks);
const deliverableById = mapById(deliverables);
const validationById = mapById(validations);

let strictIssueCount = 0;

for (const projectType of projectTypes) {
  const issues = getProjectTypeIssues(projectType);

  if (issues.length === 0) {
    console.log(`OK ${projectType.id}`);
    continue;
  }

  console.log(`\n${projectType.id}`);
  for (const issue of issues) {
    console.log(`- ${issue}`);
  }

  if (strictIds.has(projectType.id)) {
    strictIssueCount += issues.length;
  }
}

if (strictIssueCount > 0) {
  console.error(`\nProject OS quality check failed with ${strictIssueCount} strict issue(s).`);
  process.exit(1);
}

function getProjectTypeIssues(projectType) {
  const issues = [];
  const includedPhaseIds = projectType.includedPhaseIds ?? [];
  const includedLotIds = projectType.includedLotIds ?? [];
  const taskIds = projectType.taskIds ?? [];
  const requiredDeliverableIds = projectType.requiredDeliverableIds ?? [];
  const optionalDeliverableIds = projectType.optionalDeliverableIds ?? [];
  const validationIds = projectType.validationIds ?? [];

  const includedPhases = includedPhaseIds.map((phaseId) => phaseById.get(phaseId)).filter(Boolean);
  const includedPhaseSet = new Set(includedPhaseIds);
  const usedLotSet = new Set(includedPhases.map((phase) => phase.lotId));

  for (const lotId of includedLotIds) {
    if (!lotById.has(lotId)) issues.push(`Lot inconnu: ${lotId}`);
    if (!usedLotSet.has(lotId)) issues.push(`Lot inclus sans phase active: ${lotId}`);
  }

  for (const phaseId of includedPhaseIds) {
    if (!phaseById.has(phaseId)) issues.push(`Phase inconnue: ${phaseId}`);
  }

  for (const taskId of taskIds) {
    const task = taskById.get(taskId);
    if (!task) {
      issues.push(`Tâche inconnue: ${taskId}`);
      continue;
    }

    if (!includedPhaseSet.has(task.phaseId)) {
      issues.push(`Tâche ${taskId} rattachée à une phase non incluse: ${task.phaseId}`);
    }
  }

  for (const deliverableId of requiredDeliverableIds) {
    const deliverable = deliverableById.get(deliverableId);
    if (!deliverable) {
      issues.push(`Livrable requis inconnu: ${deliverableId}`);
      continue;
    }

    if (!includedPhaseSet.has(deliverable.phaseId)) {
      issues.push(`Livrable requis ${deliverableId} rattaché à une phase non incluse: ${deliverable.phaseId}`);
    }
  }

  for (const deliverableId of optionalDeliverableIds) {
    const deliverable = deliverableById.get(deliverableId);
    if (!deliverable) {
      issues.push(`Livrable optionnel inconnu: ${deliverableId}`);
    }
  }

  for (const phase of includedPhases) {
    const phaseTaskCount = taskIds.filter((taskId) => taskById.get(taskId)?.phaseId === phase.id).length;
    const phaseDeliverableCount = [...requiredDeliverableIds, ...optionalDeliverableIds].filter(
      (deliverableId) => deliverableById.get(deliverableId)?.phaseId === phase.id,
    ).length;
    const phaseExitValidationCount = getExitValidationsForPhase(projectType, phase).length;

    if (phaseTaskCount === 0) {
      issues.push(`Phase active sans tâche: ${phase.id}`);
    }

    if (phaseDeliverableCount === 0 && phaseExitValidationCount === 0) {
      issues.push(`Phase active sans trace métier: ${phase.id}`);
    }
  }

  for (const validationId of validationIds) {
    const validation = validationById.get(validationId);
    if (!validation) {
      issues.push(`Validation inconnue: ${validationId}`);
      continue;
    }

    const includedUnblocks = (validation.unblocks ?? []).filter((phaseId) => includedPhaseSet.has(phaseId));
    if (includedUnblocks.length === 0) {
      issues.push(`Validation sans phase débloquée dans ce playbook: ${validationId}`);
    }
  }

  return issues;
}

function getExitValidationsForPhase(projectType, phase) {
  const orderedPhaseIds = [...(projectType.includedPhaseIds ?? [])].sort(
    (left, right) => (phaseById.get(left)?.order ?? 0) - (phaseById.get(right)?.order ?? 0),
  );
  const phaseIndex = orderedPhaseIds.indexOf(phase.id);

  return (projectType.validationIds ?? []).filter((validationId) => {
    const validation = validationById.get(validationId);
    const firstUnblockedIndex = (validation?.unblocks ?? [])
      .map((phaseId) => orderedPhaseIds.indexOf(phaseId))
      .filter((index) => index > -1)
      .sort((left, right) => left - right)[0];

    return firstUnblockedIndex === phaseIndex + 1;
  });
}

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(`${dataDir}/${fileName}`, "utf8"));
}

function readStandalonePlaybooks() {
  const playbookDir = `${dataDir}/playbooks`;

  if (!fs.existsSync(playbookDir)) return [];

  return fs
    .readdirSync(playbookDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const playbook = JSON.parse(
        fs.readFileSync(`${playbookDir}/${fileName}`, "utf8"),
      );

      if (playbook.kind !== "project-os-playbook") {
        throw new Error(`${playbookDir}/${fileName} must be a project-os-playbook.`);
      }

      if (!playbook.projectType?.id) {
        throw new Error(`${playbookDir}/${fileName} must include projectType.id.`);
      }

      return playbook;
    });
}

function mergeItems(baseItems, overrideItems) {
  const itemsById = new Map(baseItems.map((item) => [item.id, item]));

  for (const item of overrideItems) {
    itemsById.set(item.id, item);
  }

  return Array.from(itemsById.values());
}

function mapById(items) {
  return new Map(items.map((item) => [item.id, item]));
}
