// The board reader's ids for ARCHIVED boards named `plan-sprint-N.md` — task 0415.
//
// SUBJECT: bin/fkit-board.mjs, the id an archived board (sprints/done/, sprints/cancelled/) gets from
// its FILE NAME. An open `plan-sprint-4.md` already resolves to `S-004` through dashboard.sh (its
// file-name rung accepts exactly one prefix, `plan-`, ADR-040 §3); before 0415 the same board, once
// archived, fell through to `S-plan-sprint-4` and every task naming Sprint 4 lost its board. 0411's
// contract (test/board-reader.test.js) and 0412's `--root` file (test/board-root.test.js) are
// untouched; this file pins only the archived-id mapping.
//
//   T1 — done/plan-sprint-4.md → S-004, status Done, its tasks attached, counts right.
//   T2 — done/plan-sprint-4b.md → S-4b: the non-numeric suffix stays UNPADDED, as boardId() does.
//   T3 — cancelled/plan-sprint-7.md → S-007 and cancelled/plan-sprint-7c.md → S-7c, status Cancelled.
//   T4 — the regression guard: sprint-N.md, backlog.md and non-sprint stems map exactly as before.
//        ⚠️ Green on the old reader AND the new one, by design (owner-approved). It goes red if the
//        prefix rule is opened (`.*sprint-`, `(word-)*sprint-`): `hotfix-post-sprint-2.md` has
//        `sprint-` mid-stem, the exact file dashboard.sh's plan_sprint_from_stem() says an open rule
//        "would claim". A merely UNANCHORED rule is not caught, and cannot be by any sane file name:
//        boardId() anchors on `Sprint` itself, so ids differ only for a stem that already starts with
//        `Sprint ` (a space in a file name).
//   T5 — an open sprint-4.md next to an archived done/plan-sprint-4.md now both claim S-004: that is a
//        WARNING on /api/check (0412's behaviour, unchanged), never a silent merge; `ok` unaffected.
//
// ⚠️ ADR-014's testing law: `node --test`, zero devDependencies. Black-box through the exported
// makeReader / startServer — boardIdFromFile stays private. ⛔ Every fixture lives under os.tmpdir():
// never a real sibling project, never fkit's own tree, and no machine path is written into this file.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

import { findRoot, findDashboard, makeReader, startServer } from '../bin/fkit-board.mjs';

const HOME = findRoot(join(REPO, 'bin'));
const DASHBOARD = findDashboard(HOME);

// ── Fixtures ─────────────────────────────────────────────────────────────────────────────────────

// A bare fkit-shaped tree. `tasks` is a list of [taskBoard, folder, sprintValue]; `boards` maps a
// sprints-relative path to its text. Sprint values are sibling-shaped (`Sprint 4 — note`), so the
// prose after the value is exercised too.
function makeTree({ tasks = [], boards = {} }) {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-board-archived-'));
  const t = join(dir, 'ai-agents', 'tasks');
  const s = join(dir, 'ai-agents', 'sprints');
  for (const b of ['backlog', 'done', 'cancelled']) mkdirSync(join(t, b), { recursive: true });
  for (const b of ['done', 'cancelled']) mkdirSync(join(s, b), { recursive: true });
  const statusOf = { backlog: '\u{1F532} Backlog', done: '✅ Done', cancelled: '❌ Cancelled' };
  for (const [board, folder, sprint] of tasks) {
    mkdirSync(join(t, board, folder));
    writeFileSync(join(t, board, folder, 'brief.md'),
      `# ${folder}\n\n## Sprint\n${sprint}\n\n## Priority\nP2\n\n## Status\n${statusOf[board]}\n`);
  }
  for (const [rel, text] of Object.entries(boards)) writeFileSync(join(s, rel), text);
  return dir;
}

const snapshotOf = (root) => makeReader({ root, dashboard: DASHBOARD }).snapshot();

// The board read from `folder` (a sprints-relative file name as the reader reports it).
function boardFrom(snap, folder, path) {
  const b = snap.sprints.find((x) => x.folder === folder && x.path.endsWith(path));
  assert.ok(b, `a board is read from ${path}`);
  return b;
}

async function checkOf(root) {
  const ui = mkdtempSync(join(tmpdir(), 'fkit-board-archived-ui-'));
  const file = join(ui, 'index.html');
  writeFileSync(file, '<!doctype html><title>stub</title>');
  const server = startServer({ root, dashboard: DASHBOARD, aiboardPath: file, port: 0 });
  await new Promise((r) => server.once('listening', r));
  try {
    return await (await fetch(`http://127.0.0.1:${server.address().port}/api/check`)).json();
  } finally {
    await new Promise((r) => server.close(r));
    rmSync(ui, { recursive: true, force: true });
  }
}

// ── T1 — an archived plan-sprint-N.md keeps the id it had while open ──────────────────────────────

test('T1: done/plan-sprint-4.md → S-004, Done, with its tasks attached', () => {
  const fx = makeTree({
    tasks: [
      ['done', '0101-four-a', 'Sprint 4 — note'],
      ['done', '0102-four-b', 'Sprint 4'],
      ['cancelled', '0103-four-c', 'Sprint 4 — dropped'],
      ['backlog', '0104-elsewhere', 'Backlog'],
    ],
    boards: { 'done/plan-sprint-4.md': '# Fixture — Sprint 4 — a closed board\n' },
  });
  try {
    const snap = snapshotOf(fx);
    const b = boardFrom(snap, 'plan-sprint-4.md', join('done', 'plan-sprint-4.md'));
    assert.equal(b.id, 'S-004', 'an archived plan-sprint-4.md takes the open-board id S-004');
    assert.equal(b.status, 'Done');
    assert.deepEqual([...b.tasks].sort(), ['0101', '0102', '0103'], 'every Sprint 4 task is attached');
    assert.equal(b.progress.total, 3);
    assert.equal(b.progress.counts.done, 2);
    assert.equal(b.progress.counts.cancelled, 1);
    for (const id of ['0101', '0102', '0103']) {
      assert.equal(snap.tasks.find((t) => t.id === id).sprint, 'S-004');
    }
  } finally {
    rmSync(fx, { recursive: true, force: true });
  }
});

// ── T2 — a lettered suffix stays unpadded ─────────────────────────────────────────────────────────

test('T2: done/plan-sprint-4b.md → S-4b (suffix unpadded), with its tasks attached', () => {
  const fx = makeTree({
    tasks: [
      ['done', '0201-fourb-a', 'Sprint 4b — note'],
      ['done', '0202-four', 'Sprint 4'],
    ],
    boards: {
      'done/plan-sprint-4b.md': '# Fixture — Sprint 4b\n',
      'done/plan-sprint-4.md': '# Fixture — Sprint 4\n',
    },
  });
  try {
    const snap = snapshotOf(fx);
    const b = boardFrom(snap, 'plan-sprint-4b.md', join('done', 'plan-sprint-4b.md'));
    assert.equal(b.id, 'S-4b', 'Sprint 4b is not Sprint 4: the suffix passes through unpadded');
    assert.deepEqual(b.tasks, ['0201']);
    const four = boardFrom(snap, 'plan-sprint-4.md', join('done', 'plan-sprint-4.md'));
    assert.deepEqual(four.tasks, ['0202'], 'S-004 and S-4b do not share tasks');
  } finally {
    rmSync(fx, { recursive: true, force: true });
  }
});

// ── T3 — the same mapping in sprints/cancelled/ ───────────────────────────────────────────────────

test('T3: cancelled/plan-sprint-7.md → S-007 and cancelled/plan-sprint-7c.md → S-7c, Cancelled', () => {
  const fx = makeTree({
    tasks: [
      ['cancelled', '0301-seven', 'Sprint 7 — note'],
      ['cancelled', '0302-sevenc', 'Sprint 7c'],
    ],
    boards: {
      'cancelled/plan-sprint-7.md': '# Fixture — Sprint 7\n',
      'cancelled/plan-sprint-7c.md': '# Fixture — Sprint 7c\n',
    },
  });
  try {
    const snap = snapshotOf(fx);
    const seven = boardFrom(snap, 'plan-sprint-7.md', join('cancelled', 'plan-sprint-7.md'));
    assert.equal(seven.id, 'S-007');
    assert.equal(seven.status, 'Cancelled');
    assert.deepEqual(seven.tasks, ['0301']);
    const sevenC = boardFrom(snap, 'plan-sprint-7c.md', join('cancelled', 'plan-sprint-7c.md'));
    assert.equal(sevenC.id, 'S-7c');
    assert.equal(sevenC.status, 'Cancelled');
    assert.deepEqual(sevenC.tasks, ['0302']);
  } finally {
    rmSync(fx, { recursive: true, force: true });
  }
});

// ── T4 — the regression guard: everything else maps exactly as before ─────────────────────────────

test('T4: sprint-N.md, backlog.md and non-sprint stems keep their ids (green before and after)', () => {
  const fx = makeTree({
    tasks: [['done', '0401-three', 'Sprint 3 — note']],
    boards: {
      'done/sprint-3.md': '# Fixture — Sprint 3\n',
      'done/backlog.md': '# Backlog\n',
      'done/plan-index.md': '# Fixture — an index of plans\n',
      'done/hotfix-post-sprint2.md': '# Fixture — a hotfix board\n',
      'done/hotfix-post-sprint-2.md': '# Fixture — a hotfix board, hyphenated\n',
    },
  });
  try {
    const snap = snapshotOf(fx);
    const ids = Object.fromEntries(snap.sprints.map((b) => [b.folder, b.id]));
    assert.deepEqual(ids, {
      'sprint-3.md': 'S-003',
      'backlog.md': 'BACKLOG',
      // ⚠️ `plan-` is only stripped when `sprint-` follows it: any other stem keeps S-<stem>.
      'plan-index.md': 'S-plan-index',
      'hotfix-post-sprint2.md': 'S-hotfix-post-sprint2',
      // ⚠️ `sprint-` mid-stem is not a sprint board: only a LEADING (plan-)sprint- is (0415 review R1).
      'hotfix-post-sprint-2.md': 'S-hotfix-post-sprint-2',
    });
    assert.deepEqual(boardFrom(snap, 'sprint-3.md', join('done', 'sprint-3.md')).tasks, ['0401']);
  } finally {
    rmSync(fx, { recursive: true, force: true });
  }
});

// ── T5 — a new shared id is warned about, never merged ────────────────────────────────────────────

test('T5: open sprint-4.md + done/plan-sprint-4.md both claiming S-004 is a warning; ok is unaffected', async () => {
  const fx = makeTree({
    tasks: [['backlog', '0501-four', 'Sprint 4 — note']],
    boards: {
      'sprint-4.md': '# Fixture — Sprint 4 — an open board\n\n> ## \u{1F504} In progress — 2026-09-26.\n>\n> Body.\n',
      'done/plan-sprint-4.md': '# Fixture — Sprint 4 — a closed board\n',
    },
  });
  const clean = makeTree({
    tasks: [['done', '0502-four', 'Sprint 4']],
    boards: {
      'done/plan-sprint-4.md': '# Fixture — Sprint 4\n',
      'done/plan-sprint-4b.md': '# Fixture — Sprint 4b\n',
      'cancelled/plan-sprint-5.md': '# Fixture — Sprint 5\n',
    },
  });
  try {
    const check = await checkOf(fx);
    assert.equal(check.ok, true, 'a shared id never flips ok');
    assert.deepEqual(check.problems, []);
    const hits = check.warnings.filter((w) => w.includes('board id S-004 '));
    assert.equal(hits.length, 1, `one S-004 warning; got ${JSON.stringify(check.warnings)}`);
    assert.match(hits[0], /sprint-4\.md, done\/plan-sprint-4\.md/, 'the warning names both files');
    assert.deepEqual((await checkOf(clean)).warnings, [],
      'archived plan-sprint-N boards with distinct ids raise no warning');
  } finally {
    rmSync(fx, { recursive: true, force: true });
    rmSync(clean, { recursive: true, force: true });
  }
});
