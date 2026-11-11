#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { native, scaffoldContent } from './adapt.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.argv[2] || '.');
const roles = ['lead', 'producer', 'coder', 'architect', 'reviewer', 'adversarial-reviewer', 'wiki'];
const rule = (action, resource, effect) => ({ action, resource, effect });
const body = text => text.replace(/^---\n[\s\S]*?\n---\n/, '');
const ownership = new Map();
const owned = role => ownership.get(role);
const readOwnership = role => execFileSync('sh', ['-c', '. "$1"; skills_for_role "$2"', 'fkit', path.join(source, 'claude/skills-for-role.sh'), role], { encoding: 'utf8' }).trim().split(/\s+/);

for (const role of roles) ownership.set(role, readOwnership(role));

// Refuse symlink ancestors so setup cannot overwrite files outside the selected project.
function safe(file) {
  for (let p = file; p !== path.dirname(target); p = path.dirname(p)) {
    if (fs.existsSync(p) || fs.lstatSync(p, { throwIfNoEntry: false })) {
      if (fs.lstatSync(p).isSymbolicLink()) throw new Error(`Refusing symlink: ${p}`);
    }
    if (p === target) break;
  }
}
function write(rel, text, absent = false) {
  const file = path.join(target, rel);
  safe(file);
  if (absent && fs.existsSync(file)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}
function copyTree(from, rel, transform = false, absent = false) {
  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    const dest = path.join(rel, item.name), src = path.join(from, item.name);
    if (item.name.startsWith('.DS_Store')) continue;
    if (item.isDirectory()) copyTree(src, dest, transform, absent);
    else if (item.isFile()) write(dest, transform ? native(fs.readFileSync(src, 'utf8')) : fs.readFileSync(src), absent);
  }
}
if (!fs.statSync(target).isDirectory()) throw new Error(`Not a directory: ${target}`);
// Existing knowledge and opt-outs belong to the project; initialize only a new tree.
if (!fs.existsSync(path.join(target, 'ai-agents'))) copyTree(path.join(source, 'claude/scaffold/ai-agents'), 'ai-agents', true, true);
const common = native(fs.readFileSync(path.join(source, 'claude/scaffold/universal-rules.md'), 'utf8'));
write('.opencode/fkit-rules.md', common + `\nPlan review: ${process.env.FKIT_OPENCODE_PLAN_REVIEW === '0' ? 'OFF (owner opt-out for this launch)' : 'ON (default)'}. This switch never skips owner plan approval or implementation review.\n`);
write('AGENTS.md', scaffoldContent('AGENTS.md', fs.readFileSync(path.join(source, 'claude/scaffold/AGENTS.md'), 'utf8')), true);

const runtime = `\n## OpenCode runtime contract\nUse OpenCode's subagent tool for named fkit agents; never launch Claude or Codex CLIs.\nLoad procedures with the skill tool. Slash commands route to the owning agent.\nIn the primary session use question for owner choices. Workers return NEEDS-DECISION with\nquestion, options, recommendation and context; the parent asks and waits for an actual answer.\nNo timers, assumed approval, or fabricated tool results. Pass explicit scope and approved rulings\nto every child. Preserve task ledgers, producer-only movers and the agent-closed marker.\nDo not use unavailable Claude plan-mode tools. Present the plan, ask for approval, and wait before\nwriting source. This approval boundary is a prompt rule, not a runtime write sandbox.\nDo not bypass denied skills through direct file reads or shell commands.\nProject rules about test execution take precedence over procedural verification defaults.\nNative OpenCode permissions replace Claude hooks; do not claim Claude hook enforcement here.\nRead .opencode/fkit-rules.md at the start of work. End owner replies with What's next?\n`;
const agents = {};
for (const role of roles) {
  const skills = owned(role);
  const permissions = [rule('skill', 'fkit-*', 'deny'), ...skills.map(s => rule('skill', s, 'allow')),
    rule('subagent', '*', 'deny')];
  if (!['wiki', 'adversarial-reviewer'].includes(role)) {
    for (const child of roles.filter(r => r !== role)) permissions.push(rule('subagent', `fkit-${child}`, 'allow'));
  }
  // Edit permissions constrain ordinary tools; shell access remains approval-controlled.
  permissions.push(rule('shell', '*', 'ask'), rule('edit', '*', role === 'coder' ? 'allow' : 'deny'));
  if (['producer', 'architect', 'wiki', 'reviewer'].includes(role)) {
    const paths = {
      producer: ['ai-agents/tasks/*', 'ai-agents/sprints/*', 'ai-agents/knowledge-base/PROJECT.md', 'AGENTS.md'],
      architect: ['ai-agents/knowledge-base/*'], wiki: ['ai-agents/wiki-vault/*'],
      reviewer: ['ai-agents/tasks/*/review.md', 'ai-agents/sprints/reviews/*'],
    }[role];
    for (const p of paths) permissions.push(rule('edit', p, 'allow'));
  }
  if (role !== 'wiki') permissions.push(rule('edit', 'ai-agents/wiki-vault/*', 'deny'));
  if (role === 'adversarial-reviewer') permissions.push(rule('shell', '*', 'deny'));
  const original = fs.readFileSync(path.join(source, `claude/agents/fkit-${role}.md`), 'utf8');
  let prompt = native(body(original));
  if (role === 'adversarial-reviewer') prompt = `You are fkit-adversarial-reviewer, an independent hostile reviewer.\nRun fkit-adversarial-review. Read only; return grounded findings or an explicit clean verdict.\nYou are a leaf and cannot delegate. Never edit, run tests, or claim execution evidence.\nReport the actual model identity if available; otherwise say model identity unverified.\n`;
  if (role === 'lead') prompt = prompt.replace(/An\n  owner who wants the structural wall[\s\S]*?Do not present the orchestrated gate as a structural guarantee/, 'OpenCode has no structural plan-mode write wall in either session path. Do not present the approval gate as a structural guarantee').replace(/## When the owner wants a dedicated role session instead[\s\S]*?(?=## Routing guidance)/,
    '## Dedicated role sessions\nThe owner can use `fkit opencode <role>` for a focused session, or select a native primary agent.\nOpenCode plan approval remains a prompt rule in either path.\n\n');
  if (role === 'reviewer') prompt = prompt.replaceAll('`codex` CLI', 'native fkit-adversarial-reviewer child').replaceAll('Codex', 'OpenCode second opinion').replaceAll('Claude', 'primary reviewer').replace('(a genuinely different model with different blind spots)', '(a separate context; model diversity must be evidenced)');
  agents[`fkit-${role}`] = { description: `FKit ${role}: ${skills.filter(s => !['fkit-team', 'fkit-query', 'fkit-dumb-down', 'fkit-open-questions-interview'].includes(s)).join(', ')}`, mode: 'all', system: runtime + '\n' + prompt, permissions };
  if (role === 'adversarial-reviewer' && process.env.FKIT_OPENCODE_ADVERSARIAL_MODEL) agents[`fkit-${role}`].model = process.env.FKIT_OPENCODE_ADVERSARIAL_MODEL;
}
copyTree(path.join(source, 'claude/skills'), '.opencode/skills', true);
// Stateful review retains its ledger protocol, but shares the native pass and coverage definition.
const stateful = path.join(target, '.opencode/skills/fkit-stateful-review/SKILL.md');
write('.opencode/skills/fkit-stateful-review/SKILL.md', fs.readFileSync(stateful, 'utf8').replace(/Exactly as in \*\*fkit-review Step 1\*\*[\s\S]*?(?=## )/, 'Run fkit-review Step 1 with a native fkit-adversarial-reviewer child. Use the same scope and ledger round identifier. No CLI prompt file is needed.\n\n')
  .replaceAll('Codex', 'OpenCode second opinion').replaceAll('codex exec', 'native subagent call')
  .replaceAll('gitignored `.fkit/tmp/` codex prompt', 'native review result')
  + '\nOpenCode: use fkit-review Step 1 and its native coverage states. Do not assemble CLI prompt files.\n');
const initiation = path.join(target, '.opencode/skills/fkit-initiate-project/SKILL.md');
write('.opencode/skills/fkit-initiate-project/SKILL.md', fs.readFileSync(initiation, 'utf8')
  .replaceAll('CLAUDE.md and AGENTS.md', 'AGENTS.md').replaceAll('`CLAUDE.md` / `AGENTS.md`', '`AGENTS.md`')
  .replaceAll('In **both** root `CLAUDE.md` and `AGENTS.md`', 'In root `AGENTS.md`')
  .replaceAll('two **root context files**', '**root context file**')
  .replaceAll('On first run the launcher asks the owner a short intake', 'A previous runtime may have asked the owner a short intake'));
copyTree(path.join(source, 'opencode/skills'), '.opencode/skills');
// Heal compares against the same adapted templates setup installs, never the Claude-only root file.
copyTree(path.join(source, 'claude/scaffold/ai-agents'), '.opencode/fkit-resources/claude/scaffold/ai-agents', true);
write('.opencode/fkit-resources/claude/scaffold/AGENTS.md', scaffoldContent('AGENTS.md', fs.readFileSync(path.join(source, 'claude/scaffold/AGENTS.md'), 'utf8')));
const spec = native(fs.readFileSync(path.join(source, 'claude/structure-spec.md'), 'utf8'))
  .split('\n').filter(line => !line.startsWith('| `CLAUDE.md` |')).join('\n');
write('.opencode/fkit-resources/claude/structure-spec.md', spec);
write('.opencode/fkit-resources/claude/structure-manifest.tsv', fs.readFileSync(path.join(source, 'opencode/structure-manifest.tsv')));
for (const script of ['check', 'repair']) {
  write(`.opencode/skills/fkit-heal/${script}-core.sh`, fs.readFileSync(path.join(source, `claude/skills/fkit-heal/${script}.sh`)));
}

for (const name of fs.readdirSync(path.join(source, 'claude/skills')).filter(n => n.startsWith('fkit-'))) {
  const owners = roles.filter(r => owned(r).includes(name));
  if (!owners.length) throw new Error(`Unowned skill: ${name}`);
  const identities = owners.map(role => `fkit-${role}`).join(', ');
  write(`.opencode/commands/${name}.md`, `---\ndescription: ${name}\nsubagent: false\n---\n\nRequest: ${name} $ARGUMENTS\nOwning agents: ${identities}.\nIf you are one of these agents, load the ${name} skill and follow it in this session.\nOtherwise delegate this exact request to fkit-${owners[0]} through the native subagent tool.\nKeep your current role; never execute a non-owned procedure or switch agents to bypass permissions.\nPass the full request, scope and any named owner rulings. Workers return NEEDS-DECISION to the\nprimary, which asks the owner and waits for a real answer; never assume approval.\n`);
}
for (const [id, agent] of Object.entries(agents)) {
  const { system, ...meta } = agent;
  const header = Object.entries(meta).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');
  write(`.opencode/agents/${id}.md`, `---\n${header}\n---\n${system}`);
}
if (!['opencode.json', 'opencode.jsonc', '.opencode/opencode.json', '.opencode/opencode.jsonc'].some(p => fs.existsSync(path.join(target, p)))) write('.opencode/opencode.json', JSON.stringify({ '$schema': 'https://opencode.ai/config.json', default_agent: 'fkit-lead', instructions: ['.opencode/fkit-rules.md'], experimental: { subagent_depth: 3 } }, null, 2) + '\n', true);
const config = { '$schema': 'https://opencode.ai/config.json', default_agent: `fkit-${roles.includes(process.env.FKIT_OPENCODE_ROLE) ? process.env.FKIT_OPENCODE_ROLE : 'lead'}`,
  instructions: ['.opencode/fkit-rules.md'], experimental: { subagent_depth: 3 } };
// A separate config source keeps user JSONC, providers, credentials and model choices untouched.
write('.opencode/fkit.json', JSON.stringify(config, null, 2) + '\n');
console.log(`FKit OpenCode ready in ${target}. Config: .opencode/fkit.json`);
