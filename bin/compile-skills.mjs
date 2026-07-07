#!/usr/bin/env node
// fkit — compile-skills.mjs
//
// Single-source skill compiler. Reads model-agnostic skill sources
// (generic/skills/<name>/skill.md + meta.yml) plus a project manifest
// (ai-agents.yml), and emits per-CLI skill files:
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
// On a full compile (not `--only`) it also PRUNES orphaned generated skills — dirs
// carrying that marker whose source the kit no longer ships (e.g. a renamed skill),
// so a rename leaves no stale `.claude`/`.codex` skill behind. Marker-less dirs
// (scaffolded roles, project-authored skills) are never touched.
//
// Also prints a `restart-required: yes|no` line — whether this run's kit version
// differs from what the project was last compiled against (ai-agents/config.json's
// own `version` field — see loadOrMigrateConfig's `previousVersion`) — which the
// `fkit` skill uses to warn the user when THIS session needs to restart to pick
// up the change (a running session keeps whatever skill instructions it already
// loaded).
//
// Zero dependencies (no npm install). Usage:
//   node bin/compile-skills.mjs --manifest <ai-agents.yml> --out <dir> [--only <name>] [--kit <dir>]

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseYaml,
  splitFrontmatter,
  subVars,
  discoverSkills,
  loadOrMigrateConfig,
  resolveSkillModel,
  readKitVersion,
} from "./lib.mjs";

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

const VERSION = readKitVersion(kitRoot);

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

// Skill assignment now lives in ai-agents/config.json (defaultModel + a sparse
// per-skill `skills` override map), not in the manifest. loadOrMigrateConfig
// synthesizes it once from the manifest's legacy routing.default + skills: fields
// if it doesn't exist yet — existing projects upgrade to the delegating-stub
// behaviour on the next sync with no hand-editing.
const aiAgentsDir = join(outDir, "ai-agents");
let config, migrated, previousVersion;
try {
  ({ config, migrated, previousVersion } = loadOrMigrateConfig(aiAgentsDir, manifest, kitRoot));
} catch (e) {
  // config.json is a hand-editable file — a bad edit must print a clear one-line
  // message, never a raw stack trace.
  console.error(e.message);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Discover skill sources
// ---------------------------------------------------------------------------
const found = discoverSkills(kitRoot);
// Any skill unlisted in config.json — no exceptions — just follows defaultModel.
if (!migrated) {
  const unlisted = found.filter(
    (s) => !(config.skills && Object.prototype.hasOwnProperty.call(config.skills, s.name)),
  );
  if (unlisted.length) {
    const summary = unlisted
      .map((s) => `${s.name}=${resolveSkillModel(config, s.name).model}`)
      .join(", ");
    console.log(`  note: not in config.json, inheriting default (${summary})`);
  }
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------
const marker = (name) =>
  "<!-- fkit:generated source=" +
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
// How to call each model non-interactively when a stub delegates. Overridable per
// project via models.<m>.exec; these defaults make delegation work out of the box.
const DEFAULT_EXEC = {
  claude: "claude -p --permission-mode acceptEdits",
  codex: "codex exec --sandbox workspace-write",
};

// The body for the NON-owner side of an `owned` skill. It calls the owner model
// non-interactively (models.<owner>.exec) to run the real skill, and falls back
// to a manual tab hand-off if that CLI is missing.
function delegationStub(name, ownerModel) {
  const label = OWNER_LABEL[ownerModel];
  const inv = INVOKE_FOR[ownerModel];
  const cli = (models[ownerModel] && models[ownerModel].cli) || ownerModel;
  const exec = (models[ownerModel] && models[ownerModel].exec) || DEFAULT_EXEC[ownerModel] || "";
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
// The resolved frontmatter name of every skill emitted this run — the authoritative
// set of skills the kit currently ships, used below to prune orphaned output dirs.
const compiledNames = new Set();

for (const s of found) {
  if (only && s.name !== only) continue;

  const { fm, body } = splitFrontmatter(readFileSync(join(s.dir, "skill.md"), "utf8"));
  const metaPath = join(s.dir, "meta.yml");
  const meta = existsSync(metaPath) ? parseYaml(readFileSync(metaPath, "utf8")) : {};

  const name = fm.name || s.name;
  compiledNames.add(name);
  // assignment is always exactly one model (claude|codex) — real on that owner,
  // a delegating stub on every other model.
  const { model: assignment } = resolveSkillModel(config, name);
  const stubFor = (model) => (assignment !== model ? delegationStub(name, assignment) : null);
  // Every skill compiles to BOTH models (real skill or delegating stub).
  const targets = ["claude", "codex"];

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
    const stub = stubFor("claude");
    const content = fmLines.join("\n") + "\n" + marker(name) + "\n\n" + (stub || r.body);
    writeEnsured(join(outDir, ".claude", "skills", name, "SKILL.md"), content);
    claudeCount++;
    const via = stub ? ` (delegates to ${OWNER_LABEL[assignment]})` : "";
    console.log(`  claude → .claude/skills/${name}/SKILL.md${via}`);
  }

  if (targets.includes("codex")) {
    const r = render("codex");
    const fmLines = ["---", `name: ${name}`, `description: ${JSON.stringify(r.description)}`, "---"];
    const stub = stubFor("codex");
    const content = fmLines.join("\n") + "\n" + marker(name) + "\n\n" + (stub || r.body);
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
    const via = stub ? ` (delegates to ${OWNER_LABEL[assignment]})` : "";
    console.log(`  codex  → .codex/skills/${name}/SKILL.md (+ agents/openai.yaml)${via}`);
  }
}

// Prune orphaned generated skills — dirs the kit no longer produces (a skill that
// was renamed or removed at the source). Only on a FULL compile: an `--only` run
// deliberately emits a single skill, so its `compiledNames` is not the full set and
// must never drive deletion. The `fkit:generated` marker is the safety gate — only
// kit-generated files carry it, so scaffolded roles and project-authored skills
// (no marker) are never touched, exactly like `sync` never overwrites them.
if (!only) {
  for (const [side, label] of [
    [".claude", "claude"],
    [".codex", "codex"],
  ]) {
    const skillsDir = join(outDir, side, "skills");
    if (!existsSync(skillsDir)) continue;
    for (const dirName of readdirSync(skillsDir)) {
      if (compiledNames.has(dirName)) continue;
      const skillMd = join(skillsDir, dirName, "SKILL.md");
      if (!existsSync(skillMd)) continue; // not a skill dir we recognize — leave it
      if (!/fkit:generated/.test(readFileSync(skillMd, "utf8"))) continue; // origin:project — never touch
      rmSync(join(skillsDir, dirName), { recursive: true, force: true });
      console.log(`  ${label}  ✗ pruned orphaned generated skill ${side}/skills/${dirName}/`);
    }
  }
}

// loadOrMigrateConfig already stamped ai-agents/config.json's own `version` field
// with VERSION above — that's the single record of what this project was last
// compiled against; `fkit version --project <dir>` and the fkit skill read it
// from there (no separate stamp file).
console.log(`  kit version → ${VERSION} (ai-agents/config.json)`);

console.log(
  `\nCompiled ${claudeCount} Claude + ${codexCount} Codex skill file(s) → ${outDir}`,
);

// A fixed, greppable line the `fkit` skill's report step checks to decide whether
// to warn the user that THIS session needs a restart to pick up the update (a
// running session keeps whatever skill instructions it already loaded). Based
// purely on the kit version the project was last compiled against vs. this run's
// — not a per-skill content diff. Printed every run, changed or not, so its
// absence is never mistaken for "no change".
const restartRequired = previousVersion !== VERSION;
console.log(`restart-required: ${restartRequired ? "yes" : "no"}`);
if (restartRequired) {
  console.log(`  kit version ${previousVersion ?? "(none)"} → ${VERSION}`);
}
