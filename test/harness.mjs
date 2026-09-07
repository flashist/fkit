// Test harness for the launcher contract suite (task 23 / ADR-014).
//
// fkit is a shell product that launches an LLM: `exec claude …` (claude/fkit-claude.sh) is a clean
// boundary, and everything on fkit's side of it is a pure function of (argv, project state, env) →
// (exit code, the argv handed to `claude`, the files written). This harness stubs `claude` and
// `codex` on PATH so that whole contract falls out as text in milliseconds — no model, no auth, no
// network, no cost, no flake.
//
// Nothing here writes into the repo: every project lives under os.tmpdir(). `git status` stays clean.

import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, chmodSync, readFileSync, readdirSync, existsSync, rmSync, cpSync, readlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = dirname(HERE);                              // .../fkit
// FKIT_LAUNCHER lets the red-gate (prove-red.sh) point the suite at a deliberately-broken copy of the
// launcher without touching the real one. Defaults to the real launcher for `npm test`.
// ⚠️ Announce a non-default launcher to stderr: a STALE inherited FKIT_LAUNCHER would otherwise make
// `npm test` silently test some other launcher and report green while the real one is broken.
const DEFAULT_LAUNCHER = join(REPO, 'claude', 'fkit-claude.sh');
export const LAUNCHER = process.env.FKIT_LAUNCHER || DEFAULT_LAUNCHER;
if (LAUNCHER !== DEFAULT_LAUNCHER) {
  process.stderr.write(`[harness] ⚠ testing NON-default launcher via FKIT_LAUNCHER: ${LAUNCHER}\n`);
}

// A stub dir with `claude`, `codex`, and `curl`, created once and reused.
//   claude — records the exact argv it was handed (one line per arg), ONE FILE PER INVOCATION:
//            $FKIT_STUB_ARGV_FILE.1, .2, … So "was claude run at all?" is "does .1 exist?" and "with
//            what argv?" is each file's contents, in call order.
//            ⚠️ WHY NOT ONE FILE. It used to truncate a single $FKIT_STUB_ARGV_FILE on every call
//            (`: > …`), which was fine while the launcher only ever `exec`'d claude once. The fresh-
//            project cold start now RUNS the producer and then execs the lead — two invocations in one
//            launcher run — and under the old stub the second silently erased the first, so the
//            producer phase was unobservable and a test could only ever see the session it landed in.
//            Numbering the files is what makes both phases assertable at once.
//            Two knobs let a test drive the cold start's outcome, which is otherwise unreachable
//            (a stub that writes nothing can only ever simulate an initiation that did NOT land):
//              FKIT_STUB_INITIATE — absolute path; write a non-fresh PROJECT.md there, i.e. simulate
//                                   an initiation that succeeded. Absolute, not cwd-relative, so it
//                                   cannot silently miss if the launcher's cwd ever changes.
//              FKIT_STUB_EXIT     — exit with this code instead of 0 (e.g. 130 for a Ctrl-C).
//   codex  — exits 0 for anything so the launcher's Codex preflight stays quiet and deterministic.
//   curl   — ⚠️ THE HERMETIC SEAL. `fkit update` (assertion 5) routes through _fkit_reinstall, which
//            runs `curl … | sh` against the REAL installer whenever the launcher's install root is not
//            a source checkout — which is exactly the case for prove-red.sh's copied launchers (their
//            `share` is a bare mktemp dir). Left unstubbed, running the suite performed a live NETWORK
//            REINSTALL of ~/.local/share/fkit from remote code (verified: it overwrote a real install),
//            violating the brief's "no network" contract and executing FKIT_REPO/FKIT_REF-controlled
//            code. Stubbing curl to a no-op (exit non-zero, touch nothing) makes the update path
//            network-free for ANY launcher the suite runs, not just the in-repo one. It records a
//            marker if ever invoked so a test can assert the seal held.
let STUB_DIR;
function stubDir() {
  if (STUB_DIR) return STUB_DIR;
  STUB_DIR = mkdtempSync(join(tmpdir(), 'fkit-stub-'));
  writeFileSync(join(STUB_DIR, 'claude'), [
    '#!/bin/sh',
    'n=1',
    'while [ -e "$FKIT_STUB_ARGV_FILE.$n" ]; do n=$((n+1)); done',
    // Create the file BEFORE the loop: a zero-arg invocation must still be recorded as an invocation.
    ': > "$FKIT_STUB_ARGV_FILE.$n"',
    'for a in "$@"; do printf \'%s\\n\' "$a" >> "$FKIT_STUB_ARGV_FILE.$n"; done',
    'if [ -n "${FKIT_STUB_INITIATE:-}" ]; then',
    '  mkdir -p "$(dirname "$FKIT_STUB_INITIATE")"',
    '  printf \'# Stub-initiated project\\n\' > "$FKIT_STUB_INITIATE"',
    'fi',
    'exit "${FKIT_STUB_EXIT:-0}"',
    '',
  ].join('\n'));
  writeFileSync(join(STUB_DIR, 'codex'), '#!/bin/sh\nexit 0\n');
  // No network, ever. Record the call (if any) and fail like an offline curl — never fetch.
  writeFileSync(join(STUB_DIR, 'curl'),
    '#!/bin/sh\n[ -n "${FKIT_STUB_CURL_MARKER:-}" ] && : > "$FKIT_STUB_CURL_MARKER"\nexit 6\n');
  chmodSync(join(STUB_DIR, 'claude'), 0o755);
  chmodSync(join(STUB_DIR, 'codex'), 0o755);
  chmodSync(join(STUB_DIR, 'curl'), 0o755);
  return STUB_DIR;
}

// A throwaway project the launcher can set up and run inside. The launcher's own init populates
// .claude/agents + .claude/skills + ai-agents/ from the repo, exactly as it would for a real project;
// we then overwrite PROJECT.md so the tree does NOT read as fresh (a fresh tree hijacks every role
// into the producer cold-start — see the launcher's fresh-project branch). Pass {fresh:true} to keep
// it fresh on purpose.
export function makeProject({ fresh = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-proj-'));
  // Deliberately NO claude/fkit-claude.sh here → the launcher's self-host guard does not re-exec.
  const run = spawnLauncherSetup(dir);
  if (run.code !== 0 && run.code !== 3) {
    cleanup(dir);                                    // don't leak the project dir on the failure path
    throw new Error(`project setup failed (rc=${run.code}):\n${run.stderr}`);
  }
  if (!fresh) {
    const pm = join(dir, 'ai-agents', 'knowledge-base', 'PROJECT.md');
    mkdirSync(dirname(pm), { recursive: true });
    writeFileSync(pm, '# Launcher Contract Test Project\n\nAn initiated project used by the suite.\n');
  }
  return dir;
}

// One synchronous setup pass (FKIT_SETUP_ONLY) so makeProject can fail loudly if the project can't be
// prepared, without racing the async runFkit path.
function spawnLauncherSetup(project) {
  return runSync(['producer'], { project, extraEnv: { FKIT_SETUP_ONLY: '1' } });
}

// Run the launcher and resolve to { code, stdout, stderr, exec, argv, argvs }.
//   exec  — did the launcher reach `claude` at all (i.e. did the stub run)?
//   argv  — the argv of the LAST claude invocation, or null if it never ran. For every path that
//           launches one session this is "the argv handed to claude", unchanged.
//   argvs — every invocation's argv, in call order. ⚠️ A run with two phases (the fresh-project cold
//           start: producer, then lead) is only fully visible here — `argv` shows the session you
//           LAND in and says nothing about what ran before it. Assert on argvs when the count matters.
// detached:true puts the child in a new session with NO controlling terminal, so the launcher's
// menu / fresh-tty branches are deterministic regardless of how `npm test` itself was started.
export function runFkit(args, { project, extraEnv = {} } = {}) {
  return new Promise((resolve, reject) => {
    const argvDir = mkdtempSync(join(tmpdir(), 'fkit-argv-'));
    const argvFile = join(argvDir, 'argv');
    const curlMarker = join(argvDir, 'curl-called');
    const env = {
      ...process.env,
      PATH: `${stubDir()}:${process.env.PATH}`,
      FKIT_NO_SELF_HOST: '1',
      FKIT_NO_UPDATE_CHECK: '1',
      FKIT_STUB_ARGV_FILE: argvFile,
      FKIT_STUB_CURL_MARKER: curlMarker,
      ...extraEnv,
    };
    const child = spawn('/bin/sh', [LAUNCHER, ...args], {
      cwd: project,
      env,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', reject);
    child.on('close', (code) => {
      const { exec, argv, argvs } = readArgv(argvFile);
      const curlReached = existsSync(curlMarker);    // did the run hit the (stubbed, no-network) curl?
      cleanup(argvDir);                              // don't leak a temp dir per launcher run
      resolve({ code, stdout, stderr, exec, argv, argvs, curlReached });
    });
  });
}

// Reconstruct the argv of every claude invocation the stub recorded, in call order. The stub writes
// one file per invocation (argvFile.1, .2, …), one line per arg (`printf '%s\n'`), so each split
// yields a trailing "" from the final newline — drop exactly that one, NOT every empty line, so a
// legitimately empty argument ("") in the middle survives round-trip.
//
// Walking `.1, .2, …` until one is missing (rather than globbing the dir) keeps the ORDER exact: the
// stub allocates numbers by probing upward, so the sequence is dense and the first gap is the end.
function readArgv(argvFile) {
  const argvs = [];
  for (let n = 1; existsSync(`${argvFile}.${n}`); n++) {
    const lines = readFileSync(`${argvFile}.${n}`, 'utf8').split('\n');
    if (lines.length && lines[lines.length - 1] === '') lines.pop();
    argvs.push(lines);
  }
  if (argvs.length === 0) return { exec: false, argv: null, argvs: [] };
  return { exec: true, argv: argvs[argvs.length - 1], argvs };
}

// Synchronous sibling used only for setup; keeps makeProject simple.
import { spawnSync } from 'node:child_process';
function runSync(args, { project, extraEnv = {} } = {}) {
  const argvDir = mkdtempSync(join(tmpdir(), 'fkit-argv-'));
  const r = spawnSync('/bin/sh', [LAUNCHER, ...args], {
    cwd: project,
    env: {
      ...process.env,
      PATH: `${stubDir()}:${process.env.PATH}`,
      FKIT_NO_SELF_HOST: '1',
      FKIT_NO_UPDATE_CHECK: '1',
      FKIT_STUB_ARGV_FILE: join(argvDir, 'argv'),
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
  cleanup(argvDir);
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

// --- init / convergence ------------------------------------------------------------------------
// The convergence contract (task 28) belongs to init, not to the launcher: init is what walks the
// scaffold and tops up an existing ai-agents/. So the suite drives init DIRECTLY — the launcher is
// only involved in the one assertion that the announcement survives its `>/dev/null` (which is the
// whole trap), and that one uses runFkit above.
export const INIT = join(REPO, 'claude', 'fkit-claude-init.sh');
export const SCAFFOLD = join(REPO, 'claude', 'scaffold', 'ai-agents');

// Run init against a project and resolve { code, stdout, stderr }. Note rc 3 = "refused ai-agents/".
export function runInit(project) {
  const r = spawnSync(INIT, [project], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

// A bare project dir with a COPY of the scaffold's ai-agents/ already in place — i.e. an
// already-set-up project, which is the only kind convergence ever runs on.
export function makeConvergeProject() {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-conv-'));
  cpSync(SCAFFOLD, join(dir, 'ai-agents'), { recursive: true });
  return dir;
}

// Every path under a dir → a content+type fingerprint, keyed by relative path. The invariant
// assertion compares two of these: any pre-existing entry whose fingerprint moved (or which vanished)
// is a broken invariant.
//
// ⚠️ Records DIRECTORIES and SYMLINKS, not just regular files (round-1 review, R5). Hashing only file
// contents left the invariant check blind to precisely the mutations that are hardest to undo: a
// pre-existing symlink swapped for a real directory, or an empty directory deleted, both scored as
// "nothing changed". The invariant says NO overwrite, move, or delete of ANY path — so the manifest
// has to see every path, and its type.
export function manifest(root) {
  const out = new Map();
  const walk = (d, prefix) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const rel = prefix ? `${prefix}/${e.name}` : e.name;
      const abs = join(d, e.name);
      if (e.isSymbolicLink()) out.set(rel, `symlink:${readlinkSync(abs)}`);   // do NOT follow it
      else if (e.isDirectory()) { out.set(rel, 'dir'); walk(abs, rel); }
      else if (e.isFile()) out.set(rel, `file:${createHash('sha256').update(readFileSync(abs)).digest('hex')}`);
      else out.set(rel, 'other');
    }
  };
  walk(root, '');
  return out;
}

// Read a role's generated lockdown settings file from a project.
export function readSettings(project, role) {
  const p = join(project, '.fkit', 'settings', `${role}.json`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

// The fkit-* skill dirs actually present in a project's .claude/skills — i.e. exactly the set
// build_settings() iterates. Used to pin the hard-coded UNIVERSE against reality, closing the corner
// where a universally-on skill could be added/removed without moving any role's off-set.
export function projectSkillDirs(project) {
  const skillsRoot = join(project, '.claude', 'skills');
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith('fkit-'))
    .map((e) => e.name)
    .sort();
}

export function cleanup(dir) {
  if (!dir) return;
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ }
}

// Remove the shared stub dir. Call once from the suite's teardown so a run leaves no temp dirs behind.
export function cleanupStub() {
  cleanup(STUB_DIR);
  STUB_DIR = undefined;
}
