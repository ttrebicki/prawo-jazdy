#!/usr/bin/env bash
# Idempotent Cloud Agent install: verify the TypeScript fullstack toolchain.
# Heavy toolchains are baked into the environment snapshot; this only checks them.
set -euo pipefail

export PATH="/home/ubuntu/.local/npm-global/bin:/usr/local/bin:/usr/local/lib/nodejs/node-v26.13.0/bin:/home/ubuntu/.bun/bin:/home/ubuntu/.deno/bin:/home/ubuntu/.local/bin:${PATH:-}"

need() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "missing required tool: $cmd" >&2
    exit 1
  fi
}

need node
need npm
need yarn
need pnpm
need bun
need deno
need tsc
need tsx
need docker
need git
need aws
need kubectl
need terraform
need psql
need redis-cli
need mongosh

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 26 ]; then
  echo "expected Node >= 26, got $(node -v)" >&2
  exit 1
fi

# If the workspace has a JS package, refresh deps with the preferred lockfile.
if [ -f package-lock.json ]; then
  npm ci
elif [ -f pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile
elif [ -f yarn.lock ]; then
  yarn install --frozen-lockfile
elif [ -f package.json ]; then
  npm install
fi

echo "toolchain ok: node=$(node -v) yarn=$(yarn -v) pnpm=$(pnpm -v) bun=$(bun --version) tsc=$(tsc -v)"
