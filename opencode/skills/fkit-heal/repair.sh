#!/usr/bin/env bash
set -euo pipefail
here="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
mode="${1:?usage: repair.sh propose|apply [project-root]}"
shift
exec bash "$here/repair-core.sh" "$mode" --share "$here/../../fkit-resources" "$@"
