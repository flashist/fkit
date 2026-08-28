// The post-release SUMMARY-BLOCK suite — the last block of bin/release.mjs (task 0288).
//
// SCOPE: what the summary prints, on each path, and, since task 0300, the `--branch` preflight guard
// above it plus the post-gate HEAD compare. Nothing else in release.mjs is under test here, and
// ⛔ nothing in this file may change tag, push or bump BEHAVIOUR — 0288 is fenced to the summary
// block (owner-ruled 2026-08-13, "Report truthfully only — stay inside the fence").
//
// The block used to be written as if the default path were the only path: it printed `✓ Released
// <tag>` plus a tag-verify command on every non-dry run, including runs that created no tag, pushed
// no tag, or did not move a tag that was already on origin. That produced four measured defects:
//   * R1 — `--no-tag` / `--no-push` print a verify that exits 2. Including `--no-tag` ALONE, which
//     genuinely publishes commits: it pushed main and then named a tag it had just declined to make.
//   * R2 — `--no-bump` over a tag already on origin prints a check that exits 0 against a STALE tag.
//     A false green, directly under `✓ Released`. `git ls-remote` prints the TAG OBJECT sha, not the
//     peeled commit, so a human cannot eyeball this either — the peel (`<tag>^{}`) is what carries it.
//   * R5 — the printed check fails SILENTLY: tag absent → exit 2 with no output on either stream.
//     ⛔ NOT "the exit codes are ambiguous" — they are 0 / 2 / 128 and distinct, and 128 prints its
//     own `fatal:`. Measured. The defect is the silence of the exit-2 case alone.
//   * N1 — `--no-bump` with the tag existing LOCALLY BUT NOT ON ORIGIN: the tag push lives inside the
//     tag-CREATION block, which is skipped, so it never runs and nothing says so. The script's own
//     header sends a maintainer here to finish a partially-failed release.
//
// ⚠️ R2 AND N1 ARE DIFFERENT BUGS AND ARE TESTED SEPARATELY (0288/stale-origin-tag vs
// 0288/local-only-tag). Both fire under `--no-bump`, and that resemblance is the trap: a single guard
// on `localTagExists || remoteTagExists` fixes one and leaves the other. So does the naive
// `doTag && doPush` guard — both flags are TRUE in N1's state. prove-red mutation 19 pins exactly that.
//
// ⚠️ WHAT THIS FILE DOES NOT COVER: N1's underlying recovery gap is ACCEPTED, NOT FIXED. After 0288 a
// `--no-bump` run still cannot finish a release whose tag is local-only; it stops lying about it and
// prints the by-hand command. 0288/local-only-tag asserts the tag is STILL not on origin afterwards —
// that assertion is the fence, tested. ⛔ Do not "fix" it by making the script push the tag.
//
// ⚠️ THE FIXTURE IS THE WHOLE SEAL. release.mjs derives KIT as `resolve(__dirname, "..")`, so a copy
// at <fixture>/bin/release.mjs operates on the fixture and CANNOT reach this repo. Every fixture has
// a LOCAL BARE origin; no test here can reach flashist/fkit. Both halves are ASSERTED, not assumed:
// makeFixture() refuses to proceed unless `git remote get-url origin` resolves inside its own tmp dir.
//
// ⚠️ PROVE-RED: mutations 18-22 in test/prove-red.sh break the summary block, mutation 25 the --branch
// preflight above it and 26 the post-gate HEAD compare, in a COPIED release.mjs (pointed at via FKIT_RELEASE_MJS, this file's seam) and
// require the named assertions below to go red BY NAME. Note 22 reds 0288/failure-speaks as well as 0288/default-released, and that is inherent
// rather than sloppy: failure-speaks runs the command the DEFAULT path printed, so a mutation that
// stops the default path printing it takes both. Mutations 18-21 each leave the default path green.
//
// ⚠️ TASK 0300 — the `--branch` preflight guard, tested in the 0300/* section at the end of this file.
// It is NOT summary-block work: it is a refusal that runs above the test gate and above the first
// write, so `--branch <other>` can no longer commit and tag HEAD while pushing a different ref and
// then print ✓ Released. The 0288 fence above is untouched — 0300 adds a preflight, it does not change
// what the summary says on any accepted path. prove-red mutation 25 disarms the guard and requires
// 0300/branch-mismatch-refused to go red by name.
// Round-2 review R8 added a SECOND check, after the test gate: HEAD must still be on the branch the
// preflight saw, or the run is refused before the first write — otherwise a `git switch` during the
// ~6-minute gate commits and tags one branch and pushes another, the same defect through a race.
// prove-red mutation 26 disarms that compare and requires 0300/head-moved-during-test-gate-refused
// to go red by name.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, cpSync, rmSync, readFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// The script under test. FKIT_RELEASE_MJS is this file's prove-red seam — a single-file redirect (the
// FKIT_LAUNCHER pattern), so mutations 18-22, 25 and 26 can point it at a deliberately-broken copy without ever
// touching the real bin/release.mjs.
// ⚠️ Announce a non-default source to stderr: a STALE inherited FKIT_RELEASE_MJS would otherwise make
// `npm test` silently test some other file and report green while the real one is broken.
const DEFAULT_RELEASE = join(REPO, 'bin', 'release.mjs');
const RELEASE_MJS = process.env.FKIT_RELEASE_MJS || DEFAULT_RELEASE;
if (RELEASE_MJS !== DEFAULT_RELEASE) {
  process.stderr.write(`[release-summary] ⚠ testing NON-default release.mjs via FKIT_RELEASE_MJS: ${RELEASE_MJS}\n`);
}

const MADE = [];
after(() => MADE.forEach((d) => { try { rmSync(d, { recursive: true, force: true }); } catch { /* best effort */ } }));

function git(cwd, args, { check = true } = {}) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (check && r.status !== 0) {
    throw new Error(`git ${args.join(' ')} exited ${r.status}\n${(r.stderr || r.stdout || '').trim()}`);
  }
  return { status: r.status, out: (r.stdout || '').trim() };
}

// A throwaway repo whose `origin` is a LOCAL BARE repository, with the script under test copied in.
function makeFixture() {
  const root = mkdtempSync(join(tmpdir(), 'fkit-release-summary-'));
  MADE.push(root);
  const origin = join(root, 'origin.git');
  const repo = join(root, 'repo');
  git(root, ['init', '--bare', '-q', origin]);
  git(root, ['init', '-q', '-b', 'main', repo]);
  // Config is written into the FIXTURE only — never --global. Signing is forced off because a
  // maintainer machine with commit.gpgsign/tag.gpgsign on would otherwise prompt, hang, or fail.
  // ⚠️ `push.followTags` is pinned for a DIFFERENT and sharper reason (review R2, MEASURED): with it
  // on globally, `git push origin main` also publishes any annotated tag reachable from the pushed
  // ref — so 0288/local-only-tag's fence assertion fired on a maintainer's own machine and accused
  // release.mjs of pushing a tag it never touched. Because release.mjs gates every release on
  // `npm test`, that false red meant such a maintainer could not cut a release AT ALL. The pin makes
  // `push.followTags` read git's documented DEFAULT here whatever the host is configured to — it pins
  // that ONE setting, not the fixture as a whole. ⚠️ Known remaining host dependency (review R8,
  // MEASURED): a global `core.hooksPath` with a rejecting `pre-commit` still reds all 15 tests.
  // Pre-existing and outside 0288's fence — hook isolation is deliberately NOT added here.
  for (const [k, v] of [
    ['user.name', 'fkit fixture'],
    ['user.email', 'fixture@example.invalid'],
    ['commit.gpgsign', 'false'],
    ['tag.gpgsign', 'false'],
    ['push.followTags', 'false'],
  ]) git(repo, ['config', k, v]);
  git(repo, ['remote', 'add', 'origin', origin]);

  // ⛔ SEAL 1, ASSERTED NOT ASSUMED, AND ASSERTED BEFORE THE FIRST PUSH: this fixture's origin must
  // live inside its own tmp dir. The brief's non-negotiable safety rule ("never push to flashist/fkit,
  // never create or delete a tag on the real origin") is worth nothing as an intention; this is it
  // made structural. A fixture that ever resolved origin to the real repo dies HERE instead of
  // pushing to it — which is only true because this runs before the `git push` below (review R4:
  // it used to sit after it, so its own comment was false by ordering).
  const url = git(repo, ['remote', 'get-url', 'origin']).out;
  assert.ok(url.startsWith(root), `fixture origin is OUTSIDE the tmp dir — refusing to run: ${url}`);
  assert.ok(!url.startsWith(REPO), `fixture origin points into the real repo — refusing to run: ${url}`);

  writeFileSync(join(repo, 'VERSION'), '0.1.0\n');
  writeFileSync(join(repo, 'package.json'), '{\n  "version": "0.1.0"\n}\n');
  writeFileSync(join(repo, 'file.txt'), 'content\n');
  mkdirSync(join(repo, 'bin'));
  cpSync(RELEASE_MJS, join(repo, 'bin', 'release.mjs'));
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-q', '-m', 'initial']);
  git(repo, ['push', '-q', 'origin', 'main']);
  return { root, origin, repo };
}

function commitWork(repo, text = 'work\n') {
  appendFileSync(join(repo, 'file.txt'), text);
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-q', '-m', 'work']);
}

// One release run. ⛔ SEAL 2: `--no-test` is hard-coded and asserted present. Without it release.mjs
// runs `npm test` in the fixture. Measured, this turn: the fixture's package.json has no `test`
// script, so that run ABORTS (exit 1, "npm error Missing script") rather than recursing — i.e. the
// seal is not today load-bearing against an infinite loop, and this comment says so rather than
// claiming a recursion that was not observed. It is kept because the cost is one assertion and the
// failure mode it guards is real for any future fixture that copies a package.json carrying a test
// script: `npm test` → this file → `npm test`, unbounded.
function release(repo, args = []) {
  const argv = ['--no-test', ...args];
  assert.ok(argv.includes('--no-test'), 'the fixture must never run release.mjs with its test gate ON');
  const r = spawnSync('node', [join(repo, 'bin', 'release.mjs'), ...argv], { cwd: repo, encoding: 'utf8' });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

// The ONE gate-ON run (0300/head-moved-during-test-gate-refused): the fact under test is what happens
// AFTER `npm test` has run, so the gate must run. This does not open the hole SEAL 2 is for — that
// hole is a fixture test script that re-enters this suite (`npm test` → this file → `npm test`). So
// the seal moves, it does not drop: the fixture's test script is asserted to be present and to name
// no `npm`, `node` or `release` — a git one-liner can move HEAD but cannot recurse.
function releaseWithGateOn(repo, args = []) {
  assert.ok(!args.includes('--no-test'), 'releaseWithGateOn() is for the gate-ON case — use release() otherwise');
  const script = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).scripts?.test;
  assert.ok(typeof script === 'string' && script.length > 0, 'gate-ON fixture has no test script — npm test would abort, proving nothing');
  assert.ok(!/npm|node|release/.test(script), `gate-ON fixture test script could recurse into this suite: ${script}`);
  const r = spawnSync('node', [join(repo, 'bin', 'release.mjs'), ...args], { cwd: repo, encoding: 'utf8' });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

// The summary block is everything from the horizontal rule onward.
function summary(stdout) {
  const i = stdout.indexOf('─'.repeat(48));
  assert.notEqual(i, -1, `no summary rule in output:\n${stdout}`);
  return stdout.slice(i).trim();
}

// Pull a printed shell command out of the summary: the tail of the line carrying `marker`, from its
// first `git ` onward. Anchored on the command, not on the label's wording.
function printedCommand(text, marker) {
  const line = text.split('\n').find((l) => l.includes(marker));
  assert.ok(line, `no printed line containing ${JSON.stringify(marker)}:\n${text}`);
  const i = line.indexOf('git ');
  assert.ok(i >= 0, `that line names no git command: ${line}`);
  return line.slice(i).trim();
}

// Execute a command the script printed — the point of the whole exercise (0254 shipped a command
// nobody ran). ⛔ Read-only verbs ONLY: a printed command that is not a `git ls-remote` / `git
// rev-parse` is refused rather than run, so a mutated or mistaken script can never get this suite to
// execute a push or a tag write. This is a leading-verb check and nothing more.
const READ_ONLY = [/^git ls-remote /, /^git rev-parse /];
function execPrinted(repo, cmd) {
  assert.ok(READ_ONLY.some((re) => re.test(cmd)),
    `refusing to execute a printed command that is not a read-only git verb: ${cmd}`);
  const r = spawnSync('/bin/sh', ['-c', cmd], { cwd: repo, encoding: 'utf8' });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

const originTags = (repo, tag) => git(repo, ['ls-remote', '--tags', 'origin', tag]).out;
const originMain = (repo) => git(repo, ['ls-remote', 'origin', 'refs/heads/main']).out.split('\t')[0];

// ── 1. the default path — the one case the pre-0288 line already got right ─────────────────────

test('0288/default-released: the default path still announces the release, and the command it prints EXITS 0',
  () => {
    const { repo } = makeFixture();
    commitWork(repo);
    const r = release(repo);
    assert.equal(r.code, 0, `default run failed:\n${r.stdout}\n${r.stderr}`);
    const s = summary(r.stdout);

    // The headline is byte-identical to pre-0288 — this is the case a real release cut runs.
    assert.ok(s.includes('✓ Released v0.1.1'), `default path lost its released headline:\n${s}`);
    assert.ok(s.includes('Verify tag on origin'), `default path printed no verify line:\n${s}`);

    // Run what it printed. Success behaviour is byte-identical too: git prints the sha, exit 0.
    const cmd = printedCommand(s, 'Verify tag on origin');
    const x = execPrinted(repo, cmd);
    assert.equal(x.code, 0, `the printed verify command did not exit 0: ${cmd}\n${x.stdout}\n${x.stderr}`);
    assert.match(x.stdout, /refs\/tags\/v0\.1\.1/, `the printed command did not confirm the tag: ${x.stdout}`);
    assert.notEqual(originTags(repo, 'v0.1.1'), '', 'the default path should have pushed the tag');
  });

// ── 2. --no-tag ALONE — the publishing case the original review missed ─────────────────────────

test('0288/no-tag: commits are published and said to be, and nothing directs the reader at a tag that was never created',
  () => {
    const { repo } = makeFixture();
    commitWork(repo);
    const before = originMain(repo);
    const r = release(repo, ['--no-tag']);
    assert.equal(r.code, 0, `--no-tag run failed:\n${r.stdout}\n${r.stderr}`);
    const s = summary(r.stdout);

    // R1's core: no released headline, and no instruction to verify a tag on origin.
    assert.ok(!s.includes('✓ Released'), `--no-tag still claims a release:\n${s}`);
    assert.ok(!s.includes('Verify tag on origin'), `--no-tag still prints a tag-verify instruction:\n${s}`);
    assert.ok(/no tag was created/.test(s), `--no-tag does not say no tag was created:\n${s}`);

    // ⚠️ AND the half a `doTag && doPush` guard would silently lose: this run PUBLISHES. Suppressing
    // the verify line is not enough — the summary must still state that the commits landed.
    const after = originMain(repo);
    assert.notEqual(after, before, 'the --no-tag run did not actually push main — fixture is wrong');
    assert.ok(s.includes('Pushed'), `a run that published commits does not say so:\n${s}`);
    assert.equal(originTags(repo, 'v0.1.1'), '', 'no tag should exist on origin after --no-tag');
  });

// ── 3. --no-push — nothing left this machine ───────────────────────────────────────────────────

test('0288/no-push: nothing was pushed, the summary says so, and origin is untouched', () => {
  const { repo } = makeFixture();
  commitWork(repo);
  const before = originMain(repo);
  const r = release(repo, ['--no-push']);
  assert.equal(r.code, 0, `--no-push run failed:\n${r.stdout}\n${r.stderr}`);
  const s = summary(r.stdout);

  assert.ok(!s.includes('✓ Released'), `--no-push still claims a release:\n${s}`);
  assert.ok(!s.includes('Verify tag on origin'), `--no-push still prints a tag-verify instruction:\n${s}`);
  assert.ok(/nothing was pushed/.test(s), `--no-push does not say nothing was pushed:\n${s}`);
  assert.equal(originMain(repo), before, 'a --no-push run moved origin/main');
  assert.equal(originTags(repo, 'v0.1.1'), '', 'a --no-push run pushed a tag');
});

// ── 4. R2 — a tag already on origin, which this run did not move ───────────────────────────────

test('0288/stale-origin-tag: no false green — the summary prints the PEEL, and running it shows a commit that is not HEAD',
  () => {
    const { repo } = makeFixture();
    // The false-green setup: an annotated tag on origin at commit A, then a new commit B.
    git(repo, ['tag', '-a', 'v0.1.0', '-m', 'Release v0.1.0']);
    git(repo, ['push', '-q', 'origin', 'v0.1.0']);
    const peeledA = git(repo, ['rev-parse', 'v0.1.0^{}']).out;
    commitWork(repo, 'new work\n');

    const r = release(repo, ['--no-bump']);
    assert.equal(r.code, 0, `--no-bump run failed:\n${r.stdout}\n${r.stderr}`);
    const s = summary(r.stdout);

    assert.ok(!s.includes('✓ Released'), `a run that moved no tag still claims a release:\n${s}`);
    assert.ok(/did NOT move it/.test(s), `the summary does not say the tag was left alone:\n${s}`);

    // ⚠️ THE PEEL IS THE POINT. A plain existence check passes here whether or not the tag names this
    // release — that IS the defect. Assert the printed command asks for the peeled ref by name, and
    // that running it returns the tag's commit, which is NOT what this run pushed.
    const cmd = printedCommand(s, 'Which commit the tag names');
    assert.ok(cmd.includes('^{}'), `the printed command is not a peel — a bare existence check cannot close R2: ${cmd}`);
    const x = execPrinted(repo, cmd);
    assert.equal(x.code, 0, `the printed peel command failed: ${cmd}\n${x.stderr}`);
    const named = x.stdout.trim().split(/\s/)[0];
    assert.equal(named, peeledA, `the peel did not return the tagged commit: ${x.stdout}`);

    const head = git(repo, ['rev-parse', 'HEAD']).out;
    assert.notEqual(named, head, 'fixture is wrong: the tag already names HEAD, so there is no false green to catch');
    assert.equal(originMain(repo), head, 'the --no-bump run should still have pushed the branch');
  });

// ── 5. N1 — a tag that exists locally and was never pushed ─────────────────────────────────────

test('0288/local-only-tag: the run says the release is UNFINISHED and the tag unpushed — and does not push it',
  () => {
    const { repo } = makeFixture();
    git(repo, ['tag', '-a', 'v0.1.0', '-m', 'Release v0.1.0']);   // local only — never pushed
    commitWork(repo, 'more\n');
    assert.equal(originTags(repo, 'v0.1.0'), '', 'fixture is wrong: the tag is already on origin');

    const r = release(repo, ['--no-bump']);
    assert.equal(r.code, 0, `--no-bump run failed:\n${r.stdout}\n${r.stderr}`);
    const s = summary(r.stdout);

    assert.ok(!s.includes('✓ Released'), `an unfinished release still claims to have landed:\n${s}`);
    assert.ok(/UNFINISHED/.test(s), `the summary does not flag the release as unfinished:\n${s}`);
    assert.ok(/was NOT pushed/.test(s), `the summary does not say the tag was not pushed:\n${s}`);

    // ⛔ THE FENCE, TESTED. 0288 reports the truth; it does NOT restore the recovery. If this ever
    // fails because the tag IS on origin, someone has lifted a fence that the owner closed.
    assert.equal(originTags(repo, 'v0.1.0'), '',
      '0288 must NOT push the tag — the fence (owner-ruled 2026-08-13) has been lifted');
  });

// ── 6. R5 — the failing case must not be silent ────────────────────────────────────────────────

test('0288/failure-speaks: with the tag gone from origin, the command the default path printed SAYS SO',
  () => {
    const { repo } = makeFixture();
    commitWork(repo);
    const r = release(repo);
    const cmd = printedCommand(summary(r.stdout), 'Verify tag on origin');

    // Take the tag away from the fixture's own bare origin, then re-run the very same command.
    git(repo, ['push', '-q', 'origin', ':refs/tags/v0.1.1']);
    assert.equal(originTags(repo, 'v0.1.1'), '', 'the tag was not removed from the fixture origin');

    const x = execPrinted(repo, cmd);
    assert.notEqual(x.code, 0, `a failing check reported success: ${cmd}`);
    // The defect was silence on BOTH streams. ⛔ Not a claim that 2 and 128 were ever ambiguous:
    // they are distinct, and the real git code is carried in the message.
    const said = `${x.stdout}${x.stderr}`.trim();
    assert.notEqual(said, '', `the failing check is still SILENT on both streams: ${cmd}`);
    assert.match(said, /git exit 2\b/, `the failing check does not report git's own exit code: ${said}`);
  });

// ── 7. --dry-run — unchanged, and touches nothing ──────────────────────────────────────────────

test('0288/dry-run: the dry-run branch is untouched and writes nothing', () => {
  const { repo } = makeFixture();
  commitWork(repo);
  const r = release(repo, ['--dry-run']);
  assert.equal(r.code, 0, `--dry-run failed:\n${r.stdout}\n${r.stderr}`);
  assert.equal(summary(r.stdout).split('\n').slice(1).join('\n').trim(),
    'Dry run — nothing was changed. Re-run without --dry-run to release.');
  assert.equal(readFileSync(join(repo, 'VERSION'), 'utf8').trim(), '0.1.0', '--dry-run bumped VERSION');
  assert.equal(git(repo, ['tag', '--list']).out, '', '--dry-run created a tag');
  assert.equal(git(repo, ['status', '--porcelain']).out, '', '--dry-run left the tree dirty');
});

// ── 0300. --branch must be the checked-out branch ──────────────────────────────────────────────
// `git commit` and `git tag -a` act on HEAD; only the push reads --branch. Before task 0300 a
// `--branch <other>` run therefore committed and tagged one ref, pushed another (a no-op when
// `other` was already up to date), and still printed ✓ Released. The guard is a PREFLIGHT refusal —
// it fires before the test gate and before the first write, so a refused run leaves the tree exactly
// as the user left it. These tests assert that clean abort, not just the exit code.
// The `other` branch is created INSIDE each test — makeFixture() stays byte-identical for 0288.

function fixtureWithOther() {
  const f = makeFixture();
  git(f.repo, ['branch', 'other']);
  git(f.repo, ['push', '-q', 'origin', 'other']);
  return f;
}
const lsRemote = (repo) => git(repo, ['ls-remote', 'origin']).out;
const fileVersion = (repo, name) => readFileSync(join(repo, name), 'utf8');

test('0300/branch-mismatch-refused: --branch <other> exits 1 before any mutation — tree, HEAD, tags and origin untouched',
  () => {
    const { repo } = fixtureWithOther();
    commitWork(repo);
    appendFileSync(join(repo, 'file.txt'), 'unstaged\n');   // left UNSTAGED on purpose — the abort must not `git add` it
    const head = git(repo, ['rev-parse', 'HEAD']).out;
    const remote = lsRemote(repo);

    const r = release(repo, ['--branch', 'other']);
    assert.equal(r.code, 1, `--branch other was not refused:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /✗ --branch other/, `the refusal does not name the flag and value:\n${r.stderr}`);
    assert.match(r.stderr, /HEAD is on main/, `the refusal does not say which branch IS checked out:\n${r.stderr}`);
    assert.match(r.stderr, /git switch other/, `the refusal offers no way forward:\n${r.stderr}`);

    // Nothing ran: no step lines, no summary, and — the ordering proof — not even the --no-test
    // warning, which the test gate prints. The guard sits ABOVE the gate.
    for (const s of ['• commit', 'push origin', '✓ Released', '─'.repeat(48)]) {
      assert.ok(!r.stdout.includes(s), `a refused run still printed ${JSON.stringify(s)}:\n${r.stdout}`);
    }
    assert.ok(!r.stderr.includes('--no-test: releasing WITHOUT'),
      `the guard fired AFTER the test gate — a refused run would already have run npm test:\n${r.stderr}`);

    // The clean abort, asserted: no bump, no add, no commit, no tag, origin unmoved.
    assert.equal(fileVersion(repo, 'VERSION').trim(), '0.1.0', 'a refused run bumped VERSION');
    assert.equal(JSON.parse(fileVersion(repo, 'package.json')).version, '0.1.0', 'a refused run bumped package.json');
    assert.equal(git(repo, ['rev-parse', 'HEAD']).out, head, 'a refused run moved HEAD');
    assert.equal(git(repo, ['tag', '--list']).out, '', 'a refused run created a tag');
    // Raw porcelain, NOT via git(): that helper trims, and the leading space IS the fact under test —
    // ` M` is unstaged, `M ` is staged.
    const porcelain = spawnSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' }).stdout.replace(/\n$/, '');
    assert.equal(porcelain, ' M file.txt',
      'a refused run staged or committed the unstaged edit (expected " M file.txt" — unstaged, not "M  file.txt")');
    assert.equal(lsRemote(repo), remote, 'a refused run changed something on origin');
  });

test('0300/mismatch-under-no-push-and-dry-run: the guard fires under --no-push and --dry-run — no wrong recovery line, no plan',
  () => {
    for (const args of [['--branch', 'other', '--no-push'], ['--branch', 'other', '--dry-run']]) {
      const { repo } = fixtureWithOther();
      commitWork(repo);
      const r = release(repo, args);
      const label = args.join(' ');
      assert.equal(r.code, 1, `${label} was not refused:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stderr, /✗ --branch other/, `${label}: refusal does not name the flag:\n${r.stderr}`);
      // The pre-0300 --no-push output ended `Finish it with: git push origin other && …` while the
      // commit sat on main — the wrong recovery line. And a dry-run must not print a plan it would
      // refuse to execute.
      assert.ok(!r.stdout.includes('Finish it with'), `${label} printed a recovery line for a refused run:\n${r.stdout}`);
      assert.ok(!r.stdout.includes('Dry run'), `${label} printed a dry-run plan for a refused run:\n${r.stdout}`);
      assert.equal(git(repo, ['tag', '--list']).out, '', `${label} created a tag`);
      assert.equal(fileVersion(repo, 'VERSION').trim(), '0.1.0', `${label} bumped VERSION`);
    }
  });

test('0300/branch-current-explicit-released: --branch <current> is accepted — exit 0, ✓ Released, origin/main and the tag both at HEAD',
  () => {
    const { repo } = fixtureWithOther();
    commitWork(repo);
    const r = release(repo, ['--branch', 'main']);
    assert.equal(r.code, 0, `--branch main (the checked-out branch) was refused:\n${r.stdout}\n${r.stderr}`);
    const s = summary(r.stdout);
    assert.ok(s.includes('✓ Released v0.1.1'), `--branch main lost the released headline:\n${s}`);
    const head = git(repo, ['rev-parse', 'HEAD']).out;
    assert.equal(originMain(repo), head, '--branch main did not push main to HEAD');
    assert.notEqual(originTags(repo, 'v0.1.1'), '', '--branch main did not push the tag');
    assert.equal(git(repo, ['rev-parse', 'v0.1.1^{}']).out, head, 'the tag does not name HEAD');
  });

test('0300/detached-head-with-branch-refused: on a detached HEAD, --branch <name> is refused and the message says so',
  () => {
    const { repo } = fixtureWithOther();
    git(repo, ['checkout', '-q', '--detach']);
    const remote = lsRemote(repo);
    const r = release(repo, ['--branch', 'main']);
    assert.equal(r.code, 1, `detached HEAD + --branch main was not refused:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /✗ --branch main/, `the refusal does not name the flag:\n${r.stderr}`);
    assert.match(r.stderr, /HEAD is detached/, `the refusal does not say HEAD is detached:\n${r.stderr}`);
    assert.equal(fileVersion(repo, 'VERSION').trim(), '0.1.0', 'a refused run bumped VERSION');
    assert.equal(git(repo, ['tag', '--list']).out, '', 'a refused run created a tag');
    assert.equal(lsRemote(repo), remote, 'a refused run changed something on origin');
  });

// Round-1 review R1 (both reviewers): the compare must not use `rev-parse --abbrev-ref HEAD`. That
// prints the shortest UNAMBIGUOUS name, so once a TAG named `main` exists it says `heads/main`, and a
// legitimate `--branch main` on `main` was refused with a `git checkout main` hint that changes nothing.
// The guard now compares against `git symbolic-ref HEAD` (always `refs/heads/<name>`). The push still
// uses the unambiguous short name — `git push origin main` FAILS in this repo shape ("src refspec
// main matches more than one", measured), `heads/main` does not.
test('0300/branch-name-shadowed-by-tag-accepted: a tag named after the checked-out branch does not make --branch <current> a false refusal',
  () => {
    const { repo } = fixtureWithOther();
    commitWork(repo);
    git(repo, ['tag', 'main']);   // `rev-parse --abbrev-ref HEAD` now says heads/main, not main
    const r = release(repo, ['--branch', 'main']);
    assert.equal(r.code, 0, `--branch main did not release because a tag is also named main:\n${r.stdout}\n${r.stderr}`);
    assert.ok(summary(r.stdout).includes('✓ Released v0.1.1'), `the released headline is missing:\n${r.stdout}`);
    const head = git(repo, ['rev-parse', 'HEAD']).out;
    assert.equal(originMain(repo), head, 'origin/main is not at HEAD — the push did not land');
    assert.equal(git(repo, ['rev-parse', 'v0.1.1^{}']).out, head, 'the tag does not name HEAD');
  });

// Round-1 review R2 (both reviewers): on a detached HEAD `--abbrev-ref` printed the literal `HEAD`, so
// `--branch HEAD` matched it and the run went on to bump and commit on the detached commit before the
// push failed. `HEAD` is not a branch; any --branch on a detached HEAD is refused. ⛔ The BARE run on a
// detached HEAD (no --branch) is NOT covered here and NOT changed — owner ruling Q2, "Leave it".
test('0300/detached-head-with-branch-head-refused: on a detached HEAD, --branch HEAD is refused too — not matched against the literal HEAD',
  () => {
    const { repo } = fixtureWithOther();
    git(repo, ['checkout', '-q', '--detach']);
    const head = git(repo, ['rev-parse', 'HEAD']).out;
    const r = release(repo, ['--branch', 'HEAD']);
    assert.match(r.stderr, /✗ --branch HEAD/, `--branch HEAD slipped the guard on a detached HEAD:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /HEAD is detached/, `the refusal does not say HEAD is detached:\n${r.stderr}`);
    assert.equal(r.code, 1, `expected the guard's exit 1:\n${r.stdout}\n${r.stderr}`);
    assert.equal(fileVersion(repo, 'VERSION').trim(), '0.1.0', 'a refused run bumped VERSION');
    assert.equal(git(repo, ['rev-parse', 'HEAD']).out, head, 'a refused run committed on the detached HEAD');
    assert.equal(git(repo, ['tag', '--list']).out, '', 'a refused run created a tag');
  });

// Round-2 review R8 (Codex, measured): the preflight read HEAD BEFORE the ~6-minute test gate; commit
// and tag act on HEAD AFTER it, and the push used the name read before. A `git switch` in another
// terminal during the gate therefore committed and tagged `other`, pushed `main` (a no-op), put a tag
// on origin that no origin branch reaches, and printed ✓ Released — the task's own defect through a
// race, on the BARE run. The script now re-reads HEAD after the gate and COMPARES it to the preflight
// value (never just re-resolves — that would push wherever HEAD landed and break `--branch main`).
// The fixture's test script IS the race: `git switch -q other`. Gate ON on purpose — see releaseWithGateOn().
test('0300/head-moved-during-test-gate-refused: HEAD switched to another branch during npm test → refused after the gate, before any write',
  () => {
    const { repo } = fixtureWithOther();
    writeFileSync(join(repo, 'package.json'), '{\n  "version": "0.1.0",\n  "scripts": {\n    "test": "git switch -q other"\n  }\n}\n');
    commitWork(repo);
    const mainHead = git(repo, ['rev-parse', 'HEAD']).out;
    const otherHead = git(repo, ['rev-parse', 'other']).out;
    const remote = lsRemote(repo);

    const r = releaseWithGateOn(repo);
    assert.ok(r.stdout.includes('running `npm test`'), `the gate did not run — this test proves nothing without it:\n${r.stdout}\n${r.stderr}`);
    assert.equal(git(repo, ['symbolic-ref', '--short', 'HEAD']).out, 'other', 'the fixture test script did not move HEAD — the race was not staged');
    assert.equal(r.code, 1, `HEAD moved during the gate and the run was NOT refused:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /✗ HEAD moved after the preflight check \(during npm test\)/, `the refusal does not say HEAD moved:\n${r.stderr}`);
    assert.match(r.stderr, /it was on main, it is on other now/, `the refusal does not name both branches:\n${r.stderr}`);
    for (const t of ['• commit', 'push origin', '✓ Released', '─'.repeat(48)]) {
      assert.ok(!r.stdout.includes(t), `a refused run still printed ${JSON.stringify(t)}:\n${r.stdout}`);
    }
    // Clean abort: no bump, no commit on EITHER branch, no tag, origin unmoved.
    assert.equal(fileVersion(repo, 'VERSION').trim(), '0.1.0', 'a refused run bumped VERSION');
    assert.equal(JSON.parse(fileVersion(repo, 'package.json')).version, '0.1.0', 'a refused run bumped package.json');
    assert.equal(git(repo, ['rev-parse', 'other']).out, otherHead, 'a refused run committed on other (the branch HEAD moved to)');
    assert.equal(git(repo, ['rev-parse', 'main']).out, mainHead, 'a refused run committed on main');
    assert.equal(git(repo, ['tag', '--list']).out, '', 'a refused run created a tag');
    assert.equal(git(repo, ['status', '--porcelain']).out, '', 'a refused run left the tree dirty');
    assert.equal(lsRemote(repo), remote, 'a refused run changed something on origin');
  });

// Round-2 review R9 (Codex, measured): on an UNBORN branch `symbolic-ref` answers `refs/heads/<name>`
// but `rev-parse HEAD` exits 128, and the guard's read of it died with git's raw "ambiguous argument
// 'HEAD'" line. It was already a clean abort (nothing is written above the guard); this pins the
// sentence. `checkout --orphan` gives the same HEAD state as a fresh `git init` (measured both by hand)
// without a second fixture builder.
test('0300/unborn-head-refused-in-words: on an unborn branch the run is refused with a sentence, not a raw git error, before any write',
  () => {
    const { repo } = fixtureWithOther();
    git(repo, ['checkout', '-q', '--orphan', 'newborn']);
    const remote = lsRemote(repo);
    for (const args of [['--branch', 'newborn'], []]) {
      const r = release(repo, args);
      const label = args.length ? args.join(' ') : '(bare)';
      assert.equal(r.code, 1, `${label} on an unborn branch was not refused:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stderr, /✗ HEAD is unborn — branch newborn has no commit yet/, `${label}: no unborn sentence:\n${r.stderr}`);
      assert.match(r.stderr, /Nothing was changed/, `${label}: the refusal does not say nothing was changed:\n${r.stderr}`);
      assert.ok(!r.stderr.includes('exited 128'), `${label}: still the raw git failure:\n${r.stderr}`);
    }
    assert.equal(fileVersion(repo, 'VERSION').trim(), '0.1.0', 'a refused run bumped VERSION');
    assert.equal(git(repo, ['symbolic-ref', '--short', 'HEAD']).out, 'newborn', 'a refused run moved HEAD off the unborn branch');
    assert.equal(git(repo, ['rev-parse', '-q', '--verify', 'HEAD'], { check: false }).status, 1, 'a refused run made a commit on the unborn branch');
    assert.equal(git(repo, ['tag', '--list']).out, '', 'a refused run created a tag');
    assert.equal(lsRemote(repo), remote, 'a refused run changed something on origin');
  });
