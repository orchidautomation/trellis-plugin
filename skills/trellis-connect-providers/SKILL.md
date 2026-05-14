---
name: "trellis-connect-providers"
description: "Connect Trellis providers as Cloudflare Worker secrets one provider at a time."
---

# Trellis Connect Providers

Use this skill when a user needs to connect outside services to a Trellis Cloudflare app.

Keep the sequence narrow. Do not push every provider at once.

## Read First

Use:

```bash
npm run doctor -- --json
npm run verify -- --json
```

Also read:

1. `src/agent.ts`
2. `wrangler.jsonc`
3. `.trellis/providers/` if it exists

## Provider Order

Prefer this order:

1. first Cloudflare boot and deploy
2. protected route secret
3. research provider
4. trace export provider, if requested
5. CRM
6. email and handoff
7. discovery
8. enrichment
9. outbound send enablement

For the noob flow, the minimum demo set is Cloudflare only:

1. `npm run deploy -- --json`
2. `npm run verify -- --json`
3. `npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"`
4. remote MCP
5. one safe signal

Only after that, add providers.

## Commands

Use the CLI as the contract:

```bash
npm run trellis -- connect <provider> --json
```

Examples:

```bash
npm run trellis -- connect firecrawl --json
npm run trellis -- connect attio --json
npm run trellis -- connect agentmail --json
npm run trellis -- connect apify --json
npm run trellis -- connect prospeo --json
npm run trellis -- connect langfuse --json
npm run trellis -- connect braintrust --json
```

The command writes a non-secret manifest and tells the user which `npx wrangler secret put <NAME>` commands to run.

## Explain Providers Plainly

- Firecrawl = search and extraction
- Attio = CRM sync
- AgentMail = outbound email and inbound reply webhooks
- Apify = discovery source
- Prospeo = enrichment
- Slack = handoff and operator channel
- Langfuse = optional trace export
- Braintrust = optional trace export
- Cloudflare AI Gateway = default model gateway

## Cloudflare Secret Rule

Deployed agents read provider credentials from Cloudflare Worker secrets.

Do not put secrets in:

- `wrangler.jsonc`
- `.trellis/providers/`
- `knowledge/`
- `skills/`
- MCP host config

Use:

```bash
npx wrangler secret put FIRECRAWL_API_KEY
npx wrangler secret put ATTIO_API_KEY
npx wrangler secret put AGENTMAIL_API_KEY
```

## Noob Rule

After each provider step:

1. say what the provider does
2. say the exact missing secret names
3. rerun `npm run doctor -- --json`
4. rerun `npm run verify -- --json`
5. tell the user only the next blocker

Use explicit handoffs:

- `Next: set Worker secrets`
- `Next: run doctor`
- `Next: deploy again`
- `Next: verify live`
- `Next: connect remote MCP`

## Safe Demo Rule

Do not push discovery automation or real send providers before:

- Cloudflare deploy is green
- live verify is green
- remote MCP is connected
- one safe signal has been inspected
- approval and no-send behavior is understood
