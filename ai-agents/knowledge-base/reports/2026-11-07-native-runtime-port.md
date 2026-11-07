# Native Berd/Buzz port — implementation and verification

Date: 2026-11-07. Status: **live workflow verification in progress. Both apps completed native
producer/architect/wiki initiation; Buzz passed its approval gate and approved fixture build/manual
checks. Native implementation review and remaining Berd stages are pending**.
No commit, push, release, or real-project task closure. Native wiki roles wrote disposable fixture
vaults only; the real project vault remained byte-identical during resource refresh.

## Owner scope

- Port fkit to Berd first, then Buzz.
- Run native roles on platform-selected models, rather than a frontend to Claude Code/Codex.
- Tests may run while working, but add no new permanent tests and disable prior automatic testing.
- All seven roles, including the adversarial reviewer, use Codex / GPT-6.1 Sol for now.
  Model choices must be configurable during startup setup. Same-model reviews remain explicitly
  incomplete; the owner has not requested a second provider login.

## Implemented

`fkit berd [project]` and `fkit buzz [project]`, also exposed through `setup:berd` / `setup:buzz`,
prepare seven native personas, all 28 procedures, supporting helpers, and additive project seeds.
The installer ships `native/` and `bin/fkit-native.mjs`; native dispatch precedes Claude setup,
preflight, and update checks. Existing project files and edited native resources are preserved;
symlinks, wrong types and unowned collisions refuse setup. Repeat setup uses generated-file hashes.
`--check` performs no writes. OS metadata is excluded from generated resources.

Planning and review have native bindings, including default-on plan review and real owner approval.
The team uses separate native colleagues and the shared task/ledger/wiki structure. Native role
and skill boundaries are **advisory**; Claude hooks are not active. Unverified model diversity or
an unusable second pass produces a loud incomplete review and stops automatic closure.

Berd receives individual `.persona.md` imports. Its current picker requests global sources, so
project files alone do not register personas in the UI. Buzz receives a v1 desktop team snapshot,
using `owner-only`, with no secrets, source identities or memory. Startup choices populate the
runtime/model fields; first interactive setup prompts, flags support scripts, and saved choices
survive repeat setup. The adversarial target can be configured separately. Skills must exist in
every worker's actual checkout. Buzz's owner-only gate accepts verified same-owner teammates;
external identities require a deliberate allowlist decision. See [native setup](../../../docs/native-runtimes.md).

## Verification completed

| Check | Evidence and scope |
|---|---|
| Native setup | 16 temporary checks passed: seven personas, 28 skills, repeat-run bytes, read-only check, snapshot fields, planning/review binding, local heal, owner-file preservation, keep-out, three symlink roots, collisions, edited files, and launcher dispatch |
| Packaged install | Real `install.sh` against a sealed local source archive, then installed `fkit berd` and `fkit buzz` plus their checks, succeeded without Claude setup |
| Berd backend | Official macOS Berd v0.6.4 archive passed its published SHA-256 check; its Goose sidecar initialized ACP and discovered all seven generated agents and all 28 generated skills using the actual source-list method |
| Buzz decoder | Temporary Rust validation used the pinned upstream JSON decoder, snapshot types/validators, visible-text validator, session-policy deserializer and response-mode parser; all seven members were accepted. Validation deliberately allowed only command-free snapshots, matching this artifact; it was not the desktop import transaction |
| Existing default suite | Clean temporary checkout with the working changes and loopback permission: 951 tests, 950 passed, 1 skipped, 0 failed |
| Existing release suite | 30 tests, 27 passed, 3 skipped, 0 failed. The skipped cases require the automatic release test gate the owner removed |
| Existing mutation checks | Unmutated copies green; all four named mutations detected |
| Final launcher/install checks | Existing launcher-contract and update-reinstall suites passed after native help/prerequisite changes |
| Automatic testing | Live GitHub API reported both workflows `disabled_manually`; local workflow definitions now have only manual dispatch. Release no longer starts npm test commands; npm scripts remain manual |
| Static checks | Node/shell syntax and `git diff --check` passed |
| Startup model choices | Temporary checks covered flags, saved settings, separate adversarial choices, invalid input, noninteractive refusal, and a real PTY interactive setup with four Codex prompts; portable Berd metadata and Buzz runtime/model fields checked |
| Berd installed runtime | Installed official signed v0.6.4. Its bundled Codex 0.153.4 rejected the user's model; standalone 0.167.0 succeeded. A marked `.zshrc` block sets the supported `CODEX_PATH` override after PATH setup. Actual ACP adapter and a fresh desktop chat both answered successfully with GPT-6.1 Sol |
| Berd personas | All seven imported into the installed app and visible in its gallery; global persona bodies match generated resources and select Codex / GPT-6.1 Sol |
| Berd role/tool behavior | Fresh lead chat reported its correct owned skills and advisory boundaries; a bounded `berdctl agent list --json` call saw all seven personas |
| Berd delegation | Lead created a separate Codex producer session and a producer callback arrived in the parent. This verifies creation/callback delivery, not a completed autonomous task loop. Session creation needs explicit harness/model; `info context` reports the UI-active session, not necessarily the calling worker |
| Buzz installation | Official v0.5.28 archive matched its published SHA-256 digest and signed bundle verification; installed in Applications. Adapter 2.5.0 initially passed a standalone protocol-1 check but rejected the desktop's protocol-2 initialize request. It was replaced with compatible 1.10.0; standalone Codex 0.167.0 is selected through Buzz's `CODEX_PATH` agent default |
| Existing local launcher | The owner's installed launcher belongs to a separate Codex-enabled release. Native resources were added under a separate `native-port/` share with only a `berd` / `buzz` dispatch block added to the launcher. All prior launcher bytes were preserved, an original backup saved, and both installed native `--check` commands passed |
| Buzz local server | Owner completed image downloads and started the stack manually after Docker registry errors. All five images are present for Linux arm64. Relay, Postgres, Redis and object storage report healthy. Only the relay is published, bound to localhost; private settings and persistent volumes live outside the repository |
| Buzz desktop import | Joined the local community using the existing identity, completed profile `mark`, and imported the snapshot after explicit approval to create seven agent identities. Desktop confirmed “Imported fkit with 7 members.” Lead editor shows Codex selected and custom model `gpt-6.1-sol` |
| Buzz seven-role access | Created a private `fkit` channel with owner plus seven roles. Its description identifies the actual checkout and requires explicit working directories. All seven roles published individual results: actual cwd is the fkit checkout, 28 skill files found, team skill and runtime settings present. No implementation or task closure was requested |
| Buzz native handoff | Lead addressed the actual producer identity with bounded scope, project path and hop limit. Producer published a matching callback; lead verified sender/request identity and published success. Owner-only policy was preserved. Upstream admission code confirms verified same-owner agents are accepted |
| Buzz visible replies | The original no-tools probes produced internal Codex replies, but prohibited the messaging command needed to publish them. This was initially misdiagnosed as a pending runtime. Corrected checks permitted native messaging and produced visible replies in the intended threads. Temporary `CODEX_CONFIG` and `RUST_LOG` diagnostics were removed; the tested launch wrapper was not installed. Global Codex settings/login remain unchanged |

The initial full run in the ordinary worktree failed on sandbox loopback restrictions, ignored
Finder files in the live parity corpus, and a transient watchdog check. The clean isolated rerun
passed; no unrelated product change or new permanent regression suite was added to conceal them.
Temporary checks, downloaded binaries and Rust validation sources are outside the repository.

## Live development workflow verification — in progress

The owner requested continuation beyond connection checks on 2026-11-07. Two disposable consumer
projects, with no remotes or commits, isolate this check from the real project:

- Buzz: `/private/tmp/fkit-workflow-bqpvogir/project`; private `fkit-workflow-check` channel.
- Berd: `/private/tmp/fkit-workflow-bqpvogir/berd-project`; project `wf-berd-a-slug-fixture`.

The fixture is one existing JavaScript slug function. Its README requires primitive strings,
ASCII-only casing/alphabet, collapsed separators, no edge hyphens, and an `untitled` fallback.
Unicode-to-ASCII case mappings must remain separators. No dependencies, permanent/automatic tests,
commits or pushes. Bootstrap skipped vault seeds; only each native wiki role initialized its vault.

### Buzz evidence

- Lead delegated actual producer initiation. Producer created PROJECT, root overview updates,
  one task brief/backlog row and a coordination report; architect wrote the survey; wiki initialized
  the vault and ingested 24 sources into five pages. Real signed teammate callbacks were checked.
- Task: `ai-agents/tasks/backlog/0001-readme-slug-contract/brief.md`. Phase A evidence:
  `ai-agents/knowledge-base/reports/2026-11-07-wf-20261107-a-phase-a.md` in the fixture.
- Native coder ran default-on plan review: producer and architect APPROVE, then native adversarial
  reviewer found no defects. All selected Codex/gpt-6.1-sol; review correctly remained incomplete.
  Coder published the complete four-part B1 packet and stopped without source or plan-artifact writes.
  Source still matched baseline SHA-256 `075127eb0bdffd859c63305398451cd6892f755cf48ad83b9324b9fe25cbcdd6`.
- The real owner answered **“Approve exact B1 (Recommended)”** in the Codex conversation. The exact
  question/answer and date were relayed through the signed owner Buzz message at 17:00:31 UTC.
  The answer had no precise timestamp; the separately observed relay preparation time was 16:58:49.
  This approval expressly excluded closure, commits/pushes and permanent/automatic tests.
- Only after approval, coder saved plan/plan-review/worklog and changed `src/slug.mjs`. Native manual
  inline Node assertions passed: 17 string cases, 15 rejected inputs, named function export, and zero
  selected coercion-method calls. Evidence/command/output are in the fixture task worklog.
- An external manual 23-case check had 13 baseline failures; the same cases now all pass. This is
  orchestrator execution, not evidence that either reviewer measured behavior.
- Source after build: SHA-256 `629827c4d468219dfcb23117f08aefa82211d4ae339ecc531174c5ce43d36350`.
  README/manifest unchanged. Primary reviewer wrote `review.md`: no confirmed defects in its static
  pass, `Decision: 🟡 Partial review`, no reviewer execution claimed. Automatic approval review
  rejected both the full and reduced adversarial handoff: specific payload/recipient authorization
  was not established. No adversarial implementation request was sent. A concrete owner question
  for the fixture packet, imported recipient and private local channel is pending in Codex.
  Fresh adversarial session evidence, coder response and producer assessment remain pending.

### Berd evidence

- Earlier producer-labelled chat `20261107_5` had null persona/project metadata. Its old callback
  proved message delivery, not a fully bound producer. Attempted folder replacement was refused
  outside its authorized roots; moving its running session was also refused. No project writes.
- Created the separate shared-folder project, then a fresh explicitly bound producer `20261107_8`.
  Verified non-null persona path, codex-acp/gpt-6.1-sol, project and checkout. Native architect
  `20261107_10` and wiki `20261107_9` returned matching callbacks and complete authorized artifacts.
- Producer wrote PROJECT, overview updates, one brief/backlog entry and coordination report;
  architect wrote the survey; wiki initialized/ingested three sources into three pages and checked
  freshness. Task remains Backlog; source unchanged. Evidence:
  `ai-agents/knowledge-base/reports/wf-berd-a-initiation.md` in the fixture.
- Fresh explicitly bound coder `20261107_11` verified idle before receiving planning-only request
  WF-BERD-B / BE1 at 17:02 UTC. Architect `20261107_12` requested a revision, then APPROVED the
  revision-round-1 plan. Fresh native adversarial session `20261107_13` completed that exact scope:
  no plan defects, still explicitly same-model/incomplete. The revision uses literal JavaScript
  `\u212A` escapes and ASCII K controls after the received Kelvin examples became ambiguous;
  origin of that discrepancy remains unverified. No product behavior or algorithm changed.
  Complete callbacks arrived directly; truncated CLI previews were not accepted as results.
- Coder presented the complete unchanged BE1 and full review record, with NEEDS-DECISION choices
  for approval, revision, or explanation. Native gate quotes the actual planning skill and stops.
  A separate exact-BE1 approval question is pending in Codex. Buzz B1 approval explicitly does not
  authorize this Berd plan; no Berd source or coder plan artifact written. Both fixtures still have
  zero commits and only Backlog tasks.

### Integration fixes discovered during verification

Buzz originally scoped every role to the whole channel, which would reuse adversarial context.
New snapshots scope only the adversarial reviewer by thread; other roles retain channel scope.
The installed v0.5.28 CLI documents that thread policy isolates canonical channel threads while
DMs stay shared. Updated the existing live adversarial agent to **Each thread**, preserving all
original instruction lines, owner/sibling policy and gpt-6.1-sol; added the fresh-thread requirement.
Saved setting and instructions were reopened and verified. A new top-level thread is required per
pass, including later rounds; actual session freshness still needs verification from the real pass.

Berd bindings now allow one scoped lookup when create omits the worker ID and explicitly forbid
persisting a planning callback before approval: deliver the full packet through the callback instead
of relying on the CLI's 2,000-character message previews. Installed command help confirms the send
limit is 50,000 characters. Missing complete delivery must stop, not silently truncate.

Temporary snapshot checks passed: seven members, adverse thread scope, six channel scopes, all
Codex/sol, owner-only, read-only repeat current. Refreshed installed native resources and seven
matching global persona bodies after freshness checks; preserved every existing frontmatter block.
Both installed native `--check` commands passed; root vault hashes unchanged. No permanent tests added.

### Remaining limits

Full live implementation review/ledger processing and producer-only mover execution are not yet
verified. Pending owner inputs: explicit Buzz fixture-packet publication permission for the actual
adversarial recipient/private local channel, and separate Berd BE1 build approval. The same-model
configuration cannot establish model-diverse independent review and must block automatic closure.
The owner has approved Buzz build only, expressly not closure. Both
fixtures have no HEAD commit, so wiki SHA-based sync has no valid watermark and was not claimed.
Native ownership/approval boundaries remain advisory; these checks do not establish structural walls.

No public Buzz community joined. Only generated fixture content was used for development checks.
Runtime credentials stay outside this repository; no desktop private key copied into artifacts.
