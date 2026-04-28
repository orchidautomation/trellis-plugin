# Trellis Plugin

Official first-party Pluxx plugin source for Trellis onboarding across Claude Code, Cursor, Codex, and OpenCode.

Trellis gives you the framework.

This plugin gives you the guided user experience on top of it.

## Get The Plugin

If you want to install the plugin and do not care about the source repo, use the GitHub release assets directly:

- [Latest release page](https://github.com/orchidautomation/trellis-plugin/releases/latest)
- [install-claude-code.sh](https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-claude-code.sh)
- [install-cursor.sh](https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-cursor.sh)
- [install-codex.sh](https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-codex.sh)
- [install-opencode.sh](https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-opencode.sh)
- [install-all.sh](https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-all.sh)

Fastest install paths:

```bash
curl -fsSL https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-claude-code.sh | bash
curl -fsSL https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-cursor.sh | bash
curl -fsSL https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-opencode.sh | bash
curl -fsSL https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-codex.sh | bash
curl -fsSL https://github.com/orchidautomation/trellis-plugin/releases/latest/download/install-all.sh | bash
```

This repository is the source project. The installable bundles live under GitHub Releases, not in the root file tree.

## What This Plugin Does

Most noobs should not be forced to learn every environment variable, provider, and deploy step before they can see Trellis work.

That is the problem this plugin solves.

The plugin gives host-native onboarding and operating flows for Trellis:

- create a Trellis app
- explain the active stack
- check readiness and blockers
- connect providers one lane at a time
- connect local or remote MCP
- take a first deployment to production

The goal is simple:

> a noob who vibecoded this into existence can use the Trellis plugin to create and ship a GTM agent to production

That agent might be:

- an AI SDR
- a meeting-prep agent
- an account-research agent
- a customer-success copilot
- a GTM analytics or recommendation workflow

## Source Layout

- `pluxx.config.ts`
- `skills/`
- `scripts/`
- `.github/workflows/`

Generated host bundles are build artifacts and are not checked into git.

## Build Locally

If you have a local Pluxx checkout:

```bash
PLUXX_REPO_DIR=../pluxx ./scripts/build-with-pluxx-checkout.sh
```

If you already have the `pluxx` CLI installed locally:

```bash
pluxx doctor
pluxx lint
pluxx validate
pluxx build --target claude-code cursor codex opencode
```

## CI And Release Automation

- `.github/workflows/ci.yml`
  - clones the Pluxx CLI repo
  - validates and builds the plugin
  - verifies the GitHub release publish plan
  - uploads the raw `dist/` artifact
- `.github/workflows/release.yml`
  - runs on `v*` tags
  - builds the plugin with a checked-out Pluxx CLI
  - runs `pluxx publish --github-release`
  - attaches installer scripts and host bundles to the GitHub Release

## Local Proof

The strongest local proof is:

```bash
PLUXX_REPO_DIR=../pluxx ./scripts/build-with-pluxx-checkout.sh
```

## Notes

- This repository holds the Trellis plugin source, not the Trellis framework itself.
- The Trellis product lives in [orchidautomation/trellis](https://github.com/orchidautomation/trellis).
- Developed by Orchid Labs.
