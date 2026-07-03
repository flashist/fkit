#!/usr/bin/env node
// fkit — compile-skills.mjs
//
// Single-source skill compiler. Reads model-agnostic skill sources
// (generic/skills/{shared,claude-only,codex-only}/<name>/skill.md + meta.yml)
// plus a project manifest (ai-agents.yml), and emits per-CLI skill files:
//   - Claude → <out>/.claude/skills/<name>/SKILL.md
//   - Codex  → <out>/.codex/skills/<name>/SKILL.md  (+ agents/openai.yaml)
//
// Per-model variation is supported three ways, all from ONE source:
//   1. Manifest placeholders ({{owner}}, {{project_name}}, {{wiki_path}}, …)
//   2. Per-model vars       (meta.<model>.vars: e.g. {{invoke}} = "/" vs "$")
//   3. Per-model description (meta.<model>.description overrides the shared one)
//
// Every emitted file carries a `fkit:generated` marker so `sync` can
// safely regenerate it without ever touching hand-authored (project-origin) files.
//
// Zero dependencies (no npm install). Usage:
//   node bin/compile-skills.mjs --manifest <ai-agents.yml> --out <dir> [--only <name>] [--kit <dir>]

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseYaml, splitFrontmatter, subVars } from "./lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT_ROOT_DEFAULT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const getArg = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : def;
};
const manifestPath = getArg("--manifest");
const outDir = getArg("--out");
const only = getArg("--only");
const kitRoot = resolve(getArg("--kit", KIT_ROOT_DEFAULT));

if (!manifestPath || !outDir) {
  console.error(
    "usage: node bin/compile-skills.mjs --manifest <ai-agents.yml> --out <dir> [--only <name>] [--kit <dir>]",
  );
  process.exit(1);
}

const VERSION = existsSync(join(kitRoot, "VERSION"))
  ? readFileSync(join(kitRoot, "VERSION"), "utf8").trim()
  : "0.0.0";

const manifest = parseYaml(readFileSync(manifestPath, "utf8"));
const project = manifest.project || {};
const models = manifest.models || {};

const vars = {
  project_name: project.name ?? "",
  project_slug: project.slug ?? "",
  owner: project.owner ?? "",
  primary_language: project.primary_language ?? "",
  wiki_path: project.wiki_path ?? "ai-agents/wiki-vault",
  claude_id: (models.claude && models.claude.id) ?? "",
  codex_id: (models.codex && models.codex.id) ?? "",
  kit_version: VERSION,
};

// Optional placement overrides from manifest.skills (else the kit dir decides)
const placement = {};
const sk = manifest.skills || {};
for (const n of sk.shared || []) placement[n] = "shared";
for (const n of sk.claude_only || []) placement[n] = "claude";
for (const n of sk.codex_only || []) placement[n] = "codex";

// Skills OWNED by one model but present on EVERY side: the owner side gets the
// real skill; every other side gets a delegation stub that calls the owner model
// non-interactively (models.<owner>.exec) to do the work.
const ownedBy = {};
for (const [n, m] of Object.entries(sk.owned || {})) {
  ownedBy[n] = m === "claude" ? "claude" : "codex";
}

// ---------------------------------------------------------------------------
// Discover skill sources
// ---------------------------------------------------------------------------
const TIER_DIRS = { shared: "shared", "claude-only": "claude", "codex-only": "codex" };
const skillsRoot = join(kitRoot, "generic", "skills");
const found = [];
for (const [dir, tier] of Object.entries(TIER_DIRS)) {
  const base = join(skillsRoot, dir);
  if (!existsSync(base)) continue;
  for (const name of readdirSync(base)) {
    if (existsSync(join(base, name, "skill.md"))) {
      found.push({ name, tier, dir: join(base, name) });
    }
  }
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------
const tierLabelFor = (place) =>
  place === "shared" ? "shared" : place === "claude" ? "claude-only" : "codex-only";

const marker = (place, name) =>
  "<!-- fkit:generated source=" +
  tierLabelFor(place) +
  "/" +
  name +
  " version=" +
  VERSION +
  " — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->";

function writeEnsured(fp, content) {
  mkdirSync(dirname(fp), { recursive: true });
  writeFileSync(fp, content);
}

const OWNER_LABEL = { claude: "Claude", codex: "Codex" };
const INVOKE_FOR = { claude: "/", codex: "$" };

// The body for the NON-owner side of an `owned` skill. It calls the owner model
// non-interactively (models.<owner>.exec) to run the real skill, and falls back
// to a manual tab hand-off if that CLI is missing.
function delegationStub(name, ownerModel) {
  const label = OWNER_LABEL[ownerModel];
  const inv = INVOKE_FOR[ownerModel];
  const cli = (models[ownerModel] && models[ownerModel].cli) || ownerModel;
  const exec = (models[ownerModel] && models[ownerModel].exec) || "";
  const out = [
    `# ${name} (delegated to ${label})`,
    "",
    `This skill is **owned by ${label}** in this project — its real implementation lives on the ${label} side. **Do not do the work yourself.** Hand it to ${label} and relay the result.`,
    "",
  ];
  if (exec) {
    out.push(
      "## Delegate",
      "",
      `Run ${label} non-interactively from the project root, telling it to run its own \`${inv}${name}\` skill with whatever argument the user passed:`,
      "",
      "```bash",
      `${exec} "Run the ${name} skill (${inv}${name}). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."`,
      "```",
      "",
      `Replace \`<ARGS>\` with the user's argument to \`${inv}${name}\` (use \`(none)\` if there was none). Wait for it to finish, then relay ${label}'s output to the user.`,
      "",
      `**Fallback:** if the \`${cli}\` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run \`${inv}${name}\` in their ${label} tab instead.`,
    );
  } else {
    out.push(
      "## Hand off",
      "",
      `Tell the user to run \`${inv}${name}\` in their ${label} tab. Do **not** attempt the task yourself.`,
    );
  }
  return out.join("\n") + "\n";
}

let claudeCount = 0;
let codexCount = 0;

for (const s of found) {
  if (only && s.name !== only) continue;

  const { fm, body } = splitFrontmatter(readFileSync(join(s.dir, "skill.md"), "utf8"));
  const metaPath = join(s.dir, "meta.yml");
  const meta = existsSync(metaPath) ? parseYaml(readFileSync(metaPath, "utf8")) : {};

  const name = fm.name || s.name;
  const owner = ownedBy[name]; // undefined | "claude" | "codex"
  const place = owner ? "shared" : placement[name] || s.tier;
  const markerTier = owner ? s.tier : place; // marker points at the real source dir
  const targets =
    place === "shared" ? ["claude", "codex"] : place === "claude" ? ["claude"] : ["codex"];

  // Per-target substitution: global manifest vars + this skill's per-model vars
  // (meta.<model>.vars), plus an optional per-model description override.
  const render = (model) => {
    const mvars = { ...vars, ...((meta[model] && meta[model].vars) || {}) };
    const descSrc = (meta[model] && meta[model].description) || fm.description || "";
    return {
      mvars,
      description: subVars(descSrc, mvars),
      body: subVars(body, mvars).replace(/^\n+/, "").replace(/\s*$/, "") + "\n",
    };
  };

  if (targets.includes("claude")) {
    const r = render("claude");
    const ui =
      meta.claude &&
      (meta.claude.user_invocable === false || meta.claude.user_invocable === "false")
        ? false
        : true;
    const fmLines = ["---", `name: ${name}`, `description: ${JSON.stringify(r.description)}`];
    if (ui) fmLines.push("user-invocable: true");
    fmLines.push("---");
    const bodyOut = owner && owner !== "claude" ? delegationStub(name, owner) : r.body;
    const content = fmLines.join("\n") + "\n" + marker(markerTier, name) + "\n\n" + bodyOut;
    writeEnsured(join(outDir, ".claude", "skills", name, "SKILL.md"), content);
    claudeCount++;
    const via = owner && owner !== "claude" ? ` (delegates to ${OWNER_LABEL[owner]})` : "";
    console.log(`  claude → .claude/skills/${name}/SKILL.md${via}`);
  }

  if (targets.includes("codex")) {
    const r = render("codex");
    const fmLines = ["---", `name: ${name}`, `description: ${JSON.stringify(r.description)}`, "---"];
    const bodyOut = owner && owner !== "codex" ? delegationStub(name, owner) : r.body;
    const content = fmLines.join("\n") + "\n" + marker(markerTier, name) + "\n\n" + bodyOut;
    writeEnsured(join(outDir, ".codex", "skills", name, "SKILL.md"), content);

    const iface = (meta.codex && meta.codex.interface) || {};
    const yaml =
      [
        "interface:",
        `  display_name: ${JSON.stringify(subVars(iface.display_name || name, r.mvars))}`,
        `  short_description: ${JSON.stringify(subVars(iface.short_description || "", r.mvars))}`,
        `  default_prompt: ${JSON.stringify(subVars(iface.default_prompt || "", r.mvars))}`,
      ].join("\n") + "\n";
    writeEnsured(join(outDir, ".codex", "skills", name, "agents", "openai.yaml"), yaml);
    codexCount++;
    const via = owner && owner !== "codex" ? ` (delegates to ${OWNER_LABEL[owner]})` : "";
    console.log(`  codex  → .codex/skills/${name}/SKILL.md (+ agents/openai.yaml)${via}`);
  }
}

// Stamp the project with the kit version it was last compiled against, so
// `fkit version --project <dir>` and the fkit skill can report it.
const stampDir = join(outDir, "ai-agents");
mkdirSync(stampDir, { recursive: true });
writeFileSync(join(stampDir, ".fkit-version"), `${VERSION}\n`);
console.log(`  stamped ai-agents/.fkit-version = ${VERSION}`);

console.log(
  `\nCompiled ${claudeCount} Claude + ${codexCount} Codex skill file(s) → ${outDir}`,
);
