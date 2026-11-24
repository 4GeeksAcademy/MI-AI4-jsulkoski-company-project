#!/usr/bin/env bash
set -euo pipefail

# Enable Corepack and make pnpm available for JS/TS workspaces.
corepack enable || true
corepack prepare pnpm@latest --activate || true

if [[ -f pyproject.toml ]]; then
	python -m pip install --upgrade pip uv
	uv sync
else
	echo "No root pyproject.toml found; skipping Python dependency sync."
fi

echo "Devcontainer setup complete."
