---
name: "trellis-connect-providers"
description: "Connect Trellis providers one capability at a time and explain only the next missing piece."
---

# Trellis Connect Providers

Use this skill when a user needs to connect outside services to a Trellis app.

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
3. discovery
4. enrichment
5. CRM and handoff
6. outbound email

## Commands

Use the CLI as the contract:

```bash
npm run ai-sdr -- connect <capability> <provider> --json
```

Examples:

```bash
npm run ai-sdr -- connect state convex --json
npm run ai-sdr -- connect source apify --json
npm run ai-sdr -- connect search firecrawl --json
npm run ai-sdr -- connect enrichment prospeo --json
npm run ai-sdr -- connect crm attio --json
npm run ai-sdr -- connect email agentmail --json
```

## Explain Providers Plainly

- Convex = state
- Apify = discovery
- Firecrawl = search and extraction
- Parallel = deep research and monitors
- Prospeo = enrichment
- Attio = CRM
- AgentMail = outbound email
- Slack = handoff
- Rivet = actors
- Vercel Sandbox = isolated agent execution
- Vercel AI Gateway = model routing

## Noob Rule

After each provider step:

1. say what the provider does
2. say the missing env keys
3. rerun `doctor`
4. tell the user only the next blocker
