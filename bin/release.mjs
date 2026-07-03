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
//   --branch <name>     Branch to push (default: current branch)
//   --dry-run           Print the plan; touch nothing
//   --no-tag            Commit + push, but don't create/push a tag
//   --no-push           Commit + tag locally, but don't push anything
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
  --branch <name>     Branch to push (default: current branch)
  --dry-run           Print the plan; touch nothing
  --no-tag            Commit + push, but don't create/push a tag
  --no-push           Commit + tag locally, but don't push anything
  -h, --help          Show this help

VERSION is the single source of truth (package.json kept in sync); the tag is v<VERSION>.
Makes no npm-registry publish.`);
  process.exit(0);
}

const dryRun = has("--dry-run");
const doTag = !has("--no-tag");
const doPush = !has("--no-push");
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
const branch = branchArg ?? git(["rev-parse", "--abbrev-ref", "HEAD"], { quiet: true }).out;
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
if (dryRun) {
  console.log(`\n${"─".repeat(48)}\nDry run — nothing was changed. Re-run without --dry-run to release.`);
} else {
  console.log(`\n${"─".repeat(48)}\n✓ Released ${tag}`);
  console.log(`  Verify: npx github:flashist/fkit#${tag} --version`);
}
