// The self-update BANNER suite — the printf at the end of the launcher's automatic update check in
// claude/fkit-claude.sh (task 0257).
//
// SCOPE: exactly one line of output. The check TRIGGERS on shas (`[ "$remote" != "$installed" ]`,
// ADR-015 §4 — untouched by 0257) but used to LABEL itself with versions, so the two disagreed
// whenever content moved without a version bump — which is the normal case here (33 of 241 commits
// have ever touched VERSION). The three renderings that produced:
//   * `↑ fkit v0.2.1 → v0.2.1 is available` — same version on both sides, nonsense to a reader;
//   * `↑ fkit v0.2.1 → v? is available`     — no curl, so no remote version at all;
//   * `↑ fkit v? → v0.2.1 is available`     — an installed .version with no `version=` line.
// The fix renders a sentence that needs no second version, with the shas as the evidence — so the
// launcher no longer SUBSTITUTES a `?` for a version it does not have. That is the whole guarantee,
// and it is narrower than "no `v?` ever reaches the reader". Both sides are still only tested for
// non-emptiness (validating version strings was declined for 0257), so a VERSION whose CONTENT is
// literally `?` still renders verbatim. Measured on a sealed PATH, this turn:
//   * remote `?`, installed 9.9.9 → `↑ fkit v9.9.9 → v? is available`
//   * installed `?`, remote 9.9.9 → `↑ fkit v? → v9.9.9 is available`
//   * `?` on BOTH sides           → `↑ fkit v? — newer content on main (1111111 → deadbee)`
// i.e. a literal `?` reaches BOTH sides and BOTH renderings. What 0257 removed is the `v?` the
// EMPTY-version paths used to produce (absent curl, failed fetch, no `version=` line) — matching
// claude/fkit-claude.sh's own scope note. assertNoPlaceholder() below pins exactly that and no more:
// every case that calls it supplies versions which are empty, or equal and well-formed — none
// supplies a garbage version string, which is why none of them contradicts the three lines above.
//
// ⚠️ THIS FILE OWNS ITS FIXTURE — it does NOT use harness.mjs's makeProject/runFkit, and that is
// forced, not stylistic:
//   * the shared harness sets FKIT_NO_UPDATE_CHECK=1 on every run, which turns this whole feature
//     off. Nothing in this file may inherit that.
//   * the check is skipped inside a source checkout, and `share` is `$here/..` — so the launcher has
//     to be spawned from a COPY of claude/ whose parent has no .git and no package.json.
//     prove-red.sh's make_claude_copy() deliberately writes `: > "$dst/package.json"` to make its
//     copies read as checkouts, so its helpers are unusable here for the opposite reason.
//
// ⚠️ THE SEAL IS THE WHOLE TEST. Two of the planning runs for this task silently used the real
// /usr/bin/git and /usr/bin/curl and hit the network — a test written that way passes for the wrong
// reason and proves nothing. So: every case runs on a SEALED PATH containing nothing but symlinks to
// the handful of coreutils the launcher needs, plus whichever of git/curl the case wants stubbed.
// The real git and curl are not reachable from any test in this file. And the seal is PROVEN, never
// assumed — assertUnreachable() re-derives it from the same PATH string the launcher got, and the
// stubs log every invocation so a test can assert that OUR binary is the one that ran. Belt and
// braces: the fixture's repo is a name that does not exist on GitHub, so even a leak fetches nothing.
//
// ⚠️ DRIVEN THROUGH `--help`, NOT `FKIT_SETUP_ONLY=1` (a deliberate deviation from the plan's §5).
// The update check sits at :126-165 and the `--help` arm exits 0 at :168-196, so `--help` reaches
// past the banner and stops — no project setup, no init, nothing written outside the fixture. That
// is what makes a sealed PATH tractable at all: FKIT_SETUP_ONLY still runs the full init at :511,
// which needs a working toolchain the seal deliberately withholds (the plan's own §8 anticipated
// this: the fixture only needs enough tools to reach the end of the banner block). It is argv-blind, so
// nothing is lost — and the last test in this file pins that by driving a REAL `fkit coder`
// setup-only launch and requiring the same banner.
//
// ⚠️ FIXTURE VERSIONS ARE SYNTHETIC (9.9.x), NEVER the repo's VERSION. A release is imminent; a
// fixture that read the real VERSION would either go red on the bump or silently stop exercising the
// equal-version case, which is the whole defect.
//
// ⚠️ PROVE-RED: mutations 16 and 17 in test/prove-red.sh neuter the fix in a COPIED launcher and
// require the '0257/equal-versions' and '0257/no-curl' assertions below to go red BY NAME.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, chmodSync, symlinkSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// The claude/ tree the fixture copies its launcher from. FKIT_BANNER_ROOT is this file's prove-red
// seam — a whole-tree redirect, the FKIT_FRONTMATTER_ROOT pattern — so mutations 16/17 can point it
// at a deliberately-broken copy without touching the real launcher.
const DEFAULT_TREE = join(REPO, 'claude');
const CLAUDE_TREE = process.env.FKIT_BANNER_ROOT || DEFAULT_TREE;
if (CLAUDE_TREE !== DEFAULT_TREE) {
  process.stderr.write(`[update-banner] ⚠ testing NON-default claude/ tree via FKIT_BANNER_ROOT: ${CLAUDE_TREE}\n`);
}

// Synthetic throughout. `cut -c1-7` of these is what the banner prints: 1111111 and deadbee.
const INSTALLED_SHA = '1111111111111111111111111111111111111111';
const REMOTE_SHA = 'deadbee1111111111111111111111111111111111';
const INSTALLED_VERSION = '9.9.9';
// A repo that does not exist. Belt-and-braces behind the sealed PATH: if a real network tool ever
// leaked into a run, this is what it would ask for, and it resolves to nothing.
const FAKE_REPO = 'fkit-test/no-such-repo-0257';

// Every external command the launcher can reach before it exits at :196. Resolved with `command -v`
// rather than hard-coded under /usr/bin, so the sealed PATH is built correctly on CI's ubuntu image
// as well as on macOS.
const NEEDED_TOOLS = ['dirname', 'sed', 'head', 'cut', 'tr', 'find', 'awk', 'cat', 'printf', 'test', 'expr'];

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

// ── the sealed PATH ────────────────────────────────────────────────────────────────────────────

// A directory holding ONLY: symlinks to the coreutils above, plus the git/curl stubs this case asks
// for. `git: null` / `curl: null` means that tool is ABSENT — genuinely unreachable, not stubbed.
function sealedBin({ git = null, curl = null } = {}) {
  const dir = temp('fkit-banner-bin-');
  for (const t of NEEDED_TOOLS) {
    const p = which(t);
    if (p) { try { symlinkSync(p, join(dir, t)); } catch { /* shell builtin, or already linked */ } }
  }
  if (git) stub(dir, 'git', git);
  if (curl) stub(dir, 'curl', curl);
  return dir;
}

// Every stub logs its own argv first. That log is the POSITIVE half of the seal proof: only our
// binary writes it, so a non-empty log means the launcher reached ours and not the system's.
function stub(dir, name, body) {
  const p = join(dir, name);
  writeFileSync(p, `#!/bin/sh\nprintf '%s\\n' "$*" >> "$FKIT_TEST_${name.toUpperCase()}_LOG"\n${body}\n`);
  chmodSync(p, 0o755);
}

const GIT_OK = `case "$1" in\n  ls-remote) printf '%s\\tHEAD\\n' '${REMOTE_SHA}'; exit 0 ;;\nesac\nexit 1`;
const GIT_SAME = `case "$1" in\n  ls-remote) printf '%s\\tHEAD\\n' '${INSTALLED_SHA}'; exit 0 ;;\nesac\nexit 1`;
const GIT_FAIL = 'exit 128';                                   // offline: ls-remote cannot resolve
const CURL_VERSION = (v) => `printf '%s\\n' '${v}'; exit 0`;    // serves VERSION at raw.githubusercontent
const CURL_FAIL = 'exit 6';                                     // offline curl: "couldn't resolve host"

// The NEGATIVE half of the seal proof: re-derive reachability from the same PATH string the launcher
// was handed. Assuming absence is exactly the mistake this suite exists to not make.
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

// ── the fake install root ──────────────────────────────────────────────────────────────────────

// An install root that is NOT a source checkout: a copy of claude/ and a synthetic .version, with no
// .git and no package.json beside it. `share` is $here/.. — i.e. this root.
function install({ version = INSTALLED_VERSION, sha = INSTALLED_SHA, ref = 'main', checkout = false } = {}) {
  const root = temp('fkit-banner-root-');
  cpSync(join(CLAUDE_TREE), join(root, 'claude'), { recursive: true });
  const lines = [];
  if (version !== null) lines.push(`version=${version}`);
  if (sha !== null) lines.push(`sha=${sha}`);
  lines.push(`repo=${FAKE_REPO}`, `ref=${ref}`);
  writeFileSync(join(root, '.version'), `${lines.join('\n')}\n`);
  if (checkout) writeFileSync(join(root, 'package.json'), '{}\n');   // the source-checkout marker
  return root;
}

// One launch. env is built from NOTHING — process.env is deliberately not spread, so an inherited
// FKIT_NO_UPDATE_CHECK (the shared harness sets it) can never reach in and silence the feature.
function launch(root, bin, { args = ['--help'], env = {}, cwd = null, path = null, inheritEnv = false } = {}) {
  const logs = temp('fkit-banner-log-');
  const gitLog = join(logs, 'git'), curlLog = join(logs, 'curl');
  const PATH = path || bin;
  const base = inheritEnv ? { ...process.env } : {};
  delete base.FKIT_NO_UPDATE_CHECK;
  const r = spawnSync('/bin/sh', [join(root, 'claude', 'fkit-claude.sh'), ...args], {
    cwd: cwd || temp('fkit-banner-cwd-'),
    env: {
      ...base,
      PATH,
      HOME: temp('fkit-banner-home-'),
      FKIT_NO_SELF_HOST: '1',
      FKIT_TEST_GIT_LOG: gitLog,
      FKIT_TEST_CURL_LOG: curlLog,
      ...env,
    },
    encoding: 'utf8',
  });
  const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8').trim().split('\n').filter(Boolean) : []);
  return {
    code: r.status, stdout: r.stdout || '', stderr: r.stderr || '', PATH,
    gitCalls: read(gitLog), curlCalls: read(curlLog),
  };
}

// The banner is the only line starting with the ↑ marker; everything else on stdout is help text.
function banner(out) {
  const lines = out.split('\n').filter((l) => l.includes('↑ fkit'));
  return lines.length === 1 ? lines[0] : (lines.length === 0 ? null : lines.join(' ||| '));
}

const OLD_FORM = /^ {2}↑ fkit v(\S+) → v(\S+) is available\. Run: {2}fkit update$/;
const NEW_FORM = /^ {2}↑ fkit (?:v(\S+) )?— newer content on (\S+) \((\S+) → (\S+)\)\. Run: {2}fkit update$/;

// The defect, in one assertion: no EMPTY version may be papered over with a `?`. Not a claim that
// `v?` is unreachable in general — a VERSION containing a literal `?` still renders (see the header).
function assertNoPlaceholder(line) {
  assert.ok(!/v\?/.test(line), `the banner still renders a "v?" placeholder: ${line}`);
}

// ── 1. equal versions, differing sha — the headline defect ─────────────────────────────────────

test('0257/equal-versions: same version on both sides renders the newer-content form, never vX → vX',
  () => {
    const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION(INSTALLED_VERSION) });
    const r = launch(install(), bin);
    assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);

    const line = banner(r.stdout);
    assert.ok(line, `no banner printed at all:\n${r.stdout}`);
    // The defect: a sentence claiming an upgrade from a version to itself.
    assert.ok(!OLD_FORM.test(line), `still rendering the version→version form: ${line}`);
    assert.ok(!line.includes(`v${INSTALLED_VERSION} → v${INSTALLED_VERSION}`), `v9.9.9 → v9.9.9: ${line}`);
    assertNoPlaceholder(line);

    const m = line.match(NEW_FORM);
    assert.ok(m, `banner does not match the approved newer-content form: ${line}`);
    assert.equal(m[1], INSTALLED_VERSION, 'the installed version should still be named');
    assert.equal(m[2], 'main', 'the banner should name the tracked ref');
    assert.equal(m[3], '1111111', 'installed sha, abbreviated');
    assert.equal(m[4], 'deadbee', 'remote sha, abbreviated');

    // Seal: our git ran, and it is the only git that could have.
    assert.ok(r.gitCalls.some((c) => c.startsWith('ls-remote')), `the stub git was never called: ${JSON.stringify(r.gitCalls)}`);
    assertReachable(r.PATH, 'git', bin);
  });

// ── 2. genuinely differing versions — the familiar line, unchanged ─────────────────────────────

test('differing versions: the original vA → vB sentence is preserved verbatim', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION('9.9.9') });
  const r = launch(install({ version: '9.9.8' }), bin);
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);
  assert.equal(banner(r.stdout), '  ↑ fkit v9.9.8 → v9.9.9 is available. Run:  fkit update');
});

// ── 3. curl present but FAILING → no v? ────────────────────────────────────────────────────────

test('curl fails: no remote version, and no "v?" — the newer-content form carries it', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_FAIL });
  const r = launch(install(), bin);
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);
  const line = banner(r.stdout);
  assert.ok(line, `no banner printed:\n${r.stdout}`);
  assertNoPlaceholder(line);
  assert.ok(NEW_FORM.test(line), `expected the newer-content form: ${line}`);

  // Seal: our curl ran, and it was asked for the VERSION file — so the empty remote version is the
  // real code path, not a test artifact.
  assert.ok(r.curlCalls.length >= 1, 'the stub curl was never called');
  assert.ok(r.curlCalls.some((c) => c.includes(`${FAKE_REPO}/main/VERSION`)),
    `curl was not asked for the remote VERSION: ${JSON.stringify(r.curlCalls)}`);
});

// ── 4. curl ABSENT from a sealed PATH → no v? (the brief's step 3, proven by execution) ────────

test('0257/no-curl: curl unreachable — no "v?", and the seal is proven, not assumed', () => {
  const bin = sealedBin({ git: GIT_OK });                 // git only: curl is genuinely not there
  const r = launch(install(), bin);
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);

  // PROVE THE SEAL FIRST — a leaked system curl would fetch a real VERSION and make the assertion
  // below pass for the wrong reason. Both halves: curl resolves nowhere on this PATH, and the git
  // that answered was demonstrably ours.
  assertUnreachable(r.PATH, 'curl');
  assert.equal(r.curlCalls.length, 0, 'something invoked a curl stub that should not exist');
  assert.ok(r.gitCalls.some((c) => c.startsWith('ls-remote')), 'the stub git was never called — PATH is not ours');
  assertReachable(r.PATH, 'git', bin);

  const line = banner(r.stdout);
  assert.ok(line, `no banner printed:\n${r.stdout}`);
  assertNoPlaceholder(line);
  const m = line.match(NEW_FORM);
  assert.ok(m, `expected the newer-content form: ${line}`);
  assert.equal(m[1], INSTALLED_VERSION);
  assert.equal(m[4], 'deadbee');
});

// ── 5. an installed .version with no version= line → no v? on the INSTALLED side either ─────────

test('installed .version has no version= line: renders without a stray v, and without "v?"', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_FAIL });
  const r = launch(install({ version: null }), bin);
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);
  const line = banner(r.stdout);
  assert.ok(line, `no banner printed:\n${r.stdout}`);
  assertNoPlaceholder(line);
  assert.equal(line, '  ↑ fkit — newer content on main (1111111 → deadbee). Run:  fkit update');
});

// ── 6. the ref is read, not hard-coded ─────────────────────────────────────────────────────────

test('a non-default ref: the banner names the tracked ref, not a hard-coded main', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION(INSTALLED_VERSION) });
  const r = launch(install({ ref: 'next' }), bin);
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);
  assert.equal(banner(r.stdout).match(NEW_FORM)[2], 'next');
});

// ── 7-10. the silences: current, offline, checkout, opted out ──────────────────────────────────

test('installed sha == remote sha: complete silence', () => {
  const bin = sealedBin({ git: GIT_SAME, curl: CURL_VERSION('9.9.99') });
  const r = launch(install(), bin);
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);
  assert.equal(banner(r.stdout), null, `a current install printed a banner:\n${r.stdout}`);
  // NOT `!stdout.includes('fkit update')` — the --help text this suite drives through legitimately
  // documents the `fkit update` verb. The ↑ marker is what only the banner ever prints.
  assert.ok(!r.stdout.includes('↑'), `a current install printed an update marker:\n${r.stdout}`);

  // Silence must come from a probe that RAN and matched — not from a probe that never happened.
  // Without this, a fixture whose git went missing would pass here for the wrong reason (an empty
  // $remote fails the `[ -n "$remote" ]` guard at :138, which is also silent).
  // ⚠️ WHAT THIS DOES NOT CATCH, measured: swapping GIT_SAME→GIT_FAIL still passes. The stub logs
  // its argv BEFORE running its body, so gitCalls is non-empty even when git exits 128 — and a
  // failed probe is genuinely indistinguishable from a match here, since `.latest` is written only
  // inside the trigger branch. That half is covered next door: test 1 shares this install() fixture
  // with GIT_OK, so a harness this dead reds there.
  assert.ok(r.gitCalls.some((c) => c.startsWith('ls-remote')), 'the stub git was never called — PATH is not ours');
  assertReachable(r.PATH, 'git', bin);
});

test('offline (git fails, curl unreachable): complete silence, exit 0', () => {
  const bin = sealedBin({ git: GIT_FAIL });
  const r = launch(install(), bin);
  assertUnreachable(r.PATH, 'curl');
  assert.equal(r.code, 0, `an offline launch must still succeed:\n${r.stderr}`);
  assert.equal(banner(r.stdout), null, `offline printed a banner:\n${r.stdout}`);
  assert.equal(r.stderr, '', `offline leaked to stderr:\n${r.stderr}`);
  assert.ok(r.gitCalls.some((c) => c.startsWith('ls-remote')), 'the stub git was never called — PATH is not ours');
});

test('a source checkout: the whole check is skipped — silence, and no network call at all', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION('9.9.99') });
  const r = launch(install({ checkout: true }), bin);
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);
  assert.equal(banner(r.stdout), null, `a source checkout printed a banner:\n${r.stdout}`);
  assert.equal(r.gitCalls.length, 0, 'a source checkout must not reach the network');
  assert.equal(r.curlCalls.length, 0, 'a source checkout must not reach the network');
});

test('FKIT_NO_UPDATE_CHECK=1: silence, and no network call at all', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION('9.9.99') });
  const r = launch(install(), bin, { env: { FKIT_NO_UPDATE_CHECK: '1' } });
  assert.equal(r.code, 0, `launch failed:\n${r.stderr}`);
  assert.equal(banner(r.stdout), null, `the opt-out printed a banner:\n${r.stdout}`);
  assert.equal(r.gitCalls.length, 0, 'the opt-out must not reach the network');
  assert.equal(r.curlCalls.length, 0, 'the opt-out must not reach the network');
});

// ── 11. the throttle ───────────────────────────────────────────────────────────────────────────

test('throttle: the first launch banners, a second inside the window is silent', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION(INSTALLED_VERSION) });
  const root = install();
  const first = launch(root, bin);
  assert.ok(banner(first.stdout), `the first launch did not banner:\n${first.stdout}`);
  const second = launch(root, bin);
  assert.equal(second.code, 0);
  assert.equal(banner(second.stdout), null, `the throttle did not hold:\n${second.stdout}`);
  assert.equal(second.gitCalls.length, 0, 'inside the window the launcher must stay off the network');
  assert.ok(existsSync(join(root, '.update-check')), 'the throttle stamp was not written');
});

// ── 12. .latest is still recorded ──────────────────────────────────────────────────────────────

test('.latest still records the remote version and sha', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION(INSTALLED_VERSION) });
  const root = install();
  launch(root, bin);
  const latest = readFileSync(join(root, '.latest'), 'utf8');
  assert.match(latest, /^version=9\.9\.9$/m);
  assert.match(latest, new RegExp(`^sha=${REMOTE_SHA}$`, 'm'));
});

test('.latest keeps its own unknown fallback when the remote version is unavailable', () => {
  const bin = sealedBin({ git: GIT_OK, curl: CURL_FAIL });
  const root = install();
  const r = launch(root, bin);
  assert.match(readFileSync(join(root, '.latest'), 'utf8'), /^version=unknown$/m);

  // `unknown` has to mean "we asked and could not find out", not "we never asked" — both write the
  // same byte. Measured without this: drop the curl stub entirely and the assertion above still
  // passes. Same guard as the sibling at the curl-fails case above.
  assert.ok(r.curlCalls.some((c) => c.includes(`${FAKE_REPO}/main/VERSION`)),
    `curl was never asked for the remote VERSION: ${JSON.stringify(r.curlCalls)}`);
});

// ── 13. fidelity: the banner is not an artifact of the --help driver ───────────────────────────

test('a real role launch banners too: --help is only this suite\'s driver, not the trigger', () => {
  // The one case that runs the full setup path, so it needs a real toolchain: the stub dir is
  // PREPENDED to the inherited PATH rather than replacing it. Prepending is what seals it — our
  // git/curl shadow the system ones — and the assertions below prove the shadowing actually held.
  const bin = sealedBin({ git: GIT_OK, curl: CURL_VERSION(INSTALLED_VERSION) });
  const path = `${bin}:${process.env.PATH}`;
  assertReachable(path, 'git', bin);
  assertReachable(path, 'curl', bin);

  const r = launch(install(), bin, {
    args: ['coder'], path, inheritEnv: true, env: { FKIT_SETUP_ONLY: '1' },
  });
  assert.equal(r.code, 0, `setup-only launch failed:\n${r.stdout}\n${r.stderr}`);
  const line = banner(r.stdout);
  assert.ok(line, `a real role launch printed no banner:\n${r.stdout}`);
  assertNoPlaceholder(line);
  assert.ok(NEW_FORM.test(line), `expected the newer-content form: ${line}`);
  assert.ok(r.gitCalls.some((c) => c.startsWith('ls-remote')), 'the stub git was never called — the shadow did not hold');
});
