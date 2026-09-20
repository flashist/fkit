# The calibration probe — recorded, and deliberately NOT adopted as convention

**Date:** 2026-09-18
**Kind:** record of a technique used once, and the owner's ruling on whether it becomes practice
**Status:** closed — the owner ruled. ⛔ **Not a convention. Do not cite this document as one.**

---

## ⛔ READ THIS FIRST IF YOU ARE ABOUT TO DO THE SAME THING

⭐ **If you are considering leaving a known defect in a document to see whether a reviewer catches it
— the owner has already ruled on this, on 2026-09-18, and the ruling is: recorded, not adopted.**

⛔ **That means it is not a sanctioned practice.** It is not forbidden by any rule in this repo
either. ⚠️ **So if you use it, you are using an unsanctioned technique on your own judgement, and the
honest thing is to say so out loud to whoever receives the document** — not to discover it later.

## What the technique is

**A calibration probe:** deliberately leaving a **known defect** in a document that is about to be
reviewed, in order to measure the reviewer — does it find the thing you already know is wrong?

The value it claims: a reviewer that misses a planted defect tells you something about how much
weight to put on its silence elsewhere. It converts *"the reviewer found nothing"* from a reassuring
result into a **measurable** one.

## Where it came up

On 2026-09-18 an external review chain ran over an architect-written evaluation report for the
fkit↔aiboard convergence work
([`2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md`](2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md)).
The chain involved **Codex** as an independent non-Claude reader and a separate `fkit-external-expert`
session. The technique surfaced during that work and was put to the owner.

⚠️ **This document deliberately does not restate the specifics of the probe** — who planted what, and
where. The specifics belong to that review; the **technique and its ruling** are what a future agent
needs, and that is all this record carries.

## The ruling

⭐ **Owner ruling, 2026-09-18**, given via `AskUserQuestion` in a live `fkit lead` session:

> **The calibration-probe technique is to be RECORDED, but NOT adopted as convention.**

⛔ **Recorded** — so the technique is not lost, and so the next person to invent it independently can
see that it has already been considered.
⛔ **Not adopted as convention** — so it does **not** go into
[`../conventions/`](../conventions/README.md), it does **not** become a step in any review procedure,
and no skill, agent file or checklist should acquire an instruction to do it.

## Why the distinction matters, and why this note lives in `reports/`

⭐ **`reports/`'s own README states the rule this note is obeying**, under its heading *"Lifecycle —
filed is not dead"*:

> *"A report is never promoted out of `reports/`. If a report's conclusion hardens into a standing
> rule the project reads on every run, that rule gets written as its **own document in
> `../conventions/`**"*

⛔ **The owner ruled precisely that this conclusion does NOT harden into a standing rule.** So a
`reports/` note is the correct and complete home for it, and moving it to `conventions/` later would
contradict the ruling rather than tidy the filing.

⚠️ **This note is also not an incident** — `../incidents/` holds postmortems of things that broke in
fkit's own runtime or tooling. Nothing broke; a technique was used and judged.

## ⚠️ The honest argument on both sides, so the ruling can be revisited on merit

**For adopting it:**

- A review that finds nothing is otherwise **unfalsifiable**. A probe is the only cheap way to tell a
  clean document from an inattentive reader.
- fkit already leans hard on adversarial review and on model diversity (Codex as a non-Claude second
  opinion). Calibrating those reviewers is consistent with why they exist.

**Against adopting it — and this is the side that won:**

- ⛔ **It puts a known-false statement into a document that goes to git.** Every document in this repo
  is read later by agents that cannot tell a probe from a mistake. If the probe is not removed, the
  repo now carries a defect **on purpose**.
- ⛔ **It is a trust cost paid by the reviewer, not by the planter.** A reviewer that learns documents
  may be salted has a reason to distrust every document.
- ⚠️ **It scales badly.** One probe in one report is controlled; a convention means probes appear
  routinely, and nobody tracks which documents still contain one.

## What a future agent should do instead

1. ⛔ **Do not plant a defect as routine practice.** There is no rule against it and it is still not
   sanctioned; if you do it anyway, **say so to the recipient**, and **remove it** before the document
   is filed.
2. ⭐ **If you want to know whether a reviewer is paying attention, ask it something checkable** —
   a question with a verifiable answer already known — rather than corrupting the artifact.
3. ⚠️ **If you think the ruling should change, it is an owner question**, not an agent judgement.
   See the open question below.

## ⚠️ Open — flagged, not settled

**Should this ruling be an ADR rather than a report note?** The ruling is a decision about how the
team works ("we will not adopt X"), which is ADR-shaped. It is filed here as a report because the
owner's instruction was to **record** it and explicitly **not** to make it convention, and because a
spawned producer must not write an ADR unasked. ⛔ **Returned to the owner as an open question by the
producer that wrote this note; not decided here.**

---

⚠️ **Written 2026-09-18 by a spawned `fkit-producer` with no owner channel**
([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)). Every framing
above the quoted ruling is the producer's. ⛔ No commit was made by the act that wrote this file, and
nothing was written to `ai-agents/wiki-vault/`
([ADR-005](../decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
