#!/usr/bin/env node
// fkit — sync.mjs
//
// Re-pull kit updates into an EXISTING project:
//   - recompile generated (origin:kit) skills   — never touches origin:project files
//   - regenerate the fenced routing region in CLAUDE.md / AGENTS.md (if markers present)
//   - update the model in .codex/config.toml (leaving the rest of the file intact)
//
// Makes NO commits. Usage:
//   node bin/sync.mjs --project <dir> [--kit <dir>]

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { parseYaml, renderRoutingBlock, replaceFenced, updateCodexModel } from "./lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT = resolve(__dirname, "..");
const argv = process.argv.slice(2);
const getArg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};
const proj = resolve(getArg("--project", ""));
if (!proj) {
  console.error("usage: node bin/sync.mjs --project <dir> [--kit <dir>]");
  process.exit(1);
}
const manifestPath = join(proj, "ai-agents", "ai-agents.yml");
if (!existsSync(manifestPath)) {
  console.error(`no manifest at ${manifestPath} — is this a bootstrapped project?`);
  process.exit(1);
}
const manifest = parseYaml(readFileSync(manifestPath, "utf8"));

// 1. Recompile generated skills. compile-skills only writes skills that exist as KIT
//    sources, so origin:project files (scaffolded roles, project-authored skills) are
//    never touched.
console.log("recompiling generated skills:");
execFileSync("node", [join(KIT, "bin", "compile-skills.mjs"), "--manifest", manifestPath, "--out", proj], {
  stdio: "inherit",
});

// 2. Regenerate the fenced routing region in CLAUDE.md / AGENTS.md (only if markers exist).
const block = renderRoutingBlock(manifest);
for (const f of ["CLAUDE.md", "AGENTS.md"]) {
  const fp = join(proj, f);
  if (!existsSync(fp)) continue;
  const { text, replaced } = replaceFenced(
    readFileSync(fp, "utf8"),
    "<!-- fkit:routing:start -->",
    "<!-- fkit:routing:end -->",
    block,
  );
  if (replaced) {
    writeFileSync(fp, text);
    console.log(`  updated routing block in ${f}`);
  } else {
    console.log(`  ${f}: no routing markers — left unchanged (add the start/end markers to enable)`);
  }
}

// 3. Update .codex/config.toml model lines (leave the rest intact).
const codexId = (manifest.models && manifest.models.codex && manifest.models.codex.id) || "";
const cfg = join(proj, ".codex", "config.toml");
if (existsSync(cfg) && codexId) {
  writeFileSync(cfg, updateCodexModel(readFileSync(cfg, "utf8"), codexId));
  console.log(`  synced .codex/config.toml model → ${codexId}`);
}

console.log("\nsync complete — no commits made.");
