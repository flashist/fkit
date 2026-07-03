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
import { readFileSync, existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT = resolve(__dirname, "..");
const VERSION = existsSync(join(KIT, "VERSION"))
  ? readFileSync(join(KIT, "VERSION"), "utf8").trim()
  : "0.0.0";

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
