import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { atomicWrite, contained, ROLES } from './settings.mjs';

export const KIT = dirname(dirname(fileURLToPath(import.meta.url)));
const marker = '<!-- fkit-codex-generated -->';
export function shellQuote(text) { return "'" + text.replaceAll("'", "'\"'\"'") + "'"; }

export function ownership() {
  const script = '. "$1"; for role in lead producer coder reviewer adversarial-reviewer architect wiki; do printf "%s:" "$role"; skills_for_role "$role"; done';
  const output = execFileSync('bash', ['-c', script, 'fkit', join(KIT, 'claude/skills-for-role.sh')], { encoding: 'utf8' });
  return Object.fromEntries(output.trim().split('\n').map(line => { const [role, list] = line.split(':'); return [role, list.trim().split(/\s+/)]; }));
}

function body(text) { return text.replace(/^---\n[\s\S]*?\n---\n/, ''); }

export function delegatedEntries(role, map = ownership()) {
  if (role !== 'lead') return {};
  return Object.fromEntries(['fkit-status', 'fkit-wiki-sync', 'fkit-wiki-lint']
    .filter(name => map.lead.includes(name))
    .map(name => [name, Object.keys(map).filter(peer => peer !== 'lead' && map[peer].includes(name)).join(', ')]));
}

export function initialPrompt(role) {
  if (!ROLES.includes(role)) throw Error(`Unknown role: ${role}`);
  const source = readFileSync(join(KIT, 'claude/agents', `fkit-${role}.md`), 'utf8').replaceAll('\r\n', '\n');
  const header = /^---\n([\s\S]*?)\n---\n/.exec(source)?.[1];
  const lines = /^initialPrompt: >-\n((?:  .*\n?)+)/m.exec(header ?? '')?.[1];
  if (!lines?.trim()) throw Error(`Missing folded initialPrompt for fkit-${role}; restore its startup instructions`);
  const prompt = lines.trim().split('\n').map(line => line.trim()).join(' ');
  return `Begin this interactive fkit-${role} session using the configured runtime binding. The role instructions are already loaded; fkit-${role} is a role name, not a skill to request. Follow the startup instructions below directly. Present the greeting in chat before asking anything. For an owner question use fkit_roles.fkit_ask_owner if available, otherwise ask explicitly and wait.\n\n${prompt.replaceAll('.claude/skills/', '.agents/skills/')}`;
}

const reviewPass = `## Step 1 — Run two independent reviewers\n
Review the requested scope yourself, then call the reviewer-only fkit_roles tool fkit_adversarial with {prompt} for a fresh read-only second opinion. This preserves Claude's external second pass even when you are already at the ordinary consult depth limit. It cannot delegate onward. Never invoke raw codex exec or share/fork your context. Include task/ledger key and round in stateful scope; the dispatcher writes a run-unique prompt file under .fkit/tmp/. Include scope, inline working/staged/branch diff as applicable, full untracked file contents, the findings-only contract, accepted residuals and relevant ADR re-raise conditions. Do not git-add files to manufacture a diff. Capture the role's findings verbatim and label them [adversarial]; deduplication/verification follows below.\n
A usable pass is grounded findings or an explicit scope-grounded clean verdict. Empty/error-only/unengaged output is unavailable, even with exit 0; usable findings on nonzero exit may be retained with that failure disclosed. If unavailable, proceed with the primary review and lead with [PARTIAL — adversarial pass unavailable], carrying the reason into the verdict. Never present one pass as two. A read-only pass can read and execute write-free checks; do not infer measurement from its sandbox flag.\n
Report separately: (1) primary/adversarial availability, (2) actual model identities and diversity, (3) execution evidence per pass. A usable same-model pass is supported: visibly state 'Both passes used the same model. A different model is recommended for a broader second opinion.' Unknown identities mean diversity unknown; still recommend a different model for a broader second opinion. Different model names may be aliases: do not invent independence or family differences. Only a missing/unusable pass forces partial status. Normal verdict still follows verified findings.\n
## Coverage states\n
Keep the shared ledger Coverage field, refreshed each round. Use both reviewers measured only when each pass ran a behavioral check with command/result evidence; otherwise a usable second pass is reasoning-only second opinion. With no usable second pass use adversarial unavailable. Record model diversity separately; successful same-model review does not trigger the obsolete different-model-only incomplete label. Never claim full measured coverage from source inspection alone.\n\n`;

const reviewReport = `## Step 4 — Consolidated report\n
Lead with a title and exactly one decision: **✅ Ready to merge** (no open confirmed defects; append validation-gated if only a manual check remains); **⚠️ Changes requested — N defects (none blocking)** for confirmed medium/low defects; **🛑 Blocked — N confirmed defects (M high/critical)** if any confirmed high/critical defect; or **🟡 Partial review — adversarial unavailable** if the second pass was missing or unusable (this takes precedence). A usable same-model or reasoning-only pass does not itself force a partial verdict. A verdict recommends action; it never authorizes a fix or merge.\n
Immediately under the verdict, above findings, state **Coverage: <state>** exactly once with per-pass command/results or reason no measurement occurred. Then state pass availability and model identity/diversity separately. Always recommend a different model for a broader second opinion when the two models are the same or diversity is unknown. If the second pass is unusable, place **[PARTIAL — adversarial pass unavailable]** and the reason above findings, with recovery appropriate to the actual failure (not a guessed login error).\n
Present: reviewers run/skipped; findings table (# · Reviewer: primary/adversarial/both · each reviewer's raw severity · Verified verdict including any changed severity · Defect/frontier-move · one-liner); Suggestions (not defects) when present; Suppressed-as-settled with ADR pointers; and the convergence recommendation (act or closeout, and why). Preserve the finding-verification rules above. This stateless review writes no ledger; stateful-review owns the ledger workflow.\n\n`;

export function bindings(root, role, runtime = 'codex') {
  if (runtime === 'claude') return `# fkit configured Claude runtime binding

This is the fixed fkit-${role} role. Canonical role duties and owner gates remain in force. These bindings replace runtime-specific invocation statements in the source procedures. This configured path uses the shared dispatcher; legacy unconfigured Claude sessions retain their original launcher.

- Load every fkit procedure through fkit_roles.fkit_skill {name:"fkit-name"}. The fixed-caller dispatcher checks the canonical load-permission map. Shared lead entries forward to their execution owner; follow their early STOP. Native Skill, Agent and Task tools are disabled on this path. Manual file reads remain outside the invocation boundary, not a grant to execute foreign procedures.
- Map source Agent/Task/@fkit-role calls to fkit_roles.fkit_consult {role,prompt}, a fresh CLI context with its saved runtime/model. Never fork/resume a coder into review. The dispatcher enforces ordinary two-hop/cycle/leaf checks and the existing plan-fidelity check; that check is not proof of approval. A reviewer uses fkit_adversarial for the fresh leaf second opinion outside the ordinary hop budget. A directly launched adversarial performs its own pass and never wraps another CLI.
- In an interactive root Claude session, ask the owner with native AskUserQuestion and wait for the actual answer. Native EnterPlanMode/ExitPlanMode follow the canonical Claude planning procedure; do not replace them with an assumed Codex equivalent. In headless/consult mode return NEEDS-DECISION to the caller. Cancellation, missing responses and explanation requests never grant approval. Preserve standing approval, exact plan carry, ledger sections and producer-only movers from the source procedures.
- Settings in .fkit/model-settings.json resolve at each child launch. Report observed serving models separately from requested IDs. A usable same-model second opinion is supported: visibly say 'Both passes used the same model. A different model is recommended for a broader second opinion.' Unknown identities mean diversity unknown. A missing/unusable pass remains partial. Report actual command/results per pass; reading is reasoning-only.
- Claude adversarial sessions have only Read/Glob/Grep built-ins and the owned read-only skill loader; no command, write or consultation tools. Their coverage is reasoning-only. This is a tool restriction, not a claimed Codex OS sandbox. Other configured Claude workers use native automatic permission review headlessly and normal manual permission requests interactively. General role-write ownership remains instructions. Do not bypass a permission denial; return the action and reason. No commit or push authorized.
- This configured Claude path uses only its supplied fkit MCP server; user MCP settings are not modified. No Codex hook trust or full legacy hook-equivalence claim applies here. Owned procedure invocation is checked by the dispatcher independently of native hooks.
- Source .claude/skills/fkit-* helper references resolve under ${join(root, '.agents/skills')}/fkit-*. For heal pass --share ${shellQuote(KIT)}. Keep wiki writes wiki-only and terminal movers producer-only with the required agent-closed marker. End owner replies with What's next?, except findings-only adversarial output.
`;
  const command = `node ${shellQuote(join(KIT, 'codex/fkit.mjs'))}`;
  return `# fkit Codex runtime binding\n
This session is fkit-${role}. The owner authorized local Codex operation and same-model adversarial review on 2026-10-29. These integration bindings replace Claude-specific runtime statements in the source procedures below; all substantive role rules still apply.

- Your role is fixed. For every fkit procedure invoke fkit_roles.fkit_skill {name:"fkit-name"} and follow the returned instructions; the dispatcher checks its configured caller identity against the canonical load-permission map. Disallowed entries are denied. Lead may load status/wiki-sync/wiki-lint only to follow their forwarding branch; producer/wiki alone execute the owner procedures. The shared body includes owner text; branch compliance is instructional. Native catalog enablement is an additional discoverability control, not authorization to read and execute disabled procedures by hand. Manual shell reads remain outside this invocation boundary, as they were outside Claude's Skill hook boundary.
- Preferred delegation: call the fkit_roles MCP tool fkit_consult with {role, prompt}. It runs a fresh role CLI process outside your shell sandbox, selects its configured model, checks the consult chain and approved-plan fidelity, and returns model provenance with the result. This is a session-scoped stdio helper, not a background daemon. The shell consult command below is the fallback when that tool is unavailable; it may require a runtime execution approval to initialize the child CLI.
- Delegate a bounded task to a fresh role process using the shell command ${command} consult <role> --root ${shellQuote(root)} --prompt-file <path>. Write the task to a unique .fkit/tmp/ prompt file first. Use a quoted path, never interpolate task text into shell syntax. Returned stdout is the peer's response. Keep consults within two hops and never call an ancestor. Adversarial reviewer is a leaf. Native subagents are disabled to keep model selection and session controls on this launch path.
- 'Agent'/'Task'/'@fkit-role' in source instructions map to that consult command. '$ARGUMENTS' means the owner's skill arguments. '/fkit-name' means load the procedure through fkit_skill and follow it. Do not execute source-code-style slash commands in the shell.
- 'Read/Grep/Glob/Write/Edit/Bash' map to available Codex file and shell tools. In an interactive root session AskUserQuestion maps to fkit_roles.fkit_ask_owner {question, options}; it presents an MCP form and waits for the actual owner response. If the client does not support it, ask explicitly and WAIT for the answer. Decline/cancel/error/timeouts give no approval. In a consult/headless run return NEEDS-DECISION {question, options, recommendation, context}; never infer an answer. EnterPlanMode/ExitPlanMode have no assumed equivalent: obey the no-source-write planning gate and state when it is instruction-enforced.
- The owner disabled fkit's Codex PreToolUse and Stop hooks for the first version; their implementation is retained but not registered. Follow the role, question-tool and next-step instructions without relying on hook reminders. Skill enablement is scoped to this launched session. Wiki-only writes, general role write boundaries and planning gates remain instructions. Normal dispatcher skill ownership, consult topology and plan-fidelity checks are mechanical, but alternate manual paths are not a security boundary. Adversarial review launches read-only. Unsupported elicitation clients retain explicit prose questions that must wait for a real answer. This does not claim complete Claude hook equivalence.
- A headless producer uses Codex automatic approval review for sandbox exceptions because terminal movers need protected Git index writes. This keeps workspace-write and submits each requested exception to the approval reviewer; it is not blanket approval. When a required Git command fails on a sandbox boundary, request scoped escalation with a justification. If denied, return the action and stated reason, keep closure pending, and never substitute a manual terminal move. No commit or push is authorized. Other headless roles retain their existing approval policy; adversarial stays read-only.
- Runtime/model settings come from .fkit/model-settings.json, resolved separately for every role process. Reviewer's fkit_adversarial tool runs an independent leaf pass outside the ordinary two-hop consultation budget, matching the former external CLI pass. Do not run raw codex/claude wrappers from a review skill. Do not fork or resume coder context into review. A directly launched adversarial-reviewer performs its own pass, never launches itself.
- Review reporting: a usable same-model adversarial pass is supported. Say visibly 'Both passes used the same model. A different model is recommended for a broader second opinion.' If identities cannot be established say diversity unknown. Only a missing/unusable pass is partial. Report actual execution evidence per pass; reasoning-only coverage is not execution. This replaces source clauses that treat the absence of a different model as an incomplete review. Preserve ledger schema/section ownership, scope, finding verification and residuals.
- .claude/skills/fkit-* and claude/skills/fkit-* references to installed procedures resolve to ${join(root, '.agents/skills')}/fkit-* in this session. Shipped helper scripts must be run with bash/node as appropriate. For heal pass --share ${shellQuote(KIT)}: the share is the checkout root containing claude/, not claude/ itself or a global install. Generated heal commands include this override.
- In Codex, the interactive owner tool fkit_ask_owner satisfies source checks for a session-only AskUserQuestion tool. Only a direct interactive coder receives the launcher plan-review switch line; workers do not inherit it. Review plans through fresh architect/producer/adversarial roles as the source procedure requires. Codex has no assumed EnterPlanMode/ExitPlanMode write wall: state planning-only, present the full plan and review record, then ask with fkit_ask_owner and wait. On approval quote the actual answer, date and channel in the record; on rejection make no source edits and write no approved plan.md. Preserve the source's record rules: the sprint driver persists rejected plan-review attempts; a plain coder session does not. Never claim a runtime-enforced planning wall or require Claude's Shift+Tab workflow. The adversarial role runs its own procedure without a Claude fallback; report its actual model identity and usability, not an assumed different model.
- End owner replies with What's next? as required, except findings-only adversarial output. Do not stop ongoing work merely to announce what you would do next.
`;
}

function skillText(name, source) {
  if (name === 'fkit-adversarial-review') {
    const hunt = source.slice(source.indexOf('## The hunt list'), source.indexOf('## Output contract'));
    return `---\nname: ${name}\ndescription: Independent hostile review of code or plans; findings only, no edits.\n---\n# Adversarial review\nYou are already the adversarial reviewer in a fresh Codex session. Read the requested scope and relevant context, inspect the diff including untracked files, and perform the pass yourself. Never launch another adversarial reviewer or CLI. Never edit files. Return grounded findings with id, location, severity, category and problem; if clean, say so. End with actual command/result evidence or reasoning-only, and the active model identity if known.\n\n${hunt}`;
  }
  if (name === 'fkit-team') {
    const start = source.indexOf('   | Role | Does | Must not |'), end = source.indexOf('3. **Explain how to reach');
    if (start < 0 || end < start) throw Error('Team roster source changed; adapt before generating');
    const roster = source.slice(start, end).replaceAll('hostile second opinion on Codex', 'hostile second opinion in a fresh role session');
    const map = ownership();
    const procedures = Object.entries(map).map(([role, skills]) => {
      const delegates = delegatedEntries(role, map);
      return `- ${role}: ${skills.map(name => delegates[name] ? `${name} (delegates to ${delegates[name]})` : name).join(', ')}`;
    }).join('\n');
    return `---\nname: fkit-team\ndescription: Show the seven fkit roles and their configured runtime collaboration.\n---\n# Team\nState the current role, then show this canonical roster:\n\n${roster}\nUse fkit <role> for direct sessions and the runtime consult tool for fresh peer contexts. State the current enforcement limits from the runtime binding; never infer active hooks from the runtime name. Reviewer plus adversarial-reviewer run distinct passes even when they share a model. Coordination uses ai-agents/ files; wiki writes remain wiki-only and movers producer-only.\n\nRole procedures from the canonical ownership registry:\n${procedures}\n`;
  }
  if (name === 'fkit-review') {
    const start = source.indexOf('## Step 1'), end = source.indexOf('## Step 2');
    if (start < 0 || end < start) throw Error('Review source headings changed; adapt explicitly before generating skills');
    source = source.slice(0, start) + reviewPass + source.slice(end);
    const reportStart = source.indexOf('## Step 4'), hardRules = source.indexOf('## Hard rules');
    if (reportStart < 0 || hardRules < reportStart) throw Error('Review report headings changed; adapt explicitly');
    source = source.slice(0, reportStart) + reviewReport + source.slice(hardRules);
    source = source.replace(/Codex\s+unavailable/g, 'adversarial unavailable');
  }
  if (name === 'fkit-stateful-review') {
    const start = source.indexOf('## Step 1'), end = source.indexOf('## Step 2');
    if (start < 0 || end < start) throw Error('Stateful-review source headings changed; adapt explicitly before generating skills');
    source = source.slice(0, start) + reviewPass + source.slice(end);
  }
  if (name === 'fkit-task-ship-loop') {
    source = source.replaceAll('model-diverse pass', 'usable adversarial pass').replaceAll('reviewed — NOT model-diverse', 'PARTIAL — adversarial pass unavailable');
  }
  if (name === 'fkit-sprint-ship-loop') {
    const old = '— that is the one state without a model-diverse review. ⚠️ A **reasoning-only second\n  opinion** IS model-diverse (a different model reasoned over the diff); it is reported, not flagged.';
    if (!source.includes(old)) throw Error('Sprint review reporting changed; adapt availability and diversity explicitly');
    source = source.replace(old, '— the second pass was unavailable. Report actual model diversity separately; a usable same-model or reasoning-only pass does not itself make a run degraded.');
  }
  if (name === 'fkit-heal') {
    source = source.replaceAll('bash .claude/skills/fkit-heal/check.sh', `bash .agents/skills/fkit-heal/check.sh --share ${shellQuote(KIT)}`)
      .replaceAll('bash .claude/skills/fkit-heal/repair.sh propose', `bash .agents/skills/fkit-heal/repair.sh propose --share ${shellQuote(KIT)}`)
      .replaceAll('bash .claude/skills/fkit-heal/repair.sh apply', `bash .agents/skills/fkit-heal/repair.sh apply --share ${shellQuote(KIT)}`);
  }
  return source.replaceAll('six Claude-side roles', 'six ordinary roles').replaceAll('Codex unavailable', 'adversarial unavailable').replaceAll('No Codex pass after retries', 'No usable adversarial pass after retries').replaceAll('.claude/skills/', '.agents/skills/');
}

export function setup(root) {
  contained(root, join(root, '.fkit'));
  contained(root, join(root, '.agents/skills'));
  // The existing initializer carries the project's convergence and owner-file preservation rules.
  execFileSync('bash', [join(KIT, 'claude/fkit-claude-init.sh'), root], { stdio: ['ignore', 'pipe', 'pipe'] });
  const roles = ownership();
  for (const name of new Set(Object.values(roles).flat())) {
    const source = join(KIT, 'claude/skills', name), target = join(root, '.agents/skills', name);
    contained(root, target);
    const skill = join(target, 'SKILL.md');
    if (existsSync(target) && (!existsSync(skill) || !readFileSync(contained(root, skill), 'utf8').includes(marker))) throw Error(`Refusing to replace unowned skill: ${target}`);
    function copy(from, to) {
      const st = lstatSync(from);
      if (st.isSymbolicLink()) throw Error(`Unexpected source symlink: ${from}`);
      if (st.isDirectory()) { for (const name of readdirSync(from)) copy(join(from, name), join(to, name)); }
      else if (st.isFile()) {
        const content = from === join(source, 'SKILL.md') ? `${skillText(name, readFileSync(from, 'utf8'))}\n${marker}\n` : readFileSync(from);
        atomicWrite(root, to, content);
      }
    }
    copy(source, target);
  }
  const gi = contained(root, join(root, '.gitignore'));
  const text = existsSync(gi) ? readFileSync(gi, 'utf8') : '';
  const ignore = '.agents/skills/fkit-*/';
  if (!text.split('\n').includes(ignore)) atomicWrite(root, gi, `${text}\n# fkit-managed Codex skills\n${ignore}\n`);
  return roles;
}

export function instructions(root, role, session = {}) {
  if (!ROLES.includes(role)) throw Error(`Unknown role: ${role}`);
  let prompt = body(readFileSync(join(KIT, 'claude/agents', `fkit-${role}.md`), 'utf8'));
  if (role === 'adversarial-reviewer') {
    prompt = prompt.replace(/## Your procedure[\s\S]*?## What you receive/, '## Your procedure\nRun your own enabled fkit-adversarial-review procedure in this fresh session. Never invoke another CLI reviewer.\n\n## What you receive')
      .replace('running on a different model\non purpose.', 'running in a fresh context. Report actual model diversity separately.')
      .replace("The only file you ever write is the\n  gitignored `.fkit/tmp/` prompt.", 'The dispatcher owns its scratch prompt; you write no files.')
      .replace('naming which mode ran (`[codex]` or\n`[claude-fallback — NOT model-diverse]`)', 'naming this fresh adversarial pass and its observed model identity (or unknown)');
  }
  const rules = readFileSync(join(KIT, 'claude/scaffold/universal-rules.md'), 'utf8');
  const switchLine = role === 'coder' && session.interactive ? `\nfkit session: coder · Plan review: ${session.planReview === false ? 'off — fkit coder --no-plan-review (owner, at launch' : 'on — the default for fkit coder sessions (owner ruling 2026-10-24, ADR-060), launched'} ${new Date().toISOString()}${session.planReview === false ? ')' : ''}\n` : '';
  const runtime = session.runtime ?? 'codex';
  return `${bindings(root, role, runtime)}\n${switchLine}\n${rules}\n\n${prompt}\n\nThe runtime binding at the start defines ${runtime} integrations and overrides incompatible source runtime statements.`;
}
