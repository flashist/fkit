// Tests for compile-skills.mjs's `restart-required: claude=<yes|no> codex=<yes|no>`
// line — the signal the `fkit` skill uses to warn the user that THIS session needs
// a restart to pick up a skill change (a running session keeps whatever SKILL.md
// content it already loaded; a recompile alone has no effect on it).

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, cpSync } from "node:fs";
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

function restartLine(output) {
  const line = output.split("\n").find((l) => l.startsWith("restart-required:"));
  assert.ok(line, `no restart-required line in output:\n${output}`);
  return {
    claude: /claude=yes/.test(line),
    codex: /codex=yes/.test(line),
  };
}

describe("restart-required signal", () => {
  let dir;

  before(() => {
    dir = mkTmpDir("fkit-restart-");
    mkdirSync(join(dir, "ai-agents"), { recursive: true });
    cpSync(SAMPLE_MANIFEST, join(dir, "ai-agents", "ai-agents.yml"));
  });

  after(() => {
    rmTmpDir(dir);
  });

  test("a fresh build reports both sides changed (every file is new)", () => {
    const out = run(BOOTSTRAP_MJS, [
      "--out",
      dir,
      "--manifest",
      join(dir, "ai-agents", "ai-agents.yml"),
      "--force",
    ]);
    const { claude, codex } = restartLine(out);
    assert.equal(claude, true);
    assert.equal(codex, true);
  });

  test("an immediate re-sync with nothing changed reports neither side", () => {
    const out = run(SYNC_MJS, ["--project", dir]);
    const { claude, codex } = restartLine(out);
    assert.equal(claude, false);
    assert.equal(codex, false);
  });

  // The "a bare kit-version bump alone doesn't count as a change" case is covered
  // by lib.config.test.mjs's normalizeGeneratedMarker unit tests instead of here:
  // this file's tests share the real repo checkout across concurrently-running
  // test files, so mutating the shared VERSION file on disk would race with any
  // other test file invoking these same CLIs at the same time.

  test("pinning one skill to a different model reports exactly that skill, both sides", () => {
    run(CONFIG_MJS, ["set", "--project", dir, "--skill", "wiki-query", "--model", "codex"]);
    const out = run(SYNC_MJS, ["--project", dir]);
    const { claude, codex } = restartLine(out);
    assert.equal(claude, true);
    assert.equal(codex, true);
    assert.match(out, /claude skill\(s\) changed: wiki-query/);
    assert.match(out, /codex skill\(s\) changed: wiki-query/);
  });

  test("a subsequent no-op sync goes back to neither side", () => {
    const out = run(SYNC_MJS, ["--project", dir]);
    const { claude, codex } = restartLine(out);
    assert.equal(claude, false);
    assert.equal(codex, false);
  });
});
