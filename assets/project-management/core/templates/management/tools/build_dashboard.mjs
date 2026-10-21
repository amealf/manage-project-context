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
        markdown: `# ${missingLabel}\n\n${guidance}\n\nPath: ${spec.path}\n`,
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
  const projectName = manifest.projectName || path.basename(projectRoot);

const html = String.raw`<!doctype html>
<!-- generated-by: manage-project-context -->
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Project Context</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='none' stroke='%232f9d6f' stroke-width='6' stroke-linecap='square' stroke-linejoin='miter' d='M16 12h30v36H24c-6 0-10-4-10-10V12m0 26c2-3 6-4 10-4h22m8-18v34H24c-6 0-10-4-10-10'/%3E%3C/svg%3E">
  <script>
    try {
      document.documentElement.dataset.theme = localStorage.getItem("project-management-theme") || "dark";
    } catch (error) {
      document.documentElement.dataset.theme = "dark";
    }
  </script>
  <style>
    :root {
      color-scheme: dark;
      --bg: #080808;
      --surface: #111111;
      --surface-strong: #1a1a1a;
      --toolbar: rgb(8 8 8 / 0.97);
      --outline-panel: #111111;
      --outline-panel-hover: #202020;
      --outline-line: #6f6f6b;
      --outline-active: #f1f1ef;
      --outline-link-active: #387dc9;
      --ink: #f7f7f5;
      --body: #dededc;
      --sidebar-ink: #b2b2b0;
      --muted: #969694;
      --search-placeholder: #8a8a88;
      --line: #252525;
      --line-strong: #393939;
      --header-divider: rgb(247 247 245 / 0.12);
      --primary: #387dc9;
      --primary-action: #387dc9;
      --primary-dark: #387dc9;
      --primary-soft: #162b42;
      --bold: #387dc9;
      --accent: #387dc9;
      --code-surface: #131313;
      --inline-code-surface: #2b211d;
      --code-ink: #f1a06b;
      --selection: rgb(56 125 201 / 0.48);
      --scroll-track: #080808;
      --scroll-thumb: #343434;
      --scroll-thumb-hover: #4a4a4a;
      --sidebar-scroll-thumb: #2c2c2a;
      --sidebar-scroll-thumb-hover: #3a3a38;
      --shadow: none;
      --focus-ring: rgb(56 125 201 / 0.52);
      --sidebar-width: 270px;
      --toolbar-height: 45px;
      --content-width: 780px;
      --header-visual-offset: -18px;
      --body-visual-offset: 22px;
      --reference-header-inset: 144px;
      --reference-body-inset: 166px;
      --reference-header-width: 780px;
      --page-title-size: 30px;
      --page-title-line: 38px;
      --heading-1-size: 24px;
      --heading-1-line: 31px;
      --heading-2-size: 19px;
      --heading-2-line: 25px;
      --heading-3-size: 16px;
      --heading-3-line: 22px;
      --body-size: 16px;
      --body-line: 24px;
      --sidebar-item-size: 14px;
      --sidebar-item-line: 21px;
      --outline-item-size: 13px;
      --outline-item-line: 16.9px;
    }

    :root[data-theme="light"] {
      color-scheme: light;
      --bg: #ffffff;
      --surface: #f7f8fa;
      --surface-strong: #eaf0f6;
      --toolbar: rgb(255 255 255 / 0.95);
      --outline-panel: #ffffff;
      --outline-panel-hover: #edf2f7;
      --outline-line: #66758b;
      --outline-active: #1f2937;
      --outline-link-active: #387dc9;
      --ink: #121a28;
      --body: #2f3a4a;
      --sidebar-ink: #606f84;
      --muted: #71809a;
      --search-placeholder: #8a96a8;
      --line: #dbe3ec;
      --line-strong: #cbd6e2;
      --header-divider: rgb(18 26 40 / 0.10);
      --primary: #387dc9;
      --primary-action: #387dc9;
      --primary-dark: #387dc9;
      --primary-soft: #e8f1fb;
      --bold: #387dc9;
      --accent: #387dc9;
      --code-surface: #f3f6f9;
      --inline-code-surface: #fff0e8;
      --code-ink: #a84d11;
      --selection: rgb(56 125 201 / 0.24);
      --scroll-track: #eef2f6;
      --scroll-thumb: #b8c4cf;
      --scroll-thumb-hover: #92a4b4;
      --sidebar-scroll-thumb: #e2e6ea;
      --sidebar-scroll-thumb-hover: #d4d9df;
      --shadow: 0 12px 30px rgb(31 48 68 / 0.09);
      --focus-ring: rgb(56 125 201 / 0.45);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; background: var(--bg); }
    body {
      margin: 0;
      min-width: 320px;
      background: var(--bg);
      color: var(--body);
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, "Microsoft YaHei", sans-serif;
      font-size: var(--body-size);
      line-height: var(--body-line);
      letter-spacing: 0;
    }
    ::selection { background: var(--selection); }
    html, body, .outline {
      scrollbar-color: var(--scroll-thumb) var(--scroll-track);
      scrollbar-width: thin;
    }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: var(--scroll-track); }
    ::-webkit-scrollbar-thumb {
      border: 2px solid var(--scroll-track);
      border-radius: 6px;
      background: var(--scroll-thumb);
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--scroll-thumb-hover); }
    ::-webkit-scrollbar-corner { background: var(--scroll-track); }
    button, input, select { font: inherit; letter-spacing: 0; }
    button, a { -webkit-tap-highlight-color: transparent; }
    a { color: var(--accent); text-underline-offset: 3px; }
    a:hover { color: var(--primary-dark); }
    :focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 2px; }

    .app-shell {
      display: grid;
      grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
      min-height: 100vh;
      transition: grid-template-columns 200ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    .app-shell.sidebar-collapsed { grid-template-columns: 0 minmax(0, 1fr); }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .brand-copy { min-width: 0; flex: 1 1 auto; align-self: flex-start; }
    .brand-title { margin: 0; color: var(--ink); font-size: 15px; font-weight: 600; line-height: 21px; white-space: normal; overflow-wrap: anywhere; }
    .sidebar-header { display: flex; align-items: center; gap: 8px; min-height: 95px; padding: 14px 16px; border-bottom: 1px solid transparent; }
    .sidebar-control-button {
      position: relative;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }
    .sidebar-control-button:hover { background: var(--surface-strong); color: var(--ink); }
    .sidebar-control-button:focus:not(:focus-visible) { outline: none; }
    .sidebar-close-button { width: 28px; height: 28px; }
    .sidebar-control-icon { width: 16px; height: 16px; }
    .sidebar-open-button { display: none; width: 39.6px; height: 39.6px; }
    .sidebar-open-button .sidebar-control-icon { width: 22.77px; height: 22.77px; }
    .app-shell.sidebar-collapsed .sidebar-open-button { display: grid; }
    .sidebar-control-tooltip {
      position: fixed;
      z-index: 70;
      display: grid;
      gap: 2px;
      width: max-content;
      min-width: 132px;
      padding: 8px 10px;
      border: 1px solid #444440;
      border-radius: 6px;
      background: #2b2b29;
      color: #f5f5f3;
      box-shadow: 0 4px 14px rgb(0 0 0 / 28%);
      font-size: 12px;
      line-height: 16px;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-2px) scale(0.98);
      transform-origin: top left;
      transition: opacity 90ms ease, transform 120ms ease;
      transition-delay: 0ms;
    }
    .sidebar-control-button:hover .sidebar-control-tooltip,
    .sidebar-control-button:focus-visible .sidebar-control-tooltip {
      opacity: 1;
      transform: translateY(0) scale(1);
      transition-delay: 250ms;
    }
    .sidebar-close-button .sidebar-control-tooltip { top: 54px; left: calc(var(--sidebar-width) + 8px); }
    .sidebar-open-button .sidebar-control-tooltip { top: 8px; left: 52px; }
    .sidebar-tooltip-title { font-weight: 550; }
    .sidebar-tooltip-shortcut { color: #aaa9a5; }
    .theme-icon-button {
      width: 39.6px;
      height: 39.6px;
      display: grid;
      place-items: center;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--bg);
      color: var(--ink);
      cursor: pointer;
    }
    .theme-icon-button:hover { background: var(--surface-strong); }
    .theme-icon { font-size: 24.035px; line-height: 1; }
    .language-icon-button {
      min-width: 39.6px;
      height: 39.6px;
      display: grid;
      place-items: center;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: var(--ink);
      font-size: 15.18px;
      font-weight: 650;
      line-height: 1;
      cursor: pointer;
    }
    .language-icon-button:hover { background: var(--surface-strong); }

    .mobile-document-select { display: none; padding: 14px 20px 0; }
    #document-select {
      width: 100%;
      height: 38px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--bg);
      color: var(--ink);
      padding: 0 10px;
    }

    .sidebar {
      position: sticky;
      top: 0;
      align-self: start;
      display: flex;
      flex-direction: column;
      width: var(--sidebar-width);
      min-width: 0;
      height: 100vh;
      overflow: clip;
      border-right: 1px solid var(--line);
      background: var(--surface);
      opacity: 1;
      transform: translateX(0);
      transition: width 200ms cubic-bezier(0.25, 1, 0.5, 1), opacity 140ms ease, transform 200ms cubic-bezier(0.25, 1, 0.5, 1), border-color 140ms ease;
    }
    .sidebar-scroll-region {
      min-height: 0;
      flex: 1 1 auto;
      overflow-y: auto;
      scrollbar-color: auto;
      scrollbar-gutter: stable;
      scrollbar-width: auto;
    }
    .app-shell.sidebar-collapsed .sidebar {
      width: 0;
      border-right-color: transparent;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-8px);
    }
    @supports (-moz-appearance: none) {
      .sidebar-scroll-region { scrollbar-color: var(--sidebar-scroll-thumb) var(--surface); }
    }
    .sidebar-scroll-region::-webkit-scrollbar { width: 13.6px; }
    .sidebar-scroll-region::-webkit-scrollbar-track,
    .sidebar-scroll-region::-webkit-scrollbar-track-piece { background: var(--surface); }
    .sidebar-scroll-region::-webkit-scrollbar-thumb {
      min-height: 44px;
      border: 0;
      border-radius: 999px;
      background: var(--sidebar-scroll-thumb);
      box-shadow: inset 3.4px 0 0 var(--surface), inset -3.4px 0 0 var(--surface);
    }
    .sidebar-scroll-region::-webkit-scrollbar-thumb:hover { background: var(--sidebar-scroll-thumb-hover); }
    .sidebar-scroll-region::-webkit-scrollbar-button:single-button {
      width: 13.6px;
      height: 16px;
      display: block;
      border: 0;
      background-color: var(--surface);
      background-position: center;
      background-repeat: no-repeat;
      background-size: 6.8px 5px;
    }
    .sidebar-scroll-region::-webkit-scrollbar-button:single-button:vertical:decrement {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M1 5 4 1l3 4Z' fill='%23343432'/%3E%3C/svg%3E");
    }
    .sidebar-scroll-region::-webkit-scrollbar-button:single-button:vertical:increment {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M1 0 4 4l3-4Z' fill='%23343432'/%3E%3C/svg%3E");
    }
    :root[data-theme="light"] .sidebar-scroll-region::-webkit-scrollbar-button:single-button:vertical:decrement {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M1 5 4 1l3 4Z' fill='%23c7cdd4'/%3E%3C/svg%3E");
    }
    :root[data-theme="light"] .sidebar-scroll-region::-webkit-scrollbar-button:single-button:vertical:increment {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M1 0 4 4l3-4Z' fill='%23c7cdd4'/%3E%3C/svg%3E");
    }
    .sidebar-navigation { padding: 10px 8px 24px; }
    .nav-group + .nav-group { margin-top: 18px; }
    .nav-group-title {
      margin: 0 10px 6px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 500;
      line-height: 12px;
    }
    .nav-list { display: grid; gap: 0; }
    .nav-item {
      width: 100%;
      min-height: 30px;
      display: grid;
      grid-template-columns: 3px 1fr;
      align-items: center;
      gap: 8px;
      border: 0;
      border-radius: 5px;
      padding: 3px 8px 3px 6px;
      background: transparent;
      color: var(--sidebar-ink);
      font-size: var(--sidebar-item-size);
      font-weight: 500;
      line-height: var(--sidebar-item-line);
      text-align: left;
      cursor: pointer;
    }
    .nav-item:hover { background: var(--surface-strong); }
    .nav-item.active { background: var(--primary-soft); color: var(--primary-dark); font-weight: 600; }
    .nav-marker { width: 3px; height: 18px; border-radius: 2px; background: transparent; }
    .nav-item.active .nav-marker { background: var(--primary); }
    .nav-item[hidden] { display: none; }
    .nav-empty { display: none; margin: 14px 8px; color: var(--muted); font-size: 13px; }

    .content-column { min-width: 0; }
    .content-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      min-height: var(--toolbar-height);
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 0;
      background: var(--bg);
      backdrop-filter: none;
    }
    .toolbar-leading { min-width: 0; display: flex; align-items: center; gap: 4px; flex: 1 1 auto; }
    .toolbar-location {
      min-width: 0;
      flex: 1 1 auto;
      color: var(--muted);
      font-size: 15.18px;
      line-height: 22.77px;
      overflow-wrap: anywhere;
      text-wrap: pretty;
    }
    .document-path-segment { white-space: nowrap; }
    .toolbar-actions { display: flex; align-items: center; gap: 2px; flex: 0 0 auto; }
    .toolbar-search {
      --search-width: 240px;
      display: grid;
      grid-template-columns: 0fr 39.6px;
      align-items: center;
      transition: grid-template-columns 180ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    .toolbar-search.expanded { grid-template-columns: minmax(0, var(--search-width)) 39.6px; }
    .toolbar-search-field {
      min-width: 0;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateX(8px) scale(0.94);
      transform-origin: right center;
      transition: opacity 110ms ease-in, transform 150ms cubic-bezier(0.4, 0, 1, 1);
    }
    .toolbar-search.expanded .toolbar-search-field {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(0) scale(1);
      transition-duration: 140ms, 200ms;
      transition-timing-function: ease-out, cubic-bezier(0.22, 1, 0.36, 1);
    }
    #search {
      width: calc(var(--search-width) - 8px);
      height: 32px;
      margin-right: 8px;
      padding: 0 10px;
      border: 1px solid var(--line-strong);
      border-radius: 12px;
      background: var(--surface);
      color: var(--ink);
      caret-color: var(--ink);
      font-size: 13px;
    }
    #search::placeholder { color: var(--search-placeholder); opacity: 1; }
    #search:focus, #search:focus-visible { outline: none; border-color: var(--line-strong); box-shadow: none; }
    .search-icon-button {
      width: 39.6px;
      height: 39.6px;
      display: grid;
      place-items: center;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }
    .search-icon-button:focus:not(:focus-visible) { outline: none; }
    .search-icon-button:hover { background: var(--surface-strong); }
    .search-icon { width: 22.77px; height: 22.77px; }
    .toolbar-theme-toggle { border-color: transparent; background: transparent; box-shadow: none; }
    .main {
      min-width: 0;
      padding: 30px 80px 80px;
      background: var(--bg);
    }
    .document-header {
      max-width: var(--content-width);
      margin: 0 auto 56px;
      padding: 0;
      position: relative;
      left: var(--header-visual-offset);
    }
    .document-header::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: -28px;
      left: 0;
      height: 0.5px;
      background: var(--header-divider);
    }
    .eyebrow { margin: 0 0 12px; color: var(--muted); font-size: 12px; font-weight: 700; line-height: 18px; }
    .document-status { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 12px; }
    .document-badge {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 2px 8px;
      background: var(--surface);
      color: var(--body);
      font-size: 11px;
      font-weight: 650;
      line-height: 16px;
    }
    .document-badge[data-kind="lifecycle"] { border-color: color-mix(in srgb, var(--primary) 38%, var(--line)); color: var(--primary-dark); }
    .document-badge[data-kind="authority"][data-value="private-lookup"] { border-color: var(--line-strong); color: var(--muted); }
    .document-header-row { display: block; }
    .document-title { margin: 0; color: var(--ink); font-size: var(--page-title-size); font-weight: 700; line-height: var(--page-title-line); letter-spacing: 0; text-wrap: balance; }
    .document-lead { max-width: 620px; margin: 10px 0 0; color: var(--body); font-size: 14px; font-weight: 400; line-height: 21px; }
    .document-footer {
      max-width: var(--content-width);
      margin: 52px auto 0;
      padding: 15px 0 0;
      border-top: 1px solid var(--line);
      position: relative;
      left: var(--body-visual-offset);
    }
    .document-updated { color: var(--muted); font-size: 12px; line-height: 18px; }

    .markdown-body { max-width: var(--content-width); margin: 0 auto; position: relative; left: var(--body-visual-offset); overflow-wrap: anywhere; }
    .markdown-body > h1:first-child { display: none; }
    .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
      color: var(--ink);
      letter-spacing: 0;
      scroll-margin-top: calc(var(--toolbar-height) + 18px);
    }
    .markdown-body h2 { margin: 1.5em 0 0.405em; padding: 0; border: 0; font-size: var(--heading-1-size); font-weight: 600; line-height: var(--heading-1-line); }
    .markdown-body h3 { margin: 1.4em 0 0.36em; font-size: var(--heading-2-size); font-weight: 600; line-height: var(--heading-2-line); }
    .markdown-body h4 { margin: 1.25em 0 0.315em; font-size: var(--heading-3-size); font-weight: 600; line-height: var(--heading-3-line); }
    .markdown-body p { margin: 0.5em 0; }
    .markdown-body strong, .markdown-body b { color: var(--bold); font-weight: 760; }
    .markdown-body ul, .markdown-body ol { padding-left: 1.45em; }
    .markdown-body li + li { margin-top: 0.28em; }
    .markdown-body blockquote {
      margin: 1.2em 0;
      padding: 10px 14px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--surface);
      color: var(--body);
    }
    .markdown-body code {
      border: 0;
      border-radius: 6px;
      background: var(--inline-code-surface);
      padding: 0.08em 0.34em;
      color: var(--code-ink);
      font-family: "Cascadia Code", Consolas, monospace;
      font-size: 0.88em;
    }
    .markdown-body pre {
      overflow: auto;
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--code-surface);
    }
    .markdown-body pre code { border: 0; background: transparent; padding: 0; color: var(--ink); }
    .markdown-body img {
      display: block;
      width: auto;
      max-width: 100%;
      height: auto;
      margin: 1.35em auto;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--surface);
    }
    .markdown-body table {
      display: block;
      width: 100%;
      overflow-x: auto;
      border-collapse: collapse;
      margin: 1.25em 0;
      font-size: 13px;
    }
    .markdown-body th, .markdown-body td {
      min-width: 120px;
      padding: 9px 11px;
      border: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
    }
    .markdown-body th { background: var(--surface-strong); font-weight: 760; }
    .markdown-body tbody tr:nth-child(even) { background: var(--surface); }
    .markdown-body hr { border: 0; border-top: 1px solid var(--line); margin: 2em 0; }

    .outline {
      position: fixed;
      top: 50%;
      right: 16px;
      z-index: 30;
      width: 20px;
      overflow: visible;
      padding: 0;
      transform: translateY(-50%);
    }
    .outline-trigger {
      width: 100%;
      display: grid;
      align-content: start;
      justify-items: center;
      gap: 12px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--outline-line);
      cursor: pointer;
    }
    .outline-trigger:hover { color: var(--ink); }
    .outline-trigger span {
      display: block;
      width: 20px;
      height: 2px;
      border-radius: 4px;
      background: currentColor;
      opacity: 0.9;
    }
    .outline-trigger span.active {
      background: var(--outline-active);
      box-shadow: 0 0 5px rgb(255 255 255 / 0.46);
      opacity: 1;
    }
    .outline-panel {
      position: absolute;
      top: 50%;
      right: 0;
      width: min(232px, calc(100vw - 84px));
      max-height: min(520px, calc(100vh - 72px));
      display: flex;
      flex-direction: column;
      padding: 12px;
      border: 1px solid #383836;
      border-radius: 14px;
      background: var(--outline-panel);
      box-shadow: var(--shadow);
      opacity: 0;
      pointer-events: none;
      transform: translateY(-50%);
      transition: opacity 140ms ease;
    }
    .outline-panel::after {
      content: "";
      position: absolute;
      top: 0;
      right: -28px;
      width: 28px;
      height: 100%;
    }
    .outline:hover .outline-panel, .outline:focus-within .outline-panel {
      opacity: 1;
      pointer-events: auto;
    }
    .outline-list { display: grid; gap: 2px; overflow-y: auto; padding-right: 4px; }
    .outline-link {
      display: block;
      padding: 5px 7px;
      border-radius: 5px;
      color: #b4b4b0;
      font-size: var(--outline-item-size);
      font-weight: 400;
      line-height: 19px;
      text-decoration: none;
    }
    .outline-text { min-width: 0; white-space: normal; overflow-wrap: anywhere; }
    .outline-link.level-3 { margin-left: 12px; }
    .outline-link.level-4 { margin-left: 24px; color: var(--muted); font-size: 12px; }
    .outline-link:hover, .outline-link.active { background: var(--outline-panel-hover); color: var(--outline-link-active); }
    @media (min-width: 1400px) {
      .main { padding: 45px 0 80px; }
      .document-header {
        width: min(var(--reference-header-width), calc(100% - var(--reference-header-inset) - 48px));
        max-width: none;
        margin: 0 0 56px var(--reference-header-inset);
        left: 0;
      }
      .document-header::after { bottom: -28px; }
      .eyebrow { margin-bottom: 14px; }
      .document-lead { margin-top: 12px; }
      .markdown-body {
        width: min(var(--content-width), calc(100% - var(--reference-body-inset) - 48px));
        max-width: none;
        margin: 0 0 0 var(--reference-body-inset);
        left: 0;
      }
      .markdown-body h2 {
        margin: 28px 0 18px;
        padding-bottom: 5px;
        font-size: 27px;
        font-weight: 700;
        line-height: 35px;
      }
      .document-footer {
        width: min(var(--content-width), calc(100% - var(--reference-body-inset) - 48px));
        max-width: none;
        margin: 52px 0 0 var(--reference-body-inset);
        left: 0;
      }
    }
    @media (max-width: 1100px) {
      .app-shell { grid-template-columns: var(--sidebar-width) minmax(0, 1fr); }
    }
    @media (max-width: 780px) {
      .app-shell { display: block; }
      .sidebar,
      .app-shell.sidebar-collapsed .sidebar { position: static; width: 100%; height: auto; overflow: visible; border-right: 0; border-bottom: 1px solid var(--line); opacity: 1; pointer-events: auto; transform: none; }
      .sidebar-header { padding: 16px 18px; }
      .sidebar-scroll-region { overflow: visible; }
      .sidebar-control-button { display: none !important; }
      .mobile-document-select { display: block; }
      .sidebar-navigation { display: none; }
      .content-toolbar { position: static; min-height: 50px; flex-wrap: wrap; padding: 10px 18px; }
      .toolbar-leading { width: 100%; order: 2; }
      .toolbar-location { width: 100%; }
      .toolbar-search { --search-width: min(180px, calc(100vw - 164px)); }
      .main { padding: 24px 18px 60px; }
      .document-header, .markdown-body, .document-footer { left: 0; }
      .document-header { margin-bottom: 56px; }
      .document-header::after { bottom: -28px; }
      .document-title { font-size: 32px; }
      .document-lead { font-size: 14px; line-height: 21px; }
      .markdown-body h2 { font-size: 22px; line-height: 29px; }
      .markdown-body h3 { font-size: 18px; line-height: 24px; }
      .markdown-body h4 { font-size: 16px; line-height: 22px; }
      .markdown-body table { width: calc(100vw - 36px); }
      .outline { right: 14px; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .app-shell, .sidebar, .sidebar-control-tooltip, .toolbar-search, .toolbar-search-field, .toolbar-search.expanded .toolbar-search-field { transition-duration: 0.01ms; }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar" id="project-sidebar" aria-label="Project documents">
      <header class="sidebar-header">
        <div class="brand-copy">
          <p class="brand-title" id="project-name">Project Context</p>
        </div>
        <button type="button" class="sidebar-control-button sidebar-close-button" id="sidebar-close-toggle" aria-controls="project-sidebar" aria-expanded="true" aria-keyshortcuts="Control+Backslash">
          <svg class="sidebar-control-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 4 12l7 7"></path><path d="m18 5-7 7 7 7"></path></svg>
          <span class="sidebar-control-tooltip" role="tooltip"><span class="sidebar-tooltip-title">Close sidebar</span><span class="sidebar-tooltip-shortcut">Ctrl+&#92;</span></span>
          <span class="sr-only">Close sidebar</span>
        </button>
      </header>
      <div class="sidebar-scroll-region">
        <div class="mobile-document-select">
          <select id="document-select" aria-label="Select document"></select>
        </div>
        <nav class="sidebar-navigation" aria-label="Project documents">
          <div id="document-navigation"></div>
          <p class="nav-empty" id="nav-empty">No matching documents.</p>
        </nav>
      </div>
    </aside>

    <section class="content-column">
      <header class="content-toolbar">
        <div class="toolbar-leading">
          <button type="button" class="sidebar-control-button sidebar-open-button" id="sidebar-open-toggle" aria-controls="project-sidebar" aria-expanded="true" aria-keyshortcuts="Control+Backslash">
            <svg class="sidebar-control-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path></svg>
            <span class="sidebar-control-tooltip" role="tooltip"><span class="sidebar-tooltip-title">Lock sidebar open</span><span class="sidebar-tooltip-shortcut">Ctrl+&#92;</span></span>
            <span class="sr-only">Lock sidebar open</span>
          </button>
          <div class="toolbar-location document-path" id="document-path"></div>
        </div>
        <div class="toolbar-actions">
          <div class="toolbar-search" id="toolbar-search">
            <div class="toolbar-search-field">
              <input id="search" type="search" autocomplete="off" placeholder="Search documents and content" aria-label="Search documents and content">
            </div>
            <button type="button" class="search-icon-button" id="search-toggle" aria-label="Search documents and content" aria-controls="search" aria-expanded="false" title="Search documents and content">
              <svg class="search-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
              <span class="sr-only">Search documents and content</span>
            </button>
          </div>
          <button type="button" class="language-icon-button" id="language-toggle" aria-label="切换到英文" title="切换到英文">
            <span class="language-icon" aria-hidden="true">CN</span>
            <span class="sr-only">切换到英文</span>
          </button>
          <button type="button" class="theme-icon-button toolbar-theme-toggle" data-theme-toggle aria-label="切换黑白背景" title="切换黑白背景">
            <span class="theme-icon" aria-hidden="true">◐</span>
            <span class="sr-only">切换黑白背景</span>
          </button>
        </div>
      </header>
      <main class="main">
      <header class="document-header">
        <div class="eyebrow" id="document-group"></div>
        <div class="document-status" id="document-status">
          <span class="document-badge" id="document-lifecycle" data-kind="lifecycle"></span>
          <span class="document-badge" id="document-authority" data-kind="authority"></span>
        </div>
        <div class="document-header-row">
          <h1 class="document-title" id="document-title"></h1>
          <p class="document-lead" id="document-lead"></p>
        </div>
      </header>
      <article class="markdown-body" id="markdown-content"></article>
      <footer class="document-footer"><div class="document-updated" id="document-updated"></div></footer>
      </main>
    </section>

    <aside class="outline" aria-label="Document outline">
      <button type="button" class="outline-trigger" id="outline-trigger" aria-label="本页目录" aria-expanded="false" title="本页目录">
      </button>
      <div class="outline-panel" id="outline-panel">
      <div class="outline-list" id="outline-list"></div>
      </div>
    </aside>
  </div>
  <script src="assets/marked.umd.js"></script>
  <script>
    const PROJECT_NAME = __PROJECT_NAME_JSON__;
    const MANIFEST = __MANIFEST_JSON__;
    const DOCUMENTS = __DOCS_JSON__;
    const GROUP_ORDER = Object.keys(MANIFEST.groups || {});
    const COPY = {
      en: {
        search: "Search documents and content",
        closeSidebar: "Close sidebar",
        openSidebar: "Lock sidebar open",
        themeToggle: "Toggle black and white background",
        languageToggle: "Switch to Chinese",
        empty: "No matching documents.",
        lifecycle: "Lifecycle",
        authority: "Authority",
        modified: "Updated",
        subtitle: "Project documents and working records",
        groups: { priority: "Read first", planning: "Goals and constraints", state: "Current state", work: "Active work", domain: "Domain rules", evidence: "Evidence and artifacts", reference: "Project reference", archive: "History and archive" },
        lifecycleValues: { active: "Active", proposed: "Proposed", historical: "Historical", retired: "Retired", unconfirmed: "Unconfirmed" },
        authorityValues: { operational: "Operational source", review: "Review mirror", reference: "Reference", "private-lookup": "Private lookup" },
      },
      zh: {
        search: "搜索文档标题和正文",
        closeSidebar: "关闭侧栏",
        openSidebar: "固定打开侧栏",
        themeToggle: "切换黑白背景",
        languageToggle: "切换到英文",
        empty: "没有匹配的文档。",
        lifecycle: "生命周期",
        authority: "管理权威",
        modified: "更新时间",
        subtitle: "项目文档与工作记录",
        groups: { priority: "优先阅读", planning: "目标与约束", state: "当前状态", work: "当前工作", domain: "领域规则", evidence: "证据与产物", reference: "项目参考", archive: "历史与存档" },
        lifecycleValues: { active: "当前", proposed: "提案", historical: "历史", retired: "已退役", unconfirmed: "待确认" },
        authorityValues: { operational: "执行来源", review: "审阅镜像", reference: "参考材料", "private-lookup": "私人查阅" },
      },
    };

    const HAS_ZH = DOCUMENTS.some(function (doc) { return doc.lang === "zh"; });
    const state = {
      language: HAS_ZH && MANIFEST.defaultLanguage !== "en" ? "zh" : "en",
      pair: "agent-rules",
      query: "",
      theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
      sidebarCollapsed: false,
    };
    const byId = new Map(DOCUMENTS.map(function (doc) { return [doc.id, doc]; }));
    const content = document.getElementById("markdown-content");
    const navigation = document.getElementById("document-navigation");
    const documentSelect = document.getElementById("document-select");
    const search = document.getElementById("search");
    const toolbarSearch = document.getElementById("toolbar-search");
    const searchToggle = document.getElementById("search-toggle");
    const languageToggle = document.getElementById("language-toggle");
    const appShell = document.querySelector(".app-shell");
    const sidebar = document.getElementById("project-sidebar");
    const sidebarCloseToggle = document.getElementById("sidebar-close-toggle");
    const sidebarOpenToggle = document.getElementById("sidebar-open-toggle");
    const sidebarMedia = window.matchMedia("(min-width: 781px)");
    const outlineShell = document.querySelector(".outline");
    const outlineTrigger = document.getElementById("outline-trigger");
    let outlineEntries = [];
    let outlineFrame = 0;

    try {
      state.sidebarCollapsed = localStorage.getItem("project-dashboard-sidebar-collapsed") === "true";
    } catch (error) {
      // The page still works when local storage is blocked.
    }

    marked.setOptions({ gfm: true, breaks: false });

    function currentDocument() {
      return byId.get(state.pair + "." + state.language) || byId.get("agent-rules." + state.language) || localizedDocuments()[0];
    }

    function groupLabel(group) {
      const labels = MANIFEST.groups && MANIFEST.groups[group];
      return (labels && (labels[state.language] || labels.en || labels.zh)) || COPY[state.language].groups[group] || group;
    }

    function localizedDocuments() {
      return DOCUMENTS.filter(function (doc) { return doc.lang === state.language; });
    }

    function slug(text, index) {
      const value = text.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
      return value || "section-" + index;
    }

    function renderOutline() {
      const outline = document.getElementById("outline-list");
      outline.replaceChildren();
      outlineEntries = [];
      Array.from(content.querySelectorAll("h2, h3, h4")).forEach(function (heading, index) {
        heading.id = slug(heading.textContent, index);
        const link = document.createElement("a");
        link.className = "outline-link level-" + heading.tagName.slice(1);
        link.href = "#" + heading.id;
        const text = document.createElement("span");
        text.className = "outline-text";
        text.textContent = heading.textContent;
        link.append(text);
        link.addEventListener("click", function (event) {
          event.preventDefault();
          heading.scrollIntoView({ block: "start" });
          link.blur();
        });
        outline.appendChild(link);
        outlineEntries.push({ heading: heading, link: link });
      });
      const rail = document.createDocumentFragment();
      outlineEntries.forEach(function () { rail.appendChild(document.createElement("span")); });
      outlineTrigger.replaceChildren(rail);
      scheduleOutlineUpdate();
    }

    function updateOutlineState() {
      outlineFrame = 0;
      if (!outlineEntries.length) return;
      const marker = 110;
      let activeIndex = 0;
      outlineEntries.forEach(function (entry, index) {
        if (entry.heading.getBoundingClientRect().top <= marker) activeIndex = index;
      });
      outlineEntries.forEach(function (entry, index) {
        entry.link.classList.toggle("active", index === activeIndex);
      });
      const bars = Array.from(outlineTrigger.children);
      bars.forEach(function (bar, index) {
        bar.classList.toggle("active", index === activeIndex);
      });
    }

    function scheduleOutlineUpdate() {
      if (outlineFrame) return;
      outlineFrame = requestAnimationFrame(updateOutlineState);
    }

    function renderNavigation() {
      const copy = COPY[state.language];
      const query = state.query.trim().toLocaleLowerCase();
      navigation.replaceChildren();
      documentSelect.replaceChildren();
      let matchCount = 0;

      GROUP_ORDER.forEach(function (group) {
        const docs = localizedDocuments().filter(function (doc) { return doc.group === group; });
        const matchingDocs = docs.filter(function (doc) {
          const haystack = (doc.title + " " + doc.path + " " + doc.markdown).toLocaleLowerCase();
          return !query || haystack.includes(query);
        });
        if (!matchingDocs.length) return;
        const section = document.createElement("section");
        section.className = "nav-group";
        const heading = document.createElement("h2");
        heading.className = "nav-group-title";
        heading.textContent = groupLabel(group);
        const list = document.createElement("div");
        list.className = "nav-list";

        matchingDocs.forEach(function (doc) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "nav-item" + (doc.pair === state.pair ? " active" : "");
          button.innerHTML = '<span class="nav-marker"></span><span></span>';
          button.lastElementChild.textContent = doc.title;
          button.addEventListener("click", function () { selectPair(doc.pair); });
          list.appendChild(button);

          const option = document.createElement("option");
          option.value = doc.pair;
          option.textContent = groupLabel(group) + " · " + doc.title;
          option.selected = doc.pair === state.pair;
          documentSelect.appendChild(option);
          matchCount += 1;
        });

        section.append(heading, list);
        navigation.appendChild(section);
      });

      document.getElementById("nav-empty").style.display = matchCount ? "none" : "block";
    }

    function sanitizeRenderedContent() {
      content.querySelectorAll("script, iframe, object, embed, link, style").forEach(function (element) { element.remove(); });
      content.querySelectorAll("*").forEach(function (element) {
        Array.from(element.attributes).forEach(function (attribute) {
          if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
        });
        ["href", "src"].forEach(function (attributeName) {
          const value = element.getAttribute(attributeName);
          if (value && /^\s*javascript:/i.test(value)) element.removeAttribute(attributeName);
        });
      });
    }

    function renderDocument() {
      const doc = currentDocument();
      const copy = COPY[state.language];
      document.getElementById("project-name").textContent = PROJECT_NAME;
      document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
      search.placeholder = copy.search;
      search.setAttribute("aria-label", copy.search);
      searchToggle.setAttribute("aria-label", copy.search);
      searchToggle.setAttribute("title", copy.search);
      searchToggle.querySelector(".sr-only").textContent = copy.search;
      [sidebarCloseToggle, sidebarOpenToggle].forEach(function (button) {
        const label = button === sidebarCloseToggle ? copy.closeSidebar : copy.openSidebar;
        button.setAttribute("aria-label", label);
        button.querySelector(".sr-only").textContent = label;
        button.querySelector(".sidebar-tooltip-title").textContent = label;
      });
      document.getElementById("nav-empty").textContent = copy.empty;
      document.getElementById("document-group").textContent = groupLabel(doc.group);
      const lifecycle = doc.lifecycle || "unconfirmed";
      const authority = doc.authority || (doc.lang === "zh" ? "review" : "reference");
      const lifecycleBadge = document.getElementById("document-lifecycle");
      const authorityBadge = document.getElementById("document-authority");
      lifecycleBadge.dataset.value = lifecycle;
      lifecycleBadge.textContent = copy.lifecycle + " · " + (copy.lifecycleValues[lifecycle] || lifecycle);
      authorityBadge.dataset.value = authority;
      authorityBadge.textContent = copy.authority + " · " + (copy.authorityValues[authority] || authority);
      document.getElementById("document-title").textContent = doc.title;
      document.getElementById("document-lead").textContent = doc.lead || doc.title;
      const documentPath = document.getElementById("document-path");
      documentPath.replaceChildren();
      doc.path.replaceAll("/", "\\").split("\\").forEach(function (segment, index, segments) {
        const pathSegment = document.createElement("span");
        pathSegment.className = "document-path-segment";
        pathSegment.textContent = (index > 0 ? "\\" : "") + segment;
        documentPath.appendChild(pathSegment);
        if (index < segments.length - 1) documentPath.appendChild(document.createElement("wbr"));
      });
      document.getElementById("document-updated").textContent = doc.modified
        ? copy.modified + " " + new Date(doc.modified).toLocaleString(state.language === "zh" ? "zh-CN" : "en-GB", { dateStyle: "medium", timeStyle: "short" })
        : "";
      content.innerHTML = marked.parse(doc.markdown);
      sanitizeRenderedContent();
      const documentDirectory = doc.path.replace(/[^/]+$/, "");
      content.querySelectorAll("img[src]").forEach(function (image) {
        const source = image.getAttribute("src");
        if (source && !/^(?:[a-z]+:|\/|#)/i.test(source)) {
          image.setAttribute("src", documentDirectory + source);
        }
      });
      content.querySelectorAll("a").forEach(function (link) {
        if (/^https?:/i.test(link.href)) {
          link.target = "_blank";
          link.rel = "noreferrer";
        }
      });
      renderOutline();
      renderNavigation();
      document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
        button.setAttribute("aria-label", copy.themeToggle);
        button.setAttribute("title", copy.themeToggle);
        button.setAttribute("aria-pressed", String(state.theme === "light"));
        button.querySelector(".sr-only").textContent = copy.themeToggle;
        button.querySelector(".theme-icon").textContent = state.theme === "dark" ? "◐" : "◑";
      });
      languageToggle.hidden = !HAS_ZH;
      languageToggle.setAttribute("aria-label", copy.languageToggle);
      languageToggle.setAttribute("title", copy.languageToggle);
      languageToggle.querySelector(".sr-only").textContent = copy.languageToggle;
      languageToggle.querySelector(".language-icon").textContent = state.language === "zh" ? "CN" : "EN";
      document.title = doc.title + " · " + PROJECT_NAME;
    }

    function selectPair(pair) {
      state.pair = pair;
      history.replaceState(null, "", "#" + pair + "." + state.language);
      renderDocument();
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    function setSearchExpanded(expanded) {
      toolbarSearch.classList.toggle("expanded", expanded);
      searchToggle.setAttribute("aria-expanded", String(expanded));
      if (expanded) requestAnimationFrame(function () { search.focus(); });
    }

    function setSidebarCollapsed(collapsed, options = {}) {
      state.sidebarCollapsed = Boolean(collapsed);
      const effectiveCollapsed = state.sidebarCollapsed && sidebarMedia.matches;
      appShell.classList.toggle("sidebar-collapsed", effectiveCollapsed);
      sidebar.setAttribute("aria-hidden", String(effectiveCollapsed));
      sidebarCloseToggle.setAttribute("aria-expanded", String(!effectiveCollapsed));
      sidebarOpenToggle.setAttribute("aria-expanded", String(!effectiveCollapsed));
      if (!effectiveCollapsed) sidebar.scrollLeft = 0;
      if (options.persist !== false) {
        try {
          localStorage.setItem("project-dashboard-sidebar-collapsed", String(state.sidebarCollapsed));
        } catch (error) {
          // The page still works when local storage is blocked.
        }
      }
      if (options.focus) {
        requestAnimationFrame(function () {
          (effectiveCollapsed ? sidebarOpenToggle : sidebarCloseToggle).focus({ preventScroll: true });
          if (!effectiveCollapsed) sidebar.scrollLeft = 0;
        });
      }
    }

    function selectTheme(theme) {
      state.theme = theme === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = state.theme;
      try {
        localStorage.setItem("project-management-theme", state.theme);
      } catch (error) {
        // The page still works when local storage is blocked.
      }
      renderDocument();
    }

    function toggleTheme() {
      selectTheme(state.theme === "dark" ? "light" : "dark");
    }

    function toggleLanguage() {
      state.language = state.language === "zh" ? "en" : "zh";
      history.replaceState(null, "", "#" + state.pair + "." + state.language);
      renderDocument();
    }

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", toggleTheme);
    });
    languageToggle.addEventListener("click", toggleLanguage);
    sidebarCloseToggle.addEventListener("click", function () {
      setSidebarCollapsed(true, { focus: true });
    });
    sidebarOpenToggle.addEventListener("click", function () {
      setSidebarCollapsed(false, { focus: true });
    });
    searchToggle.addEventListener("click", function () {
      setSearchExpanded(!toolbarSearch.classList.contains("expanded"));
    });
    outlineTrigger.addEventListener("pointerdown", function (event) {
      event.preventDefault();
    });
    outlineShell.addEventListener("pointerenter", function () { outlineTrigger.setAttribute("aria-expanded", "true"); });
    outlineShell.addEventListener("pointerleave", function () {
      if (!outlineShell.matches(":focus-within")) outlineTrigger.setAttribute("aria-expanded", "false");
    });
    outlineShell.addEventListener("focusin", function () { outlineTrigger.setAttribute("aria-expanded", "true"); });
    outlineShell.addEventListener("focusout", function () {
      requestAnimationFrame(function () {
        if (!outlineShell.matches(":focus-within")) outlineTrigger.setAttribute("aria-expanded", "false");
      });
    });
    window.addEventListener("scroll", scheduleOutlineUpdate, { passive: true });
    documentSelect.addEventListener("change", function () { selectPair(documentSelect.value); });
    search.addEventListener("input", function () {
      state.query = search.value;
      renderNavigation();
    });
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && !event.altKey && !event.metaKey && event.code === "Backslash") {
        event.preventDefault();
        setSidebarCollapsed(!state.sidebarCollapsed, { focus: true });
        return;
      }
      if (event.key === "/" && document.activeElement !== search) {
        event.preventDefault();
        setSearchExpanded(true);
      }
      if (event.key === "Escape" && document.activeElement === search) {
        search.value = "";
        state.query = "";
        setSearchExpanded(false);
        searchToggle.focus();
        renderNavigation();
      }
    });
    sidebarMedia.addEventListener("change", function () {
      setSidebarCollapsed(state.sidebarCollapsed, { persist: false });
    });

    const hashMatch = location.hash.match(/^#([a-z0-9-]+)\.(zh|en)$/);
    if (hashMatch && byId.has(hashMatch[1] + "." + hashMatch[2])) {
      state.pair = hashMatch[1];
      state.language = hashMatch[2];
    }
    setSidebarCollapsed(state.sidebarCollapsed, { persist: false });
    renderDocument();
  </script>
</body>
</html>`
    .replace("__PROJECT_NAME_JSON__", safeJson(projectName))
    .replace("__MANIFEST_JSON__", safeJson(manifest))
    .replace("__DOCS_JSON__", safeJson(documents));

  if (!html.includes(generatedMarker)) throw new Error("Generated dashboard is missing its ownership marker.");
  if (/__(?:PROJECT_NAME|MANIFEST|DOCS)_JSON__/.test(html)) throw new Error("Dashboard data replacement failed.");

  const outputPath = options.output ? path.resolve(options.output) : path.join(managementRoot, "index.html");
  const type = await pathType(outputPath);
  let status = "created";
  let writtenPath = outputPath;
  if (type === "file") {
    const existing = await fs.readFile(outputPath, "utf8");
    if (existing === html) status = "unchanged";
    else if (options.force || existing.includes(generatedMarker)) status = "updated";
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
