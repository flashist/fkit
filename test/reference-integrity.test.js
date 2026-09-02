// The link-resolution guard — Half A of the reference-integrity condition (task 0354).
//
// ⭐ THE SPECIFICATION IS A DOCUMENT, AND THIS FILE TRANSCRIBES IT.
// `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` §4.1 is the
// settled condition, ruled by the owner across three review rounds. Its §4 says, verbatim: "0354
// should TRANSCRIBE this, not re-derive it", and its §4 preamble adds "⛔ Do not paraphrase these
// into a fresh regex" — §2 C2 of that document is the measured evidence of what paraphrasing costs
// (four tabulated readings in 0353's brief, none of which reproduced). The revision transcribed here
// is the file AS COMMITTED AT c797df4, verified clean with `git status` at build time.
//
// SCOPE — this is the FOURTH test-scope category, not a fifth, and the precedent is named.
// ADR-014 §2 fenced fkit's test scope at two things (the argv handed to `claude`, and the
// skillOverrides map). ADR-017 rule 4 widened it to a third (the stdout contract of a shipped skill
// executable). `test/task-id-uniqueness.test.js` recorded the fourth — an invariant over the repo's
// own `ai-agents/` CONTENT rather than over product behavior — and this suite is another of that
// same fourth kind. It follows that file's precedent exactly, including this header note.
//
// ⚠️ THIS TEST READS THE REPO. `test/harness.mjs` states the standing rule — "Nothing here writes
// into the repo, every project lives under os.tmpdir()." That rule is intact. The live corpus is
// opened READ-ONLY. Every mutation fixture below is built under os.tmpdir(). ⛔ Nothing is ever
// written to `ai-agents/wiki-vault/`, not even to write it back.
//
// ============================================================================================
// THE THREE DELIBERATE DEVIATIONS FROM §4.1. There are three, and they are named below. They are
// the only differences in what the guard DECIDES. They are NOT the only differences in the text —
// see "STRUCTURAL ADAPTATIONS" below, which an earlier revision of this header wrongly folded into
// a claim that "nothing else differs".
// ============================================================================================
//
// D1 — CommonJS preamble becomes an ESM preamble. §4.1 is a standalone script
//      (`'use strict'; const fs = require('fs')`); the house idiom is ESM. Measured 2026-09-02 — of
//      the 25 pre-existing `test/*.test.js` files, 25 use `import` and ZERO use `require`.
//      ⭐ The imports are deliberately DEFAULT imports (`import fs from 'node:fs'`) rather than
//      NAMED ones (`import { readdirSync } from 'node:fs'`), so that every call site inside the
//      transcribed bodies stays literally `fs.readdirSync` / `path.join`. (An earlier revision of
//      this comment called them "namespace" imports. They are not — a namespace import is
//      `import * as fs from 'node:fs'`. The reason above is unaffected; only the term was wrong.)
//      COST 0.
//
// D2 — `fs.existsSync(abs)` becomes a per-segment case-exact walk (`resolveExact`), keeping §4.1's
//      containment test. Instructed by §7 item 11, which measured the problem firsthand — macOS's
//      default volume is case-insensitive, so `fs.existsSync('CLAUDE.MD')` returns true here and a
//      wrongly-cased link would pass on a developer's Mac and red on a case-sensitive CI runner.
//      A test whose result depends on who runs it is not a guard.
//      ⚠️ ONE ORDERING CHANGE COMES WITH IT, and it is not a behavior change. §4.1 reads
//      `if (fs.existsSync(abs) && (abs === ROOT || abs.startsWith(ROOT + path.sep))) continue;`.
//      `resolveExact` evaluates the containment half FIRST, because a case-exact walk is defined
//      relative to the root and is meaningless for a path outside it. `&&` is commutative over two
//      side-effect-free predicates, so the result is identical.
//      COST 0 — measured 2026-09-02 over the live corpus, figures byte-identical with `existsSync`
//      and with the segment walk (0 broken / 6 named-exempt / 825 scanned, both ways).
//
// D3 — §4.1's `OPT` environment switches are dropped from the shipped path. §4 states they exist
//      "**only** to reproduce the recorded alternate readings in §6 and §7. The settled condition is
//      every switch at its default." A guard that can be talked out of its own condition by an
//      environment variable is not a guard. Every switch is therefore hard-wired to its settled
//      default — spans masked, span scope line-level, blockquotes masked, fences masked, closed task
//      and sprint folders NOT exempt.
//      ⚠️ PRECISION ABOUT "BYTE-IDENTICAL". `walk`, `blank`, `maskCodeSpans`, `LINK`, `SKIP_SCHEME`,
//      `ELIDED` and `NAMED_EXEMPT` are transcribed byte-identical. `exempt` (named `exemptFile`
//      in §4.1) and `maskFencesAndQuotes` are byte-identical MODULO D3 — the only edit to either is
//      the removal of the `OPT.*` references, which is what D3 IS. Neither is byte-identical AND
//      OPT-free at the same time, and saying otherwise would overclaim.
//      ⛔ THE MATCH LOOP IS **NOT** BYTE-IDENTICAL, and an earlier revision of this header said it
//      was. Its match rule, skip rules, fragment rule and decode step are transcribed unchanged, but
//      it reads `root` rather than the module-global `ROOT`, calls `resolveExact` in place of the
//      inline `fs.existsSync(...) && (...)` test (that IS D2), and increments the `checked` /
//      `skipped` counters. The DECISION it reaches for any given link is unchanged; the text is not.
//
// ============================================================================================
// STRUCTURAL ADAPTATIONS — differences in the TEXT that change nothing the guard DECIDES.
// Approved by plan §3 and §5, and named here because "three deviations, nothing else differs" was
// false as written: these are not deviations from the condition, but they ARE differences.
// ============================================================================================
//
// S1 — THE ROOT SEAM. §4.1 is a script with a module-global `const ROOT = process.cwd()`. Here the
//      root is a PARAMETER threaded through `collectFiles(root)`, `resolveExact(root, …)` and
//      `scan(root)`. ⭐ That parameter is the whole fixture strategy: it is what lets the M and C
//      arms below run against a tree in os.tmpdir(), so proving the guard reddens inside
//      `ai-agents/tasks/done/` costs zero bytes written into this repo. The live condition is
//      ALWAYS run against `REPO` — `const LIVE = scan(REPO)`. It is a test seam, never an
//      environment switch, so it is not the D3 shape (nothing outside this file can move the root).
//
// S2 — INSTRUMENTATION. `scan` returns `visited`, `checked` and `skipped` alongside §4.1's `broken`
//      and named-exempt count. §4.1 prints its three totals and exits; a test has to be able to
//      prove WHAT it scanned, not only that it found nothing. `visited` is what makes "the vault
//      exemption lives in the definition of the scanned set" checkable (L5, M4) instead of merely
//      claimed, and `checked` is what makes "0 broken" mean something (L8). None of it is consulted
//      by the match rule; removing it all would change no verdict.
//
// S3 — SHAPE. §4.1's top-level statements become exported functions so the arms can call them, and
//      the reporting `console.log`s become assertion messages (`formatBroken`), which keep §4.1's
//      no-`file`-colon-line-number output discipline.
//
// ============================================================================================
// WHAT THIS GUARD DELIBERATELY DOES NOT SEE. Blind spots 1-7 are §7's named ones, carried in rather
// than found out later; blind spot 8 was found in review round 1 and disclosed by owner ruling.
// Each cost was RE-MEASURED on 2026-09-02, not inherited.
// ============================================================================================
//
//  1. BLOCKQUOTE LINES ARE SKIPPED — cost 8 instances across 6 files. Carried from 0176 scoping
//     decision 2 (a quotation is not a pointer). All 8 were read by hand on 2026-08-30 and all 8 are
//     quotation or proposed text, none genuine rot. ⛔ That makes today's sample clean; it does NOT
//     make the blind spot safe. A future genuine rot inside a blockquote will not be caught.
//  2. ANCHOR EXISTENCE IS NEVER CHECKED — `path#fragment` resolves the file part only. A link to a
//     heading that no longer exists in a file that does exist passes. Cost unmeasured, deliberately
//     not folded in.
//  3. REFERENCE-STYLE DEFINITIONS (`[a]` colon url) are out of scope BY NAME, not silently. Cost 0.
//  4. THE LINK GRAMMAR IS NARROWER THAN THE RULED CLASS. The ruled class is "a markdown inline
//     link"; `LINK` matches neither a nested-bracket label nor a balanced-paren destination.
//     Measured with a widened grammar — IDENTICAL red set. Live cost 0.
//  5. THE NAMED-EXEMPTION KEY SUPPRESSES A FUTURE ROT ON THE SAME PAIR. See `NAMED_EXEMPT` below,
//     where the caveat is carried verbatim rather than dropped. Cost 0 today.
//  6. THE FENCE MASKER HAS TWO ROUGH EDGES (§7 item 13, owner ruled "name it, do not fix it"). An
//     unterminated fence masks to EOF — a silent false-NEGATIVE surface, it hides findings rather
//     than inventing them. A fence indented four or more spaces is invisible to `^\s{0,3}`, which a
//     fence inside a list item is (15 such lines across 6 files). Cost of both together 0. ⭐ This
//     masker is transcribed AS-IS, and this comment is the record that that was done knowingly.
//  7. ⛔ GREEN HERE DOES NOT UNBLOCK THE SWEEPS. The forced-sequencing gate needs Half B (task 0176)
//     green too, and that is task 0237's real work — 19 instances across 14 files.
//  8. ⭐ CONTAINMENT IS LEXICAL, SO A SYMLINK DEFEATS IT — the EIGHTH blind spot, found in review
//     round 1 and disclosed by owner ruling 2026-09-02 ("Disclose as an eighth blind spot (Rec)")
//     rather than fixed. `resolveExact` compares STRINGS: it refuses a path that does not lie under
//     `root` lexically, and the segment walk refuses a `..` segment because `..` is never a
//     `readdirSync` entry. Neither call resolves symlinks. So a link whose path stays inside the
//     repo textually but leaves it through an in-repo symlink resolves as SATISFIED — measured in
//     review: with a symlink to `/etc` planted in a fixture tree, a target under it returned true.
//     `walk` likewise never follows a symlinked directory and never collects a symlinked `.md`,
//     so such a file is silently outside the scanned set.
//     ⛔ THIS IS THE SPECIFICATION'S HOLE, NOT THE TRANSCRIPTION'S. §4.1 uses `fs.existsSync` plus
//     the same lexical `startsWith` test and has the identical behaviour; closing it here would
//     mean `fs.realpathSync` and a FOURTH deviation from the document this task exists to
//     transcribe faithfully. It was ruled a disclosure, not a fix.
//     LIVE COST 0 — there are no symlinks anywhere under `ai-agents/` today. ⛔ That makes today's
//     sample clean; it does NOT make the blind spot safe. Note it also means C3's title, "never
//     satisfied", is true only for a LEXICAL escape.
//
// ============================================================================================
// WHY THERE IS NO `test/prove-red.sh` ENTRY — settled at the plan gate, not left to review.
// ============================================================================================
// Owner ruling, 2026-09-02, option label verbatim "No prove-red entry — follow the precedent (Rec)".
// All 28 prove-red mutations target an executable artifact reachable through an environment seam
// (FKIT_LAUNCHER, the hooks, FKIT_RELEASE_MJS, FKIT_FRONTMATTER_ROOT). `ai-agents/` has no such seam,
// and inventing one would mean shipping a production environment variable whose only purpose is to
// point the repo's own content guard somewhere else — the exact shape D3 rejects. The three sibling
// `ai-agents/`-content guards (task-id-uniqueness, adr-number-uniqueness, closed-rank-immutability)
// carry zero prove-red mutations each and discharge the duty a different way — export the pure
// functions and redden them against negative fixtures in-file. ⭐ The M and C tests below ARE those
// mutations. Each one fails when the condition is broken.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { REPO } from './harness.mjs';

// ── §4.1, transcribed ────────────────────────────────────────────────────────────────────────────

// 1. THE SCANNED SET.  Every .md under ai-agents/, recursively.
//    EXEMPT: ai-agents/wiki-vault/** — ADR-005 puts it out of every role's
//    reach but fkit-wiki's, so a guard that reddens on it is a guard nobody
//    may make green.
//    NOT exempt: tasks/done, tasks/cancelled, sprints/done, sprints/reviews,
//    knowledge-base/** — a link is a pointer, and a rotted pointer is repairable.
//    OUT of scope entirely: claude/, test/ — 440 of 443 hits there are frozen
//    test/fixtures/; the rest are claude/scaffold/ templates whose relative
//    links resolve in the CONSUMING project, not in this repo.
export function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// §4.1 names this `exemptFile`. D3 removes its `OPT.exemptClosed` branch — under the settled
// condition closed task and sprint folders are IN scope, so the vault branch is the whole rule.
export function exempt(rel) {
  if (rel.startsWith('ai-agents/wiki-vault/')) return true;
  return false;
}

// ⭐ THE EXEMPTION IS IN THE DEFINITION OF THE SCANNED SET, NOT A FILTER OVER FAILURES.
// `exempt` is consulted here, while the set is being built, so an exempted file never becomes a
// scanned file and never reaches the match loop at all. There is no post-filter over `broken`
// anywhere in this file — that is structural, and the scope tests below prove it by inspecting the
// returned file list rather than by trusting this comment.
export function collectFiles(root) {
  return walk(path.join(root, 'ai-agents'))
    .map((p) => path.relative(root, p).split(path.sep).join('/'))
    .filter((rel) => !exempt(rel))
    .sort();
}

// 2. MASKING.  A masked character becomes a space, so every offset and every
//    line number stays exactly where it was.
const blank = (s) => ' '.repeat(s.length);

// 2a. Fenced blocks (``` or ~~~), the fence lines themselves included.
// 2b. Blockquote lines — first non-space character is '>'.
//     Both carried over from 0176 scoping decision 2: a quotation is not a
//     link, and flagging one punishes the document that defines the convention.
// ⚠️ THE FENCE-CLOSE RULE IS COMMONMARK'S — a CLOSING fence carries no info string, which is what
// `m[2].trim() === ""` enforces. Both copies of this function had that wrong before 2026-08-30, the
// bug was introduced once and duplicated, and it hid one live instance (task 0266's plan). Do not
// "simplify" it back.
export function maskFencesAndQuotes(lines) {
  let fence = null;
  return lines.map((line) => {
    const m = /^\s{0,3}(`{3,}|~{3,})([^`~]*)$/.exec(line);
    if (fence !== null) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && m[2].trim() === "") fence = null;
      return blank(line);
    }
    if (m) { fence = m[1]; return blank(line); }
    if (/^\s*>/.test(line)) return blank(line);
    return line;
  });
}

// 2c. Inline code spans.  A run of N backticks opens a span; the next run of
//     EXACTLY N closes it; an unpaired run is literal text.
//     RULED: for the LINK half a link inside backticks is documented marker
//     text, not a pointer offered to a reader — so it is SKIPPED.
//     (The citation half rules the opposite way. See §1.)
export function maskCodeSpans(text) {
  const out = text.split('');
  let i = 0;
  while (i < out.length) {
    if (out[i] !== '`') { i++; continue; }
    let n = 0; while (out[i + n] === '`') n++;
    let j = i + n, close = -1;
    while (j < out.length) {
      if (out[j] === '`') {
        let k = 0; while (out[j + k] === '`') k++;
        if (k === n) { close = j; break; }
        j += k;
      } else j++;
    }
    if (close === -1) { i += n; continue; }
    for (let x = i; x < close + n; x++) if (out[x] !== '\n') out[x] = ' ';
    i = close + n;
  }
  return out.join('');
}

// ⭐ SPAN SCOPE IS LINE-LEVEL, AND THE REASON IS ACCURACY — NOT "NEVER FEWER".
// §7 item 4 records an earlier claim that the line-level masker "reports more, never fewer" than the
// document-level one, and ⛔ WITHDRAWS it as false. The two maskers are NOT nested; each reports
// something the other hides (line-level 6 across 4, document-level 4 across 3). The settled choice is
// still line-level, on the corrected reason that the document-level masker's one unique hit is a
// FALSE POSITIVE it creates by mis-pairing on an earlier unpaired backtick. Test C1 pins that down.
function maskDocument(src) {
  const masked = maskFencesAndQuotes(src.split('\n')).join('\n');
  return masked.split('\n').map(maskCodeSpans).join('\n');
}

// 3. THE MATCH RULE.
// What counts as a link: a markdown inline link. Reference-style definitions
// ([a]: url) are OUT of scope, named rather than silently dropped.
export const LINK = /(?<!!)\[[^\]\n]*\]\(\s*(<[^>\n]*>|[^()\s]+)(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\)/g;
// Skipped target classes: absolute schemes and a bare in-page anchor.
export const SKIP_SCHEME = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
// Skipped: an ELIDED target — prose elision, not a path.
export const ELIDED = (t) => t.includes('…') || t.includes('...');

// 3b. NAMED EXEMPT INSTANCES — owner ruling, 2026-08-30, "Exempt them by name (Rec)".
//     Each surviving instance was read in its surrounding source and is quoted or
//     illustrative text, NOT a pointer offered to a reader. They are exempted BY
//     NAME, with the reason, so the guard goes green honestly and 0355 inherits a
//     disposition rather than a shrug.
//     Keyed on (citing file, target) — deliberately NOT on a line number, because a
//     line number is the very claim form this document rules unsafe for a living file.
//     ⚠️ Cost of the key: a FUTURE genuine rot with the same (file, target) pair is
//     also suppressed. Named in §7 as a blind spot, measured cost 0 today.
export const NAMED_EXEMPT = new Set([
  // Synthetic illustrative board row inside ADR-040's own diagnosis of the old regex.
  'ai-agents/knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md::plan-sprint-4c.md',
  // Proposed replacement text for claude/skills/fkit-status/SKILL.md, quoted in an edit
  // block. The ../../../ depth is correct AT THAT TARGET, wrong from the task folder.
  'ai-agents/tasks/done/0266-retire-the-sprint-glob-in-fkit-status-skill-md-and-select-by-resolved-identity/plan.md::../../../ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md',
  // Throwaway scratchpad test-fixture rows quoted in 0268's worklog; the fixture never
  // existed in the repo ("never in the repo, never under ai-agents/" — the worklog itself).
  'ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/worklog.md::../sprint-4c.md',
  'ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/worklog.md::../tasks/backlog/0001-a/brief.md',
  // Proposed replacement text for claude/skills/fkit-stateful-review/SKILL.md, quoted in
  // an edit table. The ../ depth is correct AT THAT TARGET. Two occurrences, one pair.
  'ai-agents/tasks/done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/plan.md::../fkit-review/SKILL.md',
]);

// ── D2 — case-exact resolution with §4.1's containment test ──────────────────────────────────────

function entriesOf(dir, cache) {
  let e = cache.get(dir);
  if (e === undefined) {
    try { e = new Set(fs.readdirSync(dir)); } catch (_) { e = null; }
    cache.set(dir, e);
  }
  return e;
}

// Replaces §4.1's `fs.existsSync(abs) && (abs === ROOT || abs.startsWith(ROOT + path.sep))`.
//
// CONTAINMENT (§4.1, added 2026-08-30, R12). Rebasing alone does NOT confine the target — both
// path.join and path.resolve normalize '..', so `path.join(ROOT, '/../../../../../etc/hosts')`
// yields `/etc/hosts`, which exists, and `existsSync` returned TRUE. ⛔ The escape survived the fix
// that was described as closing it. Both branches — root-absolute AND relative — are covered here.
//
// CASE-EXACTNESS (D2). Each segment must appear in its parent directory listing with exactly the
// spelling the link used, so a wrongly-cased target is broken on a case-insensitive volume too.
export function resolveExact(root, abs, cache = new Map()) {
  if (!(abs === root || abs.startsWith(root + path.sep))) return false;
  const rel = path.relative(root, abs);
  if (rel === '') return true;
  let dir = root;
  for (const seg of rel.split(path.sep)) {
    const entries = entriesOf(dir, cache);
    if (entries === null || !entries.has(seg)) return false;
    dir = path.join(dir, seg);
  }
  return true;
}

// ── The scan ─────────────────────────────────────────────────────────────────────────────────────

// `root` is a parameter, not `process.cwd()`. ⭐ THAT PARAMETER IS THE WHOLE FIXTURE STRATEGY: it is
// what lets every mutation arm below run against a tree in os.tmpdir(), so proving that the guard
// reddens inside `ai-agents/tasks/done/` — and that it stays silent inside `ai-agents/wiki-vault/` —
// costs zero bytes written into this repo. It is NOT an escape hatch on the live condition, which is
// always run against REPO.
export function scan(root) {
  const visited = collectFiles(root);
  const cache = new Map();
  const broken = []; let namedExempt = 0;
  let checked = 0;
  const skipped = { scheme: 0, elided: 0, emptyAfterFragment: 0 };
  for (const rel of visited) {
    const src = fs.readFileSync(path.join(root, rel), 'utf8');
    const masked = maskDocument(src);
    masked.split('\n').forEach((line, idx) => {
      for (const m of line.matchAll(LINK)) {
        let t = m[1].replace(/^</, '').replace(/>$/, '');
        if (SKIP_SCHEME.test(t)) { skipped.scheme++; continue; }
        if (ELIDED(t)) { skipped.elided++; continue; }
        t = t.split('#')[0];              // FRAGMENT IGNORED. Anchor existence is
        if (t === '') { skipped.emptyAfterFragment++; continue; }  // explicitly OUT of scope.
        try { t = decodeURIComponent(t); } catch (_) { /* keep raw */ }
        checked++;
        const abs = t.startsWith('/')
          ? path.join(root, t)              // ROOT-ABSOLUTE: rebased onto the repo root
          : path.resolve(root, path.dirname(rel), t);
        if (resolveExact(root, abs, cache)) continue;
        if (NAMED_EXEMPT.has(rel + '::' + t)) { namedExempt++; continue; }
        broken.push({ file: rel, line: idx + 1, target: t });
      }
    });
  }
  return { broken, namedExemptCount: namedExempt, scanned: visited.length, visited, checked, skipped };
}

// ⛔ THE FAILURE MESSAGE NAMES THE LINE'S TEXT, NEVER A `file` + colon + line-number COORDINATE.
// A guard built to enforce a document that rules that citation form unsafe against a living file must
// not emit it. The line text is read back from the UNMASKED source, which is what a human needs to
// see; the record itself stays byte-identical to §4.1's.
function formatBroken(root, broken) {
  const cache = new Map();
  return broken.map((b) => {
    let text = cache.get(b.file);
    if (text === undefined) { text = fs.readFileSync(path.join(root, b.file), 'utf8').split('\n'); cache.set(b.file, text); }
    const quoted = (text[b.line - 1] || '').trim();
    return `    - ${b.file}\n        (line ${b.line})  ${quoted}\n        unresolved target  ->  ${b.target}`;
  }).join('\n');
}

// ── Fixture trees, always under os.tmpdir(), never in the repo ───────────────────────────────────

const MADE = [];
function fixture(files) {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), 'fkit-refint-'));
  MADE.push(dir);
  for (const [rel, body] of Object.entries(files)) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body);
  }
  return dir;
}
process.on('exit', () => { for (const d of MADE) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) { /* best effort */ } } });

// Every fixture tree needs at least one resolvable link, so that "0 broken" is never 0-because-empty.
const ANCHOR = {
  'ai-agents/knowledge-base/architecture.md': '# Arch\n',
  'ai-agents/index.md': 'A resolvable pointer [arch](knowledge-base/architecture.md) here.\n',
};

// ── L — the live corpus, opened read-only ────────────────────────────────────────────────────────

const LIVE = scan(REPO);

test('L1 live corpus: the scanned set is non-empty and large', () => {
  // Anti-vacuity, first and on its own. Everything below is trivially true over an empty corpus, and
  // a guard that silently scanned nothing is the failure mode task-id-uniqueness was built to avoid.
  // A FLOOR, never an exact count — the corpus moved 819 -> 825 in three days, and a guard that reds
  // on ordinary work is a guard someone deletes.
  assert.ok(LIVE.scanned > 800,
    `scanned only ${LIVE.scanned} markdown files under ${path.join(REPO, 'ai-agents')} — that is ` +
    'vacuous, not clean. Either the corpus really shrank below the floor (raise or lower this ' +
    'deliberately, with a measurement), or collectFiles() stopped finding the tree.');
});

test('L2 live corpus: BROKEN is 0 under the settled condition', () => {
  assert.deepEqual(LIVE.broken, [],
    `${LIVE.broken.length} unresolved markdown link(s) across ` +
    `${new Set(LIVE.broken.map((b) => b.file)).size} file(s) under ai-agents/\n` +
    formatBroken(REPO, LIVE.broken) +
    '\n  Each is a pointer offered to a reader that does not resolve. Repair the link, or — if it is ' +
    'quoted or illustrative text rather than a pointer — add it to NAMED_EXEMPT with its reason, ' +
    'and update the L3 count in the same edit.');
});

test('L3 live corpus: NAMED-EXEMPT is exactly 6 instances', () => {
  // §7 item 9(b), and it costs one line. ⛔ A test asserting only `broken.length === 0` reads just as
  // green if the exemption list silently swallows a SEVENTH instance. Six instances from five keys —
  // task 0272's pair matches twice.
  assert.equal(LIVE.namedExemptCount, 6,
    `NAMED_EXEMPT suppressed ${LIVE.namedExemptCount} instances, expected 6. A RISE means a new ` +
    'unresolved link happens to match an existing (file, target) key and is being silently ' +
    'swallowed — read it before changing this number. A FALL means an exemption stopped applying; ' +
    'L4 should say which.');
});

test('L4 named exemptions: no stale key — citing file still exists, target still missing', () => {
  // §7 item 9(a). An exemption is only ever consulted to SUPPRESS; nothing notices one that has
  // stopped applying. ⚠️ Not hypothetical here — 4 of the 5 keys are `ai-agents/tasks/done/` paths,
  // and this repo moves task folders between boards as routine work, so an ordinary close can orphan
  // a key. The failure is silent when it comes, which is why it is asserted rather than trusted.
  const cache = new Map();
  const missingCiter = [];
  const targetIsBack = [];
  for (const key of NAMED_EXEMPT) {
    const cut = key.indexOf('::');
    const rel = key.slice(0, cut);
    const target = key.slice(cut + 2);
    // ⛔ CASE-EXACT ON BOTH HALVES. This was `fs.existsSync` while the target check below was
    // already case-exact, so on a case-insensitive volume a citing file renamed in case ONLY read
    // as present here and as stale on a case-sensitive runner — the "the result depends on who runs
    // it" failure D2 was adopted to remove, reintroduced in the one assertion that watches D2's own
    // exemption list. `resolveExact` applies D2's rule to the citer too.
    if (!resolveExact(REPO, path.join(REPO, rel), cache)) { missingCiter.push(key); continue; }
    const abs = target.startsWith('/')
      ? path.join(REPO, target)
      : path.resolve(REPO, path.dirname(rel), target);
    if (resolveExact(REPO, abs, cache)) targetIsBack.push(key);
  }
  assert.deepEqual(missingCiter, [],
    'NAMED_EXEMPT keys whose CITING FILE no longer exists — it was renamed, moved between boards, ' +
    'or deleted. The exemption now suppresses nothing and hides the next rot at its new path:\n' +
    missingCiter.map((k) => `    - ${k}`).join('\n'));
  assert.deepEqual(targetIsBack, [],
    'NAMED_EXEMPT keys whose TARGET now resolves — the link is no longer broken, so the exemption ' +
    'is dead weight and must be removed (and the L3 count lowered with it):\n' +
    targetIsBack.map((k) => `    - ${k}`).join('\n'));
});

test('L5 scope: no file under ai-agents/wiki-vault/ was ever scanned', () => {
  // ADR-005 puts the vault out of every role's reach but fkit-wiki's, so a guard that reddens on it
  // is a guard nobody may make green. Asserted against the RETURNED FILE LIST, not against the
  // failure list — this is what makes "the exemption is in the definition" checkable rather than
  // merely claimed.
  const leaked = LIVE.visited.filter((rel) => rel.startsWith('ai-agents/wiki-vault/'));
  assert.deepEqual(leaked, [],
    `${leaked.length} wiki-vault file(s) entered the scanned set. ADR-005 makes these unrepairable ` +
    `by any role but fkit-wiki:\n${leaked.slice(0, 10).map((r) => `    - ${r}`).join('\n')}`);
  // And the exemption must be doing real work — a vault that is simply absent proves nothing.
  assert.ok(fs.existsSync(path.join(REPO, 'ai-agents', 'wiki-vault')),
    'ai-agents/wiki-vault/ does not exist, so L5 passed vacuously. The exemption is untested here ' +
    'until it does — S1 in the fixture arms (M4) covers the same ground independently.');
});

test('L6 scope: the closed and archival folders WERE scanned — their absence is the defect', () => {
  // ⭐ THE INVERSE HALF, and it is the half that matters. The owner ruled on 2026-08-29 that closed
  // task folders, cancelled folders, archived sprints, sprint review ledgers and the knowledge-base
  // are all IN scope — a link is a pointer, and a rotted pointer is repairable. Task 0353's brief
  // had assumed the opposite. Without this test, a future edit that quietly exempts `tasks/done/`
  // would make the guard MORE green and nothing would object.
  // ⛔ A FLOOR PER PREFIX, NOT `.some()`. An earlier revision asked only whether each prefix
  // contributed at least ONE file, which a narrowing has to wipe out a whole tree to trip: 560 of
  // the 561 files under tasks/done/ could be silently re-exempted and it still read green. Each
  // floor below sits under its count measured 2026-09-02 (shown), with room for the ordinary churn
  // of closing work — these trees only grow, because a close adds to them and nothing prunes them.
  // ⛔ A floor is deliberately not an exact count; an exact count reds on ordinary work (L1's does
  // not, and the corpus moved 819 -> 827 in four days).
  const required = [
    ['ai-agents/tasks/done/', 400],        // 561 on 2026-09-02
    ['ai-agents/tasks/cancelled/', 10],    //  13
    ['ai-agents/sprints/done/', 5],        //   6
    ['ai-agents/sprints/reviews/', 2],     //   2 — the tree holds only two files, so this floor IS
                                           //       today's count. Removing a sprint review ledger
                                           //       is not ordinary work; if it ever happens, lower
                                           //       this deliberately and with a measurement, the
                                           //       same discipline L3's exact 6 is held to.
    ['ai-agents/knowledge-base/', 80],     // 102
  ];
  const thin = required
    .map(([prefix, floor]) => [prefix, floor, LIVE.visited.filter((rel) => rel.startsWith(prefix)).length])
    .filter(([, floor, count]) => count < floor);
  assert.deepEqual(thin, [],
    'these folders are IN scope by owner ruling (2026-08-29) but contributed FEWER scanned files ' +
    'than their measured floor:\n' +
    thin.map(([p, floor, count]) => `    - ${p}  ${count} scanned, floor ${floor}`).join('\n') +
    '\n  Either the folder genuinely shrank (lower the floor deliberately, with a measurement), or ' +
    'something re-exempted part of it. The second is a regression against the ruling, not an ' +
    'optimisation — a narrowing makes the guard MORE green, which is why it needs its own assertion.');

  // ⚠️ WHAT THIS STILL DOES NOT CATCH, stated rather than left for the next reviewer to find. These
  // floors stop a narrowing aimed at ONE tree. A narrowing spread thinly across all of them is
  // bounded only by L1's floor — 827 scanned against a floor of 800 leaves 27 files of slack today.
  // Closing that needs an exact corpus count, which L1 rejects for good reason. The residual is the
  // slack, and it shrinks every time the corpus grows.
});

test('L7 scope: claude/ and test/ were never walked at all', () => {
  // ⚠️ 443 hits live in those two trees — 440 of them frozen test/fixtures/ (ADR-042), the rest
  // claude/scaffold/ templates whose relative links resolve in the CONSUMING project, not here. A
  // guard reddening on those is wrong, not merely inconvenient. This assertion is what stops the
  // scanned set from ever quietly becoming a 443-instance red set.
  const strays = LIVE.visited.filter((rel) => !rel.startsWith('ai-agents/'));
  assert.deepEqual(strays, [],
    `${strays.length} scanned file(s) sit outside ai-agents/. claude/ and test/ are out of scope ` +
    `entirely:\n${strays.slice(0, 10).map((r) => `    - ${r}`).join('\n')}`);
});

test('L8 disclosure: the guard resolves a non-trivial number of links, and reports its skips', (t) => {
  // A guard that checks almost nothing passes trivially. This prints the working figures so a reader
  // of a green run can see WHAT went green, rather than only that something did.
  t.diagnostic(`scanned ${LIVE.scanned} files, resolved ${LIVE.checked} link targets, ` +
    `${LIVE.broken.length} broken, ${LIVE.namedExemptCount} named-exempt`);
  t.diagnostic(`skipped by class — scheme/protocol-relative/anchor ${LIVE.skipped.scheme}, ` +
    `elided ${LIVE.skipped.elided}, empty-after-fragment ${LIVE.skipped.emptyAfterFragment}`);
  assert.ok(LIVE.checked > 2000,
    `only ${LIVE.checked} link targets were resolved across ${LIVE.scanned} files. That is far ` +
    'below the measured working range (3131 on 2026-09-02), so the matcher is probably not ' +
    'matching, and "0 broken" would mean nothing.');
});

// ── M — the mutation arms. Verification 4', all four, every fixture in os.tmpdir() ───────────────

test('M1 mutation: a broken link in an IN-SCOPE file reds, and stops redding when removed', () => {
  const clean = { ...ANCHOR, 'ai-agents/sprints/backlog.md': 'See [the plan](../knowledge-base/architecture.md).\n' };
  // Run 1 — the fixture is green before anything is planted. Without this the arm proves nothing.
  const a = scan(fixture(clean));
  assert.deepEqual(a.broken, [], 'the clean fixture was already broken, so run 2 would prove nothing');
  assert.ok(a.checked >= 2, 'the clean fixture resolved fewer than two links — it is too thin to be a control');

  // Run 2 — plant it.
  const planted = { ...clean, 'ai-agents/sprints/backlog.md': 'See [the plan](../knowledge-base/nonexistent.md).\n' };
  const b = scan(fixture(planted));
  assert.equal(b.broken.length, 1, 'the planted broken link was not reported');
  assert.equal(b.broken[0].file, 'ai-agents/sprints/backlog.md');
  assert.equal(b.broken[0].target, '../knowledge-base/nonexistent.md');

  // Run 3 — remove it, green again. Proves the red came from the link and not from the fixture.
  const c = scan(fixture(clean));
  assert.deepEqual(c.broken, []);
});

test('M2 mutation: a broken link in ai-agents/tasks/done/ REDS — closed folders are in scope', () => {
  // ⭐ THE ARM THE ORIGINAL BRIEF HAD BACKWARDS. Task 0353's brief assumed closed folders were exempt;
  // the owner ruled on 2026-08-29 that they are not. This is that ruling, made executable.
  // ⛔ It runs in a fixture and NOT against the repo precisely because planting one for real would
  // mean editing a closed task folder, which this task is forbidden to do.
  const root = fixture({
    ...ANCHOR,
    'ai-agents/tasks/done/0001-a-closed-task/brief.md': 'Superseded by [the ADR](../../../knowledge-base/decisions/adr-999-gone.md).\n',
  });
  const r = scan(root);
  assert.equal(r.broken.length, 1, 'a broken link inside ai-agents/tasks/done/ was NOT reported — ' +
    'closed folders are IN scope (owner ruling 2026-08-29). Something re-exempted them.');
  assert.equal(r.broken[0].file, 'ai-agents/tasks/done/0001-a-closed-task/brief.md');
  // The same shape must also red in the other two archival trees the ruling names.
  const other = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/cancelled/0002-b/brief.md': '[x](./gone.md)\n',
    'ai-agents/sprints/done/sprint-1.md': '[y](./gone.md)\n',
    'ai-agents/sprints/reviews/sprint-1-review.md': '[z](./gone.md)\n',
  }));
  assert.equal(other.broken.length, 3,
    'tasks/cancelled/, sprints/done/ and sprints/reviews/ must all red — all three are in scope');
});

test('M3 mutation: a broken link on a NAMED_EXEMPT (file, target) pair passes, and is COUNTED', () => {
  // ⛔ A SILENT PASS IS NOT THE SAME RESULT AS A COUNTED EXEMPTION, and this arm is what tells them
  // apart. It also demonstrates §7 item 9's named cost from the other side — the key is (file,
  // target), so this FRESHLY PLANTED link, which is a genuine break, is suppressed too.
  const key = 'ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/worklog.md';
  const root = fixture({ ...ANCHOR, [key]: 'A quoted fixture row [Sprint 4c](../sprint-4c.md) here.\n' });
  const r = scan(root);
  assert.deepEqual(r.broken, [], 'a NAMED_EXEMPT pair must not appear in the red set');
  assert.equal(r.namedExemptCount, 1,
    'the exemption fired but was NOT counted — that is exactly the silent swallow L3 exists to ' +
    'catch, and it would make L3 unable to see a seventh instance');

  // The same target from a DIFFERENT citing file is not exempt — the key really is the pair.
  const elsewhere = scan(fixture({ ...ANCHOR, 'ai-agents/tasks/done/0999-other/worklog.md': '[Sprint 4c](../sprint-4c.md)\n' }));
  assert.equal(elsewhere.broken.length, 1, 'the exemption leaked to a file it is not keyed to');
  assert.equal(elsewhere.namedExemptCount, 0);
});

test('M4 mutation: a broken link under ai-agents/wiki-vault/ is skipped and never scanned', () => {
  const root = fixture({
    ...ANCHOR,
    'ai-agents/wiki-vault/some-page.md': 'A rotted pointer [gone](./nowhere.md) that no role but fkit-wiki may repair.\n',
  });
  // The file really is on disk — otherwise "not scanned" would be true for the wrong reason.
  assert.ok(fs.existsSync(path.join(root, 'ai-agents', 'wiki-vault', 'some-page.md')));
  const r = scan(root);
  // ⛔ AND THE SCAN MUST HAVE DONE SOMETHING, which is M1's discipline applied here. Without these
  // two lines every assertion below is satisfied by `visited: []` — a scan that collected nothing at
  // all would pass this arm while proving the opposite of what it claims. L1 and M1 catch that
  // globally; this arm was locally vacuous until round 1 said so.
  assert.ok(r.scanned >= 2, `the fixture scanned only ${r.scanned} files — "the vault file was not ` +
    'scanned" is then true for the wrong reason');
  assert.ok(r.checked >= 1, 'the fixture resolved no links at all, so nothing was actually exercised');
  assert.deepEqual(r.broken, [], 'a wiki-vault link reddened the guard — ADR-005 makes it unrepairable');
  assert.equal(r.visited.filter((rel) => rel.startsWith('ai-agents/wiki-vault/')).length, 0,
    'the vault file entered the scanned set and was filtered out of the FAILURES afterwards. The ' +
    'exemption must live in the definition of the scanned set, not in a post-filter over broken.');
  // Route (b) — the predicate asserted directly, so the exemption stays proven even if the walk is
  // later restructured.
  assert.equal(exempt('ai-agents/wiki-vault/x.md'), true);
  assert.equal(exempt('ai-agents/wiki-vault/nested/deep/x.md'), true);
  assert.equal(exempt('ai-agents/tasks/done/0001-a/brief.md'), false);
  assert.equal(exempt('ai-agents/knowledge-base/architecture.md'), false);
});

// ── C — condition-fidelity units ─────────────────────────────────────────────────────────────────

test('C1 the line-level span masker does not report the document-level maskers false positive', () => {
  // §7 item 4, on its CORRECTED reason. The two maskers are not nested. The document-level one's sole
  // unique hit is a false positive it CREATES: an earlier unpaired backtick mis-aligns its pairing,
  // so a link sitting inside a span that opens and closes on one line is left unmasked.
  const src = [
    'An unpaired backtick ` opens nothing and is literal text.',
    'Then a properly paired span `[Sprint 10](../sprint-10.md)` on one line.',
    '',
  ].join('\n');

  const lineLevel = src.split('\n').map(maskCodeSpans).join('\n');
  assert.equal([...lineLevel.matchAll(LINK)].length, 0,
    'the line-level masker failed to mask a link inside a same-line backtick span');

  const documentLevel = maskCodeSpans(src);
  assert.equal([...documentLevel.matchAll(LINK)].length, 1,
    'the document-level masker no longer produces the false positive this test pins down — if that ' +
    'is a real improvement, re-measure §7 item 4 and re-rule the span scope deliberately; do not ' +
    'just delete this assertion.');
});

test('C2 a CLOSING fence carries no info string (CommonMark)', () => {
  // The bug that was introduced once and duplicated into both halves of the specification, and that
  // hid one live instance until 2026-08-30.
  const masked = maskFencesAndQuotes([
    '```',
    '[inside](./gone.md)',
    '```js',                         // info string -> NOT a closer, still inside the fence
    '[still inside](./gone.md)',
    '```',                           // bare -> this is the closer
    '[outside](./gone.md)',
  ]);
  assert.equal(masked[1].trim(), '', 'a line inside the fence was not masked');
  assert.equal(masked[3].trim(), '', '```js was wrongly accepted as a closing fence');
  assert.equal(masked[5].trim(), '[outside](./gone.md)', 'the line after the real closer was masked');

  // A longer run closes a shorter one; a shorter run does not close a longer one.
  const nested = maskFencesAndQuotes(['````', '```', '[a](./gone.md)', '````', '[b](./gone.md)']);
  assert.equal(nested[2].trim(), '', 'a 3-backtick run wrongly closed a 4-backtick fence');
  assert.equal(nested[4].trim(), '[b](./gone.md)');

  // A tilde run does not close a backtick fence.
  const mixed = maskFencesAndQuotes(['```', '~~~', '[a](./gone.md)', '```', '[b](./gone.md)']);
  assert.equal(mixed[2].trim(), '', '~~~ wrongly closed a ``` fence');
  assert.equal(mixed[4].trim(), '[b](./gone.md)');
});

test('C3 a target escaping the repo root is BROKEN, never satisfied (R12)', () => {
  // ⛔ REBASING ALONE LOOKED LIKE THE FIX AND WAS NOT. path.join normalises '..', so
  // path.join(ROOT, '/../../../../../etc/hosts') yields /etc/hosts — which exists, and existsSync
  // returned true. Both the root-absolute and the relative branch are covered. This arm names a real
  // host path deliberately: it is the one that actually escaped.
  //
  // ⚠️ WHAT THIS TEST DOES *NOT* ISOLATE, measured rather than assumed. Under D2 the escape is
  // refused TWICE over, and this test cannot tell the two refusals apart. Deleting the containment
  // line from resolveExact and re-running the whole file reds NOTHING — verified 2026-09-02, 18 pass
  // / 0 fail, live figures unchanged. The reason is structural: for any `abs` outside `root`,
  // path.relative(root, abs) begins with a '..' segment, and '..' is never an entry in a
  // readdirSync listing, so the segment walk refuses it on its own. ⛔ The containment line is
  // therefore a DEFENSIVE DUPLICATE under D2, not the sole mechanism — and it is transcribed anyway
  // because §7 item 11 instructs it and because it is the half that survives if D2 is ever reverted
  // to fs.existsSync. Saying this test pins containment down would be the overclaim the condition
  // document exists to prevent.
  //
  // ⚠️ "NEVER SATISFIED" MEANS NEVER SATISFIED BY A *LEXICAL* ESCAPE. Both mechanisms above compare
  // strings and neither resolves symlinks, so a target that leaves the repo through an IN-REPO
  // SYMLINK still resolves as satisfied. That is blind spot 8 in the header — §4.1 has the same
  // hole, live cost 0, disclosed by owner ruling rather than fixed.
  const root = fixture({
    ...ANCHOR,
    'ai-agents/escapes.md': [
      'Root-absolute escape [a](/../../../../../etc/hosts).',
      'Relative escape [b](../../../../../../../../etc/hosts).',
      'Plain root-absolute [c](/etc/hosts).',
      // ⭐ AND THE POSITIVE CASE, which is what PINS the root-absolute branch. The three escapes
      // above red under either resolution rule, so on their own they leave the branch unpinned:
      // resolving '/etc/hosts' relatively also yields '/etc/hosts', because an absolute second
      // argument wins in path.resolve. This one resolves ONLY because the branch rebases it onto
      // the root. Delete the rebase and it reds — verified 2026-09-02.
      'Root-absolute and SATISFIED [d](/ai-agents/knowledge-base/architecture.md).',
    ].join('\n') + '\n',
  });
  const r = scan(root);
  assert.equal(r.broken.length, 3,
    'a LEXICAL escape from the repo root resolved as SATISFIED. Under D2 two things refuse it and ' +
    "BOTH would have to be gone for this to red: the segment walk (a '..' segment is never an " +
    'entry in a readdirSync listing) and the containment line it duplicates. What does NOT refuse ' +
    'it is rebasing onto the root — path.join normalises the .. away. See the note above:\n' +
    formatBroken(root, r.broken));

  assert.deepEqual(r.broken.map((b) => b.target).sort(),
    ['../../../../../../../../etc/hosts', '/../../../../../etc/hosts', '/etc/hosts'],
    'the root-absolute target that lies INSIDE the repo must NOT be in the red set — if it is, the ' +
    'root-absolute branch has stopped rebasing onto the root');

  // And the predicate directly, so the reason is pinned and not inferred from a count.
  assert.equal(resolveExact(root, path.join(root, '/../../../../../etc/hosts')), false);
  assert.equal(resolveExact(root, '/etc/hosts'), false);
  assert.equal(resolveExact(root, root), true);
});

test('C4 a wrongly-cased target is BROKEN, on a case-insensitive volume too (D2)', (t) => {
  const root = fixture({
    ...ANCHOR,
    'ai-agents/knowledge-base/Architecture-Notes.md': '# Notes\n',
    'ai-agents/casing.md': 'Correct [a](knowledge-base/Architecture-Notes.md), wrong [b](knowledge-base/architecture-notes.md).\n',
  });
  // Report which kind of volume this actually ran on — the assertion holds either way, but only a
  // case-INSENSITIVE volume exercises what D2 was adopted for.
  const insensitive = fs.existsSync(path.join(root, 'ai-agents', 'knowledge-base', 'ARCHITECTURE-NOTES.md'));
  t.diagnostic(`fixture volume is case-${insensitive ? 'INSENSITIVE (D2 is load-bearing here)' : 'sensitive (D2 is redundant here, and harmless)'}`);

  const r = scan(root);
  assert.equal(r.broken.length, 1,
    'a wrongly-cased target did not red. On macOS fs.existsSync follows the case-insensitive volume ' +
    'and passes it, so the same test would red on a case-sensitive CI runner — a result that ' +
    'depends on who runs it:\n' + formatBroken(root, r.broken));
  assert.equal(r.broken[0].target, 'knowledge-base/architecture-notes.md');
});

test('C5 each skipped target class, named separately', () => {
  const cases = {
    'absolute scheme': '[a](https://example.invalid/x.md)',
    'mailto scheme': '[a](mailto:nobody@example.invalid)',
    'protocol-relative': '[a](//example.invalid/x.md)',
    'bare in-page anchor': '[a](#a-heading-that-is-not-checked)',
    'elided with a unicode ellipsis': '[a](ai-agents/tasks/done/0195-…/worklog.md)',
    'elided with three ASCII dots': '[a](ai-agents/tasks/done/0195-.../worklog.md)',
    'image syntax is not a link': '![a](./definitely-gone.md)',
    'reference-style definition': '[a]: ./definitely-gone.md',
  };
  for (const [name, body] of Object.entries(cases)) {
    const r = scan(fixture({ ...ANCHOR, 'ai-agents/skips.md': body + '\n' }));
    assert.deepEqual(r.broken, [], `${name} must be skipped, not reported: ${body}`);
  }
  // ⛔ And the control — the same shape WITHOUT the skip-triggering part must red, so this test can
  // never pass because the matcher stopped matching anything at all.
  const control = scan(fixture({ ...ANCHOR, 'ai-agents/skips.md': '[a](./definitely-gone.md)\n' }));
  assert.equal(control.broken.length, 1, 'the control did not red — the skip cases above prove nothing');
});

test('C6 path#fragment resolves the file part, and the fragment is ignored', () => {
  const root = fixture({
    ...ANCHOR,
    'ai-agents/frags.md': 'Live [a](knowledge-base/architecture.md#a-heading-that-does-not-exist), dead [b](knowledge-base/missing.md#whatever).\n',
  });
  const r = scan(root);
  assert.equal(r.broken.length, 1,
    'anchor existence is explicitly out of scope — a link to a missing heading in a file that EXISTS ' +
    'must pass (blind spot 2), while a missing FILE must still red');
  assert.equal(r.broken[0].target, 'knowledge-base/missing.md',
    'the reported target still carries its fragment — it must be stripped before resolution');
});

test('C8 the two remaining target-normalisation branches are pinned, not merely transcribed', () => {
  // ⭐ WHY THIS TEST EXISTS. Under owner Ruling 2 (2026-09-02) this file adds no `test/prove-red.sh`
  // entry, and the M and C arms ARE the mutation proof in its place. That makes an UNPINNED branch a
  // hole in the proof, not a harmless spare. Review round 1 measured three transcribed branches with
  // zero live instances and no arm covering them: root-absolute rebasing (now pinned in C3),
  // percent-decoding, and angle-bracket destinations. Deleting any of the three reddened NOTHING —
  // 18 pass / 0 fail each time. These are the other two, with a live count of 0 each.

  // 1. PERCENT-DECODING. `%20` must be decoded before resolution, so a link to a filename containing
  //    a space resolves. Remove `decodeURIComponent` and the first of these reds.
  const decoded = scan(fixture({
    ...ANCHOR,
    'ai-agents/knowledge-base/a note.md': '# Spaces\n',
    'ai-agents/encoded.md': [
      'Encoded and RESOLVABLE [a](knowledge-base/a%20note.md).',
      'Encoded and MISSING [b](knowledge-base/no%20such%20note.md).',
    ].join('\n') + '\n',
  }));
  assert.equal(decoded.broken.length, 1,
    'a percent-encoded target that names a real file did not resolve — decodeURIComponent is not ' +
    'being applied before resolution');
  assert.equal(decoded.broken[0].target, 'knowledge-base/no such note.md',
    'the reported target must be the DECODED one — that is the path a reader has to go and fix');

  // 2. ANGLE-BRACKET DESTINATIONS. `[a](<x.md>)` is CommonMark's form for a destination that may
  //    contain spaces. `LINK` captures the brackets, so the match loop strips them. Remove the two
  //    `.replace` calls and both of these red.
  const angled = scan(fixture({
    ...ANCHOR,
    'ai-agents/knowledge-base/plain.md': '# Plain\n',
    'ai-agents/angled.md': [
      'Angled and RESOLVABLE [a](<knowledge-base/plain.md>).',
      'Angled and MISSING [b](<knowledge-base/absent.md>).',
    ].join('\n') + '\n',
  }));
  assert.equal(angled.broken.length, 1,
    'an angle-bracketed destination naming a real file did not resolve — the <> wrapper is not ' +
    'being stripped, so every angled target would resolve against a literal "<...>" filename');
  assert.equal(angled.broken[0].target, 'knowledge-base/absent.md',
    'the reported target still carries its angle brackets');
});

test('C7 masker parity with the citation half (§7 item 14)', (t) => {
  // §7 item 14. `maskFencesAndQuotes` is hand-duplicated into FOUR places — §4.1, §4.2, this file,
  // and task 0176's `test/coordination-citation-policy.test.js`. ⚠️ Not a speculative risk: review
  // round 2 found the CommonMark fence-close bug in BOTH specification copies, because it was
  // introduced once and copied. A correction applied to one copy and not the other makes the two
  // halves silently disagree about what a fenced block is.
  //
  // ⚠️ WHAT THIS COMPARISON IS AND IS NOT, measured against five simulated siblings on 2026-09-02.
  // Genuine drift IS reported and a genuine copy IS accepted. Two edges remain, and BOTH now fail
  // SAFE — they report drift that is not there, rather than parity that is not there:
  //   - a re-indented copy compares unequal, because this is a byte comparison and `.toString()`
  //     returns our source verbatim;
  //   - a `}` inside a string literal in the sibling's body ends the brace scan early, so the slice
  //     is truncated and compares unequal.
  // ⛔ NEITHER IS FIXED HERE, deliberately. Fixing them means normalising whitespace or parsing the
  // sibling, and normalising is exactly what §7 item 14 asks for the opposite of — it asks that the
  // two copies be BYTE-IDENTICAL. Loosening the comparison to remove a false alarm would weaken the
  // thing being asserted. A false drift is a loud, cheap, correctable failure; a false parity is a
  // silent one, and that half was fixed.
  // ⛔ ALL OF THE ABOVE IS UNMEASURED AGAINST THE REAL SIBLING, because there is no real sibling
  // yet — see the skip below.
  const sibling = path.join(REPO, 'test', 'coordination-citation-policy.test.js');
  if (!fs.existsSync(sibling)) {
    // ⛔ LOUD, NOT SILENT. This ships before task 0176 does, so the check is live the moment the
    // sibling lands and 0176 does not have to remember to build it. Reporting the absence beats
    // passing quietly, and beats leaving the check downstream of the drift it exists to catch.
    t.diagnostic('⚠️ PARITY UNCHECKED — test/coordination-citation-policy.test.js does not exist yet ' +
      '(task 0176 is unshipped). maskFencesAndQuotes is duplicated by hand and has ALREADY drifted ' +
      'once; this assertion goes live automatically when that file lands.');
    t.skip('sibling half not yet built — parity cannot be checked, and the absence is reported above');
    return;
  }
  const src = fs.readFileSync(sibling, 'utf8');
  // ⛔ THE DECLARATION IS MATCHED WITH ITS MODIFIERS, NOT WITH indexOf('function …'). A plain
  // indexOf starts the slice at the `f` of `function`, so `async function maskFencesAndQuotes(`
  // yields a slice IDENTICAL to ours and the parity check passes on a sibling that is not the same
  // function at all — FALSE PARITY, measured against a simulated sibling on 2026-09-02. Capturing
  // the modifiers means an async sibling now reports drift, which is the honest answer.
  const decl = /(?:async\s+)?function\s+maskFencesAndQuotes\s*\(/.exec(src);
  assert.notEqual(decl, null,
    `${sibling} exists but declares no maskFencesAndQuotes — if the citation half stopped using ` +
    'this masker, §7 item 14 needs re-ruling, not this assertion deleting');
  const start = decl.index;
  let depth = 0, end = -1;
  for (let i = src.indexOf('{', start); i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) { end = i + 1; break; }
  }
  const theirs = src.slice(start, end).replace(/\r\n/g, '\n').trim();
  const ours = maskFencesAndQuotes.toString().replace(/\r\n/g, '\n').trim();
  assert.equal(theirs, ours,
    'the two hand-maintained copies of maskFencesAndQuotes have DRIFTED. Whoever changes this ' +
    'function in either half must change it in both — otherwise the link half and the citation half ' +
    'silently disagree about what a fenced block is (§7 item 14).\n' +
    `  this file  ->\n${ours}\n  ${sibling}  ->\n${theirs}`);
});
