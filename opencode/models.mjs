#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const statePath = '.fkit/opencode-models.json';
const providers = ['openai', 'anthropic'];
const validID = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:/-]*$/.test(value);
export const modelSelector = choice => {
  if (!choice || !validID(choice.provider) || choice.provider.includes('/') || !validID(choice.model) || (choice.variant !== undefined && !validID(choice.variant))) throw new Error('Invalid saved model choice.');
  return `${choice.provider}/${choice.model}${choice.variant ? `#${choice.variant}` : ''}`;
};

function parseSelector(value, provider) {
  const match = typeof value === 'string' && value.match(/^([^/#]+)\/([^#]+)(?:#([^#]+))?$/);
  if (!match || !validID(match[1]) || !validID(match[2]) || (match[3] && !validID(match[3])) || (provider && match[1] !== provider)) {
    throw new Error('Use an OpenCode provider/model or provider/model#variant selector.');
  }
  return { provider: match[1], model: match[2], ...(match[3] ? { variant: match[3] } : {}) };
}

function safeState(target) {
  const file = path.join(target, statePath);
  for (let p = file; ; p = path.dirname(p)) {
    if (fs.lstatSync(p, { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error(`Refusing symlink: ${p}`);
    if (p === target) break;
  }
  return file;
}

export function loadModelChoices(target) {
  const file = safeState(target);
  if (!fs.existsSync(file)) return null;
  let value;
  try { value = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { throw new Error(`Cannot read ${statePath}; fix it or remove it to repeat model setup.`); }
  if (value?.version !== 1 || !value.default || !value.adversarial) throw new Error(`Invalid ${statePath}; expected both model choices.`);
  // Keep credentials and unrelated native settings out of the persisted preferences.
  return { version: 1, default: parseSelector(modelSelector(value.default)), adversarial: parseSelector(modelSelector(value.adversarial)) };
}

function saveChoices(target, choices) {
  const file = safeState(target);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  let created = false;
  try {
    fs.writeFileSync(temp, JSON.stringify(choices, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    created = true;
    fs.renameSync(temp, file);
  } finally {
    if (created) fs.rmSync(temp, { force: true });
  }
}

// Codex resolves TOML, profiles and trusted project layers; no thread or model turn is started.
async function codexPreferences(target) {
  return new Promise(resolve => {
    const child = spawn('codex', ['app-server', '--stdio'], { cwd: target, stdio: ['pipe', 'pipe', 'ignore'] });
    const lines = createInterface({ input: child.stdout });
    let finished = false;
    const finish = value => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      lines.close();
      child.kill();
      const killTimer = setTimeout(() => child.kill('SIGKILL'), 1000);
      killTimer.unref();
      child.once('exit', () => clearTimeout(killTimer));
      resolve(value);
    };
    const timer = setTimeout(() => { child.kill('SIGKILL'); finish({}); }, 10000);
    const send = message => { if (!finished) child.stdin.write(JSON.stringify(message) + '\n'); };
    child.stdin.on('error', () => finish({}));
    child.on('error', () => finish({}));
    child.on('exit', () => finish({}));
    lines.on('line', line => {
      let message;
      try { message = JSON.parse(line); } catch { return; }
      if (message.error) return finish({});
      if (message.id === 0 && message.result) {
        send({ method: 'initialized', params: {} });
        send({ id: 1, method: 'config/read', params: { includeLayers: false, cwd: target } });
      }
      if (message.id === 1) {
        const config = message.result?.config;
        if (!config || (config.model_provider && config.model_provider !== 'openai')) return finish({});
        finish({ model: config.model, effort: config.model_reasoning_effort });
      }
    });
    send({ id: 0, method: 'initialize', params: { clientInfo: { name: 'fkit_model_setup', version: '1.0.0' } } });
  });
}

function claudePreferences(target) {
  const home = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  const layers = [path.join(home, 'settings.json'), path.join(target, '.claude/settings.json'), path.join(target, '.claude/settings.local.json')].map(file => {
    if (!fs.existsSync(file)) return {};
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { throw new Error(`Cannot read Claude Code settings: ${file}`); }
  });
  const env = Object.assign({}, ...layers.map(layer => layer.env), process.env);
  const model = env.ANTHROPIC_MODEL || [...layers].reverse().find(layer => layer.model)?.model || env.ANTHROPIC_DEFAULT_MODEL;
  return { model, effortFor: concrete => {
    if (env.CLAUDE_CODE_EFFORT_LEVEL) return env.CLAUDE_CODE_EFFORT_LEVEL;
    const canonical = concrete.replace(/-\d{8}$/, '');
    for (const [index, layer] of layers.map((layer, index) => [index, layer]).reverse()) {
      const saved = layer.modelSettings?.[concrete]?.effortLevel || layer.modelSettings?.[canonical]?.effortLevel;
      if (saved) return saved;
      // New Claude releases no longer inherit the legacy user-wide effort setting.
      if (layer.effortLevel && (index !== 0 || /claude-(?:opus-(?:[1-4](?:-|$)|5$)|sonnet-[1-4](?:-|$)|haiku-[1-4](?:-|$)|fable-5-1$)/.test(canonical))) return layer.effortLevel;
    }
  } };
}

function catalog(target, server) {
  const args = ['api', 'model.list', '--param', `location[directory]=${target}`];
  if (server) args.push('--server', server);
  try {
    const result = JSON.parse(execFileSync('opencode', args, { cwd: target, encoding: 'utf8', timeout: 15000,
      maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }));
    if (!Array.isArray(result.data)) throw new Error();
    // Catalog entries may contain connection settings; only expose model metadata to the prompts.
    return result.data.filter(model => model.enabled !== false && model.capabilities?.tools !== false).map(model => ({
      provider: model.providerID, model: model.id,
      variants: (model.variants || []).map(variant => ({ id: variant.id, effort: variant.settings?.reasoningEffort })),
    }));
  } catch { throw new Error('Cannot read the OpenCode model catalog. Check OpenCode/provider setup and retry; no model choices were saved.'); }
}

export async function configureModels(target, { reset = false, server } = {}) {
  safeState(target);
  const saved = reset ? null : loadModelChoices(target);
  const teamOverride = process.env.FKIT_OPENCODE_DEFAULT_MODEL;
  const hostileOverride = process.env.FKIT_OPENCODE_ADVERSARIAL_MODEL;
  if (teamOverride) parseSelector(teamOverride);
  if (hostileOverride) parseSelector(hostileOverride);
  if (saved && !reset) return saved;
  if (teamOverride && hostileOverride) {
    const choices = { version: 1, default: parseSelector(teamOverride), adversarial: parseSelector(hostileOverride) };
    saveChoices(target, choices);
    return choices;
  }
  const lines = createInterface({ input: process.stdin, output: process.stderr, terminal: !!process.stdin.isTTY });
  const answers = lines[Symbol.asyncIterator]();
  const say = text => process.stderr.write(text + '\n');
  const ask = async question => {
    process.stderr.write(question + ' ');
    const answer = await answers.next();
    if (answer.done) throw new Error('Model setup cancelled; no choices saved. Run fkit opencode in a terminal, or set both FKIT_OPENCODE_DEFAULT_MODEL and FKIT_OPENCODE_ADVERSARIAL_MODEL.');
    return answer.value.trim();
  };
  let models;
  const preferences = new Map();
  try {
    say('FKit project model setup — two provider choices. Ctrl-C cancels.');
    say('Preferences are copied once; credentials stay with OpenCode. Use fkit opencode --models to change them.');
    const choose = async label => {
      say(`\n${label}`);
      say('1. OpenAI — use my Codex preferences');
      say('2. Anthropic — use my Claude Code preferences');
      let provider;
      while (!provider) {
        const answer = await ask('Choose 1 or 2:');
        provider = providers[Number(answer) - 1];
        if (!provider) say('Enter 1 or 2.');
      }
      if (!models) models = catalog(target, server);
      const available = models.filter(model => model.provider === provider);
      if (!available.length) throw new Error(`No ${provider} models available. Run opencode auth login ${provider}, then retry; no choices saved.`);
      if (!preferences.has(provider)) preferences.set(provider, provider === 'openai' ? await codexPreferences(target) : claudePreferences(target));
      const preference = preferences.get(provider);
      let model = available.find(model => model.model === preference.model);
      let variant;
      if (!model) {
        say(preference.model ? `Saved preference "${preference.model}" needs an exact OpenCode model selection.` : 'No readable saved model found. Select an OpenCode model.');
        if (typeof preference.model === 'string' && preference.model.includes('[1m]')) say('Claude Code’s [1m] context setting is not transferred to OpenCode.');
        available.forEach((model, index) => say(`${index + 1}. ${modelSelector(model)}`));
        while (!model) {
          const answer = await ask('Model number or provider/model[#variant]:');
          if (/^\d+$/.test(answer)) model = available[Number(answer) - 1];
          else {
            try {
              const parsed = parseSelector(answer, provider);
              model = available.find(model => model.model === parsed.model && (!parsed.variant || model.variants.some(v => v.id === parsed.variant)));
              if (model) variant = parsed.variant;
            } catch { /* Invalid selections stay in the prompt instead of changing providers. */ }
          }
          if (!model) say('Choose a model from this provider’s catalog.');
        }
      }
      const effort = preference.effortFor ? preference.effortFor(model.model) : preference.effort;
      if (!variant && effort && !['auto', 'unset', 'default'].includes(effort)) {
        variant = model.variants.find(v => v.id === effort)?.id || model.variants.find(v => v.effort === effort)?.id;
        if (!variant) {
          say(`Saved effort "${effort}" is unavailable for ${modelSelector(model)}.`);
          say('0. Use the OpenCode model’s default effort');
          model.variants.forEach((v, index) => say(`${index + 1}. ${v.id}`));
          while (true) {
            const answer = await ask('Effort option:');
            if (answer === '0') break;
            if (/^\d+$/.test(answer) && model.variants[Number(answer) - 1]) { variant = model.variants[Number(answer) - 1].id; break; }
            say('Choose a listed effort option.');
          }
        }
      }
      const choice = { provider, model: model.model, ...(variant ? { variant } : {}) };
      say(`Using ${modelSelector(choice)}`);
      return choice;
    };
    const choices = { version: 1,
      default: teamOverride ? parseSelector(teamOverride) : await choose('Default for the team'),
      adversarial: hostileOverride ? parseSelector(hostileOverride) : await choose('Default for adversarial review') };
    if (choices.default.model === choices.adversarial.model) say('Same model selected: reviews remain flagged as not model-diverse.');
    saveChoices(target, choices);
    say(`Saved project choices in ${statePath}. Existing sessions keep their current model.`);
    return choices;
  } finally { lines.close(); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const target = process.cwd();
    const choices = loadModelChoices(target);
    const hostile = process.argv[2] === 'adversarial-reviewer';
    const override = hostile ? process.env.FKIT_OPENCODE_ADVERSARIAL_MODEL : process.env.FKIT_OPENCODE_DEFAULT_MODEL;
    if (override) console.log(modelSelector(parseSelector(override)));
    else if (choices) console.log(modelSelector(hostile ? choices.adversarial : choices.default));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
