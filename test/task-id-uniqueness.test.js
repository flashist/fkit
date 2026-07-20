// The task-ID uniqueness guard — ADR-029 Decision 3's named mitigation.
//
// SCOPE: this is a FOURTH test-scope category, and it is stated here rather than smuggled in.
// ADR-014 §2 fenced fkit's test scope at "exactly two things" (the argv handed to `claude`, and the
// skillOverrides map). ADR-017 rule 4 WIDENED that fence to a third: the stdout contract of a shipped
// skill executable (test/dashboard-contract.test.js:3-7 records its own widening; this header follows
// that precedent exactly). This suite is a fourth: an invariant over the repo's own `ai-agents/`
// CONTENT rather than over product behavior. It is pre-authorized — ADR-029 Decision 3 names this
// assertion by name as the sole mitigation for the race it accepts — but the widening is recorded here
// so no future reader has to infer it. (Owner ruled 2026-07-20: a header note, not an ADR amendment;
// ADR-029 already made the decision.)
//
// WHY IT EXISTS. ADR-029 Decision 3 rules the cross-branch ID allocation race is *detected, not
// prevented*: two branches each read `max=0100`, each allocate `0101`, and merge CLEANLY — different
// file names, no textual conflict, nothing for git to catch. The ADR's answer, verbatim: "Mitigation is
// **detection**: a duplicate-ID assertion in the `node --test` suite (ADR-014)." That assertion was
// never built (task 75 review finding R3, deferred to task 85). This is it.
//
// ⚠️ THE VACUOUS-SCAN FAILURE MODE IS THE ONE TO FEAR. A duplicate check over ZERO discovered briefs
// passes trivially. Task 76 migrates every brief from `<board>/<slug>.md` to
// `<board>/<NNNN>-<slug>/brief.md`; a discovery matching only today's shape would go silently green
// over an unscanned corpus the day that lands. So discovery matches BOTH eras, and the live-corpus test
// asserts the discovered count is non-zero and equals the count of `## ID` fields found.
//
// ⚠️ THIS TEST READS THE REPO — a first for this suite. harness.mjs:9 states the standing rule:
// "Nothing here writes into the repo: every project lives under os.tmpdir()." That rule is intact.
// Every fixture below lives in os.tmpdir(); the repo is opened read-only, never written.
//
// SCOPE LIMIT — one assertion, not three. Design spec §10's other two new assertions (`id-mismatch`
// drift, §3.5; malformed folder without `brief.md`, §4) assert against a structure task 76 has not yet
// created, and belong with it. Four-digit overflow (`9999`) is a recorded accepted residual (§3.1) and
// is deliberately not guarded here.
//
// THIS GUARDS ALLOCATION; IT DOES NOT PERFORM IT. The allocation procedure lives in
// claude/skills/fkit-task-brief/SKILL.md step 6. Its `10#` base-10 forcing and per-brief increment are
// deliberately NOT reimplemented here. This test answers one question: are the IDs in the tree unique?

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, symlinkSync, realpathSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { REPO, cleanup } from './harness.mjs';

const BOARDS = ['backlog', 'done', 'cancelled'];

const MADE = [];
after(() => MADE.forEach(cleanup));

// ── The pure functions under test ────────────────────────────────────────────────────────────────

// Blank out fenced code blocks, preserving line numbering, before any `## ID` parsing.
// ⚠️ REVIEW R3. Without this, a brief that *documents* the ID field inside a ``` fence shadows the
// real one: the parser takes the first match and silently returns the example's value. Reproduced —
// a fenced `## ID` / `9999` above the real field yielded "9999", which then PASSES the four-digit
// format check. That is a silent-wrong, the worst failure mode for a guard whose whole purpose is to
// not go quietly green. Task 75's ledger recorded "no brief contains a decoy `## ID` example" as a
// verified fact; this test would otherwise turn that passing observation into a load-bearing
// assumption with nothing enforcing it. Ignoring fences fixes it by construction, and — unlike
// failing on a second `## ID` — does not punish a brief for legitimately documenting the format.
// ⚠️ REVIEW R7 — a naive "toggle on any ``` or ~~~" state machine is NOT enough, and got this wrong in
// the two cases that matter most. Markdown closes a fence only with the SAME character in a run AT
// LEAST AS LONG as the opener. So a 4-backtick fence wrapping a 3-backtick example, and a `~~~` line
// inside a ``` fence, both closed the fence early and let the example's `## ID` leak out — restoring
// the exact silent-wrong this function exists to prevent (verified: both returned "9999", which passes
// the four-digit format check). The failure was worst precisely where the justification was strongest:
// a nested fence is how one writes a fenced example OF a fence, which is the documentation case that
// motivated choosing fence-awareness over "fail on >1 `## ID`" in the first place.
//
// ⚠️ REVIEW R9 — an UNTERMINATED fence is deliberately NOT stripped. Blanking everything after a stray
// opener would hide a real `## ID` below it and report a false "missing ID". An unterminated fence is
// malformed markdown; the safe reading is that it was never a fence at all.
// ⚠️ REVIEW R11 — THIRD ITERATION. The rule I had missed all three times: **a CLOSING fence may not
// carry an info string.** Only an OPENING fence may. Without that rule, markers pair off positionally
// (1st with 2nd, 3rd with 4th…), so one stray marker inverts inside/outside for the whole rest of the
// file. Verified leak: a stray unterminated ``` above the real field, then a later ```markdown example
// — the ```markdown was accepted as a *closer*, blanking the real `## ID`, and the example's `9999`
// leaked out as the answer. With the info-string rule, ```markdown is content, the stray fence runs to
// EOF unterminated (R9: not stripped), both `## ID` fields stay visible, and the complement rule in
// readId() turns it into a LOUD failure instead of a wrong ID.
//
// That interaction is the design: this parser is no longer required to be perfect, because readId()
// fails loudly whenever it leaks. Belt and braces, after three rounds of getting the belt wrong.
//
// Also enforced: a backtick opener may not contain a backtick in its info string (CommonMark), which
// otherwise made ``` `code` ``` read as a fence delimiter.
function stripFences(text) {
  const lines = text.split(/\r?\n/);
  const out = lines.slice();
  let open = null;                                // { char, len, start } of the current open fence
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^[ \t]*(`{3,}|~{3,})(.*)$/);
    if (!m) continue;
    const char = m[1][0], len = m[1].length, rest = m[2];
    if (open === null) {
      // An opening backtick fence's info string may not contain a backtick.
      if (char === '`' && rest.includes('`')) continue;
      open = { char, len, start: i };
    } else if (char === open.char && len >= open.len && rest.trim() === '') {
      for (let j = open.start; j <= i; j++) out[j] = '';
      open = null;
    }
    // else: shorter run, other fence character, or trailing content — content, not a delimiter.
  }
  return out;                                     // R9: an unterminated opener leaves content visible
}

// Every `## ID` heading outside a fence, with the value that follows it.
// ⚠️ LINE-BASED, NOT A SINGLE REGEX (review R4). One pattern using `\n+` as the separator rejects a
// whitespace-only line, and a `(\S+)$` value group rejects a value line with trailing content — both
// turn a present-but-untidy ID into a false "missing ID". Parsing line by line reports the value that
// is actually there and lets the format assertion be the thing that judges it.
function idFields(text) {
  const lines = stripFences(text);
  const found = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^##[ \t]+ID[ \t]*$/.test(lines[i])) continue;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;   // blank AND whitespace-only lines
    found.push(j < lines.length ? lines[j].trim() : null);
  }
  return found;
}

// ⚠️ THE COMPLEMENT RULE (review R14, owner-ruled 2026-07-20) — READ THIS BEFORE CHANGING readId().
//
// Returns null when no field is present, the ID when exactly one is, and THROWS when two or more
// survive fence-stripping. That last case is the important one, and it is not merely a tidiness check.
//
// The defect it closes: readId() used to return `found[0]` and discard the rest. A brief carrying two
// `## ID` fields — with no fences involved at all — reported only the first, so a genuine collision on
// the second was silently missed. That is this guard's ENTIRE PURPOSE failing quietly, and it survived
// three review rounds because every round was looking at fences.
//
// The property that makes this the right design rather than just a fix: it converts every FUTURE
// fence-parser bug from silent-wrong into loud-failure. If the fence logic ever leaks again, the leaked
// example shows up as a second visible field and this throws, instead of shadowing the real ID with a
// plausible-looking number. Three consecutive rounds produced a fence-parsing defect; after that track
// record, a design where the next bug FAILS LOUDLY is worth more than a fourth attempt at correctness.
//
// So: do not "simplify" this back to `found[0]`. The strictness is the safety mechanism, and the
// fence parser is allowed to be imperfect precisely because this backstops it.
function readId(text) {
  const found = idFields(text);
  if (found.length === 0) return null;
  if (found.length > 1) {
    throw new Error(`brief carries ${found.length} '## ID' fields outside any code fence ` +
      `(${found.map(v => JSON.stringify(v)).join(', ')}) — exactly one is required. Either the brief ` +
      'genuinely has duplicate ID fields, or a fenced example leaked past stripFences(). Both are ' +
      'corpus defects; neither may be guessed at by taking the first one.');
  }
  return found[0];
}

// Find every brief under `tasksRoot`, in BOTH corpus shapes:
//   pre-76  <board>/<slug>.md
//   post-76 <board>/<NNNN>-<slug>/brief.md
// Returns `{ id, source }` records, where `source` is the path relative to tasksRoot (stable across
// machines, and what the failure message prints). `id` is null for a brief carrying no `## ID` field.
//
// ⚠️ ONLY ENOENT IS SURVIVABLE (review R2). An earlier version caught every error and continued, so a
// board that existed but could not be READ — a permission bit, a broken mount — contributed zero
// briefs and the guard reported green over an unscanned corpus. `done/` alone holds 76 of the 101 live
// briefs. A missing board is legitimately nothing; an unreadable one is a failure and must say so.
function readdirOrEmpty(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw new Error(`cannot read board directory ${dir}: ${err.code} — the scan would be silently ` +
      'incomplete, which is the vacuous-green this guard exists to prevent', { cause: err });
  }
}

// ⚠️ STAT, DON'T TRUST THE DIRENT (review R5). `entry.isFile()` and `entry.isDirectory()` are BOTH
// false for a symlink, so a symlinked brief was skipped in silence. statSync follows the link and
// answers what it actually points at. A dangling symlink resolves to neither and is skipped — the same
// treatment any other non-brief entry gets.
//
// ⚠️ REVIEW R15 — R2's lesson applied here too, having been left unapplied at this site and at
// realpathOrNull(). A bare `catch { return 'other' }` swallows EVERY errno: a permission bit or an I/O
// error made a brief silently vanish from the scan, which is the vacuous-green this file exists to
// refuse. Only the "genuinely not there" errnos are survivable; anything else is a failure and says so.
const ABSENT = new Set(['ENOENT', 'ENOTDIR', 'ENAMETOOLONG', 'ELOOP']);

function kindOf(path) {
  try {
    const st = statSync(path);
    return st.isFile() ? 'file' : st.isDirectory() ? 'dir' : 'other';
  } catch (err) {
    if (ABSENT.has(err.code)) return 'other';     // dangling symlink, vanished mid-walk, cycle
    throw new Error(`cannot stat ${path}: ${err.code} — refusing to treat an unreadable entry as ` +
      'absent, which would silently shrink the scanned corpus', { cause: err });
  }
}

// Same rule for path resolution (R15).
function realpathOrNull(path) {
  try {
    return realpathSync(path);
  } catch (err) {
    if (ABSENT.has(err.code)) return null;
    throw new Error(`cannot resolve ${path}: ${err.code} — refusing to skip an entry that exists but ` +
      'cannot be read', { cause: err });
  }
}

function discoverBriefs(tasksRoot) {
  const records = [];
  const seenFiles = new Set();                    // R12 — real paths, shared across all three boards
  const corpusRoot = realpathOrNull(tasksRoot);   // R19 — the boundary, resolved once
  if (corpusRoot === null) return records;
  for (const board of BOARDS) {
    const boardDir = join(tasksRoot, board);
    for (const entry of readdirOrEmpty(boardDir)) {
      const kind = kindOf(join(boardDir, entry.name));
      let rel;
      if (kind === 'file' && entry.name.endsWith('.md')) {
        rel = `${board}/${entry.name}`;           // pre-76
      } else if (kind === 'dir') {
        // post-76 — a directory without a brief.md is not a brief
        if (kindOf(join(boardDir, entry.name, 'brief.md')) !== 'file') continue;
        rel = `${board}/${entry.name}/brief.md`;
      } else {
        continue;
      }
      // ⚠️ REVIEW R12 — IDENTITY IS THE REAL FILE, and both walks must agree on that. The R8 fix gave
      // countIdBearingFiles() realpath dedup but left discovery without it, so a symlinked task folder
      // was counted twice here and once there. The R1 cross-check then fired with "discoverBriefs() is
      // missing briefs" when discovery had in fact found MORE — the wrong repair, again. It also
      // manufactured a phantom duplicate ID out of one physical brief reachable by two names, which is
      // this guard crying wolf about the precise thing it exists to report.
      //
      // A symlink to a brief NOT otherwise in the corpus is still discovered (that was R5's point, and
      // it stands). A symlink to a brief already discovered is the same brief, counted once.
      // ⚠️ REVIEW R19 — THE CORPUS ENDS AT THE TREE, and both walks now say so. R5 had discovery
      // following symlinks off-tree while R16 had the cross-check refusing to leave: two rules, each
      // defensible alone, that disagreed about where the corpus ends. Owner-ruled 2026-07-20: a brief
      // reachable only through an off-tree symlink is NOT part of this repo's corpus. Git stores the
      // link, not the target, so that brief's ID was never allocated here and cannot collide here.
      // R5's actual content survives untouched: an IN-TREE symlink is still never silently skipped.
      const realBrief = realpathOrNull(join(tasksRoot, rel));
      if (realBrief === null || seenFiles.has(realBrief)) continue;
      if (realBrief !== corpusRoot && !realBrief.startsWith(corpusRoot + sep)) continue;
      seenFiles.add(realBrief);

      // readId() throws on a multi-ID brief (the complement rule). Name the file — an unattributed
      // "brief carries 2 ID fields" over a 101-brief corpus is a failure nobody can act on.
      let id;
      try {
        id = readId(readFileSync(join(tasksRoot, rel), 'utf8'));
      } catch (err) {
        throw new Error(`${rel}: ${err.message}`, { cause: err });
      }
      records.push({ id, source: rel });
    }
  }
  return records.sort((a, b) => (a.source < b.source ? -1 : a.source > b.source ? 1 : 0));
}

// R1 — THE INDEPENDENT CROSS-CHECK. The brief asked for two counts that can DISAGREE. Deriving both
// from discoverBriefs()'s walk produced two numbers that were the same number, catching only TOTAL
// vacuity, never partial. This is a deliberately DIFFERENT traversal: recursive, depth-unlimited, and
// ignorant of both layout shapes — it counts every `.md` under tasksRoot carrying a `## ID` field. If
// discovery's pattern-matching ever misses briefs (a third layout, an unexpected nesting depth, a
// board renamed), these two numbers diverge and the live-corpus test says so. The structural
// disagreement IS the check; sharing a walk would defeat it.
//
// ⚠️ SCOPE, so this is not over-trusted (review R10). The cross-check shares idFields() with discovery,
// so it detects TRAVERSAL divergence only — it is structurally blind to PARSER errors. It cannot catch
// a fence leak (R7): a mis-parsed brief still yields one record and one ID-bearing file, so the counts
// agree while the parsed ID is wrong. Parser correctness is the job of the readId tests, not this.
//
// ⚠️ REVIEW R8 — CYCLE GUARD, and this bug was introduced by the round-1 fixes themselves. Neither
// half existed before: R5 made kindOf() use statSync (which FOLLOWS symlinks, where the old dirent
// check skipped them) and R1 added unbounded recursion. Together, a symlink pointing at an ancestor
// makes this walk descend the loop — a one-brief fixture with `backlog/loop -> <root>` counted 16.
// It terminated only by exhausting PATH_MAX, which is an accident, not a design. Worse, discoverBriefs()
// is NOT recursive, so the inflated count fired the R1 cross-check with "discoverBriefs() is missing
// briefs" — pointing the reader at entirely the wrong repair.
//
// The guard is a set of REAL paths, not a depth cap: realpathSync collapses the symlink so a directory
// already visited under another name is recognized as the same directory.
//
// ⚠️ REVIEW R16 — CONTAINMENT. The walk follows symlinks (it must, per R5), so a link like
// `backlog/vendor -> /external/docs` had it descending out of the repository entirely and counting
// foreign `*.md` files. Verified: 1 real brief + 3 external files counted 4 while discovery counted 1.
// Nothing was ever written, so this was not a read-only violation — but this is the suite's FIRST
// repo-reading test and its header promises conspicuously read-only behavior. An unbounded traversal
// that can wander off-repo undercuts that promise even while technically honoring it. Owner-ruled
// 2026-07-20: bound the walk. Anything resolving outside `root` is not part of this corpus.
//
// ⚠️ REVIEW R18 — dedup FILES here too, not just directories. R12 gave discovery real-path identity
// for files; this walk had it for directories only, so one brief reachable by two names counted twice
// here and once there — the same "two walks disagree" fault R12 fixed, applied to the other half.
// `seen` is deliberately shared between directories and files: both are real paths, and a path already
// accounted for under either kind must not be counted again.
function countIdBearingFiles(dir, seen = new Set(), root = null) {
  const real = realpathOrNull(dir);               // R15 — only genuinely-absent errnos are survivable
  if (real === null) return 0;
  const base = root ?? real;                      // the first call establishes the boundary
  if (real !== base && !real.startsWith(base + sep)) return 0;   // R16 — escaped the corpus
  if (seen.has(real)) return 0;                   // already walked, via a symlink or otherwise
  seen.add(real);

  let n = 0;
  for (const entry of readdirOrEmpty(dir)) {
    const path = join(dir, entry.name);
    const kind = kindOf(path);
    if (kind === 'dir') { n += countIdBearingFiles(path, seen, base); continue; }
    if (kind !== 'file' || !entry.name.endsWith('.md')) continue;

    const realFile = realpathOrNull(path);        // R18 — one physical file counts once
    if (realFile === null || seen.has(realFile)) continue;
    if (realFile !== base && !realFile.startsWith(base + sep)) continue;   // R16, for files too
    seen.add(realFile);

    if (idFields(readFileSync(path, 'utf8')).length > 0) n++;
  }
  return n;
}

// Group records by id and keep only the ids carried by more than one brief.
// ⚠️ Returns the SOURCES, not just a count. The remedy for a collision is "renumber the offender before
// anything links to it" (ADR-029), which is impossible without knowing which briefs collided.
function findDuplicates(records) {
  const byId = new Map();
  for (const { id, source } of records) {
    if (id === null) continue;                    // absent IDs are a separate assertion, not a dupe
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push(source);
  }
  return [...byId.entries()]
    .filter(([, sources]) => sources.length > 1)
    .map(([id, sources]) => ({ id, sources: [...sources].sort() }))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
}

function formatDuplicates(dupes) {
  return dupes.map(d => `  ID ${d.id} is carried by ${d.sources.length} briefs:\n` +
    d.sources.map(s => `    - ${s}`).join('\n')).join('\n');
}

// ── Fixtures (os.tmpdir() only — never the repo) ─────────────────────────────────────────────────

function brief(id, title = 'A task') {
  return id === null
    ? `# ${title}\n\n## Sprint\nSprint 2\n\n## Status\n🔲 Backlog\n`
    : `# ${title}\n\n## ID\n${id}\n\n## Sprint\nSprint 2\n\n## Status\n🔲 Backlog\n`;
}

// `layout` is 'flat' (pre-76) or 'folder' (post-76). `briefs` maps "<board>/<slug>" -> id.
function fixtureTree(layout, briefs) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-taskid-'));
  MADE.push(root);
  const tasks = join(root, 'tasks');
  for (const board of BOARDS) mkdirSync(join(tasks, board), { recursive: true });
  for (const [rel, id] of Object.entries(briefs)) {
    const [board, slug] = rel.split('/');
    if (layout === 'flat') {
      writeFileSync(join(tasks, board, `${slug}.md`), brief(id, slug));
    } else {
      const dir = join(tasks, board, `${id}-${slug}`);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'brief.md'), brief(id, slug));
    }
  }
  return tasks;
}

// ── Unit tests: findDuplicates ───────────────────────────────────────────────────────────────────

test('findDuplicates: a clean corpus reports nothing', () => {
  const dupes = findDuplicates([
    { id: '0001', source: 'backlog/a.md' },
    { id: '0002', source: 'done/b.md' },
    { id: '0003', source: 'cancelled/c.md' },
  ]);
  assert.deepEqual(dupes, []);
});

// The red proof. This is the load-bearing test: a guard that has only ever seen a clean corpus has not
// been tested. The fixture duplicate is what proves the check can go red at all.
test('findDuplicates: a two-way duplicate is reported, with both paths', () => {
  const dupes = findDuplicates([
    { id: '0001', source: 'backlog/a.md' },
    { id: '0101', source: 'backlog/newcomer.md' },
    { id: '0101', source: 'done/incumbent.md' },
  ]);
  assert.equal(dupes.length, 1);
  assert.equal(dupes[0].id, '0101');
  assert.deepEqual(dupes[0].sources, ['backlog/newcomer.md', 'done/incumbent.md']);
});

test('findDuplicates: a three-way duplicate names all three', () => {
  const dupes = findDuplicates([
    { id: '0007', source: 'backlog/x.md' },
    { id: '0007', source: 'done/y.md' },
    { id: '0007', source: 'cancelled/z.md' },
    { id: '0008', source: 'backlog/ok.md' },
  ]);
  assert.equal(dupes.length, 1);
  assert.deepEqual(dupes[0].sources, ['backlog/x.md', 'cancelled/z.md', 'done/y.md']);
});

test('findDuplicates: an empty corpus reports nothing', () => {
  assert.deepEqual(findDuplicates([]), []);
});

test('findDuplicates: two collisions are both reported', () => {
  const dupes = findDuplicates([
    { id: '0002', source: 'backlog/a.md' },
    { id: '0002', source: 'done/b.md' },
    { id: '0009', source: 'backlog/c.md' },
    { id: '0009', source: 'cancelled/d.md' },
  ]);
  assert.deepEqual(dupes.map(d => d.id), ['0002', '0009']);
});

// ── Unit tests: discovery survives task 76 ───────────────────────────────────────────────────────

test('discoverBriefs: finds briefs in the pre-76 flat layout, across all three boards', () => {
  const tasks = fixtureTree('flat', {
    'backlog/alpha': '0001',
    'done/beta': '0002',
    'cancelled/gamma': '0003',
  });
  const found = discoverBriefs(tasks);
  assert.equal(found.length, 3);
  assert.deepEqual(found.map(r => r.id).sort(), ['0001', '0002', '0003']);
  assert.deepEqual(found.map(r => r.source),
    ['backlog/alpha.md', 'cancelled/gamma.md', 'done/beta.md']);
});

// THIS is what stops task 76 from silently disabling the guard.
test('discoverBriefs: finds briefs in the post-76 folder layout', () => {
  const tasks = fixtureTree('folder', {
    'backlog/alpha': '0001',
    'done/beta': '0002',
    'cancelled/gamma': '0003',
  });
  const found = discoverBriefs(tasks);
  assert.equal(found.length, 3);
  assert.deepEqual(found.map(r => r.id).sort(), ['0001', '0002', '0003']);
  assert.deepEqual(found.map(r => r.source),
    ['backlog/0001-alpha/brief.md', 'cancelled/0003-gamma/brief.md', 'done/0002-beta/brief.md']);
});

test('discoverBriefs: catches a collision that spans the two layouts mid-migration', () => {
  const tasks = fixtureTree('flat', { 'backlog/alpha': '0101' });
  mkdirSync(join(tasks, 'done', '0101-beta'), { recursive: true });
  writeFileSync(join(tasks, 'done', '0101-beta', 'brief.md'), brief('0101', 'beta'));
  const dupes = findDuplicates(discoverBriefs(tasks));
  assert.equal(dupes.length, 1);
  assert.deepEqual(dupes[0].sources, ['backlog/alpha.md', 'done/0101-beta/brief.md']);
});

test('discoverBriefs: a folder without brief.md is not a brief', () => {
  const tasks = fixtureTree('flat', { 'backlog/alpha': '0001' });
  mkdirSync(join(tasks, 'backlog', '0002-stray'), { recursive: true });
  writeFileSync(join(tasks, 'backlog', '0002-stray', 'notes.md'), 'not a brief');
  assert.deepEqual(discoverBriefs(tasks).map(r => r.source), ['backlog/alpha.md']);
});

// The vacuous-scan proof: discovery over an empty tree returns zero, which is what makes the
// non-zero-count assertion in the live-corpus test meaningful rather than decorative.
test('discoverBriefs: an empty tree discovers nothing (the vacuous-scan case)', () => {
  const tasks = fixtureTree('flat', {});
  assert.deepEqual(discoverBriefs(tasks), []);
});

test('readId: reads the field, and reports its absence rather than guessing', () => {
  assert.equal(readId(brief('0042')), '0042');
  assert.equal(readId(brief(null)), null);
});

// ── Regression tests for review round 1 ──────────────────────────────────────────────────────────

// R3. The silent-wrong case: a fenced example shadowing the real field. Pre-fix this returned '9999'
// — and '9999' passes the four-digit format check, so nothing downstream would have noticed.
test('readId: a fenced `## ID` example does not shadow the real field (R3)', () => {
  const body = [
    '# A brief that documents the ID field',
    '',
    'Briefs carry an ID like so:',
    '',
    '```markdown',
    '## ID',
    '9999',
    '```',
    '',
    '## ID',
    '0042',
    '',
    '## Status',
    '🔲 Backlog',
  ].join('\n');
  assert.equal(readId(body), '0042');
  assert.equal(idFields(body).length, 1, 'the fenced example must not be counted as an ID field');
});

test('readId: a tilde-fenced example is ignored too (R3)', () => {
  const body = '~~~\n## ID\n9999\n~~~\n\n## ID\n0042\n';
  assert.equal(readId(body), '0042');
});

// ── R7: the round-1 fence fix was incomplete. These are the two cases it leaked on. ──────────────
//
// Both previously returned "9999" — and "9999" passes the four-digit format check, so the wrong ID
// would have travelled all the way into a duplicate comparison unnoticed. The round-1 tests passed
// green throughout, which is the real lesson: they asserted less than the fix claimed to deliver.

test('readId: a 4-backtick fence wrapping a 3-backtick example does not leak (R7)', () => {
  // The standard way to document a fenced example: the outer fence must be longer than the inner one.
  const body = [
    '````markdown',
    '```',
    '## ID',
    '9999',
    '```',
    '````',
    '',
    '## ID',
    '0042',
  ].join('\n');
  assert.equal(readId(body), '0042');
  assert.deepEqual(idFields(body), ['0042'], 'the inner example must not be seen as an ID field');
});

test('readId: a ~~~ line inside a ``` fence does not close it (R7)', () => {
  // A fence closes only with the SAME character; ~~~ inside a ``` block is content.
  const body = '```\n~~~\n## ID\n9999\n```\n\n## ID\n0042\n';
  assert.equal(readId(body), '0042');
  assert.deepEqual(idFields(body), ['0042']);
});

test('readId: a shorter closing run does not close a longer fence (R7)', () => {
  const body = '`````\n```\n## ID\n9999\n`````\n\n## ID\n0042\n';
  assert.equal(readId(body), '0042');
});

// ⚠️ REWRITTEN — the original version of this test was TAUTOLOGICAL (review R17). It indented the
// decoy heading itself (`  ## ID`), which `^##` can never match, so it passed with stripFences()
// replaced by an identity function and tested nothing about indented fences at all. The heading inside
// the fence must be UNindented for the fence stripping to be what makes the test pass.
test('readId: an indented fence opener still opens a fence (R7/R17)', () => {
  const body = '  ```\n## ID\n9999\n  ```\n\n## ID\n0042\n';
  assert.equal(readId(body), '0042');
  assert.deepEqual(idFields(body), ['0042']);
});

// ── R11: positional pairing. The third iteration of the fence defect. ───────────────────────────
//
// The missing rule: a CLOSING fence may not carry an info string. Without it, one stray marker inverts
// inside/outside for the rest of the file.

test('readId: a ```-with-info-string is an opener, never a closer (R11-E1)', () => {
  // The reported leak: a stray unterminated opener, then a later well-formed fenced example. The
  // ```markdown was wrongly accepted as the stray fence's CLOSER, blanking the real field and letting
  // the example's 9999 out. Now ```markdown is content, the stray fence runs to EOF unterminated, both
  // fields stay visible, and the complement rule makes it loud.
  const body = [
    '```',
    'a stray opener that is never closed',
    '',
    '## ID',
    '0042',
    '',
    '```markdown',
    '## ID',
    '9999',
    '```',
  ].join('\n');
  // Pre-fix this silently returned "9999". Now the ```markdown is content rather than a closer, so the
  // stray fence runs on and is closed by the final ``` — blanking everything, including the real field.
  // That is a FALSE "missing ID", which is a loud, actionable failure naming the file. It is not the
  // ideal answer, but it is the safe direction: the guard refuses rather than reporting a wrong ID.
  assert.equal(readId(body), null);
  assert.deepEqual(idFields(body), [], 'no field may leak out of the fence');
});

test('readId: a closing marker with trailing content does not close the fence (R11-E2)', () => {
  const body = '```\n## ID\n9999\n``` note\n\n## ID\n0042\n';
  // The ``` note is not a close, so the fence swallows the example AND the real field below it —
  // an unterminated fence, which R9 leaves visible. Both fields survive, so this fails loudly rather
  // than returning 9999.
  assert.throws(() => readId(body), /carries 2 '## ID' fields/);
});

test('readId: a backtick in the info string means it was never a fence opener (R11)', () => {
  const body = '``` `inline` \n## ID\n0042\n';
  assert.equal(readId(body), '0042');
});

// R9. An unterminated fence must NOT blank the rest of the file — that would hide a real field and
// report a false "missing ID". Malformed markdown should degrade to "this was never a fence".
test('readId: an unterminated fence does not swallow the real field below it (R9)', () => {
  const body = '```\nexample text, fence never closed\n\n## ID\n0042\n';
  assert.equal(readId(body), '0042');
});

// R8. The cycle my own round-1 fixes created: statSync follows symlinks, and the R1 walk recurses.
test('countIdBearingFiles: a symlink cycle terminates and counts correctly (R8)', () => {
  const tasks = fixtureTree('flat', { 'backlog/a': '0001' });
  symlinkSync(tasks, join(tasks, 'backlog', 'loop'));       // points at an ancestor
  assert.equal(countIdBearingFiles(tasks), 1,
    'the cycle must be visited once, not re-walked until PATH_MAX runs out');
});

// ── R14: the complement rule. The defect that survived three rounds of fence-hunting. ───────────
//
// This is the guard's core purpose failing silently: a real collision goes unreported because the
// colliding ID was the SECOND field in its brief and readId() discarded it.

test('readId: two `## ID` fields outside any fence is a loud failure, not a silent first-match (R14)', () => {
  const body = '# A\n\n## ID\n0001\n\n## Context\n\nx\n\n## ID\n0042\n';
  assert.deepEqual(idFields(body), ['0001', '0042'], 'both fields are genuinely present');
  assert.throws(() => readId(body), /carries 2 '## ID' fields/,
    'pre-fix this returned "0001" and threw away "0042"');
});

test('readId: the multi-ID failure names every value found (R14)', () => {
  assert.throws(() => readId('## ID\n0001\n\n## ID\n0042\n\n## ID\n0099\n'),
    /"0001", "0042", "0099"/);
});

test('discoverBriefs: a multi-ID brief fails with its PATH named (R14)', () => {
  const tasks = fixtureTree('flat', {});
  writeFileSync(join(tasks, 'backlog', 'two-ids.md'), '## ID\n0001\n\n## ID\n0042\n');
  assert.throws(() => discoverBriefs(tasks), /backlog\/two-ids\.md.*carries 2 '## ID' fields/s,
    'an unattributed multi-ID failure over 101 briefs is unactionable');
});

// The real prize: a collision that the OLD first-match code reported as clean.
test('the R14 defect in full — a genuine collision that first-match silently missed (R14)', () => {
  const tasks = fixtureTree('flat', {});
  // Brief A's SECOND id collides with brief B. Old readId() returned only A's first, so findDuplicates
  // saw 0001 and 0042 — no collision — and the corpus passed while carrying a real duplicate.
  writeFileSync(join(tasks, 'backlog', 'a.md'), '# A\n\n## ID\n0001\n\n## ID\n0042\n');
  writeFileSync(join(tasks, 'done', 'b.md'), '# B\n\n## ID\n0042\n');

  const firstMatchOnly = [
    { id: idFields(readFileSync(join(tasks, 'backlog', 'a.md'), 'utf8'))[0], source: 'backlog/a.md' },
    { id: '0042', source: 'done/b.md' },
  ];
  assert.deepEqual(findDuplicates(firstMatchOnly), [],
    'documents the old behavior: the collision was invisible');

  // The complement rule refuses to guess, so the corpus defect surfaces instead of hiding a duplicate.
  assert.throws(() => discoverBriefs(tasks), /carries 2 '## ID' fields/);
});

// R18 — the same "two walks disagree" fault as R12, on the other half: discovery deduped files by real
// path, this walk deduped only directories. Both walks are asserted, because agreeing is the point.
test('countIdBearingFiles: one brief reachable by two names counts once (R18)', () => {
  const tasks = fixtureTree('flat', { 'backlog/a': '0001' });
  symlinkSync(join(tasks, 'backlog', 'a.md'), join(tasks, 'done', 'link.md'));
  assert.equal(countIdBearingFiles(tasks), 1, 'one physical file, one count');
  assert.equal(discoverBriefs(tasks).filter(r => r.id !== null).length, 1,
    'and discovery must agree — the disagreement IS the finding');
});

// R16 — containment. The walk follows symlinks by design (R5); it must not follow them off-repo.
test('countIdBearingFiles: does not count .md files outside the corpus root (R16)', () => {
  const outside = mkdtempSync(join(tmpdir(), 'fkit-outside-'));
  MADE.push(outside);
  for (const n of ['x.md', 'y.md', 'z.md']) writeFileSync(join(outside, n), '## ID\n1234\n');

  const tasks = fixtureTree('flat', { 'backlog/real': '0001' });
  symlinkSync(outside, join(tasks, 'backlog', 'vendor'));

  assert.equal(countIdBearingFiles(tasks), 1,
    'the three external briefs are outside the corpus and must not be counted');
});

// ⚠️ RE-POINTED AT THE FOLDER LAYOUT (review R13). The flat-layout version passed only by accident of
// its fixture: the mirrored directory held `b.md` and no `brief.md`, so discovery skipped it and the
// two counts agreed at 2 for the wrong reason — codifying the R12 inconsistency as intended behavior.
// The folder layout is the one this whole guard exists to survive, so that is what it must be tested
// against. Both walks are asserted, not just the count.
test('countIdBearingFiles: a symlink to a sibling dir is not double-counted (R8/R13)', () => {
  const tasks = fixtureTree('folder', { 'backlog/alpha': '0001', 'done/beta': '0002' });
  symlinkSync(join(tasks, 'done'), join(tasks, 'backlog', 'mirror'));
  assert.equal(countIdBearingFiles(tasks), 2, 'two physical briefs, one reachable by two paths');
  assert.equal(discoverBriefs(tasks).filter(r => r.id !== null).length, 2,
    'discovery must agree with the cross-check, which is exactly what R12 was about');
});

// R4. Both of these were present-but-untidy IDs that the old single-regex parser reported as MISSING.
test('readId: a whitespace-only separator line still yields the ID (R4)', () => {
  assert.equal(readId('## ID\n   \n0042\n'), '0042');
});

test('readId: trailing content on the value line is returned, not silently dropped (R4)', () => {
  // Reported as-is so the format assertion is what judges it — a false "missing ID" would point at
  // the wrong repair.
  assert.equal(readId('## ID\n0042 (provisional)\n'), '0042 (provisional)');
});

test('readId: a heading with no value at all reports null, not a crash (R4)', () => {
  assert.equal(readId('## ID\n'), null);
});

// R5. Both isFile() and isDirectory() are false for a symlink, so these were skipped in silence.
// ⚠️ REVISED IN ROUND 4 (review R12). These previously asserted that a symlink to an ALREADY-DISCOVERED
// brief yields a second record and a duplicate ID. That was wrong, and it codified the very
// inconsistency R12 reported: one physical brief reachable by two names is ONE brief. Reporting it as
// a duplicate is this guard crying wolf about the exact thing it exists to detect. R5's actual point —
// a symlinked brief must not be SILENTLY SKIPPED — is preserved and tested directly below.
test('discoverBriefs: a symlink to an already-discovered brief is not a second brief (R5/R12)', () => {
  const tasks = fixtureTree('flat', { 'backlog/real': '0001' });
  symlinkSync(join(tasks, 'backlog', 'real.md'), join(tasks, 'done', 'linked.md'));
  const found = discoverBriefs(tasks);
  assert.deepEqual(found.map(r => r.source), ['backlog/real.md'], 'one file, one record');
  assert.deepEqual(findDuplicates(found), [], 'and therefore no phantom duplicate');
});

// ⚠️ REWRITTEN IN ROUND 5 (review R19, owner-ruled). This test previously asserted that a symlink to a
// brief OUTSIDE the task tree is discovered. That encoded the wrong rule: the corpus ends at the tree,
// so an off-tree brief is not part of it — git stores the link, not the target, and that brief's ID was
// never allocated in this repo. Discovery and the cross-check now share one boundary.
test('discoverBriefs: a brief reachable only by an OFF-TREE symlink is not in the corpus (R19)', () => {
  const tasks = fixtureTree('flat', {});
  const stash = mkdtempSync(join(tmpdir(), 'fkit-stash-'));
  MADE.push(stash);
  writeFileSync(join(stash, 'elsewhere.md'), brief('0007', 'elsewhere'));
  symlinkSync(join(stash, 'elsewhere.md'), join(tasks, 'backlog', 'linked.md'));

  assert.deepEqual(discoverBriefs(tasks), [], 'off-tree is outside the corpus');
  assert.equal(countIdBearingFiles(tasks), 0, 'and both walks agree — that is the point of R19');
});

// R5's actual content, preserved and still red-provable: an IN-TREE symlink to a brief that discovery
// would not otherwise reach must NOT be silently skipped. This is the regression the dirent check
// caused, and it is what R5 was really about.
test('discoverBriefs: an in-tree symlink to an otherwise-unreached brief is discovered (R5)', () => {
  const tasks = fixtureTree('flat', {});
  const stash = join(tasks, 'archive');           // inside the tree, but not a board
  mkdirSync(stash, { recursive: true });
  writeFileSync(join(stash, 'elsewhere.md'), brief('0007', 'elsewhere'));
  symlinkSync(join(stash, 'elsewhere.md'), join(tasks, 'backlog', 'linked.md'));

  const found = discoverBriefs(tasks);
  assert.deepEqual(found.map(r => r.source), ['backlog/linked.md']);
  assert.equal(found[0].id, '0007', 'a symlinked brief must not be silently skipped');
});

test('discoverBriefs: a symlinked post-76 task folder is not double-counted (R5/R12)', () => {
  const tasks = fixtureTree('folder', { 'backlog/alpha': '0001' });
  symlinkSync(join(tasks, 'backlog', '0001-alpha'), join(tasks, 'done', '0002-linked'));
  const found = discoverBriefs(tasks);
  assert.deepEqual(found.map(r => r.source), ['backlog/0001-alpha/brief.md']);
  // R12's core symptom: the two walks must now agree.
  assert.equal(found.filter(r => r.id !== null).length, countIdBearingFiles(tasks));
});

test('discoverBriefs: a dangling symlink is skipped without throwing (R5)', () => {
  const tasks = fixtureTree('flat', { 'backlog/real': '0001' });
  symlinkSync(join(tasks, 'backlog', 'gone.md'), join(tasks, 'done', 'dangling.md'));
  assert.deepEqual(discoverBriefs(tasks).map(r => r.source), ['backlog/real.md']);
});

// R15. The two bare catches that never learned R2's lesson. An unreadable entry must not be reported
// as absent — that silently shrinks the scanned corpus, which is this file's whole nightmare.
// Skipped as root, where the permission bits do not bite and the test would pass for the wrong reason.
test('kindOf / realpathOrNull: unreadable is not the same as absent (R15)', { skip: process.getuid?.() === 0 ? 'runs as root; permission bits do not apply' : false }, () => {
  const tasks = fixtureTree('flat', {});
  const locked = join(tasks, 'backlog', 'locked');
  mkdirSync(locked, { recursive: true });
  writeFileSync(join(locked, 'brief.md'), brief('0001'));
  chmodSync(locked, 0o000);
  try {
    assert.throws(() => kindOf(join(locked, 'brief.md')), /cannot stat .*EACCES/,
      'an unreadable entry must fail loudly, not be silently treated as absent');
    assert.throws(() => realpathOrNull(join(locked, 'brief.md')), /cannot resolve .*EACCES/);
  } finally {
    chmodSync(locked, 0o755);                     // always restore, or cleanup() cannot remove it
  }

  // ...while a genuinely absent path is still survivable.
  assert.equal(kindOf(join(tasks, 'backlog', 'no-such-file.md')), 'other');
  assert.equal(realpathOrNull(join(tasks, 'backlog', 'no-such-file.md')), null);
});

// R2. A board that does not exist is legitimately nothing; a board that cannot be READ is a failure.
// The old blanket catch made those two indistinguishable, so an unreadable done/ (76 of 101 briefs)
// produced a silent, confident green.
test('readdirOrEmpty: a missing board is empty, an unreadable one THROWS (R2)', () => {
  const tasks = fixtureTree('flat', { 'backlog/a': '0001' });
  assert.deepEqual(readdirOrEmpty(join(tasks, 'nonexistent')), []);

  // A file where a directory is expected: ENOTDIR, not ENOENT — must not be swallowed.
  writeFileSync(join(tasks, 'notadir'), 'x');
  assert.throws(() => readdirOrEmpty(join(tasks, 'notadir')), /cannot read board directory/);
});

// R1. The two counts must be able to DISAGREE, or the cross-check is decorative. A brief nested deeper
// than discovery looks is exactly the partial-vacuity vector the same-walk version could never see.
test('countIdBearingFiles: diverges from discovery when a brief is nested out of reach (R1)', () => {
  const tasks = fixtureTree('flat', { 'backlog/a': '0001', 'done/b': '0002' });
  assert.equal(countIdBearingFiles(tasks), 2);
  assert.equal(discoverBriefs(tasks).filter(r => r.id !== null).length, 2);

  // Bury a third brief two levels down — discovery cannot see it, the recursive walk can.
  mkdirSync(join(tasks, 'backlog', 'archive', '0003-buried'), { recursive: true });
  writeFileSync(join(tasks, 'backlog', 'archive', '0003-buried', 'brief.md'), brief('0003'));
  assert.equal(countIdBearingFiles(tasks), 3);
  assert.equal(discoverBriefs(tasks).filter(r => r.id !== null).length, 2);
});

test('countIdBearingFiles: ignores .md files carrying no ID field (R1)', () => {
  const tasks = fixtureTree('flat', { 'backlog/a': '0001' });
  writeFileSync(join(tasks, 'backlog', 'README.md'), '# Not a brief\n\nNo ID here.\n');
  assert.equal(countIdBearingFiles(tasks), 1);
});

// ── The live corpus ──────────────────────────────────────────────────────────────────────────────

test('the live ai-agents/tasks/ corpus has no duplicate IDs', () => {
  const tasks = join(REPO, 'ai-agents', 'tasks');
  const records = discoverBriefs(tasks);

  // Non-vacuity first: everything below is trivially true over an empty corpus.
  assert.ok(records.length > 0,
    `discovered ZERO briefs under ${tasks} — the scan is vacuous, not clean. ` +
    'Discovery matches <board>/<slug>.md and <board>/<NNNN>-<slug>/brief.md; if the layout changed ' +
    'again, discoverBriefs() must be taught the new shape before this guard means anything.');

  // R1 — the INDEPENDENT cross-check: a second, structurally different walk must find the same number
  // of ID-bearing briefs. This is what catches PARTIAL vacuity, which the non-zero assertion above
  // cannot see. Both counts are DERIVED at runtime, never hardcoded — every count written into a brief
  // in this project so far has gone stale before the task ran.
  const withId = records.filter(r => r.id !== null).length;
  const independent = countIdBearingFiles(tasks);
  assert.equal(withId, independent,
    `discovery found ${withId} ID-bearing briefs, but a recursive layout-agnostic walk found ` +
    `${independent}. The two disagree, so discoverBriefs() is missing briefs the corpus actually ` +
    'contains — teach it the shape it is not matching. (If the extra files are legitimately not ' +
    'briefs, exclude them from the recursive walk deliberately, not by leaving discovery broken.)');

  // Every discovered brief must carry an ID.
  const missing = records.filter(r => r.id === null).map(r => r.source);
  // R6 — the message names the OTHER likely cause. Every `*.md` sitting in a board directory is taken
  // to be a brief, so a stray README/NOTES file fails here rather than at a "this is not a brief"
  // check. The failure is loud either way; without this hint it points at the wrong repair.
  assert.deepEqual(missing, [],
    `${missing.length} of ${records.length} discovered briefs carry no '## ID' field:\n` +
    missing.map(s => `    - ${s}`).join('\n') +
    "\n  Either the brief needs an ID, or the file is not a brief at all — every '*.md' in a board " +
    'directory is treated as one. If it is not a brief, move it out of the board directory.');

  const malformed = records.filter(r => !/^[0-9]{4}$/.test(r.id));
  assert.deepEqual(malformed, [],
    'briefs carry a malformed ID (expected exactly four digits):\n' +
    malformed.map(r => `    - ${r.source}: ${JSON.stringify(r.id)}`).join('\n'));

  const dupes = findDuplicates(records);
  assert.deepEqual(dupes, [],
    `duplicate task IDs across ${records.length} briefs — renumber the NEWCOMER before anything ` +
    `links to it (ADR-029 Decision 3):\n${formatDuplicates(dupes)}`);
});
