// The structure-check contract suite — claude/skills/fkit-heal/check.sh (task 0245, unit 4 of the
// 0241 design; capability licensed by ADR-039).
//
// SCOPE: the stdout/exit-code contract of a shipped skill executable — the SAME widened third
// test-scope category as test/dashboard-contract.test.js (ADR-017 rule 4; see that file's header
// for the widening's provenance — cited, not re-argued). The checker is a pure function of
// (share spec + manifest + scaffold, project tree) -> (stdout, exit code), so it tests as
// fixtures-in, text-out. No model, no auth, no network.
//
// ⚠️ Invoked as `bash <path>`, never `./<path>` — mirroring the skill's real call site (ADR-017
// rule 2): the exec bit is not guaranteed to survive the install/copy chain.
//
// THE REPO DOUBLES AS THE SHARE (--share <repo>): it holds the spec, the manifest, and the
// scaffold — exactly a source-checkout self-host's layout. Fixture projects live under
// os.tmpdir(); harness.mjs:9's rule ("nothing here writes into the repo") is intact.
//
// ⚠️ BASH↔JS HASHING PARITY IS PINNED BY THE MANIFEST-MATCHED FIXTURES, NOT BY THE FRESH-
// CONFORMING CASE (review round 1, R2): `conforming` short-circuits on the share scaffold copy's
// hash, which check.sh computes with its OWN bash pipeline — an identically wrong transform on
// both sides stays green, and the manifest is never consulted on that path. The rows that force
// parity are the untouched-stale/CRLF fixtures, which pass ONLY when the bash pipeline reproduces
// a manifest row bin/generate-structure-manifest.mjs's hashFor() produced: the whole-file paths
// (generic-era README, omnigent-era CLAUDE.md) and the ELISION path (the marker-bearing older
// scaffold CLAUDE.md fixture — the pin that retires the plan-§8 top risk).
//
// ⚠️ ZERO-MUTATION SWEEPS ARE LOAD-BEARING (brief verifications 2 and 6): this unit is read-only
// in every branch — the repair phase lives in repair.sh (task 0246, test/structure-repair.test.js),
// a SEPARATE script; check.sh itself still never writes. The before/after tree snapshot is what
// turns "read-only" from prose into a red bar.
//
// ⚠️ NO PROVE-RED MUTATION IS ADDED FOR check.sh — ADR-026's prove-red scope is the hooks and the
// launcher; the 0245 plan records this as a stated assumption, not a silent skip.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync, writeFileSync, mkdirSync, readFileSync, cpSync, symlinkSync, chmodSync, rmSync,
  readdirSync, readlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { REPO, cleanup } from './harness.mjs';

const SCRIPT = join(REPO, 'claude', 'skills', 'fkit-heal', 'check.sh');
const SCAFFOLD = join(REPO, 'claude', 'scaffold');
const BEGIN = '<!-- fkit:begin-rules -->';
const END = '<!-- fkit:end-rules -->';

// 19 Table A dirs + 30 Table B files, as claude/structure-spec.md ships today. Exact on purpose
// (the non-vacuity discipline of skill-frontmatter.test.js): a report quietly covering fewer rows
// than the spec's inventory is a checker bug, not a smaller project. If the spec inventory
// legitimately grows or shrinks, update this count as a DELIBERATE part of that same change.
const EXPECTED_ROWS = 49;

const MADE = [];
after(() => MADE.forEach(cleanup));

function run(projectRoot, shareDir = REPO, envExtra = null) {
  const r = spawnSync('bash', [SCRIPT, '--share', shareDir, projectRoot], {
    encoding: 'utf8',
    ...(envExtra ? { env: { ...process.env, ...envExtra } } : {}),
  });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// A scaffold-verbatim project: the exact tree a fresh `fkit` launch converges into place, root
// context files included. Every content hash equals the share's installed version by construction.
function freshProject() {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-heal-'));
  MADE.push(dir);
  cpSync(join(SCAFFOLD, 'ai-agents'), join(dir, 'ai-agents'), { recursive: true });
  cpSync(join(SCAFFOLD, 'CLAUDE.md'), join(dir, 'CLAUDE.md'));
  cpSync(join(SCAFFOLD, 'AGENTS.md'), join(dir, 'AGENTS.md'));
  return dir;
}

// `<outcome>\t<path>\t<detail>` rows into a Map keyed by path; `#` lines are notes, not rows.
function parseRows(out) {
  const rows = new Map();
  for (const line of out.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const [outcome, path, ...rest] = line.split('\t');
    rows.set(path, { outcome, detail: rest.join('\t') });
  }
  return rows;
}

// Deterministic full-tree snapshot — names, types, symlink targets, content hashes. Equal
// snapshots before and after a run prove the checker wrote nothing (mode changes that make a file
// unreadable are our own fixture setup, recorded as such).
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

function git(args) {
  const r = spawnSync('git', args, { cwd: REPO, encoding: 'latin1', maxBuffer: 1 << 26 });
  assert.equal(r.status, 0, `git ${args.join(' ')} failed: ${r.stderr}`);
  return r.stdout;
}

// The ROOT-MOST shipped version of a historical repo path — an old blob the manifest provably
// carries (bin/generate-structure-manifest.mjs walks the full history of the three homes), latin1
// so bytes round-trip. Loud failure if the path never existed: these fixtures must not go vacuous.
function oldestShipped(repoPath) {
  const shas = git(['log', '--full-history', '--format=%H', '--', repoPath]).trim().split('\n');
  const root = shas[shas.length - 1];
  assert.ok(root, `no history for ${repoPath} — the historical fixture would be vacuous`);
  return git(['show', `${root}:${repoPath}`]);
}

const asRoot = process.getuid?.() === 0 ? 'runs as root; permission bits do not apply' : false;

// ── fresh / conforming (verification 2 + the parity pin) ─────────────────────────────────────────

test('scaffold-verbatim project: every row conforming, exit 0, zero mutation', () => {
  const dir = freshProject();
  const before = snapshot(dir);
  const r = run(dir);
  assert.equal(r.code, 0, `expected exit 0 on a conforming project (stderr: ${r.err})\n${r.out}`);
  const rows = parseRows(r.out);
  assert.equal(rows.size, EXPECTED_ROWS,
    `expected ${EXPECTED_ROWS} inventory rows, got ${rows.size} — the report does not cover the ` +
    'spec inventory (or the spec grew: update EXPECTED_ROWS deliberately with it)');
  for (const [path, { outcome }] of rows) {
    assert.equal(outcome, 'conforming', `${path} should be conforming on a scaffold-verbatim project`);
  }
  assert.match(r.out, /# summary: conforming=49 missing=0 untouched-stale=0 owner-edited=0 /,
    'summary counts are computed by the script and must match the rows');
  assert.equal(snapshot(dir), before, 'the check MUST NOT mutate the project (read-only in every branch)');
});

test('report is in spec table order: directories first, ai-agents/ the first row', () => {
  const r = run(freshProject());
  const lines = r.out.split('\n').filter((l) => l && !l.startsWith('#'));
  assert.equal(lines[0].split('\t')[1], 'ai-agents/', 'Table A leads and its first row is the root');
  assert.equal(lines[19].split('\t')[1], 'CLAUDE.md', 'Table B follows, root context files first');
});

test('stuffed rules block (a launched project) is still conforming — elision correctness', () => {
  const dir = freshProject();
  for (const f of ['CLAUDE.md', 'AGENTS.md']) {
    const p = join(dir, f);
    const text = readFileSync(p, 'latin1');
    writeFileSync(p, text.replace(`${BEGIN}\n${END}`, `${BEGIN}\nrules the launch wrote\nmore rules\n${END}`), 'latin1');
  }
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('CLAUDE.md').outcome, 'conforming', 'block-only content sits inside the elided region');
  assert.equal(rows.get('AGENTS.md').outcome, 'conforming');
  assert.equal(r.code, 0);
});

// ── drifted: untouched-stale vs owner-edited (verification 3) ────────────────────────────────────

test('an OLD shipped version classifies untouched-stale; a hand-edit classifies owner-edited', () => {
  const old = oldestShipped('generic/ai-agents/README.md');
  const current = readFileSync(join(SCAFFOLD, 'ai-agents', 'README.md'), 'latin1');
  assert.notEqual(old, current, 'fixture vacuous: the oldest shipped README no longer differs from current');

  const dir = freshProject();
  writeFileSync(join(dir, 'ai-agents', 'README.md'), old, 'latin1');
  writeFileSync(join(dir, 'ai-agents', 'tasks', 'README.md'), `${current}\nan owner note\n`, 'latin1');
  const before = snapshot(dir);
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/README.md').outcome, 'untouched-stale',
    'manifest-matched old content is untouched-stale, never owner-edited');
  assert.equal(rows.get('ai-agents/tasks/README.md').outcome, 'owner-edited',
    'content matching no shipped version is owner-edited');
  assert.equal(r.code, 1, 'nonconformities found -> exit 1');
  assert.equal(snapshot(dir), before, 'report, never touch');
});

// ── the marker matrix (verification 4 + the §3 precedence — the 0243-R3 answer) ──────────────────

test('malformed markers refuse to classify: duplicate begin', () => {
  const dir = freshProject();
  const p = join(dir, 'CLAUDE.md');
  writeFileSync(p, readFileSync(p, 'latin1').replace(BEGIN, `${BEGIN}\n${BEGIN}`), 'latin1');
  const r = run(dir);
  const row = parseRows(r.out).get('CLAUDE.md');
  assert.equal(row.outcome, 'refused: malformed-markers');
  assert.match(row.detail, /2 begin \/ 1 end/, 'the malformation is reported, not guessed past');
  assert.equal(r.code, 1);
});

test('malformed markers refuse to classify: end before begin — and the ORDER is named (R8)', () => {
  const dir = freshProject();
  writeFileSync(join(dir, 'CLAUDE.md'), `# mine\n${END}\nprose\n${BEGIN}\n`, 'latin1');
  const r = run(dir);
  const row = parseRows(r.out).get('CLAUDE.md');
  assert.equal(row.outcome, 'refused: malformed-markers');
  assert.match(row.detail, /end before begin/,
    '1/1 counts read as VALID — the order malformation must be named, matching the JS twin (0245-R8)');
});

test('markers ABSENT + hash matches a shipped whole-file row -> untouched-stale (omnigent-era case)', () => {
  // THE §3 PRECEDENCE PIN, resolving 0243's accepted residual R3 under its recorded re-raise
  // clause: markers-absent is an input-shaping fact, not a classification. The manifest carries
  // whole-file hashes of markerless omnigent-era root files; matching one proves the owner never
  // touched the file, so it must NOT read as owner-edited.
  const omnigent = oldestShipped('omnigent/scaffold/CLAUDE.md');
  assert.ok(!omnigent.includes(BEGIN), 'fixture vacuous: the omnigent-era CLAUDE.md grew markers');
  const dir = freshProject();
  writeFileSync(join(dir, 'CLAUDE.md'), omnigent, 'latin1');
  const r = run(dir);
  assert.equal(parseRows(r.out).get('CLAUDE.md').outcome, 'untouched-stale',
    'markerless + manifest-matched is untouched-stale, NOT owner-edited');
});

test('an OLD marker-BEARING root file classifies untouched-stale — the ELISION-path parity pin', () => {
  // Review round 1, R2: the one fixture that forces check.sh's marker-elision pipeline to
  // reproduce a hash hashFor() wrote into the manifest. The oldest marker-bearing shipped
  // claude/scaffold/CLAUDE.md has markers, differs from current, and its ELIDED hash is a
  // manifest row — so `untouched-stale` here can only come out of a byte-exact bash reproduction
  // of normalizeEndings + elideRulesRegion + sha256. Red here means the pipelines drifted.
  const shas = git(['log', '--full-history', '--format=%H', '--', 'claude/scaffold/CLAUDE.md']).trim().split('\n');
  let old = '';
  for (let i = shas.length - 1; i >= 0; i--) {   // oldest → newest: first marker-bearing version
    const c = git(['show', `${shas[i]}:claude/scaffold/CLAUDE.md`]);
    if (c.includes(BEGIN)) { old = c; break; }
  }
  assert.ok(old.includes(BEGIN) && old.includes(END),
    'fixture vacuous: no marker-bearing shipped claude/scaffold/CLAUDE.md found in history');
  assert.notEqual(old, readFileSync(join(SCAFFOLD, 'CLAUDE.md'), 'latin1'),
    'fixture vacuous: the oldest marker-bearing CLAUDE.md no longer differs from current');
  const dir = freshProject();
  writeFileSync(join(dir, 'CLAUDE.md'), old, 'latin1');
  const r = run(dir);
  assert.equal(parseRows(r.out).get('CLAUDE.md').outcome, 'untouched-stale',
    'a marker-bearing older shipped root file must match its JS-elided manifest row — ' +
    'owner-edited here means the bash elision pipeline drifted from hashFor()');
});

test('markers ABSENT + hash matches nothing -> owner-edited (deleting the markers IS an edit)', () => {
  const dir = freshProject();
  writeFileSync(join(dir, 'CLAUDE.md'), '# my own context file\nno markers here\n', 'latin1');
  const r = run(dir);
  assert.equal(parseRows(r.out).get('CLAUDE.md').outcome, 'owner-edited');
});

test('body drift with an intact block is classified by the body: owner-edited', () => {
  const dir = freshProject();
  const p = join(dir, 'AGENTS.md');
  writeFileSync(p, `${readFileSync(p, 'latin1')}\nan owner paragraph outside the markers\n`, 'latin1');
  const r = run(dir);
  assert.equal(parseRows(r.out).get('AGENTS.md').outcome, 'owner-edited',
    'drift OUTSIDE the elided region must not hide behind the block');
});

// ── the safety bar (verification 5) ──────────────────────────────────────────────────────────────

test('symlinked subdir: refused at its root, never probed below, run continues', () => {
  const dir = freshProject();
  const target = mkdtempSync(join(tmpdir(), 'fkit-heal-elsewhere-'));
  MADE.push(target);
  rmSync(join(dir, 'ai-agents', 'knowledge-base'), { recursive: true });
  symlinkSync(target, join(dir, 'ai-agents', 'knowledge-base'));
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/knowledge-base/').outcome, 'refused: symlink');
  assert.equal(rows.get('ai-agents/knowledge-base/conventions/').outcome, 'refused: symlink',
    'a row below a refused root is refused too, not probed through the link');
  assert.match(rows.get('ai-agents/knowledge-base/conventions/README.md').detail, /inside refused subtree/);
  assert.equal(rows.get('ai-agents/tasks/README.md').outcome, 'conforming', 'the rest of the run continues');
  assert.match(r.err, /symlink/, 'refused loudly');
  assert.equal(r.code, 1);
});

test('dangling symlink where a file belongs: refused (never resolved, never "missing")', () => {
  const dir = freshProject();
  rmSync(join(dir, 'ai-agents', 'README.md'));
  symlinkSync(join(dir, 'nowhere'), join(dir, 'ai-agents', 'README.md'));
  const r = run(dir);
  assert.equal(parseRows(r.out).get('ai-agents/README.md').outcome, 'refused: symlink');
});

test('file where a directory belongs: wrong-type, children unreachable, run continues', () => {
  const dir = freshProject();
  rmSync(join(dir, 'ai-agents', 'tasks', 'backlog'), { recursive: true });
  writeFileSync(join(dir, 'ai-agents', 'tasks', 'backlog'), 'not a directory\n');
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/tasks/backlog/').outcome, 'wrong-type');
  assert.equal(rows.get('ai-agents/tasks/backlog/.gitkeep').outcome, 'wrong-type');
  assert.match(rows.get('ai-agents/tasks/backlog/.gitkeep').detail, /inside refused subtree/);
  assert.equal(rows.get('ai-agents/tasks/done/.gitkeep').outcome, 'conforming');
  assert.equal(r.code, 1);
});

test('chmod-000 file: unreadable, refuse to classify, run completes', { skip: asRoot }, () => {
  const dir = freshProject();
  chmodSync(join(dir, 'ai-agents', 'README.md'), 0o000);
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/README.md').outcome, 'unreadable');
  assert.equal(rows.get('ai-agents/tasks/README.md').outcome, 'conforming', 'non-fatal: the run completes');
  assert.equal(r.code, 1);
  chmodSync(join(dir, 'ai-agents', 'README.md'), 0o644);   // so cleanup can remove it
});

test('CRLF variants: current -> conforming, older shipped -> untouched-stale, never owner-edited', () => {
  // The manifest's contract point 1 (CRLF -> LF before hashing): an untouched file that passed
  // through an autocrlf checkout must not misclassify as owner-edited — the Windows failure class
  // init already learned once.
  const dir = freshProject();
  // ai-agents/tasks/README.md has shipped exactly ONE version ever (a single manifest row), so it
  // carries the current-CRLF case; ai-agents/README.md has a differing generic-era version, so it
  // carries the older-CRLF case.
  const cur = readFileSync(join(SCAFFOLD, 'ai-agents', 'tasks', 'README.md'), 'latin1');
  writeFileSync(join(dir, 'ai-agents', 'tasks', 'README.md'), cur.split('\n').join('\r\n'), 'latin1');
  const old = oldestShipped('generic/ai-agents/README.md');
  assert.notEqual(old, readFileSync(join(SCAFFOLD, 'ai-agents', 'README.md'), 'latin1'),
    'fixture vacuous: the generic-era README no longer differs from current');
  writeFileSync(join(dir, 'ai-agents', 'README.md'), old.split('\n').join('\r\n'), 'latin1');
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/tasks/README.md').outcome, 'conforming', 'CRLF of the current version conforms');
  assert.equal(rows.get('ai-agents/README.md').outcome, 'untouched-stale',
    'CRLF of an older shipped version is untouched-stale, never owner-edited');
});

// ── the 0245 accepted residuals whose re-raise clauses fired on 0246 (R1/R3/R5/R6) ───────────────
// Classification is now 0246's write gate (repair.sh proposes/applies only untouched-stale rows),
// which is exactly the condition each of these residuals' re-raise clause named. Each fixture was
// proven RED against the pre-fix check.sh before the fix landed (recorded in 0246's worklog).

test('R1: a NUL byte refuses classification (unreadable) — never untouched-stale', () => {
  // macOS awk truncates a record at \0, so an edit hidden after a NUL on an existing line hashes
  // as if absent — pre-fix this fixture classified untouched-stale, i.e. REPAIR-ELIGIBLE. The
  // owner's ruling-1 clause: "MUST be resolved before 0246 gates a write on untouched-stale".
  const old = oldestShipped('generic/ai-agents/README.md');
  const dir = freshProject();
  writeFileSync(join(dir, 'ai-agents', 'README.md'), old.replace('\n', '\u0000hidden-edit\n'), 'latin1');
  const r = run(dir);
  const row = parseRows(r.out).get('ai-agents/README.md');
  assert.equal(row.outcome, 'unreadable',
    'NUL-bearing content must refuse to classify — it must NEVER reach untouched-stale');
  assert.match(row.detail, /NUL/, 'the refusal names the cause');
  assert.equal(r.code, 1);
});

test('R3: a symlinked ai-agents/ is refused BEFORE its keep-out is probed through the link', () => {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-heal-'));
  MADE.push(dir);
  cpSync(join(SCAFFOLD, 'CLAUDE.md'), join(dir, 'CLAUDE.md'));
  cpSync(join(SCAFFOLD, 'AGENTS.md'), join(dir, 'AGENTS.md'));
  const foreign = mkdtempSync(join(tmpdir(), 'fkit-heal-foreign-'));
  MADE.push(foreign);
  mkdirSync(join(foreign, '.fkit-keep-out'));   // unreadable-as-a-file keep-out behind the link
  symlinkSync(foreign, join(dir, 'ai-agents'));
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/').outcome, 'refused: symlink',
    'pre-fix the report showed the fail-closed keep-out diagnosis instead — the link was probed');
  assert.equal(rows.get('ai-agents/tasks/README.md').outcome, 'refused: symlink',
    'the whole subtree is refused below the symlinked root');
  assert.ok(!/\.fkit-keep-out/.test(r.err), 'the keep-out behind the link is NEVER consulted or diagnosed');
  assert.match(r.err, /symlink/, 'refused loudly, with the real cause');
  assert.equal(r.code, 1);
});

// A doctored copy of the share: the real spec (mutated), manifest, and scaffold. For fixtures that
// must corrupt spec content without touching the repo's own share files.
function doctoredShare(mutateSpec) {
  const share = mkdtempSync(join(tmpdir(), 'fkit-heal-share-'));
  MADE.push(share);
  mkdirSync(join(share, 'claude'), { recursive: true });
  writeFileSync(join(share, 'claude', 'structure-spec.md'),
    mutateSpec(readFileSync(join(REPO, 'claude', 'structure-spec.md'), 'utf8')));
  cpSync(join(REPO, 'claude', 'structure-manifest.tsv'), join(share, 'claude', 'structure-manifest.tsv'));
  cpSync(SCAFFOLD, join(share, 'claude', 'scaffold'), { recursive: true });
  return share;
}

test('R5: a spec row escaping the project root refuses loudly — exit 2, nothing read outside', () => {
  const anchor = '| `ai-agents/tasks/README.md` | fkit-authored reference file |';
  const share = doctoredShare((s) => {
    assert.ok(s.includes(anchor), 'fixture vacuous: the Table B anchor row moved');
    return s.replace(anchor, `| \`../escape\` | fkit-authored reference file | escape probe |\n${anchor}`);
  });
  const r = run(freshProject(), share);
  assert.equal(r.code, 2, `a root-escaping spec row is cannot-run, never a silent out-of-root read\n${r.err}`);
  assert.match(r.err, /\.\./, 'the offending path is named');
});

test('R6: a present-but-broken sha tool refuses to classify (unreadable), never owner-edited', () => {
  // The no-tool case was always handled; this is the broken-tool case — garbage with exit 0 used
  // to flow through as an empty/garbage "hash" and misreport every content-checked file.
  const shim = mkdtempSync(join(tmpdir(), 'fkit-heal-sha-'));
  MADE.push(shim);
  for (const t of ['sha256sum', 'shasum']) {
    writeFileSync(join(shim, t), '#!/bin/sh\necho "not: a-hash"\nexit 0\n');
    chmodSync(join(shim, t), 0o755);
  }
  const dir = freshProject();
  const r = run(dir, REPO, { PATH: `${shim}:${process.env.PATH}` });
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/README.md').outcome, 'unreadable',
    'a garbage hash must refuse to classify, not misreport owner-edited');
  assert.equal(rows.get('CLAUDE.md').outcome, 'unreadable');
  assert.equal(r.code, 1);
});

// ── keep-out ─────────────────────────────────────────────────────────────────────────────────────

test('a keep-out entry covers a deleted path AND its subtree: kept-out, not missing — and not exit 1', () => {
  const dir = freshProject();
  rmSync(join(dir, 'ai-agents', 'wiki-vault'), { recursive: true });
  writeFileSync(join(dir, 'ai-agents', '.fkit-keep-out'), '# no wiki here\nwiki-vault\n');
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/wiki-vault/').outcome, 'kept-out');
  assert.equal(rows.get('ai-agents/wiki-vault/index.md').outcome, 'kept-out', 'an entry covers the whole subtree');
  assert.equal(rows.get('ai-agents/wiki-vault/wiki/tasks/.gitkeep').outcome, 'kept-out');
  assert.equal(r.code, 0,
    'kept-out is recorded intent, not a nonconformity — a deliberately opted-out project stays exit 0');
});

test('an unreadable keep-out FAILS CLOSED: ai-agents/ check refused loudly, root files still checked', { skip: asRoot }, () => {
  // Init's R1 lesson, carried verbatim: intent was recorded and cannot be read — that is precisely
  // when guessing "they meant nothing" is worst. This is the ONE documented exception to
  // one-line-per-inventory-row.
  const dir = freshProject();
  writeFileSync(join(dir, 'ai-agents', '.fkit-keep-out'), 'wiki-vault\n');
  chmodSync(join(dir, 'ai-agents', '.fkit-keep-out'), 0o000);
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.size, 2, 'only the two root context files are checked');
  assert.equal(rows.get('CLAUDE.md').outcome, 'conforming');
  assert.equal(rows.get('AGENTS.md').outcome, 'conforming');
  assert.match(r.err, /\.fkit-keep-out cannot be read/, 'refused loudly, with the cause named');
  assert.equal(r.code, 1, 'a fail-closed refusal is never a clean exit');
  chmodSync(join(dir, 'ai-agents', '.fkit-keep-out'), 0o644);
});

// ── wiki-vault (verification 6 — ADR-005 in force) ───────────────────────────────────────────────

test('an edited schema.md reports wiki-routed naming fkit-wiki, and the vault is never written', () => {
  const dir = freshProject();
  const p = join(dir, 'ai-agents', 'wiki-vault', 'schema.md');
  writeFileSync(p, `${readFileSync(p, 'latin1')}\nan extra section\n`, 'latin1');
  const before = snapshot(dir);
  const r = run(dir);
  const row = parseRows(r.out).get('ai-agents/wiki-vault/schema.md');
  assert.equal(row.outcome, 'wiki-routed');
  assert.match(row.detail, /fkit-wiki/, 'the routing target is named in the line');
  assert.match(row.detail, /ADR-005/, 'the authority is named in the line');
  assert.equal(snapshot(dir), before, 'NOTHING under ai-agents/wiki-vault/ (or anywhere) is written');
  assert.equal(r.code, 1);
});

test('index.md and log.md are existence-only: any content is conforming', () => {
  const dir = freshProject();
  writeFileSync(join(dir, 'ai-agents', 'wiki-vault', 'index.md'), 'a grown catalog\n');
  writeFileSync(join(dir, 'ai-agents', 'wiki-vault', 'log.md'), 'a grown log\n');
  const r = run(dir);
  assert.equal(parseRows(r.out).get('ai-agents/wiki-vault/index.md').outcome, 'conforming',
    'wiki-authored living files are supposed to grow');
  assert.equal(parseRows(r.out).get('ai-agents/wiki-vault/log.md').outcome, 'conforming',
    'log.md too — the row R9 (round 1) found asserted never');
});

// ── renamed dir, placeholders, missing files ─────────────────────────────────────────────────────

test('a renamed directory reports the spec path missing, and the report carries the limit note', () => {
  const dir = freshProject();
  cpSync(join(dir, 'ai-agents', 'sprints'), join(dir, 'ai-agents', 'sprintz'), { recursive: true });
  rmSync(join(dir, 'ai-agents', 'sprints'), { recursive: true });
  const r = run(dir);
  const rows = parseRows(r.out);
  assert.equal(rows.get('ai-agents/sprints/').outcome, 'missing');
  assert.match(r.out, /# note: a renamed directory/, 'the both-exist limit is stated in the report itself');
  assert.equal(r.code, 1);
});

test(".gitkeep deleted from an existing directory: conforming (init's rule, deferred to)", () => {
  const dir = freshProject();
  rmSync(join(dir, 'ai-agents', 'tasks', 'backlog', '.gitkeep'));
  const r = run(dir);
  assert.equal(parseRows(r.out).get('ai-agents/tasks/backlog/.gitkeep').outcome, 'conforming',
    'a placeholder has no content contract; a missing .gitkeep in an existing dir is NOT a defect');
  assert.equal(r.code, 0);
});

test('a missing reference file reports missing — and is NOT created', () => {
  const dir = freshProject();
  rmSync(join(dir, 'ai-agents', 'tasks', 'README.md'));
  const before = snapshot(dir);
  const r = run(dir);
  assert.equal(parseRows(r.out).get('ai-agents/tasks/README.md').outcome, 'missing');
  assert.equal(snapshot(dir), before, 'report, never create — creation is convergence\'s job');
  assert.equal(r.code, 1);
});

test('a missing owner-authored seed reports missing; an edited one is conforming (never content-checked)', () => {
  const dir = freshProject();
  writeFileSync(join(dir, 'ai-agents', 'knowledge-base', 'PROJECT.md'), 'the real product brief\n');
  const r1 = run(dir);
  assert.equal(parseRows(r1.out).get('ai-agents/knowledge-base/PROJECT.md').outcome, 'conforming',
    'divergence is the point of the seed');
  rmSync(join(dir, 'ai-agents', 'knowledge-base', 'PROJECT.md'));
  const r2 = run(dir);
  assert.equal(parseRows(r2.out).get('ai-agents/knowledge-base/PROJECT.md').outcome, 'missing');
});

// ── cannot-run (exit 2 is not nonconforming) ─────────────────────────────────────────────────────

test('a share without spec/manifest: loud error, exit 2, no report', () => {
  const emptyShare = mkdtempSync(join(tmpdir(), 'fkit-heal-noshare-'));
  MADE.push(emptyShare);
  const r = run(freshProject(), emptyShare);
  assert.equal(r.code, 2, 'cannot-run is exit 2, distinct from nonconforming (exit 1)');
  assert.match(r.err, /cannot run/, 'the refusal names itself loudly');
  assert.equal(r.out.trim(), '', 'no partial report on a run that could not start');
});
