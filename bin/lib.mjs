// fkit — shared utilities for the compiler and the role scaffolder.
// Zero-dependency YAML-subset reader + placeholder substitution + JSON config helpers.
//
// The YAML reader handles a scoped subset: nested maps (indent-based), scalars,
// and inline flow maps `{ a: b }` / lists `[a, b]`. No block lists or block
// scalars. The kit controls every file this parses, so the subset is sufficient.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export function stripQuotes(s) {
  s = s.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

export function parseFlow(val) {
  const t = val.trim();
  if (t.startsWith("[") && t.endsWith("]")) {
    const inner = t.slice(1, -1).trim();
    return inner ? inner.split(",").map((x) => stripQuotes(x)) : [];
  }
  if (t.startsWith("{") && t.endsWith("}")) {
    const inner = t.slice(1, -1).trim();
    const obj = {};
    if (!inner) return obj;
    for (const pair of inner.split(",")) {
      const i = pair.indexOf(":");
      if (i === -1) continue;
      obj[pair.slice(0, i).trim()] = stripQuotes(pair.slice(i + 1));
    }
    return obj;
  }
  return stripQuotes(t);
}

export function parseYaml(text) {
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const raw of text.split("\n")) {
    if (!raw.trim()) continue;
    const noIndent = raw.replace(/^\s*/, "");
    if (noIndent.startsWith("#")) continue; // full-line comment
    const indent = raw.length - noIndent.length;
    const line = noIndent.replace(/\s+$/, "");
    const ci = line.indexOf(":");
    if (ci === -1) continue; // unsupported construct in this subset — skip
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci + 1).trim();
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].obj;
    if (val === "") {
      const child = {};
      parent[key] = child;
      stack.push({ indent, obj: child });
    } else {
      parent[key] = parseFlow(val);
    }
  }
  return root;
}

export function splitFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: md };
  return { fm: parseYaml(m[1]), body: md.slice(m[0].length) };
}

// Replace {{key}} placeholders from `vars`. Unknown placeholders are left as-is
// with a warning (so leaks are visible rather than silently blanked).
export function subVars(text, vars) {
  return String(text).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (m, k) => {
    if (k in vars) return vars[k];
    console.warn(`  ! unknown placeholder {{${k}}} left as-is`);
    return m;
  });
}

// Update the model / review_model lines in a Codex config.toml, leaving the rest intact.
export function updateCodexModel(toml, id) {
  return toml
    .replace(/^model\s*=.*$/m, `model = "${id}"`)
    .replace(/^review_model\s*=.*$/m, `review_model = "${id}"`);
}

// ---------------------------------------------------------------------------
// ai-agents/config.json — single source of truth for model routing settings.
// See ai-agents/config-schema.json (always regenerated, never hand-edited) for
// the machine-readable description of every field/value below.
// ---------------------------------------------------------------------------

// Exactly two states for any skill's model: unlisted (follows defaultModel) or an
// explicit pin to ONE of these. There is no "both" — a skill always has exactly one
// real, live implementation; the other model always gets a delegating stub.
export const MODEL_ENUM = ["claude", "codex"];
const MODEL_VALUE_DESCRIPTIONS = {
  claude: "Runs natively on Claude; every other model gets a stub that delegates to Claude.",
  codex: "Runs natively on Codex; every other model gets a stub that delegates to Codex.",
};

// Source dirs → kit-intended tier. Both the legacy `*-only` names and the plain
// model names map to that model's tier. Mirrors the dirs compile-skills.mjs reads.
const TIER_DIRS = {
  shared: "shared",
  claude: "claude",
  "claude-only": "claude",
  codex: "codex",
  "codex-only": "codex",
};

// Every skill source the kit ships, with its dir-implied tier ("shared" | "claude" | "codex").
export function discoverSkills(kitRoot) {
  const skillsRoot = join(kitRoot, "generic", "skills");
  const found = [];
  for (const [dir, tier] of Object.entries(TIER_DIRS)) {
    const base = join(skillsRoot, dir);
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base)) {
      if (existsSync(join(base, name, "skill.md"))) {
        found.push({ name, tier, dir: join(base, name) });
      }
    }
  }
  return found;
}

// Reads the kit's own release version (repo-root VERSION file — the same source
// package.json/release.mjs keep in sync). "0.0.0" if missing (e.g. a dev checkout
// with no VERSION file yet).
export function readKitVersion(kitRoot) {
  const p = join(kitRoot, "VERSION");
  return existsSync(p) ? readFileSync(p, "utf8").trim() : "0.0.0";
}

// Pure — describes every config.json field + enum value for `fkit config show`,
// the fkit-config skill, and any human reading the file directly.
export function buildConfigSchema(version) {
  return {
    version,
    fields: {
      version: {
        label: "Config version",
        type: "display",
        interactive: false,
        description:
          "The fkit kit version (matches package.json) this file was created/last regenerated under. Auto-updated on every bootstrap/sync. Not user-editable.",
      },
      defaultModel: {
        label: "Default model",
        type: "enum",
        interactive: true,
        description: "The fallback owner for any skill without its own override.",
        values: { ...MODEL_VALUE_DESCRIPTIONS },
      },
      skills: {
        label: "Per-skill overrides",
        type: "group",
        interactive: false,
        description:
          "Pins an individual skill to a specific model, ignoring defaultModel for that skill only. A skill not listed here follows defaultModel.",
        memberSchema: {
          type: "enum",
          interactive: true,
          values: { ...MODEL_VALUE_DESCRIPTIONS },
        },
      },
    },
  };
}

// Pure — derives a starter config.json from a manifest's legacy routing.default +
// skills.{shared,claude_only,codex_only,owned} fields. Used both for real migration
// (an existing project whose config.json is missing) and to seed a brand-new
// project's starter config before config.json exists at all.
export function migrateConfigFromManifest(manifest, version) {
  const routing = manifest.routing || {};
  const sk = manifest.skills || {};
  const skills = {};
  // Legacy `skills.shared` meant "real on every model, no delegation" — there's no
  // equivalent under the current claude|codex-only model, so these are simply
  // omitted (they fall through to the plain default instead of a stale "both" pin).
  for (const n of sk.claude_only || []) skills[n] = { model: "claude" };
  for (const n of sk.codex_only || []) skills[n] = { model: "codex" };
  for (const [n, m] of Object.entries(sk.owned || {})) {
    skills[n] = { model: m === "claude" ? "claude" : "codex" };
  }
  return {
    version,
    defaultModel: routing.default && routing.default !== "both" ? routing.default : "claude",
    skills,
  };
}

// Throws a clear, actionable message (never a raw stack trace) — config.json is
// a hand-editable file, so validation errors must say what's wrong and how to fix it.
export function validateConfig(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("ai-agents/config.json must be a JSON object");
  }
  if (!MODEL_ENUM.includes(config.defaultModel)) {
    throw new Error(
      `ai-agents/config.json: defaultModel must be one of ${MODEL_ENUM.join("|")}, got ${JSON.stringify(config.defaultModel)}`,
    );
  }
  if (config.skills === undefined) config.skills = {};
  for (const [name, entry] of Object.entries(config.skills)) {
    if (!entry || !MODEL_ENUM.includes(entry.model)) {
      throw new Error(
        `ai-agents/config.json: skills.${name}.model must be one of ${MODEL_ENUM.join("|")}, got ${JSON.stringify(entry && entry.model)}`,
      );
    }
  }
  return config;
}

// Read + validate an existing ai-agents/config.json. Throws if missing or invalid —
// callers that want auto-migration-on-missing should use loadOrMigrateConfig instead.
export function loadConfig(aiAgentsDir) {
  const configPath = join(aiAgentsDir, "config.json");
  let raw;
  try {
    raw = readFileSync(configPath, "utf8");
  } catch {
    throw new Error(`no ai-agents/config.json at ${configPath}`);
  }
  let config;
  try {
    config = JSON.parse(raw);
  } catch (e) {
    throw new Error(
      `ai-agents/config.json is not valid JSON: ${e.message}. Fix it by hand, or delete it to re-migrate from ai-agents.yml.`,
    );
  }
  return validateConfig(config);
}

export function writeConfig(aiAgentsDir, config) {
  writeFileSync(join(aiAgentsDir, "config.json"), JSON.stringify(config, null, 2) + "\n");
}

// Load ai-agents/config.json, migrating it from the manifest's legacy routing.default +
// skills: fields the first time it's missing (one-time — after that config.json is
// authoritative with NO reconciliation back to the yml, ever). Always (re)writes
// ai-agents/config-schema.json — that file is kit-owned and always regenerated.
export function loadOrMigrateConfig(aiAgentsDir, manifest, kitRoot) {
  mkdirSync(aiAgentsDir, { recursive: true });
  const configPath = join(aiAgentsDir, "config.json");
  const kitVersion = readKitVersion(kitRoot);
  let config;
  let migrated = false;
  let dirty = false;
  if (existsSync(configPath)) {
    // Read raw + parse here rather than the strict loadConfig(): a project's
    // config.json may still carry legacy "both" values (from before `both` was
    // removed as a valid model — including ones this kit itself wrote via the
    // old self-heal step), and those must be migrated away BEFORE validating
    // against the current, stricter enum, or every such project would fail to
    // load with a validation error instead of auto-migrating.
    let raw;
    try {
      raw = readFileSync(configPath, "utf8");
    } catch {
      throw new Error(`no ai-agents/config.json at ${configPath}`);
    }
    try {
      config = JSON.parse(raw);
    } catch (e) {
      throw new Error(
        `ai-agents/config.json is not valid JSON: ${e.message}. Fix it by hand, or delete it to re-migrate from ai-agents.yml.`,
      );
    }

    // Legacy migration: "both" is no longer a valid model. It used to mean "real,
    // native on every model, no delegation" — dropped because forcing an
    // interactive skill onto a single owner and delegating the other side (a
    // one-shot, non-interactive CLI call) is safer to reason about with exactly
    // two states (an explicit pin, or the plain project default) than a third,
    // implicit "runs everywhere" exception. Convert any leftover "both" to the
    // plain default (skills) or "claude" (defaultModel) so this happens for free,
    // with no hand-editing required.
    const skills = config.skills || {};
    const legacyBoth = Object.entries(skills)
      .filter(([, e]) => e && e.model === "both")
      .map(([n]) => n);
    for (const n of legacyBoth) delete skills[n];
    config.skills = skills;
    if (legacyBoth.length) {
      dirty = true;
      console.log(
        `  migrated legacy "both" skill override(s) → plain default (both is no longer a valid model): ${legacyBoth.join(", ")}`,
      );
    }
    if (config.defaultModel === "both") {
      config.defaultModel = "claude";
      dirty = true;
      console.log('  migrated legacy defaultModel "both" → "claude" (both is no longer a valid model)');
    }

    validateConfig(config);

    const sk = manifest.skills || {};
    const hasLegacy =
      (sk.shared && sk.shared.length) ||
      (sk.owned && Object.keys(sk.owned).length) ||
      (sk.claude_only && sk.claude_only.length) ||
      (sk.codex_only && sk.codex_only.length) ||
      (manifest.routing && manifest.routing.default);
    if (hasLegacy) {
      console.log(
        "  note: ai-agents/config.json exists — ai-agents.yml's skills:/routing.default are now ignored",
      );
    }
    // `version` is a live bookkeeping stamp (like ai-agents/.fkit-version), not a
    // user decision — keep it current on every load, unlike defaultModel/skills.
    if (config.version !== kitVersion) {
      config.version = kitVersion;
      dirty = true;
    }
  } else {
    config = migrateConfigFromManifest(manifest, kitVersion);
    migrated = true;
    dirty = true;
    console.log(
      `  migrated ai-agents/config.json from legacy ai-agents.yml fields (defaultModel=${config.defaultModel}, ${Object.keys(config.skills).length} skill override(s))`,
    );
  }

  if (dirty) writeConfig(aiAgentsDir, config);
  writeFileSync(
    join(aiAgentsDir, "config-schema.json"),
    JSON.stringify(buildConfigSchema(kitVersion), null, 2) + "\n",
  );
  return { config, migrated };
}

// Exactly two states, always: an explicit per-skill override, or the project's
// plain defaultModel. No exceptions of any kind (not even for interactive skills —
// see loadOrMigrateConfig's header comment on the "both" removal).
export function resolveSkillModel(config, name) {
  const override = config.skills && config.skills[name];
  if (override) return { model: override.model, source: "override" };
  return { model: config.defaultModel, source: "default" };
}
