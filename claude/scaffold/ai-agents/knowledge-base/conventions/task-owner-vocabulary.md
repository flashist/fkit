# Task owner vocabulary

> **The canonical set of task owners for this project.** These are the *only* values that may appear in
> a task brief's `## Owner` field. Exactly **one** role name per brief — the role accountable for the
> task's delivery.

## The owners

A task's owner is a single fkit **role**. The seven live roles are the only valid values:

| Owner | The role |
|---|---|
| `fkit-producer` | Product / sprint planning — scopes work, writes briefs, tracks status |
| `fkit-coder` | Implementation — the sole source-write authority |
| `fkit-architect` | Software architecture — design consistency, feasibility, ADRs |
| `fkit-reviewer` | Independent code review (plus a Codex second opinion) |
| `fkit-adversarial-reviewer` | Adversarial second-opinion reviewer, run on Codex |
| `fkit-wiki` | The wiki librarian — the exclusive write gateway for `wiki-vault/` |
| `fkit-lead` | The team room — routes questions; does not itself do the work |

**No other value is valid.** Not a person's name, not a team, not "unassigned", not two roles. The owner
is the role whose seat the work sits in — most often `fkit-coder` for build tasks, `fkit-producer` for
planning tasks, `fkit-wiki` for wiki work.

> ⚠️ **A planned eighth role — a sandboxed e2e tester — is decided but NOT yet built.** It is **not** a
> valid owner until it actually ships. Do not assign a task to a role that does not exist; if the tester
> role lands later, add it to this table in the same change that builds it.

## The rules

- **`## Owner` is mandatory on every brief** — the same standing as `## Status`. A brief with no
  `## Owner`, or with a value not in the table above, is malformed.
- **It is populated at creation.** The producer already decides the owner when scoping a task; the
  `fkit-task-brief` skill writes that decision into the field. There is no "assign it later" state.
- **Position: immediately after `## Status`** in the brief file (identity → status → owner, grouped),
  with the value on the next line — mirroring how `## Status` carries its value.
- **The owner is a role, not a session.** It records *which seat is accountable*, and it does not change
  just because another role consulted on the task. If the accountable role genuinely changes, edit the
  field.

If a value you need isn't here, the fix is to amend this doc — not to invent a value inline.

## Where this is enforced

This vocabulary ships to every project the scaffold sets up, so it lives in the source, not just here:

- **`fkit-task-brief`** — populates `## Owner` with a value from this table on every new brief.
- **The producer** — decides the owner when scoping, and reports against these values and no others.
- **The status dashboard** — should treat an absent or out-of-vocabulary `## Owner` as drift, the same
  way it treats a missing `## Status`. *(Rendering the owner and enforcing its presence is separate,
  later work — this doc defines the field and its values; the dashboard check is not yet wired.)*

## Related

- [`task-status-vocabulary.md`](task-status-vocabulary.md) — the sibling convention: the values of the
  other mandatory brief field, `## Status`, and who may set each.
