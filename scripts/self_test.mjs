import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const initializer = path.join(scriptDirectory, "init_project_management.mjs");
const validator = path.join(scriptDirectory, "validate_project_management.mjs");
const archiver = path.join(scriptDirectory, "archive_project_management.mjs");

function parseArguments(values) {
  const options = { outputRoot: "", date: "2026-07-16" };
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (token === "--output-root") options.outputRoot = values[++index] || "";
    else if (token === "--date") options.date = values[++index] || "";
    else throw new Error(`Unknown argument: ${token}`);
  }
  return options;
}

function run(script, argumentsList) {
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

function parseJsonOutput(result, label) {
  if (result.code !== 0) throw new Error(`${label} failed: ${result.stderr || result.stdout}`);
  return JSON.parse(result.stdout);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (!options.outputRoot || !path.isAbsolute(options.outputRoot)) {
    throw new Error("--output-root must be an absolute path.");
  }
  try {
    await fs.access(options.outputRoot);
    throw new Error("The self-test output root already exists; choose a new path so retained evidence is not replaced.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await fs.mkdir(options.outputRoot, { recursive: true });

  const readme = await fs.readFile(path.join(scriptDirectory, "..", "README.md"), "utf8");
  const headings = [...readme.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => match[1].trim());
  for (const heading of headings) {
    if (heading.length > 32 || /[?？]$/.test(heading) || /^(How|What|Why|When|Where)\b/i.test(heading) || /^(如何|怎么|怎样|为什么|是什么)/.test(heading)) {
      throw new Error(`README heading must be a concise label: ${heading}`);
    }
  }

  const newProject = path.join(options.outputRoot, "new-project");
  const newInit = parseJsonOutput(await run(initializer, [
    "--project", newProject,
    "--mode", "new",
    "--project-name", "Neutral Notes",
    "--goal-en", "Maintain a clear, reusable collection of project notes.",
    "--goal-zh", "维护一套清楚、可复用的项目笔记。",
    "--date", options.date,
  ]), "new-project initialization");
  const newValidation = parseJsonOutput(await run(validator, ["--project", newProject]), "new-project validation");
  if (newInit.modules.length !== 0) throw new Error("New neutral project unexpectedly included a domain module.");
  const newProtocolChecks = [
    [path.join(newProject, "AGENTS.md"), "## Conversation-driven project memory"],
    [path.join(newProject, "AGENTS.zh.md"), "## 聊天驱动的项目记忆"],
    [path.join(newProject, "project_management", "00_START_HERE.en.md"), "## PRD intake"],
    [path.join(newProject, "project_management", "00_START_HERE.zh.md"), "## PRD 问询"],
    [path.join(newProject, "project_management", "00_START_HERE.en.md"), "## Completion report"],
    [path.join(newProject, "project_management", "00_START_HERE.zh.md"), "## 完成回报"],
  ];
  for (const [target, fragment] of newProtocolChecks) {
    if (!(await fs.readFile(target, "utf8")).includes(fragment)) {
      throw new Error(`Conversation-maintenance protocol is missing from ${target}.`);
    }
  }
  const architectureChecks = [
    [path.join(newProject, "project_management", "02_current_state", "CODE_ARCHITECTURE.en.md"), "## Architecture change log"],
    [path.join(newProject, "project_management", "02_current_state", "CODE_ARCHITECTURE.zh.md"), "## 架构变更日志"],
  ];
  for (const [target, fragment] of architectureChecks) {
    if (!(await fs.readFile(target, "utf8")).includes(fragment)) {
      throw new Error(`Code-architecture record is missing from ${target}.`);
    }
  }
  const prdFieldChecks = [
    [path.join(newProject, "project_management", "01_goal", "PROJECT_GOAL.en.md"), "## Delivery path"],
    [path.join(newProject, "project_management", "01_goal", "PROJECT_GOAL.zh.md"), "## 交付路径"],
    [path.join(newProject, "project_management", "01_goal", "PROJECT_CONSTRAINTS.en.md"), "## Required tools"],
    [path.join(newProject, "project_management", "01_goal", "PROJECT_CONSTRAINTS.zh.md"), "## 必用工具"],
  ];
  for (const [target, fragment] of prdFieldChecks) {
    if (!(await fs.readFile(target, "utf8")).includes(fragment)) {
      throw new Error(`Detailed PRD field is missing from ${target}.`);
    }
  }
  const classificationChecks = [
    [path.join(newProject, "project_management", "03_active_work", "WORK_PROGRESS.en.md"), "## Active delivery or method identity"],
    [path.join(newProject, "project_management", "03_active_work", "WORK_PROGRESS.zh.md"), "## 当前交付版本或工作方法"],
    [path.join(newProject, "project_management", "04_decisions", "CHANGE_REASONS.en.md"), "## Entry format"],
    [path.join(newProject, "project_management", "04_decisions", "CHANGE_REASONS.zh.md"), "## 记录格式"],
  ];
  for (const [target, fragment] of classificationChecks) {
    if (!(await fs.readFile(target, "utf8")).includes(fragment)) {
      throw new Error(`General project classification document is missing from ${target}.`);
    }
  }
  const newManifest = JSON.parse(await fs.readFile(path.join(newProject, "project_management", "project-management.json"), "utf8"));
  for (const group of ["priority", "planning", "state", "work", "domain", "evidence", "reference", "archive"]) {
    if (!newManifest.groups[group]) throw new Error(`Expected Dashboard group is missing: ${group}.`);
  }
  if (newManifest.schemaVersion !== 2) throw new Error("Neutral project did not receive manifest schema version 2.");
  for (const document of newManifest.documents) {
    if (!document.lifecycle || !document.authority || !document.readWhen?.length || !document.updateWhen?.length || typeof document.privateLookup !== "boolean") {
      throw new Error(`Generated document metadata is incomplete: ${document.id}.`);
    }
  }
  const groupByPair = new Map(newManifest.documents.filter((entry) => entry.lang === "en").map((entry) => [entry.pair, entry.group]));
  for (const [pair, group] of [["goal", "planning"], ["architecture", "state"], ["work-progress", "work"], ["change-reasons", "reference"], ["history", "archive"]]) {
    if (groupByPair.get(pair) !== group) throw new Error(`Unexpected group for ${pair}: ${groupByPair.get(pair)}.`);
  }

  const existingProject = path.join(options.outputRoot, "existing-project");
  await fs.mkdir(path.join(existingProject, "src", "ui"), { recursive: true });
  await fs.mkdir(path.join(existingProject, "project_management", "01_goal"), { recursive: true });
  const originalAgents = "# Existing Agent Rules\n\nKeep this user-owned file unchanged.\n";
  const originalGoal = "# Existing Goal\n\nKeep this user-owned goal unchanged.\n";
  await fs.writeFile(path.join(existingProject, "AGENTS.md"), originalAgents, "utf8");
  await fs.writeFile(path.join(existingProject, "README.md"), "# Existing UI Project\n", "utf8");
  await fs.writeFile(path.join(existingProject, "src", "ui", "App.tsx"), "export function App() { return null; }\n", "utf8");
  await fs.writeFile(path.join(existingProject, "project_management", "01_goal", "PROJECT_GOAL.en.md"), originalGoal, "utf8");

  const existingInit = parseJsonOutput(await run(initializer, [
    "--project", existingProject,
    "--mode", "existing",
    "--project-name", "Existing UI Project",
    "--goal-en", "Maintain the existing user interface without replacing project-owned files.",
    "--goal-zh", "维护现有用户界面，同时保留项目已有文件。",
    "--include", "frontend",
    "--date", options.date,
  ]), "existing-project initialization");
  const existingValidation = parseJsonOutput(await run(validator, ["--project", existingProject]), "existing-project validation");

  if (await fs.readFile(path.join(existingProject, "AGENTS.md"), "utf8") !== originalAgents) {
    throw new Error("Existing AGENTS.md was modified.");
  }
  if (await fs.readFile(path.join(existingProject, "project_management", "01_goal", "PROJECT_GOAL.en.md"), "utf8") !== originalGoal) {
    throw new Error("Existing PROJECT_GOAL.en.md was modified.");
  }
  if (!existingInit.proposals.some((entry) => entry.target.endsWith("AGENTS.md"))) {
    throw new Error("Expected AGENTS.md conflict proposal was not created.");
  }
  const agentsProposal = existingInit.proposals.find((entry) => entry.target.endsWith("AGENTS.md"));
  if (!(await fs.readFile(agentsProposal.proposal, "utf8")).includes("## Conversation-driven project memory")) {
    throw new Error("AGENTS.md proposal is missing the conversation-maintenance protocol.");
  }
  if (!existingInit.modules.includes("frontend")) throw new Error("Confirmed frontend module was not included.");

  const existingManifestPath = path.join(existingProject, "project_management", "project-management.json");
  const legacyManifest = JSON.parse(await fs.readFile(existingManifestPath, "utf8"));
  delete legacyManifest.groups.planning;
  delete legacyManifest.groups.state;
  delete legacyManifest.groups.work;
  delete legacyManifest.groups.archive;
  for (const document of legacyManifest.documents) {
    if (document.pair === "goal") document.group = "priority";
  }
  await fs.writeFile(existingManifestPath, `${JSON.stringify(legacyManifest, null, 2)}\n`, "utf8");

  const migrationInit = parseJsonOutput(await run(initializer, [
    "--project", existingProject,
    "--mode", "existing",
    "--project-name", "Existing UI Project",
    "--goal-en", "Maintain the existing user interface without replacing project-owned files.",
    "--goal-zh", "维护现有用户界面，同时保留项目已有文件。",
    "--include", "frontend",
    "--date", options.date,
  ]), "classification migration");
  const migratedManifest = JSON.parse(await fs.readFile(existingManifestPath, "utf8"));
  const migratedGoal = migratedManifest.documents.find((entry) => entry.pair === "goal" && entry.lang === "en");
  if (migratedGoal?.group !== "planning") throw new Error("Owned manifest classification was not migrated.");
  for (const group of ["planning", "state", "work", "archive"]) {
    if (!migratedManifest.groups[group]) throw new Error(`Owned manifest group was not added during migration: ${group}.`);
  }
  if (!migrationInit.managedUpdated.some((entry) => entry.endsWith("project-management.json"))) {
    throw new Error("Classification migration did not report the owned manifest update.");
  }
  const migratedValidation = parseJsonOutput(await run(validator, ["--project", existingProject]), "classification migration validation");

  const featureProject = path.join(options.outputRoot, "feature-project");
  const featureInit = parseJsonOutput(await run(initializer, [
    "--project", featureProject,
    "--mode", "new",
    "--project-name", "Evidence Lab",
    "--goal-en", "Maintain a reproducible project with explicit process and evidence boundaries.",
    "--goal-zh", "维护一个流程与证据边界明确、可复现的项目。",
    "--include", "research",
    "--include-feature", "process-flow,experiment-log,artifact-registry",
    "--date", options.date,
  ]), "feature-project initialization");
  const featureManifestPath = path.join(featureProject, "project_management", "project-management.json");
  const featureManifest = JSON.parse(await fs.readFile(featureManifestPath, "utf8"));
  for (const pair of ["implementation-flow", "experiment-log", "artifacts"]) {
    if (!featureManifest.documents.some((document) => document.pair === pair && document.lang === "en")) {
      throw new Error(`Feature document pair is missing: ${pair}.`);
    }
  }
  if (!featureManifest.registries?.some((registry) => registry.id === "artifact-registry")) {
    throw new Error("Artifact registry declaration is missing.");
  }
  const featureValidation = parseJsonOutput(await run(validator, ["--project", featureProject]), "feature-project validation");

  const archiveSource = path.join(featureProject, "project_management", "03_active_work", "WORK_PROGRESS.en.md");
  const archiveSourceBefore = await fs.readFile(archiveSource);
  const archiveResult = parseJsonOutput(await run(archiver, [
    "--project", featureProject,
    "--name", "initial_work_progress_20260716",
    "--source", "project_management/03_active_work/WORK_PROGRESS.en.md",
    "--reason-en", "Retain the initialized progress record before a method transition exercise.",
    "--reason-zh", "在方法切换演练前保留初始化工作进展记录。",
    "--active-period-en", "Initialization on 2026-07-16",
    "--active-period-zh", "2026-07-16 初始化期间",
    "--replacement", "Current project-management work progress",
    "--date", options.date,
  ]), "archive package creation");
  if (!archiveSourceBefore.equals(await fs.readFile(archiveSource))) throw new Error("Archive creation modified its source file.");
  const archivedValidation = parseJsonOutput(await run(validator, ["--project", featureProject]), "archive package validation");
  const repeatedArchive = await run(archiver, [
    "--project", featureProject,
    "--name", "initial_work_progress_20260716",
    "--source", "project_management/03_active_work/WORK_PROGRESS.en.md",
    "--reason-en", "This destination must be rejected.",
    "--reason-zh", "该目标目录必须被拒绝。",
    "--date", options.date,
  ]);
  if (repeatedArchive.code === 0) throw new Error("Archive script replaced an existing destination.");

  const missingResearch = await run(initializer, [
    "--project", path.join(options.outputRoot, "invalid-feature-project"),
    "--mode", "new",
    "--include-feature", "experiment-log",
    "--date", options.date,
  ]);
  if (missingResearch.code === 0 || !missingResearch.stderr.includes("requires module: research")) {
    throw new Error("Experiment log did not enforce the research-module requirement.");
  }

  console.log(JSON.stringify({
    ok: newValidation.ok && existingValidation.ok && migratedValidation.ok && featureValidation.ok && archivedValidation.ok,
    outputRoot: options.outputRoot,
    newProject: { initialization: newInit, validation: newValidation },
    existingProject: { initialization: existingInit, validation: existingValidation, migration: migrationInit, migratedValidation },
    featureProject: { initialization: featureInit, validation: featureValidation, archive: archiveResult, archivedValidation },
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
