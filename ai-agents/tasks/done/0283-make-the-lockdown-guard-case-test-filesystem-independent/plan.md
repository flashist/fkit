# Approved implementation plan — task 0283

**Approved by the owner 2026-08-13 via `AskUserQuestion`**, in a `fkit lead` session. This plan is the
owner-ruled fix shape plus the diagnosis it rests on, both produced in this session.

## Owner rulings (2026-08-13)

1. **Fix shape A — make the test filesystem-independent.** Verbatim option label:
   "A — make the test filesystem-independent (Recommended)".
2. **Fix now, driven in this session** — verbatim option label: "Fix now — drive it in this session
   (Recommended)". Plan → build → verify → review → close, like any task.
3. **WIDEN the fix: add a second `orphan-targets` line naming the REAL `.fkit/settings`.** Verbatim
   option label: "Widen it — add a second orphan-targets line (Recommended)". Rationale in the owner's
   own framing: fix A already changes what the test proves, and leaving one assertion decorative in CI
   is the exact defect that made them reject the Linux-skip option.
4. **Rank `P17` confirmed as an APPEND** — verbatim option label: "Confirm P17 as an append
   (Recommended)". ⛔ No re-rank; ADR-035's closed-rank immutability stays intact.

---

## The diagnosis this rests on — evidence, not conjecture

fkit's **first-ever CI run went red**: GitHub Actions run **31634593615**, `ubuntu-latest`, **708/709
pass, 1 fail**.

Failing test: `test/orphan-cleanup.test.js:264` — *"the never-delete-lockdown-state guard is
case-insensitive"*. `assert.match(r.stderr, /lockdown state/)` received `''`.

**Reproduced on macOS** by mounting a case-sensitive APFS image (`hdiutil create -fs "Case-sensitive
APFS"`) as `TMPDIR`: **708/709, same test, same `actual: ''`** — byte-for-byte the CI result. A
counterfactual run skipping only that test gave **708/708 green**.

### Mechanism — `claude/fkit-claude-init.sh:735-751`

- The **skip** (`continue`) that prevents deletion fires on any line whose lowercased form matches
  `*settings*` — pure `tr` + glob, **no filesystem involved, identical on every platform** — and the
  `continue` sits **OUTSIDE** the existence check.
- The **announcement** is gated on `exists` (a real `-e` stat). Deliberately: the comment at `:739`
  says announcing an absent path would *"nag on every launch of every project forever with nothing at
  stake."*

On macOS, case-insensitivity resolves `.Fkit/Settings` onto the real `.fkit/settings` → `exists=1` →
announces. On Linux it names nothing → `exists=0` → suppressed. **The test asserts the announcement,
so it is really asserting "the filesystem folded case for me."**

**Decisive probe:** on a case-sensitive filesystem, a list line naming the REAL path
(`.fkit/settings`) **does** fire and announce. The guard is fully functional on Linux.

### Verdict

**TEST defect. NOT a product defect. `main` is NOT broken for Linux users.** The only behavioural
difference on Linux is a suppressed stderr line about a list line that names nothing. No delete
changes, no state at risk. The shipped `claude/orphan-targets` contains no `settings` line at all, so
the branch is unreachable in production on either platform.

### The finding that drove the fix choice

The failing test's **other two assertions passed on Linux while asserting nothing** — `.Fkit/Settings`
names no real path there, so *"lockdown state survived"* is trivially true; the cleanup was never near
it. **Merely skipping the test on Linux would leave a fully vacuous test running in CI — which is
where CI actually runs.**

---

## The fix

### Edit 1 — seed the differently-cased path so it exists on both platforms

Before `runInitFrom`, in the test at `test/orphan-cleanup.test.js:265-267`:

```js
mkdirSync(join(p, '.Fkit', 'Settings'), { recursive: true });
```

On a case-sensitive FS this creates a genuinely distinct directory; on macOS it resolves onto the
existing `.fkit/settings` and `recursive: true` swallows the EEXIST. Either way `exists=1`, the guard
announces, and the assertion tests the guard's **actual contract** — *a differently-cased line naming
an existing path is refused and announced* — instead of testing the filesystem. It keeps the
macOS-specific hazard covered on macOS, because there the two paths are the same object.

### Edit 2 — OWNER RULING 3: widen, so the survival assertion bites on both platforms

Add a **second** `orphan-targets` line naming the **real** `.fkit/settings`, alongside
`.Fkit/Settings`. Without this, `assert.ok(existsSync(join(p, '.fkit','settings','coder.json')))`
stays **trivially true on a case-sensitive filesystem** — `.Fkit/Settings` is a distinct object there,
so `coder.json` was never a deletion candidate.

With both lines present, on **either** platform a line names the real lockdown state, so the survival
assertion is load-bearing everywhere.

⚠️ **Both lines must still be refused and the state must survive.** Do not let the widening turn the
test into one that passes because the guard did something different than intended — verify the guard
refuses on the basis of the `*settings*` match, and that `coder.json` genuinely survives, on **both**
filesystem types.

### Edit 3 — reword the stale comment

`test/orphan-cleanup.test.js:262-263` currently reads:

```
// C5 — macOS filesystems are case-insensitive; the guards were not. A list line of `.Fkit/Settings`
// would sail past a case-sensitive `*settings*` check and then match the real lockdown state on disk.
```

That explains a **macOS-only rationale** which will no longer describe what the test does. Reword it to
describe the cross-platform contract the test now proves, and record why the path is seeded. ⛔ Do not
delete the C5 history — the original hazard is real and is why the guard exists; keep it and add what
changed.

---

## Verification

⚠️ **A plain macOS run CANNOT see this class of defect.** That is the whole point. Required:

1. **Reproduce the red FIRST**, on a case-sensitive filesystem, before fixing — the `hdiutil create
   -fs "Case-sensitive APFS"` recipe, mounted and used as `TMPDIR`. Paste the failure.
2. **Unit suite green there** after the fix — paste `tests/pass/fail`.
3. **`prove-red.sh` MEASURED green there, reported separately.**
   ⚠️ **Honesty flag carried from the diagnosis:** the diagnosing coder did **not** observe
   `prove-red.sh` green under case-sensitivity — it invokes `node --test` internally and a skip pattern
   could not be injected without editing a file, which was out of bounds. That it passes once the one
   test is fixed is a **well-supported inference, not a measurement.** This step exists to convert it.
   Baselines `0a`/`0b` were red from this same single cause; `0c`–`0i` were green and all 15 mutants
   behaved correctly, so the mutation gate itself is healthy.
4. **A normal macOS run green too** — the fix must not trade one platform for the other.
5. `git diff --stat` — **exactly one path**: `test/orphan-cleanup.test.js`.
6. **The true proof is a green GitHub Actions run.** This loop does not commit or push, so if no run ID
   is observed, say **"inferred, not measured"** and do not claim CI green.

---

## Bounds

- ⛔ **No product change.** `claude/fkit-claude-init.sh` must NOT be edited — the guard is correct.
- ⛔ No `.github/workflows/test.yml` change.
- ⛔ No `claude/orphan-targets` change (the **shipped** list; the test writes its own fixture list).
- ⛔ No `test/dashboard-contract.test.js` change — its `:2650-2673` already handles case correctly
  (it uses `Qlan-`/`plan-` precisely because macOS would collide `Plan-`/`plan-`). It is a model, not
  a defect.
- ⛔ No new devDependency (ADR-014).
- ⛔ No `ai-agents/wiki-vault/` write. ⛔ No commit, no push. ⛔ No task-file move.

## Sweep result

Exactly **one** test carries this filesystem assumption, and it is the one that failed. Grepped the
whole test corpus for uppercase path-variant literals: `.Fkit/Settings` at `orphan-cleanup.test.js:266`
is the only one.
