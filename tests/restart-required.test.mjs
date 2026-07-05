// Tests for compile-skills.mjs's `restart-required: yes|no` line — the signal the
// `fkit` skill uses to warn the user that THIS session needs a restart to pick up
// an update (a running session keeps whatever SKILL.md content it already
// loaded). Purely a comparison of the project's previously-compiled kit version
// (ai-agents/config.json's own `version` field — no separate stamp file) against
// the version just compiled against — not a per-skill content diff.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, cpSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

import { KIT_ROOT, mkTmpDir, rmTmpDir } from "./helpers.mjs";

const BOOTSTRAP_MJS = join(KIT_ROOT, "bin", "bootstrap.mjs");
const SYNC_MJS = join(KIT_ROOT, "bin", "sync.mjs");
const CONFIG_MJS = join(KIT_ROOT, "bin", "config.mjs");
const SAMPLE_MANIFEST = join(KIT_ROOT, "examples", "sample.ai-agents.yml");

function run(script, args) {
  return execFileSync("node", [script, ...args], { encoding: "utf8" });
}

function restartRequired(output) {
  const line = output.split("\n").find((l) => l.startsWith("restart-required:"));
  assert.ok(line, `no restart-required line in output:\n${output}`);
  return /restart-required: yes/.test(line);
}

describe("restart-required signal", () => {
  let dir;
  let configPath;

  before(() => {
    dir = mkTmpDir("fkit-restart-");
    configPath = join(dir, "ai-agents", "config.json");
    mkdirSync(join(dir, "ai-agents"), { recursive: true });
    cpSync(SAMPLE_MANIFEST, join(dir, "ai-agents", "ai-agents.yml"));
  });

  after(() => {
    rmTmpDir(dir);
  });

  test("a fresh build (no prior config.json) requires a restart", () => {
    const out = run(BOOTSTRAP_MJS, [
      "--out",
      dir,
      "--manifest",
      join(dir, "ai-agents", "ai-agents.yml"),
      "--force",
    ]);
    assert.equal(restartRequired(out), true);
  });

  test("an immediate re-sync at the same kit version does not require a restart", () => {
    const out = run(SYNC_MJS, ["--project", dir]);
    assert.equal(restartRequired(out), false);
  });

  test("a project-only config.json change (no kit version change) does NOT require a restart", () => {
    // This is the deliberate trade-off of comparing kit versions rather than
    // per-skill file content: reassigning a skill's owner via `config set`
    // genuinely does change what gets compiled, but since the kit version itself
    // hasn't moved, this signal stays "no". The `fkit-config` skill's own flow
    // already tells the user to run `sync` right after `config set`, so the new
    // compiled files are in place regardless of what this flag says.
    run(CONFIG_MJS, ["set", "--project", dir, "--skill", "fkit-wiki-query", "--model", "codex"]);
    const out = run(SYNC_MJS, ["--project", dir]);
    assert.equal(restartRequired(out), false);
  });

  test("a config.json version older than the current kit requires a restart", () => {
    const before = JSON.parse(readFileSync(configPath, "utf8"));
    const realVersion = before.version;
    writeFileSync(configPath, JSON.stringify({ ...before, version: "0.0.1" }, null, 2) + "\n");

    const out = run(SYNC_MJS, ["--project", dir]);
    assert.equal(restartRequired(out), true);
    assert.match(out, /0\.0\.1 →/);

    // sync re-stamps config.json's version to the real current kit version — not a
    // no-op, since we just forced it back to a stale value.
    const after = JSON.parse(readFileSync(configPath, "utf8"));
    assert.notEqual(after.version, "0.0.1");
    assert.equal(after.version, realVersion);
  });

  test("the next sync afterward is back to no restart needed", () => {
    const out = run(SYNC_MJS, ["--project", dir]);
    assert.equal(restartRequired(out), false);
  });

  test("no separate ai-agents/.fkit-version stamp file is ever created", () => {
    assert.equal(existsSync(join(dir, "ai-agents", ".fkit-version")), false);
  });
});
