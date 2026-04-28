---
name: "trellis-connect-providers"
description: "Connect Trellis providers one capability at a time and explain only the next missing piece."
---

# Trellis Connect Providers

Use this skill when a user needs to connect outside services to a Trellis app.

Keep the sequence narrow. Do not push every provider at once.

## Read First

Use:

```bash
npm run ai-sdr -- modules --json
npm run ai-sdr -- check --json
npm run doctor -- --json
```

Also read `ai-sdr.config.ts`.

## Provider Order

Prefer this order:

1. state and runtime
2. research
3. model routing
4. deploy surface
5. one safe signal path
6. discovery
7. enrichment
8. CRM and handoff
9. outbound email

For the noob flow, the minimum core demo set is:

1. `connect state convex`
2. `connect search firecrawl`
3. `connect model-routing vercel-ai-gateway`
4. deploy
5. connect remote MCP
6. run one safe signal

## Commands

Use the CLI as the contract:

```bash
npm run ai-sdr -- connect <capability> <provider> --json
```

Examples:

```bash
npm run ai-sdr -- connect state convex --json
npm run ai-sdr -- connect search firecrawl --json
npm run ai-sdr -- connect model-routing vercel-ai-gateway --json
npm run ai-sdr -- connect enrichment prospeo --json
npm run ai-sdr -- connect source apify --json
npm run ai-sdr -- connect crm attio --json
npm run ai-sdr -- connect email agentmail --json
```

## Explain Providers Plainly

- Convex = state
- Firecrawl = search and extraction
- Vercel AI Gateway = model routing
- Apify = discovery
- Parallel = deep research and monitors
- Prospeo = enrichment
- Attio = CRM
- AgentMail = outbound email
- Slack = handoff
- Rivet = actors
- Vercel Sandbox = isolated agent execution

## Noob Rule

After each provider step:

1. say what the provider does
2. say the missing env keys
3. rerun `doctor`
4. tell the user only the next blocker

Use explicit handoffs:

- `Next: fill .env`
- `Next: run doctor`
- `Next: deploy`
- `Next: connect remote MCP`

## Safe Demo Rule

For the reference AI SDR, stop after the minimum demo set until the user has:

- deployed the app
- verified `/healthz`
- verified `/dashboard`
- connected remote MCP
- ingested one signal safely

Do not push discovery automation or real send providers before that point unless the user explicitly asks.
