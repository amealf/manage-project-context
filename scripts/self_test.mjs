import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const initializer = path.join(scriptDirectory, "init_project_management.mjs");
const validator = path.join(scriptDirectory, "validate_project_management.mjs");

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
    [path.join(newProject, "project_management", "00_START_HERE.en.md"), "## Conversation intake and ongoing maintenance"],
    [path.join(newProject, "project_management", "00_START_HERE.zh.md"), "## 聊天内容摄取与持续维护"],
  ];
  for (const [target, fragment] of newProtocolChecks) {
    if (!(await fs.readFile(target, "utf8")).includes(fragment)) {
      throw new Error(`Conversation-maintenance protocol is missing from ${target}.`);
    }
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

  console.log(JSON.stringify({
    ok: newValidation.ok && existingValidation.ok,
    outputRoot: options.outputRoot,
    newProject: { initialization: newInit, validation: newValidation },
    existingProject: { initialization: existingInit, validation: existingValidation },
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
