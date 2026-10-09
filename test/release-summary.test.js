// The post-release SUMMARY-BLOCK suite — the last block of bin/release.mjs (task 0288).
//
// SCOPE: what the summary prints, on each path, and, since task 0300, the `--branch` preflight guard
// above it plus the post-gate HEAD compare, and, since task 0479, the CHANGELOG.md check and stamp.
// Nothing else in release.mjs is under test here, and
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
// preflight above it, 26 the post-gate HEAD compare and 42/43 the CHANGELOG.md check and write (task
// 0479), in a COPIED release.mjs (pointed at via FKIT_RELEASE_MJS, this file's seam) and
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
//
// ⚠️ TASK 0479 — CHANGELOG.md, tested in the 0479/* section at the end of this file. release.mjs
// refuses a missing, duplicated or empty `## Unreleased` before the test gate and again after it, and on
// a release turns that heading into `## v<version> — <date>` inside the release commit. So every
// fixture now carries a committed CHANGELOG.md with a filled `## Unreleased` (see makeFixture()) —
// without it every test above would be refused for a reason that has nothing to do with it. prove-red
// mutation 42 disarms the empty-section refusal and requires 0479/empty-unreleased-refused to go red by
// name; mutation 43 drops the CHANGELOG.md write and requires 0479/filled-unreleased-stamped to.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, cpSync, rmSync, readFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// The script under test. FKIT_RELEASE_MJS is this file's prove-red seam — a single-file redirect (the
// FKIT_LAUNCHER pattern), so mutations 18-22, 25, 26, 42 and 43 can point it at a deliberately-broken copy without ever
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

const FIXTURE_CHANGELOG = '# Changelog\n\n## Unreleased\n\n- fixture change\n\n## Upgrade notes\n\nNone.\n';

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
  // MEASURED): a global `core.hooksPath` with a rejecting `pre-commit` still reds all 15 tests (the
  // count when it was measured, before task 0479 added its own).
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
  // Task 0479: release.mjs refuses a missing or empty `## Unreleased`, so every fixture carries one,
  // filled. The 0479/* tests replace it where the content is the fact under test.
  writeFileSync(join(repo, 'CHANGELOG.md'), FIXTURE_CHANGELOG);
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

// The gate-ON runs (0300/head-moved-during-test-gate-refused, plus 0479/refused-before-the-test-gate,
// 0479/edit-during-gate-kept and 0479/emptied-during-gate-refused): the fact under test is where the
// changelog check sits around `npm test`, or what happens AFTER it has run, so the gate must run.
// None of them opens the hole SEAL 2 is for — that
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
// The `other` branch is created INSIDE each test, so makeFixture() did not change for 0300. (Task 0479
// later added a committed CHANGELOG.md to it, which every release now needs.)

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

// ── 0479. CHANGELOG.md — the release notes ─────────────────────────────────────────────────────
// release.mjs refuses a missing, duplicated or empty `## Unreleased` BEFORE the test gate (so a
// forgotten changelog costs seconds) and again on a FRESH READ after it (so an edit made during the
// gate is kept, never overwritten). On a release the heading becomes `## v<version> — <date>`, a new
// empty `## Unreleased` opens above it, and the change lands in the release commit. On a run that does
// not bump, a `## v<target>` section that already exists means a partly-failed release already did
// this step: left as is. A bumping run never takes that skip (review R1).
// --allow-empty-changelog releases an empty section anyway, loudly.

const changelog = (repo) => readFileSync(join(repo, 'CHANGELOG.md'), 'utf8');
const porcelainRaw = (repo) =>
  spawnSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' }).stdout.replace(/\n$/, '');

// Replace the fixture's CHANGELOG.md (or delete it, for `null`) and commit, so the tree starts clean.
function setChangelog(repo, text) {
  if (text === null) git(repo, ['rm', '-q', 'CHANGELOG.md']);
  else writeFileSync(join(repo, 'CHANGELOG.md'), text);
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-q', '-m', 'changelog']);
}

// The local date, as release.mjs writes it. Read before AND after a run, so a run that straddles
// midnight is accepted on either side.
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// A gate-ON fixture: the test script is `script` (it must name no npm/node/release — see
// releaseWithGateOn()). Commits it, so the tree is clean when the release starts.
function setTestScript(repo, script) {
  writeFileSync(join(repo, 'package.json'),
    `${JSON.stringify({ version: '0.1.0', scripts: { test: script } }, null, 2)}\n`);
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-q', '-m', 'test script']);
}

// Everything a refused run must leave alone. `files` = the bytes read before the run.
function assertUntouched(repo, label, { head, remote, files, porcelain = '' }) {
  assert.equal(fileVersion(repo, 'VERSION'), files.VERSION, `${label}: a refused run changed VERSION`);
  assert.equal(fileVersion(repo, 'package.json'), files.pkg, `${label}: a refused run changed package.json`);
  if (files.changelog !== undefined) {
    assert.equal(changelog(repo), files.changelog, `${label}: a refused run changed CHANGELOG.md`);
  }
  assert.equal(git(repo, ['rev-parse', 'HEAD']).out, head, `${label}: a refused run moved HEAD`);
  assert.equal(git(repo, ['tag', '--list']).out, '', `${label}: a refused run created a tag`);
  assert.equal(porcelainRaw(repo), porcelain, `${label}: a refused run left the tree changed or staged`);
  assert.equal(lsRemote(repo), remote, `${label}: a refused run changed something on origin`);
}
function snapshot(repo) {
  const files = { VERSION: fileVersion(repo, 'VERSION'), pkg: fileVersion(repo, 'package.json') };
  try { files.changelog = changelog(repo); } catch { /* the no-file case */ }
  return { head: git(repo, ['rev-parse', 'HEAD']).out, remote: lsRemote(repo), files };
}

const EMPTY_UNRELEASED = '# Changelog\n\n## Unreleased\n\n## Upgrade notes\n\nNone.\n';

test('0479/empty-unreleased-refused: an empty ## Unreleased exits 1 with a message that says what to do — and changes nothing, under --dry-run too',
  () => {
    for (const args of [[], ['--dry-run']]) {
      const { repo } = makeFixture();
      setChangelog(repo, EMPTY_UNRELEASED);
      const before = snapshot(repo);
      const r = release(repo, args);
      const label = args.length ? args.join(' ') : '(bare)';
      assert.equal(r.code, 1, `${label}: an empty ## Unreleased was not refused:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stderr, /CHANGELOG\.md/, `${label}: the refusal does not name CHANGELOG.md:\n${r.stderr}`);
      assert.match(r.stderr, /## Unreleased/, `${label}: the refusal does not name ## Unreleased:\n${r.stderr}`);
      for (const line of [
        'Finishing a partly-failed release? re-run with --no-bump',
        'To release anyway: --allow-empty-changelog',
        'Nothing was changed: no bump, no commit, no tag.',
      ]) assert.ok(r.stderr.includes(line), `${label}: the refusal lacks ${JSON.stringify(line)}:\n${r.stderr}`);
      for (const s of ['• commit', 'push origin', '✓ Released', 'Dry run', '─'.repeat(48)]) {
        assert.ok(!r.stdout.includes(s), `${label}: a refused run still printed ${JSON.stringify(s)}:\n${r.stdout}`);
      }
      assertUntouched(repo, label, before);
    }
  });

test('0479/refused-before-the-test-gate: the changelog refusal fires BEFORE npm test runs — a forgotten changelog costs seconds',
  () => {
    const { repo } = makeFixture();
    setTestScript(repo, 'touch gate-ran');
    setChangelog(repo, EMPTY_UNRELEASED);
    const before = snapshot(repo);
    const r = releaseWithGateOn(repo);
    assert.equal(r.code, 1, `an empty ## Unreleased was not refused with the gate on:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /## Unreleased` section is empty/, `refused, but not for the changelog:\n${r.stderr}`);
    assert.ok(!r.stdout.includes('running `npm test`'), `the gate started before the changelog refusal:\n${r.stdout}`);
    let ran = true;
    try { readFileSync(join(repo, 'gate-ran')); } catch { ran = false; }
    assert.equal(ran, false, 'the fixture test script ran — the refusal came AFTER the test gate');
    assertUntouched(repo, 'gate on', before);
  });

test('0479/missing-or-duplicate-unreleased-refused: no file, no heading, or two headings — refused with and without the hatch, tree untouched',
  () => {
    const cases = [
      ['no file', null, /CHANGELOG\.md is missing/],
      ['no heading', '# Changelog\n\n## Upgrade notes\n\n- something\n', /has no `## Unreleased` heading/],
      ['two headings', '# Changelog\n\n## Unreleased\n\n- a\n\n## Unreleased\n\n- b\n', /has 2 `## Unreleased` headings/],
    ];
    for (const [name, text, msg] of cases) {
      for (const args of [[], ['--allow-empty-changelog']]) {
        const label = `${name}${args.length ? ' + hatch' : ''}`;
        const { repo } = makeFixture();
        setChangelog(repo, text);
        const before = snapshot(repo);
        const r = release(repo, args);
        assert.equal(r.code, 1, `${label}: not refused:\n${r.stdout}\n${r.stderr}`);
        assert.match(r.stderr, msg, `${label}: the refusal does not say what is wrong:\n${r.stderr}`);
        assert.match(r.stderr, /Nothing was changed/, `${label}: the refusal does not say nothing was changed:\n${r.stderr}`);
        assertUntouched(repo, label, before);
        if (text === null) {
          let exists = true;
          try { changelog(repo); } catch { exists = false; }
          assert.equal(exists, false, `${label}: a refused run created CHANGELOG.md`);
        }
      }
    }
  });

test('0479/filled-unreleased-stamped: ## Unreleased becomes ## v<version> — <date> under a fresh empty ## Unreleased, in the tagged release commit',
  () => {
    const { repo } = makeFixture();
    const prefix = '# Changelog\n\nSome header text.\n\n';
    const body = '\n- first change\n\n### Upgrade\n\nRun this:\n\n```sh\n## not a heading\n```\n\n- last change\n\n';
    const suffix = '## Upgrade notes\n\n- keep me\n\n## History\n\nold\n';
    setChangelog(repo, `${prefix}## Unreleased\n${body}${suffix}`);
    const d0 = today();
    const r = release(repo);
    const d1 = today();
    assert.equal(r.code, 0, `a filled ## Unreleased did not release:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stdout, /stamp CHANGELOG\.md: ## Unreleased → ## v0\.1\.1 — /, `no stamp step printed:\n${r.stdout}`);

    const committed = git(repo, ['show', 'HEAD:CHANGELOG.md']).out + '\n';   // git() trims the final newline
    const expected = (d) => `${prefix}## Unreleased\n\n## v0.1.1 — ${d}\n${body}${suffix}`;
    assert.ok(committed === expected(d0) || committed === expected(d1),
      `the release commit's CHANGELOG.md is not the stamped file.\n--- got:\n${committed}\n--- expected:\n${expected(d0)}`);
    assert.equal(changelog(repo), committed, 'the working-tree CHANGELOG.md differs from the committed one');
    // In the TAGGED release commit, and the tag is that commit.
    assert.equal(git(repo, ['rev-parse', 'v0.1.1^{}']).out, git(repo, ['rev-parse', 'HEAD']).out, 'the tag does not name HEAD');
    assert.ok(git(repo, ['show', '--name-only', '--format=', 'HEAD']).out.split('\n').includes('CHANGELOG.md'),
      'CHANGELOG.md is not part of the release commit');
    assert.equal(porcelainRaw(repo), '', 'the release left the tree dirty');
  });

test('0479/escape-hatch-loud: --allow-empty-changelog releases an empty section — exit 0, a stderr banner, and a "No changes were recorded" line',
  () => {
    const { repo } = makeFixture();
    setChangelog(repo, EMPTY_UNRELEASED);
    const r = release(repo, ['--allow-empty-changelog']);
    assert.equal(r.code, 0, `the hatch did not release:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /⚠ --allow-empty-changelog: releasing v0\.1\.1 with an EMPTY ## Unreleased/,
      `the hatch is silent — no banner on stderr:\n${r.stderr}`);
    const committed = git(repo, ['show', 'HEAD:CHANGELOG.md']).out;
    assert.match(committed, /## Unreleased\n\n## v0\.1\.1 — \d{4}-\d{2}-\d{2}\n\nNo changes were recorded for this release\.\n/,
      `the version section does not record the empty release:\n${committed}`);
    assert.ok(summary(r.stdout).includes('✓ Released v0.1.1'), `the hatch run did not release:\n${r.stdout}`);
  });

test('0479/no-bump-finishes-a-stamped-release: a v<target> section already there → --no-bump leaves CHANGELOG.md as is; a bumping run is refused',
  () => {
    const stampedText = '# Changelog\n\n## Unreleased\n\n## v0.1.0 — 2026-01-01\n\n- shipped\n';
    {
      const { repo } = makeFixture();
      setChangelog(repo, stampedText);
      const r = release(repo, ['--no-bump']);
      assert.equal(r.code, 0, `--no-bump over an already-stamped v0.1.0 was refused:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stdout, /changelog: CHANGELOG\.md already has a v0\.1\.0 section — left as is/,
        `no "already has" line:\n${r.stdout}`);
      assert.equal(changelog(repo), stampedText, '--no-bump rewrote an already-stamped CHANGELOG.md');
      assert.equal(git(repo, ['show', 'HEAD:CHANGELOG.md']).out + '\n', stampedText, 'the committed CHANGELOG.md changed');
    }
    {
      const { repo } = makeFixture();
      setChangelog(repo, stampedText);
      const before = snapshot(repo);
      const r = release(repo);
      assert.equal(r.code, 1, `a bumping run (target v0.1.1) over an empty ## Unreleased was not refused:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stderr, /## Unreleased` section is empty/, `refused, but not for the changelog:\n${r.stderr}`);
      assertUntouched(repo, 'bumping run', before);
    }
  });

test('0479/edit-during-gate-kept: an entry added to ## Unreleased during npm test lands in the stamped section — the file is read again',
  () => {
    const { repo } = makeFixture();
    const edited = FIXTURE_CHANGELOG.replace('- fixture change\n', '- fixture change\n- added during the gate\n');
    assert.notEqual(edited, FIXTURE_CHANGELOG, 'fixture is wrong: the edit did not apply');
    writeFileSync(join(repo, 'edited-changelog.md'), edited);
    setTestScript(repo, 'cp edited-changelog.md CHANGELOG.md');
    const r = releaseWithGateOn(repo, ['--no-push', '--no-tag']);
    assert.ok(r.stdout.includes('running `npm test`'), `the gate did not run — this test proves nothing without it:\n${r.stdout}\n${r.stderr}`);
    assert.equal(r.code, 0, `the release failed:\n${r.stdout}\n${r.stderr}`);
    const committed = git(repo, ['show', 'HEAD:CHANGELOG.md']).out;
    assert.match(committed, /## v0\.1\.1 — \d{4}-\d{2}-\d{2}\n\n- fixture change\n- added during the gate\n/,
      `the entry added during the gate was lost — the pre-gate read was written back:\n${committed}`);
    assert.equal(porcelainRaw(repo), '', 'the release left the tree dirty');
  });

test('0479/emptied-during-gate-refused: ## Unreleased emptied during npm test → refused after the gate, before any write',
  () => {
    const { repo } = makeFixture();
    writeFileSync(join(repo, 'empty-changelog.md'), EMPTY_UNRELEASED);
    setTestScript(repo, 'cp empty-changelog.md CHANGELOG.md');
    const before = snapshot(repo);
    const r = releaseWithGateOn(repo);
    assert.ok(r.stdout.includes('running `npm test`'), `the gate did not run — this test proves nothing without it:\n${r.stdout}\n${r.stderr}`);
    assert.equal(r.code, 1, `a section emptied during the gate was not refused:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /## Unreleased` section is empty \(read again after the test gate\)/,
      `the refusal does not come from the post-gate re-read:\n${r.stderr}`);
    // The gate script's OWN edit is the only change: nothing staged, nothing bumped or committed.
    assertUntouched(repo, 'emptied during gate',
      { ...before, files: { ...before.files, changelog: EMPTY_UNRELEASED }, porcelain: ' M CHANGELOG.md' });
  });

test('0479/dry-run-stamps-nothing: --dry-run prints the stamp step and leaves CHANGELOG.md byte-identical', () => {
  const { repo } = makeFixture();
  const r = release(repo, ['--dry-run']);
  assert.equal(r.code, 0, `--dry-run failed:\n${r.stdout}\n${r.stderr}`);
  assert.match(r.stdout, /\[dry-run\] stamp CHANGELOG\.md: ## Unreleased → ## v0\.1\.1 — /, `no stamp step in the plan:\n${r.stdout}`);
  assert.equal(changelog(repo), FIXTURE_CHANGELOG, '--dry-run wrote CHANGELOG.md');
  assert.equal(porcelainRaw(repo), '', '--dry-run left the tree dirty');
});

// ── 0479, review round 1 — rules the first nine tests could not tell apart from their absence ────────
// Each test below was seen red against a one-off mutant of the rule it names (worklog.md, review round 1).

test('0479/bumping-run-refuses-a-target-section: a hand-written ## v<target> on a BUMPING run is refused — empty or filled ## Unreleased, hatch or not',
  () => {
    // Review R1: the "already has a v<target> section" skip exists to finish a partly-failed release, and
    // that run never bumps. On a bumping run the heading cannot be this script's own (hand-written,
    // planned ahead, or a mis-parsed line), so it must not waive the empty check — and, by owner ruling
    // (2026-10-05, "Refuse it"), it is refused outright rather than stamped into a second v<target> heading.
    const empty = '# Changelog\n\n## Unreleased\n\n## v0.1.1 — planned\n\n- written ahead by hand\n';
    const filled = '# Changelog\n\n## Unreleased\n\n- a change\n\n## v0.1.1 — planned\n\n- written ahead by hand\n';
    for (const [label, text, args] of [
      ['empty', empty, []],
      ['empty, --version 0.1.1', empty, ['--version', '0.1.1']],
      ['empty + hatch', empty, ['--allow-empty-changelog']],
      ['filled', filled, []],
    ]) {
      const { repo } = makeFixture();
      setChangelog(repo, text);
      const before = snapshot(repo);
      const r = release(repo, args);
      assert.equal(r.code, 1, `${label}: a bumping run was not refused over a hand-written v0.1.1 heading:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stderr, /CHANGELOG\.md already has a `## v0\.1\.1` heading/, `${label}: refused, but not for the v0.1.1 heading:\n${r.stderr}`);
      assert.match(r.stderr, /Remove it, or move its notes under `## Unreleased`/, `${label}: the refusal does not say what to do:\n${r.stderr}`);
      assert.match(r.stderr, /Nothing was changed/, `${label}: the refusal does not say nothing was changed:\n${r.stderr}`);
      assert.ok(!r.stdout.includes('already has a v0.1.1 section'), `${label}: a bumping run took the recovery skip:\n${r.stdout}`);
      assertUntouched(repo, label, before);
    }
  });

test('0479/fenced-lines-are-not-headings: ## lines inside ``` and ~~~ fences are neither counted nor taken as a stamped section',
  () => {
    // Only the fence rule decides these outcomes: test 4's fenced line sits after real content, so a
    // parser with no fence handling still passes it.
    {
      // Fenced example `## Unreleased` lines, one per fence kind: not duplicates, and not the stamped line.
      const { repo } = makeFixture();
      const prefix = '# Changelog\n\nThe format:\n\n```md\n## Unreleased\n```\n\n~~~\n## Unreleased\n~~~\n\n';
      const body = '\n- a change\n\n';
      const suffix = '## Upgrade notes\n\nNone.\n';
      setChangelog(repo, `${prefix}## Unreleased\n${body}${suffix}`);
      const d0 = today();
      const r = release(repo);
      const d1 = today();
      assert.equal(r.code, 0, `fenced ## Unreleased lines were read as headings:\n${r.stdout}\n${r.stderr}`);
      const committed = git(repo, ['show', 'HEAD:CHANGELOG.md']).out + '\n';
      const expected = (d) => `${prefix}## Unreleased\n\n## v0.1.1 — ${d}\n${body}${suffix}`;
      assert.ok(committed === expected(d0) || committed === expected(d1),
        `the stamp did not land on the real heading alone.\n--- got:\n${committed}\n--- expected:\n${expected(d0)}`);
    }
    {
      // A fenced `## v0.1.0` is an example, not a stamped section: a --no-bump run still checks.
      const { repo } = makeFixture();
      setChangelog(repo, '# Changelog\n\n```md\n## v0.1.0 — 2026-01-01\n```\n\n## Unreleased\n\n## Upgrade notes\n\nNone.\n');
      const before = snapshot(repo);
      const r = release(repo, ['--no-bump']);
      assert.equal(r.code, 1, `a fenced ## v0.1.0 line was taken as a stamped section:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stderr, /## Unreleased` section is empty/, `refused, but not for the changelog:\n${r.stderr}`);
      assertUntouched(repo, 'fenced v0.1.0', before);
    }
  });

test('0479/subheading-stays-inside-the-section: a ### line right under ## Unreleased is the section\'s content, not its end',
  () => {
    // Only the `## ` (with the space) rule decides this: a section that opens with a `### ` subheading
    // would read as empty if `###` ended it. Test 4's `### ` line sits after real content, so it cannot tell.
    const { repo } = makeFixture();
    setChangelog(repo, '# Changelog\n\n## Unreleased\n### Added\n- a change\n\n## Upgrade notes\n\nNone.\n');
    const r = release(repo);
    assert.equal(r.code, 0, `a section opening with ### was read as empty:\n${r.stdout}\n${r.stderr}`);
    assert.match(git(repo, ['show', 'HEAD:CHANGELOG.md']).out, /## v0\.1\.1 — \d{4}-\d{2}-\d{2}\n### Added\n- a change\n/,
      'the stamped section lost its subheading');
  });

test('0479/version-boundary: ## v0.1.10 is not a v0.1.1 section — a --no-bump v0.1.1 run still checks ## Unreleased',
  () => {
    const { repo } = makeFixture();
    writeFileSync(join(repo, 'VERSION'), '0.1.1\n');
    writeFileSync(join(repo, 'package.json'), '{\n  "version": "0.1.1"\n}\n');
    setChangelog(repo, '# Changelog\n\n## Unreleased\n\n## v0.1.10 — 2026-01-01\n\n- a later release\n');
    const before = snapshot(repo);
    const r = release(repo, ['--no-bump']);
    assert.equal(r.code, 1, `## v0.1.10 was taken as a v0.1.1 section:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stderr, /## Unreleased` section is empty/, `refused, but not for the changelog:\n${r.stderr}`);
    assert.ok(!r.stdout.includes('already has a v0.1.1 section'), `the boundary check let v0.1.10 match:\n${r.stdout}`);
    assertUntouched(repo, 'v0.1.10', before);
  });

test('0479/crlf-file-stays-crlf: a CRLF CHANGELOG.md gets CRLF stamp lines — no bare LF is added', () => {
  const { repo } = makeFixture();
  git(repo, ['config', 'core.autocrlf', 'false']);   // fixture only: the bytes under test reach git as written
  const lf = '# Changelog\n\n## Unreleased\n\n- a change\n\n## Upgrade notes\n\nNone.\n';
  setChangelog(repo, lf.replace(/\n/g, '\r\n'));
  const d0 = today();
  const r = release(repo);
  const d1 = today();
  assert.equal(r.code, 0, `a CRLF CHANGELOG.md did not release:\n${r.stdout}\n${r.stderr}`);
  const expected = (d) => lf.replace('## Unreleased\n', `## Unreleased\n\n## v0.1.1 — ${d}\n`).replace(/\n/g, '\r\n');
  const file = changelog(repo);
  assert.ok(file === expected(d0) || file === expected(d1),
    `the stamp mixed line endings.\n--- got:\n${JSON.stringify(file)}\n--- expected:\n${JSON.stringify(expected(d0))}`);
  const blob = spawnSync('git', ['show', 'HEAD:CHANGELOG.md'], { cwd: repo, encoding: 'utf8' }).stdout;
  assert.equal(blob, file, 'the committed CHANGELOG.md bytes differ from the working-tree file');
});

test('0479/no-bump-dry-run-counts-the-stamp: on a clean tree, --no-bump --dry-run plans the commit the stamp will make',
  () => {
    // Nothing else is pending here (no bump, clean tree), so only the stamp makes a commit — the plan
    // must say so, not "nothing to commit".
    const { repo } = makeFixture();
    const r = release(repo, ['--no-bump', '--dry-run']);
    assert.equal(r.code, 0, `--no-bump --dry-run failed:\n${r.stdout}\n${r.stderr}`);
    assert.match(r.stdout, /\[dry-run\] stamp CHANGELOG\.md: ## Unreleased → ## v0\.1\.0 — /, `no stamp step in the plan:\n${r.stdout}`);
    assert.match(r.stdout, /\[dry-run\] commit: "Release v0\.1\.0"/, `the plan does not count the stamp's commit:\n${r.stdout}`);
    assert.ok(!r.stdout.includes('nothing to commit'), `the plan says nothing to commit:\n${r.stdout}`);
    assert.equal(changelog(repo), FIXTURE_CHANGELOG, '--dry-run wrote CHANGELOG.md');
    assert.equal(porcelainRaw(repo), '', '--dry-run left the tree dirty');
    // And the real run does what the plan said: one commit, carrying CHANGELOG.md.
    const head = git(repo, ['rev-parse', 'HEAD']).out;
    const real = release(repo, ['--no-bump', '--no-push', '--no-tag']);
    assert.equal(real.code, 0, `the real --no-bump run failed:\n${real.stdout}\n${real.stderr}`);
    assert.notEqual(git(repo, ['rev-parse', 'HEAD']).out, head, 'the real run made no commit — the plan was wrong');
    assert.ok(git(repo, ['show', '--name-only', '--format=', 'HEAD']).out.split('\n').includes('CHANGELOG.md'),
      'the real run\'s commit does not carry CHANGELOG.md');
  });
