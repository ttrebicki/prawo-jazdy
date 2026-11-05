#!/usr/bin/env bash
# Per-boot Cloud Agent start: ensure Docker is available for fullstack work.
set -euo pipefail

if command -v ensure-docker >/dev/null 2>&1; then
  ensure-docker || true
elif command -v service >/dev/null 2>&1; then
  sudo service docker start || true
fi

if [ -S /var/run/docker.sock ]; then
  # Cloud Agent sessions may start before group membership applies.
  sudo chmod 666 /var/run/docker.sock 2>/dev/null || true
fi

if docker info >/dev/null 2>&1; then
  echo "docker ready: $(docker --version)"
else
  echo "warning: docker daemon not ready" >&2
fi
