#!/usr/bin/env bash
# Pre-flight validation for the fkit agent bundles. Omnigent has no `validate`/`lint` CLI —
# a bad config or a bad SKILL.md frontmatter only surfaces (fatally) inside `omnigent run`.
# This catches both before a live run: it YAML-parses every SKILL.md frontmatter (an unquoted
# ": " in a description silently aborts the whole agent) and runs omnigent.spec.load per bundle.
#
# Usage:  omnigent/validate-bundles.sh            # from anywhere; validates omnigent/fkit-*
#         OMNIGENT_PYTHON=/path/to/python omnigent/validate-bundles.sh
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cd "$here/.."                                    # repo root (omnigent/..)
fail=0

echo "== SKILL.md frontmatter (YAML) =="
ruby -ryaml -e '
bad=0
Dir.glob("omnigent/**/SKILL.md").sort.each do |f|
  t = File.read(f)
  if t =~ /\A---\n(.*?)\n---/m
    begin; YAML.load($1); rescue => e; bad += 1; puts "  FAIL #{f}: #{e.message.lines.first.strip}"; end
  end
end
puts "  all SKILL.md frontmatter valid" if bad == 0
exit(bad)
' || fail=1

echo "== omnigent.spec.load per bundle =="
PY="${OMNIGENT_PYTHON:-$HOME/.local/share/uv/tools/omnigent/bin/python}"
if [ -x "$PY" ]; then
  "$PY" - <<'PYEOF' || fail=1
import sys
from pathlib import Path
from omnigent.spec import load
bad = 0
for d in sorted(p for p in Path("omnigent").glob("fkit-*") if p.is_dir()):
    try:
        load(d); print("  ok  ", d)
    except Exception as e:
        bad = 1; print("  FAIL", d, "->", type(e).__name__, str(e).splitlines()[0][:140])
sys.exit(bad)
PYEOF
else
  echo "  (omnigent python not found at $PY — set OMNIGENT_PYTHON to enable; skipping spec.load)"
fi

echo "== vendored query skill drift (ADR-007) =="
ruby -e '
src = File.read("omnigent/fkit-wiki/skills/query/SKILL.md")
targets = %w[fkit-producer fkit-coder fkit-reviewer fkit-architect fkit-adversarial-reviewer]
bad = 0
targets.each do |b|
  f = "omnigent/#{b}/skills/query/SKILL.md"
  if !File.exist?(f)
    bad += 1; puts "  FAIL #{f}: missing"
  elsif File.read(f) != src
    bad += 1; puts "  FAIL #{f}: content differs from omnigent/fkit-wiki/skills/query/SKILL.md (run omnigent/sync-vendored-skills.sh)"
  end
end
puts "  all vendored copies match the canonical source" if bad == 0
exit(bad)
' || fail=1

if [ "$fail" = 0 ]; then echo "ALL BUNDLES VALID"; else echo "VALIDATION FAILED"; exit 1; fi
