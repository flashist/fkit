#!/usr/bin/env node
// fkit — bootstrap.mjs
//
// Stand up the kit in a NEW project: manifest → ai-agents/ skeleton → compiled skills
// → scaffolded roles → generated CLAUDE.md / AGENTS.md / .codex/config.toml.
//
// Makes NO commits. Usage:
//   node bin/bootstrap.mjs --out <project-dir> [--manifest <file>] [--force]
//
// With no --manifest, writes a starter manifest and stops so you can fill it in.

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { parseYaml, subVars, loadOrMigrateConfig } from "./lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT = resolve(__dirname, "..");
const argv = process.argv.slice(2);
const getArg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};
const out = resolve(getArg("--out", ""));
const manifestArg = getArg("--manifest");
const force = argv.includes("--force");

if (!out) {
  console.error("usage: node bin/bootstrap.mjs --out <project-dir> [--manifest <file>] [--force]");
  process.exit(1);
}

if (existsSync(join(out, "ai-agents")) && !force) {
  console.error(`refusing: ${join(out, "ai-agents")} already exists (use --force, or run sync instead)`);
  process.exit(1);
}
mkdirSync(out, { recursive: true });

// No manifest yet → drop a starter and stop.
if (!manifestArg) {
  const starter = join(out, "ai-agents", "ai-agents.yml");
  mkdirSync(dirname(starter), { recursive: true });
  cpSync(join(KIT, "examples", "sample.ai-agents.yml"), starter);
  console.log(`Wrote a starter manifest → ${starter}`);
  // Seed ai-agents/config.json + config-schema.json from the starter's own
  // routing.default + skills: fields, so an interview reading `config show`
  // has real data before the full build ever runs.
  const starterManifest = parseYaml(readFileSync(starter, "utf8"));
  try {
    loadOrMigrateConfig(join(out, "ai-agents"), starterManifest, KIT);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  console.log(`Wrote a starter config → ${join(out, "ai-agents", "config.json")} (+ config-schema.json)`);
  console.log(`Edit it for your project, then re-run: node bin/bootstrap.mjs --out ${out} --manifest ${starter}`);
  process.exit(0);
}

const manifest = parseYaml(readFileSync(manifestArg, "utf8"));
const project = manifest.project || {};

// 1. Copy the ai-agents/ skeleton, then drop the manifest in place.
//    Skip the manifest copy when it is already at the destination (the common
//    "edit ai-agents/ai-agents.yml in place, then build" flow) — cpSync throws
//    ERR_FS_CP_EINVAL on a same-path copy.
cpSync(join(KIT, "generic", "ai-agents"), join(out, "ai-agents"), { recursive: true });
const destManifest = join(out, "ai-agents", "ai-agents.yml");
if (resolve(manifestArg) !== destManifest) {
  cpSync(manifestArg, destManifest);
}
console.log("  copied ai-agents/ skeleton + manifest");

// 2. Compile the kit skills into the project.
execFileSync("node", [join(KIT, "bin", "compile-skills.mjs"), "--manifest", manifestArg, "--out", out], {
  stdio: "inherit",
});

// 3. Scaffold every role that has a preset.
for (const role of Object.keys(manifest.roles || {})) {
  if (existsSync(join(KIT, "generic", "roles", `${role}.preset.md`))) {
    execFileSync("node", [join(KIT, "bin", "scaffold-role.mjs"), "--manifest", manifestArg, "--role", role, "--out", out], {
      stdio: "inherit",
    });
  }
}

// 4. Generate CLAUDE.md / AGENTS.md and .codex/config.toml.
const vars = {
  project_name: project.name ?? "",
  project_slug: project.slug ?? "",
  owner: project.owner ?? "",
  overview: project.overview ?? "",
  wiki_path: project.wiki_path ?? "ai-agents/wiki-vault",
};
for (const [tmpl, outfile] of [["CLAUDE.md.tmpl", "CLAUDE.md"], ["AGENTS.md.tmpl", "AGENTS.md"]]) {
  writeFileSync(join(out, outfile), subVars(readFileSync(join(KIT, "generic", "templates", tmpl), "utf8"), vars));
  console.log(`  generated ${outfile}`);
}
// Project brief → knowledge-base: a stub with name + overview filled. The
// `fkit` skill's install interview enriches the Domain/Architecture/Conventions sections.
const projectMdPath = join(out, "ai-agents", "knowledge-base", "PROJECT.md");
mkdirSync(dirname(projectMdPath), { recursive: true });
writeFileSync(
  projectMdPath,
  subVars(readFileSync(join(KIT, "generic", "templates", "PROJECT.md.tmpl"), "utf8"), vars),
);
console.log("  generated ai-agents/knowledge-base/PROJECT.md");
const codexId = (manifest.models && manifest.models.codex && manifest.models.codex.id) || "";
mkdirSync(join(out, ".codex"), { recursive: true });
writeFileSync(
  join(out, ".codex", "config.toml"),
  "#:schema https://developers.openai.com/codex/config-schema.json\n" +
    "# fkit:generated — model synced from ai-agents/ai-agents.yml by `sync`\n\n" +
    `model = "${codexId}"\nreview_model = "${codexId}"\n`,
);
console.log("  generated .codex/config.toml");

console.log(`\nBootstrapped ${project.name || "project"} → ${out}  (no commits made)`);
console.log("Next: flesh out ai-agents/knowledge-base/PROJECT.md + the Architecture section in CLAUDE.md/AGENTS.md; add any project-specific rules to scaffolded roles.");
