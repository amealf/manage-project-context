import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillDirectory = path.dirname(scriptDirectory);
const assetRoot = path.join(skillDirectory, "assets", "project-management");
const supportedModules = new Set(["frontend", "backend", "research", "data", "deployment", "security"]);
const supportedFeatures = new Set(["process-flow", "experiment-log", "artifact-registry"]);
const moduleReadingRules = {
  frontend: {
    path: "05_domains\\frontend\\FRONTEND_REQUIREMENTS.en.md",
    en: "before changing a maintained user interface, interaction, accessibility behavior, or visual system",
    zh: "修改项目维护的用户界面、交互、无障碍行为或视觉系统前",
  },
  backend: {
    path: "05_domains\\backend\\BACKEND_REQUIREMENTS.en.md",
    en: "before changing server, API, service-boundary, or runtime behavior",
    zh: "修改服务端、API、服务边界或运行行为前",
  },
  research: {
    path: "05_domains\\research\\RESEARCH_CONSTRAINTS.en.md",
    en: "before changing methods, running experiments, or interpreting results",
    zh: "修改研究方法、运行实验或解释结果前",
  },
  data: {
    path: "05_domains\\data\\DATA_REQUIREMENTS.en.md",
    en: "before changing schemas, migrations, pipelines, lineage, or data contracts",
    zh: "修改数据结构、迁移、管线、血缘或数据契约前",
  },
  deployment: {
    path: "05_domains\\deployment\\DEPLOYMENT_REQUIREMENTS.en.md",
    en: "before changing environments, releases, infrastructure, or operational rollout",
    zh: "修改环境、发布、基础设施或上线流程前",
  },
  security: {
    path: "05_domains\\security\\SECURITY_REQUIREMENTS.en.md",
    en: "before changing identity, permissions, secrets, privacy, threat, or compliance behavior",
    zh: "修改身份、权限、密钥、隐私、威胁或合规行为前",
  },
};
const featureReadingRules = {
  "process-flow": {
    path: "02_current_state\\IMPLEMENTATION_FLOW.en.md",
    en: "when ordered stages, timing, validation gates, handoffs, or recovery boundaries matter",
    zh: "任务涉及阶段顺序、时序、验证关卡、交接或恢复边界时",
  },
  "experiment-log": {
    path: "05_domains\\research\\EXPERIMENT_LOG.en.md",
    en: "before planning, running, interpreting, or handing off a material experiment",
    zh: "规划、运行、解释或交接重要实验前",
  },
  "artifact-registry": {
    path: "09_evidence\\ARTIFACTS.en.md",
    en: "before adding, replacing, reclassifying, archiving, restoring, or relying on a retained artifact",
    zh: "新增、替换、重新分类、归档、恢复或依赖保留产物前",
  },
};
const documentMetadataByPair = {
  "agent-rules": { readWhen: ["every-project-task"], updateWhen: ["operating-rules-or-reading-map-change"] },
  start: { readWhen: ["every-project-task"], updateWhen: ["evidence-order-reading-map-or-maintenance-protocol-change"] },
  goal: { readWhen: ["scope-plan-or-direction-change"], updateWhen: ["durable-objective-or-success-criteria-change"] },
  constraints: { readWhen: ["scope-plan-or-rule-change"], updateWhen: ["durable-constraint-change"] },
  source: { readWhen: ["deliverable-behavior-or-authority-change"], updateWhen: ["authoritative-path-entry-configuration-or-artifact-change"] },
  version: { readWhen: ["deliverable-behavior-or-authority-change"], updateWhen: ["deliverable-behavior-structure-interface-dependency-or-procedure-change"] },
  architecture: { readWhen: ["code-structure-flow-dependency-dataflow-or-interface-change"], updateWhen: ["code-architecture-change"] },
  "implementation-flow": { readWhen: ["ordered-process-or-handoff-change"], updateWhen: ["stage-timing-gate-handoff-or-recovery-change"] },
  tasks: { readWhen: ["scope-plan-implementation-or-handoff-work"], updateWhen: ["task-status-scope-blocker-or-handoff-change"] },
  "work-progress": { readWhen: ["scope-plan-implementation-validation-or-handoff-work"], updateWhen: ["material-non-experiment-work-completes-or-changes"] },
  "experiment-log": { readWhen: ["experiment-plan-run-interpretation-or-handoff"], updateWhen: ["experiment-completes-or-changes-materially"] },
  decisions: { readWhen: ["durable-choice-or-reversal-matters"], updateWhen: ["durable-choice-accepted-retired-or-reversed"] },
  "change-reasons": { readWhen: ["material-behavior-change-or-scope-correction"], updateWhen: ["behavior-change-needs-auditable-rationale"] },
  history: { readWhen: ["explicit-history-inspection-or-restoration"], updateWhen: ["event-changes-historical-interpretation"] },
  future: { readWhen: ["new-direction-proposal"], updateWhen: ["future-direction-appears-changes-activates-or-retires"] },
  references: { readWhen: ["retained-reference-use"], updateWhen: ["reference-provenance-relevance-or-status-change"] },
  artifacts: { readWhen: ["retained-artifact-use-or-reclassification"], updateWhen: ["artifact-governance-or-interpretation-boundary-change"] },
  archive: { readWhen: ["explicit-archive-inspection-restoration-or-transition"], updateWhen: ["archive-structure-status-retention-or-restoration-change"] },
};
const ignoredInventoryDirectories = new Set([
  ".git",
  ".hg",
  ".svn",
  ".venv",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "project_management",
]);

function printHelp() {
  console.log(`Usage:
  node init_project_management.mjs --project <absolute-path> --mode existing|new [options]

Options:
  --project-name <name>
  --goal-en <text>
  --goal-zh <text>
  --chinese | --no-chinese
  --date YYYY-MM-DD
  --management-dir <relative-path>
  --include <module[,module]>
  --include-feature <feature[,feature]>
  --dry-run
  --help`);
}

function parseArguments(values) {
  const options = {
    project: "",
    mode: "",
    projectName: "",
    goalEn: "Confirm the durable project goal with the user.",
    goalZh: "请与用户确认长期项目目标。",
    goalZhProvided: false,
    chinese: null,
    date: new Date().toISOString().slice(0, 10),
    managementDirectory: "project_management",
    modules: [],
    features: [],
    dryRun: false,
    help: false,
  };

  const valueOptions = new Map([
    ["--project", "project"],
    ["--mode", "mode"],
    ["--project-name", "projectName"],
    ["--goal-en", "goalEn"],
    ["--goal-zh", "goalZh"],
    ["--date", "date"],
    ["--management-dir", "managementDirectory"],
  ]);

  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }
    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (token === "--chinese" || token === "--include-chinese") {
      options.chinese = true;
      continue;
    }
    if (token === "--no-chinese" || token === "--english-only") {
      options.chinese = false;
      continue;
    }
    if (token === "--include") {
      const value = values[index + 1];
      if (!value || value.startsWith("--")) throw new Error("--include requires a module name.");
      options.modules.push(...value.split(",").map((item) => item.trim()).filter(Boolean));
      index += 1;
      continue;
    }
    if (token === "--include-feature") {
      const value = values[index + 1];
      if (!value || value.startsWith("--")) throw new Error("--include-feature requires a feature name.");
      options.features.push(...value.split(",").map((item) => item.trim()).filter(Boolean));
      index += 1;
      continue;
    }
    const key = valueOptions.get(token);
    if (!key) throw new Error(`Unknown argument: ${token}`);
    const value = values[index + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`${token} requires a value.`);
    options[key] = value;
    if (token === "--goal-zh") options.goalZhProvided = true;
    index += 1;
  }

  options.modules = [...new Set(options.modules.map((item) => item.toLowerCase()))].sort();
  options.features = [...new Set(options.features.map((item) => item.toLowerCase()))].sort();
  return options;
}

function normalizeInline(value, label) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (!normalized) throw new Error(`${label} cannot be empty.`);
  return normalized;
}

function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("--date must use YYYY-MM-DD.");
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error("--date is not a valid calendar date.");
  }
}

function validateManagementDirectory(value) {
  if (!value || path.isAbsolute(value)) throw new Error("--management-dir must be a relative path.");
  const normalized = path.normalize(value);
  const parts = normalized.split(/[\\/]+/);
  if (normalized === "." || parts.some((part) => part === ".." || part === "")) {
    throw new Error("--management-dir must stay inside the project root.");
  }
  return normalized;
}

async function getPathType(target) {
  try {
    const stat = await fs.stat(target);
    if (stat.isFile()) return "file";
    if (stat.isDirectory()) return "directory";
    return "other";
  } catch (error) {
    if (error.code === "ENOENT") return "missing";
    throw error;
  }
}

async function prepareProjectRoot(options) {
  const type = await getPathType(options.project);
  if (options.mode === "existing") {
    if (type !== "directory") throw new Error("Existing mode requires an existing project directory.");
    return;
  }
  if (options.mode !== "new") throw new Error("--mode must be existing or new.");
  if (type === "file" || type === "other") throw new Error("New mode requires a missing or empty directory.");
  if (type === "directory") {
    const entries = await fs.readdir(options.project);
    if (entries.length) throw new Error("New mode cannot run on a non-empty directory; use existing mode.");
    return;
  }
  if (!options.dryRun) await fs.mkdir(options.project, { recursive: true });
}

async function collectInventory(projectRoot, managementDirectory) {
  if ((await getPathType(projectRoot)) !== "directory") return [];
  const results = [];

  async function visit(directory, depth) {
    if (depth > 2 || results.length >= 24) return;
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, "en"));
    for (const entry of entries) {
      if (results.length >= 24) break;
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(projectRoot, absolute);
      const firstPart = relative.split(path.sep)[0];
      if (firstPart === managementDirectory.split(path.sep)[0]) continue;
      if (entry.isDirectory()) {
        if (ignoredInventoryDirectories.has(entry.name)) continue;
        if (depth < 2) await visit(absolute, depth + 1);
      } else if (entry.isFile()) {
        results.push(relative);
      }
    }
  }

  await visit(projectRoot, 0);
  return results;
}

function formatInventory(items, language) {
  if (!items.length) {
    return language === "en"
      ? "- No pre-existing project files were detected."
      : "- 未检测到初始化前的项目文件。";
  }
  return items.map((item) => `- \`${item.split(path.sep).join("\\").replaceAll("`", "'")}\``).join("\n");
}

function formatModuleRules(modules, managementDirectory, language) {
  if (!modules.length) {
    return language === "en"
      ? "- No optional domain module is active. Do not infer one from the management dashboard."
      : "- 当前没有启用可选领域模块。不能根据管理 Dashboard 推断项目领域。";
  }
  return modules.map((moduleName) => {
    const rule = moduleReadingRules[moduleName];
    const relative = `${managementDirectory.split(path.sep).join("\\")}\\${rule.path}`;
    return language === "en"
      ? `- Read \`${relative}\` ${rule.en}.`
      : `- ${rule.zh}，阅读 \`${relative}\`。`;
  }).join("\n");
}

function formatFeatureRules(features, managementDirectory, language) {
  if (!features.length) {
    return language === "en"
      ? "- No optional project-context feature is active."
      : "- 当前没有启用可选项目上下文功能。";
  }
  return features.map((featureName) => {
    const rule = featureReadingRules[featureName];
    const relative = `${managementDirectory.split(path.sep).join("\\")}\\${rule.path}`;
    return language === "en"
      ? `- Read \`${relative}\` ${rule.en}.`
      : `- ${rule.zh}，阅读 \`${relative}\`。`;
  }).join("\n");
}

function enrichDocumentMetadata(document) {
  const pairMetadata = documentMetadataByPair[document.pair] || {
    readWhen: ["when-task-routing-selects-this-document"],
    updateWhen: ["when-its-durable-content-changes"],
  };
  const privateLookup = document.privateLookup ?? document.group === "archive";
  let authority = document.authority;
  if (!authority) {
    if (privateLookup) authority = "private-lookup";
    else if (document.lang === "zh") authority = "review";
    else if (document.group === "reference" || document.group === "evidence") authority = "reference";
    else authority = "operational";
  }
  return {
    ...document,
    lifecycle: document.lifecycle || "active",
    authority,
    readWhen: Array.isArray(document.readWhen) ? document.readWhen : pairMetadata.readWhen,
    updateWhen: Array.isArray(document.updateWhen) ? document.updateWhen : pairMetadata.updateWhen,
    privateLookup,
  };
}

async function readJson(target) {
  return JSON.parse(await fs.readFile(target, "utf8"));
}

async function walkFiles(root) {
  const output = [];
  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, "en"));
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      if (entry.isFile()) output.push(absolute);
    }
  }
  await visit(root);
  return output;
}

function renderTemplate(template, replacements, source) {
  let rendered = template;
  for (const [key, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value);
  }
  const unresolved = rendered.match(/{{[A-Z0-9_]+}}/g);
  if (unresolved) throw new Error(`Unresolved placeholders in ${source}: ${[...new Set(unresolved)].join(", ")}`);
  return rendered;
}

function destinationForTemplate(source, templateBase, projectRoot, managementDirectory) {
  let relative = path.relative(templateBase, source);
  if (relative.endsWith(".tmpl")) relative = relative.slice(0, -5);
  const parts = relative.split(path.sep);
  if (parts[0] === "management") {
    return path.join(projectRoot, managementDirectory, ...parts.slice(1));
  }
  return path.join(projectRoot, ...parts);
}

function proposalName(target, sequence) {
  const extension = path.extname(target);
  const stem = extension ? target.slice(0, -extension.length) : target;
  const suffix = sequence === 1 ? "" : `.${sequence}`;
  return `${stem}.project-management.proposed${suffix}${extension}`;
}

async function createWriter(report, dryRun) {
  const reserved = new Set();

  async function nextProposal(target) {
    for (let sequence = 1; ; sequence += 1) {
      const candidate = proposalName(target, sequence);
      if (!reserved.has(candidate) && (await getPathType(candidate)) === "missing") {
        reserved.add(candidate);
        return candidate;
      }
    }
  }

  return async function writeProtected(target, content, reason = "content differs") {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    const type = await getPathType(target);
    if (type === "file") {
      const current = await fs.readFile(target);
      if (current.equals(buffer)) {
        report.unchanged.push(target);
        return { status: "unchanged", path: target };
      }
      const proposal = await nextProposal(target);
      if (!dryRun) {
        await fs.mkdir(path.dirname(proposal), { recursive: true });
        await fs.writeFile(proposal, buffer, { flag: "wx" });
      }
      report.proposals.push({ target, proposal, reason });
      return { status: "proposal", path: proposal, target };
    }
    if (type !== "missing") {
      const proposal = await nextProposal(target);
      if (!dryRun) {
        await fs.mkdir(path.dirname(proposal), { recursive: true });
        await fs.writeFile(proposal, buffer, { flag: "wx" });
      }
      report.proposals.push({ target, proposal, reason: `target is a ${type}` });
      return { status: "proposal", path: proposal, target };
    }
    if (!dryRun) {
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, buffer, { flag: "wx" });
    }
    report.created.push(target);
    return { status: "created", path: target };
  };
}

async function materializeTemplates(templateBase, projectRoot, managementDirectory, replacements, writeProtected, includeChinese = true) {
  const results = [];
  for (const source of await walkFiles(templateBase)) {
    const target = destinationForTemplate(source, templateBase, projectRoot, managementDirectory);
    if (!includeChinese && /\.zh\.md$/i.test(target)) continue;
    const content = source.endsWith(".tmpl")
      ? renderTemplate(await fs.readFile(source, "utf8"), replacements, source)
      : await fs.readFile(source);
    results.push({ source, target, result: await writeProtected(target, content) });
  }
  return results;
}

function mergeDocumentEntries(existing, desired) {
  const desiredById = new Map(desired.map((document) => [document.id, document]));
  const documents = Array.isArray(existing)
    ? existing.map((document) => {
      const managed = desiredById.get(document?.id);
      return managed ? {
        ...document,
        group: managed.group,
        lifecycle: managed.lifecycle,
        authority: managed.authority,
        readWhen: managed.readWhen,
        updateWhen: managed.updateWhen,
        privateLookup: managed.privateLookup,
      } : document;
    })
    : [];
  const ids = new Set(documents.map((document) => document && document.id).filter(Boolean));
  for (const document of desired) {
    if (!ids.has(document.id)) {
      documents.push(document);
      ids.add(document.id);
    }
  }
  return documents;
}

function mergeRegistryEntries(existing, desired) {
  const registries = Array.isArray(existing) ? [...existing] : [];
  const indexes = new Map(registries.map((registry, index) => [registry?.id, index]).filter(([id]) => id));
  for (const registry of desired) {
    if (indexes.has(registry.id)) registries[indexes.get(registry.id)] = { ...registries[indexes.get(registry.id)], ...registry };
    else {
      indexes.set(registry.id, registries.length);
      registries.push(registry);
    }
  }
  return registries;
}

async function writeManifest(target, desired, report, dryRun, writeProtected) {
  const type = await getPathType(target);
  if (type === "file") {
    try {
      const currentText = await fs.readFile(target, "utf8");
      const current = JSON.parse(currentText);
      if (current.generatedBy === "manage-project-context") {
        const mergedDocuments = mergeDocumentEntries(current.documents, desired.documents)
          .filter((document) => desired.chineseMirror !== false || document?.lang !== "zh");
        const hasZh = mergedDocuments.some((document) => document?.lang === "zh");
        const merged = {
          ...desired,
          ...current,
          schemaVersion: desired.schemaVersion,
          generatedBy: "manage-project-context",
          projectName: current.projectName || desired.projectName,
          managementDirectory: current.managementDirectory || desired.managementDirectory,
          chineseMirror: hasZh,
          defaultLanguage: hasZh ? (current.defaultLanguage === "en" ? "en" : "zh") : "en",
          groups: { ...desired.groups, ...(current.groups || {}) },
          documents: mergedDocuments,
          registries: mergeRegistryEntries(current.registries, desired.registries || []),
        };
        const nextText = `${JSON.stringify(merged, null, 2)}\n`;
        if (currentText.replace(/\r\n/g, "\n") === nextText) {
          report.unchanged.push(target);
          return { status: "unchanged", path: target };
        }
        if (!dryRun) await fs.writeFile(target, nextText, "utf8");
        report.managedUpdated.push(target);
        return { status: "managed-updated", path: target };
      }
    } catch {
      // The protected-writer path below creates a reviewable proposal.
    }
  }
  return writeProtected(target, `${JSON.stringify(desired, null, 2)}\n`, "manifest is not owned by manage-project-context");
}

function runNode(script, argumentsList) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...argumentsList], { windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() }));
  });
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }
  if (!options.project) throw new Error("--project is required.");
  if (!path.isAbsolute(options.project)) throw new Error("--project must be an absolute path.");
  if (!options.mode) throw new Error("--mode is required.");
  options.project = path.resolve(options.project);
  options.managementDirectory = validateManagementDirectory(options.managementDirectory);
  validateDate(options.date);
  for (const moduleName of options.modules) {
    if (!supportedModules.has(moduleName)) throw new Error(`Unsupported module: ${moduleName}`);
  }
  for (const featureName of options.features) {
    if (!supportedFeatures.has(featureName)) throw new Error(`Unsupported feature: ${featureName}`);
    const featureManifest = await readJson(path.join(assetRoot, "features", featureName, "feature.json"));
    for (const requiredModule of featureManifest.requiresModules || []) {
      if (!options.modules.includes(requiredModule)) {
        throw new Error(`Feature ${featureName} requires module: ${requiredModule}`);
      }
    }
  }

  await prepareProjectRoot(options);
  options.projectName = normalizeInline(options.projectName || path.basename(options.project), "Project name");
  options.goalEn = normalizeInline(options.goalEn, "English goal");
  options.goalZh = normalizeInline(options.goalZh, "Chinese goal");

  const inventory = await collectInventory(options.project, options.managementDirectory);
  const managementRoot = path.join(options.project, options.managementDirectory);
  let includeChinese = options.chinese;
  if (includeChinese === null) {
    if (options.goalZhProvided) {
      includeChinese = true;
    } else if (options.mode === "existing") {
      const existingZhAgent = (await getPathType(path.join(options.project, "AGENTS.zh.md"))) === "file";
      const existingZhStart = (await getPathType(path.join(managementRoot, "00_START_HERE.zh.md"))) === "file";
      includeChinese = existingZhAgent || existingZhStart;
    } else {
      includeChinese = false;
    }
  }
  const projectRootFromManagement = path.relative(managementRoot, options.project) || ".";
  const projectRootFromState = path.relative(path.join(managementRoot, "02_current_state"), options.project) || ".";
  const moduleSummaryEn = options.modules.length ? options.modules.join(", ") : "None selected; add a module only when its domain becomes part of the project.";
  const moduleSummaryZh = options.modules.length ? options.modules.join("、") : "当前未选择；只有相关领域成为项目组成部分时才添加模块。";
  const featureSummaryEn = options.features.length ? options.features.join(", ") : "None selected; add a feature only when it carries durable project information.";
  const featureSummaryZh = options.features.length ? options.features.join("、") : "当前未选择；只有功能能够保存长期项目信息时才添加。";
  const replacements = {
    PROJECT_NAME: options.projectName,
    PROJECT_NAME_JSON: JSON.stringify(options.projectName),
    DATE: options.date,
    MODE: options.mode,
    MODE_EN: options.mode === "new" ? "new project" : "existing project",
    MODE_ZH: options.mode === "new" ? "新项目" : "现有项目",
    MANAGEMENT_DIR: options.managementDirectory.split(path.sep).join("\\"),
    GOAL_EN: options.goalEn,
    GOAL_ZH: options.goalZh,
    DETECTED_FILES_EN: formatInventory(inventory, "en"),
    DETECTED_FILES_ZH: formatInventory(inventory, "zh"),
    MODULES_EN: moduleSummaryEn,
    MODULES_ZH: moduleSummaryZh,
    MODULE_RULES_EN: formatModuleRules(options.modules, options.managementDirectory, "en"),
    MODULE_RULES_ZH: formatModuleRules(options.modules, options.managementDirectory, "zh"),
    FEATURES_EN: featureSummaryEn,
    FEATURES_ZH: featureSummaryZh,
    FEATURE_RULES_EN: formatFeatureRules(options.features, options.managementDirectory, "en"),
    FEATURE_RULES_ZH: formatFeatureRules(options.features, options.managementDirectory, "zh"),
    PROJECT_ROOT_FROM_STATE: projectRootFromState.split(path.sep).join("\\"),
  };

  const report = {
    ok: true,
    dryRun: options.dryRun,
    mode: options.mode,
    chinese: includeChinese,
    project: options.project,
    managementDirectory: managementRoot,
    modules: options.modules,
    features: options.features,
    inventory,
    created: [],
    unchanged: [],
    managedUpdated: [],
    proposals: [],
    dashboard: null,
  };
  const writeProtected = await createWriter(report, options.dryRun);

  const baseManifest = await readJson(path.join(assetRoot, "core-manifest.json"));
  const documentEntries = [...baseManifest.documents];
  const registryEntries = [];
  const templateResults = await materializeTemplates(
    path.join(assetRoot, "core", "templates"),
    options.project,
    options.managementDirectory,
    replacements,
    writeProtected,
    includeChinese,
  );
  const portableArchiverSource = path.join(skillDirectory, "scripts", "archive_project_management.mjs");
  const portableArchiverTarget = path.join(managementRoot, "tools", "archive_project_management.mjs");
  templateResults.push({
    source: portableArchiverSource,
    target: portableArchiverTarget,
    result: await writeProtected(portableArchiverTarget, await fs.readFile(portableArchiverSource)),
  });

  for (const moduleName of options.modules) {
    const moduleRoot = path.join(assetRoot, "modules", moduleName);
    const moduleManifest = await readJson(path.join(moduleRoot, "module.json"));
    documentEntries.push(...moduleManifest.documents);
    templateResults.push(...await materializeTemplates(
      path.join(moduleRoot, "templates"),
      options.project,
      options.managementDirectory,
      replacements,
      writeProtected,
      includeChinese,
    ));
  }

  for (const featureName of options.features) {
    const featureRoot = path.join(assetRoot, "features", featureName);
    const featureManifest = await readJson(path.join(featureRoot, "feature.json"));
    documentEntries.push(...(featureManifest.documents || []));
    registryEntries.push(...(featureManifest.registries || []));
    templateResults.push(...await materializeTemplates(
      path.join(featureRoot, "templates"),
      options.project,
      options.managementDirectory,
      replacements,
      writeProtected,
      includeChinese,
    ));
  }

  const activeDocumentEntries = documentEntries.filter((document) => includeChinese || document.lang !== "zh");

  for (let index = 0; index < activeDocumentEntries.length; index += 1) {
    activeDocumentEntries[index] = enrichDocumentMetadata(activeDocumentEntries[index]);
  }

  for (const document of activeDocumentEntries) {
    if (document.pair === "agent-rules") {
      document.path = path.posix.join(
        projectRootFromManagement.split(path.sep).join("/"),
        document.lang === "en" ? "AGENTS.md" : "AGENTS.zh.md",
      );
    }
  }

  const desiredManifest = {
    schemaVersion: 2,
    generatedBy: "manage-project-context",
    projectName: options.projectName,
    managementDirectory: options.managementDirectory.split(path.sep).join("/"),
    projectRootRelative: projectRootFromManagement.split(path.sep).join("/"),
    chineseMirror: includeChinese,
    defaultLanguage: includeChinese ? "zh" : "en",
    groups: baseManifest.groups,
    documents: activeDocumentEntries,
    registries: registryEntries,
  };
  const manifestPath = path.join(options.project, options.managementDirectory, "project-management.json");
  const manifestResult = await writeManifest(manifestPath, desiredManifest, report, options.dryRun, writeProtected);

  const builderPath = path.join(options.project, options.managementDirectory, "tools", "build_dashboard.mjs");
  const builderTemplate = templateResults.find((entry) => entry.target === builderPath);
  if (options.dryRun) {
    report.dashboard = { status: "dry-run", path: path.join(options.project, options.managementDirectory, "index.html") };
  } else if (builderTemplate?.result.status === "proposal" || manifestResult.status === "proposal") {
    report.dashboard = { status: "skipped", reason: "Builder or manifest requires review." };
  } else {
    const built = await runNode(builderPath, ["--management-root", managementRoot]);
    if (built.code !== 0) throw new Error(`Dashboard builder failed: ${built.stderr || built.stdout}`);
    try {
      report.dashboard = JSON.parse(built.stdout.split(/\r?\n/).at(-1));
    } catch {
      report.dashboard = { status: "built", output: built.stdout };
    }
  }

  report.requiresReview = report.proposals.length > 0;
  report.next = report.requiresReview
    ? "Review proposal files, merge approved content, rebuild the dashboard, and validate."
    : "Validate the project-management folder and review the dashboard in a browser.";
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
