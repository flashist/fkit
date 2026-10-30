#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { EFFORTS, ROLES, RUNTIMES, atomicWrite, contained, effectiveSettings, hasSettings, loadSettings, saveSettings, validateSettings } from './settings.mjs';
import { claudeArgs, claudeResult } from './claude.mjs';
import { KIT, initialPrompt, instructions, ownership, setup, shellQuote } from './materialize.mjs';
import { checkCarry, consultChain } from './consult.mjs';
import { effortAnswer, effortChoices, modelAnswer, modelCatalog, printCatalog, validateEfforts } from './models.mjs';

// The owner deferred Codex hooks until feedback from the first version.
const CODEX_HOOKS_ENABLED = false;

const HELP = `Usage: fkit [role] [--root PATH] [--exec PROMPT | --prompt-file PATH] [--preview]
       fkit configure --runtime codex|claude [--model ID | --runtime-default]
                      [--effort LEVEL|default] [--role-effort ROLE=LEVEL|default|inherit]
                      [--role-runtime ROLE=RUNTIME] [--role-model ROLE=ID] [--root PATH]
       fkit settings | setup | models [--root PATH]
       fkit consult ROLE --prompt-file PATH [--root PATH]
       fkit coder [--no-plan-review | --plan-review] [--root PATH]

Roles: ${ROLES.join(', ')}
Aliases: adv, adversarial → adversarial-reviewer.
Runs each role's saved CLI/model using its existing login. Configure once per project.
Public bare fkit with terminal stdin and stdout offers Codex/Claude once when settings
are missing, including existing Claude-era projects, then saves and continues setup.
Saved settings skip the interview. Direct fkit-codex keeps its Codex-first behavior.
First use needs Node; cancellation saves nothing and starts no role.
--exec runs headlessly; --prompt-file reads a task from a file (headless).
--preview prints resolved settings and controls without running Codex or setup.
Coder sessions review plans by default; --no-plan-review opts out for that session.
configure with no model flags interviews you; --runtime-default follows the selected CLI default.
Effort choices follow the selected Codex model; default follows the CLI, role inherit uses the project effort.
--runtime on a launch changes only the root session; child settings remain saved.
models lists the Codex catalog; Claude accepts exact IDs or its CLI default.
Local settings live in .fkit/model-settings.json. The checkout fkit-codex alias remains available.
`;

function parse(argv) {
  const result = { command: 'launch', role: null, root: process.cwd(), overrides: [], runtimeOverrides: [], effortOverrides: [] };
  if (argv[0] && !argv[0].startsWith('-')) {
    const first = argv.shift();
    if (['adv', 'adversarial'].includes(first)) result.role = 'adversarial-reviewer';
    else if (ROLES.includes(first)) result.role = first;
    else if (['configure', 'settings', 'setup', 'models', 'consult'].includes(first)) result.command = first;
    else throw Error(`Unknown role or command: ${first}`);
  }
  if (result.command === 'consult') result.role = argv.shift();
  if (['adv', 'adversarial'].includes(result.role)) result.role = 'adversarial-reviewer';
  while (argv.length) {
    const flag = argv.shift();
    if (['--help', '-h'].includes(flag)) { result.help = true; continue; }
    if (['--no-plan-review', '--plan-review'].includes(flag)) { result[flag.slice(2)] = true; continue; }
    if (['--preview', '--runtime-default'].includes(flag)) { result[flag.slice(2)] = true; continue; }
    if (!['--root', '--exec', '--prompt-file', '--model', '--role-model', '--runtime', '--role-runtime', '--effort', '--role-effort'].includes(flag)) throw Error(`Unknown option: ${flag}`);
    if (!argv.length) throw Error(`Missing value for ${flag}`);
    const value = argv.shift();
    if (flag === '--role-model') result.overrides.push(value);
    else if (flag === '--role-effort') result.effortOverrides.push(value);
    else if (flag === '--role-runtime') result.runtimeOverrides.push(value);
    else result[flag.slice(2)] = value;
  }
  result.root = resolve(result.root);
  if (result.role && !ROLES.includes(result.role)) throw Error(`Unknown role: ${result.role}`);
  if (result.command === 'consult' && !result.role) throw Error('consult needs a role');
  if (result.runtime !== undefined && !RUNTIMES.includes(result.runtime)) throw Error('Runtime must be codex or claude');
  if (result['no-plan-review'] && result['plan-review']) throw Error('Choose --no-plan-review or --plan-review; plan review is on by default');
  if ((result['no-plan-review'] || result['plan-review']) && (result.command !== 'launch' || result.role !== 'coder' || result.exec !== undefined || result['prompt-file'])) throw Error('Session plan-review flags require an interactive coder launch; headless plans use skill arguments or the driver switch line');
  if (result.exec !== undefined && result['prompt-file']) throw Error('Choose --exec or --prompt-file');
  if (result.command !== 'configure' && (result.model !== undefined || result['runtime-default'] || result.overrides.length || result.runtimeOverrides.length || result.effort !== undefined || result.effortOverrides.length)) throw Error('Model/effort selection flags belong to configure; use saved role settings for launches');
  if (result.runtime !== undefined && !['configure', 'launch'].includes(result.command)) throw Error('--runtime belongs to configure or a direct launch');
  if (result.model !== undefined && result['runtime-default']) throw Error('Choose --model or --runtime-default');
  if (result.command === 'configure' && (result.exec !== undefined || result['prompt-file'] || result.preview)) throw Error('configure does not accept task/preview options');
  if (['settings', 'setup', 'models'].includes(result.command) && (result.role || result.exec !== undefined || result['prompt-file'] || result.preview)) throw Error(`${result.command} does not accept task/preview options`);
  return result;
}

async function configure(options) {
  const hadSettings = hasSettings(options.root);
  if (!hadSettings && (options.overrides.length || options.runtimeOverrides?.length || options.effort !== undefined || options.effortOverrides?.length) && options.model === undefined && !options['runtime-default']) throw Error('First configuration needs --model ID or --runtime-default alongside effort/role overrides');
  let value = hadSettings ? loadSettings(options.root) : { schemaVersion: 1, default: { runtime: options.runtime ?? 'codex', model: null }, roles: {} };
  value = structuredClone(value);
  if (options.runtime && options.runtime !== value.default.runtime) {
    const previousRoles = Object.fromEntries(Object.keys(value.roles).map(role => [role, effectiveSettings(value, role)]));
    value.default = { runtime: options.runtime, model: null };
    value.roles = previousRoles;
  }
  if (options.model !== undefined) value.default.model = options.model;
  else if (options['runtime-default']) value.default.model = null;
  for (const item of options.runtimeOverrides ?? []) {
    const [role, runtime, extra] = item.split('=');
    if (!ROLES.includes(role) || !RUNTIMES.includes(runtime) || extra !== undefined) throw Error('Expected --role-runtime ROLE=codex|claude');
    const prior = effectiveSettings(value, role);
    if (prior.runtime !== runtime) value.roles[role] = { runtime, model: null };
  }
  for (const item of options.overrides) {
    const index = item.indexOf('=');
    if (index < 1 || index === item.length - 1) throw Error('Expected --role-model ROLE=ID (use ROLE=inherit to remove an override)');
    const role = item.slice(0, index), model = item.slice(index + 1);
    if (!ROLES.includes(role)) throw Error(`Unknown role: ${role}`);
    if (model === 'inherit') delete value.roles[role];
    else value.roles[role] = { ...value.roles[role], model: model === 'default' ? null : model };
  }
  if (options.effort !== undefined) {
    const effort = effortAnswer(options.effort, undefined, EFFORTS);
    if (effort === undefined) throw Error('--effort needs a level or default');
    if (effort === null) delete value.default.reasoningEffort;
    else value.default.reasoningEffort = effort;
  }
  for (const item of options.effortOverrides ?? []) {
    const [role, answer, extra] = item.split('=');
    if (!ROLES.includes(role) || !answer || extra !== undefined) throw Error('Expected --role-effort ROLE=LEVEL|default|inherit');
    const effort = effortAnswer(answer, undefined, EFFORTS, true);
    if (effort === undefined) {
      if (value.roles[role]) delete value.roles[role].reasoningEffort;
    } else value.roles[role] = { ...value.roles[role], reasoningEffort: effort };
  }
  const interactive = options.model === undefined && !options['runtime-default'] && !options.overrides.length && !options.runtimeOverrides?.length && options.effort === undefined && !options.effortOverrides?.length;
  if (interactive && (!stdin.isTTY || !stdout.isTTY)) throw Error('Noninteractive configure requires --model ID, --runtime-default or effort/role flags');
  const needsCatalog = interactive || ROLES.some(role => effectiveSettings(value, role).runtime === 'codex' && effectiveSettings(value, role).reasoningEffort != null);
  const catalog = needsCatalog && ROLES.some(role => effectiveSettings(value, role).runtime === 'codex') ? modelCatalog() : { models: [], available: false };
  if (interactive) {
    const confirmed = await configurationQuestions(async question => {
      await interviewSettings(value, catalog, question);
      validateSettings(value);
      validateEfforts(value, catalog.models);
      printSettings(value);
      return (await question('Save these settings? [y/N] ')).trim().toLowerCase() === 'y';
    });
    if (!confirmed) { console.log('Settings unchanged.'); return false; }
  }
  // CLI-managed local state must remain private even when configure precedes scaffold setup.
  const gi = contained(options.root, join(options.root, '.gitignore'));
  const text = existsSync(gi) ? readFileSync(gi, 'utf8') : '';
  validateSettings(value);
  validateEfforts(value, catalog.models);
  if (!text.split('\n').includes('.fkit/')) atomicWrite(options.root, gi, `${text}\n# fkit local model/runtime state\n.fkit/\n`);
  saveSettings(options.root, value);
  printSettings(value);
  console.log('Saved. Model IDs go to their selected CLI; account availability is checked when invoked.');
  return true;
}

async function configurationQuestions(body) {
  const rl = createInterface({ input: stdin, output: stdout });
  let failure, rejectPending;
  const interrupt = () => {
    failure = Object.assign(Error('Configuration interrupted; settings unchanged.'), { exitCode: 130 });
    rejectPending?.(failure);
    rl.close();
  };
  rl.on('SIGINT', interrupt);
  process.on('SIGINT', interrupt);
  rl.on('close', () => {
    failure ??= Error('Configuration cancelled at end of input; settings unchanged.');
    rejectPending?.(failure);
  });
  try {
    return await body(text => new Promise((resolve, reject) => {
      if (failure) { reject(failure); return; }
      rejectPending = reject;
      rl.question(text).then(answer => { rejectPending = undefined; resolve(answer); }, reject);
    }));
  } finally {
    rejectPending = undefined;
    rl.close();
    process.removeListener('SIGINT', interrupt);
  }
}

async function firstUseRuntime() {
  return configurationQuestions(async question => {
    console.log('Choose a project runtime:\n1. Codex\n2. Claude\n0. Cancel');
    const answer = (await question('Runtime [1/codex, 2/claude, 0/cancel]: ')).trim().toLowerCase();
    if (['0', 'cancel'].includes(answer)) return null;
    const runtime = ['1', 'codex'].includes(answer) ? 'codex' : ['2', 'claude'].includes(answer) ? 'claude' : null;
    if (!runtime) throw Error('Choose codex or claude explicitly; no settings saved.');
    cliPreflight(runtime);
    return runtime;
  });
}

export async function interviewSettings(value, catalog, question) {
  if (value.default.runtime === 'codex') printCatalog(catalog);
  const model = await question(`Default ${value.default.runtime} model ID [${value.default.model ?? 'runtime default'}; blank keeps it]: `);
  value.default.model = modelAnswer(model, value.default.model, value.default.runtime === 'codex' ? catalog.models : []);
  if (value.default.runtime === 'codex') {
    const effort = await askEffort(value.default, value.default.reasoningEffort, catalog.models, question, 'Default');
    if (effort === undefined) delete value.default.reasoningEffort;
    else value.default.reasoningEffort = effort;
  }
  if ((await question('Customize models or effort for individual roles? [y/N] ')).trim().toLowerCase() !== 'y') return;
  while (true) {
    console.log('\nRoles available to customize:');
    ROLES.forEach((role, index) => console.log(`${index + 1}. ${role}`));
    console.log('0. Done — review and save');
    const selection = (await question('Roles to customize [numbers or names, separated by spaces or commas; 0/done or blank finishes]: ')).trim();
    if (!selection || ['0', 'done'].includes(selection.toLowerCase())) return;
    const selected = selection.split(/[\s,]+/).filter(Boolean)
      .map(answer => /^\d+$/.test(answer) ? ROLES[Number(answer) - 1] : answer);
    if (selected.some(role => !ROLES.includes(role))) throw Error('Invalid role selection; choose a listed number or role name; settings unchanged');
    for (const role of new Set(selected)) {
      const runtime = effectiveSettings(value, role).runtime;
      if (runtime === 'codex') {
        console.log(`\n${role} model choices:`);
        printCatalog(catalog);
      }
      const answer = (await question(`${role} model [${runtime === 'codex' ? 'number or exact ID; ' : ''}blank keeps ${value.roles[role] && 'model' in value.roles[role] ? value.roles[role].model ?? 'runtime default' : 'inherited'}; default follows CLI; inherit removes override]: `)).trim();
      if (answer === 'inherit') delete value.roles[role];
      else if (answer) value.roles[role] = { ...value.roles[role], model: modelAnswer(answer, value.roles[role]?.model, effectiveSettings(value, role).runtime === 'codex' ? catalog.models : []) };
      const resolved = effectiveSettings(value, role);
      if (resolved.runtime !== 'codex') continue;
      const effort = await askEffort(resolved, value.roles[role]?.reasoningEffort, catalog.models, question, role, true);
      if (effort === undefined) {
        if (value.roles[role]) delete value.roles[role].reasoningEffort;
      } else value.roles[role] = { ...value.roles[role], reasoningEffort: effort };
    }
  }
}

async function askEffort(choice, previous, models, question, label, role = false) {
  const supported = effortChoices(choice.model, models);
  const choices = supported ?? EFFORTS;
  console.log(`\n${label} reasoning effort${supported ? '' : ' (model support unknown; checked by Codex when invoked)'}:`);
  if (choices.length) choices.forEach((effort, index) => console.log(`${index + 1}. ${effort}`));
  else console.log('default only');
  return effortAnswer(await question(`${label} effort [number or name; ${previous === undefined ? role ? `inherited: ${choice.reasoningEffort ?? 'runtime default'}` : 'runtime default' : previous ?? 'runtime default'}; blank keeps it; default follows CLI${role ? '; inherit uses project effort' : ''}]: `), previous, choices, role);
}

function printSettings(value) {
  for (const role of ROLES) {
    const effective = effectiveSettings(value, role);
    console.log(`${role}: ${effective.runtime} / ${effective.model ?? '(runtime default)'}${effective.runtime === 'codex' ? ` / effort: ${effective.reasoningEffort ?? '(runtime default)'}` : ''}${value.roles[role] ? ' [role override]' : ' [default]'}`);
  }
  console.log('A distinct adversarial role runs even with one model; a different model is recommended.');
}

export function requireCliVersion(output) {
  const match = /^codex-cli (\d+)\.(\d+)\.(\d+)([^\s]*)/m.exec(output);
  const version = match?.slice(1, 4).map(Number);
  if (!version || (version[0] === 0 && version[1] < 165) || match[4]) throw Error('Codex CLI 0.165.0 or newer stable is required for this runtime. Update Codex, then retry.');
}

export function launchArgs(root, role, value, prompt, headless, chain = [role], runId = randomUUID(), controls = {}) {
  const resolved = effectiveSettings(value, role), map = ownership();
  const session = { interactive: !headless && chain.length === 1, planReview: controls.planReview !== false, runtime: resolved.runtime };
  if (resolved.runtime === 'claude') return claudeArgs(root, role, resolved, prompt, headless, chain, runId, instructions(root, role, session));
  const skillConfig = [...new Set(Object.values(map).flat())].map(name => ({ path: join(root, '.agents/skills', name, 'SKILL.md'), enabled: map[role].includes(name) }));
  const tomlSkills = `[${skillConfig.map(s => `{path=${JSON.stringify(s.path)},enabled=${s.enabled}}`).join(',')}]`;
  const args = headless ? ['exec'] : [];
  args.push('--cd', root);
  const automaticApproval = headless && role === 'producer';
  if (!automaticApproval) args.push('--sandbox', role === 'adversarial-reviewer' ? 'read-only' : 'workspace-write');
  if (!headless) args.push('--ask-for-approval', 'on-request');
  // Terminal movers need protected Git writes; each headless producer exception still goes to review.
  if (automaticApproval) args.push('--approve-for-me');
  if (resolved.model !== null) args.push('--model', resolved.model);
  if (resolved.reasoningEffort) args.push('-c', `model_reasoning_effort=${JSON.stringify(resolved.reasoningEffort)}`);
  args.push('-c', `developer_instructions=${JSON.stringify(instructions(root, role, session))}`, '-c', 'features.multi_agent=false', '-c', 'agents.enabled=false', '-c', `skills.config=${tomlSkills}`);
  if (CODEX_HOOKS_ENABLED) {
    const command = `node ${shellQuote(join(KIT, 'codex/hook.mjs'))} ${role}`;
    args.push('-c', `hooks.PreToolUse=[{matcher="Skill|spawn_agent|Agent|Task",hooks=[{type="command",command=${JSON.stringify(command)}}]}]`);
    if (!headless && role !== 'adversarial-reviewer') {
      // A stable hook definition can stay trusted across sessions; run identity travels in the environment.
      const stopCommand = `node ${shellQuote(join(KIT, 'codex/hook.mjs'))} ${role} stop`;
      args.push('-c', `hooks.Stop=[{hooks=[{type="command",command=${JSON.stringify(stopCommand)}}]}]`);
    }
  }
  {
    args.push('-c', 'mcp_servers.fkit_roles.command="node"', '-c', `mcp_servers.fkit_roles.args=${JSON.stringify([join(KIT, 'codex/server.mjs'), root, role, JSON.stringify(chain), headless ? 'headless' : 'interactive', runId])}`, '-c', 'mcp_servers.fkit_roles.tool_timeout_sec=660', '-c', 'mcp_servers.fkit_roles.required=true', '-c', 'mcp_servers.fkit_roles.tools.fkit_skill.approval_mode="approve"');
    if (role !== 'adversarial-reviewer') args.push('-c', 'mcp_servers.fkit_roles.tools.fkit_consult.approval_mode="approve"');
    if (role === 'reviewer') args.push('-c', 'mcp_servers.fkit_roles.tools.fkit_adversarial.approval_mode="approve"');
    if (!headless && chain.length === 1 && role !== 'adversarial-reviewer') args.push('-c', 'mcp_servers.fkit_roles.tools.fkit_ask_owner.approval_mode="approve"');
  }
  if (role === 'adversarial-reviewer') args.push('-c', 'features.apps=false', '-c', 'features.plugins=false');
  if (headless) args.push('--skip-git-repo-check');
  // Inline diffs can exceed OS argument limits; headless tasks use stdin.
  if (headless) args.push('-');
  else args.push('--', prompt || initialPrompt(role));
  return args;
}

function run(root, role, value, prompt, headless, chain, controls) {
  const command = effectiveSettings(value, role).runtime;
  cliPreflight(command);
  if (command === 'codex') {
    const auth = spawnSync('codex', ['login', 'status'], { stdio: 'ignore', timeout: 10000 });
    if (auth.status !== 0) throw Error('Codex is not authenticated. Run codex login, then retry.');
  }
  const runId = randomUUID();
  const args = launchArgs(root, role, value, prompt, headless, chain, runId, controls);
  const result = spawnSync(command, args, { cwd: root, stdio: headless ? command === 'claude' ? ['pipe', 'pipe', 'pipe'] : ['pipe', 'inherit', 'inherit'] : 'inherit', input: headless ? prompt : undefined, env: { ...process.env, FKIT_CODEX_CHAIN: JSON.stringify(chain), FKIT_CODEX_ROOT: root, FKIT_CODEX_RUN_ID: runId }, timeout: headless ? 600000 : undefined, maxBuffer: 8000000 });
  if (result.error) throw Error(`${command} session failed: ${result.error.message}`);
  if (result.signal) return result.signal === 'SIGINT' ? 130 : 1;
  if (command === 'claude' && headless) { const decoded = claudeResult(result.stdout, result.status); console.log(decoded.output); return decoded.code ?? 1; }
  return result.signal === 'SIGINT' ? 130 : result.status ?? 1;
}

function cliPreflight(command) {
  const probe = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 10000 });
  if (probe.error || probe.status !== 0) throw Error(`${command} CLI is unavailable. Install and authenticate that CLI, then retry.`);
  if (command === 'codex') {
    requireCliVersion(probe.stdout);
  }
}

async function main() {
  const bareFirstUse = process.env.FKIT_BARE_FIRST_USE === '1' && process.argv.length === 2 && stdin.isTTY && stdout.isTTY;
  delete process.env.FKIT_BARE_FIRST_USE;
  const options = parse(process.argv.slice(2));
  if (options.help) { console.log(HELP); return; }
  if (options.command === 'models') { const catalog = modelCatalog(); printCatalog(catalog); if (!catalog.available) process.exitCode = 1; return; }
  if (options.command === 'configure') { await configure(options); return; }
  if (options.command === 'setup') { setup(options.root); console.log('Managed skills and shared project scaffold ready.'); return; }
  if (options.command === 'launch' && !options.preview && options.exec === undefined && !options['prompt-file'] && stdin.isTTY && stdout.isTTY && !hasSettings(options.root)) {
    if (bareFirstUse) {
      options.runtime = await firstUseRuntime();
      if (!options.runtime) return;
    }
    if (!await configure({ ...options, model: undefined, overrides: [] })) return;
  }
  const value = loadSettings(options.root);
  if (options.command === 'settings') { printSettings(value); return; }
  let role = options.role ?? 'lead';
  const scoped = selected => !options.runtime || effectiveSettings(value, selected).runtime === options.runtime ? value : { ...value, roles: { ...value.roles, [selected]: { runtime: options.runtime, model: null } } };
  if (options.preview) {
    const selected = effectiveSettings(scoped(role), role);
    console.log(JSON.stringify({ root: options.root, role, settings: selected, sandbox: selected.runtime === 'codex' ? role === 'adversarial-reviewer' ? 'read-only' : 'workspace-write' : role === 'adversarial-reviewer' ? 'read tools only; reasoning-only' : 'Claude CLI permissions; no OS sandbox claim', skills: ownership()[role], nativeSubagents: false, reviewDiversity: 'determined from actual passes', limits: ['role write boundaries remain instructions', 'Codex planning gate remains instructional', 'configured Claude controls require live certification'] }, null, 2));
    return;
  }
  let prompt = options.exec;
  if (prompt === '-') {
    if (stdin.isTTY) throw Error('--exec - needs task text on stdin');
    prompt = readFileSync(0, 'utf8');
  }
  if (options['prompt-file']) prompt = readFileSync(contained(options.root, resolve(options.root, options['prompt-file'])), 'utf8');
  const headless = options.command === 'consult' || options.exec !== undefined || !!options['prompt-file'];
  let chain = [];
  if (options.command === 'consult') {
    if (!options['prompt-file']) throw Error('consult requires --prompt-file');
    chain = JSON.parse(process.env.FKIT_CODEX_CHAIN ?? '[]');
    consultChain(role, chain);
    checkCarry(options.root, prompt);
  }
  if (!headless && !stdin.isTTY) throw Error('Noninteractive launch requires --exec PROMPT or --prompt-file PATH');
  if (headless && !prompt?.trim()) throw Error('Headless task must not be empty');
  if (options.command !== 'consult') setup(options.root);
  if (!headless && !options.role && fresh(options.root)) {
    const interview = contained(options.root, join(options.root, '.fkit/interview'));
    if (existsSync(interview) && !existsSync(join(options.root, '.fkit/intake.md'))) {
      const intake = spawnSync('bash', [interview], { cwd: options.root, stdio: 'inherit' });
      if (intake.signal) { process.exitCode = 130; return; }
    }
    const code = run(options.root, 'producer', scoped('producer'), 'This is a fresh fkit project. Read .fkit/intake.md if present and execute fkit-initiate-project. Use the runtime binding for architect and wiki consultation. Interview the owner as needed; do not infer consent.', false, ['producer']);
    if (code !== 0 || fresh(options.root)) { process.exitCode = code || 1; return; }
  } else if (!headless && !options.role) {
    const rl = createInterface({ input: stdin, output: stdout });
    try {
      console.log(ROLES.map((name, index) => `${index + 1}. ${name}`).join('\n'));
      const answer = (await rl.question('Choose a role [1]: ')).trim() || '1';
      const selected = /^\d+$/.test(answer) ? ROLES[Number(answer) - 1] : answer;
      if (!ROLES.includes(selected)) throw Error('Invalid role selection');
      role = selected;
    } finally { rl.close(); }
  }
  process.exitCode = run(options.root, role, scoped(role), prompt, headless, [...chain, role], { planReview: !options['no-plan-review'] });
}

function fresh(root) {
  const path = contained(root, join(root, 'ai-agents/knowledge-base/PROJECT.md'));
  return !existsSync(path) || /fkit:uninitialized|# <Project name>/.test(readFileSync(path, 'utf8'));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error(`fkit-codex: ${e.message}`); process.exitCode = e.exitCode ?? 1; });
