// PreToolUse Agent|Task carry-check (0204); design: report 2026-08-02-faithful-carry-of-an-approved-plan,
// §6 and §10 row 3. Run only via carry-check-hook.sh (ADR-017 rule 2); node built-ins only (ADR-014).

// ⚠️ A PROXY for the coder's condition (b) ("it carries a concrete APPROVED plan verbatim"), never (b)
// itself: it checks the plan's bytes (only the hash if pointer-only is declared), never approval (ADR-021).

// ⚠️ It checks at one moment only, and only in launcher sessions (.fkit/settings/<role>.json). Never
// describe it as guaranteeing what the worker received, or as covering every session.

// Ungated by design (0204 plan, ruling Q1): no valid pointer → allow; a near-miss → allow plus one stderr
// WARNING; an infrastructure fault → fail OPEN (Q3); a failed check → DENY via the JSON route (ADR-018).

// JSON.parse, not the siblings' quoted-run regex: a spawn prompt is a multi-line string full of escapes.
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
function skip(reason) {   // infra fault: fail open, one loud stderr line (0204 plan, ruling Q3).
  process.stderr.write(`carry-check-hook: ${reason} — carry check SKIPPED (fail-open)\n`);
  process.exit(0);
}

// SHA-1 repos only: equals git hash-object without spawning git.
function gitBlobId(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}
// Prefix match, ≥7 hex (0204 plan, ruling Q4; POINTER enforces the length).
// A separate function so prove-red can neuter it.
function hashMatches(named, computed) { return computed.startsWith(named); }
// Strict: a driver that trims the file's final newline is denied unless the prompt re-supplies it.
// A separate function so prove-red can neuter it.
function containsExactBytes(prompt, bytes) { return prompt.includes(bytes.toString('utf8')); }

let raw;
try { raw = readFileSync(0, 'utf8'); } catch (e) { skip(`could not read the hook payload from stdin (${e.code || e.message})`); }
let payload;
try { payload = JSON.parse(raw); } catch { skip('hook payload is not valid JSON'); }
if (!payload || typeof payload !== 'object' || Array.isArray(payload)) skip('hook payload is not a JSON object');

// Defensive: the matcher is "Agent|Task" ("Task" is the pre-2.1.63 name of Agent, still an alias).
// Any other tool has nothing to check here, so allow.
if (payload.tool_name !== 'Agent' && payload.tool_name !== 'Task') allow();
const prompt = payload.tool_input && payload.tool_input.prompt;
if (typeof prompt !== 'string') allow();   // nothing to check

// One pointer per line, in the sprint loop's step-4 form (fields split by spaces/tabs only). The SKILL.md
// example hash is under 7 hex, so quoting the rule text never gates (it does draw the near-miss WARNING).
const POINTER = /^[ \t]*plan:[ \t]+(\S+\/plan\.md)[ \t]+blob[ \t]+([0-9a-f]{7,64})\b/;
// A near-miss is not gated but must not be silent: one stderr WARNING (0204 plan, ruling Q1; review R3).
const NEAR_MISS = /plan:.*plan\.md.*\bblob\b/i;
const promptLines = prompt.split('\n');
const pointers = [];
const nearMisses = [];
for (const line of promptLines) {
  const m = POINTER.exec(line);
  if (m) pointers.push({ line, path: m[1], hash: m[2] });
  else if (NEAR_MISS.test(line)) nearMisses.push(line);
}
// Warn only after the files are read: a near-miss line that is a carried plan's own line is content, not
// an alarm (0204 review R11). Residual: a driver line equal to a file line draws no warning (review R14).
function warnNearMisses(lines) {
  if (lines.length === 0) return;
  const first = lines[0].trim().slice(0, 120);
  process.stderr.write(`carry-check-hook: WARNING — ${lines.length} line(s) look like a plan pointer but do not match the pointer form and are NOT gated; first: "${first}"\n`);
}
if (pointers.length === 0) { warnNearMisses(nearMisses); allow(); }

// A gated spawn must be checkable: no cwd → nothing to resolve the pointer against → deny.
const cwd = payload.cwd;
if (typeof cwd !== 'string' || cwd === '') deny('gated spawn but the payload carries no cwd to resolve the plan path against');
const root = resolve(cwd);

// Pass 1 reads and hashes every pointer but denies nothing yet: pass 1b must first drop the pointers
// whose line is another pointer's file content (a plan quoting another task's pointer).
function readPointer(path) {
  // Lexical path safety only: resolve() does not follow symlinks (accepted residual, 0204 review R2).
  const segments = path.split('/');
  if (path.startsWith('/') || segments.includes('..') || segments.includes('')) return { reason: `unsafe plan path: ${path}` };
  const full = resolve(root, path);
  if (full !== root && !full.startsWith(root + sep)) return { reason: `unsafe plan path: ${path} resolves outside cwd` };
  // A missing plan.md is a loud deny, never a silent pass (0204 brief, caveat 2).
  try { return { bytes: readFileSync(full) }; } catch (e) {
    if (e.code === 'ENOENT' || e.code === 'EISDIR' || e.code === 'ENOTDIR') return { reason: `dangling pointer: ${path} does not exist` };
    return { reason: `cannot read ${path} (${e.code || e.message})` };
  }
}
for (const ptr of pointers) {
  const r = readPointer(ptr.path);
  ptr.reason = r.reason;
  ptr.bytes = r.bytes;
  // Only a readable, hash-matching file may vouch that another pointer's line is content (pass 1b).
  if (ptr.bytes) {
    const computed = gitBlobId(ptr.bytes);
    if (!hashMatches(ptr.hash, computed)) ptr.reason = `hash mismatch: prompt names ${ptr.hash}, file is ${computed}`;
    else ptr.lines = new Set(ptr.bytes.toString('utf8').split('\n'));
  }
}

// File content: a line of ANY readable pointer file, or a ≥ PREFIX_MIN prefix of one (a mid-line cut;
// 0204 review R8, R1). Limit: a cut line with anything glued after it is driver text (review R1, R13).

// The shortest degraded-form literal is 12 chars (0204 worklog, "Why PREFIX_MIN = 12").
const PREFIX_MIN = 12;
const fileLines = new Set();
for (const { bytes } of pointers) if (bytes) for (const line of bytes.toString('utf8').split('\n')) fileLines.add(line);
const fileLineList = [...fileLines];
function isFileContent(line) {
  if (fileLines.has(line)) return true;
  return line.length >= PREFIX_MIN && fileLineList.some((f) => f.startsWith(line));
}
warnNearMisses(nearMisses.filter((line) => !isFileContent(line)));

// Pass 1b: a pointer whose line is another verified file's line is content, not a gate — but a mutual pair
// stays gated, because a nonce search can forge one (0204 review R7, R9, R12).
const gated = pointers.filter((x) => !pointers.some((y) =>
  y !== x && y.lines && y.lines.has(x.line) && !(x.lines && x.lines.has(y.line))));
// The first failure among the gated pointers denies, in prompt order.
for (const { reason } of gated) if (reason) deny(reason);
const files = gated.map(({ path, bytes }) => ({ path, bytes }));

// The degraded-form declaration is the driver's: scan driver text only, so a plan's own "pointer-only"
// cannot declare it (0204 worklog, first smoke run).
const outsideThePaste = promptLines.filter((line) => !isFileContent(line)).join('\n');
const declared = /by reference only|pointer[- ]only/i.test(outsideThePaste);

// Pass 2, the paste check, is skipped only for a declared degraded form: there the spawned coder's own
// refusal under condition (b) is the mechanism (sprint-loop SKILL.md step 5). This hook does not enforce (b).
for (const { path, bytes } of files) {
  if (!declared && !containsExactBytes(prompt, bytes)) {
    deny(`prompt does not contain the exact bytes of ${path} (truncated, re-rendered, or omitted without declaring the degraded form)`);
  }
}
allow();
