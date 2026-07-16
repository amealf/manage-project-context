import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultManagementRoot = path.dirname(scriptDirectory);
const generatedMarker = "<!-- generated-by: manage-project-context -->";

function parseArguments(values) {
  const options = { managementRoot: defaultManagementRoot, output: "", force: false, help: false };
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (token === "--help" || token === "-h") options.help = true;
    else if (token === "--force") options.force = true;
    else if (token === "--management-root") options.managementRoot = values[++index] || "";
    else if (token === "--output") options.output = values[++index] || "";
    else throw new Error(`Unknown argument: ${token}`);
  }
  return options;
}

function safeJson(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
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

function proposalName(target, sequence) {
  const extension = path.extname(target);
  const stem = extension ? target.slice(0, -extension.length) : target;
  const suffix = sequence === 1 ? "" : `.${sequence}`;
  return `${stem}.project-management.proposed${suffix}${extension}`;
}

async function nextProposal(target) {
  for (let sequence = 1; ; sequence += 1) {
    const candidate = proposalName(target, sequence);
    if ((await pathType(candidate)) === "missing") return candidate;
  }
}

function assertDocumentPath(document, managementRoot, projectRoot) {
  if (!document.path || !document.id || !document.pair || !document.lang || !document.group) {
    throw new Error("Every manifest document requires id, pair, group, path, and lang.");
  }
  const absolute = path.resolve(managementRoot, ...document.path.split("/"));
  if (absolute !== projectRoot && !absolute.startsWith(`${projectRoot}${path.sep}`)) {
    throw new Error(`Document path escapes the project root: ${document.path}`);
  }
  return absolute;
}

async function loadDocuments(manifest, managementRoot, projectRoot) {
  const documents = [];
  for (const spec of manifest.documents) {
    const absolutePath = assertDocumentPath(spec, managementRoot, projectRoot);
    try {
      const [markdown, stat] = await Promise.all([
        fs.readFile(absolutePath, "utf8"),
        fs.stat(absolutePath),
      ]);
      documents.push({ ...spec, markdown, modified: stat.mtime.toISOString(), missing: false });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      const missingLabel = spec.lang === "zh" ? "文档缺失" : "Missing document";
      const guidance = spec.lang === "zh"
        ? "该路径列在 manifest 中，但文件不存在。请检查初始化报告或冲突提案。"
        : "This path is listed in the manifest, but the file does not exist. Review the initialization report or conflict proposals.";
      documents.push({
        ...spec,
        markdown: `# ${missingLabel}\n\n${guidance}\n\n\`${spec.path}\`\n`,
        modified: null,
        missing: true,
      });
    }
  }
  return documents;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log("node build_dashboard.mjs [--management-root <path>] [--output <path>] [--force]");
    return;
  }
  if (!options.managementRoot || !path.isAbsolute(options.managementRoot)) {
    throw new Error("--management-root must be an absolute path.");
  }

  const managementRoot = path.resolve(options.managementRoot);
  const manifestPath = path.join(managementRoot, "project-management.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  if (manifest.generatedBy !== "manage-project-context") throw new Error("Manifest ownership marker is missing.");
  if (!Array.isArray(manifest.documents)) throw new Error("Manifest documents must be an array.");

  const projectRoot = path.resolve(managementRoot, ...(manifest.projectRootRelative || "..").split("/"));
  const documents = await loadDocuments(manifest, managementRoot, projectRoot);
  const templatePath = path.join(managementRoot, "assets", "dashboard-template.html");
  const template = await fs.readFile(templatePath, "utf8");
  const html = template
    .replace("__PROJECT_NAME_JSON__", safeJson(manifest.projectName || path.basename(projectRoot)))
    .replace("__MANIFEST_JSON__", safeJson(manifest))
    .replace("__DOCUMENTS_JSON__", safeJson(documents));
  if (!html.includes(generatedMarker)) throw new Error("Dashboard template is missing its ownership marker.");
  if (/__(?:PROJECT_NAME|MANIFEST|DOCUMENTS)_JSON__/.test(html)) throw new Error("Dashboard template replacement failed.");

  const outputPath = options.output
    ? path.resolve(options.output)
    : path.join(managementRoot, "index.html");
  const type = await pathType(outputPath);
  let status = "created";
  let writtenPath = outputPath;
  if (type === "file") {
    const current = await fs.readFile(outputPath, "utf8");
    if (current === html) status = "unchanged";
    else if (options.force || current.includes(generatedMarker)) status = "updated";
    else {
      status = "proposal";
      writtenPath = await nextProposal(outputPath);
    }
  } else if (type !== "missing") {
    status = "proposal";
    writtenPath = await nextProposal(outputPath);
  }

  if (status !== "unchanged") {
    await fs.mkdir(path.dirname(writtenPath), { recursive: true });
    await fs.writeFile(writtenPath, html, status === "proposal" ? { encoding: "utf8", flag: "wx" } : "utf8");
  }

  console.log(JSON.stringify({
    ok: true,
    status,
    outputPath: writtenPath,
    protectedTarget: status === "proposal" ? outputPath : null,
    documents: documents.length,
    missingDocuments: documents.filter((document) => document.missing).map((document) => document.path),
  }));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }));
  process.exitCode = 1;
});
