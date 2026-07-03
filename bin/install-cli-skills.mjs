#!/usr/bin/env node
// fkit — install-cli-skills.mjs
//
// Clone-channel installer: copies the fkit entry skills (skills/) into the user's
// GLOBAL agent skill dirs so `fkit-install` / `fkit-update` work in any project.
// This is the same result as `npx skills add flashist/fkit -g`, just a plain copy
// that doesn't depend on the `skills` tool — for people who cloned the repo.
//
// The skills in skills/ are self-contained (they run the kit via
// `npx github:flashist/fkit …`), so there is nothing to substitute and no path to
// bake — the installed files are byte-identical to the source.
//
// Zero deps. Makes no commits. Usage:
//   node bin/install-cli-skills.mjs [--target claude|codex|both] [--dry-run]
//   node bin/install-cli-skills.mjs --claude-dir <dir> --codex-dir <dir>

import { cpSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT = resolve(__dirname, "..");
const HOME = homedir();

const argv = process.argv.slice(2);
const getArg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};
const target = getArg("--target", "both");
const dryRun = argv.includes("--dry-run");
const claudeDir = resolve(getArg("--claude-dir", join(HOME, ".claude", "skills")));
const codexDir = resolve(getArg("--codex-dir", join(HOME, ".codex", "skills")));

const SRC = join(KIT, "skills");
if (!existsSync(SRC)) {
  console.error(`no skills/ directory at ${SRC}`);
  process.exit(1);
}
const skills = readdirSync(SRC).filter((n) => existsSync(join(SRC, n, "SKILL.md")));

function install(label, dir) {
  console.log(`\n${label} → ${dir}`);
  for (const name of skills) {
    console.log(`  ${name}/`);
    if (dryRun) continue;
    mkdirSync(dir, { recursive: true });
    cpSync(join(SRC, name), join(dir, name), { recursive: true });
  }
}

console.log(dryRun ? "DRY RUN — no files written" : "Installing fkit skills (clone channel)");
console.log(`source: ${SRC}`);
if (target === "claude" || target === "both") install("Claude", claudeDir);
if (target === "codex" || target === "both") install("Codex", codexDir);
console.log(
  `\n${dryRun ? "Would install" : "Installed"} ${skills.length} skill(s): ${skills.join(", ")}`,
);
console.log("Same files as `npx skills add flashist/fkit -g`. Re-run after editing skills/. Makes no commits.");
