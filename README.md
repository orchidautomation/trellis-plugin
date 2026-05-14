# Trellis Plugin

Official first-party Pluxx plugin source for Trellis onboarding across Claude Code, Cursor, Codex, and OpenCode.

Trellis is now Cloudflare-first. The plugin should treat Cloudflare Workers, D1, R2, Queues, Workflows, Durable Objects, Workers AI, AI Gateway, and the Trellis MCP route as the default path. Convex and Vercel are not part of the current first-run flow.

The Trellis framework and CLI do the real work. This plugin is the guided layer that helps a coding host choose the next correct command, diagnose blockers, and avoid unsafe provider activation before the Cloudflare app is proven.

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

This repository is the source project. Installable host bundles live under GitHub Releases.

## What This Plugin Does

The plugin gives host-native onboarding and operating flows for Trellis:

- create a Cloudflare-first Trellis app
- explain the active Worker, D1, R2, Queue, Workflow, AI Gateway, provider, MCP, and trace surfaces
- check readiness and route the user to the next blocker
- connect providers after the first Cloudflare proof
- connect local or remote MCP
- deploy and verify the Worker
- keep no-send and approval gates intact

The goal is simple: a first-time user can create and ship a GTM agent to Cloudflare production without memorizing the Trellis CLI.

That agent might be:

- an AI SDR
- a meeting-prep agent
- an account-research agent
- a customer-success copilot
- a GTM analytics or recommendation workflow

## Cloudflare-First Runbook

The intended path is the same in every host:

1. install the host bundle
2. create a Trellis app
3. use Node 22
4. install dependencies
5. authenticate Cloudflare
6. run doctor
7. run local smoke
8. deploy to Cloudflare
9. verify Cloudflare locally and then live
10. connect remote MCP
11. run one safe signal
12. only then add optional providers or sends

Canonical commands inside a generated app:

```bash
npm install
npm run cf:login
npm run doctor -- --json
npm run smoke -- --json
npm run deploy -- --json
npm run verify -- --json
```

Live verification after deploy:

```bash
npm run verify -- --live --url https://<worker>.workers.dev --api-key "$TRELLIS_API_KEY"
```

Safe live agent exercise:

```bash
npm run verify -- --live --url https://<worker>.workers.dev --api-key "$TRELLIS_API_KEY" --exercise-agent
```

## Create App

Underlying CLI contract:

```bash
npm run trellis -- init ../my-trellis-agent --name my-trellis-agent --json
```

Then:

```bash
cd ../my-trellis-agent
nvm use 22
npm install
npm run cf:login
```

`trellis init` emits the Cloudflare scaffold by default:

- `src/agent.ts` with Trellis-only app logic
- `src/index.ts` Worker wrapper
- `src/trellis-runtime.ts` hidden Cloudflare runtime adapter
- `wrangler.jsonc`
- D1 binding: `TRELLIS_DB`
- R2 bindings: `TRELLIS_PACKS`, `TRELLIS_ARTIFACTS`
- Queue binding: `TRELLIS_EVENTS`
- Workflow binding: `PROSPECT_WORKFLOW`
- AI binding: `AI`
- Browser binding: `BROWSER`
- `knowledge/**/*.md`
- `skills/**/SKILL.md`

## Cloudflare Env And Secrets

The first deploy only requires Cloudflare auth through `wrangler login` or `CLOUDFLARE_ACCOUNT_ID` plus `CLOUDFLARE_API_TOKEN`.

Set these after the app exists:

```bash
npx wrangler secret put TRELLIS_API_KEY
npx wrangler secret put TRELLIS_WEBHOOK_SECRET
```

Provider credentials come after first boot:

```bash
npm run trellis -- connect firecrawl --json
npm run trellis -- connect attio --json
npm run trellis -- connect agentmail --json
npm run trellis -- connect apify --json
npm run trellis -- connect prospeo --json
npm run trellis -- connect langfuse --json
npm run trellis -- connect braintrust --json
```

Each `connect` guide writes a non-secret manifest under `.trellis/providers/` and tells the user which Cloudflare Worker secrets to set with `npx wrangler secret put`.

## Knowledge And Skills

Deploy auto-packs the default `knowledge/**/*.md` files and tracked `SKILL.md` files into `TRELLIS_PACKS`.

Use explicit docs packing when needed:

```bash
npm run trellis -- docs add ./product-docs
npm run deploy -- --json
```

The Worker hydrates R2-backed markdown packs into bounded Flue/Trellis context. Do not tell users to paste product docs into prompts.

## MCP

The MCP route is:

```text
/mcp/trellis
```

Local endpoint:

```text
http://localhost:3000/mcp/trellis
```

Deployed endpoint:

```text
${APP_URL}/mcp/trellis
```

The Trellis CLI currently writes Claude Code MCP config directly:

```bash
npm run trellis -- mcp claude-code --local --write --json
npm run trellis -- mcp claude-code --remote --write --json --url "${APP_URL}/mcp/trellis" --token "$TRELLIS_API_KEY"
```

For Cursor, Codex, and OpenCode, use the same flat HTTP MCP shape in the host's native config:

```json
{
  "mcpServers": {
    "trellis": {
      "type": "http",
      "url": "https://<worker>.workers.dev/mcp/trellis",
      "headers": {
        "Authorization": "Bearer <TRELLIS_API_KEY>"
      }
    }
  }
}
```

Do not write a nested transport block.

## Safe Demo Rule

Do not push discovery automation or outbound sends before this is true:

- `npm run doctor -- --json` passes or has only optional provider warnings
- `npm run smoke -- --json` passes
- `npm run deploy -- --json` succeeds
- `npm run verify -- --json` passes local Cloudflare checks
- `npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"` passes live checks
- `/healthz` is healthy
- `/mcp/trellis` is reachable with auth
- the dashboard is reachable with auth when `TRELLIS_API_KEY` is configured
- one safe signal has been exercised only if the user accepts that it may invoke the live Flue/Cloudflare harness

Outbound writes remain gated by Trellis approval and no-send behavior until explicitly configured otherwise.

## What The Plugin Owns

The plugin owns:

- guided onboarding
- host-native install and setup
- Cloudflare deploy sequencing
- provider sequencing
- MCP connection flow
- first-run explanations
- readiness triage

The plugin does not own:

- Trellis runtime logic
- app business logic
- workflow implementation
- provider implementations
- Cloudflare resource implementation

Those belong to the Trellis framework, the generated app, and Cloudflare.

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
pluxx test --target claude-code cursor codex opencode
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

## Notes

- This repository holds the Trellis plugin source, not the Trellis framework itself.
- The Trellis product lives in [orchidautomation/trellis](https://github.com/orchidautomation/trellis).
- Developed by Orchid Labs.
