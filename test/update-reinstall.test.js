// The `fkit update` REINSTALL suite — what `_fkit_reinstall` in claude/fkit-claude.sh hands to the
// installer it downloads (task 0481).
//
// THE DEFECT: the launcher wrote `FKIT_REPO=… FKIT_REF=… curl … | sh`. A variable set in front of a
// command reaches ONLY that command — here `curl`, not the `sh` on the other side of the pipe
// (measured: `A=1 true | sh -c 'echo ${A:-unset}'` prints `unset`). So the installer ran on its own
// defaults — flashist/fkit@main, ~/.local/share/fkit, ~/.local/bin — while the launcher printed
// "updating from <your repo>@<your ref>". A fork, a pinned ref, or a custom-path install was quietly
// "updated" into a second, default install, and the one the user actually runs stayed old.
// THE FIX: hand all four values to the `sh`, and learn the bin dir from a `bin=` line install.sh now
// records in `.version`. An older `.version` with no `bin=` uses the default bin only when the default
// `fkit` wrapper provably runs this install, and otherwise refuses with one line — never a guess.
//
// ⚠️ THIS FILE OWNS ITS FIXTURE, for update-banner.test.js's reasons (read its header): the shared
// harness sets FKIT_NO_UPDATE_CHECK=1 and runs from a source checkout, where `fkit update` refuses
// before it reaches the reinstall. The sealed-PATH helpers below are COPIED from that file, not
// shared — it is not refactored for this.
//
// ⚠️ THE SEAL IS THE WHOLE TEST. Every case runs on a SEALED PATH: symlinks to a handful of coreutils
// plus a stub `curl` that never touches the network. `git` is ABSENT from every case, and that is
// PROVEN (assertUnreachable), not assumed. The stub curl logs its argv — the positive half of the
// proof that OUR curl answered. For `…/install.sh` it serves a FAKE installer that only writes down
// the FKIT_REPO / FKIT_REF / FKIT_SHARE / FKIT_BIN it received. The fixture repos are names that do
// not exist on GitHub, so even a leak would fetch nothing.
//
// ⚠️ FIXTURE VERSIONS ARE SYNTHETIC (9.9.x), NEVER the repo's VERSION.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, chmodSync, symlinkSync, cpSync, rmSync,
  realpathSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// The claude/ tree the fixture copies its launcher from — and, in the install.sh cases, the tree the
// stub tarball carries. A whole-tree redirect (FKIT_REINSTALL_ROOT) so a run can point it at a broken copy.
const DEFAULT_TREE = join(REPO, 'claude');
const CLAUDE_TREE = process.env.FKIT_REINSTALL_ROOT || DEFAULT_TREE;
if (CLAUDE_TREE !== DEFAULT_TREE) {
  process.stderr.write(`[update-reinstall] ⚠ testing NON-default claude/ tree via FKIT_REINSTALL_ROOT: ${CLAUDE_TREE}\n`);
}
// install.sh lives at the repo root, outside the redirected tree — always the real one.
const INSTALL_SH = join(REPO, 'install.sh');

// Synthetic throughout. Repos that do not exist on GitHub: belt-and-braces behind the sealed PATH.
const FAKE_REPO = 'fkit-test/no-such-repo-0481';
const OTHER_REPO = 'fkit-test/other-no-such-repo-0481';
const INSTALLED_VERSION = '9.9.9';
const NEW_VERSION = '9.9.10';             // what the fake installer records
const NEW_SHA = 'abcdef0111111111111111111111111111111111';

// What the launcher's `fkit update` path reaches. git is deliberately NOT here.
const NEEDED_TOOLS = ['dirname', 'sed', 'head', 'cut', 'tr', 'find', 'awk', 'cat', 'printf', 'rm', 'sh'];
// What the real install.sh additionally needs (GNU tar on CI's ubuntu runs `gzip` for `-z`).
const INSTALLER_TOOLS = ['tar', 'gzip', 'mktemp', 'mkdir', 'cp', 'chmod'];

const MADE = [];
after(() => MADE.forEach((d) => { try { rmSync(d, { recursive: true, force: true }); } catch { /* best effort */ } }));

function temp(prefix) {
  const d = mkdtempSync(join(tmpdir(), prefix));
  MADE.push(d);
  return d;
}

function which(tool) {
  const r = spawnSync('/bin/sh', ['-c', `command -v ${tool}`], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim().split('\n')[0] : null;
}

// ── the sealed PATH (copied from update-banner.test.js) ────────────────────────────────────────

function sealedBin({ curl, installer = false } = {}) {
  const dir = temp('fkit-reinstall-bin-');
  for (const t of installer ? [...NEEDED_TOOLS, ...INSTALLER_TOOLS] : NEEDED_TOOLS) {
    const p = which(t);
    if (p) { try { symlinkSync(p, join(dir, t)); } catch { /* shell builtin, or already linked */ } }
  }
  if (curl) stub(dir, 'curl', curl);
  return dir;
}

// Every stub logs its own argv first: only our binary writes that log.
function stub(dir, name, body) {
  const p = join(dir, name);
  writeFileSync(p, `#!/bin/sh\nprintf '%s\\n' "$*" >> "$FKIT_TEST_${name.toUpperCase()}_LOG"\n${body}\n`);
  chmodSync(p, 0o755);
}

function assertUnreachable(path, tool) {
  const r = spawnSync('/bin/sh', ['-c', `command -v ${tool}`], { env: { PATH: path }, encoding: 'utf8' });
  assert.notEqual(r.status, 0,
    `${tool} IS reachable on the supposedly sealed PATH (${r.stdout.trim()}) — this test would pass for the wrong reason`);
}

function assertReachable(path, tool, expectedDir) {
  const r = spawnSync('/bin/sh', ['-c', `command -v ${tool}`], { env: { PATH: path }, encoding: 'utf8' });
  assert.equal(r.status, 0, `${tool} is not reachable on the test PATH at all`);
  assert.equal(r.stdout.trim(), join(expectedDir, tool), `${tool} resolves to a binary that is not our stub`);
}

function assertSealed(r, bin) {
  assertUnreachable(r.PATH, 'git');
  assertReachable(r.PATH, 'curl', bin);
}

// ── the stub curl and the fake installer ───────────────────────────────────────────────────────

// The fake install.sh the stub curl serves. It writes down exactly what it received — `<unset>` for a
// variable that never reached it — then, if it was given a share, records a valid .version there so
// the launcher's "now at" line has something to read.
const FAKE_INSTALLER = [
  '{',
  '  printf \'REPO=%s\\n\' "${FKIT_REPO-<unset>}"',
  '  printf \'REF=%s\\n\' "${FKIT_REF-<unset>}"',
  '  printf \'SHARE=%s\\n\' "${FKIT_SHARE-<unset>}"',
  '  printf \'BIN=%s\\n\' "${FKIT_BIN-<unset>}"',
  '} > "$FKIT_TEST_CAPTURE"',
  'if [ -n "${FKIT_SHARE:-}" ] && [ -d "$FKIT_SHARE" ]; then',
  `  printf 'version=${NEW_VERSION}\\nsha=${NEW_SHA}\\n' > "$FKIT_SHARE/.version"`,
  'fi',
  '',
].join('\n');

// The URL is curl's last argument. install.sh → the fake installer; the codeload tarball → the one
// built below (only when the case serves one); anything else fails like an HTTP error.
const CURL_SERVE = [
  'for a in "$@"; do url="$a"; done',
  'case "${url:-}" in',
  '  https://raw.githubusercontent.com/*/install.sh) cat "$FKIT_TEST_FAKE_INSTALLER"; exit 0 ;;',
  '  https://codeload.github.com/*) [ -n "${FKIT_TEST_TARBALL:-}" ] && cat "$FKIT_TEST_TARBALL" && exit 0 ;;',
  'esac',
  'exit 22',
].join('\n');
const CURL_FAIL = 'exit 22';             // every download fails (HTTP error under -f)
// The install.sh download times out part-way: curl has written the first line of a script that would
// leave a capture file if it ever ran, then exits 28 (CURLE_OPERATION_TIMEDOUT), as --max-time does.
const CURL_PARTIAL_TIMEOUT = [
  'for a in "$@"; do url="$a"; done',
  'case "${url:-}" in',
  '  https://raw.githubusercontent.com/*/install.sh) printf \'%s\\n\' \': > "$FKIT_TEST_CAPTURE"\'; exit 28 ;;',
  'esac',
  'exit 22',
].join('\n');

// ── fixtures ───────────────────────────────────────────────────────────────────────────────────

// An install root that is NOT a source checkout: a copy of claude/ and a synthetic .version.
// `repo` / `ref` / `bin` add .version lines beyond version/sha; `null` leaves that line out.
function install(root, { repo = null, ref = null, bin = null } = {}) {
  mkdirSync(root, { recursive: true });
  cpSync(CLAUDE_TREE, join(root, 'claude'), { recursive: true });
  const lines = [`version=${INSTALLED_VERSION}`, 'sha=1111111111111111111111111111111111111111'];
  if (repo !== null) lines.push(`repo=${repo}`);
  if (ref !== null) lines.push(`ref=${ref}`);
  if (bin !== null) lines.push(`bin=${bin}`);
  writeFileSync(join(root, '.version'), `${lines.join('\n')}\n`);
  return root;
}

// A generated-style `fkit` wrapper in <binDir> whose exec line points at <shareSpelling>.
function wrapper(binDir, shareSpelling) {
  mkdirSync(binDir, { recursive: true });
  const p = join(binDir, 'fkit');
  writeFileSync(p, `#!/bin/sh\n# fkit — test wrapper\nexec "${shareSpelling}/claude/fkit-claude.sh" "$@"\n`);
  chmodSync(p, 0o755);
}

function readCapture(file) {
  if (!existsSync(file)) return null;
  const out = {};
  for (const l of readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
    const i = l.indexOf('=');
    out[l.slice(0, i)] = l.slice(i + 1);
  }
  return out;
}

// One run. env is built from NOTHING — process.env is deliberately not spread, so no FKIT_* reaches
// in unless the case sets it. `cwd` defaults to a fresh temp dir.
function run(bin, { cmd, home, env = {}, path = null, cwd = null }) {
  const logs = temp('fkit-reinstall-log-');
  const curlLog = join(logs, 'curl');
  const capture = join(logs, 'capture');
  const fake = join(logs, 'install.sh');
  writeFileSync(fake, FAKE_INSTALLER);
  const PATH = path || bin;
  const r = spawnSync(cmd[0], cmd.slice(1), {
    cwd: cwd || temp('fkit-reinstall-cwd-'),
    env: {
      PATH,
      HOME: home,
      FKIT_NO_SELF_HOST: '1',
      FKIT_TEST_CURL_LOG: curlLog,
      FKIT_TEST_CAPTURE: capture,
      FKIT_TEST_FAKE_INSTALLER: fake,
      ...env,
    },
    encoding: 'utf8',
  });
  const curlCalls = existsSync(curlLog) ? readFileSync(curlLog, 'utf8').trim().split('\n').filter(Boolean) : [];
  return {
    code: r.status, stdout: r.stdout || '', stderr: r.stderr || '', PATH,
    curlCalls, captured: readCapture(capture),
  };
}

function update(root, bin, opts) {
  return run(bin, { cmd: ['/bin/sh', join(root, 'claude', 'fkit-claude.sh'), 'update'], ...opts });
}

function assertAsked(r, repo, ref) {
  assert.ok(r.curlCalls.some((c) => c.includes(`raw.githubusercontent.com/${repo}/${ref}/install.sh`)),
    `curl was not asked for ${repo}/${ref}/install.sh: ${JSON.stringify(r.curlCalls)}`);
}

// ── 1. custom repo/ref recorded only in .version, nothing exported — THE defect ────────────────

test('0481/version-only: repo/ref from .version reach the installer, not the defaults', () => {
  const home = temp('fkit-reinstall-home-');
  const binDir = temp('fkit-reinstall-userbin-');
  const root = install(temp('fkit-reinstall-root-'), { repo: FAKE_REPO, ref: 'dev', bin: binDir });
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, { home });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.ok(r.captured, `the fake installer never ran:\n${r.stdout}\n${r.stderr}`);
  assert.equal(r.captured.REPO, FAKE_REPO, 'the installer did not receive the recorded repo');
  assert.equal(r.captured.REF, 'dev', 'the installer did not receive the recorded ref');
  assertAsked(r, FAKE_REPO, 'dev');
  assert.match(r.stdout, new RegExp(`updating from ${FAKE_REPO}@dev`));
  assertSealed(r, bin);
});

// ── 2. custom share + custom bin, nothing exported ─────────────────────────────────────────────

test('0481/custom-paths: the installer gets this install\'s own share and recorded bin', () => {
  const home = temp('fkit-reinstall-home-');
  const binDir = temp('fkit-reinstall-userbin-');
  const root = install(temp('fkit-reinstall-root-'), { repo: FAKE_REPO, ref: 'main', bin: binDir });
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, { home });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.ok(r.captured, 'the fake installer never ran');
  assert.equal(r.captured.SHARE, root, 'the installer did not receive this install\'s share');
  assert.equal(r.captured.BIN, binDir, 'the installer did not receive the recorded bin');
  // Nothing at the default paths is proven by 0481/install-sh-records, which runs the real install.sh:
  // here the installer is the fake, so no check under $HOME could fail.
  assertSealed(r, bin);
});

// ── 3. env on the update command line wins over .version ───────────────────────────────────────

test('0481/env-wins: FKIT_* given on the run override .version, and "now at" reads the new share', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(temp('fkit-reinstall-root-'),
    { repo: FAKE_REPO, ref: 'main', bin: temp('fkit-reinstall-userbin-') });
  const envShare = temp('fkit-reinstall-envshare-');
  const envBin = temp('fkit-reinstall-envbin-');
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, {
    home,
    env: { FKIT_REPO: OTHER_REPO, FKIT_REF: 'v9.9.10', FKIT_SHARE: envShare, FKIT_BIN: envBin },
  });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.deepEqual(r.captured,
    { REPO: OTHER_REPO, REF: 'v9.9.10', SHARE: envShare, BIN: envBin },
    'the run\'s env values did not win');
  assertAsked(r, OTHER_REPO, 'v9.9.10');
  // The fake wrote 9.9.10 into the ENV share only; the root still says 9.9.9.
  assert.match(r.stdout, new RegExp(`now at v${NEW_VERSION.replace(/\./g, '\\.')} \\(abcdef0\\)`),
    `"now at" did not read the share that was just written:\n${r.stdout}`);
  assertSealed(r, bin);
});

// ── 4. a default install — unchanged behaviour ─────────────────────────────────────────────────

test('0481/default: a default install reinstalls flashist/fkit@main into the default paths', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(join(home, '.local', 'share', 'fkit'), { bin: join(home, '.local', 'bin') });
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, { home });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.deepEqual(r.captured, {
    REPO: 'flashist/fkit', REF: 'main',
    SHARE: join(home, '.local', 'share', 'fkit'), BIN: join(home, '.local', 'bin'),
  });
  // Safe only because of the seal: the real repo's URL was answered by OUR curl.
  assertAsked(r, 'flashist/fkit', 'main');
  assertSealed(r, bin);
});

// ── 5-7. an older .version with no bin= ────────────────────────────────────────────────────────

test('0481/old-version-proven-default: no bin=, but the default wrapper runs this install → default bin', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(join(home, '.local', 'share', 'fkit'), { repo: FAKE_REPO, ref: 'main' });
  // Spelled differently on purpose: the physical path (macOS /private/var) plus a trailing slash, so
  // only a `pwd -P` comparison — not a string compare — can match it.
  wrapper(join(home, '.local', 'bin'), `${realpathSync(root)}/`);
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, { home });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.ok(r.captured, 'the fake installer never ran');
  assert.equal(r.captured.BIN, join(home, '.local', 'bin'));
  assert.equal(r.captured.SHARE, root);
  assertSealed(r, bin);
});

function assertRefused(r) {
  assert.equal(r.code, 1, `expected exit 1, got ${r.code}:\n${r.stdout}\n${r.stderr}`);
  const lines = r.stderr.split('\n').filter(Boolean);
  assert.equal(lines.length, 1, `expected exactly one stderr line:\n${r.stderr}`);
  assert.match(lines[0], /FKIT_BIN=/);
  assert.equal(r.captured, null, 'the installer ran on a guess');
  assert.deepEqual(r.curlCalls, [], 'curl was called before the refusal');
}

test('0481/old-version-unknown-bin: no bin= and no default wrapper → one-line refusal, no download', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(temp('fkit-reinstall-root-'), { repo: FAKE_REPO, ref: 'main' });
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, { home });
  assertRefused(r);
  assertSealed(r, bin);
});

test('0481/old-version-foreign-wrapper: no bin=, default wrapper runs ANOTHER install → refusal', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(temp('fkit-reinstall-root-'), { repo: FAKE_REPO, ref: 'main' });
  const other = install(temp('fkit-reinstall-other-'), { repo: FAKE_REPO, ref: 'main' });
  wrapper(join(home, '.local', 'bin'), other);
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, { home });
  assertRefused(r);
  assertSealed(r, bin);
});

// ── 8-9. the real install.sh records bin=, and the next update keeps it ────────────────────────

// A tar.gz of CLAUDE_TREE plus a synthetic VERSION, laid out like a codeload tarball (one top dir,
// which install.sh strips). Built once, with the test process's own tar — not the sealed one.
let TARBALL = null;
function tarball() {
  if (TARBALL) return TARBALL;
  const stage = temp('fkit-reinstall-stage-');
  const top = join(stage, 'fkit-test-src');
  mkdirSync(top);
  cpSync(CLAUDE_TREE, join(top, 'claude'), { recursive: true });
  writeFileSync(join(top, 'VERSION'), '9.9.8\n');
  const out = join(temp('fkit-reinstall-tgz-'), 'src.tar.gz');
  const r = spawnSync('tar', ['-czf', out, '-C', stage, 'fkit-test-src'],
    { env: { ...process.env, COPYFILE_DISABLE: '1' }, encoding: 'utf8' });
  assert.equal(r.status, 0, `could not build the stub tarball: ${r.stderr}`);
  TARBALL = out;
  return out;
}

// Run the repo's REAL install.sh with custom values set on ITS env only — the README's
// "variables after the pipe" form — against the stub tarball.
function realInstall() {
  const home = temp('fkit-reinstall-home-');
  const share = join(temp('fkit-reinstall-cshare-'), 'fkit');
  const binDir = join(temp('fkit-reinstall-cbin-'), 'bin');
  const bin = sealedBin({ curl: CURL_SERVE, installer: true });
  const r = run(bin, {
    cmd: ['/bin/sh', INSTALL_SH], home,
    env: {
      FKIT_REPO: FAKE_REPO, FKIT_REF: 'dev', FKIT_SHARE: share, FKIT_BIN: binDir,
      FKIT_TEST_TARBALL: tarball(),
    },
  });
  assert.equal(r.code, 0, `install.sh failed:\n${r.stdout}\n${r.stderr}`);
  assertSealed(r, bin);
  return { home, share, binDir, bin };
}

test('0481/install-sh-records: install.sh records bin=, and a bare `fkit update` reuses all four', () => {
  const { home, share, binDir, bin } = realInstall();
  const ver = readFileSync(join(share, '.version'), 'utf8');
  assert.match(ver, new RegExp(`^repo=${FAKE_REPO}$`, 'm'));
  assert.match(ver, /^ref=dev$/m);
  const recorded = (ver.match(/^bin=(.*)$/m) || [])[1];
  assert.ok(recorded && recorded.startsWith('/'), `.version has no absolute bin=:\n${ver}`);
  assert.equal(recorded, binDir);
  assert.ok(existsSync(join(binDir, 'fkit')), 'the wrapper is not in the custom bin');

  // A fresh run with NO FKIT_* set, through the wrapper the user would type.
  const r = run(bin, { cmd: [join(binDir, 'fkit'), 'update'], home });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.deepEqual(r.captured, { REPO: FAKE_REPO, REF: 'dev', SHARE: share, BIN: binDir });
  assertAsked(r, FAKE_REPO, 'dev');
  assert.ok(!existsSync(join(home, '.local', 'share', 'fkit')), 'a second install appeared at the default share');
  assert.ok(!existsSync(join(home, '.local', 'bin')), 'a second fkit appeared in the default bin');
  assertSealed(r, bin);
});

test('0481/reinstall-hint: the broken-install hint passes the source and paths after the pipe', () => {
  const { home, share, binDir, bin } = realInstall();
  rmSync(join(share, 'claude', 'fkit-claude.sh'));
  const r = run(bin, { cmd: [join(binDir, 'fkit')], home });
  assert.equal(r.code, 1, `expected the broken-install exit:\n${r.stdout}\n${r.stderr}`);
  const want = `| FKIT_REPO=${FAKE_REPO} FKIT_REF=dev FKIT_SHARE='${share}' FKIT_BIN='${binDir}' sh`;
  assert.ok(r.stderr.includes(want), `hint does not carry the values after the pipe:\n${r.stderr}`);
});

// ── 10. a failed download is a failed update ───────────────────────────────────────────────────

test('0481/download-fails: a failed download fails the update — no "now at", installer never run', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(temp('fkit-reinstall-root-'),
    { repo: FAKE_REPO, ref: 'main', bin: temp('fkit-reinstall-userbin-') });
  const bin = sealedBin({ curl: CURL_FAIL });
  const r = update(root, bin, { home });
  assert.notEqual(r.code, 0, `a failed download exited 0:\n${r.stdout}\n${r.stderr}`);
  assert.match(r.stderr, /update failed/);
  assert.ok(!r.stdout.includes('now at'), `printed "now at" after fetching nothing:\n${r.stdout}`);
  assert.equal(r.captured, null);
  assert.ok(r.curlCalls.length >= 1, 'the stub curl was never called');
  assertSealed(r, bin);
});

// ── 11. a relative FKIT_BIN under an exported CDPATH ───────────────────────────────────────────

test('0481/relative-bin-cdpath: a relative FKIT_BIN resolves from the cwd, never through CDPATH', () => {
  const home = temp('fkit-reinstall-home-');
  const share = join(temp('fkit-reinstall-cshare-'), 'fkit');
  const cwd = temp('fkit-reinstall-cwd-');
  // A CDPATH entry holding a `bin` of its own: a plain `cd bin` goes THERE, and prints the path too.
  const decoy = temp('fkit-reinstall-cdpath-');
  mkdirSync(join(decoy, 'bin'));
  const bin = sealedBin({ curl: CURL_SERVE, installer: true });
  const r = run(bin, {
    cmd: ['/bin/sh', INSTALL_SH], home, cwd,
    env: {
      FKIT_REPO: FAKE_REPO, FKIT_REF: 'dev', FKIT_SHARE: share, FKIT_BIN: 'bin', CDPATH: decoy,
      FKIT_TEST_TARBALL: tarball(),
    },
  });
  assert.equal(r.code, 0, `install.sh failed:\n${r.stdout}\n${r.stderr}`);
  const ver = readFileSync(join(share, '.version'), 'utf8');
  const recorded = ver.match(/^bin=(.*)$/m)?.[1];
  assert.ok(recorded && recorded.startsWith('/'), `.version has no absolute bin=:\n${ver}`);
  assert.equal(realpathSync(recorded), realpathSync(join(cwd, 'bin')), `bin= is not <cwd>/bin:\n${ver}`);
  assert.ok(existsSync(join(cwd, 'bin', 'fkit')), 'the wrapper is not in <cwd>/bin');
  assert.ok(!existsSync(join(decoy, 'bin', 'fkit')), 'the wrapper landed in the CDPATH directory');
  assertSealed(r, bin);
});

// ── 12-14. a launcher reached through a symlink or a copy ──────────────────────────────────────
// The launcher takes its install root from where the script sits (`$here/..`). Reached through a
// symlink or a copy, that is the parent of the LINK's directory — not an install — and install.sh
// would `rm -rf` under it. With no FKIT_SHARE given, the update must refuse before any download.

function assertShareRefused(r) {
  assert.equal(r.code, 1, `expected exit 1, got ${r.code}:\n${r.stdout}\n${r.stderr}`);
  const lines = r.stderr.split('\n').filter(Boolean);
  assert.equal(lines.length, 1, `expected exactly one stderr line:\n${r.stderr}`);
  assert.match(lines[0], /not an fkit install/);
  assert.match(lines[0], /FKIT_SHARE=.* FKIT_BIN=/, 'the hint must name both: bin= is read from the wrong root too');
  assert.equal(r.captured, null, 'the installer ran against a root that is not an install');
  assert.deepEqual(r.curlCalls, [], 'curl was called before the refusal');
}

// A real install, plus <outer>/bin/fkit reaching its launcher by `how` ('symlink' | 'copy').
function reachedVia(how) {
  const root = install(temp('fkit-reinstall-root-'),
    { repo: FAKE_REPO, ref: 'main', bin: temp('fkit-reinstall-userbin-') });
  const outer = temp('fkit-reinstall-outer-');           // what `$here/..` comes out as
  mkdirSync(join(outer, 'bin'));
  const launcher = join(outer, 'bin', 'fkit');
  if (how === 'symlink') symlinkSync(join(root, 'claude', 'fkit-claude.sh'), launcher);
  else cpSync(join(root, 'claude', 'fkit-claude.sh'), launcher);
  return { root, outer, launcher };
}

test('0481/symlinked-launcher: a symlinked launcher refuses — its derived root is not an install', () => {
  const home = temp('fkit-reinstall-home-');
  const { outer, launcher } = reachedVia('symlink');
  const bin = sealedBin({ curl: CURL_SERVE });
  // FKIT_BIN set: without the guard nothing else stops this run (the review's destructive case).
  const r = run(bin, { cmd: ['/bin/sh', launcher, 'update'], home,
    env: { FKIT_BIN: temp('fkit-reinstall-envbin-') } });
  assertShareRefused(r);
  assert.ok(!existsSync(join(outer, '.version')), 'something was written into the derived root');
  assertSealed(r, bin);
});

test('0481/copied-launcher: a copied launcher refuses even with a stray .version at its derived root', () => {
  const home = temp('fkit-reinstall-home-');
  const { outer, launcher } = reachedVia('copy');
  // .version alone is not enough: the launcher must also be that root's own claude/fkit-claude.sh.
  writeFileSync(join(outer, '.version'), `version=${INSTALLED_VERSION}\nbin=${temp('fkit-reinstall-userbin-')}\n`);
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = run(bin, { cmd: ['/bin/sh', launcher, 'update'], home });
  assertShareRefused(r);
  assertSealed(r, bin);
});

test('0481/symlinked-launcher-env-share: an explicit FKIT_SHARE is honoured — the stated target', () => {
  const home = temp('fkit-reinstall-home-');
  const { root, launcher } = reachedVia('symlink');
  const envBin = temp('fkit-reinstall-envbin-');
  const bin = sealedBin({ curl: CURL_SERVE });
  // The user names the install: like install.sh, the launcher takes FKIT_SHARE as given. (Repo and ref
  // come from THAT install's .version — see 0481/symlinked-launcher-hint-keeps-source.)
  const r = run(bin, { cmd: ['/bin/sh', launcher, 'update'], home,
    env: { FKIT_SHARE: root, FKIT_BIN: envBin } });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.ok(r.captured, 'the fake installer never ran');
  assert.equal(r.captured.SHARE, root);
  assert.equal(r.captured.BIN, envBin);
  assertSealed(r, bin);
});

// ── 15-16. an explicit FKIT_SHARE that already holds an install supplies its own record ────────
// Through a symlink or a copy, the launcher's derived root has no .version, so following the refusal's
// hint used to read repo/ref from nowhere and reinstall a fork or pinned install from flashist/fkit@main.

test('0481/symlinked-launcher-hint-keeps-source: following the hint keeps a fork\'s repo and pinned ref', () => {
  const home = temp('fkit-reinstall-home-');
  const userBin = temp('fkit-reinstall-userbin-');
  const root = install(temp('fkit-reinstall-root-'), { repo: FAKE_REPO, ref: 'v1.2.3', bin: userBin });
  const outer = temp('fkit-reinstall-outer-');
  mkdirSync(join(outer, 'bin'));
  const launcher = join(outer, 'bin', 'fkit');
  symlinkSync(join(root, 'claude', 'fkit-claude.sh'), launcher);
  const bin = sealedBin({ curl: CURL_SERVE });
  // Exactly what the refusal tells the user to run: FKIT_SHARE=<its install dir> FKIT_BIN=<its bin dir>.
  const r = run(bin, { cmd: ['/bin/sh', launcher, 'update'], home,
    env: { FKIT_SHARE: root, FKIT_BIN: userBin } });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.deepEqual(r.captured, { REPO: FAKE_REPO, REF: 'v1.2.3', SHARE: root, BIN: userBin },
    'the installer did not get the named install\'s recorded source');
  assertAsked(r, FAKE_REPO, 'v1.2.3');
  assert.match(r.stdout, new RegExp(`updating from ${FAKE_REPO}@v1\\.2\\.3`));
  assertSealed(r, bin);
});

test('0481/env-share-record-precedence: env beats the named install\'s record, field by field', () => {
  const home = temp('fkit-reinstall-home-');
  const bin = sealedBin({ curl: CURL_SERVE });
  // A fresh install per run: the fake installer rewrites the named share's .version.
  const linked = (rec) => {
    const root = install(temp('fkit-reinstall-root-'), rec);
    const launcher = join(temp('fkit-reinstall-outer-'), 'fkit');
    symlinkSync(join(root, 'claude', 'fkit-claude.sh'), launcher);
    return { root, cmd: ['/bin/sh', launcher, 'update'] };
  };
  const userBin = temp('fkit-reinstall-userbin-');

  // FKIT_SHARE alone: bin= comes from the named install's record too.
  let t = linked({ repo: FAKE_REPO, ref: 'v1.2.3', bin: userBin });
  let r = run(bin, { cmd: t.cmd, home, env: { FKIT_SHARE: t.root } });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.deepEqual(r.captured, { REPO: FAKE_REPO, REF: 'v1.2.3', SHARE: t.root, BIN: userBin },
    'FKIT_SHARE alone did not read the named install\'s record');
  assertSealed(r, bin);

  // An env FKIT_REF still wins over the record; the record still supplies the rest.
  t = linked({ repo: FAKE_REPO, ref: 'v1.2.3', bin: userBin });
  r = run(bin, { cmd: t.cmd, home, env: { FKIT_SHARE: t.root, FKIT_REF: 'dev' } });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.deepEqual(r.captured, { REPO: FAKE_REPO, REF: 'dev', SHARE: t.root, BIN: userBin },
    'an env FKIT_REF did not win over the named install\'s record');
  assertAsked(r, FAKE_REPO, 'dev');
  assertSealed(r, bin);

  // An older record with no bin=: the default bin is used only if its wrapper runs the NAMED install.
  t = linked({ repo: FAKE_REPO, ref: 'v1.2.3' });
  wrapper(join(home, '.local', 'bin'), t.root);
  r = run(bin, { cmd: t.cmd, home, env: { FKIT_SHARE: t.root } });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  assert.equal(r.captured?.BIN, join(home, '.local', 'bin'), 'the proven default bin was not used');
  assertSealed(r, bin);
});

// ── 17-18. task 0284: the install.sh download has a deadline, and a cut-off one never runs ──────

test('0284/reinstall-deadline: the install.sh download is bounded by curl --max-time 60', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(temp('fkit-reinstall-root-'),
    { repo: FAKE_REPO, ref: 'main', bin: temp('fkit-reinstall-userbin-') });
  const bin = sealedBin({ curl: CURL_SERVE });
  const r = update(root, bin, { home });
  assert.equal(r.code, 0, `update failed:\n${r.stdout}\n${r.stderr}`);
  const fetch = r.curlCalls.find((c) => c.includes(`raw.githubusercontent.com/${FAKE_REPO}/main/install.sh`));
  assert.ok(fetch, `curl was never asked for install.sh: ${JSON.stringify(r.curlCalls)}`);
  assert.match(fetch, /(^| )--max-time 60( |$)/, `the install.sh download carries no 60 s deadline: ${fetch}`);
  assertSealed(r, bin);
});

test('0284/reinstall-timeout-not-run: a timed-out install.sh download fails the update and is never run', () => {
  const home = temp('fkit-reinstall-home-');
  const root = install(temp('fkit-reinstall-root-'),
    { repo: FAKE_REPO, ref: 'main', bin: temp('fkit-reinstall-userbin-') });
  const bin = sealedBin({ curl: CURL_PARTIAL_TIMEOUT });
  const r = update(root, bin, { home });
  assert.equal(r.code, 1, `expected exit 1:\n${r.stdout}\n${r.stderr}`);
  assert.match(r.stderr, new RegExp(`fkit: could not download install\\.sh from ${FAKE_REPO}@main`));
  assert.match(r.stderr, /fkit: update failed\./);
  assert.ok(!r.stdout.includes('now at'), `printed "now at" after a timed-out download:\n${r.stdout}`);
  assert.equal(r.captured, null, 'the partial install.sh was run');
  assertAsked(r, FAKE_REPO, 'main');
  assertSealed(r, bin);
});
