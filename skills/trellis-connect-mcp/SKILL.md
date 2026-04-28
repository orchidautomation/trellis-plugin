---
name: "trellis-connect-mcp"
description: "Connect Claude Code, Codex, Cursor, or OpenCode to a local or deployed Trellis app over MCP."
---

# Trellis Connect MCP

Use this skill when the user wants their coding host connected to Trellis over MCP.

## Commands

For local app control:

```bash
npm run ai-sdr -- mcp claude-code --local --write --json
```

For a deployed app:

```bash
npm run ai-sdr -- mcp claude-code --remote --write --json
```

Swap the host target as needed:

- `claude-code`
- `codex`
- `cursor`
- `opencode`

## Explain The Surfaces

- local MCP = talk to the local Trellis app
- remote MCP = talk to the deployed Trellis app

The deployed control surface is the Trellis MCP endpoint, usually:

```text
${APP_URL}/mcp/trellis
```

## Tell The User

After writing MCP config, say:

- what host was configured
- whether it is local or remote
- what URL was written
- which token source is being used
- whether the host needs a reload
