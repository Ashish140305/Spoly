import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const backendDir = join(root, "spoly.Backend");
const frontendDir = join(root, "spoly.Frontend");
const backendPython = process.platform === "win32"
  ? join(backendDir, "venv", "Scripts", "python.exe")
  : join(backendDir, "venv", "bin", "python");
const python = existsSync(backendPython) ? backendPython : "python";
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [];

function start(name, command, args, cwd) {
  const child = spawn(command, args, { cwd, stdio: "inherit", shell: false });
  child.on("error", (error) => {
    console.error(`${name} could not start: ${error.message}`);
    shutdown(1);
  });
  child.on("exit", (code) => {
    if (!stopping) {
      console.error(`${name} stopped with code ${code ?? "unknown"}.`);
      shutdown(code ?? 1);
    }
  });
  children.push(child);
}

let stopping = false;
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach((child) => child.kill());
  process.exitCode = code;
}

process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());

start("Backend", python, ["-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8000", "--reload"], backendDir);
start("Frontend", npm, ["run", "dev", "--", "--host", "127.0.0.1"], frontendDir);
