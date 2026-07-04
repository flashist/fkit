// End-to-end regression coverage for this session's two changes:
//   1. the config.json/config-schema.json system (bootstrap seeds it, sync keeps it live)
//   2. removal of the task-type `routing:` block and its generated CLAUDE.md/AGENTS.md section
//
// Exercises the real CLI entry points (bootstrap.mjs, sync.mjs) as documented in
// README.md's two-pass recipe, against a scratch directory — no repo files touched.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, cpSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

import { KIT_ROOT, mkTmpDir, rmTmpDir } from "./helpers.mjs";

const BOOTSTRAP_MJS = join(KIT_ROOT, "bin", "bootstrap.mjs");
const SYNC_MJS = join(KIT_ROOT, "bin", "sync.mjs");
const SAMPLE_MANIFEST = join(KIT_ROOT, "examples", "sample.ai-agents.yml");

function run(script, args) {
  return execFileSync("node", [script, ...args], { encoding: "utf8" });
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("bootstrap (two-pass) + sync — end to end", () => {
  let dir;

  before(() => {
    dir = mkTmpDir("fkit-e2e-");
  });

  after(() => {
    rmTmpDir(dir);
  });

  test("pass 1 (no --manifest): writes a starter manifest + seeds config.json/config-schema.json", () => {
    run(BOOTSTRAP_MJS, ["--out", dir]);

    const manifestPath = join(dir, "ai-agents", "ai-agents.yml");
    const configPath = join(dir, "ai-agents", "config.json");
    const schemaPath = join(dir, "ai-agents", "config-schema.json");

    assert.ok(existsSync(manifestPath), "starter manifest should exist");
    assert.ok(existsSync(configPath), "config.json should be seeded on pass 1");
    assert.ok(existsSync(schemaPath), "config-schema.json should be seeded on pass 1");

    const config = JSON.parse(readFileSync(configPath, "utf8"));
    assert.ok(["claude", "codex"].includes(config.defaultModel));
    assert.deepEqual(Object.keys(config).sort(), ["defaultModel", "skills", "version"]);
  });

  test("pass 2 (--manifest, real project manifest): builds without any routing block/marker leaking", () => {
    // Swap the starter for the real sample manifest, matching the documented "edit
    // the yml in place, then build" flow — the sample still has `roles:` (which
    // legitimately keeps "both") but no `routing:` block anymore.
    cpSync(SAMPLE_MANIFEST, join(dir, "ai-agents", "ai-agents.yml"));

    run(BOOTSTRAP_MJS, ["--out", dir, "--manifest", join(dir, "ai-agents", "ai-agents.yml"), "--force"]);

    const claudeMd = readFileSync(join(dir, "CLAUDE.md"), "utf8");
    const agentsMd = readFileSync(join(dir, "AGENTS.md"), "utf8");

    for (const [name, text] of [["CLAUDE.md", claudeMd], ["AGENTS.md", agentsMd]]) {
      assert.doesNotMatch(text, /\{\{\s*routing_block\s*\}\}/, `${name}: no unresolved routing_block placeholder`);
      assert.doesNotMatch(text.toLowerCase(), /routing/, `${name}: no "routing" concept left at all`);
      assert.doesNotMatch(text, /fkit:routing/, `${name}: no leftover fenced routing markers`);
    }
  });

  test("compiled skills exist for both models and config.json is still valid", () => {
    assert.ok(existsSync(join(dir, ".claude", "skills", "fkit-config", "SKILL.md")));
    assert.ok(existsSync(join(dir, ".codex", "skills", "fkit-config", "SKILL.md")));

    const config = JSON.parse(readFileSync(join(dir, "ai-agents", "config.json"), "utf8"));
    assert.ok(["claude", "codex"].includes(config.defaultModel));

    const fkitVersion = readFileSync(join(KIT_ROOT, "VERSION"), "utf8").trim();
    assert.equal(config.version, fkitVersion);
    // No separate ai-agents/.fkit-version stamp file anymore — config.json's own
    // `version` field is the only record of what this project was compiled against.
    assert.equal(existsSync(join(dir, "ai-agents", ".fkit-version")), false);
  });

  test("compiled fkit-config skill no longer instructs the agent to fetch/surface a task-type routing table", () => {
    // Regression test for a stale-instructions bug: skill.md used to tell the agent
    // that `config show --json` returns a task-type routing table (it doesn't, not
    // since the routing: block was removed) and to "also surface" one — the agent
    // dutifully complied by reading ai-agents.yml's routing: block directly and
    // rendering it. skill.md's own explanatory note that this table no longer
    // exists legitimately contains the word "task-type", so assert against the
    // specific old instructions rather than that substring.
    const claudeSkill = readFileSync(join(dir, ".claude", "skills", "fkit-config", "SKILL.md"), "utf8");
    assert.doesNotMatch(claudeSkill.toLowerCase(), /routing table \(from/);
    assert.doesNotMatch(claudeSkill.toLowerCase(), /also surface the task-type routing table/);
    assert.match(claudeSkill.toLowerCase(), /there is no task-type routing table anymore/);
  });

  test("sync is idempotent: a compiled skill file is byte-identical across repeated syncs", () => {
    const target = join(dir, ".claude", "skills", "fkit-config", "SKILL.md");
    const before1 = sha256(target);

    run(SYNC_MJS, ["--project", dir]);
    const afterFirstSync = sha256(target);
    assert.equal(afterFirstSync, before1);

    run(SYNC_MJS, ["--project", dir]);
    const afterSecondSync = sha256(target);
    assert.equal(afterSecondSync, before1);
  });

  test("sync never touches CLAUDE.md/AGENTS.md (still no routing content after sync)", () => {
    const claudeMd = readFileSync(join(dir, "CLAUDE.md"), "utf8");
    const agentsMd = readFileSync(join(dir, "AGENTS.md"), "utf8");
    assert.doesNotMatch(claudeMd.toLowerCase(), /routing/);
    assert.doesNotMatch(agentsMd.toLowerCase(), /routing/);
  });
});
