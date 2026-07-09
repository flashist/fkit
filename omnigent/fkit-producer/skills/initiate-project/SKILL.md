---
name: initiate-project
description: Guided first-run onboarding for a fresh fkit project. Interview the owner about the product, spawn the fkit-architect to survey the codebase, then write PROJECT.md and the architecture doc into the knowledge-base so the project is ready for real work. Run once, at the very start of a new project. Makes no commits.
---

# Initiate project (first-run onboarding)

This is the **cold start**. A brand-new fkit project has an empty `ai-agents/` working structure and a
placeholder `ai-agents/knowledge-base/PROJECT.md`. Your job is to turn that into a project the whole
agent team can work on — and to make sure the owner never has to wonder "what now?". You do this by
**interviewing the owner about the product** and **having the fkit-architect survey the codebase**,
then writing both pictures into the knowledge-base and proposing concrete next steps.

Run this **once**, when the project is uninitialized. It is the one skill you may start on your own
initiative (the launcher usually kicks you straight into it on a fresh project).

> **You write the product picture; the architect writes the technical one.** `PROJECT.md` (product
> brief) is yours. `architecture.md` is the fkit-architect's — you get it by spawning that agent, not
> by writing it yourself. Anything destined for the wiki goes through fkit-wiki, never directly.

## Step 0 — Orient before you ask (don't ask what you can read)

Ground yourself so your questions are informed, not lazy. With your read/shell tools:
- Read the top-level `README*`, and any obvious product/pitch docs.
- Read dependency manifests and run config (e.g. `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`,
  `Makefile`, `docker-compose*.yml`) — enough to know the shape, not a full survey (that's the architect's job).
- List the top-level directory structure and check `git remote -v` / recent `git log` for context.

Then **greet the owner**: say you're setting the project up, that it takes a short product interview plus
an automated codebase survey, and that they can say **"skip setup"** at any point to go straight to work.

## Step 1 — Get the product picture

**First, check for `.fkit/intake.md`.** On first run the launcher asks the owner a short intake
questionnaire *on the terminal, before you start*, and writes the answers there. If that file exists,
**read it and treat it as the product brief** — do **not** re-ask what it already answers. Briefly
confirm you've got it, then follow up **only** on fields left blank (shown as `—`) or genuinely
ambiguous answers, in one short round. Then go to Step 2. (The intake covers: project name, what it is,
who it's for, stage, near-term goal, constraints/non-goals.)

**Only if there is no intake file**, run the interview yourself. Ask **conversationally, a few questions
at a time** — not a wall of twenty. Adapt to what Step 0 already told you (don't ask what the README
answers; confirm it instead). Cover, over as many rounds as it takes:

- **What is this project?** One or two sentences in the owner's words.
- **Who is it for?** Primary users / audience, and the problem it solves for them.
- **Core value / goal.** What must it do well; what does success look like.
- **Current stage.** Greenfield, early prototype, live product, rewrite, etc.
- **Scope now.** What's in scope for the near term — and explicitly what's *out* of scope.
- **Constraints & deadlines.** Hard requirements, deadlines, platform/compliance constraints, non-goals.
- **Key decisions already made** the team must respect, and any known pain points.

Ask follow-ups freely — an unclear product picture produces wasted briefs later. Keep looping until you
genuinely understand what you're building and why.

## Step 2 — Check for prior knowledge (via fkit-wiki)

Consult the **fkit-wiki** agent (spawn it — see *Consulting other agents — how* in your main prompt) to
surface anything already captured about this project. On a truly fresh project it will likely find
nothing — that's expected; note it and move on. If it *does* find prior context, fold it in.

## Step 3 — Have the architect survey the codebase

Spawn the **fkit-architect** and ask it to run its **survey-project** skill — a non-interactive,
evidence-first pass over the code. Give it the product context you just gathered so its survey is
grounded, and be explicit about the contract:

> *"Run your survey-project skill on this project. Product context: `<2–4 sentence summary from Step 1>`.
> Do a non-interactive, evidence-first survey — do NOT interview the owner; instead return any open
> questions to me. Write `ai-agents/knowledge-base/architecture.md`, then reply with a concise technical
> overview (stack, structure, how to build/run/test, main risks) and your open questions."*

Spawn it, send that, **end your turn**, and read its reply from your inbox. When it returns:
- If it raised **open questions**, relay the important ones to the owner, get answers, and note them
  (you may send the answers back to the architect if they'd change the architecture doc, or just record
  them in `PROJECT.md`).

## Step 4 — Write PROJECT.md

Replace the placeholder `ai-agents/knowledge-base/PROJECT.md` with a real product brief built from the
interview + your Step 0 recon + the architect's overview. **Remove the `fkit:uninitialized` marker line**
(its absence is what tells the team the project is initiated). Follow the file's existing section shape:

- **Overview** — one tight paragraph: what this is and who it's for.
- **Domain & context** — the problem, the users, key domain terms an agent needs.
- **Architecture** — a short prose summary of the technical shape, and a pointer to
  `ai-agents/knowledge-base/architecture.md` for the detail (the architect's doc — don't duplicate it).
- **Conventions & constraints** — the non-obvious rules, invariants, deadlines, and non-goals from the interview.
- **Links** — repo, related docs, dashboards, tickets the owner mentioned.

Never put secrets (DSNs, endpoints, keys) in `PROJECT.md` — it goes to git.

## Step 5 — Seed the wiki (optional, via fkit-wiki)

Offer to have the **fkit-wiki** agent ingest the two new knowledge-base files (`PROJECT.md` and
`architecture.md`) so the wiki gateway has them for future lookups. If the owner agrees, spawn fkit-wiki
and ask it to run its `ingest` on those files. Do not write the wiki yourself.

## Step 6 — Declare ready, and say what's next

Close the loop so there is no "what now?":
- Summarize what was captured — the product picture, and that `PROJECT.md` + `architecture.md` are written.
- List any **open questions** still outstanding (from the architect or the interview).
- Propose **concrete next steps** and offer to do the first one, e.g.: draft the initial **sprint plan**
  in `ai-agents/sprints/`, write the first few **task briefs** in `ai-agents/tasks/backlog/`, or start an
  **investigation task** for the biggest unknown. Recommend one, with its main tradeoff.

**Make no commits** — everything is working-tree only for the owner to review.
