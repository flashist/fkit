// The launcher's agents fail-safe (task 0334): when setup failed, a session starts only on an agent
// file it can actually use — a readable, regular .claude/agents/fkit-*.md with no symlink on the way.
//
// SCOPE: the `agents_usable` check and the guard that calls it in claude/fkit-claude.sh. The guard
// runs only when setup FAILED, and real init succeeds (rc 0) for a symlinked .claude or agents dir —
// so every case here runs a COPY of the launcher's tree whose init is a stub that exits
// $FKIT_STUB_INIT_RC (default 1). The copy is taken from dirname(LAUNCHER), so an FKIT_LAUNCHER
// redirect is honoured.
//
// ⚠️ PATHS ARE CANONICAL: every fixture dir is realpathSync'd at creation, because the launcher's
// `proj` is $PWD — physical here (macOS: /var → /private/var). Assertions use that form exactly.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync, writeFileSync, mkdirSync, rmSync, cpSync, symlinkSync, chmodSync, realpathSync,
  lstatSync, readdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { LAUNCHER, runFkit, cleanup, cleanupStub } from './harness.mjs';

const HEADLINE = '⚠ fkit found nothing here it can launch as an agent, so there is no session to start:';
const OLD_LINE_1 = '⚠ fkit has no agents installed here, so there is no session to start.';
const oldLine2 = (proj) => `  Setup could not write to the project — check that ${proj} is writable, then: fkit`;
const SETUP_FAILED = '⚠ fkit could not finish setting up this project.';

const asRoot = process.getuid?.() === 0 ? 'runs as root; permission bits do not apply' : false;

const MADE = [];
let launcherCopy;

before(() => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'fkit-0334-tree-')));
  MADE.push(root);
  cpSync(dirname(LAUNCHER), join(root, 'claude'), { recursive: true });
  const init = join(root, 'claude', 'fkit-claude-init.sh');
  rmSync(init, { force: true });
  writeFileSync(init, '#!/bin/sh\nexit "${FKIT_STUB_INIT_RC:-1}"\n');
  chmodSync(init, 0o755);
  launcherCopy = join(root, 'claude', 'fkit-claude.sh');
});

after(() => { MADE.forEach(cleanup); cleanupStub(); });

function tmp(prefix) {
  const d = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  MADE.push(d);
  return d;
}

// A non-fresh project with a real .claude/agents/ — each test then shapes what is inside it.
function project() {
  const d = tmp('fkit-0334-proj-');
  const pm = join(d, 'ai-agents', 'knowledge-base', 'PROJECT.md');
  mkdirSync(dirname(pm), { recursive: true });
  writeFileSync(pm, '# Agents Guard Test Project\n\nAn initiated project used by the suite.\n');
  return d;
}

function agentFile(path) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, '---\nname: fkit-coder\n---\nA stub agent.\n');
}

function launch(proj, extraEnv = {}) {
  return runFkit(['coder'], { project: proj, launcher: launcherCopy, extraEnv });
}

function assertRefused(r, path, why) {
  assert.equal(r.exec, false, `claude must not be exec'd; stderr:\n${r.stderr}`);
  assert.equal(r.code, 1, `exit 1 expected; stderr:\n${r.stderr}`);
  assert.ok(r.stderr.includes(HEADLINE), `the refusal headline is missing; stderr:\n${r.stderr}`);
  assert.ok(r.stderr.includes(`    ${path} — ${why}`), `"${path} — ${why}" not named; stderr:\n${r.stderr}`);
  assert.ok(!r.stderr.includes('is writable'), `a non-permission cause must not blame writability:\n${r.stderr}`);
}

function assertLaunched(r) {
  assert.equal(r.exec, true, `claude should have been exec'd; code ${r.code}, stderr:\n${r.stderr}`);
  assert.deepEqual(r.argv.slice(0, 3), ['--agent', 'fkit-coder', '--settings']);
  assert.ok(!r.stderr.includes(HEADLINE), `no refusal expected; stderr:\n${r.stderr}`);
}

function hasSymlink(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = lstatSync(p);
    if (st.isSymbolicLink()) return true;
    if (st.isDirectory() && hasSymlink(p)) return true;
  }
  return false;
}

test('0334/A: a symlinked .claude refuses, naming it', async () => {
  const proj = project();
  const out = tmp('fkit-0334-out-');
  agentFile(join(out, 'agents', 'fkit-coder.md'));
  symlinkSync(out, join(proj, '.claude'));
  assertRefused(await launch(proj), join(proj, '.claude'),
    'a symlink; fkit will not read agents through one');
});

test('0334/B: a symlinked .claude/agents refuses, naming it', async () => {
  const proj = project();
  const out = tmp('fkit-0334-out-');
  agentFile(join(out, 'fkit-coder.md'));
  mkdirSync(join(proj, '.claude'));
  symlinkSync(out, join(proj, '.claude', 'agents'));
  assertRefused(await launch(proj), join(proj, '.claude', 'agents'),
    'a symlink; fkit will not read agents through one');
});

test('0334/C: an agent file that is a symlink to an outside file refuses, naming it', async () => {
  const proj = project();
  const out = tmp('fkit-0334-out-');
  agentFile(join(out, 'fkit-coder.md'));
  mkdirSync(join(proj, '.claude', 'agents'), { recursive: true });
  const leaf = join(proj, '.claude', 'agents', 'fkit-coder.md');
  symlinkSync(join(out, 'fkit-coder.md'), leaf);
  assertRefused(await launch(proj), leaf, 'a symlink; fkit will not read an agent through one');
});

test('0334/E: a dangling agent symlink refuses, naming it', async () => {
  const proj = project();
  const out = tmp('fkit-0334-out-');
  mkdirSync(join(proj, '.claude', 'agents'), { recursive: true });
  const leaf = join(proj, '.claude', 'agents', 'fkit-coder.md');
  symlinkSync(join(out, 'gone.md'), leaf);
  assertRefused(await launch(proj), leaf, 'a symlink to something that does not exist');
});

test('0334/F+D: a directory named fkit-x.md refuses with the new message; an empty agents dir keeps today\'s', async () => {
  const projD = project();
  mkdirSync(join(projD, '.claude', 'agents'), { recursive: true });
  const rD = await launch(projD);
  assert.equal(rD.exec, false, `D: claude must not be exec'd; stderr:\n${rD.stderr}`);
  assert.equal(rD.code, 1, `D: exit 1 expected; stderr:\n${rD.stderr}`);
  const lines = rD.stderr.split('\n');
  const i = lines.indexOf(OLD_LINE_1);
  assert.ok(i >= 0, `D: today's first line is missing; stderr:\n${rD.stderr}`);
  assert.equal(lines[i + 1], oldLine2(projD), `D: today's second line changed; stderr:\n${rD.stderr}`);
  assert.ok(!rD.stderr.includes(HEADLINE), `D: plain absence must not get the new message:\n${rD.stderr}`);

  const projF = project();
  const squatter = join(projF, '.claude', 'agents', 'fkit-x.md');
  mkdirSync(squatter, { recursive: true });
  assert.equal(hasSymlink(projF), false, 'F fixture must hold no symlink');
  assertRefused(await launch(projF), squatter, 'a directory, not an agent file');
});

test('0334/unreadable: an agent file with mode 000 refuses, naming it', { skip: asRoot }, async () => {
  const proj = project();
  const leaf = join(proj, '.claude', 'agents', 'fkit-coder.md');
  agentFile(leaf);
  chmodSync(leaf, 0o000);
  try {
    assertRefused(await launch(proj), leaf, 'not readable; check its permissions');
  } finally {
    chmodSync(leaf, 0o644);
  }
});

test('0334/not-a-dir: a regular file at .claude/agents refuses, naming it', async () => {
  const proj = project();
  mkdirSync(join(proj, '.claude'));
  writeFileSync(join(proj, '.claude', 'agents'), 'not a directory\n');
  assertRefused(await launch(proj), join(proj, '.claude', 'agents'), 'not a directory');
});

test('0334/healthy: a readable regular agent file launches even though setup failed', async () => {
  const proj = project();
  agentFile(join(proj, '.claude', 'agents', 'fkit-coder.md'));
  const r = await launch(proj);
  assertLaunched(r);
  assert.ok(r.stderr.includes(SETUP_FAILED), `the setup-failed warning is missing; stderr:\n${r.stderr}`);
});

test('0334/mixed: one good agent file beside a dangling link and a directory launches', async () => {
  const proj = project();
  const agents = join(proj, '.claude', 'agents');
  const out = tmp('fkit-0334-out-');
  // The bad entries sort first, so the check walks past both before reaching the good one.
  mkdirSync(join(agents, 'fkit-a-dir.md'), { recursive: true });
  symlinkSync(join(out, 'gone.md'), join(agents, 'fkit-b-dead.md'));
  agentFile(join(agents, 'fkit-coder.md'));
  assertLaunched(await launch(proj));
});

test('0334/gate: a successful setup never runs the check, even with an empty agents dir', async () => {
  const proj = project();
  mkdirSync(join(proj, '.claude', 'agents'), { recursive: true });
  const r = await launch(proj, { FKIT_STUB_INIT_RC: '0' });
  assertLaunched(r);
  assert.ok(!r.stderr.includes(OLD_LINE_1), `no refusal of any kind expected; stderr:\n${r.stderr}`);
});
