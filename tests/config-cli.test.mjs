// Integration tests for bin/config.mjs — `fkit config show|set` as actually invoked
// via the CLI (child process), against a scratch project with a minimal manifest.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

import { KIT_ROOT, mkTmpDir, rmTmpDir } from "./helpers.mjs";

const CONFIG_MJS = join(KIT_ROOT, "bin", "config.mjs");

const MINIMAL_MANIFEST = [
  "project:",
  "  name: Scratch",
  "  slug: scratch",
  "  owner: tester",
  "",
  "models:",
  "  claude: { cli: claude, id: claude-opus-4-8 }",
  "  codex: { cli: codex, id: gpt-5.5 }",
  "",
].join("\n");

function run(args, opts = {}) {
  return execFileSync("node", [CONFIG_MJS, ...args], { encoding: "utf8", ...opts });
}

function runExpectFailure(args, opts = {}) {
  try {
    run(args, opts);
    throw new Error(`expected "config.mjs ${args.join(" ")}" to fail, but it succeeded`);
  } catch (e) {
    if (e.status === undefined) throw e; // rethrow our own "should have failed" error
    return e;
  }
}

describe("bin/config.mjs", () => {
  let projectDir;

  before(() => {
    projectDir = mkTmpDir();
    mkdirSync(join(projectDir, "ai-agents"), { recursive: true });
    writeFileSync(join(projectDir, "ai-agents", "ai-agents.yml"), MINIMAL_MANIFEST);
  });

  after(() => {
    rmTmpDir(projectDir);
  });

  test("show --json seeds a fresh config.json with defaultModel + every kit skill resolved", () => {
    const out = run(["show", "--project", projectDir, "--json"]);
    const data = JSON.parse(out);

    assert.ok(["claude", "codex"].includes(data.defaultModel));
    assert.ok(Array.isArray(data.skills));
    assert.ok(data.skills.length > 0);

    const fkitConfig = data.skills.find((s) => s.name === "fkit-config");
    assert.ok(fkitConfig, "fkit-config should be in the resolved skill list");
    assert.equal(fkitConfig.source, "default"); // nothing overridden yet
    assert.equal(fkitConfig.model, data.defaultModel);

    // config.json + config-schema.json must now exist on disk.
    const configPath = join(projectDir, "ai-agents", "config.json");
    const schemaPath = join(projectDir, "ai-agents", "config-schema.json");
    assert.doesNotThrow(() => readFileSync(configPath));
    assert.doesNotThrow(() => readFileSync(schemaPath));
  });

  test("show (text) has no 'both' value and no task-type routing table (removed this session)", () => {
    const out = run(["show", "--project", projectDir]);
    // "Routing" survives as the per-skill table's column header (this skill's own
    // model assignment) — what must be gone is the OLD task-type routing table
    // (ai-agents.yml's `routing:` block rendered as its own section) and any "both".
    assert.doesNotMatch(out.toLowerCase(), /task-type/);
    assert.doesNotMatch(out, /Task type\s+Model/);
    assert.doesNotMatch(out.toLowerCase(), /\bboth\b/);
    assert.match(out, /Default model:/);
    assert.match(out, /Skill\s+Routing\s+Source/);
  });

  test("set --default-model changes the default and is reflected by show", () => {
    run(["set", "--project", projectDir, "--default-model", "codex"]);
    const data = JSON.parse(run(["show", "--project", projectDir, "--json"]));
    assert.equal(data.defaultModel, "codex");
  });

  test("set --skill --model pins one skill without affecting the rest", () => {
    run(["set", "--project", projectDir, "--skill", "fkit-config", "--model", "claude"]);
    const data = JSON.parse(run(["show", "--project", projectDir, "--json"]));

    const fkitConfig = data.skills.find((s) => s.name === "fkit-config");
    assert.equal(fkitConfig.model, "claude");
    assert.equal(fkitConfig.source, "override");

    // an untouched skill still just follows defaultModel (codex, from the previous test).
    const other = data.skills.find((s) => s.name !== "fkit-config");
    assert.equal(other.source, "default");
    assert.equal(other.model, "codex");
  });

  test("set --skill --model default clears the override, falling back to defaultModel", () => {
    run(["set", "--project", projectDir, "--skill", "fkit-config", "--model", "default"]);
    const data = JSON.parse(run(["show", "--project", projectDir, "--json"]));
    const fkitConfig = data.skills.find((s) => s.name === "fkit-config");
    assert.equal(fkitConfig.source, "default");
    assert.equal(fkitConfig.model, "codex"); // the project defaultModel set two tests ago
  });

  test("set --default-model rejects an out-of-enum value (e.g. legacy 'both')", () => {
    const err = runExpectFailure(["set", "--project", projectDir, "--default-model", "both"]);
    assert.match(err.stderr, /invalid --default-model/);
  });

  test("set --skill --model rejects an out-of-enum value (e.g. legacy 'both') — only 'default' or a model name are accepted", () => {
    const err = runExpectFailure(["set", "--project", projectDir, "--skill", "fkit-config", "--model", "both"]);
    assert.match(err.stderr, /invalid model "both" — must be one of claude\|codex, or "default"/);
  });

  test("set --skill rejects an unknown skill name", () => {
    const err = runExpectFailure(["set", "--project", projectDir, "--skill", "no-such-skill", "--model", "claude"]);
    assert.match(err.stderr, /unknown skill/);
  });

  test("set --skill without --model fails with a clear usage message", () => {
    const err = runExpectFailure(["set", "--project", projectDir, "--skill", "fkit-config"]);
    assert.match(err.stderr, /--model <claude\|codex\|default>/);
  });

  test("show fails with a clear message when the project has no manifest", () => {
    const emptyDir = mkTmpDir();
    try {
      const err = runExpectFailure(["show", "--project", emptyDir]);
      assert.match(err.stderr, /no manifest at/);
    } finally {
      rmTmpDir(emptyDir);
    }
  });
});
