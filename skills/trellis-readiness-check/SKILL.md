---
name: "trellis-readiness-check"
description: "Diagnose what is missing before a Trellis Cloudflare app can boot, deploy, or verify live."
---

# Trellis Readiness Check

Use this skill when the user wants to know what is missing before Trellis can run.

## Required Commands

Prefer JSON:

```bash
npm run doctor -- --json
npm run verify -- --json
```

If the user is not in a generated app but has the CLI script:

```bash
npm run trellis -- doctor --json
npm run trellis -- verify cloudflare --json
```

## Classify Blockers

Group blockers into:

- Cloudflare auth blockers
- scaffold shape blockers
- binding blockers
- local smoke blockers
- pack sync blockers
- deploy blockers
- live route blockers
- optional provider blockers

Do not dump the full environment matrix unless the user asks for it.

## Default First Proof

The fastest proof is:

```bash
nvm use 22
npm install
npm run cf:login
npm run doctor -- --json
npm run smoke -- --json
npm run verify -- --json
```

Success means:

- the Cloudflare scaffold shape is valid
- `wrangler.jsonc` has the expected bindings
- local smoke runs through the safe fixture
- pack sync has a valid R2 plan
- D1/R2/Queue/Workflow posture can be resolved or provisioned

That does not prove:

- deployed Worker health
- live MCP auth
- live safe signal ingest
- provider credentials
- outbound send safety

## Live Proof

After deploy:

```bash
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"
```

Only run a live agent exercise when the user accepts that it may use one model call:

```bash
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY" --exercise-agent
```

For Attio provider smoke:

```bash
npm run verify -- --live --url "$APP_URL" --attio-smoke --provider-smoke-token "$TRELLIS_PROVIDER_SMOKE_TOKEN"
```

## Common Blocker Messages

Use precise next-step language:

- `Blocked: run npm run cf:login or set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN`
- `Blocked: TRELLIS_DB binding is missing from wrangler.jsonc`
- `Blocked: TRELLIS_PACKS bucket_name is missing from wrangler.jsonc`
- `Blocked: PROSPECT_WORKFLOW binding is missing from wrangler.jsonc`
- `Blocked: set TRELLIS_API_KEY as a Worker secret before protected remote checks`
- `Next: run npm run deploy -- --json so Trellis can provision D1, R2, Queues, Workflows, and sync packs`
- `Later: connect FIRECRAWL_API_KEY after the Cloudflare app is alive`

## Noob Rule

Only tell the user the next missing step. Do not switch them into provider setup until doctor, smoke, deploy, and Cloudflare verification are green enough to trust.
