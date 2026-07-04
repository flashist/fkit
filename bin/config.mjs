#!/usr/bin/env node
// fkit — config.mjs
//
// Read/edit a project's ai-agents/config.json — the single source of truth for
// the default model and per-skill model overrides (see ai-agents/config-schema.json
// for what every field/value means).
//
// Makes NO commits. A `set` alone does not recompile anything — run `sync`
// afterward for the change to take effect in the compiled skills. Usage:
//   node bin/config.mjs show --project <dir> [--json] [--kit <dir>]
//   node bin/config.mjs set --project <dir> --default-model <claude|codex> [--kit <dir>]
//   node bin/config.mjs set --project <dir> --skill <name> --model <claude|codex|default> [--kit <dir>]

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseYaml,
  splitFrontmatter,
  discoverSkills,
  loadOrMigrateConfig,
  resolveSkillModel,
  validateConfig,
  writeConfig,
  MODEL_ENUM,
} from "./lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT_ROOT_DEFAULT = resolve(__dirname, "..");

const argv = process.argv.slice(2);
const getArg = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : def;
};

function usage() {
  console.error(
    [
      "usage:",
      "  node bin/config.mjs show --project <dir> [--json] [--kit <dir>]",
      "  node bin/config.mjs set --project <dir> --default-model <claude|codex> [--kit <dir>]",
      "  node bin/config.mjs set --project <dir> --skill <name> --model <claude|codex|default> [--kit <dir>]",
    ].join("\n"),
  );
}

const [sub, ...rest] = argv;
if (!sub || (sub !== "show" && sub !== "set")) {
  usage();
  process.exit(1);
}

const projectDir = resolve(getArg("--project", "."));
const kitRoot = resolve(getArg("--kit", KIT_ROOT_DEFAULT));
const aiAgentsDir = join(projectDir, "ai-agents");
const manifestPath = join(aiAgentsDir, "ai-agents.yml");

if (!existsSync(manifestPath)) {
  console.error(`no manifest at ${manifestPath} — is this a bootstrapped project?`);
  process.exit(1);
}
const manifest = parseYaml(readFileSync(manifestPath, "utf8"));

// config.json is a hand-editable file — a bad edit must print a clear one-line
// message, never a raw stack trace.
function safeLoadOrMigrateConfig() {
  try {
    return loadOrMigrateConfig(aiAgentsDir, manifest, kitRoot);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

// The full skill catalog the kit currently ships, each with its resolved model.
function resolvedSkills(config) {
  return discoverSkills(kitRoot)
    .map((s) => {
      const { fm } = splitFrontmatter(readFileSync(join(s.dir, "skill.md"), "utf8"));
      const name = fm.name || s.name;
      const { model, source } = resolveSkillModel(config, name);
      return { name, model, source, description: fm.description || "" };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

if (sub === "show") {
  const { config } = safeLoadOrMigrateConfig();
  const skills = resolvedSkills(config);
  const routing = manifest.routing || {};
  const data = {
    version: config.version,
    defaultModel: config.defaultModel,
    skills,
    routing,
  };

  if (argv.includes("--json")) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  }

  const cap = (s) => (s === "both" ? "Both" : s.charAt(0).toUpperCase() + s.slice(1));
  console.log(`fkit config — ai-agents/config.json (v${config.version})\n`);
  console.log(`Default model: ${cap(config.defaultModel)}\n`);
  console.log("Skill                          Routing        Source");
  console.log("-".repeat(60));
  for (const s of skills) {
    console.log(
      `${s.name.padEnd(30)} ${cap(s.model).padEnd(14)} ${s.source === "override" ? "override" : "default"}`,
    );
  }
  const taskRows = Object.entries(routing).filter(([k]) => k !== "default");
  if (taskRows.length) {
    console.log("\nTask-type routing (ai-agents.yml routing: block, unrelated to config.json):");
    for (const [k, v] of taskRows) console.log(`  ${k.padEnd(20)} ${cap(v)}`);
  }
  process.exit(0);
}

// sub === "set"
{
  const { config } = safeLoadOrMigrateConfig();
  const defaultModel = getArg("--default-model");
  const skillName = getArg("--skill");
  const skillModel = getArg("--model");

  if (defaultModel) {
    if (!MODEL_ENUM.includes(defaultModel)) {
      console.error(`invalid --default-model "${defaultModel}" — must be one of ${MODEL_ENUM.join("|")}`);
      process.exit(1);
    }
    config.defaultModel = defaultModel;
    validateConfig(config);
    writeConfig(aiAgentsDir, config);
    console.log(`defaultModel = ${defaultModel}`);
    console.log("Run `sync` for this to take effect in the compiled skills.");
  } else if (skillName) {
    const catalog = discoverSkills(kitRoot).map((s) => {
      const { fm } = splitFrontmatter(readFileSync(join(s.dir, "skill.md"), "utf8"));
      return fm.name || s.name;
    });
    if (!catalog.includes(skillName)) {
      console.error(`unknown skill "${skillName}" — valid skills:\n  ${catalog.sort().join("\n  ")}`);
      process.exit(1);
    }
    if (!skillModel) {
      console.error('--skill requires --model <claude|codex|default>');
      process.exit(1);
    }
    if (skillModel === "default") {
      delete config.skills[skillName];
      console.log(`${skillName}: override cleared — now follows defaultModel`);
    } else {
      if (!MODEL_ENUM.includes(skillModel)) {
        console.error(`invalid --model "${skillModel}" — must be one of ${MODEL_ENUM.join("|")}, or "default"`);
        process.exit(1);
      }
      config.skills[skillName] = { model: skillModel };
      console.log(`${skillName}.model = ${skillModel}`);
    }
    validateConfig(config);
    writeConfig(aiAgentsDir, config);
    console.log("Run `sync` for this to take effect in the compiled skills.");
  } else {
    usage();
    process.exit(1);
  }
}
