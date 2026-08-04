import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const lifecycleValues = new Set(["active", "proposed", "historical", "retired", "unconfirmed"]);
const documentAuthorityValues = new Set(["operational", "review", "reference", "private-lookup"]);
const artifactAuthorityValues = new Set(["authoritative", "descriptive", "selection-only", "reference-only", "invalid-for-decisions"]);
const managedPairs = new Set([
  "agent-rules", "start", "goal", "constraints", "source", "version", "architecture", "tasks", "work-progress",
  "decisions", "change-reasons", "history", "future", "references", "archive", "frontend", "backend", "research",
  "data", "deployment", "security", "implementation-flow", "experiment-log", "artifacts",
]);

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
  "02_current_state/CODE_ARCHITECTURE.en.md",
  "02_current_state/CODE_ARCHITECTURE.zh.md",
  "03_active_work/CURRENT_TASKS.en.md",
  "03_active_work/CURRENT_TASKS.zh.md",
  "03_active_work/WORK_PROGRESS.en.md",
  "03_active_work/WORK_PROGRESS.zh.md",
  "04_decisions/DECISIONS.en.md",
  "04_decisions/DECISIONS.zh.md",
  "04_decisions/CHANGE_REASONS.en.md",
  "04_decisions/CHANGE_REASONS.zh.md",
  "06_history/PROJECT_HISTORY.en.md",
  "06_history/PROJECT_HISTORY.zh.md",
  "07_future/NEXT_DIRECTIONS.en.md",
  "07_future/NEXT_DIRECTIONS.zh.md",
  "08_references/README.en.md",
  "08_references/README.zh.md",
  "99_archive/README.en.md",
  "99_archive/README.zh.md",
  "assets/marked.umd.js",
  "assets/MARKED_LICENSE.md",
  "tools/build_dashboard.mjs",
  "tools/archive_project_management.mjs",
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

function maskInlineCode(line) {
  let output = "";
  let cursor = 0;
  while (cursor < line.length) {
    const start = line.indexOf("`", cursor);
    if (start < 0) return output + line.slice(cursor);
    output += line.slice(cursor, start);
    let runEnd = start;
    while (runEnd < line.length && line[runEnd] === "`") runEnd += 1;
    const delimiter = line.slice(start, runEnd);
    const close = line.indexOf(delimiter, runEnd);
    if (close < 0) return output + " ".repeat(line.length - start);
    output += " ".repeat(close + delimiter.length - start);
    cursor = close + delimiter.length;
  }
  return output;
}

function markdownStrongSyntaxLines(content) {
  const lines = content.split(/\r?\n/);
  const matches = [];
  let fenceCharacter = "";
  let fenceLength = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const marker = fence[1];
      if (!fenceCharacter) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      } else if (marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = "";
        fenceLength = 0;
      }
      continue;
    }
    if (fenceCharacter) continue;
    const visible = maskInlineCode(line);
    const delimiterRuns = visible.match(/(?<!\\)\*\*(?!\*)/g) || [];
    if (delimiterRuns.length >= 2) matches.push(index + 1);
  }
  return matches;
}

function headingLevels(content) {
  const levels = [];
  let fenceCharacter = "";
  let fenceLength = 0;
  for (const line of content.split(/\r?\n/)) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const marker = fence[1];
      if (!fenceCharacter) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      } else if (marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = "";
        fenceLength = 0;
      }
      continue;
    }
    if (fenceCharacter) continue;
    const heading = line.match(/^(#{1,6})\s+\S/);
    if (heading) levels.push(heading[1].length);
  }
  return levels;
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function validateArtifactRegistries(manifest, managementRoot, projectRoot, errors) {
  if (manifest.registries !== undefined && !Array.isArray(manifest.registries)) {
    errors.push("Manifest registries must be an array when present.");
    return;
  }
  const ids = new Set();
  for (const registry of manifest.registries || []) {
    if (!registry?.id || !registry?.path || !registry?.kind || !registry?.schemaVersion) {
      errors.push("Every manifest registry requires id, kind, path, and schemaVersion.");
      continue;
    }
    if (ids.has(registry.id)) errors.push(`Duplicate registry id: ${registry.id}`);
    ids.add(registry.id);
    const absolute = path.resolve(managementRoot, ...registry.path.split("/"));
    if (!absolute.startsWith(`${projectRoot}${path.sep}`)) {
      errors.push(`Registry path escapes the project root: ${registry.path}`);
      continue;
    }
    if (!(await exists(absolute))) {
      errors.push(`Manifest registry is missing: ${registry.path}`);
      continue;
    }
    try {
      const data = JSON.parse(await fs.readFile(absolute, "utf8"));
      if (data.generatedBy !== "manage-project-context") errors.push(`Registry ownership marker is missing: ${registry.path}`);
      if (data.schemaVersion !== registry.schemaVersion) errors.push(`Registry schema version differs from the manifest: ${registry.path}`);
      if (!Array.isArray(data.items)) errors.push(`Registry items must be an array: ${registry.path}`);
      const itemIds = new Set();
      for (const item of data.items || []) {
        if (!item?.id || !item?.kind || !item?.path || !item?.lifecycle || !item?.authority || !item?.validityBoundary) {
          errors.push(`Artifact registry item requires id, kind, path, lifecycle, authority, and validityBoundary: ${registry.path}`);
          continue;
        }
        if (itemIds.has(item.id)) errors.push(`Duplicate artifact registry item id ${item.id}: ${registry.path}`);
        itemIds.add(item.id);
        if (!lifecycleValues.has(item.lifecycle)) errors.push(`Invalid artifact lifecycle ${item.lifecycle} for ${item.id}.`);
        if (!artifactAuthorityValues.has(item.authority)) errors.push(`Invalid artifact authority ${item.authority} for ${item.id}.`);
      }
    } catch (error) {
      errors.push(`Registry is invalid JSON: ${registry.path}: ${error.message}`);
    }
  }
}

async function validateArchivePackages(managementRoot, errors, warnings) {
  const archiveRoot = path.join(managementRoot, "99_archive");
  if (!(await exists(archiveRoot))) return;
  const manifests = [];
  async function visit(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile() && entry.name === "ARCHIVE_MANIFEST.json") manifests.push(absolute);
    }
  }
  await visit(archiveRoot);
  for (const manifestPath of manifests) {
    let manifest;
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    } catch (error) {
      errors.push(`Archive manifest is invalid JSON: ${manifestPath}: ${error.message}`);
      continue;
    }
    if (manifest.generatedBy !== "manage-project-context") {
      warnings.push(`Archive manifest uses a nonstandard or legacy contract and was not closure-validated: ${manifestPath}`);
      continue;
    }
    const archiveDirectory = path.dirname(manifestPath);
    for (const note of ["README.en.md", "README.zh.md"]) {
      if (!(await exists(path.join(archiveDirectory, note)))) errors.push(`Standard archive package is missing ${note}: ${archiveDirectory}`);
    }
    if (!Array.isArray(manifest.files) || !manifest.inventoryFingerprintSha256) {
      errors.push(`Standard archive manifest lacks files or inventory fingerprint: ${manifestPath}`);
      continue;
    }
    const items = [];
    let totalBytes = 0;
    for (const file of manifest.files) {
      if (!file?.path || !Number.isInteger(file?.bytes) || !/^[a-f0-9]{64}$/.test(file?.sha256 || "")) {
        errors.push(`Invalid file entry in archive manifest: ${manifestPath}`);
        continue;
      }
      const payload = path.resolve(archiveDirectory, "payload", ...file.path.split("/"));
      const payloadRoot = path.join(archiveDirectory, "payload");
      if (!payload.startsWith(`${payloadRoot}${path.sep}`) || !(await exists(payload))) {
        errors.push(`Archive payload is missing or unsafe: ${file.path} in ${manifestPath}`);
        continue;
      }
      const buffer = await fs.readFile(payload);
      if (buffer.length !== file.bytes || sha256(buffer) !== file.sha256) {
        errors.push(`Archive payload closure mismatch: ${file.path} in ${manifestPath}`);
      }
      items.push(file);
      totalBytes += buffer.length;
    }
    items.sort((left, right) => left.path.localeCompare(right.path, "en"));
    const fingerprintLines = items.map((item) => `${item.path}\t${item.bytes}\t${item.sha256}`).join("\n") + "\n";
    if (sha256(Buffer.from(fingerprintLines, "utf8")) !== manifest.inventoryFingerprintSha256) {
      errors.push(`Archive inventory fingerprint mismatch: ${manifestPath}`);
    }
    if (manifest.payloadFileCount !== items.length || manifest.payloadSizeBytes !== totalBytes) {
      errors.push(`Archive payload count or byte total mismatch: ${manifestPath}`);
    }
  }
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
      if (!Number.isInteger(manifest.schemaVersion) || manifest.schemaVersion < 2) errors.push("Manifest schemaVersion must be at least 2.");
      if (manifest.defaultLanguage !== "zh") errors.push("Dashboard default language must be zh.");
      for (const group of ["priority", "planning", "state", "work", "domain", "evidence", "reference", "archive"]) {
        if (!manifest.groups?.[group]?.en || !manifest.groups?.[group]?.zh) {
          errors.push(`Manifest group ${group} requires English and Chinese labels.`);
        }
      }
      if (!Array.isArray(manifest.documents)) errors.push("Manifest documents must be an array.");
      else checkBilingualPairs(manifest.documents, errors);
    } catch (error) {
      errors.push(`Manifest is invalid JSON: ${error.message}`);
    }
  }

  if (manifest?.documents) {
    const ids = new Set();
    const paths = new Set();
    for (const document of manifest.documents) {
      if (ids.has(document.id)) errors.push(`Duplicate manifest id: ${document.id}`);
      ids.add(document.id);
      if (paths.has(document.path)) errors.push(`Duplicate manifest path: ${document.path}`);
      paths.add(document.path);
      const metadataMissing = !document.lifecycle || !document.authority || !Array.isArray(document.readWhen)
        || !document.readWhen.length || !Array.isArray(document.updateWhen) || !document.updateWhen.length
        || typeof document.privateLookup !== "boolean";
      if (metadataMissing) {
        const message = `Manifest document lacks lifecycle, authority, readWhen, updateWhen, or privateLookup metadata: ${document.id}`;
        if (managedPairs.has(document.pair)) errors.push(message);
        else warnings.push(message);
      }
      if (document.lifecycle && !lifecycleValues.has(document.lifecycle)) errors.push(`Invalid document lifecycle ${document.lifecycle}: ${document.id}`);
      if (document.authority && !documentAuthorityValues.has(document.authority)) errors.push(`Invalid document authority ${document.authority}: ${document.id}`);
      if (document.privateLookup && document.authority !== "private-lookup") {
        errors.push(`Private lookup document must use private-lookup authority: ${document.id}`);
      }
      const absolute = path.resolve(managementRoot, ...document.path.split("/"));
      if (!(absolute === projectRoot || absolute.startsWith(`${projectRoot}${path.sep}`))) {
        errors.push(`Manifest path escapes the project root: ${document.path}`);
      } else if (!(await exists(absolute))) {
        errors.push(`Manifest document is missing: ${document.path}`);
      } else if (/\.md$/i.test(absolute)) {
        const strongLines = markdownStrongSyntaxLines(await fs.readFile(absolute, "utf8"));
        if (strongLines.length) {
          errors.push(`Managed Markdown must use HTML <strong>...</strong>, not **...**, in ${document.path} at line(s): ${strongLines.join(", ")}.`);
        }
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
    const expectedGroups = new Map([
      ["goal", "planning"],
      ["constraints", "planning"],
      ["source", "state"],
      ["version", "state"],
      ["architecture", "state"],
      ["implementation-flow", "state"],
      ["tasks", "work"],
      ["work-progress", "work"],
      ["experiment-log", "work"],
      ["artifacts", "evidence"],
      ["decisions", "reference"],
      ["change-reasons", "reference"],
      ["future", "reference"],
      ["references", "reference"],
      ["history", "archive"],
      ["archive", "archive"],
    ]);
    for (const [pair, expectedGroup] of expectedGroups) {
      for (const language of ["en", "zh"]) {
        const document = manifest.documents.find((entry) => entry.pair === pair && entry.lang === language);
        if (document && document.group !== expectedGroup) {
          errors.push(`Manifest pair ${pair}.${language} must appear in the ${expectedGroup} group.`);
        }
      }
    }

    const pairs = new Map();
    for (const document of manifest.documents) {
      if (!pairs.has(document.pair)) pairs.set(document.pair, {});
      pairs.get(document.pair)[document.lang] = document;
    }
    for (const [pair, languages] of pairs) {
      if (!languages.en || !languages.zh) continue;
      const englishPath = path.resolve(managementRoot, ...languages.en.path.split("/"));
      const chinesePath = path.resolve(managementRoot, ...languages.zh.path.split("/"));
      if (!(await exists(englishPath)) || !(await exists(chinesePath))) continue;
      const [englishLevels, chineseLevels] = await Promise.all([
        fs.readFile(englishPath, "utf8").then(headingLevels),
        fs.readFile(chinesePath, "utf8").then(headingLevels),
      ]);
      if (englishLevels.join(",") !== chineseLevels.join(",")) {
        warnings.push(`Bilingual heading structure differs for pair ${pair}: en=[${englishLevels.join(",")}] zh=[${chineseLevels.join(",")}].`);
      }
    }
  }

  if (manifest) await validateArtifactRegistries(manifest, managementRoot, projectRoot, errors);
  await validateArchivePackages(managementRoot, errors, warnings);

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
      'id="language-toggle"',
      'data-theme-toggle',
      'id="outline-trigger"',
      'id="outline-panel"',
      'id="document-status"',
      'class="document-badge"',
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
