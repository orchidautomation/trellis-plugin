# Trellis Plugin

Official first-party Pluxx plugin source for Trellis onboarding across Claude Code, Cursor, Codex, and OpenCode.

Trellis gives you the framework and CLI.

This plugin is the guided layer on top of that CLI. It is not the product logic. It is the host-native setup and operating experience for people who do not want to memorize every Trellis command on day one.

## Get The Plugin

If you want to install the plugin and do not care about the source repo, use the GitHub release assets directly.

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

Install target matrix:

- Claude Code -> `install-claude-code.sh`
- Cursor -> `install-cursor.sh`
- Codex -> `install-codex.sh`
- OpenCode -> `install-opencode.sh`
- all four -> `install-all.sh`

This repository is the source project. The installable host bundles live under GitHub Releases, not in the root file tree.

## What This Plugin Does

Most users should not have to learn every environment variable, provider, and deploy step before they can see Trellis work.

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

## First Run

The intended noob path is the same in every host:

1. install the host bundle
2. create app
3. fill env
4. run doctor and get local smoke mode green
5. deploy
6. connect remote MCP
7. run one safe demo

The plugin should guide that flow. The Trellis CLI does the actual work underneath.

### 1. Install The Plugin

Pick your host and run the matching install script from the release page.

### 2. Create App

The plugin should drive the Trellis scaffold first.

Underlying CLI contract:

```bash
npm run ai-sdr -- init ../my-trellis-agent --name my-trellis-agent --json
```

If you want the full AI SDR reference recipe:

```bash
npm run ai-sdr -- init ../my-ai-sdr --name my-ai-sdr \
  --with-discovery \
  --with-deep-research \
  --with-enrichment \
  --with-crm \
  --with-email \
  --with-handoff \
  --json
```

Then:

```bash
cd ../my-ai-sdr
npm install
cp .env.example .env
```

### 3. Fill Env

The plugin should drive the user to the smallest env needed for a first proof before it asks for optional lanes.

Minimum local proof:

```bash
TRELLIS_LOCAL_SMOKE_MODE=true
TRELLIS_SANDBOX_TOKEN=local-sandbox-token
HANDOFF_WEBHOOK_SECRET=local-handoff-secret
DISCOVERY_LINKEDIN_ENABLED=false
NO_SENDS_MODE=true
```

### 4. Run Doctor And Get Local Smoke Mode Green

The plugin should not dump every possible variable up front. It should run the checks, then tell the user only the next blocker.

Underlying CLI contract:

```bash
npm run ai-sdr -- check --json
npm run doctor -- --json
```

Then:

```bash
npm run doctor -- --json
npm run doctor
npm run dev
```

Local proof success:

- `/healthz` returns ok
- `/dashboard` loads
- the operator surface is reachable

That still does not prove hosted deploy, remote MCP, or send safety.

### 5. Deploy

The plugin should guide a noob through one canonical hosted path, not every possible path.

Underlying CLI contract:

```bash
npm run ai-sdr -- connect state convex --json
npm run ai-sdr -- connect search firecrawl --json
npm run ai-sdr -- connect model-routing vercel-ai-gateway --json
npm run ai-sdr -- deploy vercel --json
```

Current preferred path:

1. Convex
2. Firecrawl
3. Vercel AI Gateway
4. Vercel for app hosting

Underlying commands:

```bash
npx convex dev
npx convex deploy
vercel login
vercel
vercel --prod
npm run ai-sdr -- deploy vercel --json
```

Hosted proof is not complete until:

- the deploy succeeds
- `${APP_URL}/healthz` is healthy
- `${APP_URL}/dashboard` loads

### 6. Connect Remote MCP

After deploy and hosted checks, the plugin should wire the host to the deployed Trellis app over MCP.

Underlying CLI contract:

```bash
npm run ai-sdr -- mcp claude-code --remote --write --json
```

Swap `claude-code` for `cursor`, `codex`, or `opencode` as needed.

The remote MCP endpoint is usually:

```text
${APP_URL}/mcp/trellis
```

### 7. Run One Safe Demo

The first demo should be constrained:

- `NO_SENDS_MODE=true`
- run `npm run demo:smoke` first
- after deploy, run `npm run demo:check -- --base-url "$APP_URL" --dashboard-password "$DASHBOARD_PASSWORD" --mcp-token "$TRELLIS_MCP_TOKEN" --signal-secret "$SIGNAL_WEBHOOK_SECRET"`
- one signal or one input
- state visible in dashboard
- same state visible through MCP
- no discovery automation or outbound sends unless the user explicitly asks
- inspect the result in dashboard or MCP before enabling more lanes

That proves the loop without turning the first run into a production blast radius.

## What The Plugin Owns

The plugin owns:

- guided onboarding
- host-native install and setup
- provider sequencing
- deploy sequencing
- MCP connection flow
- first-run explanations

The plugin does not own:

- Trellis runtime logic
- app business logic
- workflow implementation
- provider implementations

Those belong to the Trellis framework and the app itself.

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

## Release Model

GitHub Releases are the distribution surface.

Each tagged release builds host bundles for:

- Claude Code
- Cursor
- Codex
- OpenCode

and publishes:

- host bundles
- install scripts
- release manifest
- checksums

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

Then verify:

```bash
pluxx lint
pluxx validate
```

## Notes

- This repository holds the Trellis plugin source, not the Trellis framework itself.
- The Trellis product lives in [orchidautomation/trellis](https://github.com/orchidautomation/trellis).
- Developed by Orchid Labs.
