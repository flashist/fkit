import { spawnSync } from 'node:child_process';
import { EFFORTS, ROLES, effectiveSettings } from './settings.mjs';

export function parseCatalog(data) {
  const entries = Array.isArray(data) ? data : data?.models;
  if (!Array.isArray(entries)) throw Error('Unrecognized Codex model catalog');
  const models = new Map();
  for (const item of entries) {
    if (!item || typeof item !== 'object') continue;
    const id = item.slug ?? item.id ?? item.model;
    if (typeof id !== 'string' || !id.trim() || /[\r\n\0]/.test(id) || ['hide', 'hidden'].includes(item.visibility)) continue;
    const name = item.display_name ?? item.displayName ?? id;
    const levels = item.supported_reasoning_levels ?? item.supportedReasoningEfforts;
    const efforts = Array.isArray(levels) ? [...new Set(levels.map(level => typeof level === 'string' ? level : level?.effort ?? level?.reasoningEffort).filter(level => EFFORTS.includes(level)))] : undefined;
    models.set(id, { id, name: String(name).replace(/[\x00-\x1f\x7f]/g, ' '), ...(efforts ? { efforts } : {}) });
  }
  return [...models.values()];
}

export function modelCatalog() {
  // Discovery should help setup, never prevent an owner from entering an exact model ID.
  const result = spawnSync('codex', ['debug', 'models'], { encoding: 'utf8', maxBuffer: 10000000, timeout: 10000 });
  if (result.error || result.status !== 0) return { models: [], available: false };
  try { return { models: parseCatalog(JSON.parse(result.stdout)), available: true }; }
  catch { return { models: [], available: false }; }
}

export function modelAnswer(answer, previous, models) {
  const text = answer.trim();
  if (!text) return previous;
  if (text === 'default') return null;
  if (/^\d+$/.test(text)) {
    const model = models[Number(text) - 1];
    if (!model) throw Error('Invalid model number; rerun configure or enter an exact model ID');
    return model.id;
  }
  return text;
}

export function effortChoices(model, models) {
  return models.find(item => item.id === model)?.efforts;
}

export function effortAnswer(answer, previous, choices, role = false) {
  const text = answer.trim();
  if (!text) return previous;
  if (text === 'default') return null;
  if (role && text === 'inherit') return undefined;
  const effort = /^\d+$/.test(text) ? choices[Number(text) - 1] : text;
  if (!effort || !choices.includes(effort)) throw Error(`Invalid reasoning effort; choose ${choices.join(', ') || 'default'}`);
  return effort;
}

export function validateEfforts(value, models) {
  for (const [label, choice] of [['default', value.default], ...ROLES.map(role => [role, effectiveSettings(value, role)])]) {
    const choices = effortChoices(choice.model, models);
    if (choice.runtime === 'codex' && choice.reasoningEffort != null && choices && !choices.includes(choice.reasoningEffort)) throw Error(`${label}: ${choice.model} does not support reasoning effort ${choice.reasoningEffort}; choose ${choices.join(', ') || 'default'}`);
  }
}

export function printCatalog(catalog) {
  if (!catalog.available || !catalog.models.length) {
    console.log('Model catalog unavailable or empty. Enter an exact model ID, or default for the runtime default.');
    return;
  }
  console.log('Local Codex model catalog (account access is verified when invoked):');
  catalog.models.forEach((model, index) => console.log(`${index + 1}. ${model.name} — ${model.id}`));
  console.log('Choose a number or exact ID; default follows the Codex model default.');
}
