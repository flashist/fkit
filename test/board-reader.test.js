// The read-only board reader's contract — task 0411, Track 1 ("A now") of ADR-051.
//
// SUBJECT: bin/fkit-board.mjs, the local HTTP reader that serves aiboard's unmodified web UI over
// fkit's unmodified ai-agents/ tree.
//
// SCOPE. Seven assertions, taken from the task's approved plan §6. They are not a general HTTP suite:
// each one pins a claim the task makes to the owner, and each would have caught a specific way the
// preserved Python spike got it wrong.
//
//   A — snapshot shape: every id is a JSON STRING matching ^\d{4}$, and `0013` survives unmangled.
//   B — sprint status comes from the ONE recognizer: Sprint 11 reads its true status, an archived
//       board reads Done FROM LOCATION, backlog.md reads `unresolved` (never `Backlog`), and a board
//       whose banner carries a LATER cancel marker in trailing prose still reads in-progress — the
//       exact specimen that made the spike's first draft call Sprint 11 cancelled.
//   C — ⭐ NO SECOND GRAMMAR: the reader's own source carries no sprint-banner marker, no banner
//       prefix, and no in-progress status literal. This is the standing F3 guard.
//   D — write refusal: every method that is not GET is refused, on a real ephemeral-port server.
//   E — ⚠️ WRITE-PROOF: `git status --porcelain ai-agents/` is IDENTICAL before and after a full crawl
//       plus every route. IDENTICAL, not EMPTY — the working tree legitimately carries uncommitted
//       changes while this task is in flight, so an emptiness assertion would go red for reasons that
//       have nothing to do with the reader. "Unchanged by the run" is what the verification step says.
//   F — path resolution: an aiboard path that does not resolve exits NON-ZERO naming all three ways.
//   G — unknown id: /api/tasks/9999 is a 404 that leaks no filesystem path.
//
// ⚠️ ADR-014's testing law: black-box process contract, zero devDependencies, `node --test`. F runs
// the CLI as a subprocess; the rest drive the exported functions and a real loopback server.
//
// ⚠️ Nothing here writes into the repo. B's fixture tree lives under os.tmpdir(), matching
// harness.mjs's standing rule ("nothing here writes into the repo"). E READS git state and asserts on
// it; it changes nothing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync, renameSync, rmSync }
  from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

import { findRoot, findDashboard, resolveAiboard, boardId, makeReader, startServer }
  from '../bin/fkit-board.mjs';

const READER = join(REPO, 'bin', 'fkit-board.mjs');
const ROOT = findRoot(join(REPO, 'bin'));
const DASHBOARD = findDashboard(ROOT);

// One reader for the read-only assertions — the whole point is that repeated reads change nothing.
const reader = makeReader({ root: ROOT, dashboard: DASHBOARD });

// A throwaway HTML file to stand in for aiboard's index.html wherever a server must start but the
// UI's own bytes are irrelevant. ⛔ aiboard's real file is NEVER copied into fkit.
function stubUi() {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-board-ui-'));
  const file = join(dir, 'index.html');
  writeFileSync(file, '<!doctype html><title>stub</title>');
  return { file, dir };
}

async function withServer(fn) {
  const ui = stubUi();
  const server = startServer({ root: ROOT, dashboard: DASHBOARD, aiboardPath: ui.file, port: 0 });
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    return await fn(base);
  } finally {
    await new Promise((r) => server.close(r));
    rmSync(ui.dir, { recursive: true, force: true });
  }
}

// ── A — snapshot shape, ids as strings, 0013 unmangled ───────────────────────────────────────────

test('A: every task id is a JSON string of exactly four digits, and 0013 is unmangled', () => {
  const snap = reader.snapshot();

  // The corpus size is COUNTED here rather than hard-coded: it grows every working day, and a frozen
  // number would turn ordinary backlog growth into a red test.
  let counted = 0;
  for (const board of ['backlog', 'done', 'cancelled']) {
    for (const name of readdirSync(join(ROOT, 'ai-agents', 'tasks', board))) {
      if (/^\d{4}-/.test(name)) counted++;
    }
  }
  assert.equal(snap.tasks.length, counted, 'every task folder is rendered, and nothing else is');
  assert.ok(counted > 400, `sanity: the corpus is in the hundreds (counted ${counted})`);

  for (const t of snap.tasks) {
    assert.equal(typeof t.id, 'string', `${t.folder}: id must be a STRING, never a number`);
    assert.match(t.id, /^\d{4}$/, `${t.folder}: id must be exactly four digits`);
  }

  // ⭐ aiboard's T-023 coerces an all-digit front-matter string to an int on its WRITE path, turning
  // `0013` into `13` — a DIFFERENT task of ours. This reader never writes, but the id must still
  // survive the READ path intact, so the specimen is pinned explicitly.
  const t13 = snap.tasks.find((t) => t.folder.startsWith('0013-'));
  assert.ok(t13, 'task 0013 is in the corpus');
  assert.equal(t13.id, '0013', '0013 stays 0013 — not 13, not the number 13');
  assert.ok(JSON.stringify(snap).includes('"id":"0013"'),
    'the serialised payload carries 0013 as a quoted string');

  // aiboard's UI reads these unconditionally; a missing one is a TypeError in the browser, not a
  // graceful degrade.
  assert.deepEqual(snap.statuses, ['backlog', 'in-progress', 'done', 'cancelled']);
  assert.equal(snap.read_only, true, 'read_only drives aiboard\'s own read-only UI, not just the HTTP layer');
  for (const t of snap.tasks) {
    assert.ok(snap.statuses.includes(t.status), `${t.id}: status ${t.status} is one of aiboard's columns`);
    assert.ok(Array.isArray(t.labels) && Array.isArray(t.blockers));
    assert.notEqual(t.priority, 'medium',
      `${t.id}: the board's real priority is kept, never flattened to the spike's "medium"`);
  }
  for (const s of snap.sprints) {
    for (const c of snap.statuses) assert.equal(typeof s.progress.counts[c], 'number');
    assert.ok(Array.isArray(s.tasks));
  }
});

// ── B — sprint status: one recognizer, location for archives, no false reads ─────────────────────

test('B: sprint status comes from dashboard.sh for open boards and from LOCATION for archives', () => {
  const snap = reader.snapshot();
  const byFolder = new Map(snap.sprints.map((s) => [s.folder, s]));

  // The live board. Its own status is whatever dashboard.sh resolves TODAY — the assertion is that
  // the reader reports exactly that, not that the value is any particular word.
  const live = byFolder.get('sprint-11.md');
  assert.ok(live, 'sprint-11.md is rendered as a board');
  const resolved = spawnSync('bash', [DASHBOARD, 'status', join(ROOT, 'ai-agents', 'sprints', 'sprint-11.md')],
    { cwd: ROOT, encoding: 'utf8' });
  assert.equal(resolved.status, 0, 'dashboard.sh resolves sprint-11.md');
  assert.equal(live.status, resolved.stdout.trim(),
    'the reader reports the ONE recognizer\'s answer, byte for byte');
  assert.notEqual(live.status, 'Cancelled',
    'Sprint 11 is NOT cancelled — the specimen that broke the spike\'s first draft');
  assert.equal(live.id, 'S-011');

  // Archived: status from location. No banner is parsed and no extra subprocess is spent.
  const archived = snap.sprints.filter((s) => s.path.includes(`${join('sprints', 'done')}`));
  assert.ok(archived.length > 0, 'there are archived boards to check');
  for (const s of archived) assert.equal(s.status, 'Done', `${s.folder}: done/ means Done`);

  // ⚠️ backlog.md resolves identity="Backlog" with status="unresolved", and `dashboard.sh status`
  // exits 3 on it. `unresolved` must render as `unresolved` — NEVER silently as `Backlog`, which is
  // an IDENTITY here, not a status. ADR-051's F2 is "showed something FALSE even once".
  const backlog = byFolder.get('backlog.md');
  assert.ok(backlog, 'backlog.md is rendered as a board');
  assert.equal(backlog.status, 'unresolved');
  assert.equal(backlog.id, 'BACKLOG');

  // The exit code is captured DIRECTLY off `status`, never through a pipe — a pipe reports the exit
  // of the LAST command in it, which is how a 3 silently becomes a 0.
  const probe = spawnSync('bash', [DASHBOARD, 'status', join(ROOT, 'ai-agents', 'sprints', 'backlog.md')],
    { cwd: ROOT, encoding: 'utf8' });
  assert.equal(probe.status, 3, 'dashboard.sh exits 3 on backlog.md, and 3 is an ANSWER not a failure');
});

test('B2: a banner carrying a LATER cancel marker in trailing prose still reads in-progress', () => {
  // The fixture the plan names: the specimen class that made the spike's first-glyph rule call
  // Sprint 11 cancelled. Built in a temp tree so nothing touches the repo.
  const dir = mkdtempSync(join(tmpdir(), 'fkit-board-fixture-'));
  try {
    for (const b of ['backlog', 'done', 'cancelled']) {
      mkdirSync(join(dir, 'ai-agents', 'tasks', b), { recursive: true });
    }
    mkdirSync(join(dir, 'ai-agents', 'sprints'), { recursive: true });
    writeFileSync(join(dir, 'ai-agents', 'sprints', 'sprint-99.md'),
      '# Sprint 99 — a fixture board\n'
      + '\n'
      + '> ## \u{1F504} In progress — 2026-09-20. ⛔ **PARTIALLY FROZEN** — this trailing'
      + ' prose carries a later cancel marker on purpose.\n'
      + '>\n'
      + '> Body.\n');

    const fixture = makeReader({ root: dir, dashboard: DASHBOARD }).snapshot();
    assert.equal(fixture.sprints.length, 1);
    const s = fixture.sprints[0];
    assert.equal(s.id, 'S-099');
    assert.notEqual(s.status, 'Cancelled',
      'a later cancel marker in TRAILING PROSE is not the board\'s status');
    assert.equal(s.status,
      spawnSync('bash', [DASHBOARD, 'status', join(dir, 'ai-agents', 'sprints', 'sprint-99.md')],
        { cwd: dir, encoding: 'utf8' }).stdout.trim(),
      'the reader agrees with the ONE recognizer, whatever it says');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('B3: board ids keep a non-numeric sprint suffix distinct', () => {
  // `Sprint 4` and `Sprint 4c` are different sprints; coercing the suffix away would merge two boards.
  assert.equal(boardId('Sprint 11'), 'S-011');
  assert.equal(boardId('Sprint 4'), 'S-004');
  assert.equal(boardId('Sprint 4c'), 'S-4c');
  assert.equal(boardId('Backlog'), 'BACKLOG');
  assert.equal(boardId('Backlog (unsprinted)'), 'BACKLOG');
  assert.equal(boardId('Unscheduled'), null);
  assert.equal(boardId(undefined), null);
});

// ── C — ⭐ the standing F3 guard: no second grammar ───────────────────────────────────────────────

// ⚠️ The guard scans a DECODED copy of the source, not the raw bytes. A literal `includes()` scan is
// defeated by spelling the same recognizer with escapes: a `\u`-escaped equivalent was demonstrated
// that scored 0 of 5 needles. Decoding first is what makes the literal needles below mean anything.
function decodeEscapes(src) {
  return src
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

test('C: the reader re-states no part of the sprint-status grammar', () => {
  const src = decodeEscapes(readFileSync(READER, 'utf8'));

  // conventions/sprint-status-vocabulary.md, "The carrier — the line-3 banner": "The recognizer has
  // exactly one implementation, in `dashboard.sh`. Do not re-state the regex anywhere else."
  //
  // WHAT IS FORBIDDEN, and why each one: the three banner markers the reader can have no other reason
  // to carry (its task statuses come from the FOLDER, and the two task markers it does read are not
  // in this list), the banner's blockquoted-heading prefix, and the in-progress status literal — which
  // a re-derived recognizer must produce from somewhere and this reader must only ever echo.
  //
  // ⚠️ SCANS THE WHOLE FILE, COMMENTS INCLUDED. A guard that parses comments out first can be talked
  // past; this one cannot, at the price of the reader's comments not being allowed to quote these
  // tokens. That price was paid deliberately.
  //
  // ⚠️ What is deliberately NOT forbidden: `\u{1F504}` and `\u{1F6A7}`, the two TASK markers the reader
  // reads from a brief's `## Status` field. The convention's own by-POSITION rule is what makes that
  // legitimate — a task status is a brief field, a sprint status is a blockquoted H2 on line 3 of a
  // board — and the task vocabulary has no second implementation to collide with.
  const forbidden = [
    ['\u{1F532}', 'the Backlog banner marker'],
    ['✅', 'the Done banner marker'],
    ['\u{1F512}', 'the legacy CLOSED banner marker'],
    ['> ##', 'the banner\'s blockquoted-heading prefix'],
    ['In progress', 'the in-progress status literal — it may only ever be ECHOED from dashboard.sh'],
  ];
  for (const [needle, why] of forbidden) {
    assert.ok(!src.includes(needle),
      `bin/fkit-board.mjs must not contain ${JSON.stringify(needle)} (${why}): the sprint-status `
      + 'recognizer has exactly one implementation, in dashboard.sh.');
  }

  // ⚠️ STRUCTURAL needles, and they are the half that matters. The five literals above only catch a
  // recognizer that SPELLS the grammar out. They did not catch a real, shipped one: the board record's
  // `goal:` field reached line 3 BY INDEX and stripped its `> ##` prefix with a CHARACTER CLASS,
  // naming neither a marker nor the prefix — so every literal needle passed it green.
  const structural = [
    [/\[[^\]\n]*(?:>[^\]\n]*#|#[^\]\n]*>)[^\]\n]*\]/,
      'a regex character class holding both > and # — a prefix-stripping read of the banner'],
    [/\blines\s*\[\s*2\s*\]/,
      'lines[2] — the line-3 banner reached positionally'],
    [/split\(\s*(['"`])\\n\1\s*\)\s*\[\s*2\s*\]/,
      'split(newline)[2] — the line-3 banner reached positionally'],
  ];
  for (const [re, why] of structural) {
    assert.ok(!re.test(src),
      `bin/fkit-board.mjs must not contain ${why}: the sprint-status recognizer has exactly one `
      + 'implementation, in dashboard.sh. Line 3 of a board is that recognizer\'s input, not this '
      + 'file\'s.');
  }

  // The positive half. ⚠️ `src.includes('select-active')` was satisfied by the COMMENTS alone, so it
  // asserted nothing; this pins the delegation to a real spawn of the one recognizer.
  assert.match(src, /spawnSync\(\s*'bash'\s*,\s*\[[^\]]*'select-active'/,
    'the reader obtains open-board status by SPAWNING dashboard.sh select-active — not by merely '
    + 'mentioning it in a comment');
});

// ── D — write refusal ────────────────────────────────────────────────────────────────────────────

test('D: every method that is not GET is refused', async () => {
  await withServer(async (base) => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']) {
      for (const path of ['/', '/api/board', '/api/tasks/0013', '/api/sprints/S-011', '/api/check']) {
        const r = await fetch(base + path, { method });
        assert.ok(r.status >= 400,
          `${method} ${path} must be refused, got ${r.status}`);
        if (method !== 'HEAD') {
          const body = await r.json();
          assert.match(body.error, /read-only/i, `${method} ${path} says why it refused`);
        }
      }
    }
    // ...and the read side still works, so the refusal is not just a broken server.
    const ok = await fetch(`${base}/api/board`);
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).read_only, true);
  });
});

// ── E — ⚠️ write-proof: IDENTICAL, not EMPTY ─────────────────────────────────────────────────────

test('E: a full crawl plus every route leaves ai-agents/ byte-identical in git\'s eyes', async () => {
  const gitState = () => execFileSync('git', ['status', '--porcelain', '--', 'ai-agents/'],
    { cwd: REPO, encoding: 'utf8' });

  const before = gitState();

  await withServer(async (base) => {
    const board = await (await fetch(`${base}/api/board`)).json();
    assert.ok(board.tasks.length > 400);
    // Every route, including a detail read of a real task and a real board.
    await fetch(`${base}/`);
    await fetch(`${base}/api/check`);
    for (const t of board.tasks.slice(0, 25)) {
      assert.equal((await fetch(`${base}/api/tasks/${t.id}`)).status, 200);
    }
    for (const s of board.sprints) {
      assert.equal((await fetch(`${base}/api/sprints/${s.id}`)).status, 200);
    }
  });

  const after = gitState();

  // ⚠️ IDENTICAL, NOT EMPTY. The tree legitimately carries uncommitted work while this task is in
  // flight; asserting emptiness would go red for reasons that are not about the reader. The claim the
  // task makes is "it writes nothing", and "unchanged by the run" is exactly that claim.
  assert.equal(after, before,
    'the reader changed ai-agents/ — it must never write, in any mode, behind any flag');
});

// ── E2 — ⭐ the STATIC write-proof, which is the stronger one ─────────────────────────────────────

// ⚠️ E above cannot see every write, and saying so is the point of E2. `git status --porcelain` is
// blind to a write into a file ALREADY showing ` M`, and to anything created inside an UNTRACKED
// directory (whose whole contents collapse to one `??` line — this task's own folder is one today).
// E proves "no change of git STATUS CLASS", which is weaker than "wrote nothing".
//
// ⭐ The claim the task actually makes — "no write path, in any mode, behind any flag" — is STATIC,
// so this asserts it statically: the reader cannot write because it never imports anything that can.
// The expected list is HARD-CODED, not derived from the source (ADR-014: "a test whose oracle is the
// implementation tests nothing").
test('E2: the reader imports no write-capable API — the static proof', () => {
  const src = readFileSync(READER, 'utf8');

  const m = /import\s*\{([^}]*)\}\s*from\s*'node:fs'/.exec(src);
  assert.ok(m, 'the reader imports from node:fs by name, so the import list is readable');
  assert.deepEqual(
    m[1].split(',').map((s) => s.trim()).filter(Boolean).sort(),
    ['existsSync', 'readFileSync', 'readdirSync', 'statSync'],
    'node:fs is imported for exactly four READ calls — a write-capable name here is a new write path');

  // ⚠️ The subprocess import list is pinned the SAME way, and that is what closes `exec`/`spawn`/
  // `fork` — needles for those are unusable, because `RegExp.prototype.exec()` is a legitimate and
  // frequent call in this file. Pinning the import is exact where a substring search is not.
  const c = /import\s*\{([^}]*)\}\s*from\s*'node:child_process'/.exec(src);
  assert.ok(c, 'the reader imports from node:child_process by name');
  assert.deepEqual(c[1].split(',').map((s) => s.trim()).filter(Boolean), ['spawnSync'],
    'the ONLY subprocess API is spawnSync — exec/execFile/spawn/fork are not imported at all');

  // Every other route to a write, including the ones that bypass an import list. Needles carry their
  // punctuation so prose cannot trip them ("renames anything" must not match a `rename(` needle).
  const banned = [
    'node:fs/promises', 'require(', 'import(', 'createWriteStream', 'writeFile', 'appendFile',
    'mkdirSync', 'mkdtempSync', 'rmSync', 'unlinkSync', 'renameSync', 'copyFileSync', 'chmodSync',
    'truncateSync', 'openSync', 'writeSync',
  ];
  for (const needle of banned) {
    assert.ok(!src.includes(needle),
      `bin/fkit-board.mjs must not contain ${JSON.stringify(needle)}: it is read-only, and the only `
      + 'subprocess it may start is the dashboard.sh spawnSync pinned by assertion C.');
  }

  // The one subprocess API is spawnSync, called in exactly two places.
  assert.equal(src.split('spawnSync(').length - 1, 2,
    'spawnSync is CALLED exactly twice: the snapshot\'s select-active, and the startup probe');
});

// ── F — path resolution fails loudly, naming all three ways ──────────────────────────────────────

test('F: an unresolvable aiboard path exits non-zero and names all three ways to set it', () => {
  const missing = join(tmpdir(), 'fkit-board-no-such-aiboard', 'index.html');
  const r = spawnSync(process.execPath, [READER, '--aiboard', missing],
    { cwd: REPO, encoding: 'utf8', env: { ...process.env, FKIT_AIBOARD: '' } });

  assert.notEqual(r.status, 0, 'it must not start, and must not serve a silent 404 instead');
  assert.match(r.stderr, /--aiboard/, 'names the flag');
  assert.match(r.stderr, /FKIT_AIBOARD/, 'names the environment variable');
  assert.match(r.stderr, /sibling default/, 'names the sibling default');
  assert.match(r.stderr, /index\.html/, 'names what it was looking for');

  // The same three ways are what the exported resolver reports, so the message cannot drift from it.
  assert.throws(() => resolveAiboard({ flag: missing, env: undefined, root: ROOT }),
    (e) => e.code === 'AIBOARD_UNRESOLVED' && /--aiboard[\s\S]*FKIT_AIBOARD[\s\S]*sibling default/.test(e.message));
});

// ── G — an unknown id is a 404 that leaks no path ────────────────────────────────────────────────

// ⚠️ The dot-segment case is written PERCENT-ENCODED on purpose. `fetch` NORMALISES `..` before
// transmitting, so `/api/tasks/../../etc/passwd` arrives at the server as `/etc/passwd` and never
// reaches the task route at all — it was a duplicate of the `/nope` case wearing a traversal's name.
// `%2e%2e%2f` is passed through unnormalised, so these two really do exercise the id gate and the
// sprint route's decodeURIComponent.
test('G: /api/tasks/9999 is a 404 that leaks no filesystem path', async () => {
  await withServer(async (base) => {
    for (const path of ['/api/tasks/9999', '/api/tasks/nope',
                        '/api/tasks/%2e%2e%2f%2e%2e%2fetc%2fpasswd',
                        '/api/sprints/%2e%2e%2f%2e%2e%2fetc%2fpasswd',
                        '/api/sprints/S-999', '/nope']) {
      const r = await fetch(base + path);
      assert.equal(r.status, 404, `${path} is a 404`);
      const body = await r.text();
      assert.equal(body, '{"error":"not found"}', `${path} leaks nothing but "not found"`);
      assert.ok(!body.includes(ROOT), `${path} leaks no filesystem path`);
    }
  });
});

// ── H — the review round-1 fixes, each pinned so it cannot come back ──────────────────────────────

test('H1: a board\'s goal is null — the line-3 status banner is never published as one', () => {
  const snap = reader.snapshot();
  assert.ok(snap.sprints.length > 0);
  for (const s of snap.sprints) {
    assert.equal(s.goal, null,
      `${s.folder}: fkit boards carry no goal field. Publishing line 3 here put the STATUS in a `
      + 'field aiboard labels "Goal", on every sprint card and in the drawer.');
  }
  // ...and the status itself is still reported, in its own field, from the one recognizer.
  const live = snap.sprints.find((s) => s.folder === 'sprint-11.md');
  assert.ok(live && typeof live.status === 'string' && live.status.length > 0,
    'dropping goal must not drop status — they are different fields');
});

test('H2: a truncated sprint description SAYS it was truncated, in text that survives aiboard', () => {
  const snap = reader.snapshot();
  const big = snap.sprints.find((s) => readFileSync(s.path, 'utf8').length > 20000);
  assert.ok(big, 'there is a board larger than the cap');

  const detail = reader.sprintDetail(big.id);
  const chars = readFileSync(big.path, 'utf8').length;
  assert.match(detail.description, /^⚠️ … truncated, [\d,]+ of [\d,]+ characters …\n\n/,
    'the marker LEADS the description');
  assert.ok(detail.description.includes(chars.toLocaleString('en-US')),
    'the marker states the real total, not a rounded one');

  // ⚠️ Placement is load-bearing, so it is asserted rather than assumed: aiboard renders the
  // description through `.replace(/^## Tasks[\s\S]*$/m, '')`, which DELETES everything from a
  // `## Tasks` heading onward. A trailing marker would vanish on any board that has one inside the
  // cap. This is what the owner's "say so on screen" requires — on screen, not merely in the payload.
  const asRendered = detail.description.replace(/^## Tasks[\s\S]*$/m, '');
  assert.ok(asRendered.includes('truncated'),
    'the marker still renders after aiboard strips the ## Tasks section');

  // A board UNDER the cap is served whole, with no marker invented for it.
  const small = snap.sprints.find((s) => readFileSync(s.path, 'utf8').length <= 20000);
  if (small) {
    const d = reader.sprintDetail(small.id);
    assert.equal(d.description, readFileSync(small.path, 'utf8'));
    assert.ok(!d.description.includes('truncated'), 'an untruncated board claims no truncation');
  }
});

test('H3: an aiboard path that is a DIRECTORY is refused, naming all three ways', () => {
  // `existsSync` is true for a directory, so this resolved, the server started, and `/` then died
  // with an EISDIR 500 instead of the promised non-zero exit.
  assert.throws(() => resolveAiboard({ flag: tmpdir(), env: undefined, root: ROOT }),
    (e) => e.code === 'AIBOARD_UNRESOLVED'
      && /--aiboard[\s\S]*FKIT_AIBOARD[\s\S]*sibling default/.test(e.message),
    'a directory is not aiboard\'s index.html');
});

test('H4: a 500 names the error CLASS and never a filesystem path', async () => {
  const gone = join(tmpdir(), 'fkit-board-vanished-ui', 'index.html');
  const server = startServer({ root: ROOT, dashboard: DASHBOARD, aiboardPath: gone, port: 0 });
  await new Promise((r) => server.once('listening', r));
  try {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/`);
    assert.equal(r.status, 500);
    const body = await r.text();
    assert.ok(!body.includes(gone), 'the 500 must not echo the path it failed on');
    assert.ok(!body.includes(tmpdir()), 'nor any fragment of the filesystem');
    assert.match(body, /ENOENT/, 'the error CLASS is still reported, so a 500 stays diagnosable');
  } finally {
    await new Promise((r) => server.close(r));
  }
});

test('H5: an EMPTY brief field does not swallow the heading after it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-board-fields-'));
  try {
    for (const b of ['backlog', 'done', 'cancelled']) {
      mkdirSync(join(dir, 'ai-agents', 'tasks', b), { recursive: true });
    }
    mkdirSync(join(dir, 'ai-agents', 'sprints'), { recursive: true });
    mkdirSync(join(dir, 'ai-agents', 'tasks', 'backlog', '0001-empty-priority'), { recursive: true });
    // `## Priority` states nothing; `## Status` follows it immediately.
    writeFileSync(join(dir, 'ai-agents', 'tasks', 'backlog', '0001-empty-priority', 'brief.md'),
      '# A brief whose priority is blank\n\n## Priority\n\n## Status\n\u{1F504} In progress\n');

    const t = makeReader({ root: dir, dashboard: DASHBOARD }).snapshot().tasks[0];
    assert.equal(t.priority, '—', 'the empty field itself reads as absent');
    assert.equal(t.status, 'in-progress',
      'the heading AFTER an empty field must still be matched — it was being consumed as that '
      + 'field\'s value, so the task\'s real status vanished and it rendered as plain backlog');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('H6: the snapshot cache notices a task folder RELOCATED between boards', () => {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-board-move-'));
  try {
    for (const b of ['backlog', 'done', 'cancelled']) {
      mkdirSync(join(dir, 'ai-agents', 'tasks', b), { recursive: true });
    }
    mkdirSync(join(dir, 'ai-agents', 'sprints'), { recursive: true });
    const from = join(dir, 'ai-agents', 'tasks', 'backlog', '0001-a-task');
    const to = join(dir, 'ai-agents', 'tasks', 'done', '0001-a-task');
    mkdirSync(from, { recursive: true });
    writeFileSync(join(from, 'brief.md'), '# A task\n\n## Status\n\u{1F532} Backlog\n');

    const r = makeReader({ root: dir, dashboard: DASHBOARD });
    assert.equal(r.snapshot().tasks[0].status, 'backlog');

    // ⚠️ `renameSync` PRESERVES mtime, and the TOTAL folder count is unchanged by a move — which is
    // exactly why a total-plus-max-mtime key served the old board forever. Per-board counts see it.
    renameSync(from, to);
    assert.equal(r.snapshot().tasks[0].status, 'done',
      'a warm reader must not serve the old board after a close-and-move');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
