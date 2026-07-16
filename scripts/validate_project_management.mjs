import fs from "node:fs/promises";
import path from "node:path";

const coreRelativePaths = [
  "00_START_HERE.en.md",
  "00_START_HERE.zh.md",
  "01_goal/PROJECT_GOAL.en.md",
  "01_goal/PROJECT_GOAL.zh.md",
  "01_goal/PROJECT_CONSTRAINTS.en.md",
  "01_goal/PROJECT_CONSTRAINTS.zh.md",
  "02_current_state/SOURCE_OF_TRUTH.en.md",
  "02_current_state/SOURCE_OF_TRUTH.zh.md",
  "02_current_state/CURRENT_VERSION.en.md",
  "02_current_state/CURRENT_VERSION.zh.md",
  "03_active_work/CURRENT_TASKS.en.md",
  "03_active_work/CURRENT_TASKS.zh.md",
  "04_decisions/DECISIONS.en.md",
  "04_decisions/DECISIONS.zh.md",
  "06_history/PROJECT_HISTORY.en.md",
  "06_history/PROJECT_HISTORY.zh.md",
  "07_future/NEXT_DIRECTIONS.en.md",
  "07_future/NEXT_DIRECTIONS.zh.md",
  "08_references/README.en.md",
  "08_references/README.zh.md",
  "99_archive/README.en.md",
  "99_archive/README.zh.md",
  "assets/dashboard-template.html",
  "assets/marked.umd.js",
  "assets/MARKED_LICENSE.md",
  "tools/build_dashboard.mjs",
  "index.html",
];

function parseArguments(values) {
  const options = { project: "", managementDirectory: "project_management" };
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (token === "--project") options.project = values[++index] || "";
    else if (token === "--management-dir") options.managementDirectory = values[++index] || "";
    else throw new Error(`Unknown argument: ${token}`);
  }
  return options;
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findProposalFiles(target) {
  const directory = path.dirname(target);
  if (!(await exists(directory))) return [];
  const extension = path.extname(target);
  const stem = path.basename(target, extension);
  const pattern = new RegExp(`^${escapeRegularExpression(stem)}\\.project-management\\.proposed(?:\\.\\d+)?${escapeRegularExpression(extension)}$`);
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right, "en"));
}

async function validateProtocolFile(target, fragment, label, errors, warnings) {
  if (!(await exists(target))) return;
  const content = await fs.readFile(target, "utf8");
  if (content.includes(fragment)) return;
  for (const proposal of await findProposalFiles(target)) {
    if ((await fs.readFile(proposal, "utf8")).includes(fragment)) {
      warnings.push(`${label} requires proposal review before the conversation-maintenance protocol becomes active.`);
      return;
    }
  }
  errors.push(`${label} is missing the conversation-maintenance protocol.`);
}

async function collectTextFiles(root) {
  const output = [];
  async function visit(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      if (entry.isFile() && /\.(?:md|json|mjs|html|js)$/i.test(entry.name)) output.push(absolute);
    }
  }
  await visit(root);
  return output;
}

function checkBilingualPairs(documents, errors) {
  const pairs = new Map();
  for (const document of documents) {
    if (!document || !document.pair || !document.lang || !document.path || !document.id) {
      errors.push("Every manifest document requires id, pair, lang, and path.");
      continue;
    }
    if (!pairs.has(document.pair)) pairs.set(document.pair, new Set());
    pairs.get(document.pair).add(document.lang);
  }
  for (const [pair, languages] of pairs) {
    if (!languages.has("en") || !languages.has("zh")) errors.push(`Manifest pair ${pair} is not bilingual.`);
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (!options.project || !path.isAbsolute(options.project)) throw new Error("--project must be an absolute path.");
  const projectRoot = path.resolve(options.project);
  const managementRoot = path.join(projectRoot, options.managementDirectory);
  const errors = [];
  const warnings = [];

  for (const relative of ["AGENTS.md", "AGENTS.zh.md"]) {
    if (!(await exists(path.join(projectRoot, relative)))) errors.push(`Missing ${relative}.`);
  }
  for (const relative of coreRelativePaths) {
    if (!(await exists(path.join(managementRoot, ...relative.split("/"))))) errors.push(`Missing ${relative}.`);
  }

  await validateProtocolFile(
    path.join(projectRoot, "AGENTS.md"),
    "## Conversation-driven project memory",
    "AGENTS.md",
    errors,
    warnings,
  );
  await validateProtocolFile(
    path.join(projectRoot, "AGENTS.zh.md"),
    "## 聊天驱动的项目记忆",
    "AGENTS.zh.md",
    errors,
    warnings,
  );
  await validateProtocolFile(
    path.join(managementRoot, "00_START_HERE.en.md"),
    "## Conversation intake and ongoing maintenance",
    "00_START_HERE.en.md",
    errors,
    warnings,
  );
  await validateProtocolFile(
    path.join(managementRoot, "00_START_HERE.zh.md"),
    "## 聊天内容摄取与持续维护",
    "00_START_HERE.zh.md",
    errors,
    warnings,
  );

  const manifestPath = path.join(managementRoot, "project-management.json");
  let manifest = null;
  if (!(await exists(manifestPath))) {
    errors.push("Missing project-management.json.");
  } else {
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
      if (manifest.generatedBy !== "manage-project-context") errors.push("Manifest ownership marker is missing.");
      if (manifest.defaultLanguage !== "zh") errors.push("Dashboard default language must be zh.");
      if (!Array.isArray(manifest.documents)) errors.push("Manifest documents must be an array.");
      else checkBilingualPairs(manifest.documents, errors);
    } catch (error) {
      errors.push(`Manifest is invalid JSON: ${error.message}`);
    }
  }

  if (manifest?.documents) {
    const ids = new Set();
    for (const document of manifest.documents) {
      if (ids.has(document.id)) errors.push(`Duplicate manifest id: ${document.id}`);
      ids.add(document.id);
      const absolute = path.resolve(managementRoot, ...document.path.split("/"));
      if (!(absolute === projectRoot || absolute.startsWith(`${projectRoot}${path.sep}`))) {
        errors.push(`Manifest path escapes the project root: ${document.path}`);
      } else if (!(await exists(absolute))) {
        errors.push(`Manifest document is missing: ${document.path}`);
      }
    }
    const agentEnglish = manifest.documents.find((document) => document.pair === "agent-rules" && document.lang === "en");
    const agentChinese = manifest.documents.find((document) => document.pair === "agent-rules" && document.lang === "zh");
    if (agentEnglish?.group !== "priority" || path.resolve(managementRoot, ...(agentEnglish?.path || "").split("/")) !== path.join(projectRoot, "AGENTS.md")) {
      errors.push("AGENTS.md must resolve to the project root and appear in the priority group.");
    }
    if (agentChinese?.group !== "priority" || path.resolve(managementRoot, ...(agentChinese?.path || "").split("/")) !== path.join(projectRoot, "AGENTS.zh.md")) {
      errors.push("AGENTS.zh.md must resolve to the project root and appear in the priority group.");
    }
  }

  if (await exists(managementRoot)) {
    for (const file of await collectTextFiles(managementRoot)) {
      const content = await fs.readFile(file, "utf8");
      if (content.includes("\uFFFD")) errors.push(`Invalid UTF-8 replacement character in ${file}.`);
      if (/{{[A-Z0-9_]+}}/.test(content)) errors.push(`Unresolved template placeholder in ${file}.`);
    }
  }

  const dashboardPath = path.join(managementRoot, "index.html");
  if (await exists(dashboardPath)) {
    const dashboard = await fs.readFile(dashboardPath, "utf8");
    const requiredFragments = [
      "<!-- generated-by: manage-project-context -->",
      'lang="zh-CN"',
      'language: "zh"',
      'id="search"',
      'id="document-navigation"',
      'id="outline-list"',
      '.nav-item[hidden]',
      'data-theme-value="dark"',
      'data-theme-value="light"',
      "AGENTS.md",
    ];
    for (const fragment of requiredFragments) {
      if (!dashboard.includes(fragment)) errors.push(`Dashboard is missing required fragment: ${fragment}`);
    }
  }

  const result = {
    ok: errors.length === 0,
    project: projectRoot,
    managementDirectory: managementRoot,
    documents: manifest?.documents?.length || 0,
    errors,
    warnings,
  };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
