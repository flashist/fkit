#!/usr/bin/env node
// fkit — CLI dispatcher.
//
// Lets `npx github:flashist/fkit <command> [args]` run the kit's machinery
// WITHOUT a local clone — this is what the `fkit` skill calls so it stays
// self-contained (no baked path). Subcommands forward to the existing scripts
// in bin/.
//
// NOTE: the clone-channel global installer (install-cli-skills) is intentionally
// NOT exposed here — for a clone-free global install use
// `npx skills add flashist/fkit -g` (the recommended path).
//
// Zero dependencies. Usage:
//   npx github:flashist/fkit <command> [options]
//   fkit <command> [options]

import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT = resolve(__dirname, "..");
const VERSION = existsSync(join(KIT, "VERSION"))
  ? readFileSync(join(KIT, "VERSION"), "utf8").trim()
  : "0.0.0";

// The fkit version a project was last compiled with: prefer the explicit stamp
// written by compile-skills, else fall back to any generated skill marker.
function readProjectVersion(projectDir) {
  const stamp = join(projectDir, "ai-agents", ".fkit-version");
  if (existsSync(stamp)) return readFileSync(stamp, "utf8").trim();
  for (const side of [".claude", ".codex"]) {
    const skillsDir = join(projectDir, side, "skills");
    if (!existsSync(skillsDir)) continue;
    for (const name of readdirSync(skillsDir)) {
      const f = join(skillsDir, name, "SKILL.md");
      if (!existsSync(f)) continue;
      const m = readFileSync(f, "utf8").match(/fkit:generated[^>]*version=([0-9][0-9.]*)/);
      if (m) return m[1];
    }
  }
  return null;
}

// subcommand → script in bin/
const COMMANDS = {
  bootstrap: "bootstrap.mjs",
  sync: "sync.mjs",
  compile: "compile-skills.mjs",
  "scaffold-role": "scaffold-role.mjs",
};

function help() {
  console.log(`fkit ${VERSION} — two-model (Claude + Codex) agent workflow kit

Usage: fkit <command> [options]   (or: npx github:flashist/fkit <command> [options])

Commands:
  version          Print the kit version (add --project <dir> for the project's installed version)
  bootstrap        Stand up fkit in a project (scaffold + compile + generate config)
  sync             Re-pull kit updates into an existing project
  compile          Compile skills from a manifest
  scaffold-role    Scaffold a role-agent from a preset

Each command forwards to its script and prints its own detailed usage.
Normally driven by the fkit skill. Makes no commits.`);
}

const [cmd, ...rest] = process.argv.slice(2);

if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
  help();
  process.exit(0);
}
if (cmd === "--version" || cmd === "-v") {
  console.log(VERSION);
  process.exit(0);
}
if (cmd === "version") {
  // `kit` = the version this npx run pulled (i.e. the latest available).
  console.log(`kit:     ${VERSION}`);
  const pIdx = rest.indexOf("--project");
  if (pIdx >= 0) {
    const projectDir = resolve(rest[pIdx + 1] || ".");
    const installed = readProjectVersion(projectDir);
    if (installed === VERSION) {
      console.log(`project: ${installed} (up to date)`);
    } else if (installed) {
      console.log(`project: ${installed}  →  update available: ${VERSION} (run the fkit skill)`);
    } else {
      console.log("project: unknown (no fkit stamp — run the fkit skill to sync)");
    }
  }
  process.exit(0);
}

const script = COMMANDS[cmd];
if (!script) {
  console.error(`fkit: unknown command "${cmd}"\n`);
  help();
  process.exit(1);
}

const result = spawnSync(process.execPath, [join(KIT, "bin", script), ...rest], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
