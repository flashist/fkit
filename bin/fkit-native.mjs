#!/usr/bin/env node
import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync,
  renameSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const share = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const roles = ['lead', 'producer', 'coder', 'architect', 'reviewer', 'adversarial-reviewer', 'wiki'];
const descriptions = {
  lead: 'Coordinates the fkit team and relays owner decisions.',
  producer: 'Plans products and sprints, writes briefs, and owns task lifecycle.',
  coder: 'Plans and implements approved source changes.',
  architect: 'Surveys code, designs architecture, and proposes decisions.',
  reviewer: 'Reviews changes and maintains the shared findings ledger.',
  'adversarial-reviewer': 'Attacks code and plans as an independent second-model reviewer.',
  wiki: 'Maintains the project wiki; the exclusive writer of the vault.',
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFileSync(join(share, path), 'utf8');
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const defaultSettings = { runtime: 'goose', model: null, provider: null,
  adversarialRuntime: null, adversarialModel: null, adversarialProvider: null };
const harnesses = { goose: 'goose', codex: 'codex-acp', claude: 'claude-acp' };

function validateSettings(input) {
  const settings = { ...defaultSettings, ...input };
  for (const key of ['runtime', 'adversarialRuntime']) {
    if (settings[key] === null && key === 'adversarialRuntime') continue;
    const value = String(settings[key]).replace(/-acp$/, '');
    if (!Object.hasOwn(harnesses, value)) throw new Error(`${key}: choose goose, codex, or claude`);
    settings[key] = value;
  }
  for (const key of ['model', 'provider', 'adversarialModel', 'adversarialProvider']) {
    const value = settings[key];
    if (value !== null && (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:/+-]*$/.test(value) || value.includes('://'))) {
      throw new Error(`${key}: expected a model/provider ID, not a URL or credential`);
    }
  }
  return settings;
}

function roleTarget(settings, role) {
  const adversarial = role === 'adversarial-reviewer';
  const runtime = (adversarial && settings.adversarialRuntime) || settings.runtime;
  const model = (adversarial && settings.adversarialModel) || settings.model;
  const provider = runtime === 'goose' ? ((adversarial && settings.adversarialProvider) || settings.provider) : null;
  return { runtime, harness: harnesses[runtime], model, provider };
}

async function configureSettings(settings) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('--configure needs a terminal; use --runtime / --model flags in scripts');
  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('Native fkit model setup. Press Enter to keep a value; - means app default / inherit.');
    const prompts = [
      ['runtime', 'Main runtime: goose / codex / claude'], ['model', 'Main model ID'],
      ['provider', 'Goose model provider ID (unused by Codex/Claude)'],
      ['adversarialRuntime', 'Adversarial runtime (inherit, or goose / codex / claude)'],
      ['adversarialModel', 'Adversarial model ID'], ['adversarialProvider', 'Adversarial Goose provider ID'],
    ];
    const result = { ...settings };
    for (const [key, label] of prompts) {
      if (key === 'provider' && result.runtime !== 'goose') continue;
      if (key === 'adversarialProvider' && (result.adversarialRuntime || result.runtime) !== 'goose') continue;
      const answer = (await terminal.question(`${label} [${result[key] ?? 'inherit'}]: `)).trim();
      if (answer) result[key] = answer === '-' || answer === 'inherit' ? (key === 'runtime' ? 'goose' : null) : answer;
    }
    return validateSettings(result);
  } finally { terminal.close(); }
}

function walk(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).filter(entry => entry.name !== '.DS_Store')
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const path = join(prefix, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Refusing source symlink: ${join(dir, entry.name)}`);
      return entry.isDirectory() ? walk(join(dir, entry.name), path) : [path];
    });
}

function ownership() {
  const result = spawnSync('sh', ['-c', '. "$1"; shift; for role do printf "%s:" "$role"; skills_for_role "$role"; done',
    'fkit', join(share, 'claude/skills-for-role.sh'), ...roles], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Cannot read skill ownership: ${result.stderr}`);
  return Object.fromEntries(result.stdout.trim().split('\n').map(line => {
    const [role, skills] = line.split(':');
    return [role, skills.trim().split(/\s+/)];
  }));
}

function bind(text) {
  return text.replaceAll('.claude/skills/', '.agents/skills/');
}

function replaceSection(text, start, end, replacement) {
  const from = text.indexOf(start);
  const to = text.indexOf(end, from + start.length);
  if (from < 0 || to < 0) throw new Error(`Native binding needs an update: ${start}`);
  return text.slice(0, from) + replacement.trim() + '\n\n' + text.slice(to);
}

function nativeSkill(name, text, owned) {
  if (name === 'fkit-plan-task') {
    text = replaceSection(text, '## Workflow', '## Planning Requirements', read('native/planning.md'));
  } else if (name === 'fkit-review') {
    text = replaceSection(text, '## Step 1', '## Step 2', read('native/review.md'));
    const report = text.indexOf('## Step 4');
    if (report < 0) throw new Error('Native binding needs an update: review report');
    text = text.slice(0, report) + read('native/review-report.md');
  } else if (name === 'fkit-stateful-review') {
    text = replaceSection(text, '## Step 1', '## Step 2',
      '## Step 1 — Native independent review\n\nFollow fkit-review Step 1 and Coverage states in full. Use native colleagues and actual model evidence. Keep the schema and section ownership above unchanged; refresh Coverage each round. No usable second-model pass means partial review, even if there are no findings.');
  } else if (name === 'fkit-adversarial-review') {
    text = replaceSection(text, '## Primary mode', '## The hunt list',
      '## Native mode\n\nPerform the hostile pass yourself in this fresh native context, using the hunt lists below. Do not shell out to another runtime. Record your actual model and caller/author models. Unknown or same-family provenance starts with ⚠️ [NOT model-diverse — INCOMPLETE]. Never claim independence from a persona name alone.');
    text = replaceSection(text, '## Output contract', '## Project context',
      '## Output contract — FINDINGS ONLY\n\nPreserve any incomplete banner first. For each finding give id, exact location, severity, category, problem and a concrete failure scenario; no implementation. If no defects were found, say what you checked. End with actual provider/model, whether you executed behavior-bearing commands (name and result), and what you did and did not cover. The primary reviewer assigns coverage; do not fabricate measurements.');
  } else if (name === 'fkit-team') {
    text = text.slice(0, text.indexOf('\n---', 4) + 4) + '\n\n# Native fkit team\n\n' +
      'Report the current persona and seven roles. Prominently state: native role/skill boundaries are advisory; Claude hooks are not active. Use native colleagues, with a separately selected and verified second model for adversarial review.\n\n' +
      roles.map(role => `- **fkit-${role}** — ${descriptions[role]} Skills: ${owned[role].join(', ')}.`).join('\n') +
      '\n\nOnly the producer runs movers; only the wiki persona writes the vault. Agent closes carry (agent-closed — not owner-verified). Shared files under ai-agents/ are the source of truth. Explain native delegation from the runtime contract; do not advertise fkit <role> as a native app command. Answer the owner’s actual routing question briefly.\n';
  }
  return text.replaceAll('Codex unavailable', 'second model unavailable')
    .replaceAll('Codex', 'native second model').replaceAll('Claude-only', 'same-model')
    .replaceAll('Claude Code', 'Claude runtime').replaceAll('[codex]', '[native second model]');
}

function generatedFiles(platform, settings) {
  const files = new Map();
  const owned = ownership();
  const contract = read('native/runtime.md').trim();
  const rules = read('claude/scaffold/universal-rules.md').trim();
  const members = [];
  const primary = roleTarget(settings, 'lead');
  const adversarial = roleTarget(settings, 'adversarial-reviewer');
  const selection = `## Team model configuration\n\nMain roles: ${primary.harness}; model ${primary.model ?? 'app default'}${primary.provider ? `; provider ${primary.provider}` : ''}.\nAdversarial reviewer: ${adversarial.harness}; model ${adversarial.model ?? 'app default'}${adversarial.provider ? `; provider ${adversarial.provider}` : ''}.\nThese are requested settings, not proof of runtime identity or model diversity. Verify actual model evidence. Same-model review remains explicitly incomplete.\n`;
  for (const role of roles) {
    const target = roleTarget(settings, role);
    const instructions = [
      read(`native/roles/${role}.md`).trim(), contract, selection,
      `## This persona's skills\n\n${owned[role].map(s => `- ${s}`).join('\n')}`,
      `## Shared project rules\n\n${rules}`,
      'The native runtime contract supplies the question and tool bindings for these shared rules.',
    ].join('\n\n');
    const identity = `name: fkit-${role}\ndescription: ${JSON.stringify(descriptions[role])}`;
    const targetFields = `provider: ${JSON.stringify(target.harness)}\n` +
      (target.model ? `model: ${JSON.stringify(target.model)}\n` : '') +
      (target.provider ? `modelProviderId: ${JSON.stringify(target.provider)}\n` : '');
    const persona = `---\n${identity}\n${targetFields}---\n\n${instructions}\n`;
    files.set(`.agents/agents/fkit-${role}.md`, persona);
    if (platform === 'berd') {
      const portableModel = target.model ? `model: ${JSON.stringify(`${target.provider ?? target.harness}:${target.model}`)}\n` : '';
      if (!target.model && (target.runtime !== 'goose' || target.provider)) {
        throw new Error('A Berd import for a selected harness/provider needs an explicit --model so its portable model field can preserve that choice');
      }
      files.set(`.fkit/native/berd/fkit-${role}.persona.md`, `---\n${identity}\n${portableModel}---\n\n${instructions}\n`);
    }
    members.push({
      format: 'buzz-agent-snapshot', version: 1,
      definition: { name: `fkit-${role}`, systemPrompt: instructions, runtime: target.runtime,
        ...(target.model ? { model: target.model } : {}), ...(target.provider ? { provider: target.provider } : {}), parallelism: 1,
        respondTo: 'owner-only', sessionPolicy: role === 'adversarial-reviewer' ? 'thread' : 'channel' },
      profile: { displayName: `fkit-${role}`, about: descriptions[role] },
      memory: { level: 'none', entries: [] },
    });
  }
  for (const path of walk(join(share, 'claude/skills'))) {
    let contents = read(`claude/skills/${path}`);
    if (path.endsWith('SKILL.md')) {
      contents = nativeSkill(path.split(sep)[0], contents, owned);
      const end = contents.indexOf('\n---', 4);
      if (!contents.startsWith('---\n') || end < 0) throw new Error(`Invalid skill: ${path}`);
      contents = `${contents.slice(0, end + 4)}\n\n${contract}\n\n---\n\n${contents.slice(end + 4).trimStart()}`;
    } else if (/^fkit-heal\/(check|repair)\.sh$/.test(path)) {
      // A local reference share keeps heal usable without a global fkit or Claude installation.
      contents = contents.replace('share=""', 'share="$(cd "$(dirname "$0")/../../fkit-runtime" && pwd)" || exit 2');
    }
    files.set(`.agents/skills/${path}`, bind(contents));
  }
  for (const path of walk(join(share, 'claude/scaffold'))) {
    files.set(`.agents/fkit-runtime/claude/scaffold/${path}`, read(`claude/scaffold/${path}`));
  }
  for (const name of ['structure-spec.md', 'structure-manifest.tsv']) {
    files.set(`.agents/fkit-runtime/claude/${name}`, read(`claude/${name}`));
  }
  files.set('.agents/fkit-runtime/runtime.md', `${contract}\n`);
  files.set('.agents/fkit-runtime/ownership.json', json(owned));
  files.set('.agents/fkit-runtime/settings.json', json(settings));
  if (platform === 'buzz') {
    files.set('.fkit/native/fkit.team.json', json({
      format: 'buzz-team-snapshot', version: 1,
      team: { name: 'fkit', description: 'Seven native roles for software development.',
        instructions: 'Use the same project checkout. Establish the owner identity before work. Only the owner authorizes builds. Configure a different model family for the adversarial reviewer; unknown diversity means incomplete review.' },
      members,
    }));
  }
  return files;
}

function assertContained(root, path) {
  if (isAbsolute(path) || path.split(/[\\/]/).includes('..')) throw new Error(`Invalid relative path: ${path}`);
  let current = root;
  const segments = path.split(/[\\/]/);
  for (let i = 0; i < segments.length; i++) {
    current = join(current, segments[i]);
    let st;
    try { st = lstatSync(current); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    if (st.isSymbolicLink()) throw new Error(`Refusing symlink: ${current}`);
    if (i < segments.length - 1 && !st.isDirectory()) throw new Error(`Not a directory: ${current}`);
    if (i === segments.length - 1 && !st.isFile()) throw new Error(`Not a regular file: ${current}`);
  }
}

function keepOut(root) {
  const path = 'ai-agents/.fkit-keep-out';
  assertContained(root, path);
  if (!existsSync(join(root, path))) return [];
  return readFileSync(join(root, path), 'utf8').split(/\r?\n/).map(s => s.trim())
    .filter(s => s && !s.startsWith('#')).map(s => {
      const path = s.replace(/\/$/, '');
      if (isAbsolute(path) || path.includes('\\') || path.split('/').some(p => !p || p === '.' || p === '..')) {
        throw new Error(`Malformed keep-out entry: ${s}`);
      }
      return path;
    });
}

function seedFiles(root) {
  const files = new Map();
  const kept = keepOut(root);
  for (const path of walk(join(share, 'claude/scaffold'))) {
    if (path === 'universal-rules.md') continue;
    const rel = path.replace(/^ai-agents\//, '').split(sep).join('/');
    if (path.startsWith(`ai-agents${sep}`) && kept.some(k => rel === k || rel.startsWith(`${k}/`))) continue;
    assertContained(root, path);
    if (existsSync(join(root, path))) continue;
    if (path.endsWith('.gitkeep') && existsSync(join(root, dirname(path)))) continue;
    let contents = read(`claude/scaffold/${path}`);
    if (path === 'AGENTS.md' || path === 'CLAUDE.md') {
      contents = contents.replace('<!-- fkit:begin-rules -->\n<!-- fkit:end-rules -->',
        `<!-- fkit:begin-rules -->\n${read('claude/scaffold/universal-rules.md').trim()}\n<!-- fkit:end-rules -->`);
    }
    files.set(path, contents);
  }
  return files;
}

function install(root, platform, check, settings) {
  const managed = generatedFiles(platform, settings);
  const manifestPath = '.fkit/native/manifest.json';
  assertContained(root, manifestPath);
  let previous = {};
  if (existsSync(join(root, manifestPath))) {
    const parsed = JSON.parse(readFileSync(join(root, manifestPath), 'utf8'));
    if (parsed.format !== 'fkit-native-install-v1' || !parsed.files || typeof parsed.files !== 'object') {
      throw new Error('Invalid native install manifest; refusing to overwrite files.');
    }
    previous = parsed.files;
  }
  const changes = [];
  for (const [path, contents] of managed) {
    assertContained(root, path);
    if (existsSync(join(root, path))) {
      const actual = hash(readFileSync(join(root, path)));
      if (actual === hash(contents)) continue;
      if (actual !== previous[path]) throw new Error(`Owner-edited or unowned file; refusing overwrite: ${path}`);
    }
    changes.push(path);
  }
  const seeds = seedFiles(root);
  if (check) {
    for (const path of [...changes, ...seeds.keys()]) console.log(`missing-or-stale: ${path}`);
    console.log(`Native ${platform}: ${changes.length + seeds.size === 0 ? 'files current' : 'setup needed'}. Role boundaries: advisory. Model diversity: requires runtime evidence.`);
    return changes.length + seeds.size === 0 ? 0 : 1;
  }
  for (const [path, contents] of [...seeds, ...changes.map(path => [path, managed.get(path)])]) {
    assertContained(root, path);
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    if (seeds.has(path) || !existsSync(target)) writeFileSync(target, contents, { flag: 'wx' });
    else {
      if (hash(readFileSync(target)) !== previous[path]) throw new Error(`File changed during setup: ${path}`);
      const temp = `${target}.${randomUUID()}.tmp`;
      try { writeFileSync(temp, contents, { flag: 'wx' }); renameSync(temp, target); }
      finally { if (existsSync(temp)) unlinkSync(temp); }
    }
  }
  const manifest = json({ format: 'fkit-native-install-v1', platform, settings,
    files: { ...previous, ...Object.fromEntries([...managed].map(([path, contents]) => [path, hash(contents)])) } });
  assertContained(root, manifestPath);
  mkdirSync(dirname(join(root, manifestPath)), { recursive: true });
  const temp = join(root, `.fkit/native/manifest.${randomUUID()}.tmp`);
  try { writeFileSync(temp, manifest, { flag: 'wx' }); renameSync(temp, join(root, manifestPath)); }
  finally { if (existsSync(temp)) unlinkSync(temp); }
  console.log(`Prepared native ${platform}: seven personas, ${new Set(Object.values(ownership()).flat()).size} skills in ${root}`);
  console.log('Role and approval boundaries are advisory; reviews require verified second-model evidence.');
  if (platform === 'berd') {
    console.log(`Berd → Agents → Import: the seven individual persona files in ${join(root, '.fkit/native/berd')}.`);
    console.log('Attach this folder as a Berd project; select fkit-lead (or fkit-producer for a fresh project).');
  } else {
    console.log(`Buzz → Agent teams → Import: ${join(root, '.fkit/native/fkit.team.json')}`);
    console.log('Set this checkout as the project context, verify each worker uses it, and keep owner-only instructions for same-owner teammates.');
  }
  return 0;
}

async function main(args) {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: fkit berd|buzz [project-directory] [--check] [--configure]\n       node bin/fkit-native.mjs berd|buzz [project-directory] [options]\n\nOptions:\n  --runtime goose|codex|claude\n  --model MODEL_ID\n  --provider PROVIDER_ID          Goose provider, when needed\n  --adversarial-runtime RUNTIME   default: inherit main runtime\n  --adversarial-model MODEL_ID    default: inherit main model\n  --adversarial-provider ID       default: inherit Goose provider\n  --configure                    ask for settings in a terminal\n  --check                        compare files without writing\n\nModel choices persist per project. First terminal setup asks when no choices were supplied.\nExisting project files and owner-edited native resources are never overwritten.');
    return 0;
  }
  const platform = args.shift();
  if (!['berd', 'buzz'].includes(platform)) throw new Error(`Unknown native platform: ${platform}`);
  let project;
  let check = false;
  let configure = false;
  const overrides = {};
  const flags = { '--runtime': 'runtime', '--model': 'model', '--provider': 'provider',
    '--adversarial-runtime': 'adversarialRuntime', '--adversarial-model': 'adversarialModel', '--adversarial-provider': 'adversarialProvider' };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--check' && !check) check = true;
    else if (arg === '--configure' && !configure) configure = true;
    else if (Object.hasOwn(flags, arg)) {
      const value = args[++i];
      if (!value || (value.startsWith('-') && value !== '-')) throw new Error(`${arg} needs a value`);
      overrides[flags[arg]] = value === '-' || value === 'inherit' ? null : value;
    }
    else if (arg.startsWith('-') || project !== undefined) throw new Error(`Unexpected argument: ${arg}`);
    else project = arg;
  }
  const root = realpathSync(resolve(project ?? process.cwd()));
  if (!lstatSync(root).isDirectory()) throw new Error(`Not a project directory: ${root}`);
  if (relative(root, share).startsWith(`..${sep}`) === false && root !== share) {
    throw new Error('Choose a project folder, not an ancestor of the fkit installation.');
  }
  const manifestPath = '.fkit/native/manifest.json';
  assertContained(root, manifestPath);
  const saved = existsSync(join(root, manifestPath)) ? JSON.parse(readFileSync(join(root, manifestPath), 'utf8')).settings : null;
  let settings = validateSettings({ ...saved, ...overrides });
  if (configure && check) throw new Error('--configure and --check cannot be combined');
  if (configure || (!saved && !check && process.stdin.isTTY && process.stdout.isTTY && Object.keys(overrides).length === 0)) {
    settings = await configureSettings(settings);
  }
  return install(root, platform, check, settings);
}

try { process.exitCode = await main(process.argv.slice(2)); }
catch (error) { console.error(`fkit native: ${error.message}`); process.exitCode = 1; }
