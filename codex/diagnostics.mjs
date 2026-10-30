// Child stderr may contain credentials or private endpoints; relay only recognized error categories.
export function startupDiagnostic(code, stderr, output) {
  if (code === 0 || output.trim()) return null;
  if (/error: the argument '--approve-for-me' cannot be used with '--sandbox/.test(stderr)) return 'CLI argument conflict: --approve-for-me already selects workspace-write; omit --sandbox.';
  if (/unexpected argument|unrecognized (?:option|argument)/i.test(stderr)) return 'CLI rejected a launch argument. Check the installed Codex version and launcher compatibility.';
  if (/error (?:loading|parsing)|failed to (?:load|parse).*config|invalid.*configuration/i.test(stderr)) return 'Codex could not load its configuration. Inspect configuration locally; private diagnostics were withheld.';
  if (/required.*mcp|mcp.*required|mcp.*failed to (?:start|initialize)/i.test(stderr)) return 'A required MCP server failed to initialize. Inspect local server configuration; private diagnostics were withheld.';
  return 'Codex returned no usable response. Run a bounded direct launch to inspect startup locally; private diagnostics were withheld.';
}
