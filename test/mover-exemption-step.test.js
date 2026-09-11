// The task movers' named-exemption step — task 0381.
//
// THE RULE THIS FILE GUARDS. Both task movers (`fkit-task-done`, `fkit-task-cancelled`) carry one
// shared block of prose at the tail of their step 5: after the move and after the link repairs, run
// `test/reference-integrity.test.js` and obey what it says about the NAMED_EXEMPT keys the move may
// have invalidated. The block is duplicated in two files, modulo one word (the board: `done` ⇄
// `cancelled`), and nothing in the repo reconciled the copies — so a reword in one, or a deletion in
// both, would land silently.
//
// WHY THE STEP EXISTS AT ALL, stated mechanically. Each mover's step-4 sweep is
// `grep -rn --exclude-dir=wiki-vault "<NNNN>-<slug>" ai-agents/` — SCOPED TO `ai-agents/`. The
// exemption keys live in `test/`. The mover is not forgetting to check them; it is structurally
// incapable of seeing them. And the guard is not broken — L4 already computes both stale directions
// and its own failure messages already state the right action. It fired for real on 0358, orphaning
// three keys in one close. So the clause does not re-encode the rule in prose: it tells the mover to
// RUN the guard and OBEY it. That is why the pins below are about the INSTRUCTION being present and
// uniform, never about re-deriving the guard's logic here.
//
// SCOPE: the FOURTH test-scope category — an invariant over the repo's own shipped content rather
// than over product behavior — as established by test/task-id-uniqueness.test.js's header and reused
// by test/skill-frontmatter.test.js and test/wiki-flag-convention.test.js. Cited, not re-argued;
// ADR-014 governs the mechanics (node --test, zero devDependencies, hand-rolled).
//
// METHOD BORROWED, NOT SHARED. test/wiki-flag-convention.test.js names its pattern reusable — "Copy
// the method; do not grow this file into an instrument" — and this file copies it: two named paths,
// hand-written constants derived from the text on disk, no shared extractor module, no second
// consumer. The three borrowed pieces are (1) two match modes, (2) extract-and-GATE, (3) relative
// dedent for the same text at different nesting depths.
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT — read this before trusting a green run.
//   1. It guards SOURCE TEXT, never BEHAVIOUR. Nothing here observes a mover actually running the
//      guard during a close. A mover that carries the clause and ignores it reads green here. The
//      clause is prose in a SKILL.md; prose is what this category of test can reach.
//   2. It reads `claude/skills/` ONLY — never the gitignored `.claude/` mirror refreshed by
//      claude/fkit-claude-init.sh, because asserting against the mirror would make the suite depend
//      on whether init has run. No `.claude/` path appears anywhere in this file, and both paths are
//      explicit, so no glob can wander into the mirror.
//      ⚠️ CONSEQUENCE, and it is live as this lands: canonical and mirror DIVERGE the moment this
//      change is committed, and the step is NOT IN FORCE in this repo until the owner re-runs init.
//      A green run here says the canonical source carries the clause. It says nothing about what a
//      mover invoked in this repo today will actually read.
//   3. It asserts the subjects are PRESENT and the two copies are UNIFORM. It does not verify the
//      clause is correct, complete, or current with the guard's real assertion names.
//   4. ⚠️ CRLF: like wiki-flag-convention.test.js, the RAW assertions compare whole lines, so a CRLF
//      checkout reds them. That is a false RED and never a false green — this guard can only
//      OVER-report drift, never hide it. fkit ships no .gitattributes and states no CRLF policy.
//
// TWO MATCH MODES, DELIBERATELY — do not "simplify" this to one. This is the trap
// wiki-flag-convention.test.js measured and recorded: a raw matcher finds its wrapped prose
// constants ZERO times in all three files — six false negatives on rules that are right there.
//   * BYTE-EXACT WHOLE LINE (raw) for R1/R2 only: the guard INVOCATION line and the one-line delete
//     rule. Both are single lines that cannot legitimately wrap, and both are contract text an
//     operator copies or obeys verbatim. Rewording either SHOULD go red.
//   * WHITESPACE-NORMALIZED (flat) for every other subject. They are prose sentences that already
//     wrap across two or three source lines and will re-wrap on any nearby edit.
//
// NO `path:NNN` COORDINATES ANYWHERE. Per conventions/durable-citation-anchors.md every anchor here
// is quoted text. Tasks are cited by their NNNN prefix only.
//
// ⚠️ IF A THIRD TASK MOVER EVER APPEARS — T0 goes red first. The roster is discovered by the
// structural signature of a mover (`### 3. Move the task FOLDER to`) across EVERY skill, not by a
// name prefix: `claude/skills/` also holds `fkit-task-brief` and `fkit-task-ship-loop`, which are
// not movers, so a `fkit-task-*` prefix pin would have been wrong.
//   ⚠️ The SPRINT movers are deliberately NOT in this roster and NOT covered here. They move a sprint
//   plan, not a task folder, so the signature does not match them. Task 0341 is where the clause
//   reaches them — and one caution for whoever does it: the sprint movers INVERT the order (repoint,
//   then `git mv`; ADR-047 §4), while the exemption step must still run AFTER the move, because a
//   HEAL is only observable at the new path. A copy-paste that preserves POSITION instead of
//   preserving AFTER-THE-MOVE is wrong. T_ORDER below pins after-the-move for the task movers only.
//
// THIS TEST READS THE REPO, read-only, and writes nothing anywhere — every fixture below is an
// in-memory array of strings, so not even os.tmpdir() is touched.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// FKIT_MOVER_STEP_ROOT lets the red-gate (prove-red.sh) point this suite at a deliberately-broken
// COPY of claude/ without touching the real tree — the same whole-directory seam FKIT_WIKI_FLAG_ROOT
// provides for the wiki-flag suite (not a single-file redirect: two files are read, and T0 walks the
// skills directory).
// ⚠️ Announce a non-default root to stderr, same reasoning as harness.mjs's FKIT_LAUNCHER guard: a
// STALE inherited FKIT_MOVER_STEP_ROOT would otherwise make `npm test` silently audit some other
// tree and report green while the real movers have drifted.
const DEFAULT_ROOT = join(REPO, 'claude');
const ROOT = process.env.FKIT_MOVER_STEP_ROOT || DEFAULT_ROOT;
if (ROOT !== DEFAULT_ROOT) {
  process.stderr.write(`[mover-exemption-step.test.js] ⚠ auditing NON-default tree via FKIT_MOVER_STEP_ROOT: ${ROOT}\n`);
}

// ── The two copies, named explicitly, with the ONE word that legitimately differs ─────────────────
//
// Two named paths, not a directory walk. T0's readdir below is a ROSTER pin: it walks to prove this
// list is COMPLETE, and never sources the list from it.

const SKILLS = [
  { name: 'fkit-task-done', board: 'done' },
  { name: 'fkit-task-cancelled', board: 'cancelled' },
];
const pathFor = (name) => join(ROOT, 'skills', name, 'SKILL.md');
const labelFor = (name) => `claude/skills/${name}/SKILL.md`;

// The R2 lesson test/skill-frontmatter.test.js records for the task-id guard: UNREADABLE is not the
// same as ABSENT. A read error propagates carrying the path, and is never swallowed into "not found"
// — which, for a presence assertion, would look exactly like the drift this file hunts.
function readSkill(name) {
  const p = pathFor(name);
  try {
    return readFileSync(p, 'utf8');
  } catch (err) {
    throw new Error(`cannot read ${p}: ${err.code} — this guard would otherwise report the clause as ` +
      'MISSING, which is indistinguishable from the drift it exists to catch', { cause: err });
  }
}

// ── The constants — every one derived from the text on disk, 2026-09-11 ───────────────────────────
//
// ⚠️ THESE ARE NOT TRIPWIRES TO EDIT UNTIL GREEN. Each failure message below says what to do instead.
//
// `BOARD` is the single token that legitimately differs between the two copies. It is substituted
// per skill before matching; a constant with no BOARD in it is board-agnostic by construction.

const BOARD = 'BOARD';
const forBoard = (s, board) => s.split(BOARD).join(board);

// R1 (raw) — the guard invocation. This is the line an operator runs; it names ONE path and no
// assertion internals, which is the whole of the clause's coupling to the test file.
const INVOCATION = '`node --test test/reference-integrity.test.js`';

// R2 (raw) — the delete rule, one line on purpose so it can be pinned byte-exact. ⛔ THIS IS THE
// INVERSION, and it is the documented failure mode: a producer, told the opposite, repointed keys
// that should have been deleted and proved it wrong with measurements. Do not soften "do not
// repoint" into "consider repointing".
// ⚠️ THE BULLET ROUTES ON TEXT THE OPERATOR ACTUALLY SEES, never on a JS identifier. `targetIsBack`
// is a destructured local inside L4's body and appears in no runtime output — not in either
// assertion message, not in the test name. An operator greps a red run for what the bullet quotes,
// so the bullet quotes L4's own message ("whose TARGET now resolves") and names the arm L4, which
// node --test prints as the failing test's name. Round-1 R1.
const DELETE_RULE = '- **Red at `L4`** — *"whose TARGET now resolves"* → the link healed. **Delete the key — do not repoint it.**';

// A3 (flat) — the bolded scannable lead-in. Ruling AF2 chose to extend step 5's tail rather than add
// a numbered step, and this lead-in is what recovers a numbered step's visibility. Dropping the bold
// is a real regression of that ruling, not a formatting nit.
const LEAD_IN = '**Then check the exemption keys this move may have invalidated.**';

// A4 (flat) — unconditional. ⛔ A grep-first early exit was considered and REJECTED: it rests on an
// assumption about how keys are spelled, which can rot. Run the guard always.
const UNCONDITIONAL = '- **Run it unconditionally**, even when the sweep above found nothing to update:';

// A5 (flat) — the repoint direction, INCLUDING the re-run and the delete-if-it-healed tail. ⚠️ The
// tail is the load-bearing half: a key can be `missingCiter` AND, once repointed, `targetIsBack`.
// That is the literal 0358 sequence — repointing alone would only have moved the failure.
// Same grounding as DELETE_RULE: the arm is named `L4` (a real test name) and the direction is
// quoted from L4's own message, because `missingCiter` is a JS local the operator never sees.
const REPOINT_RULE = '- **Red at `L4`** — *"whose CITING FILE no longer exists"* → the citing file ' +
  'moved with this close, so the key names a path that no longer exists. Repoint the citer half to ' +
  'the new board, **re-run the guard**, and if it then reds at *"whose TARGET now resolves"*, delete ' +
  'the key instead of keeping the repointed one.';

// A6 (flat) — the THIRD direction. The task brief framed this as a two-way fork; there are three. A
// move can also BREAK a link, which may need a NEW key (the 0290 case: one link broke as three
// healed). Without this bullet the clause silently tells a mover to treat a new break as a stale key.
// ⛔ IT MUST CARRY BOTH BRANCHES OF L2'S OWN MESSAGE, and repair must lead. L2 offers two actions —
// "Repair the link, or — if it is quoted or illustrative text rather than a pointer — add it to
// NAMED_EXEMPT with its reason". A bullet that ASSERTS the red is quoted text needing a new key turns
// a loud deterministic red into a silent permanent exemption, which is exactly what option B was
// rejected for. Round-1 R2.
const THIRD_DIRECTION = '- **Red at `L2`** — *"unresolved markdown link(s)"* → this move *broke* a ' +
  'link, and that arm\'s own message names the fork: **repair the link** when it is a pointer offered ' +
  'to a reader, or — *"if it is quoted or illustrative text rather than a pointer"* — add a NEW key ' +
  'carrying its reason. Neither branch is a deletion, and **repair is the default**: a new key on a ' +
  'link that should resolve converts a loud deterministic red into a silent permanent exemption.';

// A7 (flat) — instances, not keys. ⚠️ The single easiest thing in this task to get backwards: the
// live set is SEVEN suppressed instances from SIX keys, because one key matches twice. Deleting one
// key can lower the count by more than one, so the number is READ from a re-run, never decremented.
const INSTANCES_RULE = '- **The exempt count falls by suppressed INSTANCES, not by keys** — one key ' +
  'can match more than once, so deleting a single key can lower the count by more than one. ' +
  '**Re-run the guard to read the new number; never decrement it by hand.**';

// A8 (flat) — the authority gate. `test/reference-integrity.test.js` is a CODER surface. A producer
// running a mover may RUN it (read-only, ADR-022) and must not EDIT it. This settles the brief's
// item 1, and it is what actually happened in 0358's close-out.
const AUTHORITY_RULE = '- **You may run this guard. You may not edit it.** ' +
  '`test/reference-integrity.test.js` is a coder surface: stop and return a `NEEDS-DECISION` naming ' +
  'each offending key verbatim and its direction, and treat the close as unfinished until a coder ' +
  'lands that edit.';

// A9 (flat) — attribution and re-run idempotence. The guard is repo-global: a red can belong to
// another change in flight, and a mover that "fixes" it is editing someone else's work.
// ⚠️ THE TEST FOR "THIS MOVE'S" MUST COVER AN `L2` RED TOO. Keyed on the named key alone it has no
// referent when there is no key yet, and a literal read then routes a FRESH break to "pre-existing
// and left alone" — contradicting the L2 bullet three lines above it. Round-1 R2, second half.
const ATTRIBUTION_RULE = '- **Attribute before touching anything.** The guard is repo-global, so a ' +
  'red may belong to another change in flight. It is this move\'s only where the folder just moved ' +
  'is spelled by the named key — or, for an `L2` red, where there is no key yet, by the broken ' +
  'link\'s own citing file or target; anything else is reported as pre-existing and left alone. ' +
  'Re-running the guard is harmless and must not produce a second `NEEDS-DECISION` for the same key.';

// A10 (flat) — the inversion aphorism, the one sentence that carries WHY the delete rule is not the
// pointer rule. Board-dependent, hence the BOARD token.
const INVERSION = `*"\`../../${BOARD}/X\` survives, \`../X\` does not" is right about a POINTER and ` +
  'INVERTS for an exemption KEY.*';

// A11 (flat) — the board-dependent opening claim. Carries all three directions in one sentence and
// is the only other place the board word appears in prose.
const THREE_DIRECTIONS = `Moving a folder into \`${BOARD}/\` can orphan one of those keys, heal one, ` +
  'or break a fresh link that needs a new one.';

// Block anchors. BLOCK_START is the lead-in; BLOCK_END is the clause's final sentence, unique in each
// file (verified before use).
const BLOCK_START = /\*\*Then check the exemption keys this move may have invalidated\.\*\*/;
const BLOCK_END = /produce a second `NEEDS-DECISION` for the same key\./;

// The paragraph the clause must sit AFTER — step 5's existing post-repair verification tail. A heal
// is only observable after those repairs, so running the guard earlier sees nothing.
const PROVE_IT = /^\*\*Then prove it\.\*\* Resolve every relative markdown link/;

// The structural signature of a task mover, used by T0 to discover the roster across every skill.
const MOVER_SIGNATURE = /^### 3\. Move the task FOLDER to /;

// The one path the clause names. Asserted to EXIST — this is what closes the rot loop that naming a
// test file from prose would otherwise open.
const NAMED_GUARD = 'test/reference-integrity.test.js';

// A GATE, not a pin. The live block is 30 lines in both files; this is the floor below which an
// "extraction" is not a block at all. Deliberately well under 30 so a legitimate trim does not red,
// and far above 0 so an empty extraction can never read as a block.
const MIN_BLOCK_LINES = 22;

// ── The matcher ───────────────────────────────────────────────────────────────────────────────────

const flat = (s) => s.replace(/\s+/g, ' ');

// Non-overlapping occurrence count. EXACTLY-ONCE, not at-least-once, in both modes: a duplicated
// clause is drift too, and a count gives a far better failure message than a boolean.
function countOccurrences(haystack, needle) {
  let count = 0;
  let i = 0;
  while ((i = haystack.indexOf(needle, i)) !== -1) {
    count += 1;
    i += needle.length;
  }
  return count;
}

// The raw mode is WHOLE-LINE equality, modulo leading indent — NOT a substring count. The difference
// is measured, in wiki-flag-convention.test.js's own header: under a substring count, text APPENDED
// after a contract line's closing backtick stays invisible while the line visibly changes. Leading
// indent is tolerated because the same clause could legitimately sit at a different nesting depth in
// a future mover; trailing whitespace is not, because two trailing spaces are a markdown hard break.
function countWholeLines(source, needle) {
  return source.split('\n').filter((l) => l.replace(/^[ \t]+/, '') === needle).length;
}

// One failure-message template for every presence assertion, so a red run never needs a grep: it
// names the ASSERTION, the FILE, the SUBJECT, the MODE, the COUNT, why the rule exists, and what to do.
function expectExactlyOnce({ id, skill, source, needle, mode, subject, why, constant }) {
  const raw = mode === 'raw';
  const found = raw
    ? countWholeLines(source, needle)
    : countOccurrences(flat(source), flat(needle));
  assert.equal(found, 1,
    `${id}: ${labelFor(skill)} — expected exactly 1 occurrence of the ${subject} ` +
    `"${needle}" (${raw ? 'byte-exact WHOLE LINE, modulo leading indent' : 'whitespace-normalized'}), ` +
    `found ${found}.\n` +
    `${why}\n` +
    `⚠️ If this text was DELIBERATELY reworded, update ${constant} in this file as part of that same ` +
    'change — in BOTH movers, since the two copies must stay uniform. Do NOT relax the assertion to ' +
    'turn a red run green.');
}

// ── Extraction — fails CLOSED ─────────────────────────────────────────────────────────────────────
//
// Every exit that is not a real block THROWS naming the file. Returning an empty array here is the
// failure mode wiki-flag-convention.test.js exists because of: 0125's check 4 anchored on text that
// matched zero lines, compared three EMPTY extractions, found them equal, and printed UNIFORM.

const ANCHOR_ADVICE = '\n⚠️ If the clause was DELIBERATELY restructured, update BLOCK_START / ' +
  'BLOCK_END / MIN_BLOCK_LINES in this file as part of that same change. Do NOT loosen the gate to ' +
  'turn a red run green.';

const linesMatching = (lines, re) => lines.reduce((acc, l, i) => (re.test(l) ? [...acc, i] : acc), []);

function extractBlock(lines, label) {
  // ⚠️ EXACTLY-ONCE ON BOTH ANCHORS, not first-match. Taking the FIRST end match lets a duplicated
  // closing sentence truncate every extraction and hold the suite green over a genuine drift below
  // the truncation point (measured in wiki-flag-convention.test.js, 2026-08-28).
  const starts = linesMatching(lines, BLOCK_START);
  const ends = linesMatching(lines, BLOCK_END);
  if (starts.length === 0) {
    throw new Error(`${label}: START anchor matched NOTHING — the exemption clause is absent, or its ` +
      'lead-in was reworded. An anchor that matches nothing must never be read as an empty block.' +
      ANCHOR_ADVICE);
  }
  if (ends.length === 0) {
    throw new Error(`${label}: END anchor matched NOTHING — the clause's closing sentence is absent ` +
      'or reworded. Extraction stops here rather than silently running to end-of-file.' + ANCHOR_ADVICE);
  }
  if (starts.length > 1) {
    throw new Error(`${label}: START anchor matched ${starts.length} lines, expected exactly 1 — ` +
      'extraction would silently pick one of them, and a duplicated clause is drift too.' + ANCHOR_ADVICE);
  }
  if (ends.length > 1) {
    throw new Error(`${label}: END anchor matched ${ends.length} lines, expected exactly 1 — ` +
      'extraction cannot tell which one closes the clause. INSIDE the block the first match truncates ' +
      'it and every drift below the cut goes invisible behind a green run; ABOVE it the anchors read ' +
      'as out of order; BELOW it the clause extracts correctly but its closing sentence is quoted ' +
      'somewhere it should not be. All three are drift. The gate refuses to guess.' + ANCHOR_ADVICE);
  }
  const [start] = starts;
  const [end] = ends;
  if (end <= start) {
    throw new Error(`${label}: anchors are OUT OF ORDER — END at line ${end + 1} is not after START ` +
      `at line ${start + 1}. The clause was reordered or one anchor matched some other text.` +
      ANCHOR_ADVICE);
  }
  const block = lines.slice(start, end + 1);
  if (block.length < MIN_BLOCK_LINES) {
    throw new Error(`${label}: extracted only ${block.length} lines, below the ${MIN_BLOCK_LINES}-line ` +
      'floor — that is not a clause. Either the anchors are matching the wrong text, or the clause was ' +
      'legitimately TRIMMED below the floor; comparing a near-empty extraction to another would ' +
      'compare near-nothing to near-nothing and print UNIFORM.' + ANCHOR_ADVICE);
  }
  return block;
}

// Remove ONE uniform offset — the minimum leading-space count over the NON-BLANK lines — from every
// line, blanks included. ⚠️ NEVER trimStart(): a blanket strip destroys RELATIVE nesting, which is
// the one thing that distinguishes "the whole clause moved" (legitimate) from "one bullet's indent
// broke" (a bug).
function dedent(block) {
  const indents = block.filter((l) => l.trim() !== '').map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return block.map((l) => l.slice(min)).join('\n');
}

const extractAndDedent = (text, label) => dedent(extractBlock(text.split('\n'), label));

// ⛔ THE SUBJECT PINS MATCH THE CLAUSE, NEVER THE WHOLE FILE — and the difference is measured, not
// theoretical. With `readSkill(name)` as the source, deleting the `targetIsBack` delete rule from the
// clause and re-adding it verbatim under an `## Appendix` heading in BOTH movers left this suite
// **16/16 pass, 0 fail** (round-1 R3, verified by construction). Presence and uniformity then held
// over the FILE: every pinned subject could leave the clause and the guard would not notice — which
// is precisely the claim task 0341 is about to rely on. T12 already extracted the block; T2–T11 now
// read the same one.
// ⚠️ CONSEQUENCE, and it is the good direction: a broken anchor now THROWS out of T2–T11 as well as
// T12, carrying extractBlock's own message naming the file and what to fix. That is failing CLOSED.
// A subject that is present in the file but OUTSIDE the clause now reads as found 0 times, and the
// expectExactlyOnce message says which subject and which file.
const clauseOf = (name) => extractAndDedent(readSkill(name), labelFor(name));

// ── T0 · The roster pin, first ────────────────────────────────────────────────────────────────────
//
// ⚠️ What T0 does and does not carry. Non-vacuity over a THINNED or EMPTY corpus is held by
// construction, not by T0: SKILLS is hard-coded and readSkill() throws, so nothing below can pass
// over a corpus that is not there. What T0 uniquely catches is the one case a hard-coded list cannot
// see — a THIRD task mover, added without the clause.

test('T0 roster: exactly two task movers exist, and they are the two this file pins', () => {
  const dir = join(ROOT, 'skills');
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    throw new Error(`cannot read ${dir}: ${err.code} — the roster would be silently empty and every ` +
      'assertion below trivially true', { cause: err });
  }
  // withFileTypes is load-bearing, the R33 lesson from adr-number-uniqueness.test.js: a FILE named
  // like a skill would otherwise count as one.
  //
  // ⚠️ DISCOVERY IS BY SIGNATURE, NOT BY NAME PREFIX, and that is measured rather than stylistic:
  // `claude/skills/` holds FOUR `fkit-task-*` directories — `fkit-task-brief` and
  // `fkit-task-ship-loop` are not movers. A prefix pin would have reported two false movers and had
  // to be loosened, which is how a roster pin stops meaning anything.
  const found = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => {
      let src;
      try {
        src = readFileSync(join(dir, name, 'SKILL.md'), 'utf8');
      } catch (_) {
        return false; // a skill directory with no SKILL.md is skill-frontmatter.test.js's business
      }
      return src.split('\n').some((l) => MOVER_SIGNATURE.test(l));
    })
    .sort();

  const expected = SKILLS.map((s) => s.name).sort();
  assert.deepEqual(found, expected,
    `T0: discovered task movers [${found.join(', ')}] under ${dir} (by the signature ` +
    `${MOVER_SIGNATURE}), expected exactly [${expected.join(', ')}].\n` +
    'A THIRD task mover added without the exemption clause would otherwise be SILENTLY UNCOVERED — ' +
    'this pin is the only thing that notices it. (⚠️ It is not what stops a thinned or empty corpus: ' +
    'SKILLS is hard-coded and readSkill() throws on a missing file.)\n' +
    '⚠️ If a mover was legitimately ADDED or REMOVED, update SKILLS in this file as a DELIBERATE part ' +
    'of that same change — and if it was added, make sure it CARRIES the clause first. Do NOT edit ' +
    'the list merely to turn a red run green.');
});

// ── T1 · The rot-closure pin ──────────────────────────────────────────────────────────────────────

test('T1 the path the clause names actually exists', () => {
  assert.ok(existsSync(join(REPO, NAMED_GUARD)),
    `T1: the clause instructs a mover to run \`${NAMED_GUARD}\`, and that file does not exist at ` +
    `${join(REPO, NAMED_GUARD)}.\n` +
    'Naming a path from prose opens a rot loop: the instruction survives the file it names and sends ' +
    'the next operator to run nothing. This assertion is what closes it.\n' +
    '⚠️ If the guard was legitimately RENAMED, update the clause in BOTH movers and NAMED_GUARD here ' +
    'in the same change. ⛔ Asserted against the real REPO, never against FKIT_MOVER_STEP_ROOT: the ' +
    'path is repo-relative in the prose, so a mutant claude/ copy must not be able to make it pass.');
});

// ── T2–T11 · The subjects, in both movers ─────────────────────────────────────────────────────────

test('T2 both movers: the guard invocation line is byte-identical, exactly once', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T2', skill: name, source: clauseOf(name), needle: INVOCATION, mode: 'raw',
      subject: 'guard invocation line',
      why: 'This is the command the mover runs and the ONLY path the clause couples to. It is pinned ' +
        'BYTE-EXACT because it is a command, not prose, and cannot legitimately wrap. ⛔ It names no ' +
        'assertion internals on purpose — the guard\'s own failure messages carry the rule.',
      constant: 'INVOCATION',
    });
  }
});

test('T3 both movers: the targetIsBack delete rule is byte-identical, exactly once', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T3', skill: name, source: clauseOf(name), needle: DELETE_RULE, mode: 'raw',
      subject: 'targetIsBack delete rule',
      why: '⛔ THE INVERSION, and the documented failure mode of this whole area: when the link HEALS, ' +
        'the exemption is dead weight and must be DELETED, not repointed. Closing 0358 orphaned three ' +
        'keys exactly this way. Pinned BYTE-EXACT so "do not repoint it" cannot be softened into ' +
        '"consider repointing" by an edit that still reads plausibly.',
      constant: 'DELETE_RULE',
    });
  }
});

test('T4 both movers: the bolded scannable lead-in is present', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T4', skill: name, source: clauseOf(name), needle: LEAD_IN, mode: 'flat',
      subject: 'bolded lead-in',
      why: 'Ruling AF2 extended step 5\'s tail rather than adding a numbered step, and this bold ' +
        'lead-in is what recovers a numbered step\'s scannability. Losing the bold buries the whole ' +
        'clause in a verification paragraph nobody re-reads.',
      constant: 'LEAD_IN',
    });
  }
});

test('T5 both movers: the guard is run UNCONDITIONALLY', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T5', skill: name, source: clauseOf(name), needle: UNCONDITIONAL, mode: 'flat',
      subject: 'unconditional-run rule',
      why: '⛔ A grep-first early exit ("skip the guard when the folder name is absent from the test ' +
        'file") was considered and REJECTED: it rests on an assumption about how keys are SPELLED, ' +
        'which can rot silently. A clean close is the common case, so the cheap-looking skip is ' +
        'exactly the optimisation that would make this step stop happening.',
      constant: 'UNCONDITIONAL',
    });
  }
});

test('T6 both movers: the missingCiter rule carries its re-run and delete-if-healed tail', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T6', skill: name, source: clauseOf(name), needle: REPOINT_RULE, mode: 'flat',
      subject: 'missingCiter repoint rule',
      why: '⚠️ The TAIL is the load-bearing half: a key can be `missingCiter` AND, once repointed, ' +
        '`targetIsBack`. That is the literal 0358 sequence — repointing alone would only have MOVED ' +
        'the failure. A version of this rule that stops at "repoint it" is wrong, and reads fine. It ' +
        'wraps across three source lines, which is why the match is whitespace-normalized.',
      constant: 'REPOINT_RULE',
    });
  }
});

test('T7 both movers: the THIRD direction — a move can break a link that needs a NEW key', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T7', skill: name, source: clauseOf(name), needle: THIRD_DIRECTION, mode: 'flat',
      subject: 'third direction (newly broken link)',
      why: 'The task brief framed this as a two-way fork; there are THREE directions. A move can also ' +
        'BREAK a quoted link, which needs a NEW key with its reason — the 0290 case, where one link ' +
        'broke as three healed. Without this bullet the clause tells a mover to treat a fresh break ' +
        'as a stale key, which is the opposite repair.',
      constant: 'THIRD_DIRECTION',
    });
  }
});

test('T8 both movers: the count falls by INSTANCES, not keys, and is re-read not decremented', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T8', skill: name, source: clauseOf(name), needle: INSTANCES_RULE, mode: 'flat',
      subject: 'instances-not-keys rule',
      why: '⚠️ The single easiest thing here to get backwards. The live set is SEVEN suppressed ' +
        'instances from SIX keys — one key matches twice — so deleting one key can lower the count by ' +
        'more than one. A mover that decrements by hand writes a number that is wrong in exactly the ' +
        'way the equality arm exists to catch.',
      constant: 'INSTANCES_RULE',
    });
  }
});

test('T9 both movers: the authority gate — a producer may RUN the guard, never EDIT it', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T9', skill: name, source: clauseOf(name), needle: AUTHORITY_RULE, mode: 'flat',
      subject: 'authority gate',
      why: '`test/reference-integrity.test.js` is a CODER surface. ADR-022 leaves a producer able to ' +
        'RUN it, and nothing but this prose stops the same session from EDITING it to turn a red ' +
        'green — which would delete the evidence instead of the dead key. The `NEEDS-DECISION` hand-' +
        'off is what actually happened in 0358\'s close-out, and it worked.',
      constant: 'AUTHORITY_RULE',
    });
  }
});

test('T10 both movers: attribution and re-run idempotence', () => {
  for (const { name } of SKILLS) {
    expectExactlyOnce({
      id: 'T10', skill: name, source: clauseOf(name), needle: ATTRIBUTION_RULE, mode: 'flat',
      subject: 'attribution / idempotence rule',
      why: 'The guard is REPO-GLOBAL: a red can belong to another change in flight, and a mover that ' +
        '"fixes" it is editing someone else\'s work — a concurrent close\'s transient red is a real ' +
        'observed case. Attribution by folder name is what keeps this step from widening into a sweep.',
      constant: 'ATTRIBUTION_RULE',
    });
  }
});

test('T11 both movers: the board-dependent sentences name THIS mover\'s board', () => {
  for (const { name, board } of SKILLS) {
    const source = clauseOf(name);
    for (const [constant, template] of [['INVERSION', INVERSION], ['THREE_DIRECTIONS', THREE_DIRECTIONS]]) {
      expectExactlyOnce({
        id: 'T11', skill: name, source, needle: forBoard(template, board), mode: 'flat',
        subject: `board-dependent sentence (${constant}, board \`${board}/\`)`,
        why: '⚠️ THE COPY-PASTE TRAP. These two sentences are the only prose carrying the board word. ' +
          'A clause pasted from the other mover without swapping the word reads perfectly and is ' +
          'wrong: it would tell a cancelling operator that a link heals when its citer moves into ' +
          '`done/`. T12 catches the same drift from the other side; this one names the file and the ' +
          'expected board outright.',
        constant,
      });
    }
  }
});

// ── T12 · Uniformity — the two copies are the same text modulo the board word ─────────────────────

test('T12 uniformity: the two clauses are identical modulo the board word and ONE uniform offset', () => {
  const blocks = SKILLS.map(({ name, board }) => {
    const block = extractAndDedent(readSkill(name), labelFor(name));
    // Normalize the ONE token that legitimately differs, so what remains must be byte-identical.
    // ⛔ Note the direction: each file's OWN board word is folded to the token. A `done/` left
    // behind in the cancelled copy does NOT fold, so it survives into the comparison and reds here.
    return { name, board, raw: block, normalized: block.split(board).join(BOARD) };
  });

  const [a, b] = blocks;
  if (a.normalized !== b.normalized) {
    const x = a.normalized.split('\n');
    const y = b.normalized.split('\n');
    const n = Math.max(x.length, y.length);
    let first = -1;
    for (let i = 0; i < n; i += 1) { if (x[i] !== y[i]) { first = i; break; } }
    assert.fail(
      `T12: the exemption clause DIFFERS between ${labelFor(a.name)} and ${labelFor(b.name)} beyond ` +
      `the board word.\nFirst differing line (${first + 1} of the extracted block, board word folded ` +
      `to ${BOARD}):\n  ${labelFor(a.name)}: ${JSON.stringify(x[first])}\n  ` +
      `${labelFor(b.name)}: ${JSON.stringify(y[first])}\n` +
      'The clause is duplicated prose that nothing else reconciles — this assertion IS the ' +
      'reconciliation, and it is what makes task 0341\'s job "paste the clause" rather than "write a ' +
      'third bespoke variant". ⚠️ A stray un-swapped board word shows up here as a difference.\n' +
      '⚠️ If the clause was DELIBERATELY reworded, apply the SAME reword to BOTH movers in the same ' +
      'change. Do NOT weaken this comparison to tolerate a one-sided edit.');
  }
  // Non-vacuity: dedent() + the floor already guarantee a real block, but assert it explicitly so a
  // future refactor of extractBlock cannot make "identical" mean "identically empty".
  assert.ok(a.raw.length >= MIN_BLOCK_LINES,
    `T12: the compared block is ${a.raw.length} lines, under the ${MIN_BLOCK_LINES}-line floor — ` +
    'two near-empty extractions compare equal and print UNIFORM. That is the exact 0125 failure.');
});

test('T13 uniformity rejects a one-sided reword (the comparison is not vacuous)', () => {
  // In-memory, not on disk: prove the T12 comparison actually discriminates. Without this, a
  // comparison that always passed would look identical to one that never had anything to compare.
  const base = ['**Then check the exemption keys this move may have invalidated.**', 'x', 'y'];
  const same = base.join('\n');
  const reworded = ['**Then check the exemption keys this move may have invalidated.**', 'x', 'z'].join('\n');
  assert.equal(same, same.split('done').join(BOARD), 'sanity: the fixture carries no board word');
  assert.notEqual(same, reworded,
    'T13: a one-sided reword must not compare equal — if this fails the comparison in T12 is vacuous.');
});

// ── T14 · Placement — the clause runs AFTER the move and AFTER step 5's repairs ───────────────────

test('T14 placement: the clause sits in step 5\'s tail, after the "Then prove it." paragraph', () => {
  for (const { name } of SKILLS) {
    const label = labelFor(name);
    const lines = readSkill(name).split('\n');
    const proveAt = linesMatching(lines, PROVE_IT);
    const clauseAt = linesMatching(lines, BLOCK_START);
    assert.equal(proveAt.length, 1,
      `T14: ${label} — expected exactly 1 "Then prove it." paragraph opener, found ${proveAt.length}. ` +
      'The clause is anchored relative to it, so the relation cannot be checked without it.');
    assert.equal(clauseAt.length, 1,
      `T14: ${label} — expected exactly 1 exemption-clause lead-in, found ${clauseAt.length}.`);
    assert.ok(clauseAt[0] > proveAt[0],
      `T14: ${label} — the exemption clause sits at extracted line ${clauseAt[0] + 1}, BEFORE the ` +
      `"Then prove it." paragraph at line ${proveAt[0] + 1}.\n` +
      '⛔ A HEAL is only observable AFTER step 5\'s link repairs: run earlier and the guard sees the ' +
      'pre-repair tree and reports nothing. Order here is correctness, not tidiness.');
    // And it must still be inside step 5 — no `### ` heading may open between the two.
    const between = lines.slice(proveAt[0], clauseAt[0]).filter((l) => l.startsWith('### '));
    assert.deepEqual(between, [],
      `T14: ${label} — a heading opens between the "Then prove it." paragraph and the exemption ` +
      `clause: ${JSON.stringify(between)}.\n` +
      '⛔ Ruling AF2 placed the clause in step 5\'s TAIL, with no new numbered step and no ' +
      'renumbering — both movers cross-reference their own step numbers in prose, so a renumber ' +
      'breaks those references silently. If a step was DELIBERATELY added, that ruling is being ' +
      'revisited: take it to the owner rather than editing this assertion.');
  }
});

// ── T15 · Extraction fails closed ─────────────────────────────────────────────────────────────────

test('T15 extraction fails closed: missing / duplicated / reversed anchors and a sub-floor block THROW', () => {
  const START_LINE = '**Then check the exemption keys this move may have invalidated.** The sweep';
  const END_LINE = '  produce a second `NEEDS-DECISION` for the same key.';
  const filler = Array.from({ length: MIN_BLOCK_LINES }, (_, i) => `  - filler bullet ${i}`);

  const cases = [
    { label: 'no START', lines: [...filler, END_LINE], expect: /START anchor matched NOTHING/ },
    { label: 'no END', lines: [START_LINE, ...filler], expect: /END anchor matched NOTHING/ },
    {
      label: 'duplicate START',
      lines: [START_LINE, ...filler, START_LINE, END_LINE],
      expect: /START anchor matched 2 lines/,
    },
    {
      label: 'duplicate END',
      lines: [START_LINE, ...filler, END_LINE, END_LINE],
      expect: /END anchor matched 2 lines/,
    },
    { label: 'reversed', lines: [END_LINE, ...filler, START_LINE], expect: /OUT OF ORDER/ },
    { label: 'sub-floor', lines: [START_LINE, '  - one bullet', END_LINE], expect: /below the .*-line floor/ },
  ];

  for (const { label, lines, expect } of cases) {
    assert.throws(() => extractBlock(lines, `synthetic:${label}`), expect,
      `T15/${label}: extraction did NOT throw. An extraction that fails OPEN returns an empty or ` +
      'truncated block, which then compares equal to another empty one and prints UNIFORM — the ' +
      'exact 0125 near-miss this gate exists to make impossible.');
  }

  // And the positive control: a well-formed synthetic block extracts, so the cases above are not all
  // throwing for some unrelated reason.
  const ok = extractBlock([...['padding'], START_LINE, ...filler, END_LINE, 'trailing'], 'synthetic:ok');
  assert.equal(ok.length, MIN_BLOCK_LINES + 2,
    'T15: the positive control did not extract the expected span — the gate cases above may be ' +
    'throwing for a reason unrelated to what each one names.');
});
