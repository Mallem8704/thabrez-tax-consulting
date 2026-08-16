#!/usr/bin/env node
/**
 * infra/dev.mjs
 *
 * Starts docker-compose (Postgres + Redis), waits for both containers to be
 * healthy, then launches all three apps via `turbo dev` in parallel.
 *
 * Run via:  pnpm dev   (defined in root package.json)
 */

import { spawnSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const composeFile = path.join(__dirname, 'docker-compose.yml');

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  process.stdout.write(`\x1b[36m[dev]\x1b[0m ${msg}\n`);
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  return result.status ?? 1;
}

function isDockerRunning() {
  const result = spawnSync('docker', ['info'], { stdio: 'pipe', shell: true });
  return result.status === 0;
}

function getContainerHealth(name) {
  const result = spawnSync(
    'docker',
    ['inspect', '--format', '{{.State.Health.Status}}', name],
    { stdio: 'pipe', shell: true },
  );
  return result.stdout?.toString().trim() ?? 'unknown';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealthy(containers, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const statuses = containers.map((c) => ({ name: c, status: getContainerHealth(c) }));
    const allHealthy = statuses.every((s) => s.status === 'healthy');
    if (allHealthy) return true;
    const pending = statuses.filter((s) => s.status !== 'healthy');
    log(`Waiting for: ${pending.map((s) => `${s.name} (${s.status})`).join(', ')}...`);
    await sleep(3000);
  }
  return false;
}

// ─── Main ───────────────────────────────────────────────────────────────────

(async () => {
  // 1. Sanity check — .env must exist
  const envFile = path.join(root, '.env');
  if (!existsSync(envFile)) {
    process.stderr.write(
      '\x1b[31m[dev] ERROR:\x1b[0m .env not found. Run:\n' +
        '  cp .env.example .env\n' +
        'Then fill in real values.\n',
    );
    process.exit(1);
  }

  // 2. Confirm Docker is running
  if (!isDockerRunning()) {
    process.stderr.write(
      '\x1b[31m[dev] ERROR:\x1b[0m Docker is not running. Start Docker Desktop first.\n',
    );
    process.exit(1);
  }

  // 3. Start containers (idempotent — safe to run if already up)
  log('Starting Postgres + Redis via docker compose...');
  const composeStatus = run('docker', ['compose', '-f', composeFile, 'up', '-d', '--wait'], {
    cwd: root,
  });

  if (composeStatus !== 0) {
    // --wait isn't available in older Docker versions — fall back to manual health check
    log('docker compose --wait not supported, polling health manually...');
    run('docker', ['compose', '-f', composeFile, 'up', '-d'], { cwd: root });
    const healthy = await waitForHealthy(['thabrez_postgres', 'thabrez_redis']);
    if (!healthy) {
      process.stderr.write('\x1b[31m[dev] ERROR:\x1b[0m Containers did not become healthy in 60s.\n');
      process.exit(1);
    }
  }

  log('✓ Postgres and Redis are healthy.');

  // 4. Launch all apps concurrently via turbo
  log('Starting web (3000), admin (3001), and api (4000) via turbo dev...\n');

  const turbo = spawn('pnpm', ['turbo', 'run', 'dev', '--parallel'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });

  // Forward signals so Ctrl+C kills turbo and its children
  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => {
      turbo.kill(sig);
      process.exit(0);
    });
  }

  turbo.on('exit', (code) => process.exit(code ?? 0));
})();
