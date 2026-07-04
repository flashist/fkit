// Unit tests for bin/lib.mjs's config-system (ai-agents/config.json) helpers:
// the "exactly two states — unlisted-follows-default, or pinned to claude|codex,
// no 'both'" model added this round, plus its legacy-manifest migration path.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import {
  MODEL_ENUM,
  discoverSkills,
  readKitVersion,
  buildConfigSchema,
  migrateConfigFromManifest,
  validateConfig,
  loadConfig,
  writeConfig,
  loadOrMigrateConfig,
  resolveSkillModel,
  updateCodexModel,
} from "../bin/lib.mjs";
import { KIT_ROOT, mkTmpDir, rmTmpDir } from "./helpers.mjs";

describe("MODEL_ENUM", () => {
  test("is exactly claude and codex — no 'both'", () => {
    assert.deepEqual(MODEL_ENUM, ["claude", "codex"]);
  });
});

describe("validateConfig", () => {
  test("rejects a non-object", () => {
    assert.throws(() => validateConfig(null), /must be a JSON object/);
    assert.throws(() => validateConfig("nope"), /must be a JSON object/);
    assert.throws(() => validateConfig(["array"]), /must be a JSON object/);
  });

  test("rejects a missing or out-of-enum defaultModel", () => {
    assert.throws(() => validateConfig({}), /defaultModel must be one of claude\|codex/);
    assert.throws(() => validateConfig({ defaultModel: "both" }), /defaultModel must be one of claude\|codex/);
    assert.throws(() => validateConfig({ defaultModel: "gpt" }), /defaultModel must be one of claude\|codex/);
  });

  test("defaults skills to {} when absent", () => {
    const config = validateConfig({ defaultModel: "claude" });
    assert.deepEqual(config.skills, {});
  });

  test("rejects an out-of-enum skill model", () => {
    assert.throws(
      () => validateConfig({ defaultModel: "claude", skills: { x: { model: "both" } } }),
      /skills\.x\.model must be one of claude\|codex/,
    );
    assert.throws(
      () => validateConfig({ defaultModel: "claude", skills: { x: {} } }),
      /skills\.x\.model must be one of claude\|codex/,
    );
  });

  test("accepts a well-formed config", () => {
    const config = validateConfig({
      version: "1.2.3",
      defaultModel: "codex",
      skills: { "wiki-ingest": { model: "codex" }, "task-done": { model: "claude" } },
    });
    assert.equal(config.defaultModel, "codex");
    assert.equal(config.skills["wiki-ingest"].model, "codex");
  });
});

describe("migrateConfigFromManifest", () => {
  test("empty manifest → claude default, no skill overrides", () => {
    const config = migrateConfigFromManifest({}, "0.1.11");
    assert.deepEqual(config, { version: "0.1.11", defaultModel: "claude", skills: {} });
  });

  test("routing.default carries over when it's a real model", () => {
    const config = migrateConfigFromManifest({ routing: { default: "codex" } }, "0.1.11");
    assert.equal(config.defaultModel, "codex");
  });

  test("legacy routing.default: 'both' falls back to claude (both no longer valid)", () => {
    const config = migrateConfigFromManifest({ routing: { default: "both" } }, "0.1.11");
    assert.equal(config.defaultModel, "claude");
  });

  test("skills.shared has no equivalent anymore — entries are simply omitted", () => {
    const config = migrateConfigFromManifest(
      { skills: { shared: ["wiki-query", "plan-task"] } },
      "0.1.11",
    );
    assert.deepEqual(config.skills, {});
  });

  test("skills.claude_only / codex_only map to explicit pins", () => {
    const config = migrateConfigFromManifest(
      { skills: { claude_only: ["task-done"], codex_only: ["wiki-lint"] } },
      "0.1.11",
    );
    assert.deepEqual(config.skills, {
      "task-done": { model: "claude" },
      "wiki-lint": { model: "codex" },
    });
  });

  test("skills.owned maps claude → claude, anything else → codex", () => {
    const config = migrateConfigFromManifest(
      { skills: { owned: { "task-done": "claude", "wiki-ingest": "codex", "wiki-sync": "something-else" } } },
      "0.1.11",
    );
    assert.deepEqual(config.skills, {
      "task-done": { model: "claude" },
      "wiki-ingest": { model: "codex" },
      "wiki-sync": { model: "codex" },
    });
  });

  test("stamps the given version verbatim", () => {
    const config = migrateConfigFromManifest({}, "9.9.9");
    assert.equal(config.version, "9.9.9");
  });
});

describe("resolveSkillModel", () => {
  const config = { defaultModel: "codex", skills: { "task-done": { model: "claude" } } };

  test("an unlisted skill inherits defaultModel", () => {
    assert.deepEqual(resolveSkillModel(config, "wiki-query"), { model: "codex", source: "default" });
  });

  test("a pinned skill returns its override", () => {
    assert.deepEqual(resolveSkillModel(config, "task-done"), { model: "claude", source: "override" });
  });
});

describe("buildConfigSchema", () => {
  test("stamps the given version at the top level", () => {
    assert.equal(buildConfigSchema("1.2.3").version, "1.2.3");
  });

  test("defaultModel and skills.memberSchema only describe claude/codex — no 'both'", () => {
    const schema = buildConfigSchema("1.0.0");
    assert.deepEqual(Object.keys(schema.fields.defaultModel.values).sort(), ["claude", "codex"]);
    assert.deepEqual(Object.keys(schema.fields.skills.memberSchema.values).sort(), ["claude", "codex"]);
  });

  test("version field is display-only, defaultModel and skills.memberSchema are interactive", () => {
    const schema = buildConfigSchema("1.0.0");
    assert.equal(schema.fields.version.interactive, false);
    assert.equal(schema.fields.defaultModel.interactive, true);
    assert.equal(schema.fields.skills.interactive, false); // the group header itself isn't a choice
    assert.equal(schema.fields.skills.memberSchema.interactive, true); // each member is
  });
});

describe("readKitVersion", () => {
  test("reads and trims the kit's own VERSION file", () => {
    const version = readKitVersion(KIT_ROOT);
    const expected = readFileSync(join(KIT_ROOT, "VERSION"), "utf8").trim();
    assert.equal(version, expected);
    assert.match(version, /^\d+\.\d+\.\d+$/);
  });

  test("falls back to 0.0.0 when there is no VERSION file", () => {
    const dir = mkTmpDir();
    try {
      assert.equal(readKitVersion(dir), "0.0.0");
    } finally {
      rmTmpDir(dir);
    }
  });
});

describe("discoverSkills", () => {
  test("finds real skill sources under generic/skills/{shared,claude,codex}", () => {
    const found = discoverSkills(KIT_ROOT);
    assert.ok(found.length > 0);
    for (const s of found) {
      assert.ok(["shared", "claude", "codex"].includes(s.tier), `unexpected tier "${s.tier}" for ${s.name}`);
      assert.ok(existsSync(join(s.dir, "skill.md")));
    }
    const names = found.map((s) => s.name);
    assert.ok(names.includes("fkit-config"), "fkit-config should be discovered");
    const fkitConfig = found.find((s) => s.name === "fkit-config");
    assert.equal(fkitConfig.tier, "shared");
  });
});

describe("updateCodexModel", () => {
  test("replaces model/review_model lines and leaves the rest intact", () => {
    const toml = [
      "#:schema https://example.com/schema.json",
      "",
      'model = "old-model"',
      'review_model = "old-model"',
      "",
      "[some_other_section]",
      "keep = true",
    ].join("\n");
    const updated = updateCodexModel(toml, "new-model");
    assert.match(updated, /^model = "new-model"$/m);
    assert.match(updated, /^review_model = "new-model"$/m);
    assert.match(updated, /keep = true/);
  });
});

describe("loadConfig", () => {
  test("throws a clear message when config.json is missing", () => {
    const dir = mkTmpDir();
    try {
      assert.throws(() => loadConfig(dir), /no ai-agents\/config\.json at/);
    } finally {
      rmTmpDir(dir);
    }
  });

  test("throws a clear message on malformed JSON", () => {
    const dir = mkTmpDir();
    try {
      writeFileSync(join(dir, "config.json"), "{ not json");
      assert.throws(() => loadConfig(dir), /not valid JSON/);
    } finally {
      rmTmpDir(dir);
    }
  });

  test("loads and validates a well-formed config.json", () => {
    const dir = mkTmpDir();
    try {
      writeConfig(dir, { version: "1.0.0", defaultModel: "codex", skills: {} });
      const config = loadConfig(dir);
      assert.equal(config.defaultModel, "codex");
    } finally {
      rmTmpDir(dir);
    }
  });
});

describe("loadOrMigrateConfig", () => {
  test("missing config.json → migrates from the manifest and writes both files", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      const manifest = { routing: { default: "codex" }, skills: { claude_only: ["task-done"] } };
      const { config, migrated } = loadOrMigrateConfig(aiAgentsDir, manifest, KIT_ROOT);

      assert.equal(migrated, true);
      assert.equal(config.defaultModel, "codex");
      assert.deepEqual(config.skills, { "task-done": { model: "claude" } });
      assert.equal(config.version, readKitVersion(KIT_ROOT));

      assert.ok(existsSync(join(aiAgentsDir, "config.json")));
      assert.ok(existsSync(join(aiAgentsDir, "config-schema.json")));
      const onDisk = JSON.parse(readFileSync(join(aiAgentsDir, "config.json"), "utf8"));
      assert.deepEqual(onDisk, config);
    } finally {
      rmTmpDir(dir);
    }
  });

  test("existing valid config.json is loaded as-is — manifest is NOT reconciled", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      mkdirSync(aiAgentsDir, { recursive: true });
      writeConfig(aiAgentsDir, { version: "0.0.1", defaultModel: "claude", skills: {} });
      // A manifest that, if consulted, would suggest a totally different config —
      // it must be ignored once config.json already exists.
      const manifest = { routing: { default: "codex" }, skills: { claude_only: ["everything"] } };

      const { config, migrated } = loadOrMigrateConfig(aiAgentsDir, manifest, KIT_ROOT);

      assert.equal(migrated, false);
      assert.equal(config.defaultModel, "claude"); // untouched, not re-derived from routing.default
      assert.deepEqual(config.skills, {});
    } finally {
      rmTmpDir(dir);
    }
  });

  test("auto-migrates legacy 'both' values away (defaultModel and per-skill)", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      mkdirSync(aiAgentsDir, { recursive: true });
      writeConfig(aiAgentsDir, {
        version: "0.0.1",
        defaultModel: "both",
        skills: {
          "wiki-query": { model: "both" },
          "plan-task": { model: "both" },
          "task-done": { model: "claude" },
        },
      });

      const { config } = loadOrMigrateConfig(aiAgentsDir, {}, KIT_ROOT);

      assert.equal(config.defaultModel, "claude");
      // the legacy "both" skill overrides are dropped entirely (fall through to default)...
      assert.equal(config.skills["wiki-query"], undefined);
      assert.equal(config.skills["plan-task"], undefined);
      // ...but a real, non-"both" override survives untouched.
      assert.deepEqual(config.skills["task-done"], { model: "claude" });

      // and the migration is persisted, not just returned in-memory.
      const onDisk = JSON.parse(readFileSync(join(aiAgentsDir, "config.json"), "utf8"));
      assert.equal(onDisk.defaultModel, "claude");
      assert.equal(onDisk.skills["wiki-query"], undefined);
    } finally {
      rmTmpDir(dir);
    }
  });

  test("a stale version is bumped to the current kit version, without touching defaultModel/skills", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      mkdirSync(aiAgentsDir, { recursive: true });
      writeConfig(aiAgentsDir, { version: "0.0.1", defaultModel: "codex", skills: { "task-done": { model: "claude" } } });

      const { config } = loadOrMigrateConfig(aiAgentsDir, {}, KIT_ROOT);

      assert.equal(config.version, readKitVersion(KIT_ROOT));
      assert.equal(config.defaultModel, "codex");
      assert.deepEqual(config.skills, { "task-done": { model: "claude" } });
    } finally {
      rmTmpDir(dir);
    }
  });

  test("is a no-op (no rewrite) on a second call with nothing stale — same version in, same content out", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      mkdirSync(aiAgentsDir, { recursive: true });
      const kitVersion = readKitVersion(KIT_ROOT);
      writeConfig(aiAgentsDir, { version: kitVersion, defaultModel: "codex", skills: {} });
      const before = readFileSync(join(aiAgentsDir, "config.json"), "utf8");

      loadOrMigrateConfig(aiAgentsDir, {}, KIT_ROOT);

      const after = readFileSync(join(aiAgentsDir, "config.json"), "utf8");
      assert.equal(after, before);
    } finally {
      rmTmpDir(dir);
    }
  });

  test("still rejects a genuinely invalid (non-'both') value after migration", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      mkdirSync(aiAgentsDir, { recursive: true });
      writeConfig(aiAgentsDir, { version: "0.0.1", defaultModel: "gpt-5", skills: {} });
      assert.throws(() => loadOrMigrateConfig(aiAgentsDir, {}, KIT_ROOT), /defaultModel must be one of claude\|codex/);
    } finally {
      rmTmpDir(dir);
    }
  });

  test("throws a clear message on malformed JSON instead of migrating", () => {
    const dir = mkTmpDir();
    try {
      const aiAgentsDir = join(dir, "ai-agents");
      mkdirSync(aiAgentsDir, { recursive: true });
      writeConfig(aiAgentsDir, { version: "0.0.1", defaultModel: "claude", skills: {} });
      writeFileSync(join(aiAgentsDir, "config.json"), "{ not json at all");
      assert.throws(() => loadOrMigrateConfig(aiAgentsDir, {}, KIT_ROOT), /not valid JSON/);
    } finally {
      rmTmpDir(dir);
    }
  });
});
