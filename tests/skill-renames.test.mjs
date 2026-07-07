// Coverage for the skill-rename migration (wiki-* → fkit-wiki-*) and the
// orphan-pruning of stale generated skill dirs that a rename leaves behind.
//
//   - applySkillRenames: pure map transform (idempotent, no-clobber, model-preserving)
//   - loadOrMigrateConfig: renames pins on both the existing-config and seed-from-manifest paths
//   - compile-skills: full compile prunes orphaned marker-bearing dirs; marker-less dirs survive;
//     an `--only` (partial) compile prunes nothing

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync, existsSync, cpSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

import {
  SKILL_RENAMES,
  applySkillRenames,
  loadOrMigrateConfig,
  writeConfig,
  readKitVersion,
} from "../bin/lib.mjs";
import { KIT_ROOT, mkTmpDir, rmTmpDir } from "./helpers.mjs";

const BOOTSTRAP_MJS = join(KIT_ROOT, "bin", "bootstrap.mjs");
const SYNC_MJS = join(KIT_ROOT, "bin", "sync.mjs");
const COMPILE_MJS = join(KIT_ROOT, "bin", "compile-skills.mjs");
const SAMPLE_MANIFEST = join(KIT_ROOT, "examples", "sample.ai-agents.yml");

function run(script, args) {
  return execFileSync("node", [script, ...args], { encoding: "utf8" });
}

// The generated-skill marker (any version) — a planted orphan must carry it to be
// eligible for pruning; a marker-less dir models a scaffolded role / project skill.
function generatedSkill(name) {
  return `---\nname: ${name}\n---\n<!-- fkit:generated source=${name} version=0.0.1 — do NOT hand-edit -->\n\n# ${name}\n`;
}
function projectSkill(name) {
  return `---\nname: ${name}\n---\n\n# ${name} (hand-authored, no marker)\n`;
}

describe("SKILL_RENAMES / applySkillRenames", () => {
  test("the rename map covers exactly the four wiki skills with the fkit- prefix", () => {
    assert.deepEqual(SKILL_RENAMES, {
      "wiki-query": "fkit-wiki-query",
      "wiki-ingest": "fkit-wiki-ingest",
      "wiki-lint": "fkit-wiki-lint",
      "wiki-sync": "fkit-wiki-sync",
    });
  });

  test("moves an old-name pin to its new name, preserving the model", () => {
    const config = { defaultModel: "claude", skills: { "wiki-ingest": { model: "codex" } } };
    assert.equal(applySkillRenames(config), true);
    assert.deepEqual(config.skills, { "fkit-wiki-ingest": { model: "codex" } });
  });

  test("is idempotent — a second pass changes nothing", () => {
    const config = { defaultModel: "claude", skills: { "wiki-lint": { model: "codex" } } };
    applySkillRenames(config);
    assert.equal(applySkillRenames(config), false);
    assert.deepEqual(config.skills, { "fkit-wiki-lint": { model: "codex" } });
  });

  test("never clobbers an existing new-name pin — the new name wins, the stale old key is dropped", () => {
    const config = {
      defaultModel: "claude",
      skills: { "wiki-query": { model: "codex" }, "fkit-wiki-query": { model: "claude" } },
    };
    assert.equal(applySkillRenames(config), true);
    assert.deepEqual(config.skills, { "fkit-wiki-query": { model: "claude" } });
  });

  test("leaves unrelated pins and an empty skills map untouched", () => {
    const config = { defaultModel: "claude", skills: { "task-done": { model: "claude" } } };
    assert.equal(applySkillRenames(config), false);
    assert.deepEqual(config.skills, { "task-done": { model: "claude" } });

    const empty = { defaultModel: "claude", skills: {} };
    assert.equal(applySkillRenames(empty), false);
    assert.deepEqual(empty.skills, {});
  });
});

describe("loadOrMigrateConfig — rename on load", () => {
  test("existing config.json with legacy wiki-* pins is migrated to fkit-wiki-* (models preserved), persisted", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      mkdirSync(aiAgentsDir, { recursive: true });
      writeConfig(aiAgentsDir, {
        version: "0.1.10",
        defaultModel: "claude",
        skills: {
          "wiki-query": { model: "claude" },
          "wiki-ingest": { model: "codex" },
          "wiki-lint": { model: "codex" },
          "wiki-sync": { model: "codex" },
        },
      });

      const { config } = loadOrMigrateConfig(aiAgentsDir, {}, KIT_ROOT);

      assert.deepEqual(config.skills, {
        "fkit-wiki-query": { model: "claude" },
        "fkit-wiki-ingest": { model: "codex" },
        "fkit-wiki-lint": { model: "codex" },
        "fkit-wiki-sync": { model: "codex" },
      });

      // persisted to disk, not just in memory
      const onDisk = JSON.parse(readFileSync(join(aiAgentsDir, "config.json"), "utf8"));
      assert.deepEqual(Object.keys(onDisk.skills).sort(), [
        "fkit-wiki-ingest",
        "fkit-wiki-lint",
        "fkit-wiki-query",
        "fkit-wiki-sync",
      ]);
      assert.equal(onDisk.skills["wiki-query"], undefined);
    } finally {
      rmTmpDir(dir);
    }
  });

  test("seed-from-manifest path: a legacy manifest's owned wiki-* names come out as fkit-wiki-*", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      // No config.json yet → seeds from the manifest, which (being an OLD project)
      // still uses the pre-rename names in its owned: block.
      const manifest = { skills: { owned: { "wiki-ingest": "codex", "wiki-sync": "codex" } } };
      const { config, migrated } = loadOrMigrateConfig(aiAgentsDir, manifest, KIT_ROOT);

      assert.equal(migrated, true);
      assert.deepEqual(config.skills, {
        "fkit-wiki-ingest": { model: "codex" },
        "fkit-wiki-sync": { model: "codex" },
      });
    } finally {
      rmTmpDir(dir);
    }
  });
});

describe("orphan pruning of stale generated skills", () => {
  let dir;

  before(() => {
    dir = mkTmpDir("fkit-prune-");
    mkdirSync(join(dir, "ai-agents"), { recursive: true });
    cpSync(SAMPLE_MANIFEST, join(dir, "ai-agents", "ai-agents.yml"));
    // Full build so the project has real compiled skills + config.json.
    run(BOOTSTRAP_MJS, ["--out", dir, "--manifest", join(dir, "ai-agents", "ai-agents.yml"), "--force"]);
  });

  after(() => {
    rmTmpDir(dir);
  });

  test("a full sync prunes a marker-bearing orphan but preserves a marker-less (project) dir", () => {
    // A generated skill the kit no longer ships (marker present) → must be pruned.
    const orphan = join(dir, ".claude", "skills", "zzz-removed-skill");
    mkdirSync(orphan, { recursive: true });
    writeFileSync(join(orphan, "SKILL.md"), generatedSkill("zzz-removed-skill"));
    // A hand-authored / scaffolded skill (no marker) → must be preserved.
    const kept = join(dir, ".claude", "skills", "my-project-skill");
    mkdirSync(kept, { recursive: true });
    writeFileSync(join(kept, "SKILL.md"), projectSkill("my-project-skill"));

    const out = run(SYNC_MJS, ["--project", dir]);

    assert.equal(existsSync(orphan), false, "marker-bearing orphan should be pruned");
    assert.equal(existsSync(kept), true, "marker-less project skill should be preserved");
    assert.match(out, /pruned orphaned generated skill .*zzz-removed-skill/);
  });

  test("an --only (partial) compile prunes nothing", () => {
    const orphan = join(dir, ".claude", "skills", "zzz-removed-skill-2");
    mkdirSync(orphan, { recursive: true });
    writeFileSync(join(orphan, "SKILL.md"), generatedSkill("zzz-removed-skill-2"));

    const out = run(COMPILE_MJS, [
      "--manifest",
      join(dir, "ai-agents", "ai-agents.yml"),
      "--out",
      dir,
      "--only",
      "fkit-config",
    ]);

    assert.equal(existsSync(orphan), true, "an --only run must never prune (it sees one skill)");
    assert.doesNotMatch(out, /pruned/);
  });
});
