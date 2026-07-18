---
name: fkit-dumb-down
description: Re-explain your own previous answer in plain, non-specialist language — shorter sentences, everyday words, jargon glossed. Content-preserving: it never drops a caveat, a failure, or an unverified-claim flag. Rewrites your last answer only; reads no files and writes none. Available to the six Claude-side roles.
---

# Dumb Down

> ## ⛔ Owner: the **six Claude-side roles**
> producer · coder · reviewer · architect · wiki · lead. **Not `fkit-adversarial-reviewer`** — its
> review runs on Codex under a restricted allowlist
> ([ADR-022](../../../ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)).

Say your **last substantive answer** again, in simple terms.

**No argument.** It operates on what you just said.

---

## What this does

Take **your own most recent substantive answer in this conversation** and re-explain it at a lower
altitude: short sentences, everyday words, an analogy where one genuinely helps, project jargon only
where it is load-bearing and then glossed in a few words.

**It is a re-explanation, not a summary, and not a new answer.** Same facts, same conclusions, same
caveats — different words. If the re-explanation is shorter, that is a side effect of dropping
*wording*, never of dropping *content*.

> **Relation to the standing "Speak in simple terms" preference.** That preference is the **default**
> for every answer. This skill is the **on-demand** version: "explain that again, simpler" is a
> distinct request even when the default is already in force, because it asks for a *further* step
> down in altitude on a *specific* answer. Neither replaces the other.

## ⚠️ The rule that matters most: simplifying is about wording, never content

**Everything true in the original must still be true, and still be said, in the re-explanation.** In
particular, these survive **every** time:

- **A failure, a bug, or a regression** — including one you caused. "It didn't work" is simpler than
  the technical account; "it mostly worked" is a different claim and is not allowed.
- **A caveat, a limitation, or a risk.**
- **An unverified claim, flagged as unverified** — *"I didn't test this"* is already plain language.
  There is no simpler-sounding version that drops the flag.
- **A partial-coverage or degradation flag** (e.g. a review that ran without its second model).
- **Something you did not do**, or could not do.
- **A number that matters.** Do not round `3438 of 4096` into "nearly full" if the margin is the point.

**Precision is not jargon.** A filename, a status marker, an ADR id, a task number, a verdict — these
**stay**, glossed once if the reader may not know them. Replacing a precise term with a friendlier
vague one is the failure this skill is most likely to cause, because it *feels* like simplifying.

> **⚠️ Preserve FORCE and PLACEMENT, not just presence.** A claim can survive word-for-word and still
> be gutted. Two ways, and both read as good simplification:
> - **Hedge-downgrade.** *"This will break"* → *"this could cause issues"* keeps the caveat and
>   destroys it. **Do not soften a certainty into a possibility, a failure into a hiccup, or a "no"
>   into a "not yet".** If the original was blunt, the simple version is blunter, not gentler — plain
>   speech is *more* direct, never less.
> - **Placement-demotion.** A flag that led the original must still lead. **"Loud" is placement, not
>   word count** — the same rule `CLAUDE.md` already sets for concision applies here unchanged. Moving
>   a degradation flag into a trailing clause is not simplifying; it is burying.
>
> **Test it like this: if the owner acted only on your re-explanation, would they make the same
> decision?** If they would be less worried, less urgent, or less informed than the original warranted,
> you have written a different answer.

**If a point genuinely cannot be simplified without becoming false, say it plainly and say why** —
*"this one's hard to put simply, and here's the part that matters."* That is a better answer than a
smooth sentence that is subtly wrong.

## Steps

1. **Find your last substantive answer** in this conversation — the last real explanation or report,
   not a one-line acknowledgement and not a tool call.
2. **If there isn't one, say so and stop.** *"I haven't explained anything yet in this conversation."*
   **Do not invent something to re-explain**, and do not reach for a *file* to summarize instead — the
   subject of this skill is your own answer, nothing else.
3. **Re-explain it.** Lead with the single most important point in one plain sentence, then the rest.
   Use an analogy only where it earns its place; a bad analogy is worse than the jargon it replaced.
4. **Check the content list above before you finish.** Every failure, caveat, unverified claim,
   degradation flag and load-bearing number from the original must be present. **If one is missing, the
   re-explanation is wrong** — fix it rather than shipping the smoother version.

## Rules

- **This skill writes nothing** — no file created, edited or deleted; no status set, no task file
  moved, no wiki write. **Zero write surface.**
- **It reads no files.** The source is your own previous answer in this conversation. If you find
  yourself opening the repo, you are answering a *new* question, not re-explaining an old one.
- **It changes wording, never conclusions.** If re-explaining makes you realize the original was
  wrong, **say that as a correction** — do not quietly emit a different answer under the guise of a
  simpler one.
- **No ADR-021 degradation applies.** There is no owner channel involved — the re-explanation simply
  becomes your reply — so unlike the interview skill, nothing here needs a session-vs-consult fallback.
  **That is not the same as "it behaves identically everywhere", and the difference matters:**
  - In a **fresh one-off consult** you have no prior answer of your own, so step 2 fires and the skill
    correctly does nothing. It is a **no-op there by construction**, not a failure.
  - In a **resumed consult** it works — but your re-explanation goes to the **calling agent**, and
    **their** relay is not bound by the content rules above. **The preservation guarantee ends at the
    consult boundary.** If the content is one the owner must see undiluted, say so in the reply rather
    than trusting the relay to carry it.
- **Do not apologize for the original or pad with preamble.** Re-explain and stop.
