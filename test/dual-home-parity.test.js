// The dual-home parity guard — task 0133, ADR-027 §Decision 2's mechanical half.
//
// SCOPE: the same FOURTH test-scope category as test/task-id-uniqueness.test.js and
// test/adr-number-uniqueness.test.js — an invariant over the repo's own `ai-agents/` CONTENT rather
// than over product behavior. ADR-014 §2 fenced the scope at two things; ADR-017 rule 4 widened it to
// a third (a shipped skill executable's stdout contract); task-id-uniqueness.test.js:3-11 records the
// fourth. This suite is a third instance of the fourth, not a fifth category, so the widening is cited
// rather than re-argued.
//
// WHAT IT ASSERTS. `ai-agents/` (fkit's own working tree) and `claude/scaffold/ai-agents/` (the
// template a consuming project receives at init) hold some of the same documents.
// `knowledge-base/conventions/dual-home-parity.md` requires an fkit-authored file living in both homes
// to be byte-identical in both. This test walks BOTH trees, subtracts
// `test/dual-home-parity-exceptions.mjs` (task 0132's authoritative exception list), and asserts what
// is left is present in both homes and byte-identical.
//
// ⚠️ READ THIS BEFORE READING ADR-027 — THE ADR IS STALE ON THIS POINT (owner ruling, 2026-08-01).
// ADR-027 §Decision 2 still mandates byte-aligning every dual-homed file on disk. The owner OVERRULED
// that during task 0132 and chose "Option B": a third kind of file is recognized — **audience-adapted**
// — deliberately rewritten in the scaffold for a consuming reader, and byte-aligning those would ship
// fkit's own incident narratives, task/ADR provenance, and unresolvable relative links into every
// consuming project. Six such files are excepted by name in the exceptions module. **Task 0186 will
// amend ADR-027 to record the ruling.** Until it does, this test implements the RULING, not the ADR's
// current text. A future reader who diffs this file against ADR-027 and concludes the test is wrong
// has read the stale document; read the exceptions module's header, which carries the same ruling.
//
// WHY A NAIVE LOOP WOULD NOT HAVE CAUGHT THE BUG THIS EXISTS FOR. `conventions/dependency-declaration-form.md`
// was missing from the scaffold for weeks. A "for each scaffold file, compare to live" loop sees
// nothing — the file is not in the scaffold to iterate over. So the walk is over the UNION of both
// homes, and absence from EITHER side is a failure. (Brief step 2; the convention's own §"Do NOT filter
// the `Only in ai-agents` lines away".)
//
// THE ENFORCED SET IS DERIVED, NEVER HARD-CODED. It is whatever the union walk leaves after the
// exception list is subtracted — four files as of 2026-08-01. Hard-coding the list would mean a NEW
// dual-homed file is unguarded until somebody remembers to add it here, which is the same
// remember-to-do-it failure the whole test exists to replace. The non-vacuity assertion below is what
// keeps a derived-to-empty set from passing trivially.
//
// ── TWO WALK RULES, BOTH LOAD-BEARING ───────────────────────────────────────────────────────────
//
// 1. PRUNE, DO NOT DESCEND. When the walk reaches a DIRECTORY whose home-relative path already has a
//    covering exception, it stops there and does not recurse. That is what a directory entry MEANS in
//    the exceptions module ("it and everything under it is outside the dual-homed surface entirely"),
//    and it matches the `diff -rq` semantics the module documents for a human consumer — `Only in
//    ai-agents: .fkit` is one line, not one per file beneath it. Descending and then excusing each
//    file individually would give the same verdict far more slowly, and would make the tripwire below
//    impossible to state.
//
// 2. THE TRIPWIRE ON PRUNE POINTS. Pruning is a blanket, and 0132 handed this task the hole it opens:
//    a genuinely dual-homed file added under a pruned directory later would be SILENTLY EXEMPT from
//    byte-parity instead of enforced by it. So: no prune point may cover a non-`.gitkeep` file that is
//    present in BOTH homes. Such a file is dual-homed by construction and belongs on the enforced set.
//
//    ⚠️ THE CHECK IS ON PRUNE POINTS, NOT ON "DIRECTORY EXCEPTIONS" (owner-approved generalization,
//    2026-08-01). 0132's hand-off note says "directory exception", meaning an entry whose `path` ends
//    in `/`. That wording is too narrow for the tree as it actually is: `wiki-vault/.fkit` is an EXACT
//    entry (no trailing slash) that names a DIRECTORY on disk, so the walk stops there and a co-present
//    file under it would escape by the identical mechanism. Keying on "the walk stopped here and the
//    thing is a directory" costs nothing at this shape and closes both spellings.
//
//    ⚠️ `tasks/backlog/.fkit` IS NOT A SECOND INSTANCE, and an earlier draft of this comment wrongly
//    offered it as one (round-2 review R9). It is an exact entry naming a directory, but the walk never
//    reaches it: the covering `tasks/backlog/` blanket prunes one level above. Measured 2026-08-02, the
//    live prune points are `.fkit · knowledge-base/{decisions,history,incidents,reports} · sprints ·
//    tasks/{backlog,cancelled,done} · wiki-vault/.fkit · wiki-vault/wiki` — `wiki-vault/.fkit` is the
//    ONLY exact-entry prune point. In this file `tasks/backlog/.fkit` plays the OPPOSITE role: the
//    entry strictly BENEATH a prune point that EXCUSES a hit, which the test below pins exactly.
//
//    `.gitkeep` is carved out rather than banning co-presence outright because 9 `.gitkeep` files sit
//    in both homes under these prune points today — they are structural placeholders, not content.
//
//    ⚠️ AN OWN EXCEPTION UNDER THE PRUNE POINT SILENCES THE TRIPWIRE, AND THE TRIPWIRE PUTS EVERYTHING
//    ELSE ON THE ENFORCED SET (round-1 review R1, owner-approved 2026-08-01). Both halves fix a message
//    that promised what the code did not do. The message said "give it its own exception entry (with a
//    reason)" while the tripwire never consulted the exception list at all — proven with a REAL entry:
//    `tasks/backlog/.fkit` has its own exact `runtime-state` exception and still fired, co-present under
//    the `tasks/backlog/` prune point. So: a hit is excused when the exception list CONTAINS an entry
//    STRICTLY BENEATH the prune point (an exact path, or a nested directory path ending in `/`) — an
//    entry AT or ABOVE the prune point is the blanket itself and excuses nothing. Descendants of an
//    exact entry naming a directory are still tripwired, exactly as `wiki-vault/.fkit`'s test below
//    pins; only the named path itself is excused.
//
//    ⚠️ "THE LIST CONTAINS", NOT "`findException` RESOLVES TO" (round-2 review R10). `excusedBeneath`
//    scans `exceptions` itself and deliberately does NOT call `findException` — the function's own
//    docstring says so below, and this sentence used to contradict it. `findException` returns ONE
//    winner, and its most-specific-wins rule is guaranteed for exact-beats-directory only: between two
//    DIRECTORY entries it returns whichever the array lists FIRST, so a nested directory entry could
//    lose to the blanket above it and the second remedy would silently depend on array order. That
//    reasoning is the load-bearing part: do NOT "simplify" this back into a `findException` call.
//    (Latent, not live — no directory entry is nested inside another today.)
//    And the other half: 0132's hand-off says such a file "belongs on the enforced set", but nothing
//    could put it there — physically relocating the file was the only remedy that worked. Now the
//    tripwire's own hits are ADDED to the enforced set, so the blanket stops exempting them the moment
//    they are found, and the tripwire's job narrows to demanding an explicit decision. Cost: one
//    condition can red two assertions (the tripwire, and byte-parity if the two copies also differ).
//    That is the intended reading of both, not double-reporting of one. Live effect today: NONE — the
//    co-present class under a prune point is empty, measured 2026-08-01.
//
// ── THE SEAM ────────────────────────────────────────────────────────────────────────────────────
// FKIT_PARITY_SCAFFOLD_ROOT redirects the SCAFFOLD home only, so test/prove-red.sh can point this
// suite at a deliberately-broken copy of `claude/scaffold/ai-agents/` without touching the real tree.
// One seam, scaffold-side, is enough for all four mutations: a file can be deleted from the mutant
// scaffold (missing-from-scaffold), added to it (missing-from-live), altered in it (byte drift), or
// copied into it under a prune point (tripwire). A live-side seam would buy nothing and would let a
// stale env var silently redirect the repo's own tree.
// ⚠️ A non-default root is announced on stderr, exactly as harness.mjs does for FKIT_LAUNCHER: a STALE
// inherited value would otherwise make `npm test` report green about some other directory.
//
// THIS TEST READS THE REPO, read-only. Every fixture lives under os.tmpdir(); harness.mjs:9's standing
// rule ("nothing here writes into the repo") is intact.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, basename } from 'node:path';
import { REPO, cleanup } from './harness.mjs';
import { exceptions, findException } from './dual-home-parity-exceptions.mjs';

const LIVE_HOME = join(REPO, 'ai-agents');
const DEFAULT_SCAFFOLD_HOME = join(REPO, 'claude', 'scaffold', 'ai-agents');
const SCAFFOLD_HOME = process.env.FKIT_PARITY_SCAFFOLD_ROOT || DEFAULT_SCAFFOLD_HOME;
if (SCAFFOLD_HOME !== DEFAULT_SCAFFOLD_HOME) {
  process.stderr.write(
    `[dual-home-parity] ⚠ testing NON-default scaffold home via FKIT_PARITY_SCAFFOLD_ROOT: ${SCAFFOLD_HOME}\n`);
}

// The convention every failure message points at. A parity failure is actionable only if the reader
// knows which of the two copies is meant to be authoritative, and that is a judgement the document
// makes, not this test.
const CONVENTION = 'ai-agents/knowledge-base/conventions/dual-home-parity.md';
const FOOTER =
  `\n  → the rule: ${CONVENTION}\n` +
  `  → the exception list (authoritative): test/dual-home-parity-exceptions.mjs\n` +
  '  → fix by editing BOTH copies in the same change, or by adding an entry WITH A REASON to the list.';

// The floor on an exception's `reason`. An exception with a reason like "n/a" is an unfalsifiable
// permanent hole — the exact failure the 0132 brief was written to prevent — and a bare
// non-emptiness check does not stop it.
//
// ⚠️ THE FLOOR IS CALIBRATED, NOT GUESSED. Measured 2026-08-01 over all 26 live entries: the SHORTEST
// real reason is 84 characters (`wiki-vault/.fkit`), the longest 732. A 30-character floor therefore
// clears today's shortest real entry by ~2.8×, so it cannot fire on honest prose while still refusing
// the one-word placeholder. (An earlier draft of this comment cited "≈100 chars"; the measurement is
// 84 — corrected here rather than left as a flattering round number.)
const REASON_FLOOR = 30;

// ── The pure functions under test ────────────────────────────────────────────────────────────────

/**
 * Walk one home, applying the exception list as it goes.
 * Returns the home-relative POSIX paths that remain ENFORCED, plus every DIRECTORY the walk stopped
 * at (the prune points the tripwire checks). A missing root yields empty sets rather than throwing:
 * "the scaffold home does not exist" is reported by the non-vacuity assertion as a clear failure, not
 * as a stack trace from readdirSync.
 * @param {string} root
 * @returns {{ files: Set<string>, prunePoints: Set<string> }}
 */
export function walkHome(root) {
  const files = new Set();
  const prunePoints = new Set();
  const descend = (rel) => {
    let entries;
    try {
      entries = readdirSync(rel ? join(root, rel) : root, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = rel ? `${rel}/${e.name}` : e.name;
      if (findException(p)) {
        // RULE 1: prune. A directory entry means "outside the surface entirely" — do not descend.
        if (e.isDirectory()) prunePoints.add(p);
        continue;
      }
      if (e.isDirectory()) descend(p);
      else files.add(p);
    }
  };
  descend('');
  return { files, prunePoints };
}

/**
 * Every file under `rel` in `root`, home-relative, with NO exceptions applied. Used only by the
 * tripwire, which must see what a prune point is actually hiding.
 * @param {string} root
 * @param {string} rel
 * @returns {Set<string>}
 */
function collectAll(root, rel) {
  const out = new Set();
  const descend = (r) => {
    let entries;
    try {
      entries = readdirSync(join(root, r), { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = `${r}/${e.name}`;
      if (e.isDirectory()) descend(p);
      else out.add(p);
    }
  };
  descend(rel);
  return out;
}

/**
 * Does `p` carry an exception of its OWN, beneath the prune point that already covers it?
 *
 * An entry STRICTLY BENEATH the prune point is a deliberate, reasoned statement about this path
 * (`tasks/backlog/.fkit` under `tasks/backlog/`); an entry at or above it is the blanket itself, which
 * is what the tripwire exists to distrust. Without this, the tripwire's own advice — "give it its own
 * exception entry" — did nothing, because it never consulted the list.
 *
 * ⚠️ IT SCANS THE LIST RATHER THAN CALLING `findException`, on purpose. The prune point covers `p`
 * too, so `findException` is never undefined here — the question is not "is there an exception" but
 * "is there one BENEATH this prune point", and `findException` answers only with its own winner. Its
 * MOST-SPECIFIC-WINS rule is guaranteed for exact-beats-directory only; between two DIRECTORY entries
 * it returns whichever the array lists first, so a nested directory entry could lose to the blanket
 * above it and the tripwire's second remedy would silently depend on array order. (Latent, not live:
 * no directory entry is nested inside another today.) Paths come from `collectAll`, which builds them
 * by joining real directory entries, so there is nothing to normalize.
 * @param {string} prunePoint home-relative path of the directory the walk stopped at
 * @param {string} p home-relative path of a file underneath it
 * @returns {boolean}
 */
export function excusedBeneath(prunePoint, p) {
  const under = `${prunePoint}/`;
  return exceptions.some((e) => {
    // Compare the entry WITHOUT its trailing slash, or the prune point's own entry
    // (`knowledge-base/reports/`) reads as "beneath itself" and excuses everything it covers — which
    // would disarm the tripwire completely. Caught by the two fixtures below going empty.
    const entry = e.path.endsWith('/') ? e.path.slice(0, -1) : e.path;
    if (!entry.startsWith(under)) return false;
    if (!e.path.endsWith('/')) return p === entry;
    return p === entry || p.startsWith(e.path);
  });
}

/**
 * Sanity-check the exception list itself. Returns one complaint string per problem, so a list with
 * three bad entries reports all three rather than one per run.
 * @param {import('./dual-home-parity-exceptions.mjs').ParityException[]} list
 * @returns {string[]}
 */
export function checkExceptionList(list) {
  const complaints = [];
  const seen = new Map();
  list.forEach((e, i) => {
    const where = `exceptions[${i}] (${e && e.path ? e.path : 'no path'})`;
    if (!e || typeof e.path !== 'string' || e.path.trim() === '') {
      complaints.push(`${where}: has no \`path\``);
      return;
    }
    if (seen.has(e.path)) {
      complaints.push(`${where}: duplicate \`path\` — also at exceptions[${seen.get(e.path)}]. ` +
        'Two entries for one path means one of them is dead and its reason is never read.');
    }
    seen.set(e.path, i);
    // `kind` is checked for non-emptiness ONLY, deliberately NOT against a fixed vocabulary. The
    // module's header already enumerates the kinds; restating that list here would make this file a
    // SECOND source of truth for it, and adding a legitimate new kind would then red the suite for no
    // defect. The reason is the load-bearing field, and it is checked properly below.
    if (typeof e.kind !== 'string' || e.kind.trim() === '') {
      complaints.push(`${where}: has no \`kind\``);
    }
    const reason = typeof e.reason === 'string' ? e.reason.trim() : '';
    if (reason === '') {
      complaints.push(`${where}: has no \`reason\` — an exception with no stated reason is an ` +
        'unfalsifiable permanent hole in this test.');
    } else if (reason.length < REASON_FLOOR) {
      complaints.push(
        `${where}: \`reason\` is ${reason.length} characters (floor ${REASON_FLOOR}) — ` +
        'a reason must say WHY this path is exempt, not merely be non-empty. ' +
        `(Measured 2026-08-01: the shortest real reason in this list is 84 characters, so the floor ` +
        'has ~2.8× headroom and cannot fire on honest prose.)');
    }
  });
  return complaints;
}

/**
 * Compare the two homes. Accumulates FAILURES BY CLASS rather than throwing on the first hit — a
 * reconciliation that has drifted in four places should report four paths, not force four runs.
 * @param {string} liveRoot
 * @param {string} scaffoldRoot
 */
export function compareHomes(liveRoot, scaffoldRoot) {
  const live = walkHome(liveRoot);
  const scaffold = walkHome(scaffoldRoot);

  // RULE 2: the tripwire, over the prune points of BOTH homes (a prune point can exist on one side
  // only — `.fkit/` is live-only — and the file it hides still has to be co-present to count).
  // Runs BEFORE the comparison because its hits JOIN the enforced set — see header rule 2.
  const prunePoints = [...new Set([...live.prunePoints, ...scaffold.prunePoints])].sort();
  const hidden = [];
  for (const dir of prunePoints) {
    const inLive = collectAll(liveRoot, dir);
    const inScaffold = collectAll(scaffoldRoot, dir);
    for (const p of [...inLive].sort()) {
      if (!inScaffold.has(p)) continue;
      if (basename(p) === '.gitkeep') continue;
      if (excusedBeneath(dir, p)) continue;
      hidden.push({ prunePoint: dir, path: p });
    }
  }

  // A tripwire hit JOINS the enforced set. ⚠️ It must also count as PRESENT in both homes: the walk
  // sets do not contain it (that is the whole point — it was pruned away), so testing membership in
  // them alone reports a file sitting in BOTH homes as "MISSING from ai-agents/". Caught by running
  // mutation 13 against this change, not by reading it. Co-presence is not an assumption here — it is
  // the condition `hidden` is built on, checked against the two homes on disk just above.
  const promoted = new Set(hidden.map((h) => h.path));
  const enforced = [...new Set([...live.files, ...scaffold.files, ...promoted])].sort();

  const onlyInLive = [];
  const onlyInScaffold = [];
  const differing = [];
  const unreadable = [];

  for (const p of enforced) {
    const inLive = live.files.has(p) || promoted.has(p);
    const inScaffold = scaffold.files.has(p) || promoted.has(p);
    if (!inScaffold) { onlyInLive.push(p); continue; }
    if (!inLive) { onlyInScaffold.push(p); continue; }
    let a, b;
    try {
      a = readFileSync(join(liveRoot, p));
      b = readFileSync(join(scaffoldRoot, p));
    } catch (err) {
      unreadable.push({ path: p, message: String(err && err.message ? err.message : err) });
      continue;
    }
    if (!a.equals(b)) differing.push({ path: p, live: a, scaffold: b });
  }

  return { enforced, onlyInLive, onlyInScaffold, differing, unreadable, prunePoints, hidden };
}

// ── Failure-message rendering ────────────────────────────────────────────────────────────────────
// Brief step 4: "a parity failure with a bare `assert.equal` diff of two long markdown files is a test
// people learn to skip." These render the same facts a person would reach for — which path, which
// home, and WHERE in the file — instead of two 4KB blobs.

const CLIP = 72;   // characters of context shown either side of the differing column

/** Render one line for display: collapse control characters, clip around `col`, mark the clip. */
function clipLine(text, col) {
  const flat = text.replace(/\t/g, '→   ').replace(/\r/g, '␍');
  if (flat.length <= CLIP * 2) return flat;
  const from = Math.max(0, col - CLIP);
  const to = Math.min(flat.length, col + CLIP);
  return (from > 0 ? '…' : '') + flat.slice(from, to) + (to < flat.length ? '…' : '');
}

/**
 * Where two buffers first differ, as 1-based line/column in the LIVE copy, plus both lines.
 * @param {Buffer} a live
 * @param {Buffer} b scaffold
 */
export function firstDifference(a, b) {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  // Count lines over the COMMON prefix, so the location is meaningful even when one file is a
  // truncation of the other (i === max, no differing byte exists — the difference is the length).
  const prefix = a.subarray(0, i).toString('utf8');
  const line = prefix.split('\n').length;
  const column = prefix.length - (prefix.lastIndexOf('\n') + 1) + 1;
  const lineOf = (buf) => (buf.toString('utf8').split('\n')[line - 1] ?? '');
  return {
    line,
    column,
    truncated: i === max && a.length !== b.length,
    liveLine: lineOf(a),
    scaffoldLine: lineOf(b),
  };
}

/** The human-readable report for one byte-drifted file. */
export function describeDrift({ path, live, scaffold }) {
  const d = firstDifference(live, scaffold);
  const head = d.truncated
    ? `  the copies agree for their first ${Math.min(live.length, scaffold.length)} bytes; ` +
      `one is a TRUNCATION of the other (ends at line ${d.line}, column ${d.column})`
    : `  first difference at line ${d.line}, column ${d.column}`;
  return [
    `${path} — the two copies DIFFER.`,
    head,
    `    live     : ${clipLine(d.liveLine, d.column)}`,
    `    scaffold : ${clipLine(d.scaffoldLine, d.column)}`,
    `  sizes: live ${live.length} bytes, scaffold ${scaffold.length} bytes`,
  ].join('\n');
}

/**
 * The human-readable report for a file present in one home only.
 * ⚠️ THE TWO DIRECTIONS GET DIFFERENT SECOND LINES, and that is not decoration. A first draft printed
 * "this is the shape that hid `dependency-declaration-form.md` for weeks" for BOTH, which is simply
 * false of the scaffold-only direction — that bug was a live file missing from the scaffold. Caught by
 * reading the rendered message rather than the assertion. A failure message that misstates the failure
 * sends the reader to the wrong fix.
 */
function describeMissing(path, presentIn) {
  return presentIn === 'live'
    ? `${path} — present in ai-agents/, MISSING from claude/scaffold/ai-agents/\n` +
      '  An fkit-authored file was added or kept live but never shipped to the scaffold, so every ' +
      'project\n  set up from now on gets the tree without it. This is the exact shape that hid\n' +
      '  `dependency-declaration-form.md` for weeks.'
    : `${path} — present in claude/scaffold/ai-agents/, MISSING from ai-agents/\n` +
      '  The scaffold ships a file fkit\'s own tree does not have, so nobody here maintains it and no ' +
      'test\n  covers it. Either add the live copy, or record it as an exception WITH A REASON.';
}

// ── Live-corpus tests ────────────────────────────────────────────────────────────────────────────

const RESULT = compareHomes(LIVE_HOME, SCAFFOLD_HOME);

// 1 ────────────────────────────────────────────────────────────────────────────────────────────────
test('exception list: every entry states a path, a kind, and a reason that says WHY', () => {
  assert.ok(exceptions.length > 0, 'the exception list is empty — the module did not load');
  // ⚠️ `assert.ok`, NOT `assert.deepEqual`, for every rendered-message assertion in this file.
  // deepEqual appends its own actual/expected dump, which re-prints the same prose a second time with
  // the newlines escaped, and a third time in the `actual:` field. At one bad entry that is noise; at
  // four it is the unreadable blob brief step 4 exists to prevent. The message below is already the
  // complete report, so the diff adds nothing but volume. (Verified by hand on all four break cases.)
  const complaints = checkExceptionList(exceptions);
  assert.ok(complaints.length === 0,
    `the exception list has ${complaints.length} bad entr${complaints.length === 1 ? 'y' : 'ies'}:\n` +
    complaints.map((c) => `  • ${c}`).join('\n') + FOOTER);

  // Non-vacuity: the floor must be exercised by the real list, not merely defined. If every reason
  // were 5 characters this test would still pass the loop above only because the loop is right — this
  // asserts the corpus it ran over is real prose.
  const shortest = Math.min(...exceptions.map((e) => e.reason.trim().length));
  assert.ok(shortest >= REASON_FLOOR,
    `the shortest live reason is ${shortest} characters, below the ${REASON_FLOOR} floor`);

  // And the synthetic half: a placeholder reason must actually be refused.
  const bad = checkExceptionList([{ path: 'x.md', kind: 'index', reason: 'n/a' }]);
  assert.equal(bad.length, 1);
  assert.match(bad[0], /must say WHY this path is exempt, not merely be non-empty/);
  assert.deepEqual(checkExceptionList([{ path: 'x.md', kind: '', reason: 'a'.repeat(REASON_FLOOR) }]),
    ['exceptions[0] (x.md): has no `kind`']);
});

// 2 ────────────────────────────────────────────────────────────────────────────────────────────────
test('live corpus: the enforced dual-homed set is non-empty and every file is present in BOTH homes', () => {
  // ⚠️ NON-VACUITY IS LOAD-BEARING. Every other assertion here is a loop over the enforced set; an
  // empty set passes all of them silently. If a directory is renamed, or an over-broad exception
  // swallows the surface, this must go RED rather than quietly green.
  assert.ok(RESULT.enforced.length > 0,
    'the enforced dual-homed set is EMPTY — the walk found nothing to check, so every other ' +
    'assertion in this file is vacuous. Either a home moved, or an exception entry is too broad.' +
    `\n  live home    : ${LIVE_HOME}\n  scaffold home: ${SCAFFOLD_HOME}` + FOOTER);

  const problems = [
    ...RESULT.onlyInLive.map((p) => describeMissing(p, 'live')),
    ...RESULT.onlyInScaffold.map((p) => describeMissing(p, 'scaffold')),
  ];
  assert.ok(problems.length === 0,
    `${problems.length} dual-homed file(s) exist in one home only:\n\n` +
    problems.join('\n\n') + FOOTER);
});

// 3 ────────────────────────────────────────────────────────────────────────────────────────────────
test('live corpus: every enforced dual-homed file is byte-identical', () => {
  assert.ok(RESULT.unreadable.length === 0,
    'some enforced path could not be read as a file:\n' +
    RESULT.unreadable.map((u) => `  • ${u.path}: ${u.message}`).join('\n') + FOOTER);

  const reports = RESULT.differing.map(describeDrift);
  assert.ok(reports.length === 0,
    `${reports.length} dual-homed file(s) have drifted:\n\n` + reports.join('\n\n') + FOOTER);
});

// 4 ────────────────────────────────────────────────────────────────────────────────────────────────
// 0132's hand-off, generalized from "directory exception" to "prune point" (see header rule 2).
test('live corpus: no prune point hides a file that is dual-homed in fact', () => {
  assert.ok(RESULT.prunePoints.length > 0,
    'the walk pruned nothing — the directory exceptions are not being applied, so this tripwire is ' +
    'vacuous' + FOOTER);

  // ⚠️ EVERY REMEDY BELOW IS ONE THE CODE ACTUALLY HONORS (round-1 review R1). The first draft told
  // the reader to add an exception entry while the tripwire never consulted the exception list, so
  // following the advice changed nothing. A failure message that prescribes an unavailable remedy is
  // worse than none: it sends the reader to do work that leaves the suite exactly as red.
  const hits = RESULT.hidden.map(({ prunePoint, path }) =>
    `${path} — present in BOTH homes, under the prune point \`${prunePoint}\`.\n` +
    '  A file that exists in both homes is dual-homed BY CONSTRUCTION, so this suite has already PUT ' +
    'IT ON the enforced set: the blanket no longer exempts it, and the two copies were compared above.' +
    '\n  Now say which it is, explicitly:\n' +
    `    • it IS dual-homed → move it out from under \`${prunePoint}\`, so the walk reaches it ` +
    'directly instead of the tripwire having to promote it; or\n' +
    '    • it is NOT → give it its own exception entry WITH A REASON, at a path strictly BENEATH the ' +
    `prune point (an exact path, or a directory path ending in \`/\`). An entry at \`${prunePoint}\` ` +
    'itself or above it is the blanket, and will not silence this.');
  assert.ok(hits.length === 0,
    `${hits.length} file(s) sit under a blanket that was never meant to cover them:\n\n` +
    hits.join('\n\n') + FOOTER);
});

// ── Synthetic tests — the mechanism, on fixtures, in both directions ─────────────────────────────
// The live-corpus tests above can only ever prove the tree is currently clean. These prove the walk
// would NOTICE if it were not, without waiting for the repo to break.

const MADE = [];
after(() => MADE.forEach(cleanup));

/** A pair of throwaway homes. `files` maps home-relative path → [liveContent|null, scaffoldContent|null]. */
function fixtureHomes(files) {
  const base = mkdtempSync(join(tmpdir(), 'fkit-parity-'));
  MADE.push(base);
  const liveRoot = join(base, 'live');
  const scaffoldRoot = join(base, 'scaffold');
  for (const [path, [liveContent, scaffoldContent]] of Object.entries(files)) {
    for (const [root, content] of [[liveRoot, liveContent], [scaffoldRoot, scaffoldContent]]) {
      if (content === null) continue;
      const abs = join(root, path);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, content);
    }
  }
  mkdirSync(liveRoot, { recursive: true });
  mkdirSync(scaffoldRoot, { recursive: true });
  return { liveRoot, scaffoldRoot };
}

// 5 ────────────────────────────────────────────────────────────────────────────────────────────────
test('synthetic: a file present in one home only fails, in BOTH directions', () => {
  // `knowledge-base/conventions/` carries no exception, so anything under it is enforced.
  const { liveRoot, scaffoldRoot } = fixtureHomes({
    'knowledge-base/conventions/kept.md': ['same\n', 'same\n'],
    'knowledge-base/conventions/live-only.md': ['only here\n', null],
    'knowledge-base/conventions/scaffold-only.md': [null, 'only there\n'],
  });
  const r = compareHomes(liveRoot, scaffoldRoot);

  assert.deepEqual(r.onlyInLive, ['knowledge-base/conventions/live-only.md'],
    'the live-only direction is the one a naive "for each scaffold file" loop misses entirely — it ' +
    'is the `dependency-declaration-form.md` shape');
  assert.deepEqual(r.onlyInScaffold, ['knowledge-base/conventions/scaffold-only.md']);
  assert.deepEqual(r.differing, []);
  assert.equal(r.enforced.length, 3, 'all three are enforced; only their presence differs');

  // The message names the path AND which home it is missing from — brief step 4.
  const msg = describeMissing('knowledge-base/conventions/live-only.md', 'live');
  assert.match(msg, /MISSING from claude\/scaffold\/ai-agents\//);
  assert.match(msg, /knowledge-base\/conventions\/live-only\.md/);
});

// 6 ────────────────────────────────────────────────────────────────────────────────────────────────
test('synthetic: a one-byte difference fails with a message naming the path, line and column', () => {
  const { liveRoot, scaffoldRoot } = fixtureHomes({
    'wiki-vault/schema.md': [
      'line one\nline two is quite long here\nline three\n',
      'line one\nline two is quite Long here\nline three\n',
    ],
  });
  const r = compareHomes(liveRoot, scaffoldRoot);
  assert.equal(r.differing.length, 1);

  const msg = describeDrift(r.differing[0]);
  assert.match(msg, /^wiki-vault\/schema\.md — the two copies DIFFER\./);
  assert.match(msg, /first difference at line 2, column 19/);
  assert.match(msg, /live {5}: line two is quite long here/);
  assert.match(msg, /scaffold : line two is quite Long here/);
  assert.match(msg, /sizes: live 48 bytes, scaffold 48 bytes/);

  // A pure truncation has NO differing byte — the naive "scan to the first mismatch" report would
  // point at nothing. It must still say where the shorter file stops.
  const trunc = fixtureHomes({
    'wiki-vault/schema.md': ['alpha\nbeta\ngamma\n', 'alpha\nbeta\n'],
  });
  const t = compareHomes(trunc.liveRoot, trunc.scaffoldRoot);
  const tmsg = describeDrift(t.differing[0]);
  assert.match(tmsg, /is a TRUNCATION of the other \(ends at line 3, column 1\)/);
  assert.match(tmsg, /sizes: live 17 bytes, scaffold 11 bytes/);

  // A long line is clipped around the difference rather than dumped whole — the "two 4KB blobs"
  // failure mode the brief calls out.
  const long = 'x'.repeat(400);
  const wide = fixtureHomes({
    'wiki-vault/schema.md': [`${long}A${long}\n`, `${long}B${long}\n`],
  });
  const w = compareHomes(wide.liveRoot, wide.scaffoldRoot);
  const wmsg = describeDrift(w.differing[0]);
  assert.ok(wmsg.length < 600, `a drift report must stay readable; got ${wmsg.length} characters`);
  assert.match(wmsg, /…x+Ax+…/, 'the clipped window is centred on the differing column');
});

// ── The tripwire, on fixtures ────────────────────────────────────────────────────────────────────
// Not one of the six named assertions above — this pins the CARVE-OUT, which is the part of rule 2
// most likely to be "simplified" away by someone who does not know 9 real `.gitkeep` files depend on it.
test('synthetic: a prune point hides a co-present file, but never a bare .gitkeep', () => {
  // `knowledge-base/reports/` is a real directory exception, and `reports/README.md` is 0132's named
  // near-miss: it exists live today and would land under the blanket if it were ever shipped.
  const { liveRoot, scaffoldRoot } = fixtureHomes({
    'knowledge-base/reports/.gitkeep': ['', ''],
    'knowledge-base/reports/2026-08-01-audit.md': ['live only\n', null],
    'knowledge-base/reports/README.md': ['what reports are\n', 'what reports are\n'],
  });
  const r = compareHomes(liveRoot, scaffoldRoot);
  assert.ok(r.prunePoints.includes('knowledge-base/reports'), 'the walk must have pruned there');
  assert.deepEqual(r.hidden.map((h) => h.path), ['knowledge-base/reports/README.md'],
    'the co-present README is caught; the co-present .gitkeep is carved out; the live-only audit ' +
    'is genuinely excused (it is not dual-homed)');
  // The promotion half of R1's fix: the hit does not merely get REPORTED, it joins the enforced set,
  // so its two copies are byte-compared from this run on. `.gitkeep` and the live-only audit do not.
  assert.deepEqual(r.enforced, ['knowledge-base/reports/README.md'],
    'a tripwire hit is put ON the enforced set — before this, nothing under a blanket could get there ' +
    'except by physically moving the file');
  // ⚠️ AND IT IS PRESENT IN BOTH HOMES, which is not automatic: the promoted path is in NEITHER walk
  // set (the walk pruned it), so a membership test against those alone reports a file that is sitting
  // in both trees as "MISSING from ai-agents/". A first cut of the promotion did exactly that.
  assert.deepEqual([r.onlyInLive, r.onlyInScaffold, r.differing], [[], [], []],
    'a promoted file that is co-present and identical must produce NO presence or drift report');
});

// R1's other half, pinned on the REAL entry that disproved the old message: `tasks/backlog/.fkit` has
// its own exact `runtime-state` exception AND sits under the `tasks/backlog/` blanket. Adding that
// entry is exactly what the old message told the reader to do, and it did not work.
test('synthetic: an own exception BENEATH a prune point excuses a co-present file; the blanket does not', () => {
  const { liveRoot, scaffoldRoot } = fixtureHomes({
    'tasks/backlog/.fkit': ['launcher bookkeeping\n', 'launcher bookkeeping\n'],
    'tasks/backlog/0001-a-task/brief.md': ['co-present\n', 'co-present\n'],
  });
  const r = compareHomes(liveRoot, scaffoldRoot);
  assert.ok(r.prunePoints.includes('tasks/backlog'), 'the walk must have pruned at the blanket');
  assert.deepEqual(r.hidden.map((h) => h.path), ['tasks/backlog/0001-a-task/brief.md'],
    '`tasks/backlog/.fkit` has an exact entry of its own BENEATH the prune point and is excused; the ' +
    'brief has only the blanket `tasks/backlog/` above it, which excuses nothing here');
  assert.deepEqual(r.enforced, ['tasks/backlog/0001-a-task/brief.md'],
    'the excused path stays OFF the enforced set — an exception with a reason is a real decision');

  // The message also offers a DIRECTORY entry beneath the prune point as a remedy. No directory entry
  // is nested inside another in the real list today, so the branch is exercised here against a real
  // entry (`knowledge-base/decisions/`) under a hypothetical prune point one level above it — rather
  // than left as an untested promise, which is the species of defect R1 was.
  assert.equal(excusedBeneath('knowledge-base', 'knowledge-base/decisions/adr-001-x.md'), true);
  assert.equal(excusedBeneath('knowledge-base', 'knowledge-base/decisions'), true);
  assert.equal(excusedBeneath('knowledge-base/decisions', 'knowledge-base/decisions/adr-001-x.md'),
    false, 'the entry AT the prune point is the blanket itself and excuses nothing');
  assert.equal(excusedBeneath('knowledge-base/reports', 'knowledge-base/reports/README.md'), false);
});

// The generalization owner-approved on 2026-08-01: an EXACT entry naming a directory on disk prunes
// too, and must be tripwired identically. `wiki-vault/.fkit` is exactly that shape in the real tree.
test('synthetic: an exact exception naming a DIRECTORY is a prune point, and is tripwired too', () => {
  const { liveRoot, scaffoldRoot } = fixtureHomes({
    'wiki-vault/.fkit/session-state': ['live\n', 'scaffold\n'],
  });
  const r = compareHomes(liveRoot, scaffoldRoot);
  assert.ok(r.prunePoints.includes('wiki-vault/.fkit'),
    '`wiki-vault/.fkit` has NO trailing slash in the exception list, but names a directory on disk — ' +
    'keying the tripwire on "entry ends in /" would miss it');
  assert.deepEqual(r.hidden.map((h) => h.path), ['wiki-vault/.fkit/session-state']);

  // ⚠️ AND THIS FIXTURE IS WHAT PINS THE PROMOTION'S BYTE-COMPARISON (round-2 review R8). The tripwire
  // message tells the reader "the two copies were compared above" — before this assertion NOTHING made
  // that true: the other promotion fixture uses two IDENTICAL copies, so `differing` is `[]` whether or
  // not a promoted path is ever compared, and `if (promoted.has(p)) continue;` in `compareHomes` kept
  // all nine tests green while silently voiding the promotion's whole purpose (measured 2026-08-02).
  // That is the same species of defect R1 was — a message promising what nothing proves — so it is
  // pinned rather than promised. The two copies here genuinely DIFFER (`live\n` vs `scaffold\n`).
  assert.deepEqual(r.enforced, ['wiki-vault/.fkit/session-state'],
    'the tripwire hit joins the enforced set');
  assert.deepEqual(r.differing.map((d) => d.path), ['wiki-vault/.fkit/session-state'],
    'a PROMOTED file whose two copies differ must be REPORTED as drifted — this is the assertion that ' +
    'makes the tripwire message\'s "the two copies were compared above" a fact rather than a promise');
  assert.deepEqual([r.onlyInLive, r.onlyInScaffold], [[], []],
    'and it is co-present, so neither presence direction may fire');
  assert.match(describeDrift(r.differing[0]), /^wiki-vault\/\.fkit\/session-state — the two copies DIFFER\./);
});
