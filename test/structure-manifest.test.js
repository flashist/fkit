// The structure-manifest completeness test — task 0244, the determination layer of the 0241 design
// (report 2026-08-06-design-post-update-structure-check.md §7; mechanism recorded in ADR-015
// §Rejected alternatives — "deferred, not rejected", un-deferred by the owner via Q6 / ADR-039 §6).
//
// SCOPE: the same FOURTH test-scope category as test/dual-home-parity.test.js — an invariant over
// the repo's own content (here: git history + the committed manifest artifact) rather than over
// product behavior. See dual-home-parity.test.js:1-8 for the category's provenance; this is a
// further instance, cited rather than re-argued.
//
// WHAT IT ASSERTS. `claude/structure-manifest.tsv` — the shipped table of every content hash fkit
// has ever shipped, per project path — is exactly what `bin/generate-structure-manifest.mjs`
// produces from the repo today (assertion A). That single byte-equality is the completeness claim,
// the determinism claim, and the staleness guard in one: touch anything under `claude/scaffold/`
// without regenerating and this goes red. The enforcement point is HERE, not bin/release.mjs — the
// distribution is sha-keyed (ADR-015 Context §4), every commit is a potential release, so a
// release-boundary regenerator would leave between-release shas uncovered.
//
// The remaining tests pin the HASHING CONTRACT the manifest's consumers (0245/0246) will rely on:
//   B — multi-era coverage: a path that lived in every home carries a blob from EACH era
//       (generic, omnigent, current scaffold — each pinned by a frozen coordinate).
//   C — CRLF→LF normalization: an ending-only variant of a shipped file classifies
//       untouched-stale, NEVER owner-edited (the Windows failure class init already learned —
//       see marker_lines' comment in claude/fkit-claude-init.sh).
//   D — root-file elision: CLAUDE.md/AGENTS.md hash with the lines strictly BETWEEN the rules
//       markers elided, marker lines KEPT — so block-only drift matches (untouched), body drift
//       and deleted markers match nothing (owner-edited, report §8's rule).
//   E — marker recognition is `marker_lines`' contract (claude/fkit-claude-init.sh:374): whole-line
//       equality after trimming [ \t\r] — a marker quoted in prose is inert (init's documented
//       substring-match defect), a CRLF-terminated marker line still matches (init's CRLF defect).
//
// ⚠️ NO PROVE-RED MUTATION IS ADDED FOR THIS SUITE, deliberately: prove-red's mutations run suites
// against COPIES of launcher/hook files, and this suite's subject is the real repo's git history
// and committed artifact — the copy-tree mechanism cannot meaningfully mutate either. Red-first was
// demonstrated by build order instead (test written and run red before the generator existed; the
// red output is captured in the task worklog). This suite must therefore be INDIFFERENT to
// FKIT_LAUNCHER and every other prove-red seam: prove-red's run_suite() executes the whole real
// suite per mutation, and a seam-sensitive test here would misreport those runs.
//
// THIS TEST READS THE REPO AND ITS HISTORY, read-only. Fixtures are built IN MEMORY from real
// shipped bytes — no test/fixtures/ additions, so they cannot rot. harness.mjs:9's standing rule
// ("nothing here writes into the repo") is intact.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';
import {
  RULES_BEGIN, RULES_END, markerLines, hashFor,
} from '../bin/generate-structure-manifest.mjs';

// ── Environment guard ────────────────────────────────────────────────────────────────────────────
// The manifest is built from the FULL ancestry of HEAD. On a shallow clone the generator would see
// a truncated history and assertion A would go red about "staleness" when the actual problem is the
// clone — a misleading red that sends the reader to regenerate a manifest that is not stale. Refuse
// up front, loudly, with the actual remedy. (The generator itself carries the same guard; this one
// exists so the whole file fails with ONE clear message instead of five confusing ones.)
const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'],
  { cwd: REPO, encoding: 'utf8' }).trim();
if (shallow !== 'false') {
  throw new Error(
    'structure-manifest tests need the FULL git history and this clone is shallow.\n' +
    '  → run `git fetch --unshallow`, then re-run the suite.\n' +
    '  (A shallow walk would silently produce an incomplete manifest; refusing here is the only ' +
    'non-misleading red.)');
}

const GENERATOR = join(REPO, 'bin', 'generate-structure-manifest.mjs');
const MANIFEST = join(REPO, 'claude', 'structure-manifest.tsv');

// The generic-era coordinate for assertion B: "FKit: first commit", the oldest commit shipping
// `generic/ai-agents/`. A FROZEN historical fact — history is append-only, so pinning it cannot rot.
const GENERIC_ERA_COMMIT = 'db498514059056b8be277282a38fd0953f401e56';
// The omnigent (middle) era coordinate, used by B and D. Its README blob (2213415…) appears under
// NO other home (verified 2026-08-07), so B's pin on it is the assertion that fires if the
// `omnigent/scaffold/ai-agents` prefix is ever lost from the walk — neither the generic nor the
// current-scaffold pin can catch that.
const OMNIGENT_ERA_COMMIT = 'ebf87a6c964d1b254454cf4f231d3b82cc01854f';

/**
 * Parse the manifest: `#` lines are header, every other non-empty line is `<sha256>\t<path>`.
 * Format violations are reported here rather than surfacing as weird misses in B–D.
 * @param {string} text
 * @returns {Map<string, Set<string>>} project path → the set of shipped hashes for it
 */
function parseManifest(text) {
  const byPath = new Map();
  text.split('\n').forEach((line, i) => {
    if (line === '' || line.startsWith('#')) return;
    const m = /^([0-9a-f]{64})\t(\S.*)$/.exec(line);
    assert.ok(m, `manifest line ${i + 1} is not \`<sha256>\\t<path>\`: ${JSON.stringify(line)}`);
    if (!byPath.has(m[2])) byPath.set(m[2], new Set());
    byPath.get(m[2]).add(m[1]);
  });
  return byPath;
}

const committed = readFileSync(MANIFEST);
const manifest = parseManifest(committed.toString('utf8'));

/** A shipped file's current bytes, decoded latin1 (byte-faithful) — fixture raw material. */
const shipped = (rel) => readFileSync(join(REPO, rel), 'latin1');

// A ────────────────────────────────────────────────────────────────────────────────────────────────
test('A — the committed manifest is byte-exactly what the generator produces today', () => {
  const regenerated = execFileSync(process.execPath, [GENERATOR, '--stdout'],
    { cwd: REPO, maxBuffer: 1 << 26 });
  assert.ok(committed.equals(regenerated),
    'claude/structure-manifest.tsv is STALE — it is not what bin/generate-structure-manifest.mjs ' +
    'produces from the repo as it stands.\n' +
    '  The usual cause: something under claude/scaffold/ (or a scaffold root file) changed without ' +
    'the manifest being regenerated —\n  the manifest must ship the hash of every version fkit has ' +
    'ever shipped, INCLUDING the one this working tree is about to.\n' +
    '  → fix: npm run generate:manifest   (then commit the manifest together with the change)\n' +
    `  sizes: committed ${committed.length} bytes, regenerated ${regenerated.length} bytes`);

  // Non-vacuity for everything below: a floor, so B–D cannot pass against a near-empty table.
  // ⚠️ CALIBRATED, NOT GUESSED (the dual-home-parity REASON_FLOOR discipline): measured 2026-08-07,
  // the manifest covers 17 project paths — the 16 current scaffold files plus the historical-only
  // `ai-agents/reviews/README.md` — and history is append-only, so the count can only grow. A floor
  // of 15 cannot fire on the honest table while still refusing a walk that lost a home.
  assert.ok(manifest.size >= 15,
    `the manifest covers only ${manifest.size} project paths (17 measured 2026-08-07; the count ` +
    'can only grow) — the history walk found almost nothing, so every contract assertion below is ' +
    'near-vacuous. A home prefix has probably moved.');
});

// B ────────────────────────────────────────────────────────────────────────────────────────────────
test('B — multi-era coverage: ai-agents/README.md carries a shipped hash from every home', () => {
  const hashes = manifest.get('ai-agents/README.md');
  assert.ok(hashes, 'ai-agents/README.md is missing from the manifest entirely');
  assert.ok(hashes.size >= 2,
    `ai-agents/README.md has ${hashes.size} hash(es) — a file that shipped in every era of the ` +
    'scaffold must carry more than one (11 distinct blobs exist in history as of 2026-08-07)');

  // The generic era, by frozen coordinate — proves the walk reaches the OLDEST home, not merely
  // several versions inside the current one.
  const genericEra = execFileSync('git',
    ['show', `${GENERIC_ERA_COMMIT}:generic/ai-agents/README.md`],
    { cwd: REPO }).toString('latin1');
  assert.ok(hashes.has(hashFor('ai-agents/README.md', genericEra)),
    'the generic-era README (the first commit\'s blob) is not in the manifest — the walk is not ' +
    'reaching the `generic/ai-agents` home');

  // The omnigent (MIDDLE) era, same discipline: its README blob lived under no other home, so
  // this pin — and only this pin — goes red if the omnigent home prefix drops out of the walk.
  const omnigentEra = execFileSync('git',
    ['show', `${OMNIGENT_ERA_COMMIT}:omnigent/scaffold/ai-agents/README.md`],
    { cwd: REPO }).toString('latin1');
  assert.ok(hashes.has(hashFor('ai-agents/README.md', omnigentEra)),
    'the omnigent-era README is not in the manifest — the walk is not reaching the ' +
    '`omnigent/scaffold/ai-agents` home');

  // And the current scaffold — proves the working tree is included (a scaffold edit and its
  // regenerated manifest land in the same commit, so history alone can never cover HEAD's own ship).
  assert.ok(hashes.has(hashFor('ai-agents/README.md', shipped('claude/scaffold/ai-agents/README.md'))),
    'the CURRENT scaffold README is not in the manifest — the working-tree half of the walk is gone');
});

// C ────────────────────────────────────────────────────────────────────────────────────────────────
test('C — CRLF contract: an ending-only variant of a shipped file matches; a content edit does not', () => {
  const p = 'ai-agents/README.md';
  const asShipped = shipped('claude/scaffold/ai-agents/README.md');

  // The check-side computation is the generator's own exported hashFor — the consumer's obligation
  // ("same normalization at check time") exercised through the same code, not a re-implementation.
  const crlf = asShipped.replace(/\n/g, '\r\n');
  assert.notEqual(crlf, asShipped, 'fixture sanity: the CRLF rewrite must have changed something');
  assert.ok(manifest.get(p).has(hashFor(p, crlf)),
    'an ending-only (LF→CRLF) variant of a shipped file matched NOTHING — it would classify ' +
    'owner-edited on every autocrlf checkout. The CRLF→LF normalization is broken on one side.');

  // Negative control: a real content edit must NOT match — otherwise "untouched" means nothing.
  assert.ok(!manifest.get(p).has(hashFor(p, asShipped + 'an owner-added line\n')),
    'a content-edited variant of a shipped file still matched the manifest — the negative half of ' +
    'the classification is broken');

  // And the contract is CRLF → LF, exactly: a LONE \r is content, not a line ending.
  assert.ok(!manifest.get(p).has(hashFor(p, asShipped.replace('\n', '\r'))),
    'a lone-\\r variant matched — the normalization is treating bare \\r as a line ending, which ' +
    'the contract (report §7: CRLF→LF, exactly that transform) does not allow');
});

// D ────────────────────────────────────────────────────────────────────────────────────────────────
test('D — elision contract: block-only drift in a root file matches; body drift or deleted markers do not', () => {
  const claudeMd = shipped('claude/scaffold/CLAUDE.md');
  const hashes = manifest.get('CLAUDE.md');
  assert.ok(hashes, 'CLAUDE.md is missing from the manifest entirely');

  // Sanity: the scaffold's own bare-adjacent marker pair is valid and elides nothing.
  assert.ok(hashes.has(hashFor('CLAUDE.md', claudeMd)),
    'the CURRENT scaffold CLAUDE.md does not match its own manifest');
  assert.ok(manifest.get('AGENTS.md')?.has(hashFor('AGENTS.md', shipped('claude/scaffold/AGENTS.md'))),
    'the CURRENT scaffold AGENTS.md does not match its own manifest');

  // Block-only drift: a POPULATED rules block between the markers — what every real project has
  // after one launch (merge_rules rewrites the region every time). Elision must make it hash to the
  // shipped bare-pair form → match → untouched. This is report §8's load-bearing branch.
  const barePair = `${RULES_BEGIN}\n${RULES_END}`;
  assert.ok(claudeMd.includes(barePair), 'fixture sanity: the scaffold must ship the bare pair');
  const populated = claudeMd.replace(barePair,
    `${RULES_BEGIN}\nsynthetic fkit-managed block content\nthat merge_rules would have written\n${RULES_END}`);
  assert.notEqual(populated, claudeMd);
  assert.ok(hashes.has(hashFor('CLAUDE.md', populated)),
    'block-only drift matched NOTHING — every launched project would classify owner-edited, which ' +
    'defeats the entire root-file repair path (report §8)');

  // Negative control 1: drift in the OWNER BODY (outside the markers) must not match.
  assert.ok(!hashes.has(hashFor('CLAUDE.md', populated + 'an owner body edit\n')),
    'body drift outside the markers still matched — elision is eating more than the marker region');

  // Negative control 2: markers DELETED entirely → nothing is elided, no marker lines in the
  // hashed content → must match nothing → owner-edited (deleting the markers IS an owner edit —
  // report §8's rule, and why the marker lines are KEPT in the hash).
  const noMarkers = claudeMd.split('\n')
    .filter((l) => markerLines(`${l}\n`, RULES_BEGIN).length === 0
                && markerLines(`${l}\n`, RULES_END).length === 0)
    .join('\n');
  assert.notEqual(noMarkers, claudeMd);
  assert.ok(!hashes.has(hashFor('CLAUDE.md', noMarkers)),
    'a CLAUDE.md with the markers deleted still matched — marker deletion must classify owner-edited');

  // A MALFORMED pair makes the elision region unknowable: refuse loudly (mirrors merge_rules'
  // refusal — a wrong guess would bake a wrong hash into a shipped artifact).
  const beginOnly = claudeMd.replace(barePair, RULES_BEGIN);
  assert.throws(() => hashFor('CLAUDE.md', beginOnly), /marker/i,
    'a begin-without-end marker set must refuse, not guess');
  assert.throws(() => hashFor('CLAUDE.md', `${RULES_END}\nbody\n${RULES_BEGIN}\n`), /marker/i,
    'end-before-begin must refuse');
  assert.throws(() => hashFor('CLAUDE.md', `${barePair}\nbody\n${barePair}\n`), /marker/i,
    'two marker pairs must refuse');

  // Markers ABSENT is not malformed — the omnigent-era root files really shipped without markers
  // (verified 2026-08-07: zero `fkit:` lines at ebf87a6) — the whole file is hashed.
  const omnigentEra = execFileSync('git',
    ['show', `${OMNIGENT_ERA_COMMIT}:omnigent/scaffold/CLAUDE.md`],
    { cwd: REPO }).toString('latin1');
  assert.ok(markerLines(omnigentEra, RULES_BEGIN).length === 0, 'era fixture sanity: no markers');
  assert.ok(hashes.has(hashFor('CLAUDE.md', omnigentEra)),
    'the marker-less omnigent-era CLAUDE.md is not in the manifest — either the whole-file branch ' +
    'or the omnigent home walk is broken');
});

// E ────────────────────────────────────────────────────────────────────────────────────────────────
test('E — marker recognition carries marker_lines\' contract: whole-line equality, [ \\t\\r] trimmed', () => {
  // Init's documented substring-match defect: a marker QUOTED IN PROSE was once treated as a real
  // region boundary, silently deleting the text between two sentences. Whole-line equality makes it
  // inert — pinned here so the JS carrier of the contract cannot regress to `includes()`.
  const prose = `the begin marker is \`${RULES_BEGIN}\` and the end marker is \`${RULES_END}\`\n`;
  assert.deepEqual(markerLines(prose, RULES_BEGIN), [],
    'a marker quoted inside a prose line was recognized — that is the substring-match defect ' +
    'marker_lines exists to prevent (claude/fkit-claude-init.sh:366-372)');

  // Init's CRLF defect: without \r in the trim set, a CRLF file never matches its own markers.
  assert.deepEqual(markerLines(`intro\r\n${RULES_BEGIN}\r\nbody\r\n`, RULES_BEGIN), [2],
    'a CRLF-terminated marker line was NOT recognized — \\r must be in the trim set');

  // Leading/trailing blanks are tolerated (awk trims [ \t\r]+ at both ends).
  assert.deepEqual(markerLines(`\t ${RULES_BEGIN} \t\n`, RULES_BEGIN), [1]);

  // And equality means the WHOLE trimmed line — a marker with trailing prose is not a marker.
  assert.deepEqual(markerLines(`${RULES_BEGIN} (do not remove)\n`, RULES_BEGIN), []);
});
