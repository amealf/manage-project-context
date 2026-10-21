// generated-by: manage-project-context
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

function parseArguments(values) {
  const options = {
    project: "",
    managementDirectory: "project_management",
    name: "",
    date: new Date().toISOString().slice(0, 10),
    sources: [],
    reasonEn: "",
    reasonZh: "",
    activePeriodEn: "Unconfirmed",
    activePeriodZh: "待确认",
    replacement: "Unconfirmed",
    validityEn: "Historical reference only until an accepted restoration states a new validity boundary.",
    validityZh: "在已确认恢复操作声明新的有效边界前，只供历史参考。",
    restoreEn: "Restore only through an accepted decision and synchronized current-state updates.",
    restoreZh: "只有形成已确认决定并同步更新当前状态后才能恢复。",
    dryRun: false,
    help: false,
  };
  const valueOptions = new Map([
    ["--project", "project"],
    ["--management-dir", "managementDirectory"],
    ["--name", "name"],
    ["--date", "date"],
    ["--reason-en", "reasonEn"],
    ["--reason-zh", "reasonZh"],
    ["--active-period-en", "activePeriodEn"],
    ["--active-period-zh", "activePeriodZh"],
    ["--replacement", "replacement"],
    ["--validity-en", "validityEn"],
    ["--validity-zh", "validityZh"],
    ["--restore-en", "restoreEn"],
    ["--restore-zh", "restoreZh"],
  ]);
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (token === "--help" || token === "-h") options.help = true;
    else if (token === "--dry-run") options.dryRun = true;
    else if (token === "--source") {
      const value = values[++index];
      if (!value || value.startsWith("--")) throw new Error("--source requires a project-relative path.");
      options.sources.push(...value.split(",").map((item) => item.trim()).filter(Boolean));
    } else {
      const key = valueOptions.get(token);
      if (!key) throw new Error(`Unknown argument: ${token}`);
      const value = values[++index];
      if (value === undefined || value.startsWith("--")) throw new Error(`${token} requires a value.`);
      options[key] = value;
    }
  }
  options.sources = [...new Set(options.sources)];
  return options;
}

function printHelp() {
  console.log(`Usage:
  node archive_project_management.mjs --project <absolute-path> --name <archive-name> --source <relative-path> --reason-en <text> --reason-zh <text> [options]

Options:
  --management-dir <relative-path>
  --date YYYY-MM-DD
  --source <relative-path[,relative-path]>
  --active-period-en <text>
  --active-period-zh <text>
  --replacement <text>
  --validity-en <text>
  --validity-zh <text>
  --restore-en <text>
  --restore-zh <text>
  --dry-run
  --help`);
}

function normalizeInline(value, label) {
  const output = String(value || "").replace(/\s+/g, " ").trim();
  if (!output) throw new Error(`${label} cannot be empty.`);
  return output;
}

function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("--date must use YYYY-MM-DD.");
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error("--date is not a valid calendar date.");
  }
}

function validateSafeRelative(value, label) {
  if (!value || path.isAbsolute(value)) throw new Error(`${label} must be a relative path.`);
  const normalized = path.normalize(value);
  const parts = normalized.split(/[\\/]+/);
  if (normalized === "." || parts.some((part) => !part || part === "..")) {
    throw new Error(`${label} must stay inside the project root.`);
  }
  return normalized;
}

function isInside(root, target) {
  return target === root || target.startsWith(`${root}${path.sep}`);
}

async function pathType(target) {
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

async function collectFiles(projectRoot, sourcePaths, archiveRoot) {
  const files = new Map();
  async function visit(target) {
    if (isInside(archiveRoot, target)) return;
    const type = await pathType(target);
    if (type === "missing") throw new Error(`Archive source does not exist: ${path.relative(projectRoot, target)}`);
    if (type === "file") {
      const relative = path.relative(projectRoot, target);
      files.set(relative.split(path.sep).join("/"), target);
      return;
    }
    if (type !== "directory") throw new Error(`Archive source is not a file or directory: ${path.relative(projectRoot, target)}`);
    const entries = await fs.readdir(target, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, "en"));
    for (const entry of entries) await visit(path.join(target, entry.name));
  }
  for (const sourcePath of sourcePaths) await visit(sourcePath);
  return [...files.entries()].sort(([left], [right]) => left.localeCompare(right, "en"));
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function archiveReadmeEn(options, sourceLabels) {
  return `# Archived Project Material

- <strong>Original role:</strong> Selected project files retained for a recoverable transition snapshot.
- <strong>Active period:</strong> ${options.activePeriodEn}
- <strong>Retirement reason:</strong> ${options.reasonEn}
- <strong>Current replacement:</strong> ${options.replacement}
- <strong>Retained evidence:</strong> ${sourceLabels.join(", ")}
- <strong>Validity boundary:</strong> ${options.validityEn}
- <strong>Restoration conditions:</strong> ${options.restoreEn}

\`ARCHIVE_MANIFEST.json\` closes the retained payload with file and byte counts, per-file SHA-256 values, and an inventory fingerprint. The source files were copied and were not deleted by this archive operation.
`;
}

function archiveReadmeZh(options, sourceLabels) {
  return `# 已归档项目材料

- <strong>原始角色：</strong>为可恢复切换快照保留的项目文件。
- <strong>生效区间：</strong>${options.activePeriodZh}
- <strong>退役原因：</strong>${options.reasonZh}
- <strong>当前替代项：</strong>${options.replacement}
- <strong>保留证据：</strong>${sourceLabels.join("、")}
- <strong>有效边界：</strong>${options.validityZh}
- <strong>恢复条件：</strong>${options.restoreZh}

\`ARCHIVE_MANIFEST.json\` 记录文件数、字节数、逐文件 SHA-256 与清单指纹，完成保留内容闭合。本次归档只复制来源文件，没有删除来源。
`;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }
  if (!options.project || !path.isAbsolute(options.project)) throw new Error("--project must be an absolute path.");
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(options.name)) {
    throw new Error("--name must contain only letters, digits, dots, underscores, or hyphens and start with a letter or digit.");
  }
  if (!options.sources.length) throw new Error("At least one --source is required.");
  validateDate(options.date);
  const projectRoot = path.resolve(options.project);
  if ((await pathType(projectRoot)) !== "directory") throw new Error("--project must be an existing directory.");
  const managementDirectory = validateSafeRelative(options.managementDirectory, "--management-dir");
  const managementRoot = path.resolve(projectRoot, managementDirectory);
  if (!isInside(projectRoot, managementRoot)) throw new Error("Management directory escapes the project root.");
  let projectChineseMirror = Boolean(options.reasonZh);
  try {
    const projectManifest = JSON.parse(await fs.readFile(path.join(managementRoot, "project-management.json"), "utf8"));
    if (projectManifest.chineseMirror === true || (Array.isArray(projectManifest.documents) && projectManifest.documents.some((doc) => doc?.lang === "zh"))) {
      projectChineseMirror = true;
    } else if (projectManifest.chineseMirror === false && !options.reasonZh) {
      projectChineseMirror = false;
    }
  } catch {
    // Fall back to explicit --reason-zh presence.
  }
  options.reasonEn = normalizeInline(options.reasonEn, "--reason-en");
  if (projectChineseMirror) {
    options.reasonZh = normalizeInline(options.reasonZh, "--reason-zh");
  }
  for (const key of ["activePeriodEn", "activePeriodZh", "replacement", "validityEn", "validityZh", "restoreEn", "restoreZh"]) {
    options[key] = normalizeInline(options[key], key);
  }
  const archiveRoot = path.join(managementRoot, "99_archive", options.name);
  if ((await pathType(archiveRoot)) !== "missing") throw new Error(`Archive destination already exists: ${archiveRoot}`);

  const sourcePaths = options.sources.map((source) => {
    const normalized = validateSafeRelative(source, "--source");
    const resolved = path.resolve(projectRoot, normalized);
    if (!isInside(projectRoot, resolved)) throw new Error(`Archive source escapes the project root: ${source}`);
    return resolved;
  });
  const collected = await collectFiles(projectRoot, sourcePaths, archiveRoot);
  if (!collected.length) throw new Error("Archive sources contain no files.");

  const inventory = [];
  let payloadSizeBytes = 0;
  for (const [relative, absolute] of collected) {
    const buffer = await fs.readFile(absolute);
    inventory.push({ path: relative, bytes: buffer.length, sha256: sha256(buffer), absolute, buffer });
    payloadSizeBytes += buffer.length;
  }
  const fingerprintLines = inventory.map((item) => `${item.path}\t${item.bytes}\t${item.sha256}`).join("\n") + "\n";
  const inventoryFingerprintSha256 = sha256(Buffer.from(fingerprintLines, "utf8"));
  const sourceLabels = options.sources.map((source) => `\`${source.split(path.sep).join("\\")}\``);
  const manifest = {
    schemaVersion: 1,
    generatedBy: "manage-project-context",
    status: "complete",
    archivedAt: options.date,
    chineseMirror: projectChineseMirror,
    reason: projectChineseMirror ? { en: options.reasonEn, zh: options.reasonZh } : { en: options.reasonEn },
    replacement: options.replacement,
    payloadFileCount: inventory.length,
    payloadSizeBytes,
    inventoryFingerprintSha256,
    fingerprintContract: "SHA-256 of UTF-8 lines sorted by project-relative path; each line is relative_path, byte_length, and lowercase file_sha256 separated by tabs and terminated by LF. Archive notes and this manifest are excluded.",
    retention: "Recoverable historical project evidence; source files were copied and not deleted.",
    files: inventory.map(({ path: relative, bytes, sha256: digest }) => ({ path: relative, bytes, sha256: digest })),
  };

  if (!options.dryRun) {
    await fs.mkdir(path.join(archiveRoot, "payload"), { recursive: true });
    for (const item of inventory) {
      const destination = path.join(archiveRoot, "payload", ...item.path.split("/"));
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, item.buffer, { flag: "wx" });
    }
    await fs.writeFile(path.join(archiveRoot, "README.en.md"), archiveReadmeEn(options, sourceLabels), { encoding: "utf8", flag: "wx" });
    if (projectChineseMirror) {
      await fs.writeFile(path.join(archiveRoot, "README.zh.md"), archiveReadmeZh(options, sourceLabels), { encoding: "utf8", flag: "wx" });
    }
    await fs.writeFile(path.join(archiveRoot, "ARCHIVE_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  }

  console.log(JSON.stringify({
    ok: true,
    dryRun: options.dryRun,
    archive: archiveRoot,
    payloadFileCount: inventory.length,
    payloadSizeBytes,
    inventoryFingerprintSha256,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
