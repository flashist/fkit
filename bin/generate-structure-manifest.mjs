#!/usr/bin/env node
// generate-structure-manifest.mjs — builds claude/structure-manifest.tsv, the shipped table of
// every content hash fkit has ever shipped, per project path. Task 0244; mechanism recorded in
// ADR-015 §Rejected alternatives ("deferred, not rejected") and un-deferred by the owner (Q6 /
// ADR-039 §6); contract specified in report 2026-08-06-design-post-update-structure-check.md §7-§9.
//
// The manifest is the DETERMINATION layer of the structure check: a hash match at a path means fkit
// shipped exactly this content there at some point → the file is untouched by the owner → safe to
// repair; no match → owner-edited → never touch, report. Only this table can decide touched-or-not;
// what SHOULD exist and what each path means is the structure-spec's job (0243) — this file is pure
// data, class-agnostic by owner ruling (0244 plan, open question 2).
//
// "EVERY VERSION EVER SHIPPED" MEANS ALL THREE HISTORICAL HOMES. ADR-015 Context §2 names them:
// `generic/ai-agents`, `omnigent/scaffold/ai-agents`, `claude/scaffold/ai-agents` — all mapping to
// the project path `ai-agents/…`; the root context files shipped from `{omnigent,claude}/scaffold/
// {CLAUDE,AGENTS}.md` (the generic era had none — verified 2026-08-07). The rename-aware walk is
// HOME-level: ADR-015 Context §2 verified zero per-file renames inside a home; the homes ARE the
// renames.
//
// PLUS THE WORKING TREE. A scaffold edit and its regenerated manifest land in the SAME commit — at
// generation time the new blob exists in no commit yet, so a history-only manifest would miss the
// very version its own commit ships. The walk is history ∪ current on-disk `claude/scaffold/`.
//
// THE HASHING CONTRACT (report §7/§8 — consumers MUST apply the same transforms at check time):
//   1. CRLF → LF, exactly that transform, before hashing. Otherwise an untouched file that passed
//      through an autocrlf checkout mismatches every shipped blob and misclassifies as owner-edited
//      — the Windows failure class init already learned (marker_lines' comment in
//      claude/fkit-claude-init.sh). A lone \r is CONTENT, untouched.
//   2. Root context files (project paths CLAUDE.md / AGENTS.md): the lines strictly BETWEEN the
//      rules markers are ELIDED before hashing; the marker lines themselves are KEPT. The block is
//      rewritten by merge_rules on every launch, so including it would make every launched project
//      read as owner-edited; keeping the marker lines is what makes marker DELETION classify as an
//      owner edit (report §8). Markers absent → whole file hashed (the omnigent-era root files
//      really shipped that way). A MALFORMED set (counts ≠ 1/1, or end before begin) → REFUSE
//      loudly, mirroring merge_rules' own refusal — a wrong guess would bake a wrong hash into a
//      shipped artifact.
//   3. sha256, hex, over the resulting bytes.
//
// Marker recognition carries marker_lines' contract (claude/fkit-claude-init.sh:374) VERBATIM in
// JS, by owner ruling (0244 plan, open question 1: "Faithful JS impl"): a marker matches only when
// the WHOLE line, after trimming [ \t\r] at both ends, equals the marker string. Never substring
// match (init's quoted-in-prose defect); \r in the trim set (init's CRLF defect). Test E in
// test/structure-manifest.test.js pins both properties.
//
// THIS SCRIPT IS REPO-SIDE TOOLING — it is not shipped (only claude/ ships); the manifest it writes
// is. It writes exactly ONE file, claude/structure-manifest.tsv (or stdout with --stdout), and
// NOTHING under ai-agents/ or outside the repo. Zero dependencies beyond node builtins (ADR-014).
//
// Output is BYTE-DETERMINISTIC: static header, entries sorted by path then hash, LF endings,
// trailing newline — so regeneration diffs are minimal and the repo test's byte-equality holds.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));   // .../fkit
const MANIFEST_REL = join('claude', 'structure-manifest.tsv');

// Same values as claude/fkit-claude-init.sh:316-317 — the recognition CONTRACT is shared; the
// constants are restated because an inline shell function cannot be imported without executing init.
export const RULES_BEGIN = '<!-- fkit:begin-rules -->';
export const RULES_END = '<!-- fkit:end-rules -->';

// The three historical homes (ADR-015 Context §2) → the project prefix they shipped to.
const HOME_PREFIXES = [
  ['generic/ai-agents/', 'ai-agents/'],
  ['omnigent/scaffold/ai-agents/', 'ai-agents/'],
  ['claude/scaffold/ai-agents/', 'ai-agents/'],
];
// The root context files' historical repo paths → their project path.
const ROOT_FILES = new Map([
  ['omnigent/scaffold/CLAUDE.md', 'CLAUDE.md'],
  ['omnigent/scaffold/AGENTS.md', 'AGENTS.md'],
  ['claude/scaffold/CLAUDE.md', 'CLAUDE.md'],
  ['claude/scaffold/AGENTS.md', 'AGENTS.md'],
]);
// Every path the history walk limits to — 3 home prefixes + 4 root-file paths.
const WALK_PATHS = [...new Set([...HOME_PREFIXES.map(([p]) => p.slice(0, -1)), ...ROOT_FILES.keys()])];

// Root project paths that get the elision treatment (contract point 2).
const ELIDED_PATHS = new Set(['CLAUDE.md', 'AGENTS.md']);

/**
 * Map a repo path (historical or current) to the project path it shipped to.
 * Returns null for paths that ship no project content:
 *   - `.gitkeep` — placeholder class, "check: none" (report §4); pure git plumbing.
 *   - `universal-rules.md` — install-side INPUT to the rules block, never copied into a project;
 *     its content lands inside the marker region, which is elided anyway. (Never seen under a home
 *     prefix in history — verified 2026-08-07 — but excluded by name so a future move cannot
 *     silently promote it to a project path.)
 * @param {string} repoPath
 * @returns {string|null}
 */
function toProjectPath(repoPath) {
  if (repoPath.endsWith('/universal-rules.md') || repoPath === 'universal-rules.md') return null;
  if (repoPath.split('/').pop() === '.gitkeep') return null;
  const root = ROOT_FILES.get(repoPath);
  if (root) return root;
  for (const [prefix, projectPrefix] of HOME_PREFIXES) {
    if (repoPath.startsWith(prefix)) return projectPrefix + repoPath.slice(prefix.length);
  }
  return null;
}

// ── The marker-recognition contract, carried verbatim (marker_lines, fkit-claude-init.sh:374) ────
// awk: { l = $0; gsub(/^[ \t\r]+|[ \t\r]+$/, "", l); if (l == m) print NR }

/**
 * 1-based line numbers where `marker` is the WHOLE line after trimming [ \t\r] at both ends.
 * Lines are `\n`-separated exactly as awk sees records; a trailing `\r` (CRLF input) is trimmed.
 * @param {string} text
 * @param {string} marker
 * @returns {number[]}
 */
export function markerLines(text, marker) {
  const out = [];
  text.split('\n').forEach((line, i) => {
    const l = line.replace(/^[ \t\r]+|[ \t\r]+$/g, '');
    if (l === marker) out.push(i + 1);
  });
  return out;
}

/** CRLF → LF — exactly that transform (contract point 1). A lone \r is content. */
export function normalizeEndings(text) {
  return text.replace(/\r\n/g, '\n');
}

/**
 * Elide the lines strictly between the rules markers, KEEPING the marker lines (contract point 2).
 * No markers → text unchanged (whole-file hash). Malformed → throw; never guess.
 * @param {string} text
 * @returns {string}
 */
export function elideRulesRegion(text) {
  const begins = markerLines(text, RULES_BEGIN);
  const ends = markerLines(text, RULES_END);
  if (begins.length === 0 && ends.length === 0) return text;
  if (begins.length !== 1 || ends.length !== 1 || begins[0] >= ends[0]) {
    throw new Error(
      `malformed rules-marker set: ${begins.length} begin / ${ends.length} end marker line(s)` +
      (begins.length === 1 && ends.length === 1 ? ' (end before begin)' : '') +
      ' — the extent of the block is unknowable, so this content cannot be hashed for the ' +
      'manifest (mirrors merge_rules\' refusal in claude/fkit-claude-init.sh).');
  }
  const [lb, le] = [begins[0], ends[0]];
  const lines = text.split('\n');
  return [...lines.slice(0, lb), ...lines.slice(le - 1)].join('\n');
}

/**
 * The manifest hash of `content` as shipped at `projectPath` — normalize, (root files) elide,
 * sha256 hex. THE check-side computation too: consumers call this (or reproduce it exactly).
 * @param {string} projectPath
 * @param {string|Buffer} content latin1-decoded string or raw bytes (latin1 round-trips any byte)
 * @returns {string}
 */
export function hashFor(projectPath, content) {
  let text = Buffer.isBuffer(content) ? content.toString('latin1') : content;
  text = normalizeEndings(text);
  if (ELIDED_PATHS.has(projectPath)) text = elideRulesRegion(text);
  return createHash('sha256').update(Buffer.from(text, 'latin1')).digest('hex');
}

// ── The walk ─────────────────────────────────────────────────────────────────────────────────────

function git(args, opts = {}) {
  const res = spawnSync('git', args, { cwd: REPO_ROOT, maxBuffer: 1 << 28, ...opts });
  if (res.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed (exit ${res.status}):\n${res.stderr}`);
  }
  return res.stdout;
}

function assertFullClone() {
  const shallow = git(['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim();
  if (shallow !== 'false') {
    throw new Error(
      'this clone is SHALLOW — the manifest is built from the full ancestry of HEAD, and a ' +
      'shallow walk would silently produce an incomplete one. Run `git fetch --unshallow` first.');
  }
}

/**
 * Every (blob sha → project paths) ever shipped, from history.
 *
 * One `git log` pass over the 7 walk paths. `--full-history` so history simplification cannot
 * prune a side branch's version away; `-m` so a merge is diffed against EACH parent — any blob a
 * commit carries that some parent lacks appears in at least one of those diffs, which covers evil
 * merges too (any ancestor sha was installable — the distribution is sha-keyed, ADR-015 Context
 * §4). `--no-renames` because the walk is home-level by design (see header). `--no-abbrev` because
 * the blob shas are keys, not display. `-c log.showRoot=true` PINNED: with a user's
 * `log.showRoot=false` the ROOT commit's raw entries vanish (verified: 131 vs 146 entries here) and
 * the generic-era first-commit blobs silently fall out — the walk must not inherit that config.
 * `-z` because the default output C-quotes non-ASCII paths (core.quotePath) — a quoted path would
 * fail toProjectPath and drop its blob silently; NUL-separated records carry literal path bytes.
 * @returns {Map<string, Set<string>>} blob sha → project paths it shipped at
 */
function historicalBlobs() {
  const raw = git(['-c', 'log.showRoot=true', 'log', '--full-history', '-m', '--raw',
    '--no-renames', '--no-abbrev', '-z', '--format=', 'HEAD', '--', ...WALK_PATHS],
  { encoding: 'utf8' });
  const blobs = new Map();
  // -z output is strictly alternating NUL-separated tokens: ":<mode> <mode> <old-sha> <new-sha>
  // <status>", then the literal-byte path (never two-path R/C records: --no-renames), then the
  // next ":…" record. The final token is the empty string after the last NUL.
  const tokens = raw.split('\0');
  for (let i = 0; i + 1 < tokens.length; i += 2) {
    const meta = tokens[i];
    if (!meta.startsWith(':')) {
      throw new Error(`git log -z --raw: expected a ":…" meta token, got ${JSON.stringify(meta)}`);
    }
    const [, , , newSha] = meta.slice(1).split(/\s+/);
    if (/^0+$/.test(newSha)) continue;                     // deletion — no new content shipped
    const projectPath = toProjectPath(tokens[i + 1]);
    if (projectPath === null) continue;
    if (!blobs.has(newSha)) blobs.set(newSha, new Set());
    blobs.get(newSha).add(projectPath);
  }
  return blobs;
}

/**
 * Read every blob in one `git cat-file --batch` process (speed is load-bearing: the repo test
 * re-runs this generator, and prove-red re-runs the whole suite per mutation).
 * @param {string[]} shas
 * @returns {Map<string, string>} sha → content, latin1-decoded
 */
function readBlobs(shas) {
  if (shas.length === 0) return new Map();
  const buf = git(['cat-file', '--batch'], { input: shas.join('\n') + '\n' });
  const out = new Map();
  let off = 0;
  for (const sha of shas) {
    const nl = buf.indexOf(0x0a, off);
    const header = buf.slice(off, nl).toString('utf8');
    const [gotSha, type, sizeStr] = header.split(' ');
    if (gotSha !== sha || type !== 'blob') {
      throw new Error(`git cat-file --batch: expected "${sha} blob <size>", got "${header}"`);
    }
    const size = Number(sizeStr);
    out.set(sha, buf.slice(nl + 1, nl + 1 + size).toString('latin1'));
    off = nl + 1 + size + 1;                               // content + its trailing LF
  }
  return out;
}

/**
 * The CURRENT `claude/scaffold/` on-disk content, as (project path → latin1 content) pairs.
 * An unrecognized top-level entry is REFUSED loudly rather than silently skipped or guessed into a
 * project path: whether a new scaffold file ships to the project root is a design decision
 * (universal-rules.md is exactly the counterexample — present in the scaffold, never installed),
 * and a silent guess either ships unmanifested content or manifests content that never ships.
 * @returns {[string, string][]}
 */
function workingTreeFiles() {
  const scaffold = join(REPO_ROOT, 'claude', 'scaffold');
  const KNOWN = new Map([
    ['ai-agents', 'walk'], ['CLAUDE.md', 'root'], ['AGENTS.md', 'root'],
    ['universal-rules.md', 'skip'],
  ]);
  const out = [];
  for (const entry of readdirSync(scaffold, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
    const kind = KNOWN.get(entry.name);
    if (!kind) {
      throw new Error(
        `unrecognized entry in claude/scaffold/: "${entry.name}" — this generator does not know ` +
        'whether it ships into a consuming project. Decide (does install.sh/init deliver it, and ' +
        'to which project path?), then teach BOTH halves of the walk in this file: ' +
        'workingTreeFiles()\'s KNOWN map (working tree), AND — for a root-shipped file — ' +
        'ROOT_FILES (WALK_PATHS derives from it; add ELIDED_PATHS if it carries a rules block). ' +
        'Teaching only workingTreeFiles() covers the current version but silently drops its ' +
        'HISTORICAL versions from the manifest once the file is next edited.');
    }
    if (kind === 'skip') continue;
    if (kind === 'root') {
      out.push([entry.name, readFileSync(join(scaffold, entry.name), 'latin1')]);
      continue;
    }
    const walk = (rel) => {
      for (const e of readdirSync(join(scaffold, 'ai-agents', rel), { withFileTypes: true })
        .sort((a, b) => a.name < b.name ? -1 : 1)) {
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) { walk(r); continue; }
        if (e.name === '.gitkeep') continue;
        out.push([`ai-agents/${r}`, readFileSync(join(scaffold, 'ai-agents', r), 'latin1')]);
      }
    };
    walk('');
  }
  return out;
}

// The header is STATIC (no dates, no commit shas) — determinism is what lets the repo test assert
// byte-equality, which is the entire staleness guard.
const HEADER = `\
# fkit structure manifest — every content hash fkit has ever shipped, per project path.
# Generated by bin/generate-structure-manifest.mjs — DO NOT EDIT BY HAND.
#   regenerate: npm run generate:manifest      (test/structure-manifest.test.js goes red when stale)
#
# A line "<sha256>\\t<path>" means: fkit shipped exactly this content at this project path at some
# point in its history (all three historical scaffold homes + the current working tree). At check
# time: on-disk hash matches a line for its path → the owner never touched the file (untouched /
# untouched-stale); matches nothing → owner-edited, never touch, report. This table is pure data —
# which class a path is and what may be repaired is the structure-spec's job, not this file's.
#
# The hashing contract — CONSUMERS MUST APPLY THE SAME TRANSFORMS to the on-disk file:
#   1. normalize CRLF -> LF (exactly that transform; a lone \\r is content);
#   2. for CLAUDE.md / AGENTS.md only: elide the lines strictly BETWEEN the fkit rules markers,
#      KEEPING the two marker lines themselves. A marker is recognized only when the whole line,
#      trimmed of [ \\t\\r], equals the marker string. Markers absent -> hash the whole file.
#      Malformed marker set -> refuse to classify (see the generator);
#   3. sha256, hex.
#
# Sorted by path, then hash. LF endings.
`;

/** @returns {string} the complete manifest, byte-deterministic */
export function generateManifest() {
  assertFullClone();

  const entries = new Set();                               // "hash\tpath", deduped: hash first (64 hex), key parses for any path bytes
  const addEntry = (projectPath, content, provenance) => {
    try {
      entries.add(`${hashFor(projectPath, content)}\t${projectPath}`);
    } catch (err) {
      throw new Error(`${provenance} (project path ${projectPath}): ${err.message}`);
    }
  };

  const blobs = historicalBlobs();
  const contents = readBlobs([...blobs.keys()]);
  for (const [sha, paths] of blobs) {
    for (const p of paths) addEntry(p, contents.get(sha), `historical blob ${sha}`);
  }
  for (const [p, content] of workingTreeFiles()) addEntry(p, content, 'working-tree claude/scaffold');

  const lines = [...entries]
    .map((e) => [e.slice(65), e.slice(0, 64)])             // ["path", "hash"] — key is hash\tpath
    .sort(([pa, ha], [pb, hb]) => (pa < pb ? -1 : pa > pb ? 1 : ha < hb ? -1 : 1))
    .map(([p, h]) => `${h}\t${p}`);
  return `${HEADER}${lines.join('\n')}\n`;
}

// ── CLI ──────────────────────────────────────────────────────────────────────────────────────────
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const manifest = generateManifest();
  if (process.argv.includes('--stdout')) {
    process.stdout.write(manifest);
  } else {
    writeFileSync(join(REPO_ROOT, MANIFEST_REL), manifest);
    const n = manifest.split('\n').filter((l) => l && !l.startsWith('#')).length;
    process.stderr.write(`wrote ${MANIFEST_REL} — ${n} entries\n`);
  }
}
