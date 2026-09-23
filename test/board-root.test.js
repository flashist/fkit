// The board reader's `--root` door — task 0412.
//
// SUBJECT: bin/fkit-board.mjs pointed at ANOTHER fkit-using project's ai-agents/ tree. 0411's contract
// (test/board-reader.test.js) is untouched and still pins everything about fkit's own tree; this file
// pins only what `--root` adds. The rule under test: TOOLS come from fkit's own checkout, DATA comes
// from `--root`.
//
//   R1 — no flag → the root resolves exactly as before (fkit's own tree), and no `--root` line prints.
//   R2 — `--root <fixture>` → the snapshot's tasks and boards are the fixture's, not fkit's.
//   R3 — a bad `--root` (missing, a file, half a tree, unreadable, empty, `--root=`, trailing, given twice)
//        → exit 2, the missing or unreadable piece named, no server started, never a fall-back to fkit's
//        own tree.
//   R4 — ⭐ a target carrying an OLD, markerless dashboard.sh: that copy is NEVER run; fkit's own is,
//        and the board's status is the one recognizer's answer, never `unresolved`. (R5 in the plan —
//        a relative dashboard path leaking into the target — is the same trap and is covered here.)
//   R6 — two board files mapping to one id are reported as `warnings` on /api/check; `ok` unaffected.
//   R7 — read-only proof on a foreign root: every file of the fixture is byte-identical after a full
//        snapshot, a burst of every GET route, and refused writes.
//   R8 — the startup banner names the tree being served, and says it came from `--root`.
//   R9 — the other TOOL stays home too: aiboard's sibling default sits next to fkit's checkout, never
//        next to the target; and a RELATIVE `--root` is resolved before anything reads it.
//
// ⚠️ ADR-014's testing law: `node --test`, zero devDependencies, black-box CLI where the claim is about
// the CLI. ⛔ Every fixture lives under os.tmpdir() — never a real sibling project, and no machine path
// is written into this file.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { REPO } from './harness.mjs';

import { findRoot, findDashboard, resolveRoot, startServer } from '../bin/fkit-board.mjs';

const READER = join(REPO, 'bin', 'fkit-board.mjs');
const HOME = findRoot(join(REPO, 'bin'));
const DASHBOARD = findDashboard(HOME);

// ── Fixtures ─────────────────────────────────────────────────────────────────────────────────────

// A small fkit-shaped tree: 3 tasks (two in backlog/, one in done/) and 2 boards (one open, one
// archived). `extraBoards` adds board files by sprints-relative path; `fakeDashboard` plants an old,
// marker-less `dashboard.sh` at the target's canonical `claude/` location. `dir` builds the tree at a
// chosen path instead of a fresh temp dir (so a test can control what sits BESIDE the project).
function makeFixture({ extraBoards = {}, fakeDashboard = false, dir } = {}) {
  if (dir) mkdirSync(dir, { recursive: true });
  else dir = mkdtempSync(join(tmpdir(), 'fkit-board-root-'));
  const t = join(dir, 'ai-agents', 'tasks');
  const s = join(dir, 'ai-agents', 'sprints');
  for (const b of ['backlog', 'done', 'cancelled']) mkdirSync(join(t, b), { recursive: true });
  mkdirSync(join(s, 'done'), { recursive: true });
  const brief = (board, folder, title, status) => {
    mkdirSync(join(t, board, folder));
    writeFileSync(join(t, board, folder, 'brief.md'),
      `# ${title}\n\n## Sprint\nSprint 1\n\n## Priority\nP2\n\n## Status\n${status}\n`);
  };
  brief('backlog', '0001-fixture-one', 'Fixture task one', '\u{1F532} Backlog');
  brief('backlog', '0002-fixture-two', 'Fixture task two', '\u{1F504} In progress');
  brief('done', '0003-fixture-three', 'Fixture task three', '✅ Done');
  writeFileSync(join(s, 'sprint-1.md'),
    '# Sprint 1 — a fixture board\n\n> ## \u{1F504} In progress — 2026-09-20.\n>\n> Body.\n');
  writeFileSync(join(s, 'done', 'sprint-0.md'), '# Sprint 0 — an archived fixture board\n');
  for (const [rel, text] of Object.entries(extraBoards)) writeFileSync(join(s, rel), text);
  if (fakeDashboard) {
    const d = join(dir, 'claude', 'skills', 'fkit-status');
    mkdirSync(d, { recursive: true });
    // v1-shaped: candidate lines, but NO v2 marker, and a status no real recognizer produces. If this
    // copy were ever run, the startup probe would refuse (exit 2) — which is what makes R4 discriminate.
    // ⚠️ It also leaves a SENTINEL beside itself. Refusal proves only "its answer is never used"; an
    // implementation that probed this copy first and fell back to fkit's own would pass that. The
    // sentinel is what proves "never RUN".
    writeFileSync(join(d, 'dashboard.sh'),
      '#!/usr/bin/env bash\ntouch "$(dirname "$0")/FAKE-DASHBOARD-RAN"\n'
      + 'echo \'candidate file="sprint-1.md" identity="Sprint 1" status="FAKE-V1"\'\n');
  }
  return dir;
}

const fakeRan = (fx) => existsSync(join(fx, 'claude', 'skills', 'fkit-status', 'FAKE-DASHBOARD-RAN'));

function stubUi() {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-board-root-ui-'));
  const file = join(dir, 'index.html');
  writeFileSync(file, '<!doctype html><title>stub</title>');
  return { file, dir };
}

const cli = (args) => spawnSync(process.execPath, [READER, ...args],
  { cwd: REPO, encoding: 'utf8', timeout: 20000, env: { ...process.env, FKIT_AIBOARD: '' } });

// Every file under `dir`, sorted, hashed with its relative path — so an edit, a new file, or a
// removed file all change the digest. Byte-level, unlike git status.
function treeHash(dir) {
  const files = [];
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(join(d, e.name), r);
      else files.push(r);
    }
  };
  walk(dir, '');
  files.sort();
  const h = createHash('sha256');
  for (const f of files) h.update(`${f}\0`).update(readFileSync(join(dir, f))).update('\0');
  return { digest: h.digest('hex'), files };
}

// Start the real CLI and resolve once its stdout matches `re`. Rejects on early exit or timeout.
function serveCli(args, re) {
  const child = spawn(process.execPath, [READER, ...args],
    { cwd: REPO, env: { ...process.env, FKIT_AIBOARD: '' } });
  let out = '';
  let err = '';
  const ready = new Promise((ok, fail) => {
    const timer = setTimeout(() => fail(new Error(`no banner in time; stdout=${out} stderr=${err}`)), 20000);
    child.stdout.on('data', (b) => {
      out += b;
      if (re.test(out)) { clearTimeout(timer); ok(out); }
    });
    child.stderr.on('data', (b) => { err += b; });
    child.on('exit', (code) => {
      clearTimeout(timer);
      fail(new Error(`exited ${code} before the banner; stderr=${err}`));
    });
  });
  const stop = () => new Promise((r) => {
    if (child.exitCode !== null || child.signalCode !== null) return r();
    child.once('exit', r);
    child.kill();
  });
  return { ready, stop };
}

// ── R1 — no flag: exactly as before ──────────────────────────────────────────────────────────────

test('R1: with no --root the root resolves exactly as before, and no --root line is printed', () => {
  assert.deepEqual(resolveRoot({ flag: undefined, home: HOME }), { path: HOME, how: 'default' });

  // A task is a `NNNN-` DIRECTORY holding a brief.md — the reader's own rule. Counting bare `NNNN-`
  // names would turn this red on a folder another agent has made but not yet written a brief into.
  const isTask = (p) => {
    try { return statSync(p).isDirectory() && statSync(join(p, 'brief.md')).isFile(); } catch { return false; }
  };
  let counted = 0;
  for (const board of ['backlog', 'done', 'cancelled']) {
    const dir = join(HOME, 'ai-agents', 'tasks', board);
    for (const name of readdirSync(dir)) {
      if (/^\d{4}-/.test(name) && isTask(join(dir, name))) counted++;
    }
  }
  const r = cli(['--bench']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, new RegExp(`^corpus: ${counted} tasks, `, 'm'),
    'no flag reads fkit\'s own tree, every task folder of it');
  assert.ok(!r.stdout.includes('(--root)'), 'no --root suffix without the flag');
  assert.ok(!/^ {2}tree /m.test(r.stdout), '--bench output without the flag is unchanged: no tree line');
});

// ── R2 — the fixture is what is read ─────────────────────────────────────────────────────────────

test('R2: --root <fixture> reads the fixture\'s tasks and boards, not fkit\'s', () => {
  const fx = makeFixture();
  try {
    const r = cli(['--bench', '--root', fx]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /^corpus: 3 tasks, 2 boards, /m, 'the fixture\'s 3 tasks and 2 boards');
    assert.match(r.stdout, /^ {2}tree .*\(--root\)$/m, '--bench says which tree it measured');
    assert.ok(r.stdout.includes(join(fx, 'ai-agents')), 'and names the fixture\'s tree');
  } finally {
    rmSync(fx, { recursive: true, force: true });
  }
});

// ── R3 — bad roots refuse, name the gap, start nothing ───────────────────────────────────────────

test('R3: a bad --root exits 2, names what is missing, starts nothing, and never falls back', () => {
  const base = mkdtempSync(join(tmpdir(), 'fkit-board-root-bad-'));
  const ui = stubUi();
  try {
    const file = join(base, 'a-file');
    writeFileSync(file, 'not a directory');
    const onlySprints = join(base, 'only-sprints');
    mkdirSync(join(onlySprints, 'ai-agents', 'sprints'), { recursive: true });
    const onlyTasks = join(base, 'only-tasks');
    mkdirSync(join(onlyTasks, 'ai-agents', 'tasks'), { recursive: true });
    const neither = join(base, 'neither');
    mkdirSync(neither);
    // `ai-agents/tasks` present, but as a FILE: exists, and still not a tree to read.
    const tasksFile = join(base, 'tasks-is-a-file');
    mkdirSync(join(tasksFile, 'ai-agents', 'sprints'), { recursive: true });
    writeFileSync(join(tasksFile, 'ai-agents', 'tasks'), 'not a directory');
    const good = makeFixture();

    // [argv tail, what stderr must name, what it must NOT name, resolveRoot flag or null]
    const cases = [
      [['--root', join(base, 'no-such-dir')], [/no such path/], [], join(base, 'no-such-dir')],
      [['--root', file], [/not a directory/], [], file],
      [['--root', onlySprints], [/ai-agents\/tasks\//], [/ai-agents\/sprints\/,|missing:.*sprints/], onlySprints],
      [['--root', onlyTasks], [/ai-agents\/sprints\//], [/missing:.*tasks/], onlyTasks],
      [['--root', neither], [/missing: ai-agents\/tasks\/, ai-agents\/sprints\//], [], neither],
      [['--root', tasksFile], [/missing: ai-agents\/tasks\//], [/missing:.*sprints/], tasksFile],
      [['--root', ''], [/empty string/], [], ''],
      [[`--root=${good}`], [/--root <path>/], [], null],
      [['--root'], [/needs a path/], [], null],
      // A second --root would otherwise be silently ignored — `arg()` reads only the first.
      [['--root', good, '--root', join(base, 'no-such-dir')], [/more than once/], [], null],
      [['--root', good, '--root'], [/more than once/], [], null],
    ];
    try {
      for (const [tail, must, mustNot, flag] of cases) {
        const r = cli(['--aiboard', ui.file, '--port', '0', ...tail]);
        const label = JSON.stringify(tail);
        assert.equal(r.status, 2, `${label}: exit 2 (stderr: ${r.stderr})`);
        for (const re of must) assert.match(r.stderr, re, `${label}: names the missing piece`);
        for (const re of mustNot) assert.doesNotMatch(r.stderr, re, `${label}: names only what is missing`);
        assert.match(r.stderr, /does not fall back to its own tree/, `${label}: says it will not fall back`);
        // spawnSync returning at all (no timeout) means no listener stayed up; no URL means none started.
        assert.equal(r.error, undefined, `${label}: the process ended by itself`);
        assert.ok(!r.stdout.includes('http://127.0.0.1'), `${label}: no server started`);
        if (flag !== null) {
          assert.throws(() => resolveRoot({ flag, home: HOME }), (e) => e.code === 'ROOT_UNRESOLVED',
            `${label}: the exported resolver refuses it too`);
        }
      }
    } finally {
      rmSync(good, { recursive: true, force: true });
    }
  } finally {
    rmSync(base, { recursive: true, force: true });
    rmSync(ui.dir, { recursive: true, force: true });
  }
});

// ── R3 — an UNREADABLE tree refuses too ──────────────────────────────────────────────────────────

// A directory that stats as one but cannot be listed: before the check, `ai-agents/tasks/` at mode 000
// served an EMPTY board silently (exit 0), and `tasks/backlog/` at mode 000 crashed `--bench` (a 500
// per poll when serving). ⚠️ chmod 000 does not block reads for root (or on some filesystems), so the
// test measures that first and skips cleanly rather than passing on a fixture that proves nothing.
test('R3: an unreadable --root tree exits 2, names the directory, and never falls back', (t) => {
  const cases = [
    ['ai-agents/tasks', /unreadable: ai-agents\/tasks\/ \(/],
    ['ai-agents/tasks/backlog', /unreadable: ai-agents\/tasks\/backlog\/ \(/],
    ['ai-agents/sprints/done', /unreadable: ai-agents\/sprints\/done\/ \(/],
  ];
  const ui = stubUi();
  try {
    for (const [rel, must] of cases) {
      const fx = makeFixture();
      const locked = join(fx, rel);
      try {
        chmodSync(locked, 0o000);
        let blocks = true;
        try { readdirSync(locked); blocks = false; } catch { /* the lock holds */ }
        if (!blocks) {
          t.skip('chmod 000 does not block reads here (running as root?)');
          return;
        }
        const r = cli(['--aiboard', ui.file, '--port', '0', '--root', fx]);
        const label = rel;
        assert.equal(r.status, 2, `${label}: exit 2 (stderr: ${r.stderr})`);
        assert.match(r.stderr, must, `${label}: names the unreadable directory`);
        assert.doesNotMatch(r.stderr, /missing:/, `${label}: nothing is missing, only unreadable`);
        assert.match(r.stderr, /does not fall back to its own tree/, `${label}: says it will not fall back`);
        assert.equal(r.error, undefined, `${label}: the process ended by itself`);
        assert.ok(!r.stdout.includes('http://127.0.0.1'), `${label}: no server started`);
        assert.throws(() => resolveRoot({ flag: fx, home: HOME }), (e) => e.code === 'ROOT_UNRESOLVED',
          `${label}: the exported resolver refuses it too`);
      } finally {
        chmodSync(locked, 0o755);
        rmSync(fx, { recursive: true, force: true });
      }
    }
  } finally {
    rmSync(ui.dir, { recursive: true, force: true });
  }
});

// ── R4 + R8 — the target's old dashboard.sh is never run; the banner names the tree ──────────────

test('R4/R8: a target\'s old markerless dashboard.sh is never run, and the banner names the tree', async () => {
  const fx = makeFixture({ fakeDashboard: true });
  const ui = stubUi();
  const fakePath = join(fx, 'claude', 'skills', 'fkit-status', 'dashboard.sh');
  try {
    // Discriminating: had the fixture's marker-less copy been used, the startup probe refuses → exit 2.
    const bench = cli(['--bench', '--root', fx]);
    assert.equal(bench.status, 0, `--bench must use fkit's own dashboard.sh (stderr: ${bench.stderr})`);
    assert.ok(!fakeRan(fx), '--bench never RAN the target\'s copy — not even as a probe before a fall-back');

    const srv = serveCli(['--root', fx, '--port', '0', '--aiboard', ui.file], /its own \/fkit-status/);
    try {
      const banner = await srv.ready;
      const statusLine = /^ {2}status +(.*)$/m.exec(banner)[1];
      assert.ok(statusLine.startsWith(DASHBOARD), 'the status line names fkit\'s OWN dashboard.sh');
      assert.ok(!statusLine.includes(fakePath), '...and not the target\'s copy');
      assert.match(statusLine, /fkit's own — the target's copy is not used/);
      assert.match(banner, /^ {2}note +this project carries its own dashboard\.sh; it is NOT used/m,
        'the note line appears because the target has a copy of its own');

      // R8 — the tree line names the fixture and says where it came from.
      const treeLine = /^ {2}tree +(.*)$/m.exec(banner)[1];
      assert.equal(treeLine, `${join(fx, 'ai-agents')}  (--root)`);

      const port = /http:\/\/127\.0\.0\.1:(\d+)\//.exec(banner)[1];
      const board = await (await fetch(`http://127.0.0.1:${port}/api/board`)).json();
      const open = board.sprints.find((s) => s.folder === 'sprint-1.md');
      const truth = spawnSync('bash', [DASHBOARD, 'status', join(fx, 'ai-agents', 'sprints', 'sprint-1.md')],
        { cwd: fx, encoding: 'utf8' }).stdout.trim();
      assert.equal(open.status, truth, 'the board reads the ONE recognizer\'s answer, byte for byte');
      assert.notEqual(open.status, 'unresolved', 'never silently unresolved');
      assert.notEqual(open.status, 'FAKE-V1', 'never the target\'s copy\'s answer');
      const check = await (await fetch(`http://127.0.0.1:${port}/api/check`)).json();
      assert.deepEqual(check, { ok: true, problems: [], warnings: [] });
      assert.ok(!fakeRan(fx), 'serving (startup probe + snapshot) never RAN the target\'s copy');
    } finally {
      await srv.stop();
    }

    // Without a copy of its own, the target gets no note line.
    const bare = makeFixture();
    const srv2 = serveCli(['--root', bare, '--port', '0', '--aiboard', ui.file], /^ {2}status .*\n/m);
    try {
      const banner = await srv2.ready;
      assert.ok(!/^ {2}note /m.test(banner), 'no note when the target carries no dashboard.sh');
    } finally {
      await srv2.stop();
      rmSync(bare, { recursive: true, force: true });
    }
  } finally {
    rmSync(fx, { recursive: true, force: true });
    rmSync(ui.dir, { recursive: true, force: true });
  }
});

// ── R9 — aiboard's default stays home; a relative --root is resolved ─────────────────────────────

// Start the real CLI and settle on EITHER its banner or its exit — whichever comes first — then stop
// it. Returns everything it printed. (Where it lands depends on whether this machine has an aiboard
// checkout beside fkit's; the test below holds either way.)
function runUntilBannerOrExit(args) {
  const child = spawn(process.execPath, [READER, ...args],
    { cwd: REPO, env: { ...process.env, FKIT_AIBOARD: '' } });
  let out = '';
  let err = '';
  return new Promise((ok, fail) => {
    const timer = setTimeout(() => { child.kill(); fail(new Error(`neither banner nor exit; stderr=${err}`)); }, 20000);
    const done = () => { clearTimeout(timer); ok({ out, err }); };
    child.stdout.on('data', (b) => {
      out += b;
      if (/^ {2}aiboard /m.test(out)) child.kill(); // the 'exit' handler below settles it
    });
    child.stderr.on('data', (b) => { err += b; });
    child.on('exit', done);
  });
}

test('R9: aiboard\'s sibling default is resolved beside fkit\'s checkout, never beside the target', async () => {
  // <base>/proj is the target; <base>/aiboard/... is a stub where a TARGET-anchored default would look.
  // Were the default anchored to the target, the reader would find this stub and serve it.
  const base = mkdtempSync(join(tmpdir(), 'fkit-board-root-sib-'));
  try {
    const fx = makeFixture({ dir: join(base, 'proj') });
    const targetSibling = join(base, 'aiboard', 'aiboard', 'web', 'index.html');
    mkdirSync(join(base, 'aiboard', 'aiboard', 'web'), { recursive: true });
    writeFileSync(targetSibling, '<!doctype html><title>target-side stub</title>');
    const homeSibling = resolve(HOME, '..', 'aiboard', 'aiboard', 'web', 'index.html');

    const { out, err } = await runUntilBannerOrExit(['--root', fx, '--port', '0']);
    const said = out + err;
    // Served (fkit's sibling exists here) → the banner names it; refused (it does not) → the error does.
    assert.ok(said.includes(homeSibling), `names fkit's sibling default (${homeSibling}): ${said}`);
    assert.ok(!said.includes(targetSibling), 'never the target\'s sibling');
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test('R9: a relative --root is resolved against where node runs, before anything reads it', () => {
  const fx = makeFixture();
  try {
    const rel = relative(REPO, fx);
    assert.ok(!rel.startsWith('/'), 'the path under test really is relative');
    const r = cli(['--bench', '--root', rel]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /^corpus: 3 tasks, 2 boards, /m);
    assert.equal(/^ {2}tree +(.*)$/m.exec(r.stdout)[1], `${join(fx, 'ai-agents')}  (--root)`,
      'the banner prints the RESOLVED tree');
  } finally {
    rmSync(fx, { recursive: true, force: true });
  }
});

// ── R6 — id collisions are warned about, not merged ──────────────────────────────────────────────

async function checkOf(root) {
  const ui = stubUi();
  const server = startServer({ root, dashboard: DASHBOARD, aiboardPath: ui.file, port: 0 });
  await new Promise((r) => server.once('listening', r));
  try {
    return await (await fetch(`http://127.0.0.1:${server.address().port}/api/check`)).json();
  } finally {
    await new Promise((r) => server.close(r));
    rmSync(ui.dir, { recursive: true, force: true });
  }
}

test('R6: two board files claiming one id are a warning on /api/check; ok is unaffected', async () => {
  // The shape seen on a real sibling project: `backlog.md` + `sprint-backlog.md`, both headed Backlog.
  // Plus an archived pair that both pad to S-004.
  const fx = makeFixture({
    extraBoards: {
      'backlog.md': '# Backlog\n\nBody.\n',
      'sprint-backlog.md': '# Backlog\n\nAnother body.\n',
      'done/sprint-4.md': '# Sprint 4\n',
      'done/sprint-04.md': '# Sprint 04\n',
    },
  });
  const clean = makeFixture();
  try {
    const check = await checkOf(fx);
    assert.equal(check.warnings.length, 2, JSON.stringify(check.warnings));
    const backlog = check.warnings.find((w) => w.includes('BACKLOG'));
    assert.ok(backlog && backlog.includes('backlog.md') && backlog.includes('sprint-backlog.md'),
      `names both backlog files: ${backlog}`);
    const s4 = check.warnings.find((w) => w.includes('S-004'));
    assert.ok(s4 && s4.includes('done/sprint-4.md') && s4.includes('done/sprint-04.md'),
      `names both archived files, sprints-relative: ${s4}`);
    for (const w of check.warnings) assert.ok(!w.includes(fx), 'a warning leaks no filesystem path');
    // The collision is not a failure to read sprint status, so `ok` keeps its meaning. Pinned to the
    // values this fixture yields — restating the server's own `ok` expression could never fail.
    assert.equal(check.ok, true, 'a collision does not flip ok');
    assert.deepEqual(check.problems, [], 'a collision adds nothing to problems, in any wording');

    assert.deepEqual((await checkOf(clean)).warnings, [], 'no collision, no warning');
  } finally {
    rmSync(fx, { recursive: true, force: true });
    rmSync(clean, { recursive: true, force: true });
  }
});

// ── R7 — read-only proof on a foreign root, byte-level ───────────────────────────────────────────

test('R7: a full crawl, a burst of every route and refused writes leave the fixture byte-identical', async () => {
  const fx = makeFixture({ fakeDashboard: true });
  const ui = stubUi();
  // ONE outer finally owns both temp dirs, so a red assertion anywhere — during the crawl or in the
  // byte comparison — still removes them. The server is closed first, then the tree is hashed.
  try {
    const before = treeHash(fx);
    const server = startServer({ root: fx, dashboard: DASHBOARD, aiboardPath: ui.file, port: 0 });
    await new Promise((r) => server.once('listening', r));
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      const board = await (await fetch(`${base}/api/board`)).json();
      assert.equal(board.tasks.length, 3);
      const routes = ['/', '/api/board', '/api/check',
        ...board.tasks.map((t) => `/api/tasks/${t.id}`),
        ...board.sprints.map((s) => `/api/sprints/${s.id}`)];
      for (let i = 0; i < 5; i++) {
        for (const p of routes) assert.equal((await fetch(base + p)).status, 200, `GET ${p}`);
      }
      for (const method of ['POST', 'PUT', 'DELETE']) {
        for (const p of routes) assert.equal((await fetch(base + p, { method })).status, 405, `${method} ${p}`);
      }
    } finally {
      await new Promise((r) => server.close(r));
    }
    const after = treeHash(fx);
    assert.deepEqual(after.files, before.files, 'no file was created or removed');
    assert.equal(after.digest, before.digest, 'every file is byte-identical');
  } finally {
    rmSync(ui.dir, { recursive: true, force: true });
    rmSync(fx, { recursive: true, force: true });
  }
});
