# Dual-home parity — fkit-authored files that live in two trees

> **An fkit-authored file that exists in both `ai-agents/` and `claude/scaffold/ai-agents/` must be
> edited in both, in the same change.** Editing only the live copy ships a stale file to every project
> fkit sets up from then on.
>
> Approved by the owner on 2026-07-19, from
> [`reports/2026-07-18-dual-home-parity-live-vs-scaffold.md`](../reports/2026-07-18-dual-home-parity-live-vs-scaffold.md)
> (task 49). This is the process half of that ruling; a mechanical parity test is the other half and is
> **not yet built** — see "Where this is enforced".

## Why there are two homes at all

`ai-agents/` is fkit's **own** working structure — this repo dogfoods its agents on itself.
`claude/scaffold/ai-agents/` is the **template** a consuming project receives at init
(`claude/fkit-claude-init.sh`). Some content is genuinely the same document in both places, and that
content is what this rule governs.

## The rule

When you edit a file under `ai-agents/`, check whether the same path exists under
`claude/scaffold/ai-agents/`. If it does, and the file is **fkit-authored** (below), **edit both copies
in the same change.** A change that touches one and not the other is incomplete, not merely untidy.

The same applies in reverse, and to **new** files: an fkit-authored convention, README, or schema
created in one home must be created in the other.

## Which files this covers — the litmus

Not everything in both trees should match. The distinction is **who the content belongs to**:

- **fkit-authored** — the same document in both places. fkit wrote it, and a consuming project should
  receive exactly what fkit uses. ✅ **Must be byte-identical.**
- **Project-specific** — the scaffold copy is a **placeholder** the consuming project fills in with its
  own content. ⛔ **Must NOT be synced.** Copying the live version would ship fkit's own project data
  into someone else's repo.

| Path | Kind | Parity |
|---|---|---|
| `README.md` | fkit-authored | ✅ must match |
| `knowledge-base/conventions/*.md` | fkit-authored | ✅ must match |
| `knowledge-base/conventions/README.md` | fkit-authored, **one intentional exception** | ✅ must match **except its "What's here" index**, which lists each home's actual contents — the live tree carries `dual-home-parity.md`, the scaffold does not |
| `reviews/README.md` | fkit-authored | ✅ must match |
| `wiki-vault/schema.md` | fkit-authored | ✅ must match |
| `knowledge-base/PROJECT.md` | **project-specific** — the scaffold copy is the placeholder brief that `/fkit-initiate-project` replaces | ⛔ never sync |
| `wiki-vault/index.md`, `wiki-vault/log.md` | **project-specific** — the scaffold copies are an empty catalog and an empty activity log | ⛔ never sync |
| `knowledge-base/{decisions,history,incidents,reports}/`, `sprints/`, `tasks/{backlog,done,cancelled}/` | **project-specific** — scaffold holds only `.gitkeep`; the live tree holds fkit's own ADRs, reports, and briefs | ⛔ never sync |

**If you are adding a file and cannot tell which kind it is, ask:** *would a brand-new project want this
exact text on day one?* Yes → fkit-authored, dual-home it. No → project-specific, scaffold gets a
placeholder or nothing.

## Checking parity

```sh
diff -rq ai-agents/ claude/scaffold/ai-agents/ | grep -v '^Only in ai-agents'
```

Every reported difference must be either an intentional project-specific divergence from the table
above, or a drift to fix. **`Only in ai-agents/…` lines are expected and not drift** — the live tree
holds fkit's own ADRs, sprints, and task briefs, which the scaffold deliberately does not ship.

## Where this is enforced

- **At scoping — `/fkit-task-brief`.** A brief whose write surface touches a dual-homed path must name
  **both** copies. *(Skill edit pending — the producer scopes it, owner: fkit-coder.)*
- **Mechanically — a parity test.** `test/dual-home-parity.test.js` under
  [ADR-014](../decisions/adr-014-how-fkit-tests-itself.md) (`node --test`, zero devDeps): assert every
  fkit-authored dual-homed file is byte-identical, with the project-specific paths above as its
  explicit exception list. **Not yet built.** It requires a reconciliation change first, or it fails on
  day one against the drift recorded below. *(Both are producer-scoped briefs, owner: fkit-coder.)*

**Until the test exists, this convention is enforced by reading it.** That is the weaker half of
[ADR-016](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md)'s
*delivery structural, compliance advisory* — stated plainly rather than implied.

## This document is deliberately NOT dual-homed

Applying its own litmus: *would a brand-new project want this text on day one?* **No.** A consuming
project has a single `ai-agents/` tree and **no `claude/scaffold/`** — the two-home problem is a
property of the fkit framework repo itself, not of any project using fkit. Shipping this file would
hand consumers a rule about directories they do not have.

So `dual-home-parity.md` lives **only** in the live tree, and that is correct, not drift. **The parity
test's exception list must include it**, and the live `conventions/README.md` index marks it
fkit-repo-only for the same reason.

*(This is the general case, not a special case: a convention governing fkit's **own** development is
fkit-repo-only; a convention governing **how the agents work** is dual-homed. The four existing
conventions are all the second kind.)*

## Known drift at the time of writing

Verified `2026-07-19` by the `diff -rq` above. **Six** fkit-authored files were out of step — the live
copies were edited during development and the scaffold copies were never brought along:

| File | Diff lines |
|---|---|
| `README.md` | 63 |
| `knowledge-base/conventions/one-skill-one-output.md` | 55 |
| `knowledge-base/conventions/evidence-before-assertion.md` | 50 |
| `knowledge-base/conventions/task-status-vocabulary.md` | 28 |
| `knowledge-base/conventions/README.md` | 24 |
| `knowledge-base/conventions/status-report-format.md` | 14 |

`reviews/README.md` and `wiki-vault/schema.md` were **in step**.

*(Task 49's report enumerated five drifted `conventions/*` files; the check above also found
`ai-agents/README.md`, the largest of the six. Recorded so the reconciliation brief is scoped to six
files, not five.)*

**This list is a snapshot, not part of the rule.** Once the reconciliation lands it is stale — delete
this section then rather than maintaining it; the `diff -rq` command above is the durable check.
