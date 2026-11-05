# TypeScript fullstack Cloud Agent environment

This repository ships a Cloud Agent environment with a broad TypeScript fullstack toolchain preinstalled.

## Toolchain (defaults)

| Area | Tools |
| --- | --- |
| Node | **26.13.0** default (`/usr/local`), plus nvm **24** and **22** for switching |
| Package managers | npm, Yarn Classic, pnpm |
| Runtimes | Bun, Deno |
| JS/TS CLIs | TypeScript, tsx, ESLint, Prettier, Turbo, Nest CLI, Prisma, Vercel CLI, Wrangler, Playwright |
| Containers | Docker Engine + Compose (`ensure-docker` / boot `start`) |
| Cloud / infra | AWS CLI v2, kubectl, Terraform |
| Data clients | `psql`, `redis-cli`, `mongosh`, `sqlite3` |
| Shell utilities | `fd`, `bat`, `fzf`, HTTPie, `jq`, `rg`, `tree` |

Git is assumed to already be present on the base image and is not reinstalled by this setup.

## Local / agent commands

```bash
# Verify toolchain (also the Cloud Agent install script)
./scripts/cloud-agent-install.sh

# Ensure Docker is up (also the Cloud Agent start script)
./scripts/cloud-agent-start.sh
```

Switch Node with nvm when needed:

```bash
source ~/.nvm/nvm.sh
nvm use 24   # or 22 / 26
```

## Notes

- Prefer project-local dependencies over globals for app work; globals are for scaffolding and one-off CLIs.
- Docker may need `./scripts/cloud-agent-start.sh` (or `ensure-docker`) after boot.
