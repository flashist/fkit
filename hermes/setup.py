"""Publish fkit-owned files into named Hermes profiles, retaining native configuration."""
import fcntl
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
TEAM = json.loads((HERE / "plugin/team.json").read_text())
MARK = ".fkit-profile-v1"


def refresh(directory, role, hermes):
    files = {"SOUL.md": HERE / "roles" / f"fkit-{role}.md",
             "plugins/fkit-roles/carry-check.mjs": HERE.parent / "claude/carry-check-hook.mjs"}
    for name in ("__init__.py", "plugin.yaml", "team.json"):
        files["plugins/fkit-roles/" + name] = HERE / "plugin" / name
    for skill in TEAM[role]:
        relative = f"skills/{skill}/SKILL.md"
        files[relative] = HERE / relative
    plugin_changed = False
    for relative, source in files.items():
        dest = directory / relative
        if dest.resolve() != dest or (dest.exists() and not dest.is_file()):
            raise SystemExit(f"Refusing unexpected path {dest}")
        content = source.read_bytes()
        if source.suffix == ".md":
            launcher = shlex.quote(str(HERE.parent / "bin/fkit"))
            content = content.replace(b"fkit helper ", (launcher + " helper ").encode())
        if dest.exists() and content == dest.read_bytes():
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=dest.parent, delete=False) as tmp:
            tmp.write(content)
        os.replace(tmp.name, dest)
        if relative.startswith("plugins/"):
            plugin_changed = True
    if plugin_changed and (directory / "gateway.lock").exists():
        result = subprocess.run([hermes, "-p", directory.name, "fkit-reload"])
        if result.returncode:
            print(f"Updated {directory.name} on disk. Restart its serving gateway before using the new plugin.", file=sys.stderr)


def initial_settings(hermes):
    def read(key):
        raw = subprocess.check_output([hermes, "config", "get", "--json", key], text=True)
        return json.loads(raw or "null")

    source = read("model")
    if isinstance(source, dict):
        keys = ("provider", "default", "base_url", "api_mode", "context_length")
        model = {key: source[key] for key in keys if source.get(key)}
    else:
        model = {"default": source} if source else {}
    return {
        "_config_version": read("_config_version"),
        "model": model,
        "context_file_max_chars": 40000,
        "plugins": {"enabled": ["fkit-roles"], "isolation": "in_process"},
        # Onboarding can query the wiki, consult the architect, then seed the wiki.
        "delegation": {"backend": "fkit", "max_spawn_depth": 3, "oneshot_max_children": 8},
    }


def setup(hermes):
    home = Path(os.getenv("HERMES_HOME", "~/.hermes")).expanduser().resolve()
    root = home.parent.parent if home.parent.name == "profiles" else home
    directory = root / "profiles"
    directory.mkdir(mode=0o700, parents=True, exist_ok=True)
    with (directory / ".fkit-setup.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        settings = None
        all_skills = set().union(*TEAM.values())
        for role in TEAM:
            profile = directory / f"fkit-{role}"
            if profile.exists() or profile.is_symlink():
                if profile.is_symlink() or not (profile / MARK).is_file():
                    raise SystemExit(f"Profile already exists outside fkit management: {profile}")
                refresh(profile, role, hermes)
                continue
            if settings is None:
                settings = initial_settings(hermes)
            staging = Path(tempfile.mkdtemp(prefix=".fkit-", dir=directory))
            try:
                cfg = dict(settings, skills={"disabled": sorted(all_skills.difference(TEAM[role]))})
                if role == "adversarial-reviewer":
                    cfg["platform_toolsets"] = {"cli": ["terminal", "file", "skills"]}
                (staging / "config.yaml").write_text(json.dumps(cfg, indent=2) + "\n")
                (staging / ".no-bundled-skills").touch()
                (staging / MARK).touch()
                refresh(staging, role, hermes)
                staging.rename(profile)
            finally:
                if staging.exists():
                    shutil.rmtree(staging)
    return directory
