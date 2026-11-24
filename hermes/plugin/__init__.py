import json
import subprocess
from pathlib import Path

from agent.delegation_provider import DelegationProvider, DelegationRouteError
from hermes_constants import get_hermes_home


HERE = Path(__file__).parent
TEAM = json.loads((HERE / "team.json").read_text())


class FkitRoles(DelegationProvider):
    @property
    def name(self):
        return "fkit"

    def task_parameters(self, config):
        return {"fkit_role": {"type": "string", "enum": list(TEAM),
                              "description": "Role responsible for this unit of work."}}

    def description(self, config):
        return "Choose fkit_role for every task. Each runs in that role's Hermes profile."

    def route_task(self, task, config):
        role = task.get("fkit_role")
        if role not in TEAM:
            raise DelegationRouteError("Choose a named fkit_role before delegating.")
        return {"profile": f"fkit-{role}", "label": role}


def check_handoffs(args, task_id):
    # A gateway can serve several projects from one process. Read the same
    # workspace that Hermes file tools use for this particular tool call.
    from tools.file_tools_paths import _resolve_path_for_task
    from tools.terminal_tool import record_session_cwd

    tasks = args.get("tasks") or [args]
    directory = Path(_resolve_path_for_task(".", task_id or "default"))
    root = next((p for p in (directory, *directory.parents)
                 if (p / "ai-agents").is_dir()), None)
    if root is None:
        return {"action": "block", "message": "No fkit project at this task's working directory. Open the project with fkit first."}
    # Hermes seeds a profile-routed child from the parent's recorded terminal cwd.
    # A workspace registered by --in can exist before that record does.
    if task_id:
        record_session_cwd(task_id, str(root))
    forwarded = []
    for task in tasks:
        context = str(task.get("context") or "")
        prompt = "\n".join((str(task.get("goal") or ""), context))
        if "plan:" in prompt and "blob" in prompt:
            payload = {"cwd": str(root), "tool_name": "Agent", "tool_input": {"prompt": prompt}}
            try:
                check = subprocess.run(["node", str(HERE / "carry-check.mjs")], input=json.dumps(payload),
                                       text=True, stdout=subprocess.PIPE, check=True, timeout=10)
                if check.stdout.strip():
                    reason = json.loads(check.stdout)["hookSpecificOutput"]["permissionDecisionReason"]
                    return {"action": "block", "message": f"Plan handoff in {root}: {reason}"}
            except (OSError, ValueError, KeyError, subprocess.SubprocessError) as exc:
                return {"action": "block", "message": f"Could not verify this plan handoff: {exc}"}
        location = (f"fkit project directory: {root}\nUse this absolute directory as terminal workdir "
                    "and anchor all project file paths here. Read its AGENTS.md. "
                    "If it is inaccessible, return the error to the parent.")
        forwarded.append(dict(task, context=location + "\n\n" + context))
    replacement = {"tasks": forwarded} if "tasks" in args else {"context": forwarded[0]["context"]}
    return {"action": "modify", "args": replacement}


def guard(tool_name, args, **kwargs):
    profile = get_hermes_home()
    role = profile.name.removeprefix("fkit-")
    if role not in TEAM or profile.name != "fkit-" + role or not (profile / ".fkit-profile-v1").is_file():
        return None
    if role == "adversarial-reviewer" and tool_name not in {
        "read_file", "search_files", "terminal", "process", "skill_view", "skills_list"
    }:
        return {"action": "block", "message": "The adversarial reviewer returns findings only."}
    if tool_name == "delegate_task":
        return check_handoffs(args, kwargs.get("task_id"))
    if tool_name == "skill_view":
        name = args.get("name", "").split("/")[-1]
        if name.startswith("fkit-") and name not in TEAM.get(role, []):
            return {"action": "block", "message": f"Delegate {name} to its owning fkit role."}


def reload_profile(args):
    from hermes_cli.plugins_activation import reload_running_gateway
    reply = reload_running_gateway()
    if not reply or not reply.get("reloaded"):
        raise SystemExit("Gateway did not confirm the reload. Restart the gateway serving this profile after active work finishes.")
    print(f"Reloaded fkit plugin in {get_hermes_home().name}.")


def register(ctx):
    ctx.register_cli_command(name="fkit-reload", help="Reload this profile’s gateway plugins",
                             setup_fn=lambda parser: None, handler_fn=reload_profile)
    ctx.register_delegation_provider(FkitRoles())
    ctx.register_hook("pre_tool_call", guard)
