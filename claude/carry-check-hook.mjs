// carry-check-hook.mjs — the PreToolUse/Agent carry-check (task 0204; `0162` decision report §10 row 3,
// §6 F3). Run via carry-check-hook.sh, never directly (ADR-017 rule 2); node built-ins only (ADR-014).
//
// WHAT IT CHECKS — a carry-fidelity PROXY for the coder's condition (b), NEVER (b) ITSELF.
//   Condition (b) reads "it carries a concrete APPROVED plan verbatim" (fkit-coder.md). This hook can
//   establish exactly one thing: the spawn prompt contains the bytes of the file at path P whose git
//   blob id is H, as named by the prompt's own `plan: <path>/plan.md  blob <hash>` pointer line. It can
//   NEVER establish that P is what the owner approved — approval lives in a session channel that leaves
//   no artifact (ADR-021). ⚠️ A GREEN CHECK DOES NOT MEAN THE MARKER HELD. Conditions (a) and (c) of the
//   declared-approval marker remain forgeable prose, and the conjunctive marker is only as strong as its
//   weakest signal. Nothing here closes the `carried-not-approved` residual (`0162` review ledger).
//
// TOCTOU — TIME-OF-CHECK ONLY. plan.md is read once, at spawn time, by this hook. It may be rewritten
//   between this read and the worker's use of the carried text. This hook must never be described as
//   guaranteeing what the worker RECEIVED — only what the prompt CONTAINED when the spawn was requested.
//
// LAUNCHER SESSIONS ONLY. Registered by build_settings() (fkit-claude.sh) into .fkit/settings/<role>.json,
//   which is what `fkit <role>` loads. This repo has no .claude/settings.json and settings.local.json
//   carries no `hooks` key (re-verified 2026-08-25). A spawned or non-launcher session is NOT covered;
//   do not present the hook as universal.
//
// THE UNGATED LIMIT. The trigger is the pointer line alone (owner ruling Q1, 2026-08-25) — not
//   `subagent_type`, not the caller string. A Build spawn that omits the pointer entirely is invisible
//   to this hook and passes ungated. Closing that needs a machine-readable step marker in the driver's
//   rule text — out of scope here. Zero pointer lines → allow is also what lets Plan/Verify/reviewer
//   spawns and every non-sprint-loop spawn through. A line that LOOKS like a pointer but misses the form
//   is ungated too — allowed, with one loud stderr WARNING so a human can see the check did not run.
//
// FAIL-OPEN POLICY (owner ruling Q3). Infrastructure faults — `node` missing (handled in the .sh
//   wrapper), an unreadable or unparseable payload — ALLOW with one loud stderr line. Recorded as a
//   limit: an infra fault degrades this proxy to nothing, silently to the model, loudly to a human.
//   Everything that is a CHECK failure (bad path, missing file, hash mismatch, bytes not carried)
//   DENIES via the hookSpecificOutput.permissionDecision JSON route (ADR-018 Decision 3), exit 0.
//
// WHY THE SIBLINGS' QUOTED-RUN (`[^"]*`-style) EXTRACTION WAS NOT COPIED (brief caveat 4). skill-ownership-hook.sh and
//   the marker hooks pull identifier-shaped fields out of harness JSON with a quoted-run regex, and that
//   is fine for them: every field they read is a closed-charset identifier. A spawn prompt is a long,
//   multi-line, escape-bearing JSON string value (`\"`, `\\`, `\n`, unicode escapes); a naive quoted-run
//   regex mis-extracts it. This hook uses real JSON parsing (JSON.parse), which is why it is node.
import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

// Every path below MUST end in allow(), deny(), or skip() — nothing falls through.
function allow() { process.exit(0); }
function deny(reason) {   // the ONLY route that blocks the call: explicit JSON on stdout, exit 0.
  process.stderr.write(`carry-check-hook: DENY — ${reason}\n`);
  process.stdout.write(`${JSON.stringify({ hookSpecificOutput: {
    hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason,
  } })}\n`);
  process.exit(0);
}
function skip(reason) {   // fail-open on an infrastructure fault: allow, one loud stderr line (Q3).
  process.stderr.write(`carry-check-hook: ${reason} — carry check SKIPPED (fail-open)\n`);
  process.exit(0);
}

// git blob id for a SHA-1 repository: sha1("blob " + byteLength + "\0" + bytes). Equals
// `git hash-object <file>` without spawning git. (A SHA-256 repo would differ — note only.)
function gitBlobId(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}
// The named hash must be a PREFIX of the computed blob id, at least 7 hex chars (owner ruling Q4; the
// pointer regex below enforces the minimum length). Isolated in a function so prove-red can neuter it.
function hashMatches(named, computed) { return computed.startsWith(named); }
// The paste check: the whole file, every byte, in order, somewhere in the prompt. `includes` is strict —
// a driver that trims the file's final newline is denied unless the next byte of the prompt happens to
// re-supply it (an END fence on its own line does); a re-spawn is cheap. Isolated for prove-red.
function containsExactBytes(prompt, bytes) { return prompt.includes(bytes.toString('utf8')); }

// --- read + parse the payload (real JSON parsing — caveat 4) -----------------------------------------
let raw;
try { raw = readFileSync(0, 'utf8'); } catch (e) { skip(`could not read the hook payload from stdin (${e.code || e.message})`); }
let payload;
try { payload = JSON.parse(raw); } catch { skip('hook payload is not valid JSON'); }
if (!payload || typeof payload !== 'object' || Array.isArray(payload)) skip('hook payload is not a JSON object');

// --- gate: only the subagent-spawning tool is in scope ------------------------------------------------
// Defensive, not load-bearing: the matcher in build_settings() is "Agent|Task". The tool is delivered as
// "Agent" (renamed from "Task" in Claude Code 2.1.63; the old name still works as an alias — docs
// re-checked 2026-08-25). Anything else fails SAFE here — allow, since this hook has nothing to check.
if (payload.tool_name !== 'Agent' && payload.tool_name !== 'Task') allow();
const prompt = payload.tool_input && payload.tool_input.prompt;
if (typeof prompt !== 'string') allow();   // nothing to check

// --- gate detection: the pointer lines (Q1) ----------------------------------------------------------
// One line per pointer, in the sprint loop's step-4 fenced form:
//   plan: ai-agents/tasks/<board>/<task>/plan.md  blob <hash> (git hash-object)
// Fields are separated by spaces/tabs only, so the pointer must sit on one line. The SKILL.md example
// (`blob c0ffee…`) is not ≥7 hex and never matches, so a prompt quoting the rule text is not gated (it
// does draw the near-miss WARNING below, which is the point: looked at, not gated).
const POINTER = /^[ \t]*plan:[ \t]+(\S+\/plan\.md)[ \t]+blob[ \t]+([0-9a-f]{7,64})\b/;
// A NEAR-MISS is a line that looks like a pointer but does not match the form (uppercase hex, a non-hex
// char glued to the hash, a bullet or `Plan:` prefix, …). It is NOT gated — Q1 settles the trigger — but
// it must not be silent either (review R3 of 0204): one loud stderr line, then the decision proceeds
// exactly as if the line were prose. A human reading the log can see the check did not run on it.
const NEAR_MISS = /plan:.*plan\.md.*\bblob\b/i;
const promptLines = prompt.split('\n');
const pointers = [];
const nearMisses = [];
for (const line of promptLines) {
  const m = POINTER.exec(line);
  if (m) pointers.push({ line, path: m[1], hash: m[2] });
  else if (NEAR_MISS.test(line)) nearMisses.push(line);
}
// The warning waits until the pointed-to files are read (below): a near-miss line that is itself a line of
// a carried plan — a plan quoting the pointer FORM, as this task's own plan.md does — is plan content, not
// a mis-typed driver pointer, and must not raise a false alarm on every faithful Build (review R11 of 0204).
// With no pointer at all there is no file to subtract, so every near-miss is reported. Residual (R14, same
// position-blindness as R7/R9): a DRIVER near-miss line byte-identical to, or a ≥ PREFIX_MIN prefix of, a
// line of any readable pointer file is excluded too and draws no warning; the decision is unchanged (Q1).
function warnNearMisses(lines) {
  if (lines.length === 0) return;
  const first = lines[0].trim().slice(0, 120);
  process.stderr.write(`carry-check-hook: WARNING — ${lines.length} line(s) look like a plan pointer but do not match the pointer form and are NOT gated; first: "${first}"\n`);
}
if (pointers.length === 0) { warnNearMisses(nearMisses); allow(); }   // ungated — see THE UNGATED LIMIT above

// A gated spawn must be checkable: no cwd → nothing to resolve the pointer against → deny.
const cwd = payload.cwd;
if (typeof cwd !== 'string' || cwd === '') deny('gated spawn but the payload carries no cwd to resolve the plan path against');
const root = resolve(cwd);

// --- pass 1: resolve, read and hash every pointer; record the outcome, deny nothing yet -----------------
// Denial waits until pass 1b has decided which pointers are GATED: a pointer-form line that is itself a
// line of another pointer's file is plan CONTENT (a plan quoting another task's approved pointer), not
// a second gate — deciding that needs the files read first.
function readPointer(path) {
  // a. path safety (lexical: `resolve` does not follow symlinks — accepted residual R2 of 0204): relative,
  //    no `..` segment, no empty segment, no leading `/`; the resolved path stays under cwd.
  const segments = path.split('/');
  if (path.startsWith('/') || segments.includes('..') || segments.includes('')) return { reason: `unsafe plan path: ${path}` };
  const full = resolve(root, path);
  if (full !== root && !full.startsWith(root + sep)) return { reason: `unsafe plan path: ${path} resolves outside cwd` };
  // b. the file must exist — a missing plan.md is a loud deny, never a silent pass (caveat 2).
  try { return { bytes: readFileSync(full) }; } catch (e) {
    if (e.code === 'ENOENT' || e.code === 'EISDIR' || e.code === 'ENOTDIR') return { reason: `dangling pointer: ${path} does not exist` };
    return { reason: `cannot read ${path} (${e.code || e.message})` };
  }
}
for (const ptr of pointers) {
  const r = readPointer(ptr.path);
  ptr.reason = r.reason;
  ptr.bytes = r.bytes;
  // c. the named hash must be a prefix of the file's git blob id (Q4). Only a readable, hash-matching
  //    file may vouch for another pointer's line being content (pass 1b).
  if (ptr.bytes) {
    const computed = gitBlobId(ptr.bytes);
    if (!hashMatches(ptr.hash, computed)) ptr.reason = `hash mismatch: prompt names ${ptr.hash}, file is ${computed}`;
    else ptr.lines = new Set(ptr.bytes.toString('utf8').split('\n'));
  }
}

// --- what counts as FILE CONTENT (D1; review R1 / R8 / R13 of 0204) ------------------------------------
// The set of lines that belong to a pointed-to file, built from EVERY readable pointer file — gated or not
// (review R8: a pointer dropped as content in pass 1b still has a file on disk whose lines are plan text,
// not the driver's; before this it was built from gated pointers only, so a truncated target plus a faithful
// paste of the plan it quotes let that second plan's words declare the degraded form). Widening the set can
// only REMOVE lines from the declaration scan, so it is fail-closed-only. Honest limit: a plan pasted from
// a version that is not on disk is outside every subtraction.
// "File content" is (review R1, owner ruling 2026-08-26): a line that IS a file line, or a line of at least
// PREFIX_MIN chars that is a PREFIX of a file line — the shape a paste cut mid-line leaves behind (the
// tool-cap truncation shape). PREFIX_MIN is the length of the shortest Q2 literal (`pointer only` /
// `pointer-only`, 12): a shorter partial line cannot contain any literal, so nothing shorter needs the
// rule, and nothing longer escapes it. Residual (R1 / R13): ANY partial line with anything glued after the
// cut — the tail of a later file line (a mid-paste elision), a `[... N chars truncated ...]` marker, or
// driver text such as an END fence not on its own line — is neither a file line nor a prefix of one, and
// still counts as driver text; the ship loop's fence sits on its own line, so the tail-cut shape is covered.
const PREFIX_MIN = 12;
const fileLines = new Set();
for (const { bytes } of pointers) if (bytes) for (const line of bytes.toString('utf8').split('\n')) fileLines.add(line);
const fileLineList = [...fileLines];
function isFileContent(line) {
  if (fileLines.has(line)) return true;
  return line.length >= PREFIX_MIN && fileLineList.some((f) => f.startsWith(line));
}
warnNearMisses(nearMisses.filter((line) => !isFileContent(line)));   // R11: content lines are not alarms

// --- pass 1b: which pointers are gated? (review R7 of 0204) -------------------------------------------
// Pointer X is CONTENT, not a gate, when its line is a line of another pointer Y's verified file — and Y
// is not in turn a line of X's file. Without that guard two pointers quoting each other would drop BOTH
// and gate nothing. The mutual case is NOT reachable by accident, but it IS reachable deliberately (review
// R12 of 0204): under Q4's ≥7-hex prefix match, a plan that quotes its OWN pointer needs only a ~2^28
// nonce search (minutes on one core); then the driver's top-level pointer and the identical quoted line
// vouch for each other. The guard keeps that pair gated — the fail-closed side — and is pinned by the
// self-quoting fixture in test/carry-check-hook.test.js.
// Residual of the line-set shape (R7 / R9): the hook cannot tell WHERE a line sits or WHOSE it is. Any
// pointer whose line is a line of another verified, pasted plan is content — a driver-text pointer line
// byte-identical to a pasted plan's line, and also the TARGET's own pointer when a sibling plan on disk
// quotes the target's current pointer line and is pasted in the same spawn (the target is then un-gated;
// pinned as documented behaviour in the test suite). A pointer line that differs by one byte is gated.
const gated = pointers.filter((x) => !pointers.some((y) =>
  y !== x && y.lines && y.lines.has(x.line) && !(x.lines && x.lines.has(y.line))));
// The first failure among the gated pointers denies, in prompt order.
for (const { reason } of gated) if (reason) deny(reason);
const files = gated.map(({ path, bytes }) => ({ path, bytes }));

// --- degraded-form detection (Q2: the words the rule text already uses, case-insensitive) --------------
// ⚠️ Scanned over the prompt MINUS every line that is file content. The declaration is the DRIVER's
// statement (SKILL.md step 5: "say so in the spawn prompt in those words"); the plan's own text must not
// make it on the driver's behalf. Found on the first smoke run against the real 0204 plan.md (2026-08-25):
// that plan says "pointer-only" seven times, so a TRUNCATED paste of it was ALLOWED — the exact failure
// this hook exists to catch. Line-level subtraction keeps Q2's literal set and needs no rule-text edit.
const outsideThePaste = promptLines.filter((line) => !isFileContent(line)).join('\n');
const declared = /by reference only|pointer[- ]only/i.test(outsideThePaste);

// --- pass 2: the paste check — skipped ONLY when the prompt declares the degraded form -------------------
// A declared pointer-only spawn with a matching hash is ALLOWED here: the spawned coder's own refusal under
// condition (b) (sprint-loop SKILL.md step 5) remains the mechanism there. This hook does not enforce (b).
for (const { path, bytes } of files) {
  if (!declared && !containsExactBytes(prompt, bytes)) {
    deny(`prompt does not contain the exact bytes of ${path} (truncated, re-rendered, or omitted without declaring the degraded form)`);
  }
}
allow();
