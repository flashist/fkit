// The structure-spec scaffold-inventory drift test — task 0243, unit 2 of the 0241 design
// (report 2026-08-06-design-post-update-structure-check.md §4 "Who maintains it"; owner ruling Q5
// verbatim "Yes (Recommended)", recorded in ADR-039 §5): the spec's prose is hand-authored, and
// THIS test is what makes it not-a-mirror — a scaffold change cannot land without the spec moving
// in the same commit, closing the documented mirror-rot failure class (the task-70 incident).
//
// SCOPE: the same FOURTH test-scope category as test/dual-home-parity.test.js and
// test/structure-manifest.test.js — an invariant over the repo's own content (here: the committed
// spec vs the committed scaffold tree) rather than over product behavior. See
// dual-home-parity.test.js:1-8 for the category's provenance; cited rather than re-argued.
//
// WHAT IT ASSERTS, against claude/structure-spec.md's pinned machine-read contract (its
// "Machine-read contract" note: two heading-anchored three-column tables, backticked
// project-relative paths, directories with a trailing '/'):
//   A — directory-set equality: inventory Table A == the directories of claude/scaffold/ai-agents/.
//   B — file-set equality: inventory Table B == the scaffold's files + {CLAUDE.md, AGENTS.md}
//       (the root pair, in scope by the owner's 2026-08-06 "In scope (Recommended)" ruling).
//       No duplicate rows.
//   C — class validity: every class is one of the six (report §4's table), AND matches the
//       mechanical path→class rules below. Deliberately stricter than pure path-drift (plan
//       decision 2, owner-approved): a future scaffold file wanting a non-default class must
//       change RULE_CLASS here in the same commit — the class column is as drift-proof as the
//       path column.
//   D — the ADR-005 routing note: every wiki-vault row, in BOTH tables, names ADR-005 — so no
//       future reader of the spec is instructed into a wiki-vault-write violation (report §6).
//   E — no `version:` field anywhere in the spec (report §4: the wholesale share refresh is the
//       staleness-proofing; a version field would be insufficient and is banned).
//   F — manifest consistency (the 0244 tie-in): every Table B row except placeholders appears in
//       claude/structure-manifest.tsv's path set (spec ⊆ manifest, one-directional — the manifest
//       also carries historical-only paths that are deliberately NOT inventory rows).
// Plus negative fixtures on the pure helpers, so the red side of every assertion stays provable
// forever without perturbing the real spec.
//
// ⚠️ NO PROVE-RED MUTATION IS ADDED FOR THIS SUITE (same reasoning as structure-manifest.test.js):
// prove-red mutates COPIES of launcher/hook files, and this suite's subjects are the committed
// spec, scaffold, and manifest — the copy-tree mechanism cannot meaningfully mutate them. Red-first
// was demonstrated by a transient perturbation of the real spec (captured in the task worklog), and
// the negative fixtures keep it provable. The suite reads the real repo only and is INDIFFERENT to
// FKIT_LAUNCHER and every other prove-red seam. Nothing here writes anywhere (harness.mjs:9's rule
// is intact — this file doesn't even create temp projects).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const SPEC = join(REPO, 'claude', 'structure-spec.md');
const SCAFFOLD_AI = join(REPO, 'claude', 'scaffold', 'ai-agents');
const MANIFEST = join(REPO, 'claude', 'structure-manifest.tsv');

// The pinned heading anchors — load-bearing halves of the spec's machine-read contract.
const HEADING_A = '## Inventory Table A — directories';
const HEADING_B = '## Inventory Table B — files';

// The six-class vocabulary, verbatim from report §4's table (carried into the spec's §"The six
// classes").
const CLASSES = new Set([
  'structural directory',
  'fkit-authored reference file',
  'owner-authored seed',
  'wiki-authored living file',
  'placeholder',
  'root context file',
]);

// ── Pure helpers (unit-tested by the negative fixtures below) ────────────────────────────────────

/**
 * Extract one inventory table from the spec. Anchored to its exact heading, which must occur
 * exactly once (a duplicate would silently shadow a later, reader-visible table); the section ends
 * at the next `## ` heading, so unrelated markdown tables elsewhere in the spec cannot leak in.
 * Row format (the contract): `| \`path\` | class | notes |` — first two `|` lines of the section
 * are the column header and separator, every later `|` line MUST be a well-formed row.
 * @param {string} specText
 * @param {string} heading
 * @returns {{path: string, cls: string, notes: string}[]}
 */
function parseInventoryTable(specText, heading) {
  const lines = specText.split('\n');
  const starts = lines.flatMap((l, i) => (l.trim() === heading ? [i] : []));
  assert.notEqual(starts.length, 0,
    `spec heading not found (machine-read contract broken): ${heading}`);
  assert.equal(starts.length, 1, `duplicate spec heading (only the first table would be checked; ` +
    `a later duplicate could drift unseen): ${heading} occurs ${starts.length} times`);
  const start = starts[0];
  const rows = [];
  let pipeLines = 0;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^## /.test(line)) break;                    // next section — table over
    if (!line.startsWith('|')) continue;             // prose around the table
    pipeLines++;
    if (pipeLines <= 2) continue;                    // column header + separator row
    const m = /^\|\s*`([^`]+)`\s*\|([^|]*)\|([^|]*)\|\s*$/.exec(line);
    assert.ok(m, `malformed inventory row under ${JSON.stringify(heading)} ` +
      `(contract: | \`path\` | class | notes |): ${JSON.stringify(line)}`);
    rows.push({ path: m[1], cls: m[2].trim(), notes: m[3].trim() });
  }
  assert.ok(rows.length > 0, `no inventory rows found under ${JSON.stringify(heading)}`);
  return rows;
}

/**
 * Compare the spec's path set against the ground-truth set, both directions, with named failures.
 * @param {Set<string>} specPaths @param {Set<string>} groundPaths @param {string} kind
 * @returns {string[]} failure messages, empty when the sets agree
 */
function setDrift(specPaths, groundPaths, kind) {
  const failures = [];
  for (const p of [...groundPaths].sort()) {
    if (!specPaths.has(p)) failures.push(`spec missing ${kind} ${p}`);
  }
  for (const p of [...specPaths].sort()) {
    if (!groundPaths.has(p)) failures.push(`spec lists ${kind} ${p} the scaffold does not ship`);
  }
  return failures;
}

/**
 * The mechanical path→class rules (assertion C). Order matters: the `.gitkeep` rule precedes the
 * wiki-vault rule, so the four wiki `.gitkeep`s are placeholders (matching the spec's Table B).
 * A future path wanting a different class changes THIS table in the same commit as the spec row.
 * @param {string} path @returns {string}
 */
function ruleClass(path) {
  if (path.endsWith('/')) return 'structural directory';
  if (path === 'CLAUDE.md' || path === 'AGENTS.md') return 'root context file';
  if (path === '.gitkeep' || path.endsWith('/.gitkeep')) return 'placeholder';
  if (path === 'ai-agents/knowledge-base/PROJECT.md') return 'owner-authored seed';
  if (path.startsWith('ai-agents/wiki-vault/')) return 'wiki-authored living file';
  return 'fkit-authored reference file';
}

/**
 * Class failures for a row set: unknown class names, and rule-table mismatches.
 * @param {{path: string, cls: string}[]} rows @returns {string[]}
 */
function classFailures(rows) {
  const failures = [];
  for (const { path, cls } of rows) {
    if (!CLASSES.has(cls)) {
      failures.push(`row ${path} has unknown class ${JSON.stringify(cls)}`);
    } else if (cls !== ruleClass(path)) {
      failures.push(`row ${path} is classed ${JSON.stringify(cls)} but the rule table says ` +
        `${JSON.stringify(ruleClass(path))}`);
    }
  }
  return failures;
}

/**
 * ADR-005 routing-note failures: every row under ai-agents/wiki-vault/ must name ADR-005.
 * @param {{path: string, notes: string}[]} rows @returns {string[]}
 */
function routingNoteFailures(rows) {
  return rows
    .filter(({ path }) => path.startsWith('ai-agents/wiki-vault/'))
    .filter(({ notes }) => !notes.includes('ADR-005'))
    .map(({ path }) => `wiki-vault row ${path} lacks the ADR-005 routing note`);
}

/**
 * Walk a real directory tree; project-relative paths, directories with a trailing '/'.
 * @param {string} absDir @param {string} rel — project-relative name of absDir, with trailing '/'
 * @returns {{files: Set<string>, dirs: Set<string>}}
 */
function walk(absDir, rel) {
  const files = new Set();
  const dirs = new Set([rel]);
  for (const entry of readdirSync(absDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const sub = walk(join(absDir, entry.name), `${rel}${entry.name}/`);
      for (const f of sub.files) files.add(f);
      for (const d of sub.dirs) dirs.add(d);
    } else {
      files.add(`${rel}${entry.name}`);              // every regular file, not just .md
    }
  }
  return { files, dirs };
}

// ── The real spec vs the real scaffold ───────────────────────────────────────────────────────────

const specText = readFileSync(SPEC, 'utf8');
const tableA = parseInventoryTable(specText, HEADING_A);
const tableB = parseInventoryTable(specText, HEADING_B);
const scaffold = walk(SCAFFOLD_AI, 'ai-agents/');
// Ground truth for Table B: the scaffold walk plus the root pair (report §8 / ruling 4).
// universal-rules.md is install-side input to the rules block, never a project path — excluded,
// matching its spec prose-mention-only status (plan decision 4) and its 0244 manifest exclusion.
const groundFiles = new Set([...scaffold.files, 'CLAUDE.md', 'AGENTS.md']);

// A ────────────────────────────────────────────────────────────────────────────────────────────────
test('A — Table A equals the scaffold directory set, both directions', () => {
  assert.deepEqual(setDrift(new Set(tableA.map((r) => r.path)), scaffold.dirs, 'directory'), [],
    'claude/structure-spec.md Table A drifted from claude/scaffold/ai-agents/ — fix the spec (or ' +
    'the scaffold) so they land in the same commit');
});

// B ────────────────────────────────────────────────────────────────────────────────────────────────
test('B — Table B equals the scaffold file set plus the root pair, both directions, no duplicates', () => {
  const paths = tableB.map((r) => r.path);
  assert.equal(new Set(paths).size, paths.length,
    `Table B contains duplicate rows: ${paths.filter((p, i) => paths.indexOf(p) !== i).join(', ')}`);
  assert.deepEqual(setDrift(new Set(paths), groundFiles, 'file'), [],
    'claude/structure-spec.md Table B drifted from the shipped file set — fix the spec (or the ' +
    'scaffold) so they land in the same commit');

  // And Table A holds no duplicates either (kept here so both tables are covered once).
  const dirPaths = tableA.map((r) => r.path);
  assert.equal(new Set(dirPaths).size, dirPaths.length, 'Table A contains duplicate rows');
});

// C ────────────────────────────────────────────────────────────────────────────────────────────────
test('C — every row carries a valid class that matches the mechanical rule table', () => {
  assert.deepEqual(classFailures([...tableA, ...tableB]), [],
    'a spec row\'s class is outside the six-class vocabulary or contradicts ruleClass() — a ' +
    'non-default class needs BOTH the spec row and the rule table changed in the same commit');
});

// D ────────────────────────────────────────────────────────────────────────────────────────────────
test('D — every wiki-vault row in both tables carries the ADR-005 routing note', () => {
  assert.deepEqual(routingNoteFailures([...tableA, ...tableB]), [],
    'a wiki-vault inventory row does not name ADR-005 — the spec must carry the routing note on ' +
    'every such row so no reader is instructed into a wiki-vault write (report §6)');
  // Non-vacuity: the scaffold ships wiki-vault paths, so the filter must have matched some rows.
  const wikiRows = [...tableA, ...tableB]
    .filter(({ path }) => path.startsWith('ai-agents/wiki-vault/'));
  assert.ok(wikiRows.length >= 6,
    `only ${wikiRows.length} wiki-vault rows found — the routing-note assertion is near-vacuous`);
});

// E ────────────────────────────────────────────────────────────────────────────────────────────────
test('E — the spec carries no version: field', () => {
  const hits = specText.split('\n')
    .map((l, i) => (/^\s*version\s*:/i.test(l) ? `line ${i + 1}: ${l}` : null))
    .filter(Boolean);
  assert.deepEqual(hits, [],
    'the spec must carry NO version field — the wholesale share refresh is the staleness-proofing ' +
    '(report §4); a version label would be insufficient (sha-keyed distribution) and misleading');
});

// F ────────────────────────────────────────────────────────────────────────────────────────────────
test('F — every non-placeholder Table B row is covered by the structure manifest', () => {
  // Local 3-line TSV parse (deliberately not sharing structure-manifest.test.js's private helper —
  // minimal diff; format violations are that suite's job, only the path column is needed here).
  const manifestPaths = new Set(readFileSync(MANIFEST, 'utf8').split('\n')
    .filter((l) => l !== '' && !l.startsWith('#'))
    .map((l) => l.split('\t')[1]));
  const misses = tableB
    .filter(({ cls }) => cls !== 'placeholder')
    .filter(({ path }) => !manifestPaths.has(path))
    .map(({ path }) => path);
  assert.deepEqual(misses, [],
    'a content-bearing spec row is missing from claude/structure-manifest.tsv — the manifest must ' +
    'cover every current content file (spec ⊆ manifest; regenerate: npm run generate:manifest)');
});

// ── Negative fixtures — the permanent red-proof for every helper ─────────────────────────────────

test('negative fixtures — each drift direction and rule violation produces its named failure', () => {
  // A missing row (ground has it, spec does not).
  assert.deepEqual(setDrift(new Set(['a/']), new Set(['a/', 'b/']), 'directory'),
    ['spec missing directory b/']);
  // An extra row (spec has it, ground does not).
  assert.deepEqual(setDrift(new Set(['a/', 'ghost/']), new Set(['a/']), 'directory'),
    ['spec lists directory ghost/ the scaffold does not ship']);
  // Both at once — both named, missing first.
  assert.deepEqual(setDrift(new Set(['ghost']), new Set(['real']), 'file'),
    ['spec missing file real', 'spec lists file ghost the scaffold does not ship']);

  // A wrong class (valid vocabulary, wrong per the rule table) — and an unknown class.
  assert.deepEqual(classFailures([{ path: 'ai-agents/README.md', cls: 'placeholder' }]),
    ['row ai-agents/README.md is classed "placeholder" but the rule table says ' +
     '"fkit-authored reference file"']);
  assert.deepEqual(classFailures([{ path: 'CLAUDE.md', cls: 'context file' }]),
    ['row CLAUDE.md has unknown class "context file"']);

  // The rule table's own load-bearing orderings.
  assert.equal(ruleClass('ai-agents/wiki-vault/wiki/tasks/.gitkeep'), 'placeholder');
  assert.equal(ruleClass('ai-agents/wiki-vault/index.md'), 'wiki-authored living file');
  assert.equal(ruleClass('ai-agents/wiki-vault/'), 'structural directory');
  assert.equal(ruleClass('ai-agents/knowledge-base/PROJECT.md'), 'owner-authored seed');

  // A wiki-vault row without the routing note; a non-wiki row never needs one.
  assert.deepEqual(routingNoteFailures([
    { path: 'ai-agents/wiki-vault/log.md', notes: 'existence-only' },
    { path: 'ai-agents/README.md', notes: '' },
  ]), ['wiki-vault row ai-agents/wiki-vault/log.md lacks the ADR-005 routing note']);

  // Parser: heading-anchored — an unrelated table outside the pinned headings cannot leak in.
  const synthetic = [
    '## Some other section', '', '| Path | Class | Notes |', '|---|---|---|',
    '| `not/in/inventory` | placeholder | decoy |', '',
    HEADING_A, 'prose before the table.', '',
    '| Path | Class | Notes |', '|---|---|---|',
    '| `ai-agents/` | structural directory | root |', '',
    '## Next section', '| `also/not/inventory` | placeholder | decoy |',
  ].join('\n');
  assert.deepEqual(parseInventoryTable(synthetic, HEADING_A),
    [{ path: 'ai-agents/', cls: 'structural directory', notes: 'root' }]);

  // Parser: a malformed row (path not backticked) refuses loudly instead of being skipped.
  const malformed = [HEADING_A, '| Path | Class | Notes |', '|---|---|---|',
    '| ai-agents/ | structural directory | no backticks |'].join('\n');
  assert.throws(() => parseInventoryTable(malformed, HEADING_A), /malformed inventory row/);

  // Parser: a missing heading refuses loudly (the contract's anchor is load-bearing).
  assert.throws(() => parseInventoryTable('# nothing here\n', HEADING_A), /heading not found/);

  // Parser: a duplicated pinned heading refuses loudly instead of silently validating only the
  // first table (the later, reader-visible duplicate could otherwise drift unchecked).
  const duplicated = [
    HEADING_A, '| Path | Class | Notes |', '|---|---|---|',
    '| `ai-agents/` | structural directory | root |', '',
    HEADING_A, '| Path | Class | Notes |', '|---|---|---|',
    '| `decoy/` | structural directory | shadowed |',
  ].join('\n');
  assert.throws(() => parseInventoryTable(duplicated, HEADING_A), /duplicate spec heading/);
});
