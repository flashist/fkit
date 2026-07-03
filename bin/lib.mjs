// fkit — shared utilities for the compiler and the role scaffolder.
// Zero-dependency YAML-subset reader + placeholder substitution.
//
// The YAML reader handles a scoped subset: nested maps (indent-based), scalars,
// and inline flow maps `{ a: b }` / lists `[a, b]`. No block lists or block
// scalars. The kit controls every file this parses, so the subset is sufficient.

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

// Render the generated model-routing block (WITH its fenced markers) from a manifest.
// bootstrap inserts it via the {{routing_block}} placeholder; sync replaces the region
// between the markers in place.
export function renderRoutingBlock(manifest) {
  const routing = manifest.routing || {};
  const roles = manifest.roles || {};
  const cap = (s) =>
    s === "both" ? "both" : String(s).charAt(0).toUpperCase() + String(s).slice(1);
  const rows = Object.entries(routing)
    .filter(([k]) => k !== "default")
    .map(([k, v]) => `| ${k} | **${cap(v)}** |`);
  if (routing.default) rows.push(`| _(default)_ | **${cap(routing.default)}** |`);
  const roleList = Object.entries(roles)
    .map(([r, cfg]) => `${r} → ${cap((cfg && cfg.model) || "claude")}`)
    .join(", ");
  return [
    "<!-- fkit:routing:start -->",
    "### Model routing (generated from ai-agents/ai-agents.yml — edit there, then run sync)",
    "",
    "| Task type | Owner |",
    "|---|---|",
    ...rows,
    "",
    roleList ? `Agents (terminal-tab roles): ${roleList}.` : "",
    "When a task type is owned by a model you are not, hand it to that model's tab (or delegate via the companion).",
    "<!-- fkit:routing:end -->",
  ].join("\n");
}

// Replace the text between (and including) two markers. Absent markers → unchanged.
export function replaceFenced(text, startMarker, endMarker, replacement) {
  const s = text.indexOf(startMarker);
  const e = text.indexOf(endMarker);
  if (s === -1 || e === -1 || e < s) return { text, replaced: false };
  return {
    text: text.slice(0, s) + replacement + text.slice(e + endMarker.length),
    replaced: true,
  };
}

// Update the model / review_model lines in a Codex config.toml, leaving the rest intact.
export function updateCodexModel(toml, id) {
  return toml
    .replace(/^model\s*=.*$/m, `model = "${id}"`)
    .replace(/^review_model\s*=.*$/m, `review_model = "${id}"`);
}
