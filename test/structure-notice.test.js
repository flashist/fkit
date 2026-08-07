// The launch-time structure-notice suite — the structure_notice() pass in claude/fkit-claude.sh
// (task 0247, unit 6 of the 0241 design; ADR-039 / the owner's Q3 "Yes + yes" ruling).
//
// SCOPE: the launcher's own contract, tested through the standard harness (stubbed claude/codex/
// curl, fixture projects under os.tmpdir(), zero repo writes). The notice pass runs BEFORE the
// FKIT_SETUP_ONLY exit — deliberately, which is what lets every case here drive it with
// FKIT_SETUP_ONLY=1 and never exec a session.
//
// THE CONTRACT UNDER TEST (the launcher's structure_notice comment block is the authority):
//   * conforming project → COMPLETE silence (init's output-trap rule: the happy path runs on every
//     launch of every project forever);
//   * any check.sh exit-1-set row → exactly ONE stderr line, never stdout, never a write, never a
//     state file;
//   * ai-agents/.fkit-accepted-drift suppresses per path (subtree-covering, keep-out parser
//     semantics), and its failure direction is INVERTED from keep-out: an unreadable / symlinked /
//     directory intent file suppresses NOTHING — the notice prints (failing closed here means
//     don't silence);
//   * every notice-pass failure is non-fatal to the launch (the launcher runs set -eu; a notice
//     failure must never cost the session).
//
// ⚠️ ZERO-MUTATION SWEEPS ARE LOAD-BEARING (brief verification 2): the launch path is read-only
// toward the project (ADR-015 unchanged, task 0242). The before/after tree snapshot is what turns
// "read-only" from prose into a red bar.
//
// ⚠️ PROVE-RED: mutation 15 in test/prove-red.sh removes the structure_notice call from a COPIED
// launcher and requires the '0247/drifted' test below to go red by name. This change is launcher
// code — squarely ADR-026 prove-red scope (unlike check.sh itself, whose 0245 suite recorded the
// opposite as a stated assumption).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync, writeFileSync, appendFileSync, mkdirSync, readFileSync, readdirSync, readlinkSync,
  renameSync, rmSync, cpSync, symlinkSync, chmodSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { REPO, makeProject, runFkit, cleanup, cleanupStub } from './harness.mjs';

// The notice line's contract properties: one line, stderr, a count, the named paths, the pointer at
// /fkit-heal, the nothing-was-changed statement. Exact wording is polishable; these anchors are not.
const NOTICE =
  /^⚠ fkit: (\d+) path\(s\) diverge from what the installed fkit version ships \((.*)\) — run \/fkit-heal in a producer session to see and repair; nothing was changed\. Deliberate\? List the path in ai-agents\/\.fkit-accepted-drift\.$/;

const asRoot = process.getuid?.() === 0 ? 'runs as root; permission bits do not apply' : false;

const MADE = [];
after(() => { MADE.forEach(cleanup); cleanupStub(); });

function project(opts) {
  const dir = makeProject(opts);
  MADE.push(dir);
  return dir;
}

// One setup-only launch — the notice fires before the FKIT_SETUP_ONLY exit.
function launch(dir, extraEnv = {}) {
  return runFkit(['coder'], { project: dir, extraEnv: { FKIT_SETUP_ONLY: '1', ...extraEnv } });
}

function noticeLines(stderr) {
  return stderr.split('\n').filter((l) => NOTICE.test(l));
}

// Deterministic full-tree snapshot — names, types, symlink targets, content hashes (the
// structure-check.test.js pattern). Equal snapshots before and after a launch prove the notice pass
// wrote nothing — and, taken over the WHOLE project dir, that no state file appeared anywhere.
function snapshot(dir) {
  const out = [];
  const walk = (rel) => {
    for (const e of readdirSync(join(dir, rel), { withFileTypes: true })
      .sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      const p = join(dir, r);
      if (e.isSymbolicLink()) { out.push(`${r} -> ${readlinkSync(p)}`); continue; }
      if (e.isDirectory()) { out.push(`${r}/`); walk(r); continue; }
      let h;
      try { h = createHash('sha256').update(readFileSync(p)).digest('hex'); } catch { h = '<unreadable>'; }
      out.push(`${r} ${h}`);
    }
  };
  walk('');
  return out.join('\n');
}

// A drifted conventions file: owner-edited under check.sh (matches no shipped version). The Q1
// ruling stands behind this fixture: ALL exit-1 outcomes fire the notice, owner-edited included —
// the intent file is the designed remedy, not a carve-out.
const CONVENTIONS = 'ai-agents/knowledge-base/conventions';
function drift(dir, rel) {
  appendFileSync(join(dir, rel), '\nlocal owner drift — task 0247 fixture\n');
}

// ── 1. conforming → silence ────────────────────────────────────────────────────────────────────

test('conforming fixture: complete silence — no notice on stderr, nothing on stdout', async () => {
  const dir = project();
  const r = await launch(dir);
  assert.equal(r.code, 0);
  assert.equal(noticeLines(r.stderr).length, 0, `unexpected notice:\n${r.stderr}`);
  assert.ok(!r.stderr.includes('diverge'), `stderr mentions divergence:\n${r.stderr}`);
  assert.ok(!r.stdout.includes('diverge'), `stdout mentions divergence:\n${r.stdout}`);
});

// ── 2. drifted → one stderr line, zero writes (prove-red mutation 15's NAMED target) ───────────

test('0247/drifted: one notice line on stderr, nothing on stdout, zero writes', async () => {
  const dir = project();
  drift(dir, `${CONVENTIONS}/task-status-vocabulary.md`);
  const before = snapshot(dir);
  const r = await launch(dir);
  assert.equal(r.code, 0);
  const lines = noticeLines(r.stderr);
  assert.equal(lines.length, 1, `expected exactly one notice line, stderr:\n${r.stderr}`);
  // EXACTLY one stderr line in total: on a healthy, already-set-up project nothing else prints.
  assert.equal(r.stderr.trim(), lines[0]);
  const [, count, names] = lines[0].match(NOTICE);
  assert.equal(count, '1');
  assert.equal(names, `${CONVENTIONS}/task-status-vocabulary.md`);
  assert.ok(!r.stdout.includes('diverge'), `notice leaked to stdout:\n${r.stdout}`);
  assert.equal(snapshot(dir), before, 'the notice pass modified the project tree');
});

// ── 3. fix the drift → silence returns, and no state file recorded anything ────────────────────

test('fixed drift: silence returns; the launch left no state file anywhere', async () => {
  const dir = project();
  const rel = `${CONVENTIONS}/task-status-vocabulary.md`;
  drift(dir, rel);
  const drifted = await launch(dir);
  assert.equal(noticeLines(drifted.stderr).length, 1, 'fixture did not drift');
  // Fix: restore the shipped bytes from the scaffold.
  cpSync(join(REPO, 'claude', 'scaffold', rel), join(dir, rel));
  const before = snapshot(dir);
  const r = await launch(dir);
  assert.equal(r.code, 0);
  assert.equal(noticeLines(r.stderr).length, 0, `notice did not stop:\n${r.stderr}`);
  // No memory: the whole-project snapshot (dot-dirs included) is unchanged — no stamp, no cursor,
  // no .fkit/ state, nothing new anywhere.
  assert.equal(snapshot(dir), before, 'the launch recorded state somewhere in the project');
});

// ── 4. per-path intent-file scope ──────────────────────────────────────────────────────────────

test('intent file: entry suppresses only its own path; both entries → silence', async () => {
  const dir = project();
  const a = `${CONVENTIONS}/task-status-vocabulary.md`;
  const b = `${CONVENTIONS}/evidence-before-assertion.md`;
  drift(dir, a);
  drift(dir, b);
  const both = await launch(dir);
  const bothLines = noticeLines(both.stderr);
  assert.equal(bothLines.length, 1, `expected one notice line:\n${both.stderr}`);
  assert.equal(bothLines[0].match(NOTICE)[1], '2');

  // Entry for A only — comments, blanks, CRLF, leading ./ all exercised (keep-out parser semantics).
  const intent = join(dir, 'ai-agents', '.fkit-accepted-drift');
  writeFileSync(intent, `# accepted drift — fixture\r\n\r\n./${a}\r\n`);
  const onlyB = await launch(dir);
  const lines = noticeLines(onlyB.stderr);
  assert.equal(lines.length, 1);
  const [, count, names] = lines[0].match(NOTICE);
  assert.equal(count, '1', 'entry for A did not suppress A');
  assert.equal(names, b, 'the remaining notice should name only B');

  // Both entries → silence.
  appendFileSync(intent, `${b}\n`);
  const silent = await launch(dir);
  assert.equal(noticeLines(silent.stderr).length, 0, `both entries should silence:\n${silent.stderr}`);
});

test('intent file: a subtree entry covers a child path', async () => {
  const dir = project();
  drift(dir, `${CONVENTIONS}/task-status-vocabulary.md`);
  writeFileSync(join(dir, 'ai-agents', '.fkit-accepted-drift'), `${CONVENTIONS}/\n`);
  const r = await launch(dir);
  assert.equal(r.code, 0);
  assert.equal(noticeLines(r.stderr).length, 0, `subtree entry did not cover the child:\n${r.stderr}`);
});

// ── 5. safety bar ──────────────────────────────────────────────────────────────────────────────

test('symlinked ai-agents/: launch completes, notice prints, intent file NOT read through the link', async () => {
  const dir = project();
  const stash = mkdtempSync(join(tmpdir(), 'fkit-notice-stash-'));
  MADE.push(stash);
  renameSync(join(dir, 'ai-agents'), join(stash, 'ai-agents'));
  symlinkSync(join(stash, 'ai-agents'), join(dir, 'ai-agents'));
  // An intent file reachable ONLY through the symlink, claiming the whole tree is accepted. If the
  // notice pass probed through the link it would go silent; it must not (fkit never probes through
  // symlinks — the -L-first refusal is check.sh's own, pinned in its suite; this asserts the notice
  // pass added no probe of its own).
  writeFileSync(join(stash, 'ai-agents', '.fkit-accepted-drift'), 'ai-agents\n');
  const r = await launch(dir);
  assert.equal(r.code, 0, `launch died on a symlinked ai-agents/:\n${r.stderr}`);
  const lines = noticeLines(r.stderr);
  assert.equal(lines.length, 1, `refused-symlink rows should notice:\n${r.stderr}`);
  assert.ok(lines[0].includes('ai-agents'), 'the notice should name the refused tree');
});

test('share cannot run the check (spec removed, exit 2): launch continues, silence', () => {
  // A COPIED claude/ tree with the spec deleted — never the repo's own. Setup-only runs need no
  // claude/codex stub (the launcher exits before the preflight and the exec).
  const shareRoot = mkdtempSync(join(tmpdir(), 'fkit-notice-noshare-'));
  MADE.push(shareRoot);
  cpSync(join(REPO, 'claude'), join(shareRoot, 'claude'), { recursive: true });
  rmSync(join(shareRoot, 'claude', 'structure-spec.md'));
  const dir = project();
  drift(dir, `${CONVENTIONS}/task-status-vocabulary.md`);   // would notice, if the check could run
  const r = spawnSync('/bin/sh', [join(shareRoot, 'claude', 'fkit-claude.sh'), 'coder'], {
    cwd: dir,
    env: {
      ...process.env,
      FKIT_SETUP_ONLY: '1', FKIT_NO_SELF_HOST: '1', FKIT_NO_UPDATE_CHECK: '1',
    },
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, `launch died when the check could not run:\n${r.stderr}`);
  assert.equal(noticeLines(r.stderr || '').length, 0, `exit-2 must be silence:\n${r.stderr}`);
});

test('fail-closed keep-out (unreadable): silence when the root files conform', { skip: asRoot }, async () => {
  const dir = project();
  const ko = join(dir, 'ai-agents', '.fkit-keep-out');
  writeFileSync(ko, 'probe\n');
  chmodSync(ko, 0o000);
  const r = await launch(dir);
  chmodSync(ko, 0o644);                       // so cleanup can remove it
  assert.equal(r.code, 0, `launch died on the fail-closed keep-out path:\n${r.stderr}`);
  // check.sh exits 1 here (ko_refused) with NO ai-agents rows — keyed off rows, the notice stays
  // silent. This is the case that proves exit-code keying would be wrong.
  assert.equal(noticeLines(r.stderr).length, 0, `fail-closed keep-out must not notice:\n${r.stderr}`);
});

test('symlinked or directory intent file: ignored — nothing suppressed, notice still prints', async () => {
  const dir = project();
  const rel = `${CONVENTIONS}/task-status-vocabulary.md`;
  drift(dir, rel);
  const intent = join(dir, 'ai-agents', '.fkit-accepted-drift');

  // Symlink to a real file that would suppress the drifted path — must be ignored.
  const target = join(dir, 'ai-agents', 'accepted-drift-target');
  writeFileSync(target, `${rel}\n`);
  symlinkSync(target, intent);
  const viaLink = await launch(dir);
  assert.equal(viaLink.code, 0);
  assert.equal(noticeLines(viaLink.stderr).length, 1, `a symlinked intent file must suppress nothing:\n${viaLink.stderr}`);
  rmSync(intent);
  rmSync(target);

  // A directory at the intent path — must be ignored, launch non-fatal.
  mkdirSync(intent);
  const viaDir = await launch(dir);
  assert.equal(viaDir.code, 0);
  assert.equal(noticeLines(viaDir.stderr).length, 1, `a directory intent path must suppress nothing:\n${viaDir.stderr}`);
});

test('unreadable intent file: ignored — nothing suppressed, notice still prints', { skip: asRoot }, async () => {
  const dir = project();
  const rel = `${CONVENTIONS}/task-status-vocabulary.md`;
  drift(dir, rel);
  const intent = join(dir, 'ai-agents', '.fkit-accepted-drift');
  writeFileSync(intent, `${rel}\n`);
  chmodSync(intent, 0o000);
  const r = await launch(dir);
  chmodSync(intent, 0o644);                   // so cleanup can remove it
  assert.equal(r.code, 0);
  assert.equal(noticeLines(r.stderr).length, 1, `an unreadable intent file must suppress nothing:\n${r.stderr}`);
});

test('R1: latin-1 bytes in the intent file — suppression still works, notice prints, no awk noise', async () => {
  const dir = project();
  const a = `${CONVENTIONS}/task-status-vocabulary.md`;
  const b = `${CONVENTIONS}/evidence-before-assertion.md`;
  drift(dir, a);
  drift(dir, b);
  // A Latin-1 comment (0xE9 — é in Latin-1, invalid as UTF-8) alongside a valid entry for A. macOS
  // awk under a UTF-8 locale dies on those bytes ("towc: multibyte conversion failure", exit 2) —
  // pre-fix that silenced the WHOLE notice (hidden drift, the inverted failure direction) and
  // leaked awk's multi-line error text to the launcher's stderr.
  writeFileSync(join(dir, 'ai-agents', '.fkit-accepted-drift'), Buffer.concat([
    Buffer.from('# caf'), Buffer.from([0xe9]), Buffer.from(` latin-1 comment\n${a}\n`),
  ]));
  const r = await launch(dir);
  assert.equal(r.code, 0);
  const lines = noticeLines(r.stderr);
  assert.equal(lines.length, 1, `invalid-UTF-8 intent file must not silence the notice:\n${r.stderr}`);
  const [, count, names] = lines[0].match(NOTICE);
  assert.equal(count, '1', 'the valid entry beside the latin-1 comment must still suppress A');
  assert.equal(names, b, 'the remaining notice should name only B');
  // stderr clean of awk noise: the notice is the ONLY line, and no awk error text anywhere.
  assert.equal(r.stderr.trim(), lines[0], `awk noise leaked to stderr:\n${r.stderr}`);
  assert.ok(!/towc|awk/.test(r.stderr), `awk error text on stderr:\n${r.stderr}`);
});

test('R2: CR handling matches the keep-out template — all CRs stripped, not just one trailing', async () => {
  const dir = project();
  const a = `${CONVENTIONS}/task-status-vocabulary.md`;
  drift(dir, a);
  drift(dir, 'CLAUDE.md');
  // keep-out's parser does `tr -d '\r'` — ALL CRs, wherever they sit. A doubled trailing CR and an
  // embedded CR must both still suppress. (Pre-fix this failed in the SAFE direction — an extra
  // notice line, never hidden drift.)
  writeFileSync(join(dir, 'ai-agents', '.fkit-accepted-drift'), `${a}\r\r\nCLA\rUDE.md\n`);
  const r = await launch(dir);
  assert.equal(r.code, 0);
  assert.equal(noticeLines(r.stderr).length, 0,
    `CR-variant entries must suppress per the keep-out template:\n${r.stderr}`);
});

test('kept-out rows never trigger the notice', async () => {
  const dir = project();
  // Keep-out is ai-agents-relative (its own file's contract — different from the intent file's
  // project-root-relative form, and the reason they are two files).
  writeFileSync(join(dir, 'ai-agents', '.fkit-keep-out'), 'wiki-vault\n');
  rmSync(join(dir, 'ai-agents', 'wiki-vault'), { recursive: true });
  const r = await launch(dir);
  assert.equal(r.code, 0);
  assert.equal(noticeLines(r.stderr).length, 0, `kept-out rows must be silent:\n${r.stderr}`);
});

// ── notice arithmetic: first 3 named, then +N more ─────────────────────────────────────────────

test('more than three drifted paths: first three named, then +N more', async () => {
  const dir = project();
  const drifted = [
    'ai-agents/README.md',
    `${CONVENTIONS}/README.md`,
    `${CONVENTIONS}/evidence-before-assertion.md`,
    `${CONVENTIONS}/task-status-vocabulary.md`,
    'CLAUDE.md',
  ];
  drifted.forEach((rel) => drift(dir, rel));
  const r = await launch(dir);
  const lines = noticeLines(r.stderr);
  assert.equal(lines.length, 1);
  const [, count, names] = lines[0].match(NOTICE);
  assert.equal(count, '5');
  assert.equal(names.split(', ').length, 3);               // exactly three paths are named
  assert.ok(names.endsWith(' +2 more'), `expected a +2 more tail, got: ${names}`);
});
