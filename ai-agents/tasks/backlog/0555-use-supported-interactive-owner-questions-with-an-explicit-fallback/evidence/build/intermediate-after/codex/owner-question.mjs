import { randomUUID } from 'node:crypto';

export class OwnerQuestions {
  constructor(send) { this.send = send; this.pending = new Map(); this.supported = false; }
  initialize(capabilities) {
    const elicitation = capabilities?.elicitation;
    const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    this.supported = object(elicitation) && (Object.keys(elicitation).length === 0 || object(elicitation.form));
  }
  respond(message) {
    const waiting = this.pending.get(message.id);
    if (!waiting) return false;
    this.pending.delete(message.id);
    if (message.error) waiting.reject(Error('Owner question delivery failed or is unverified; no answer or approval was received. State the limitation, list the decision and choices explicitly, and wait.'));
    else waiting.resolve(message.result);
    return true;
  }
  async ask(args, requestId) {
    if (!this.supported) throw Error('This session exposes no usable automatic owner dialogue: the client does not advertise MCP form support. State the decision and choices explicitly and wait; no approval was received.');
    if (!args || typeof args.question !== 'string' || !args.question.trim() || args.question.length > 8000) throw Error('Expected a concise owner question');
    const options = args.options ?? [];
    if (!Array.isArray(options) || options.length > 4 || options.some(x => typeof x !== 'string' || !x.trim() || x.length > 1000) || new Set(options).size !== options.length) throw Error('Expected up to four distinct answer options');
    const custom = 'Write another answer';
    if (options.includes(custom)) throw Error('Write another answer is reserved for custom responses');
    const answer = { type: 'string', title: 'Your answer' };
    if (options.length) answer.enum = [...options, custom];
    // This CLI cannot submit an empty optional text field, so only request text when needed.
    const request = (field, message) => new Promise((resolve, reject) => {
      const id = `fkit-owner-${randomUUID()}`;
      this.pending.set(id, { resolve, reject, requestId });
      try {
        this.send({ jsonrpc: '2.0', id, method: 'elicitation/create', params: { mode: 'form', message, requestedSchema: { type: 'object', properties: { answer: field }, required: ['answer'] } } });
      } catch {
        this.pending.delete(id);
        reject(Error('Owner question delivery failed or is unverified; ask explicitly and wait. No answer or approval was received.'));
      }
    });
    const result = await request(answer, args.question);
    if (!['accept', 'cancel', 'decline'].includes(result?.action)) throw Error('Invalid owner response; delivery is unverified and no answer or approval may be inferred. Keep dependent work stopped.');
    if (result.action !== 'accept') return { action: result.action, answered: false, instruction: 'No approval or answer received. Keep dependent work stopped.' };
    const content = result.content;
    if (!content || typeof content.answer !== 'string' || !content.answer.trim() || (answer.enum && !answer.enum.includes(content.answer))) throw Error('Invalid owner response; no approval may be inferred');
    let comment = '';
    if (options.length && content.answer === custom) {
      const text = await request({ type: 'string', title: 'Write your answer', minLength: 1 }, args.question);
      if (!['accept', 'cancel', 'decline'].includes(text?.action)) throw Error('Invalid custom owner response; delivery is unverified and no answer or approval may be inferred. Keep dependent work stopped.');
      if (text.action !== 'accept') return { action: text.action, answered: false, instruction: 'No custom answer or approval received. Keep dependent work stopped.' };
      if (typeof text.content?.answer !== 'string' || !text.content.answer.trim()) return { action: 'accept', answered: false, instruction: 'No custom answer received. Clarify; keep dependent work stopped.' };
      comment = text.content.answer;
    }
    return { action: 'accept', answered: true, answer: content.answer, comment, instruction: 'Relay exactly. A question, request for explanation, or alternative is not approval of a plan.' };
  }
  close() {
    for (const pending of this.pending.values()) pending.reject(Error('Owner question interrupted; no answer or approval was received'));
    this.pending.clear();
  }
  cancel(requestId) {
    for (const [id, pending] of this.pending) {
      if (pending.requestId !== requestId) continue;
      this.pending.delete(id);
      pending.reject(Error('Owner question canceled; no answer or approval was received'));
    }
  }
}
