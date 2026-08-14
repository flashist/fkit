// The post-release SUMMARY-BLOCK suite — the last block of bin/release.mjs (task 0288).
//
// SCOPE: what the summary prints, on each path. Nothing else in release.mjs is under test here, and
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
// ⚠️ PROVE-RED: mutations 18-22 in test/prove-red.sh break the summary block in a COPIED release.mjs
// (pointed at via FKIT_RELEASE_MJS, this file's seam) and require the named assertions below to go red
// BY NAME. Note 22 reds 0288/failure-speaks as well as 0288/default-released, and that is inherent
// rather than sloppy: failure-speaks runs the command the DEFAULT path printed, so a mutation that
// stops the default path printing it takes both. Mutations 18-21 each leave the default path green.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, cpSync, rmSync, readFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// The script under test. FKIT_RELEASE_MJS is this file's prove-red seam — a single-file redirect (the
// FKIT_LAUNCHER pattern), so mutations 18-22 can point it at a deliberately-broken copy without ever
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
  for (const [k, v] of [
    ['user.name', 'fkit fixture'],
    ['user.email', 'fixture@example.invalid'],
    ['commit.gpgsign', 'false'],
    ['tag.gpgsign', 'false'],
  ]) git(repo, ['config', k, v]);
  git(repo, ['remote', 'add', 'origin', origin]);

  writeFileSync(join(repo, 'VERSION'), '0.1.0\n');
  writeFileSync(join(repo, 'package.json'), '{\n  "version": "0.1.0"\n}\n');
  writeFileSync(join(repo, 'file.txt'), 'content\n');
  mkdirSync(join(repo, 'bin'));
  cpSync(RELEASE_MJS, join(repo, 'bin', 'release.mjs'));
  git(repo, ['add', '-A']);
  git(repo, ['commit', '-q', '-m', 'initial']);
  git(repo, ['push', '-q', 'origin', 'main']);

  // ⛔ SEAL 1, ASSERTED NOT ASSUMED: this fixture's origin must live inside its own tmp dir. The
  // brief's non-negotiable safety rule ("never push to flashist/fkit, never create or delete a tag on
  // the real origin") is worth nothing as an intention; this is it made structural. A fixture that
  // ever resolved origin to the real repo dies here instead of pushing to it.
  const url = git(repo, ['remote', 'get-url', 'origin']).out;
  assert.ok(url.startsWith(root), `fixture origin is OUTSIDE the tmp dir — refusing to run: ${url}`);
  assert.ok(!url.startsWith(REPO), `fixture origin points into the real repo — refusing to run: ${url}`);
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
