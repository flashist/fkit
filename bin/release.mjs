#!/usr/bin/env node
// fkit — release.mjs
//
// One command to cut a release: bump the version, stage everything, commit,
// push the branch, create an annotated v<version> tag, and push it. Driven by
// `npm run release` (see package.json scripts).
//
// VERSION is the single source of truth (package.json is kept in sync). By
// default EVERY run bumps the patch (0.1.0 → 0.1.1 → 0.1.2 …). Override with
// --minor / --major / --version, or keep the current version with --no-bump.
//
// Re-run safety: a --no-bump run is idempotent (an existing tag or an already-
// committed tree is skipped). A default (bumping) run always cuts a NEW version,
// so after a partial failure re-run with --no-bump to finish the same one.
//
// Test gate: every run executes `npm test` first and ABORTS on red — an untested
// tree cannot be released (task 0256). It runs before the first write, and under
// --dry-run too. --no-test skips it and is never a default.
//
// Zero dependencies. Usage:
//   node bin/release.mjs [options]
//   npm run release -- [options]
//
// Options:
//   (default)           Bump the patch version
//   --minor / --major   Bump minor / major instead
//   --version <x.y.z>   Set an explicit version (VERSION + package.json)
//   --no-bump           Release the current version as-is (no bump)
//   -m, --message <s>   Commit message (default: "Release v<version>")
//   --branch <name>     Branch to push — must be the checked-out branch (default: current branch)
//   --dry-run           Print the plan; touch nothing
//   --no-tag            Commit + push, but don't create/push a tag
//   --no-push           Commit + tag locally, but don't push anything
//   --no-test           Skip the test gate — SHIPS AN UNVERIFIED TREE
//   -h, --help          Show this help

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT = resolve(__dirname, "..");

const argv = process.argv.slice(2);
const has = (n) => argv.includes(n);
const getArg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};

if (has("-h") || has("--help")) {
  console.log(`fkit release — cut a release (bump, commit, push, tag)

Usage: npm run release -- [options]   (or: node bin/release.mjs [options])

By default every run bumps the PATCH version (0.1.0 → 0.1.1 → …).

Options:
  --minor / --major   Bump minor / major instead of patch
  --version <x.y.z>   Set an explicit version (VERSION + package.json)
  --no-bump           Release the current version as-is (no bump)
  -m, --message <s>   Commit message (default: "Release v<version>")
  --branch <name>     Branch to push — must be the checked-out branch (default: current branch)
  --dry-run           Print the plan; touch nothing
  --no-tag            Commit + push, but don't create/push a tag
  --no-push           Commit + tag locally, but don't push anything
  --no-test           Skip the test gate — SHIPS AN UNVERIFIED TREE
  -h, --help          Show this help

Every run runs \`npm test\` first (~6 min) and refuses to release if it fails —
including under --dry-run. The suite reads the working tree, so it checks the tree
as it stood when the suite started — uncommitted and untracked work included, but
not the version bump written after it. --no-test skips that; it is never a default.

VERSION is the single source of truth (package.json kept in sync); the tag is v<VERSION>.
Makes no npm-registry publish.`);
  process.exit(0);
}

const dryRun = has("--dry-run");
const doTag = !has("--no-tag");
const doPush = !has("--no-push");
const doTest = !has("--no-test");
const bumpTo = getArg("--version", null);
const branchArg = getArg("--branch", null);
const messageArg = getArg("-m", getArg("--message", null));

// --- git helper -------------------------------------------------------------
function git(args, { check = true, quiet = false } = {}) {
  const r = spawnSync("git", args, { cwd: KIT, encoding: "utf8" });
  if (r.error) fail(`git ${args.join(" ")} failed to start: ${r.error.message}`);
  if (check && r.status !== 0) {
    fail(`git ${args.join(" ")} exited ${r.status}\n${(r.stderr || r.stdout || "").trim()}`);
  }
  if (!quiet && r.stdout && r.stdout.trim()) process.stdout.write(r.stdout);
  return { status: r.status, out: (r.stdout || "").trim(), err: (r.stderr || "").trim() };
}
function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}
function step(msg) {
  console.log(`${dryRun ? "• [dry-run] " : "• "}${msg}`);
}

// --- preflight --------------------------------------------------------------
if (git(["rev-parse", "--is-inside-work-tree"], { check: false, quiet: true }).status !== 0) {
  fail(`not a git repo: ${KIT}`);
}
if (!git(["remote"], { quiet: true }).out.split("\n").includes("origin")) {
  fail("no 'origin' remote configured");
}

// --- --branch must name the CHECKED-OUT branch (task 0300) -------------------
// `git commit` (step 1) and `git tag -a` (step 3) act on HEAD; only the push (step 2)
// reads ${branch}. A --branch that is not HEAD's branch therefore commits and tags one
// ref and publishes another — MEASURED 2026-08-14: the tag lands on origin naming a
// commit no origin branch reaches, and the summary still prints ✓ Released.
//
// ⚠️ POSITION IS LOAD-BEARING, for the test gate's own reason (see below): this runs
// before the gate and before the first writeFileSync, so a refused run leaves the tree
// exactly as the user left it — no bump, no `git add`, no commit, no tag.
// `!= null` on purpose: a bare trailing `--branch` parses as undefined and keeps today's
// fall-back to the current branch.
//
// TWO reads of HEAD, each for its own job (round-1 review R1/R2, both MEASURED):
//   * `symbolic-ref -q HEAD` is the COMPARE. It prints `refs/heads/<name>` exactly, or exits 1 on a
//     detached HEAD — so `onBranch` is the branch name or null, never a lookalike.
//   * `rev-parse --abbrev-ref HEAD` is the PUSH NAME (`branch`, below). It prints git's shortest
//     UNAMBIGUOUS name, which is what the push refspec needs: with a tag also named `main` it says
//     `heads/main`, and `git push origin main` fails there ("src refspec main matches more than
//     one") while `heads/main` pushes. Comparing against it was wrong for the same reason — a tag
//     named `main` made `--branch main` a false refusal — and on a detached HEAD it prints the
//     literal `HEAD`, which `--branch HEAD` matched and slipped through.
const headRef = git(["symbolic-ref", "-q", "HEAD"], { check: false, quiet: true });
const onBranch = headRef.status === 0 ? headRef.out.replace(/^refs\/heads\//, "") : null;
// `check: false`: on an UNBORN branch (fresh `git init`, or `checkout --orphan`, no commit yet)
// `symbolic-ref` still answers `refs/heads/<name>` but `rev-parse HEAD` exits 128 — say so in a
// sentence instead of git's raw "ambiguous argument 'HEAD'" (round-2 review R9, MEASURED). Nothing
// is written before this point, so it is a clean abort either way.
const headName = git(["rev-parse", "--abbrev-ref", "HEAD"], { check: false, quiet: true });
if (headName.status !== 0) {
  fail(
    (onBranch !== null
      ? `HEAD is unborn — branch ${onBranch} has no commit yet.`
      : `HEAD does not resolve to a commit.`) +
      ` Make the first commit before releasing.\n` +
      `  Nothing was changed: no bump, no commit, no tag.\n` +
      `  ${headName.err.split("\n")[0]}`,
  );
}
const headBranch = headName.out;
if (branchArg != null && branchArg !== onBranch) {
  fail(
    `--branch ${branchArg}: that is not the checked-out branch` +
      (onBranch === null ? " (HEAD is detached)" : ` (HEAD is on ${onBranch})`) +
      `.\n` +
      `  This script commits and tags HEAD but pushes --branch, so the two must be the same branch;\n` +
      `  refused on every path, --no-tag / --no-push / --dry-run included. Nothing was changed:\n` +
      `  no bump, no commit, no tag.\n` +
      `  Switch to that branch first, then release:  git switch ${branchArg}`,
  );
}

const pkgPath = join(KIT, "package.json");
const versionPath = join(KIT, "VERSION");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
let version = readFileSync(versionPath, "utf8").trim();

// --- resolve target version -------------------------------------------------
// Default: bump the patch every run. Override with --version / --minor / --major,
// or keep the current version with --no-bump.
function bumpPart(v, part) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(v);
  if (!m) {
    fail(`current version "${v}" is not plain x.y.z — can't auto-bump; pass --version <x.y.z>`);
  }
  const [maj, min, pat] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (part === "major") return `${maj + 1}.0.0`;
  if (part === "minor") return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

const originalVersion = version;
let target;
if (bumpTo !== null) {
  // Explicit version — sets both files, no need to reconcile first.
  if (!/^\d+\.\d+\.\d+([-+.][0-9A-Za-z-.]+)?$/.test(bumpTo)) {
    fail(`--version "${bumpTo}" is not a valid semver (expected x.y.z)`);
  }
  target = bumpTo;
} else {
  // Deriving from the current version — VERSION and package.json must agree.
  if (pkg.version !== version) {
    fail(
      `version mismatch: VERSION=${version} but package.json=${pkg.version}\n` +
        `  reconcile them, or pass --version <x.y.z> to set both.`,
    );
  }
  if (has("--no-bump")) target = version;
  else if (has("--major")) target = bumpPart(version, "major");
  else if (has("--minor")) target = bumpPart(version, "minor");
  else target = bumpPart(version, "patch"); // default: bump patch every run
}

// --- test gate --------------------------------------------------------------
// Refuse to release an untested tree (task 0256). There is deliberately no
// warn-and-continue path: a red suite exits 1.
//
// ⚠️ POSITION IS LOAD-BEARING. This sits immediately before the first mutating
// line (the writeFileSync bump below). At this point nothing has been written,
// staged, committed or tagged, so a red suite is a clean abort with the tree
// exactly as the user left it. Gating any LATER would leave VERSION and
// package.json bumped and dirty, and the next default run would bump AGAIN —
// silently skipping a version, recoverable only via --no-bump.
//
// ⚠️ IT DOES NOT REQUIRE A CLEAN TREE, and must not. `npm test` reads the
// WORKING TREE (harness.mjs derives REPO from its own location; the structure
// manifest walks git history ∪ the on-disk claude/scaffold/), and so does
// `git add -A` below. Both read the working tree — so gating here tests the
// tree as it stood when the suite started, uncommitted and untracked work
// included. NOT the exact committed bytes: the bump below writes VERSION and
// package.json after the suite, and ~6 min separate this gate from
// `git add -A`. That is the point: CI cannot cover this, it never sees the tree.
function runTests() {
  const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
  const r = spawnSync(npmBin, ["test"], { cwd: KIT, stdio: "inherit" });
  if (r.error) fail(`could not run \`npm test\`: ${r.error.message}`);
  if (r.status !== 0) {
    fail(
      `npm test failed (exit ${r.status}) — refusing to release an untested tree.\n` +
        `  Nothing was changed: no bump, no commit, no tag.\n` +
        `  Fix the suite and re-run. To release anyway: --no-test (ships unverified).`,
    );
  }
}

if (doTest) {
  // stdio: "inherit" so the suite streams live — 5+ minutes of silence reads as a hang.
  console.log(`\n• running \`npm test\` before release v${target} (~6 min; includes prove-red.sh)`);
  runTests();
  console.log(`✓ npm test green\n`);
} else {
  console.error(
    `\n⚠ --no-test: releasing WITHOUT running the suite.\n` +
      `⚠ The tree about to ship is UNVERIFIED — nothing has checked it.\n`,
  );
}

// --- HEAD must not have moved since the preflight (task 0300, round-2 review R8) ------------------
// The guard above read HEAD BEFORE the ~6-minute gate; the commit and the tag act on HEAD AFTER it,
// and the push uses the name read before. A `git switch` in another terminal meanwhile puts the
// commit and tag on one branch and the push on another — the 0300 defect back through a race.
// MEASURED: a fixture whose test script runs `git switch -q other` → commit + tag on `other`,
// `push origin main` a no-op, tag on origin naming a commit no origin branch reaches, ✓ Released.
//
// ⚠️ COMPARE against the preflight read — never just re-resolve. A bare re-read would push wherever
// HEAD landed, which under `--branch main` breaks the guard's own promise. Runs on every path (the
// window is zero under --no-test, and the compare is then a no-op), and sits before the first
// writeFileSync, so a refused run is still a clean abort.
const nowRef = git(["symbolic-ref", "-q", "HEAD"], { check: false, quiet: true });
const nowOn = nowRef.status === 0 ? nowRef.out.replace(/^refs\/heads\//, "") : null;
if (nowOn !== onBranch) {
  const was = onBranch === null ? "detached" : `on ${onBranch}`;
  const is = nowOn === null ? "detached" : `on ${nowOn}`;
  fail(
    `HEAD moved after the preflight check${doTest ? " (during npm test)" : ""}: it was ${was}, it is ${is} now.\n` +
      `  The commit and the tag would land on the new HEAD while the push went to the branch checked\n` +
      `  out when the run started. Nothing was changed: no bump, no commit, no tag.\n` +
      `  Switch back and re-run, or release from where HEAD is now.`,
  );
}

if (target !== version) {
  step(`bump version ${version} → ${target} (VERSION + package.json)`);
  version = target;
  if (!dryRun) {
    writeFileSync(versionPath, `${version}\n`);
    pkg.version = version;
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
} else {
  step(`release current version ${version} (no bump)`);
}
const versionChanged = version !== originalVersion;

const tag = `v${version}`;
// Always the PUSH NAME from `--abbrev-ref`, never the user's spelling: the guard above has already
// proved `--branch` names HEAD's branch, and only `--abbrev-ref`'s form is safe as a refspec (with a
// tag also named `main`, `git push origin main` fails while `heads/main` pushes — measured).
const branch = headBranch;
const message = messageArg ?? `Release ${tag}`;

// --- tag existence checks ---------------------------------------------------
const localTagExists = git(["tag", "--list", tag], { quiet: true }).out === tag;
const remoteTagExists =
  git(["ls-remote", "--tags", "origin", tag], { quiet: true }).out.includes(`refs/tags/${tag}`);

// --- plan -------------------------------------------------------------------
console.log(`\nfkit release → ${tag}  (branch: ${branch})`);
const status = git(["status", "--short"], { quiet: true }).out;
console.log(status ? `\nworking-tree changes:\n${status}\n` : "\nworking tree clean (no file changes)\n");

if (doTag && (localTagExists || remoteTagExists)) {
  step(`tag ${tag} already exists ${localTagExists ? "locally" : ""}${localTagExists && remoteTagExists ? " + " : ""}${remoteTagExists ? "on origin" : ""} — will skip tag creation`);
}

// --- execute ----------------------------------------------------------------
// 1. stage + commit (only if there is something to commit)
let willCommit;
if (dryRun) {
  // Would `git add -A` stage anything? In dry-run the bump isn't written yet,
  // so fold in the pending version change explicitly.
  willCommit = status.length > 0 || versionChanged;
} else {
  git(["add", "-A"], { quiet: true });
  willCommit = git(["diff", "--cached", "--quiet"], { check: false, quiet: true }).status === 1;
}
if (willCommit) {
  step(`commit: "${message}"`);
  if (!dryRun) git(["commit", "-m", message]);
} else {
  step("nothing to commit (tree already committed)");
}

// 2. push branch
if (doPush) {
  step(`push origin ${branch}`);
  if (!dryRun) git(["push", "origin", branch]);
} else {
  step("skip branch push (--no-push)");
}

// 3. tag
if (doTag && !localTagExists && !remoteTagExists) {
  step(`create annotated tag ${tag}`);
  if (!dryRun) git(["tag", "-a", tag, "-m", `Release ${tag}`]);
  if (doPush) {
    step(`push origin ${tag}`);
    if (!dryRun) git(["push", "origin", tag]);
  } else {
    step("skip tag push (--no-push)");
  }
} else if (!doTag) {
  step("skip tag (--no-tag)");
}

// --- summary ----------------------------------------------------------------
// ⚠️ THIS BLOCK DESCRIBES THE RUN THAT HAPPENED, NOT THE DEFAULT PATH (task 0288).
// All four defects 0288 fixed had one root cause: the summary was written as if the
// default path were the only path, so it announced `✓ Released` and printed a tag-verify
// command on runs that created no tag, pushed no tag, or did not move an existing one.
//
// ⛔ DO NOT RE-DERIVE THIS FROM `doTag`/`doPush` ALONE. Both are TRUE in the state where
// the tag already existed locally and was therefore never pushed (N1) — a guard on the
// two flags fixes R1 and leaves N1 exactly as it was. The end state needs the pre-run tag
// measurements under `// --- tag existence checks ---` as well.
//
// Deriving end state from flags is sound here because every git call above runs with
// `check: true`: a failed push calls fail() and exits 1, so this block is reached only
// when every git command succeeded.
//
// ⚠️ THE ONE ASSUMPTION, STATED HONESTLY (review R2, 2026-08-14): `tagOnOrigin` assumes the
// branch push under `// 2. push branch` moves no tags. That is git's DEFAULT, not a guarantee. Under a
// maintainer's global `push.followTags=true`, `git push origin <branch>` also publishes any
// annotated tag reachable from the pushed ref — MEASURED: a local-only v0.1.0 lands on origin
// during step 2, before the `// 3. tag` block is skipped. `remoteTagExists` was read pre-run above,
// so it cannot see that, and the UNFINISHED branch below then says "NOT pushed" of a tag that
// WAS pushed (its recovery command becomes a harmless no-op, not a wrong-tag push).
// ⛔ It is not fixed here by re-reading origin: that would add a network round-trip to every
// run, and 0288 is fenced to this block. The fixture pins `push.followTags=false` so the suite
// measures the documented default rather than the machine it happens to run on.
const tagCreated = doTag && !localTagExists && !remoteTagExists; // the `// 3. tag` block ran
const tagPushed = tagCreated && doPush; //                          its `git push origin <tag>` ran
const tagOnOrigin = remoteTagExists || tagPushed; //                the tag is on origin now (see ⚠️ above)

const rule = `\n${"─".repeat(48)}`;
if (dryRun) {
  console.log(`${rule}\nDry run — nothing was changed. Re-run without --dry-run to release.`);
} else if (!doPush) {
  // Nothing left this machine — so nothing on origin can be verified.
  //
  // ⛔ THE TAG SUB-BRANCHES READ THE MEASURED STATE (`// --- tag existence checks ---`), NOT `doTag` ALONE — the same ⛔ the
  // top of this block states, which this branch used to violate (review R1, 2026-08-14). With a tag
  // that already existed, this run created NOTHING, so "committed and tagged locally only" is false
  // and a recovery derived from the flags is actively harmful. Both cases measured:
  //   * tag already here at an OLDER commit → `git push origin <tag>` publishes a tag naming some
  //     other commit, manufacturing the exact R2 false green this task exists to prevent;
  //   * tag on origin with no local ref → that same command exits 1, `src refspec … does not match any`.
  //
  // ⚠️ HEAD, not ${branch}, is the right comparison HERE. The other branches compare against
  // ${branch} because that is the ref they pushed; this one pushed nothing, and the commit this run
  // made — and any tag it created — is at HEAD.
  console.log(`${rule}\n⚠ NOT released — nothing was pushed${doTag ? " (--no-push)" : ", no tag created"}`);
  if (!doTag) {
    console.log(`  ${tag} is committed locally only.`);
  } else if (tagCreated) {
    console.log(`  ${tag} is committed and tagged locally only.`);
    console.log(`  Finish it with: git push origin ${branch} && git push origin ${tag}`);
  } else if (remoteTagExists) {
    console.log(`  ${tag} is committed locally; no tag was created — ${tag} is already on origin.`);
    console.log(`  ⚠ Nothing here moved it, and an existence check passes whether or not it names this release.`);
    console.log(`  Push the branch when ready: git push origin ${branch}`);
  } else {
    console.log(`  ${tag} is committed locally; no tag was created — ${tag} already existed locally.`);
    console.log(`  ⚠ Check what it names before pushing it: git rev-parse '${tag}^{}'  vs  git rev-parse HEAD`);
    console.log(`  Then: git push origin ${branch} && git push origin ${tag}`);
  }
} else if (!doTag) {
  // Commits WERE published — say so. `--no-tag` is not a no-op release.
  console.log(`${rule}\n✓ Pushed ${branch} (${tag}) — no tag was created (--no-tag)`);
  console.log(`  Nothing to verify on origin: this run created no tag.`);
} else if (!tagOnOrigin) {
  // N1. Tag exists locally, not on origin — so the tag push never ran and, before 0288,
  // nothing said so. ⛔ 0288 does NOT push it (owner-ruled 2026-08-13, "Report truthfully
  // only — stay inside the fence"); the release genuinely is unfinished, and this says so.
  //
  // ⚠️ `tagOnOrigin` IS THE LOAD-BEARING GUARD HERE, and it must not be simplified to
  // `doTag && doPush` — that is true in this exact state, so the naive form falls through
  // and reports the tag as already on origin when it is not there at all.
  console.log(`${rule}\n⚠ UNFINISHED — ${branch} was pushed, but tag ${tag} was NOT pushed`);
  console.log(`  The tag already existed locally, so tag creation was skipped — and the tag push`);
  console.log(`  lives inside that same skipped step, so it never ran.`);
  console.log(`  Finish it by hand:  git push origin ${tag}`);
  // ⚠️ `${branch}`, NOT HEAD (review R5): the `// 2. push branch` step pushed it, so it is the ref this
  // run published. Since 0300, `--branch` must be HEAD's branch — ⛔ still do NOT "simplify" this to HEAD.
  console.log(`  ⚠ Check what it names first: git rev-parse '${tag}^{}'  vs  git rev-parse ${branch}`);
} else if (tagCreated) {
  // The default path. The headline is byte-identical to pre-0288; the verify command
  // gains a speaking failure branch (R5) — see the owner's OQ1(A) ruling, 2026-08-14.
  // On success it is byte-identical too: git prints the sha and exits 0, and the `||`
  // group never runs. `$?` inside that group is git's own code (arguments expand before
  // `echo` runs), so 2 and 128 stay distinguishable; the trailing `false` keeps the
  // compound non-zero so `$?` remains usable as pass/fail.
  console.log(`${rule}\n✓ Released ${tag}`);
  console.log(
    `  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}` +
      ` || { echo "✗ ${tag} not confirmed on origin (git exit $?)"; false; }`,
  );
} else {
  // R2. The tag was already on origin and this run did not move it. Whether it names
  // THIS release is unknowable from here, so claim neither — print the comparison.
  // ⛔ Deliberately two plain commands, not a one-line `[ x = y ] && echo ✓` verdict: a
  // pipeline discards git's exit status, so origin-unreachable (128) would render as
  // "the tag does not name this commit" — manufacturing the absent/unreachable
  // conflation. Two commands keep 2 and 128 distinct, and 128 still prints its `fatal:`.
  // ⚠️ The single quotes around the ref are required for the command to RUN (`^` and `{}`
  // are shell-special in zsh); they are not claimed as a fix for the unquoted-${tag}
  // exposure, which is owner-ruled unactioned and unchanged on the line above.
  console.log(`${rule}\n✓ Pushed ${branch} — tag ${tag} was already on origin; this run did NOT move it`);
  console.log(`  ⚠ An existence check would pass here whether or not the tag names this release.`);
  // ⚠️ THE PEEL GETS THE SAME SPEAKING TAIL AS THE DEFAULT PATH (review R3): a foreign LIGHTWEIGHT
  // tag has no peeled ref, so this exits 2 with EMPTY stdout AND stderr — measured, and R5's exact
  // defect signature in code 0288 itself added. ⛔ Keep this ONE source line: prove-red mutation 20
  // replaces the whole line, and a `+` continuation would be orphaned into a syntax error.
  console.log(`  Which commit the tag names:   git ls-remote --exit-code origin 'refs/tags/${tag}^{}' || { echo "✗ could not resolve what ${tag} names on origin (git exit $?)"; false; }`);
  // ⚠️ `${branch}`, NOT HEAD (review R5): the `// 2. push branch` step pushed it. ⛔ Do not simplify to HEAD.
  console.log(`  Which commit this run pushed: git rev-parse ${branch}`);
  // ⛔ The old caveat here justified itself with "this script only ever makes annotated tags" — a
  // non-sequitur on the one branch that fires for a tag THIS RUN DID NOT CREATE. Say what happens.
  console.log(`  (a lightweight tag has no peeled ref: the peel exits 2, and the ✗ line above says so)`);
}
