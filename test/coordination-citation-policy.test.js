// The coordination-citation guard — Half B of the reference-integrity condition (task 0176).
//
// ⭐ THE SPECIFICATION IS A DOCUMENT, AND THIS FILE TRANSCRIBES IT.
// `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` §4.2 is the
// settled condition, ruled by the owner across three review rounds. Its §4.2 preamble says, verbatim:
// "0176's implementer should TRANSCRIBE this", and §4's preamble adds "⛔ Do not paraphrase these
// into a fresh regex" — §2 C2 of that document is the measured evidence of what paraphrasing costs
// (five hand-written matchers produced five different figures, none of which reproduced).
//
// ⚠️ THE REVISION TRANSCRIBED HERE, and the discrepancy that comes with naming it. The document is
// taken AS COMMITTED AT c797df4 — its only commit — verified clean with `git status` at build time,
// md5 163d85e16df278706ebc2d6c59a31998, §4.2 extract md5 6c6242a6d57f3625961143b723c3e0ad. ⛔ Task
// 0176's brief records a DIFFERENT document md5 (fea9ce0a5b71acda7f3070e76d0f8ccc), which resolves to
// no committed revision — it was taken on 2026-08-30 from an uncommitted working tree while review
// round 2 was still open. The brief itself warned this could happen and asked that the revision taken
// be recorded. It is recorded here and in this task's worklog.
//
// SCOPE — this is the FOURTH test-scope category, not a fifth, and the precedent is named.
// ADR-014 §2 fenced fkit's test scope at two things (the argv handed to `claude`, and the
// skillOverrides map). ADR-017 rule 4 widened it to a third (the stdout contract of a shipped skill
// executable). `test/task-id-uniqueness.test.js` recorded the fourth — an invariant over the repo's
// own `ai-agents/` CONTENT rather than over product behavior — and this suite is another of that same
// fourth kind, as is its sibling half `test/reference-integrity.test.js` (task 0354).
//
// ⚠️ THIS TEST READS THE REPO. `test/harness.mjs` states the standing rule — "Nothing here writes
// into the repo, every project lives under os.tmpdir()." That rule is intact. The live corpus is
// opened READ-ONLY. Every mutation fixture below is built under os.tmpdir(). ⛔ Nothing is ever
// written to `ai-agents/wiki-vault/`, which this half never even walks.
//
// ============================================================================================
// THE FIVE DELIBERATE DEVIATIONS FROM §4.2. They are the only differences in what the guard
// DECIDES, and D5 changes nothing it decides at all. They are named here rather than found late.
// ============================================================================================
//
// D1 — CommonJS preamble becomes an ESM preamble. §4.2 is a standalone script
//      (`'use strict'; const fs = require('fs')`); the house idiom is ESM. Measured 2026-09-02 — of
//      the 26 pre-existing `test/*.test.js` files, 26 use `import` and ZERO use `require`.
//      ⭐ The imports are deliberately DEFAULT imports (`import fs from 'node:fs'`) rather than NAMED
//      ones, so that every call site inside the transcribed bodies stays literally `fs.readFileSync`
//      / `path.join`. COST 0.
//
// D2 — §4.2's `OPT` environment switches are dropped from the shipped path. §4.2's own header states
//      they exist to reproduce the recorded alternate readings and that "The SETTLED condition is
//      every switch at its default." A guard that can be talked out of its own condition by an
//      environment variable is not a guard. Every switch is therefore hard-wired to its settled
//      default — fences masked, blockquotes masked, inline code spans NOT masked, sprints/done and
//      sprints/reviews NOT scanned, closed task folders exempt IN WHOLE. This is exactly the sibling
//      half's D3, taken for the same reason.
//      ⚠️ PRECISION ABOUT "BYTE-IDENTICAL", because saying more would overclaim — and review round 1
//      caught this very paragraph overclaiming (finding R6). Re-measured construct by construct
//      against §4.2 as committed at c797df4: `blank` is byte-identical, full stop. `TARGET`, `exempt`
//      and `maskFencesAndQuotes` are byte-identical MODULO A LEADING `export ` — that keyword is D1,
//      the ESM preamble, and it is what lets the arms below import them — and, for `exempt` and
//      `maskFencesAndQuotes` ONLY, modulo the removed `OPT.*` references, which is what D2 IS
//      (`exempt` loses the whole `OPT.oldExempt` line; `maskFencesAndQuotes` loses two `OPT.fences`
//      ternaries and the `OPT.quotes &&` guard). Nothing else differs in any of the four.
//      ⛔ THE SCAN LOOP IS **NOT** BYTE-IDENTICAL. Its match rule, masking order and exemption test
//      are transcribed unchanged, but it reads a `root` parameter rather than the module-global
//      `ROOT` (that is D3) and it increments the D5 counters. The DECISION it reaches for any given
//      line is unchanged; the text is not.
//
// D3 — THE ROOT SEAM. §4.2 is a script with a module-global `const ROOT = process.cwd()`. Here the
//      root is a PARAMETER threaded through `collectFiles(root)` and `scan(root)`. ⭐ That parameter
//      is the whole fixture strategy: it is what lets the M and C arms below run against a tree in
//      os.tmpdir(), so proving the guard STAYS SILENT inside `ai-agents/tasks/done/` — and reddens
//      outside it — costs zero bytes written into this repo, and never edits a closed task folder,
//      which this task is forbidden to do. The live condition is ALWAYS run against `REPO`. It is a
//      test seam, never an environment switch, so it is not the D2 shape: nothing outside this file
//      can move the root.
//
// D4 — ⛔ `maskCodeSpans` IS NOT TRANSCRIBED. Owner ruling 2026-09-02, option label verbatim
//      "Omit, assert positively (Rec)". §4.2 defines the function but gates it behind `OPT.spans`,
//      whose settled default is OFF; under D2 it becomes unreachable dead code. Shipping a dead
//      function that, if ever wired up, silently takes this half from 166 hits to 5 — a 33× gutting,
//      re-measured 2026-09-02 — is a hazard, not fidelity. ⭐ In its place the ruling is asserted
//      POSITIVELY: arm C4 requires that a coordinate written inside backticks REDS. That is strictly
//      stronger protection than keeping the function.
//      ⚠️ THE REASON THE RULING EXISTS AT ALL, because reasoning by analogy gets it backwards: the
//      SIBLING half skips code spans, and this half does NOT. Every coordinate in this repo is
//      written inside backticks because that is house style; for THIS half backticks are formatting,
//      not quoting. §1 of the condition document rules the two halves opposite ways deliberately.
//
// D5 — INSTRUMENTATION. `scan` returns `visited`, `total`, `totalFiles`, `exemptCount`, `exemptFiles`
//      and `residual`. §4.2 prints its four totals and exits; a test has to be able to prove WHAT it
//      scanned, not only that it found nothing. `visited` and `exemptFiles` are what make "the
//      exemption lives in the definition, not in a post-filter" checkable (L5) instead of merely
//      claimed. None of it is consulted by any match rule; removing it all would change no verdict.
//
// ============================================================================================
// WHAT THIS GUARD DELIBERATELY DOES NOT SEE. Each is a RULED non-flag, not an oversight, and each
// cost below was RE-MEASURED on 2026-09-02 against this working tree, not inherited from the brief.
// ============================================================================================
//
//  1. RESOLVED SHORTHAND IS OUT, BY NAME — a bare board name or a bare `NNNN/brief` followed by a
//     line number is NOT matched. ⭐ 0176 OWNER RULING 1 (2026-08-01), unchanged and NOT reopened.
//     ⛔ This is a live blind spot, not a hypothetical one: task 0013's brief is in `backlog/` — OPEN
//     and NOT exempt — and line 28 carries a link whose visible label is exactly this form. The guard
//     walks that file, reads that line, and does not flag it. Pinned as a positive assertion by arm
//     M6, so a later well-meaning widening reds the suite instead of sliding in.
//  2. SOURCE-FILE COORDINATES ARE NOT FLAGGED — a `claude/…` or `test/…` path plus a line number is
//     legal. Owner ruling 2026-09-02, option label verbatim "No, refuse — file follow-up if wanted
//     (Rec)". ⚠️ RE-MEASURED COST: 223 instances across 44 files among the files that could actually
//     go red (1615 across 328 counting the exempt closed folders too). The durable-citation
//     convention's row 1 rules this form CORRECT for a source file, which is why refusing is not the
//     same as ignoring. ⚠️ The figure counts COORDINATES, not verified-stale ones, and it is
//     matcher-dependent — the plan measured 223-250 across four matchers. Pinned by arm M8.
//  3. CITING SITES OUTSIDE THE SCANNED SET are never looked at — `claude/` and `test/` are out of
//     scope entirely (0176 scoping decision 1). The three known-stale citations living there are
//     red-team fixtures, not an instruction to widen.
//  4. `ai-agents/sprints/done/**` AND `ai-agents/sprints/reviews/**` ARE NOT SCANNED — a closed
//     board's claims are frozen (task 0353, for THIS half). ⚠️ RE-MEASURED COST: +6 residual across 2
//     files. The brief records +4; it is +6 today, and the cost is growing. ⛔ The LINK half was ruled
//     the OTHER way on both trees — do not import its answer. Pinned by arm L6.
//  5. `ai-agents/knowledge-base/**` IS NOT SCANNED — 0176 scoping decision 1: a report cites a
//     coordination document AS THE SPECIMEN IT IS DIAGNOSING. Not measured, deliberately.
//  6. FENCED BLOCKS AND BLOCKQUOTE LINES ARE MASKED — 0176 scoping decision 2 (a quotation is not a
//     pointer). ⚠️ RE-MEASURED COST: 8 instances across 2 files, BOTH inside the exemption, so the
//     residual cost is 0. ⛔ 0176's brief claims this convention "changes the count by zero (38 either
//     way)", twice and as a hard zero. That claim is FALSE as a general one — the figure is
//     tree-dependent: it was 8 on 2026-08-30, 0 at this task's plan gate, and 8 again at build time.
//     The decision is unchanged; only the false justification is withdrawn.
//  7. WHETHER ANY COORDINATE IS ACTUALLY STALE IS NEVER CHECKED, and cannot be. The condition is
//     SYNTACTIC. In the document's words: "No check can verify that line N still says what the citer
//     meant." That half is unenforceable and always was.
//  8. THE PATH GRAMMAR IS PERMISSIVE AND HAS NO RIGHT-HAND CLOSURE — the folder segments are
//     `[^/\s`)\]]+`, so a malformed coordinate in prose can match. Cost 0 today. Tightening would
//     make the regex materially harder to read for no measured gain.
//  9. ⛔ GREEN HERE IS NOT A COMPLETE GUARD, and verification step 7 of the brief makes saying so
//     mandatory: "a close report presenting this guard as complete has failed verification." Being
//     the gate on tasks 0356, 0357 and 0358 does not make it complete. Blind spots 1 and 2 are the
//     two the brief names by name.
// 10. ⭐ ELIDED TARGETS COUNT FOR THIS HALF — a coordinate whose folder segment contains `…` IS a
//     hit. The SIBLING half skips elided targets; this is a deliberate divergence, pinned by arm C5
//     so it reads as a ruling rather than as an accident of two independently-written scripts.
//     ⚠️ RE-MEASURED COST: 45 elided hits today, ALL inside the exemption, so residual cost 0. The
//     brief records "1, arguably 2, both inside the 19"; that figure no longer reproduces, because
//     task 0237 cleared the residual and the folders carrying those hits have since closed.
// 11. ⭐ AN OPEN TASK'S `review.md` IS SCANNED AND IS NOT EXEMPT, so this guard REDS on a
//     correctly-formed review ledger that cites a coordination document by line number. That is the
//     ruled behaviour, not a defect. Owner ruling 2026-09-02, option label verbatim
//     "A + file follow-up D (Rec)": ship with NO exemption for review ledgers, and ⛔ option B —
//     exempting open `review.md` — was REFUSED BY NAME as a silent widening of "closed records are
//     frozen" into "ledgers anywhere". The durable-citation convention's row 3 rules `path:NNN`
//     categorically wrong when the target is a coordination document, and that page's own scope note
//     says the TARGET condition is what makes row 3 categorical.
//     ⚠️ LIVE COST TODAY 0 — all 133 `review.md` files under `ai-agents/tasks/` are in `done/`, and
//     none is in `backlog/`. ⛔ The cost is entirely PROSPECTIVE and its RATE IS UNMEASURED: it lands
//     the first time a stateful review runs on a task whose subject is a coordination document, which
//     is exactly the shape of the three sweeps this guard gates. A follow-up (ruled "D") is to be
//     filed against the reviewer skill's guidance so its `file:line` column reads "heading + fragment
//     where the target is a coordination document"; it is the producer's to file and does not block
//     this task.
//
// ============================================================================================
// WHY THERE IS NO `test/prove-red.sh` ENTRY — settled at the plan gate, not left to review.
// ============================================================================================
// Owner ruling, 2026-09-02, option label verbatim "Yes, inherit (Rec)" — this task inherits task
// 0354's ruling ("No prove-red entry — follow the precedent (Rec)") on identical reasoning and an
// identical artifact class. All 28 prove-red mutations target an executable artifact reachable
// through an environment seam (FKIT_LAUNCHER, the hooks, FKIT_RELEASE_MJS, FKIT_FRONTMATTER_ROOT).
// `ai-agents/` has no such seam, and inventing one would mean shipping a production environment
// variable whose only purpose is to point the repo's own content guard somewhere else — the exact
// shape D2 rejects. The four sibling `ai-agents/`-content guards (task-id-uniqueness,
// adr-number-uniqueness, closed-rank-immutability, reference-integrity) carry zero prove-red
// mutations each and discharge the duty a different way — export the pure functions and redden them
// against negative fixtures in-file. ⭐ The M and C arms below ARE those mutations. Each one fails
// when the condition is broken, and M1 asserts BOTH directions.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { REPO } from './harness.mjs';

// ── §4.2, transcribed ────────────────────────────────────────────────────────────────────────────

// 1. THE SCANNED SET — 0176 scoping decision 1, UNCHANGED.
//      ai-agents/tasks/*/*/*.md   +   ai-agents/sprints/*.md
//    NOT widened to knowledge-base/reports/ (0176 decision 1: a report cites a
//    coordination document AS THE SPECIMEN IT IS DIAGNOSING).
//    NOT widened to sprints/done/ or sprints/reviews/ — a closed board's claims
//    are frozen. This is the ANSWER to 0237 step 3, for this half.
//    ⛔ ai-agents/wiki-vault/ is never walked either — note that `wiki-vault/log.md` appears in
//    TARGET as a CITED class, never as a citing one. ADR-005 puts the vault out of every role's
//    reach but fkit-wiki's, so a guard that reddens on it is a guard nobody may make green.
export function collectFiles(root) {
  const scanned = [];
  const tasksDir = path.join(root, 'ai-agents/tasks');
  if (fs.existsSync(tasksDir)) {
    for (const board of fs.readdirSync(tasksDir)) {
      const bp = path.join(tasksDir, board);
      if (!fs.statSync(bp).isDirectory()) continue;
      for (const folder of fs.readdirSync(bp)) {
        const fp = path.join(bp, folder);
        if (!fs.statSync(fp).isDirectory()) continue;
        for (const f of fs.readdirSync(fp)) {
          if (f.endsWith('.md') && fs.statSync(path.join(fp, f)).isFile()) {
            scanned.push(`ai-agents/tasks/${board}/${folder}/${f}`);
          }
        }
      }
    }
  }
  for (const f of fs.readdirSync(path.join(root, 'ai-agents/sprints'))) {
    if (f.endsWith('.md') && fs.statSync(path.join(root, 'ai-agents/sprints', f)).isFile()) {
      scanned.push(`ai-agents/sprints/${f}`);
    }
  }
  scanned.sort();
  return scanned;
}

// 2. THE EXEMPTION SET.
//    OWNER RULING, 2026-08-29: closed task folders are exempt IN WHOLE —
//    ai-agents/tasks/done/** and ai-agents/tasks/cancelled/**, every file in
//    them (brief.md, plan.md, worklog.md, review.md alike).
//    This SUPERSEDES the narrower 2026-08-01 owner ruling (which named
//    done/*/review.md only) — superseded by a later OWNER ruling, not reopened by an agent.
//    ⛔ D2 drops §4.2's `OPT.oldExempt` branch that reproduced the 2026-08-01 shape. That shape is
//    still measurable, and it is the second red run this task reports: restricting the exemption to
//    `done/*/review.md` alone takes the residual from 0 to 49 across 23 files.
export function exempt(rel) {
  return rel.startsWith('ai-agents/tasks/done/') || rel.startsWith('ai-agents/tasks/cancelled/');
}

// 3. THE MATCH RULE.
//    THE READING IS LITERAL — 0176 owner ruling 1, 2026-08-01, UNCHANGED and
//    NOT reopened. A full path naming a COORDINATION DOCUMENT, followed
//    immediately by ':' and a line number. Resolved shorthand
//    (bare `sprint-2` + line number) is OUT, by name, and stays out.
//    ⭐ The cited (target) class includes plan.md, worklog.md and review.md, not brief.md alone —
//    owner ruling 2026-08-30, option label verbatim "Not a reopening — widen it (Rec)". The gap
//    existed because the condition predates ADR-029 moving those files into the task folder.
//    The leading `(?<![\w./-])` is the LEFT BOUNDARY: it stops a match that is merely the suffix of
//    a longer token, such as a `claude/scaffold/ai-agents/...` template path. Measured cost 0.
export const TARGET = new RegExp(
  '(?<![\\w./-])' +
  'ai-agents/(?:' +
    'sprints/[^/\\s`)\\]]+\\.md' +            // ai-agents/sprints/*.md
    '|tasks/[^/\\s`)\\]]+/[^/\\s`)\\]]+/(?:brief|plan|worklog|review)\\.md' +   // ai-agents/tasks/*/*/brief.md
    '|wiki-vault/log\\.md' +                  // ai-agents/wiki-vault/log.md
  '):\\d+', 'g');

// 4. MASKING. A masked character becomes a space, so every offset and every line number stays
//    exactly where it was.
const blank = (s) => ' '.repeat(s.length);

// 4a. Fenced blocks (``` or ~~~), the fence lines themselves included.
// 4b. Blockquote lines — first non-space character is '>'.
//     Both from 0176 scoping decision 2: a quotation is not a pointer, and flagging one punishes the
//     document that defines the convention.
// ⚠️ THE FENCE-CLOSE RULE IS COMMONMARK'S — a CLOSING fence carries no info string, which is what
// `m[2].trim() === ""` enforces. Both copies of this function had that wrong before 2026-08-30, the
// bug was introduced once and duplicated, and it hid one live instance. Do not "simplify" it back.
// ⛔ THIS FUNCTION IS UNDER A BYTE-FOR-BYTE PARITY ASSERTION. `test/reference-integrity.test.js`
// arm C7 (§7 item 14) compares this declaration's source text against its own copy. Three
// consequences, all of them real and two of them documented there as deliberately-unfixed edges:
// ⚠️ ITS BODY'S INDENTATION must match the sibling's — which in practice means leaving the whole
// declaration at column 0, but the invariant is the BODY, not this line. C7 locates the declaration
// by its `function` keyword (capturing a leading `async` if present) and slices from that `f`, so
// this line's OWN leading whitespace is never part of the comparison. Measured at review round 1
// (finding R5): indenting this declaration line alone by two spaces leaves C7 green at 20/20, so
// "column 0" was the wrong statement of the rule. It must contain no `}` inside a string literal
// (that would truncate C7's brace scan); and any change here must be made in BOTH files in the same
// edit. Both edges fail SAFE — they report drift that is not there, never parity that is not there.
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

// ⛔ §4.2's `maskCodeSpans` IS DELIBERATELY ABSENT. See D4 in the header — owner ruling 2026-09-02,
// "Omit, assert positively (Rec)". Arm C4 asserts the ruling instead. If you are about to add it
// back, read D4 first: wiring it up takes this half from 166 hits to 5.

// ── The scan ─────────────────────────────────────────────────────────────────────────────────────

// ⭐ THE EXEMPTION IS CONSULTED INSIDE THE SCAN LOOP AND COUNTED, NOT APPLIED AS A POST-FILTER OVER A
// FINISHED LIST. That is the shape OWNER RULING 2 requires and the brief's verification step 3 asks
// be proven rather than claimed: an exempt file IS visited, its hits ARE counted into `total`, and
// they land in `exemptCount` instead of `residual`. Arm L5 checks all three against the returned
// values rather than trusting this comment. There is no filter over `residual` anywhere in this file.
//
// `root` is a parameter, not `process.cwd()` — that is D3, and it is the whole fixture strategy. It
// is NOT an escape hatch on the live condition, which is always run against REPO.
export function scan(root) {
  const visited = collectFiles(root);
  let total = 0; const totalFiles = new Set();
  const residual = []; let exemptCount = 0; const exemptFiles = new Set();
  for (const rel of visited) {
    const lines = maskFencesAndQuotes(fs.readFileSync(path.join(root, rel), 'utf8').split('\n'));
    lines.forEach((line, idx) => {
      for (const m of line.matchAll(TARGET)) {
        total++; totalFiles.add(rel);
        if (exempt(rel)) { exemptCount++; exemptFiles.add(rel); }
        else residual.push({ file: rel, line: idx + 1, hit: m[0] });
      }
    });
  }
  return { visited, total, totalFiles, exemptCount, exemptFiles, residual };
}

// ⛔ THE FAILURE MESSAGE NAMES THE CITING SITE AS `file` + "(line N)", NEVER AS A COLON-AND-LINE
// COORDINATE. A guard built to enforce a document that rules that citation form unsafe against a
// living file must not emit it — §4.2 carries the same discipline and the same comment. The offending
// substring IS printed, because it is the finding itself.
function formatResidual(residual) {
  return residual.map((r) => `    - ${r.file}\n        (line ${r.line})  ->  ${r.hit}`).join('\n');
}

// ── Fixture trees, always under os.tmpdir(), never in the repo ───────────────────────────────────

const MADE = [];
function fixture(files) {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), 'fkit-coordcite-'));
  MADE.push(dir);
  for (const [rel, body] of Object.entries(files)) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body);
  }
  return dir;
}
process.on('exit', () => { for (const d of MADE) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) { /* best effort */ } } });

// Every fixture tree needs both halves of the scanned set present and carrying prose, so that a
// "0 residual" result is never 0-because-empty. ⚠️ `ai-agents/sprints/` in particular must exist:
// §4.2 guards the tasks tree with existsSync but reads the sprints directory unguarded, and that
// asymmetry is transcribed rather than smoothed over.
const ANCHOR = {
  'ai-agents/sprints/sprint-9.md': '# Sprint 9\n\nAn ordinary board with no coordinate on it.\n',
  'ai-agents/tasks/backlog/0001-an-open-task/brief.md': '# A brief\n\nOrdinary prose, no coordinate.\n',
};

// The banned form, built once so every arm plants exactly the same string.
const HIT_SPRINT = 'ai-agents/sprints/sprint-9.md:42';
const HIT_BRIEF = 'ai-agents/tasks/backlog/0001-an-open-task/brief.md:7';

// ── L — the live corpus, opened read-only ────────────────────────────────────────────────────────

const LIVE = scan(REPO);

test('L1 live corpus: the scanned set is non-empty and large', (t) => {
  // Anti-vacuity, first and on its own. Everything below is trivially true over an empty corpus, and
  // a guard that silently scanned nothing is the failure mode task-id-uniqueness was built to avoid.
  // A FLOOR, never an exact count — the corpus moved 708 -> 719 in three days, and a guard that reds
  // on ordinary work is a guard someone deletes.
  t.diagnostic(`scanned ${LIVE.visited.length} files (floor 500)`);
  assert.ok(LIVE.visited.length > 500,
    `scanned only ${LIVE.visited.length} markdown files across ai-agents/tasks/*/*/ and ` +
    'ai-agents/sprints/ — that is vacuous, not clean. Either the corpus really shrank below the ' +
    'floor (raise or lower this deliberately, with a measurement), or collectFiles() stopped ' +
    'finding the tree.');
});

test('L2 live corpus: RESIDUAL is 0 under the settled condition', () => {
  // ⭐ THE SHIPPING CONDITION. Every hit is either absent or inside a closed task folder.
  assert.deepEqual(LIVE.residual, [],
    `${LIVE.residual.length} coordination-document line-number citation(s) across ` +
    `${new Set(LIVE.residual.map((r) => r.file)).size} file(s) in OPEN records\n` +
    formatResidual(LIVE.residual) +
    '\n  Each cites a document a third party appends to, by a line number that moves when they do. ' +
    'The durable-citation convention rules this form wrong CATEGORICALLY for a coordination ' +
    'document — replace it with a heading plus a quoted fragment. ⛔ Do NOT exempt the file: the ' +
    'exemption is closed task folders only, and widening it was refused by name on 2026-09-02.');
});

test('L3 live corpus: the arithmetic closes, and the exemption is doing real work', (t) => {
  // ⭐ §7 item 9(b)'s lesson, carried across from the sibling half rather than re-learned. A test
  // asserting only `residual.length === 0` reads just as green if the exemption silently swallows an
  // instance, or if the matcher stopped matching altogether. These two lines cost nothing and close
  // both holes: every hit must be accounted for on exactly one side of the exemption, and the exempt
  // side must be non-empty.
  t.diagnostic(`total ${LIVE.total} = exempt ${LIVE.exemptCount} + residual ${LIVE.residual.length}`);
  assert.equal(LIVE.total, LIVE.exemptCount + LIVE.residual.length,
    `${LIVE.total} hits were counted but ${LIVE.exemptCount} exempt + ${LIVE.residual.length} ` +
    'residual do not account for them. A hit went missing between the match and the two buckets.');
  assert.ok(LIVE.exemptCount > 0,
    'the exemption fired ZERO times across the whole corpus. Either every closed task folder really ' +
    'is clean of this form (measure it before believing that — it was 166 hits across 66 files on ' +
    '2026-09-02), or the matcher has stopped matching and "residual 0" means nothing.');
  // ⭐ A FLOOR ON `total`, added at review round 1 (finding R2). `exemptCount > 0` above is satisfied
  // by ONE surviving hit, so a matcher that still matches a little reads exactly as green as one that
  // matches everything. Measured: narrowing TARGET's `:\d+` to one- and two-digit line numbers drops
  // the live corpus from 166 hits across 66 files to 78 across 45 — a 53% loss — and every other arm
  // in this file stays green, because the largest line number any fixture below plants is `:88`.
  // ⚠️ A FLOOR, never a count. 166 today; it was 182 on 2026-08-30, so the figure moves DOWN with
  // ordinary work and a floor that tracks the count would red on it. The sibling half carries the
  // same guard for the same reason (`LIVE.checked > 2000` in test/reference-integrity.test.js).
  assert.ok(LIVE.total > 120,
    `only ${LIVE.total} citation(s) matched across the whole corpus (floor 120). It was 166 across ` +
    '66 files on 2026-09-03 and 182 on 2026-08-30. Either the corpus really fell through the floor ' +
    '(re-measure, then move it deliberately), or TARGET has been narrowed and this suite is green ' +
    'over a guard that stopped looking — which is the one failure "residual 0" cannot tell you about.');
});

test('L4 live corpus: every exempted file lies under a closed task folder', () => {
  // The exemption cannot drift wider unnoticed. ⛔ A narrowing of the RESIDUAL makes the guard more
  // green and nothing else in this file would object — this assertion is what does.
  const wide = [...LIVE.exemptFiles].filter(
    (rel) => !(rel.startsWith('ai-agents/tasks/done/') || rel.startsWith('ai-agents/tasks/cancelled/')));
  assert.deepEqual(wide, [],
    `${wide.length} exempted file(s) sit OUTSIDE ai-agents/tasks/done/ and ai-agents/tasks/` +
    `cancelled/. The 2026-08-29 owner ruling exempts closed task folders and nothing else; ` +
    `exempting an open record hides a live defect:\n${wide.slice(0, 10).map((r) => `    - ${r}`).join('\n')}`);
});

test('L5 live corpus: closed folders WERE visited, then exempted — not filtered out afterwards', () => {
  // ⭐ VERIFICATION STEP 3, MADE CHECKABLE RATHER THAN CLAIMED. OWNER RULING 2 requires the exemption
  // live in the guard's DEFINITION and be counted, not applied as a post-filter over a finished list.
  // The three assertions below are the three observable consequences of that, in order: the closed
  // files are in the scanned set, their hits reached the counter, and the counter names those files.
  const closed = LIVE.visited.filter((rel) => rel.startsWith('ai-agents/tasks/done/'));
  assert.ok(closed.length > 100,
    `only ${closed.length} file(s) under ai-agents/tasks/done/ entered the scanned set (561 folders ` +
    'were closed on 2026-09-02). If closed folders stopped being VISITED, the exemption has moved ' +
    'into the scanned set and L2 would go green for the wrong reason.');
  assert.ok(LIVE.exemptCount > 0, 'no hit was counted as exempt — see L3');
  const exemptedClosed = [...LIVE.exemptFiles].filter((rel) => rel.startsWith('ai-agents/tasks/done/'));
  assert.ok(exemptedClosed.length > 0,
    'no closed task folder contributed a COUNTED exempt hit. A silent pass and a counted exemption ' +
    'are not the same result, and only the counted one proves the exemption ran inside the loop.');
  // And the predicate directly, so the rule stays proven even if the loop is later restructured.
  assert.equal(exempt('ai-agents/tasks/done/0001-a/brief.md'), true);
  assert.equal(exempt('ai-agents/tasks/done/0001-a/review.md'), true);
  assert.equal(exempt('ai-agents/tasks/cancelled/0002-b/worklog.md'), true);
  assert.equal(exempt('ai-agents/tasks/backlog/0003-c/brief.md'), false);
  assert.equal(exempt('ai-agents/sprints/backlog.md'), false);
});

test('L6 scope: the out-of-scope trees were never walked at all', () => {
  // ⚠️ EACH OF THESE IS A RULED EXCLUSION WITH A DIFFERENT AUTHORITY, and two of them are ruled the
  // OPPOSITE way for the sibling half — importing that half's answer here would be a regression
  // against task 0353. sprints/done + sprints/reviews: a closed board's claims are frozen, measured
  // cost +6 residual across 2 files. knowledge-base: a report cites a coordination document as the
  // specimen it is diagnosing. wiki-vault: ADR-005. claude/ and test/: 0176 scoping decision 1.
  const forbidden = [
    'ai-agents/sprints/done/',
    'ai-agents/sprints/reviews/',
    'ai-agents/knowledge-base/',
    'ai-agents/wiki-vault/',
  ];
  for (const prefix of forbidden) {
    const leaked = LIVE.visited.filter((rel) => rel.startsWith(prefix));
    assert.deepEqual(leaked, [],
      `${leaked.length} file(s) under ${prefix} entered the scanned set, which is OUT of scope for ` +
      `this half:\n${leaked.slice(0, 10).map((r) => `    - ${r}`).join('\n')}`);
    // ⛔ And the tree must actually EXIST, or the assertion above passed for the wrong reason.
    assert.ok(fs.existsSync(path.join(REPO, prefix)),
      `${prefix} does not exist, so its exclusion above was vacuous. Re-point this assertion or ` +
      'remove the tree from the list deliberately.');
  }
  const strays = LIVE.visited.filter(
    (rel) => !(rel.startsWith('ai-agents/tasks/') || rel.startsWith('ai-agents/sprints/')));
  assert.deepEqual(strays, [],
    `${strays.length} scanned file(s) sit outside the two in-scope trees:\n` +
    strays.slice(0, 10).map((r) => `    - ${r}`).join('\n'));
});

test('L7 disclosure: the working figures, and every named blind spot with its live cost', (t) => {
  // A reader of a green run has to be able to see WHAT went green, not only that something did. Every
  // figure below was re-measured on 2026-09-02 against this working tree.
  t.diagnostic(`SCANNED  ${LIVE.visited.length} files`);
  t.diagnostic(`TOTAL    ${LIVE.total} citations across ${LIVE.totalFiles.size} files`);
  t.diagnostic(`EXEMPT   ${LIVE.exemptCount} across ${LIVE.exemptFiles.size} files`);
  t.diagnostic(`RESIDUAL ${LIVE.residual.length} across ${new Set(LIVE.residual.map((r) => r.file)).size} files`);
  t.diagnostic('⛔ GREEN HERE IS NOT A COMPLETE GUARD (brief verification step 7). Blind spots, ' +
    're-measured 2026-09-02:');
  t.diagnostic('  1. resolved shorthand not matched — LIVE specimen: task 0013 brief, line 28, in ' +
    'backlog/ and NOT exempt (owner ruling 1, refused by name)');
  t.diagnostic('  2. source-file coordinates not flagged — 223 across 44 open files (1615 across ' +
    '328 counting exempt folders); counts coordinates, not verified-stale ones; matcher-dependent');
  t.diagnostic('  3. citing sites outside the scanned set never looked at — 3 known-stale in ' +
    'claude/ and test/');
  t.diagnostic('  4. sprints/done and sprints/reviews not scanned — +6 residual across 2 files ' +
    '(the brief records +4; the cost has grown)');
  t.diagnostic('  6. fences and blockquotes masked — 8 hits across 2 files, both inside the ' +
    'exemption, residual cost 0');
  t.diagnostic('  7. staleness itself is never checked and cannot be — the condition is syntactic');
  t.diagnostic(' 10. elided targets DO count here (opposite of the link half) — 45 hits, all inside ' +
    'the exemption, residual cost 0');
  t.diagnostic(' 11. an open review.md is scanned and NOT exempt — 0 today (all 133 review ledgers ' +
    'are in done/), prospective cost UNMEASURED. Owner ruled A on 2026-09-02; option B refused');
});

// ── M — the mutation arms. Every fixture in os.tmpdir(), nothing written into the repo ───────────

test('M1 mutation: a coordinate in an OPEN brief REDS, and stops redding when removed', () => {
  // Run 1 — the fixture is green before anything is planted. Without this the arm proves nothing.
  const a = scan(fixture(ANCHOR));
  assert.deepEqual(a.residual, [], 'the clean fixture was already red, so run 2 would prove nothing');
  assert.equal(a.total, 0, 'the clean fixture already carries a coordinate — it is not a control');
  assert.ok(a.visited.length >= 2, 'the clean fixture scanned fewer than two files — too thin');

  // Run 2 — plant it.
  const b = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md': `See ${HIT_SPRINT} for the ruling.\n`,
  }));
  assert.equal(b.residual.length, 1, 'the planted coordinate in an OPEN brief was not reported');
  assert.equal(b.residual[0].file, 'ai-agents/tasks/backlog/0001-an-open-task/brief.md');
  assert.equal(b.residual[0].hit, HIT_SPRINT);
  assert.equal(b.residual[0].line, 1);
  assert.equal(b.exemptCount, 0, 'an OPEN brief must never be exempted');

  // Run 3 — remove it, green again. Proves the red came from the coordinate, not from the fixture.
  assert.deepEqual(scan(fixture(ANCHOR)).residual, []);
});

test('M2 mutation: a coordinate in an OPEN worklog REDS — the citing side was always *.md', () => {
  // The citing set is every .md in the folder, not brief.md alone. ⚠️ This is the arm that covers
  // THIS task's own worklog.md, which lands in an open folder and is not exempt.
  const r = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/worklog.md': `Recorded at ${HIT_SPRINT}.\n`,
  }));
  assert.equal(r.residual.length, 1,
    'a coordinate in an OPEN worklog.md was not reported — the citing side is *.md, not brief.md');
  assert.equal(r.residual[0].file, 'ai-agents/tasks/backlog/0001-an-open-task/worklog.md');
});

test('M3 mutation: a coordinate on a LIVE sprint board REDS', () => {
  const r = scan(fixture({
    ...ANCHOR,
    'ai-agents/sprints/sprint-9.md': `# Sprint 9\n\nBlocked on ${HIT_BRIEF}.\n`,
  }));
  assert.equal(r.residual.length, 1, 'a coordinate on a live sprint board was not reported');
  assert.equal(r.residual[0].file, 'ai-agents/sprints/sprint-9.md');
  assert.equal(r.residual[0].hit, HIT_BRIEF);
  assert.equal(r.residual[0].line, 3, 'the reported line number is not the line the coordinate is on');
});

test('M4 mutation: ALL FOUR files in a closed folder, and cancelled/, PASS and are COUNTED', () => {
  // ⭐ THE ARM THE BRIEF HAD BACKWARDS. Task 0176's brief verification step 4 says a citation planted
  // in done/*/brief.md or done/*/worklog.md FAILS the guard. That is INVERTED. Owner ruling
  // 2026-08-29, option label verbatim "Widen to the whole closed folder (Rec)": closed task folders
  // are exempt IN WHOLE — brief.md, plan.md, worklog.md and review.md alike — superseding the
  // narrower 2026-08-01 ruling that named done/*/review.md only. This arm is the CORRECTED step 4,
  // transcribed rather than paraphrased.
  // ⛔ It runs in a fixture and NOT against the repo precisely because planting one for real would
  // mean editing a closed task folder, which this task is forbidden to do.
  const closed = 'ai-agents/tasks/done/0002-a-closed-task';
  const r = scan(fixture({
    ...ANCHOR,
    [`${closed}/brief.md`]: `Superseded, see ${HIT_SPRINT}.\n`,
    [`${closed}/plan.md`]: `Planned against ${HIT_SPRINT}.\n`,
    [`${closed}/worklog.md`]: `Worked from ${HIT_SPRINT}.\n`,
    [`${closed}/review.md`]: `Finding cites ${HIT_SPRINT}.\n`,
    'ai-agents/tasks/cancelled/0003-a-cancelled-task/brief.md': `Dropped, see ${HIT_SPRINT}.\n`,
  }));
  assert.deepEqual(r.residual, [],
    'a coordinate inside a CLOSED or CANCELLED task folder reddened the guard. Closed folders are ' +
    'exempt IN WHOLE (owner ruling 2026-08-29) — a closed record is frozen and may not be edited to ' +
    `make this guard green:\n${formatResidual(r.residual)}`);
  // ⛔ A SILENT PASS AND A COUNTED EXEMPTION ARE NOT THE SAME RESULT, and this is what tells them
  // apart. All five hits must have been SEEN, or "0 residual" is true for the wrong reason.
  assert.equal(r.total, 5, `only ${r.total} of the 5 planted coordinates were matched at all`);
  assert.equal(r.exemptCount, 5, 'the exemption fired but did not COUNT — that is the post-filter shape');
  assert.equal(r.exemptFiles.size, 5);
  // And every one of the five files really was visited, which is what "in the definition" means.
  for (const rel of [`${closed}/brief.md`, `${closed}/plan.md`, `${closed}/worklog.md`,
    `${closed}/review.md`, 'ai-agents/tasks/cancelled/0003-a-cancelled-task/brief.md']) {
    assert.ok(r.visited.includes(rel), `${rel} never entered the scanned set — the exemption has ` +
      'moved into collectFiles(), where it can no longer be counted');
  }
});

test('M5 mutation: the WIDENED cited class — plan, worklog and review targets all RED', () => {
  // ⭐ Owner ruling 2026-08-30, option label verbatim "Not a reopening — widen it (Rec)". The
  // condition originally named brief.md alone because it predates ADR-029 moving plan.md, worklog.md
  // and review.md into the task folder. ⛔ The brief's verification step 4 never tested the TARGET
  // prong at all — only the citing prong — so this arm has no counterpart there.
  const targets = {
    plan: 'ai-agents/tasks/backlog/0009-some-task/plan.md:11',
    worklog: 'ai-agents/tasks/backlog/0009-some-task/worklog.md:22',
    review: 'ai-agents/tasks/backlog/0009-some-task/review.md:33',
    brief: 'ai-agents/tasks/backlog/0009-some-task/brief.md:44',
    vaultLog: 'ai-agents/wiki-vault/log.md:55',
    sprint: 'ai-agents/sprints/backlog.md:66',
  };
  for (const [name, hit] of Object.entries(targets)) {
    const r = scan(fixture({
      ...ANCHOR,
      'ai-agents/tasks/backlog/0001-an-open-task/brief.md': `Citing ${hit} here.\n`,
    }));
    assert.equal(r.residual.length, 1, `a citation OF ${name} was not matched: ${hit}`);
    assert.equal(r.residual[0].hit, hit);
  }
  // ⛔ And the negative that pins the class as a CLOSED alternation rather than a wildcard: a
  // .md file in a task folder that is none of the four is NOT a coordination document.
  const other = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md':
      'Citing ai-agents/tasks/backlog/0009-some-task/notes.md:11 here.\n',
  }));
  assert.deepEqual(other.residual, [],
    'the cited class matched a file outside the ruled four (brief, plan, worklog, review). That is a ' +
    'widening nobody ruled — the alternation is closed on purpose.');
});

test('M6 mutation: RESOLVED SHORTHAND IS NOT MATCHED — owner ruling 1, pinned as an assertion', () => {
  // ⭐ THE READING IS LITERAL, AND THE REFUSAL IS BY NAME. Owner ruling 1, 2026-08-01, unchanged and
  // NOT reopened. This arm exists so that a later well-meaning widening REDS the suite instead of
  // sliding in as an improvement. ⛔ It asserts a BLIND SPOT, deliberately — read blind spot 1 in the
  // header before "fixing" it, and take it to the owner rather than to this file.
  const shorthands = [
    'See sprint-2.md:354 for the ruling.',                         // bare board name
    'See 0176/brief:88 for the scope.',                            // bare NNNN/brief
    'See backlog.md:7 for the row.',                               // bare board file
    'See tasks/backlog/0009-some-task/brief.md:12 here.',          // path without the ai-agents/ prefix
  ];
  for (const body of shorthands) {
    const r = scan(fixture({ ...ANCHOR, 'ai-agents/tasks/backlog/0001-an-open-task/brief.md': body + '\n' }));
    assert.deepEqual(r.residual, [],
      `resolved shorthand was MATCHED, and owner ruling 1 rules it OUT by name: ${body}`);
    assert.equal(r.total, 0);
  }
  // ⛔ The control, so this arm can never pass because the matcher stopped matching anything at all.
  const control = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md': `See ${HIT_SPRINT} for the ruling.\n`,
  }));
  assert.equal(control.residual.length, 1, 'the control did not red — the shorthand cases prove nothing');
});

test('M7 boundary: a coordinate that is the SUFFIX of a longer token is not a hit', () => {
  // The `(?<![\w./-])` left boundary. Measured cost 0, and it is what stops a scaffold template path
  // — which resolves in the CONSUMING project, not here — from being read as a repo coordinate.
  const cases = {
    'a longer word ending in the prefix': `notai-agents/sprints/sprint-9.md:42`,
    'a scaffold template path': `claude/scaffold/ai-agents/tasks/backlog/0001-a/brief.md:12`,
    'a dotted prefix': `x.ai-agents/sprints/sprint-9.md:42`,
    'a hyphenated prefix': `some-ai-agents/sprints/sprint-9.md:42`,
  };
  for (const [name, body] of Object.entries(cases)) {
    const r = scan(fixture({ ...ANCHOR, 'ai-agents/tasks/backlog/0001-an-open-task/brief.md': body + '\n' }));
    assert.equal(r.total, 0, `${name} was matched, but the left boundary must refuse it: ${body}`);
  }
});

test('M8 mutation: a SOURCE-FILE coordinate is deliberately NOT flagged', () => {
  // ⭐ THE NON-FLAG ASSERTED, so the refusal to widen is VISIBLE rather than accidental. Owner ruling
  // 2026-09-02, option label verbatim "No, refuse — file follow-up if wanted (Rec)". The
  // durable-citation convention's row 1 rules `path:NNN` CORRECT for a source file — a source file is
  // not a document a third party appends to under you. ⚠️ Re-measured live cost: 223 instances across
  // 44 open files. Widening now would take the guard red on arrival; that is a producer's follow-up,
  // not a quiet edit to this regex.
  const sources = [
    'claude/fkit-claude-init.sh:481',
    'test/prove-red.sh:28',
    'claude/skills/fkit-stateful-review/SKILL.md:7',
    'claude/agents/fkit-coder.md:98',
  ];
  for (const hit of sources) {
    const r = scan(fixture({ ...ANCHOR, 'ai-agents/sprints/sprint-9.md': `# Sprint 9\n\nSee ${hit}.\n` }));
    assert.equal(r.total, 0,
      `a source-file coordinate was flagged: ${hit}. That widening was REFUSED by the owner on ` +
      '2026-09-02 — 223 instances across 44 open files would go red on arrival.');
  }
});

test('M9 mutation: a coordinate in an OPEN review.md REDS — the G1 ruling, pinned', () => {
  // ⭐ THE RULING THAT DECIDED WHAT SHIPS — and, until review round 1 (finding R1), the ONLY owner
  // ruling in this file with no arm behind it. Owner ruling 2026-09-02, option label verbatim
  // "A + file follow-up D (Rec)": ship with NO exemption for review ledgers; ⛔ option B — exempting
  // an open `review.md` — was REFUSED BY NAME as a silent widening of "closed records are frozen"
  // into "ledgers anywhere". Measured at that review round: appending `|| rel.endsWith('/review.md')`
  // to `exempt()` re-instates refused option B and all twenty of the other arms stay GREEN. L4 only
  // inspects files that already produced exempt hits; L5's predicate spot-checks name a backlog brief
  // and a sprint board, never a review ledger; and no other arm plants anything in an OPEN one. This
  // arm is what turns that mutation red.
  // ⛔ Before "fixing" the friction this causes, read blind spot 11 in the header: a correctly-formed
  // review ledger that cites a coordination document by line number is SUPPOSED to red here. That is
  // the ruled behaviour. Take it to the owner, not to `exempt()`.
  const rel = 'ai-agents/tasks/backlog/0001-an-open-task/review.md';
  const r = scan(fixture({ ...ANCHOR, [rel]: `| R1 | 1 | high | ${HIT_SPRINT} | a claim |\n` }));
  assert.equal(r.residual.length, 1,
    'a coordinate in an OPEN review.md was not reported. Option B — exempting open review ledgers — ' +
    'was refused BY NAME on 2026-09-02. If it has been re-added to exempt(), take the ruling back to ' +
    'the owner rather than widening the exemption here.');
  assert.equal(r.residual[0].file, rel);
  assert.equal(r.residual[0].hit, HIT_SPRINT);
  assert.equal(r.exemptCount, 0, 'an OPEN review.md must never be exempted — only CLOSED folders are');
  // And the predicate directly, so the ruling stays pinned even if the scan loop is later
  // restructured — the shape L5 uses. ⭐ The contrast with M4 is the whole ruling: the SAME filename
  // inside a closed folder IS exempt, and outside one it is not.
  assert.equal(exempt(rel), false);
  assert.equal(exempt('ai-agents/tasks/done/0002-a-closed-task/review.md'), true);
});

// ── C — condition-fidelity units ─────────────────────────────────────────────────────────────────

test('C1 a coordinate inside a fenced block is masked, and the same one outside it REDS', () => {
  // 0176 scoping decision 2. ⛔ THE CONTROL IS THE POINT: without it, "masked" is indistinguishable
  // from "the matcher never matched this string anywhere".
  const inside = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md': ['```', HIT_SPRINT, '```', ''].join('\n'),
  }));
  assert.equal(inside.total, 0, 'a coordinate inside a fenced block was not masked');

  const outside = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md': ['```', 'nothing here', '```', HIT_SPRINT, ''].join('\n'),
  }));
  assert.equal(outside.residual.length, 1, 'the control did not red — the masking case proves nothing');
  assert.equal(outside.residual[0].line, 4,
    'masking must preserve line numbers — a masked line becomes spaces, never disappears');
});

test('C2 a CLOSING fence carries no info string (CommonMark)', () => {
  // ⚠️ THE BUG THAT WAS INTRODUCED ONCE AND DUPLICATED INTO BOTH HALVES of the specification, and
  // that hid one live instance until 2026-08-30. Do not "simplify" this rule back.
  const masked = maskFencesAndQuotes([
    '```',
    HIT_SPRINT,
    '```js',                         // info string -> NOT a closer, still inside the fence
    HIT_SPRINT,
    '```',                           // bare -> this is the closer
    HIT_SPRINT,
  ]);
  assert.equal(masked[1].trim(), '', 'a line inside the fence was not masked');
  assert.equal(masked[3].trim(), '', '```js was wrongly accepted as a closing fence');
  assert.equal(masked[5].trim(), HIT_SPRINT, 'the line after the real closer was masked');

  // A longer run closes a shorter one; a shorter run does not close a longer one.
  const nested = maskFencesAndQuotes(['````', '```', HIT_SPRINT, '````', HIT_SPRINT]);
  assert.equal(nested[2].trim(), '', 'a 3-backtick run wrongly closed a 4-backtick fence');
  assert.equal(nested[4].trim(), HIT_SPRINT);

  // A tilde run does not close a backtick fence.
  const mixed = maskFencesAndQuotes(['```', '~~~', HIT_SPRINT, '```', HIT_SPRINT]);
  assert.equal(mixed[2].trim(), '', '~~~ wrongly closed a ``` fence');
  assert.equal(mixed[4].trim(), HIT_SPRINT);
});

test('C3 a blockquote line is masked, and the same coordinate unquoted REDS', () => {
  // 0176 scoping decision 2 — a quotation is not a pointer, and flagging one punishes the document
  // that defines the convention. ⚠️ Live cost of this masking, re-measured 2026-09-02: 8 hits across
  // 2 files, both inside the exemption. See blind spot 6 — the brief's "changes the count by zero"
  // is withdrawn as false.
  const quoted = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md': `> The ruling said ${HIT_SPRINT}.\n`,
  }));
  assert.equal(quoted.total, 0, 'a coordinate on a blockquote line was not masked');

  const indented = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md': `   > Indented quote of ${HIT_SPRINT}.\n`,
  }));
  assert.equal(indented.total, 0, 'an indented blockquote line was not masked — the rule is /^\\s*>/');

  const control = scan(fixture({
    ...ANCHOR,
    'ai-agents/tasks/backlog/0001-an-open-task/brief.md': `The ruling said ${HIT_SPRINT}.\n`,
  }));
  assert.equal(control.residual.length, 1, 'the control did not red — the masking cases prove nothing');
});

test('C4 an INLINE CODE SPAN is NOT skipped — a coordinate inside backticks REDS', () => {
  // ⭐ THE RULING D4 REPLACED THE DEAD FUNCTION WITH, asserted positively. Owner ruling 2026-09-02,
  // option label verbatim "Omit, assert positively (Rec)".
  // ⛔ REASONING BY ANALOGY FROM THE SIBLING HALF GETS THIS BACKWARDS. The LINK half skips inline
  // code spans, because a link inside backticks is documented marker text rather than a pointer
  // offered to a reader. THIS half does the opposite, and §1 of the condition document rules the two
  // ways deliberately: every coordinate in this repo is written inside backticks because that is the
  // house style for writing one, so here backticks are FORMATTING, not quoting.
  // ⚠️ THE MEASURED STAKE, re-measured 2026-09-02: skipping spans takes this half's total from 166
  // hits to 5. A 33× gutting of the guard. That is why §4.2's `maskCodeSpans` is not transcribed and
  // why this assertion stands in its place.
  const TICK = '`';
  const cases = {
    'a single-backtick span': TICK + HIT_SPRINT + TICK,
    'inside a table cell': '| finding | ' + TICK + HIT_SPRINT + TICK + ' | open |',
    'a double-backtick span': TICK + TICK + ' ' + HIT_SPRINT + ' ' + TICK + TICK,
    'a bracketed link label': '[' + TICK + HIT_SPRINT + TICK + '](../../../sprints/sprint-9.md)',
  };
  for (const [name, body] of Object.entries(cases)) {
    const r = scan(fixture({ ...ANCHOR, 'ai-agents/tasks/backlog/0001-an-open-task/brief.md': body + '\n' }));
    assert.equal(r.residual.length, 1,
      `a coordinate inside an inline code span was SKIPPED (${name}). This half does NOT mask code ` +
      'spans — see D4. If maskCodeSpans has been added back, this half goes from 166 hits to 5.');
    assert.equal(r.residual[0].hit, HIT_SPRINT);
  }
});

test('C5 an ELIDED target still counts — the deliberate divergence from the link half', () => {
  // ⭐ Blind spot 10, pinned so it reads as a RULING rather than as an accident of two independently
  // written scripts. `test/reference-integrity.test.js` SKIPS an elided target (`ELIDED`), because an
  // elided path cannot be resolved and resolution is that half's whole question. This half asks a
  // different question — is the CITATION FORM unsafe — and an elided folder name does not make a line
  // number any less mutable. ⚠️ Re-measured cost: 45 elided hits today, ALL inside the exemption, so
  // residual cost 0. ⛔ "Cost 0" means 0 RESIDUAL, not 0 problems; the 45 were not audited.
  const elided = [
    'ai-agents/tasks/done/0195-…/worklog.md:12',
    'ai-agents/tasks/backlog/0176-.../brief.md:88',
  ];
  for (const hit of elided) {
    const r = scan(fixture({
      ...ANCHOR,
      'ai-agents/sprints/sprint-9.md': `# Sprint 9\n\nSee ${hit}.\n`,
    }));
    assert.equal(r.residual.length, 1,
      `an elided target was skipped: ${hit}. That is the LINK half's rule, imported by mistake — an ` +
      'elided folder name does not make a line number any less mutable.');
    assert.equal(r.residual[0].hit, hit);
  }
});

// ⛔ NO PARITY ARM HERE. `maskFencesAndQuotes` is duplicated by hand into four places (§4.1, §4.2,
// the sibling half, and this file), and §7 item 14 asks that the two SHIPPED copies be byte-identical.
// That assertion already exists as arm C7 of `test/reference-integrity.test.js`, which reads THIS
// file's source and compares it against its own. Duplicating it from this side would add a second
// place to maintain and no coverage. ⭐ Note the consequence: the moment this file landed, that arm
// stopped skipping and became live — an existing test file changed behaviour without being edited.
