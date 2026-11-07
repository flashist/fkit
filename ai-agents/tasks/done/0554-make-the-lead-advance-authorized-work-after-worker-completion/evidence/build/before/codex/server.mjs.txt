import { createInterface } from 'node:readline';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { atomicWrite, contained, effectiveSettings, loadSettings, ROLES } from './settings.mjs';
import { consultChain, adversarialChain, checkCarry } from './consult.mjs';
import { launchArgs } from './fkit.mjs';
import { OwnerQuestions } from './owner-question.mjs';
import { ownership } from './materialize.mjs';
import { startupDiagnostic } from './diagnostics.mjs';
import { claudeResult } from './claude.mjs';

const [root, caller, chainArgument, mode = 'headless', runId] = process.argv.slice(2);
if (!root || !ROLES.includes(caller)) throw Error('fkit MCP needs project root and caller role');
// MCP transports may filter environment variables; carry caller lineage explicitly.
const chain = JSON.parse(chainArgument ?? process.env.FKIT_CODEX_CHAIN ?? JSON.stringify([caller]));
if (!Array.isArray(chain) || chain.at(-1) !== caller || chain.some(r => !ROLES.includes(r)) || new Set(chain).size !== chain.length) throw Error('Caller does not match valid consult chain');
const children = new Set();
const operations = new Map();
let closing = false;
const send = value => { if (!closing) process.stdout.write(`${JSON.stringify(value)}\n`); };
const questions = new OwnerQuestions(send);
const input = createInterface({ input: process.stdin, crlfDelay: Infinity });

async function consult(args, secondOpinion = false, requestId) {
  if (!args || typeof args.prompt !== 'string' || !args.prompt.trim() || args.prompt.length > 1000000) throw Error('Expected a bounded nonempty prompt (max 1 MB)');
  const next = secondOpinion ? adversarialChain(caller, chain) : consultChain(args.role, chain);
  if (secondOpinion) args = { ...args, role: 'adversarial-reviewer' };
  checkCarry(root, args.prompt);
  const settings = loadSettings(root);
  const path = join(root, '.fkit/tmp', `consult-${args.role}-${randomUUID()}.md`);
  atomicWrite(root, path, args.prompt);
  const childRunId = randomUUID();
  const argv = launchArgs(root, args.role, settings, args.prompt, true, next, childRunId);
  const command = effectiveSettings(settings, args.role).runtime;
  const result = await new Promise((resolve, reject) => {
    const child = spawn(command, argv, { cwd: root, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, FKIT_CODEX_CHAIN: JSON.stringify(next), FKIT_CODEX_ROOT: root, FKIT_CODEX_RUN_ID: childRunId } });
    children.add(child);
    operations.set(requestId, child);
    let output = '', diagnostics = '', timedOut = false, tooLarge = false, hardKill;
    function terminate() {
      child.kill('SIGTERM');
      hardKill ??= setTimeout(() => child.kill('SIGKILL'), 5000);
      hardKill.unref();
    }
    const timer = setTimeout(() => { timedOut = true; terminate(); }, 600000);
    child.stdout.on('data', bytes => { output = (output + bytes.toString()).slice(0, 8000001); if (output.length > 8000000) { tooLarge = true; terminate(); } });
    child.stderr.on('data', bytes => { diagnostics = (diagnostics + bytes.toString()).slice(-1000000); });
    child.on('error', error => { clearTimeout(timer); clearTimeout(hardKill); children.delete(child); operations.delete(requestId); reject(error); });
    child.on('close', (code, signal) => {
      clearTimeout(timer); clearTimeout(hardKill); children.delete(child); operations.delete(requestId);
      // Return model provenance without relaying machine-local connection diagnostics or auth data.
      let model = /^model:\s*(.+)$/m.exec(diagnostics)?.[1] ?? 'unknown';
      if (command === 'claude') { const decoded = claudeResult(output, code); code = decoded.code; model = decoded.model; output = decoded.output; }
      resolve({ code, signal, timedOut, tooLarge, model, diagnostic: startupDiagnostic(code, diagnostics, output), output: output.slice(0, 8000000) });
    });
    child.stdin.on('error', () => {});
    child.stdin.end(args.prompt);
  });
  return { content: [{ type: 'text', text: `Role: fkit-${args.role}\nRuntime: ${command}\nModel: ${result.model}\nModel requested: ${effectiveSettings(settings, args.role).model ?? '(runtime default)'}\nExit: ${result.code ?? result.signal}\nTimed out: ${result.timedOut}\nTruncated: ${result.tooLarge}\nPrompt: ${path}${result.diagnostic ? `\nStartup: ${result.diagnostic}` : ''}\n\n${result.output || '(No usable role response.)'}` }], isError: result.code !== 0 || result.timedOut || result.tooLarge };
}

input.on('line', async line => {
  let request;
  try {
    request = JSON.parse(line);
    if (questions.respond(request)) return;
    if (request.method === 'notifications/cancelled') {
      questions.cancel(request.params?.requestId);
      const child = operations.get(request.params?.requestId);
      if (child) { child.kill('SIGTERM'); setTimeout(() => child.kill('SIGKILL'), 5000).unref(); }
      return;
    }
    if (!('id' in request)) return;
    let result;
    if (request.method === 'initialize') {
      questions.initialize(request.params?.capabilities);
      if (mode === 'interactive' && !questions.supported && /^[a-z0-9-]+$/.test(runId ?? '')) atomicWrite(root, join(root, '.fkit/state', `owner-form-unavailable-${runId}`), 'No form support; prose questions must wait for owner answers.\n');
      result = { protocolVersion: request.params?.protocolVersion ?? '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'fkit-roles', version: '0.1.0' } };
    }
    else if (request.method === 'ping') result = {};
    else if (request.method === 'tools/list') {
      const promptSchema = { type: 'object', properties: { prompt: { type: 'string', description: 'Scope, context and required output. Include approved plan faithfully where required.' } }, required: ['prompt'], additionalProperties: false };
      const tools = [{ name: 'fkit_skill', description: 'Load one allowed fkit entry using fixed caller identity. Shared lead entries forward; producer/wiki retain execution duties.', annotations: { readOnlyHint: true }, inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Exact fkit skill name' } }, required: ['name'], additionalProperties: false } }];
      if (caller !== 'adversarial-reviewer') tools.push({ name: 'fkit_consult', description: 'Consult a fresh fkit role with its configured model. Workers return decisions to caller. Two hops maximum; no cycles; adversarial is a leaf.', inputSchema: { ...promptSchema, properties: { ...promptSchema.properties, role: { type: 'string', enum: ROLES } }, required: ['role', 'prompt'] } });
      if (caller === 'reviewer') tools.push({ name: 'fkit_adversarial', description: 'Run the reviewer independent read-only second opinion in a fresh context. Does not consume an ordinary consult hop; the adversarial role remains a leaf.', inputSchema: promptSchema });
      if (caller !== 'adversarial-reviewer' && mode === 'interactive' && chain.length === 1) tools.push({ name: 'fkit_ask_owner', description: 'Ask the owner a structured question and wait for the actual response. Choices submit without a comment field; Write another answer opens a separate text question. No inferred approval. Never request credentials.', inputSchema: { type: 'object', properties: { question: { type: 'string' }, options: { type: 'array', items: { type: 'string' }, maxItems: 4 } }, required: ['question'], additionalProperties: false } });
      result = { tools };
    }
    else if (request.method === 'tools/call' && request.params?.name === 'fkit_skill') {
      const name = request.params.arguments?.name;
      if (typeof name !== 'string' || !ownership()[caller].includes(name)) throw Error(`fkit-${caller} cannot load that skill entry`);
      const skill = contained(root, join(root, '.agents/skills', name, 'SKILL.md'));
      result = { content: [{ type: 'text', text: readFileSync(skill, 'utf8') }] };
    }
    else if (request.method === 'tools/call' && request.params?.name === 'fkit_consult') result = await consult(request.params.arguments, false, request.id);
    else if (request.method === 'tools/call' && request.params?.name === 'fkit_adversarial') result = await consult(request.params.arguments, true, request.id);
    else if (request.method === 'tools/call' && request.params?.name === 'fkit_ask_owner') {
      if (caller === 'adversarial-reviewer' || mode !== 'interactive' || chain.length !== 1) throw Error('Only the interactive root session may ask the owner. Return NEEDS-DECISION to the caller.');
      if (questions.supported && /^[a-z0-9-]+$/.test(runId ?? '')) atomicWrite(root, join(root, '.fkit/state', `owner-${runId}`), 'Owner question invoked; an answer is not implied.\n');
      result = { content: [{ type: 'text', text: JSON.stringify(await questions.ask(request.params.arguments, request.id)) }] };
    }
    else { send({ jsonrpc: '2.0', id: request.id, error: { code: -32601, message: 'Unknown method or tool' } }); return; }
    send({ jsonrpc: '2.0', id: request.id, result });
  } catch (error) {
    if (!request) send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Invalid JSON request' } });
    else if ('id' in request) send({ jsonrpc: '2.0', id: request.id, result: { isError: true, content: [{ type: 'text', text: `fkit consult failed: ${error.message}` }] } });
  }
});
function close() {
  if (closing) return;
  closing = true;
  questions.close();
  for (const child of children) { child.kill('SIGTERM'); setTimeout(() => child.kill('SIGKILL'), 5000).unref(); }
}
input.on('close', close);
function shutdown(code) { close(); process.exitCode = code; input.close(); process.stdin.destroy(); }
// Keep the event loop alive for child termination rather than orphaning a slow worker.
process.on('SIGTERM', () => shutdown(0));
process.on('SIGINT', () => shutdown(130));
process.stdout.on('error', error => { if (error.code === 'EPIPE') shutdown(1); else throw error; });
