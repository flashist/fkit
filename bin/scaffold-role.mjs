#!/usr/bin/env node
// fkit — scaffold-role.mjs
//
// Compose the role-agent skeleton + a role preset + the project manifest into a
// project's role skill. Unlike compiled skills, a scaffolded role is written as
// `origin: project` and carries NO `fkit:generated` marker — so `sync`
// never overwrites it. It is a STARTING POINT you then tune by hand (adding any
// project-specific rules the preset deliberately leaves out).
//
// Usage:
//   node bin/scaffold-role.mjs --manifest <ai-agents.yml> --role <name> --out <dir> [--kit <dir>]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseYaml, subVars } from "./lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT_ROOT_DEFAULT = resolve(__dirname, "..");

const argv = process.argv.slice(2);
const getArg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};
const manifestPath = getArg("--manifest");
const role = getArg("--role");
const outDir = getArg("--out");
const kitRoot = resolve(getArg("--kit", KIT_ROOT_DEFAULT));

if (!manifestPath || !role || !outDir) {
  console.error(
    "usage: node bin/scaffold-role.mjs --manifest <ai-agents.yml> --role <name> --out <dir> [--kit <dir>]",
  );
  process.exit(1);
}

const manifest = parseYaml(readFileSync(manifestPath, "utf8"));
const project = manifest.project || {};
const roleCfg = (manifest.roles || {})[role] || {};
const model = roleCfg.model === "codex" ? "codex" : "claude"; // roles run on one side
const invoke = model === "codex" ? "$" : "/";

const baseVars = {
  project_name: project.name ?? "",
  project_slug: project.slug ?? "",
  owner: project.owner ?? "",
  wiki_path: project.wiki_path ?? "ai-agents/wiki-vault",
  role,
  invoke,
  wiki_query: invoke + "fkit-wiki-query",
};

// Load the preset and split it into <!-- key --> blocks
const presetPath = join(kitRoot, "generic", "roles", `${role}.preset.md`);
if (!existsSync(presetPath)) {
  console.error(
    `no preset for role '${role}' at ${presetPath} — add one, or author the role by hand from the template.`,
  );
  process.exit(1);
}
const preset = readFileSync(presetPath, "utf8");
const blocks = {};
const re = /<!--\s*([a-zA-Z0-9_]+)\s*-->/g;
let m;
let lastKey = null;
let lastIdx = 0;
while ((m = re.exec(preset))) {
  if (lastKey) blocks[lastKey] = preset.slice(lastIdx, m.index).trim();
  lastKey = m[1];
  lastIdx = re.lastIndex;
}
if (lastKey) blocks[lastKey] = preset.slice(lastIdx).trim();

// Resolve base placeholders INSIDE each block first, then fill the skeleton.
const resolvedBlocks = {};
for (const [k, v] of Object.entries(blocks)) resolvedBlocks[k] = subVars(v, baseVars);

const tmpl = readFileSync(
  join(kitRoot, "generic", "templates", "role-agent.skill.md.tmpl"),
  "utf8",
);
const filled = subVars(tmpl, { ...baseVars, ...resolvedBlocks });

const target =
  model === "codex"
    ? join(outDir, ".codex", "skills", role, "SKILL.md")
    : join(outDir, ".claude", "skills", role, "SKILL.md");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, filled);
console.log(`scaffolded ${role} (${model}) → ${target}`);
console.log(
  `  (origin: project — sync will NOT overwrite it; add any project-specific rules by hand)`,
);
