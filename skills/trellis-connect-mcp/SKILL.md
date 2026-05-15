---
name: "trellis-connect-mcp"
description: "Connect Claude Code, Codex, Cursor, or OpenCode to a local or deployed Trellis Cloudflare app over MCP."
---

# Trellis Connect MCP

Use this skill when the user wants their coding host connected to Trellis over MCP.

Remote MCP comes after app health, not before.

## Endpoint

Local:

```text
http://localhost:3000/mcp/trellis
```

Remote role-facing surface:

```text
${APP_URL}/mcp/trellis
```

Remote operator surface:

```text
${APP_URL}/mcp/operator
```

Protected remote routes use:

```text
Authorization: Bearer <TRELLIS_API_KEY>
```

## Claude Code CLI Helper

The Trellis CLI currently writes Claude Code MCP config directly:

```bash
npm run trellis -- mcp claude-code --local --write --json --url http://localhost:3000/mcp/trellis --token "$TRELLIS_API_KEY"
npm run trellis -- mcp claude-code --remote --write --json --url "${APP_URL}/mcp/trellis" --token "$TRELLIS_API_KEY"
```

For the current role-shaped Trellis pattern, add two MCP entries when the host supports HTTP MCP:

```bash
claude mcp add --scope user --transport http trellis-sdr \
  "${APP_URL}/mcp/trellis" \
  --header "Authorization: Bearer $TRELLIS_API_KEY"

claude mcp add --scope user --transport http trellis-operator \
  "${APP_URL}/mcp/operator" \
  --header "Authorization: Bearer $TRELLIS_API_KEY"
```

`TRELLIS_API_KEY` is preferred for deployed Worker routes. `TRELLIS_SANDBOX_TOKEN` may appear in older local flows, but do not make it the remote default.

## Cursor, Codex, And OpenCode

For non-Claude hosts, write the host-native MCP config manually using the same flat HTTP shape:

```json
{
  "mcpServers": {
    "trellis-sdr": {
      "type": "http",
      "url": "https://<worker>.workers.dev/mcp/trellis",
      "headers": {
        "Authorization": "Bearer <TRELLIS_API_KEY>"
      }
    },
    "trellis-operator": {
      "type": "http",
      "url": "https://<worker>.workers.dev/mcp/operator",
      "headers": {
        "Authorization": "Bearer <TRELLIS_API_KEY>"
      }
    }
  }
}
```

Do not write:

- a nested `transport` block
- raw secrets into checked-in files
- a remote MCP config before `/healthz` is healthy

## Order

For a hosted app, only connect remote MCP after:

1. `npm run deploy -- --json` succeeds
2. `npm run verify -- --json` passes local Cloudflare checks
3. `GET ${APP_URL}/healthz` is healthy
4. `GET ${APP_URL}/mcp/trellis` is reachable with auth
5. `GET ${APP_URL}/mcp/operator` is reachable with auth
6. `npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"` passes

If those checks are not green, route the user back to readiness or deploy instead of debugging through MCP first.

## Tell The User

After writing MCP config, say:

- what host was configured
- whether it is local or remote
- what URL was written
- whether it is `trellis-sdr`, `trellis-operator`, or both
- which token source is being used
- whether the host needs a reload
- whether the route is protected by `TRELLIS_API_KEY`
