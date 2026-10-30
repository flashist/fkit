import { existsSync, lstatSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';

export const ROLES = ['lead', 'producer', 'coder', 'reviewer', 'adversarial-reviewer', 'architect', 'wiki'];
export const RUNTIMES = ['codex', 'claude'];
export const EFFORTS = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'];

export function contained(root, path) {
  const base = resolve(root), target = resolve(path), rel = relative(base, target);
  if (rel.startsWith(`..${sep}`) || rel === '..' || rel.startsWith(sep)) throw Error(`Path escapes project: ${path}`);
  let at = base;
  for (const part of ['.', ...rel.split(sep).filter(Boolean)]) {
    if (part !== '.') at = join(at, part);
    try {
      const st = lstatSync(at);
      if (st.isSymbolicLink()) throw Error(`Refusing symlink: ${at}`);
      if (at !== target && !st.isDirectory()) throw Error(`Expected directory: ${at}`);
    } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return target;
}

export function atomicWrite(root, path, text) {
  contained(root, path);
  if (existsSync(path) && !lstatSync(path).isFile()) throw Error(`Expected regular file: ${path}`);
  mkdirSync(dirname(path), { recursive: true });
  const temp = join(dirname(path), `.fkit-${randomUUID()}.tmp`);
  writeFileSync(temp, text, { flag: 'wx', mode: 0o600 });
  renameSync(temp, path);
}

function choice(value, label, partial = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(`${label} must be an object`);
  for (const key of Object.keys(value)) if (!['runtime', 'model', 'reasoningEffort'].includes(key)) throw Error(`Unknown ${label} field: ${key}`);
  if (value.runtime !== undefined && !RUNTIMES.includes(value.runtime)) throw Error(`${label}: runtime must be codex or claude`);
  if (!partial && !RUNTIMES.includes(value.runtime)) throw Error('default.runtime must be codex or claude');
  if (!partial && value.model === undefined) throw Error('default.model is required (null selects the Codex default)');
  if (value.model !== undefined && value.model !== null && (typeof value.model !== 'string' || !value.model.trim() || /[\r\n\0]/.test(value.model))) throw Error(`${label}.model must be a nonempty ID or null`);
  if (value.reasoningEffort != null && !EFFORTS.includes(value.reasoningEffort)) throw Error(`Invalid ${label}.reasoningEffort`);
}

export function validateSettings(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.schemaVersion !== 1) throw Error('Expected model settings schemaVersion 1');
  for (const key of Object.keys(value)) if (!['schemaVersion', 'default', 'roles'].includes(key)) throw Error(`Unknown settings field: ${key}`);
  choice(value.default, 'default');
  if (value.default.runtime === 'claude' && value.default.reasoningEffort !== undefined) throw Error('default.reasoningEffort is currently supported only for Codex');
  if (!value.roles || typeof value.roles !== 'object' || Array.isArray(value.roles)) throw Error('roles must be an object');
  for (const [role, override] of Object.entries(value.roles)) {
    if (!ROLES.includes(role)) throw Error(`Unknown role: ${role}`);
    choice(override, `roles.${role}`, true);
    if (override.runtime && override.runtime !== value.default.runtime && override.model === undefined) throw Error(`roles.${role}: a runtime change requires an explicit model or null`);
  }
  for (const role of ROLES) {
    const resolved = effectiveSettings(value, role);
    if (resolved.runtime === 'claude' && resolved.reasoningEffort !== undefined) throw Error(`${role}: reasoningEffort is currently supported only for Codex`);
  }
  return value;
}

export function settingsPath(root) { return contained(root, join(root, '.fkit/model-settings.json')); }
export function loadSettings(root) {
  const path = settingsPath(root);
  if (!existsSync(path)) throw Error('Model settings missing. Run: fkit-codex configure');
  try { return validateSettings(JSON.parse(readFileSync(path, 'utf8'))); }
  catch (error) { throw Error(`Invalid model settings at ${path}: ${error.message}. Correct this file, then rerun configure.`); }
}
export function saveSettings(root, value) { atomicWrite(root, settingsPath(root), `${JSON.stringify(validateSettings(value), null, 2)}\n`); }
export function effectiveSettings(value, role) {
  if (!ROLES.includes(role)) throw Error(`Unknown role: ${role}`);
  const override = value.roles[role];
  const base = override?.runtime && override.runtime !== value.default.runtime ? { runtime: override.runtime, model: null } : value.default;
  return { ...base, ...override };
}
