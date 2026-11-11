import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const setup = path.join(root, 'opencode/setup.mjs');
const launcher = path.join(root, 'opencode/fkit-opencode.sh');
function project(t) {
  const dir = fs.mkdtempSync(path.join(tmpdir(), 'fkit-opencode-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function run(cmd, args, cwd, env = {}, input) {
  return spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 20000, input,
    env: { ...process.env, FKIT_OPENCODE_ADVERSARIAL_MODEL: '', OPENCODE_SESSION_ID: '', ...env } });
}
function ready(dir) {
  const result = run(process.execPath, [setup, dir], dir);
  assert.equal(result.status, 0, result.stderr);
}

test('native setup preserves project knowledge and JSONC, and installs usable heal targets', t => {
  const dir = project(t);
  fs.mkdirSync(path.join(dir, 'ai-agents/tasks/backlog'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.opencode'), { recursive: true });
  const contents = {
    'AGENTS.md': '# Owner instructions\n',
    '.opencode/opencode.jsonc': '{ // owner model and agent\n "default_agent": "plan"\n}\n',
    'ai-agents/tasks/backlog/brief.md': '# Preserve this task\n',
  };
  for (const [rel, text] of Object.entries(contents)) fs.writeFileSync(path.join(dir, rel), text);
  ready(dir);
  ready(dir);
  for (const [rel, text] of Object.entries(contents)) assert.equal(fs.readFileSync(path.join(dir, rel), 'utf8'), text);
  assert.equal(fs.existsSync(path.join(dir, '.opencode/opencode.json')), false);
  assert.equal(fs.existsSync(path.join(dir, 'CLAUDE.md')), false);
  assert.equal(fs.existsSync(path.join(dir, 'ai-agents/knowledge-base/PROJECT.md')), false);
  assert.ok(fs.existsSync(path.join(dir, '.opencode/skills/fkit-heal/check-core.sh')));
  const report = run('bash', ['.opencode/skills/fkit-heal/check.sh'], dir);
  assert.equal(report.status, 1, report.stderr);
  assert.match(report.stdout, /missing\tai-agents\/knowledge-base\//);
  assert.doesNotMatch(report.stdout, /\tCLAUDE\.md\t/);
});

test('native setup refuses a symlink in its generated profile path', t => {
  const dir = project(t), outside = project(t);
  fs.mkdirSync(path.join(dir, '.opencode'));
  fs.writeFileSync(path.join(outside, 'sentinel'), 'owner data');
  fs.symlinkSync(outside, path.join(dir, '.opencode/agents'), 'dir');
  const result = run(process.execPath, [setup, dir], dir);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing symlink/);
  assert.deepEqual(fs.readdirSync(outside), ['sentinel']);
});

test('launcher selects the native role and consumes only its plan-review switch', t => {
  const dir = project(t), bin = path.join(dir, 'stub-bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'opencode'), `#!${process.execPath}\nconsole.log(JSON.stringify(process.argv.slice(2)));\n`, { mode: 0o755 });
  const result = run('sh', [launcher, '--no-plan-review', 'coder', '--model', 'example/model'], dir,
    { PATH: `${bin}:${process.env.PATH}` });
  assert.equal(result.status, 0, result.stderr);
  const argv = JSON.parse(result.stdout.trim().split('\n').at(-1));
  assert.deepEqual(argv, ['mini', '--agent', 'fkit-coder', '--model', 'example/model']);
  assert.match(fs.readFileSync(path.join(dir, '.opencode/fkit-rules.md'), 'utf8'), /Plan review: OFF/);
  const report = run('bash', ['.opencode/skills/fkit-heal/check.sh'], dir);
  assert.equal(report.status, 0, report.stdout + report.stderr);
});

test('launcher preserves option values, literal arguments and custom config selection', t => {
  const dir = project(t), bin = path.join(dir, 'stub-bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'opencode'), `#!${process.execPath}\nconsole.log(JSON.stringify({args:process.argv.slice(2),config:process.env.OPENCODE_CONFIG}));\n`, { mode: 0o755 });
  const env = { PATH: `${bin}:${process.env.PATH}`, OPENCODE_CONFIG: '/owner/config.jsonc' };
  const result = run('sh', [launcher, 'coder', '--prompt', '--no-plan-review', '--', '--no-plan-review'], dir, env);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout.trim().split('\n').at(-1)), {
    args: ['mini', '--agent', 'fkit-coder', '--prompt', '--no-plan-review', '--', '--no-plan-review'],
    config: '/owner/config.jsonc',
  });
  const conflict = run('sh', [launcher, 'coder', '--plan-review', '--no-plan-review'], dir, env);
  assert.equal(conflict.status, 2);
  assert.match(conflict.stderr, /not both/);
});

test('heal repairs a known stale native scaffold only with exact fresh approved item lines', t => {
  const dir = project(t);
  ready(dir);
  const rel = 'ai-agents/knowledge-base/conventions/task-owner-vocabulary.md';
  fs.copyFileSync(path.join(root, 'claude/scaffold', rel), path.join(dir, rel));
  const proposal = run('bash', ['.opencode/skills/fkit-heal/repair.sh', 'propose'], dir);
  assert.equal(proposal.status, 0, proposal.stdout + proposal.stderr);
  const item = proposal.stdout.split('\n').find(line => line.startsWith(`item\t${rel}\t`));
  assert.ok(item, proposal.stdout);
  fs.appendFileSync(path.join(dir, rel), '\nOwner changed this after the proposal.\n');
  const refused = run('bash', ['.opencode/skills/fkit-heal/repair.sh', 'apply'], dir, {}, `${item}\n`);
  assert.equal(refused.status, 1);
  assert.match(fs.readFileSync(path.join(dir, rel), 'utf8'), /Owner changed this/);
  fs.copyFileSync(path.join(root, 'claude/scaffold', rel), path.join(dir, rel));
  const applied = run('bash', ['.opencode/skills/fkit-heal/repair.sh', 'apply'], dir, {}, `${item}\n`);
  assert.equal(applied.status, 0, applied.stdout + applied.stderr);
  assert.equal(fs.readFileSync(path.join(dir, rel), 'utf8'), fs.readFileSync(path.join(dir, '.opencode/fkit-resources/claude/scaffold', rel), 'utf8'));
});

test('model evidence uses native assistant records, rejects same model IDs and hides message content', t => {
  const dir = project(t), bin = path.join(dir, 'stub-bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'opencode'), `#!${process.execPath}
const args=process.argv.slice(2);
if(args[1]==='session.get') console.log(JSON.stringify({data:{id:'ses_child',parentID:'ses_parent'}}));
else {
  const child=args.includes('sessionID=ses_child');
  const model={providerID: child ? 'provider-b' : 'provider-a',id: child ? process.env.CHILD_MODEL : 'model-a'};
  console.log(JSON.stringify({data:[{type:'assistant',id:child?'msg_child':'msg_parent',agent:child?'fkit-adversarial-reviewer':'fkit-reviewer',model,content:[{type:'text',text:'PRIVATE_MESSAGE'}]}],cursor:{}}));
}
`, { mode: 0o755 });
  const env = { PATH: `${bin}:${process.env.PATH}` };
  const helper = path.join(root, 'opencode/skills/fkit-review/model-evidence.mjs');
  const distinct = run(process.execPath, [helper, 'ses_child'], dir, { ...env, CHILD_MODEL: 'model-b' });
  assert.equal(distinct.status, 0, distinct.stderr);
  assert.equal(JSON.parse(distinct.stdout).status, 'distinct-runtime-models');
  assert.doesNotMatch(distinct.stdout, /PRIVATE_MESSAGE/);
  const same = run(process.execPath, [helper, 'ses_child'], dir, { ...env, CHILD_MODEL: 'model-a' });
  assert.equal(same.status, 1);
  assert.equal(JSON.parse(same.stdout).status, 'same-model');
  const wrongParent = run(process.execPath, [helper, 'ses_child'], dir,
    { ...env, CHILD_MODEL: 'model-b', OPENCODE_SESSION_ID: 'ses_wrong' });
  assert.equal(wrongParent.status, 1);
  assert.equal(JSON.parse(wrongParent.stdout).status, 'unverified');
});

test('installer ships a native runtime that initializes a consuming project without Claude', t => {
  const dir = project(t), tools = path.join(dir, 'tools'), share = path.join(dir, 'install share');
  const bin = path.join(dir, 'installed-bin'), consumer = path.join(dir, 'consumer');
  fs.mkdirSync(tools); fs.mkdirSync(consumer);
  const archive = path.join(dir, 'source.tgz'), repoName = path.basename(root);
  const packed = run('tar', ['-czf', archive, '-C', path.dirname(root),
    ...['claude', 'opencode', 'bin/fkit-board.mjs', 'vendor/aiboard', 'VERSION'].map(p => `${repoName}/${p}`)], dir);
  assert.equal(packed.status, 0, packed.stderr);
  fs.writeFileSync(path.join(tools, 'curl'), '#!/bin/sh\nexec cat "$FKIT_TEST_ARCHIVE"\n', { mode: 0o755 });
  fs.writeFileSync(path.join(tools, 'git'), '#!/bin/sh\nprintf "1111111111111111111111111111111111111111 refs/heads/main\\n"\n', { mode: 0o755 });
  const env = { PATH: `${tools}:${process.env.PATH}`, FKIT_TEST_ARCHIVE: archive, FKIT_SHARE: share,
    FKIT_BIN: bin, FKIT_RUNTIME: 'opencode' };
  const installed = run('sh', [path.join(root, 'install.sh')], consumer, env);
  assert.equal(installed.status, 0, installed.stdout + installed.stderr);
  const launched = run('sh', [path.join(bin, 'fkit'), 'opencode', 'init'], consumer, env);
  assert.equal(launched.status, 0, launched.stdout + launched.stderr);
  assert.ok(fs.existsSync(path.join(consumer, '.opencode/agents/fkit-lead.md')));
  assert.ok(fs.existsSync(path.join(consumer, '.opencode/skills/fkit-review/model-evidence.mjs')));
  assert.equal(fs.existsSync(path.join(consumer, '.claude')), false);
  assert.equal(fs.existsSync(path.join(consumer, 'CLAUDE.md')), false);
});
