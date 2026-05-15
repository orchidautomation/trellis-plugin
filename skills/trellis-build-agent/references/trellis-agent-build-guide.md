# Trellis Agent Build Guide

This guide is the fetchable reference for coding agents building Trellis apps. Use it before editing a generated Trellis app or teaching a novice how to create one.

## Mental Model

Trellis is the runtime and safety layer for GTM agents.

```text
workspace event or webhook
  -> Trellis signal
  -> src/agent.ts workflow
  -> app.skill(...) bounded skills
  -> app.workflow(...) durable workflow
  -> D1 state, drafts, approvals, traces
  -> provider actions after approval
  -> MCP, dashboard, Slack, Notion, Linear, or API surfaces
```

Adapters are surfaces, not brains. Trellis owns skills, providers, state, approvals, traces, workflows, and safety.

## Files In A Generated App

| Path | Purpose | Who edits it |
| --- | --- | --- |
| `src/agent.ts` | Agent blueprint, providers, model, MCP surfaces, skill workflow. | Usually yes |
| `src/state/*.map.ts` | Business state projection into Trellis-managed D1 state records. | Usually yes |
| `knowledge/**/*.md` | Company context, ICP, messaging, examples, policies. | Yes |
| `skills/**/SKILL.md` | Bounded skill instructions. | Yes |
| `src/trellis-runtime.ts` | Cloudflare/Flue runtime adapter. | Rarely |
| `src/index.ts` | Worker entrypoint. | Rarely |
| `wrangler.jsonc` | Cloudflare binding map. | Only when adding resources |
| `.trellis/providers/*` | Non-secret provider manifests. | Via CLI |

## Current Demo Pattern

The SDR demo uses:

```text
signal -> icp-qualification -> research-brief -> sdr-copy -> prospect workflow -> draft -> approvals
```

The important properties are:

- no-send mode stays on
- email and CRM writes are approval-gated
- D1 stores signals, state records, drafts, approvals, provider actions, audit events, and trace events
- R2 stores knowledge and skill packs
- MCP exposes one SDR surface and one operator surface

## Agent Config Pattern

Use this as the default shape:

```ts
export default trellis.agent("common-room-bdr", {
  crm: attio({ map: attioMap }),
  research: firecrawl(),
  model: "cloudflare/openai/gpt-5.5",
  state: stateMap,
  mcp: {
    name: "trellis-sdr",
    surface: "sdr",
    operator: {
      name: "trellis-operator",
    },
    tools: {
      include: [
        "describe_agent",
        "list_leads",
        "get_lead",
        "pipeline_stats",
        "estimate_cost",
        "list_pending_approvals",
        "approve_draft",
        "reject_draft",
        "edit_and_approve_draft",
        "research_account",
        "qualify_lead",
        "draft_email",
      ],
      skillTools: [
        {
          name: "qualify_lead",
          skill: "icp-qualification",
          description: "Run just the ICP qualification skill.",
          schema: schema.qualification(),
        },
        {
          name: "draft_email",
          skill: "sdr-copy",
          description: "Run just the outbound copy skill.",
          schema: schema.outboundDraft(),
        },
      ],
    },
  },
  knowledge: "knowledge/**/*.md",
  skills: "skills/**/SKILL.md",
  safety: trellis.safeOutbound(),
}, async (app) => {
  const signal = await app.signal();
  const context = await app.context(signal);

  const qualification = await app.skill("icp-qualification", {
    context,
    schema: schema.qualification(),
  });

  const research = await app.skill("research-brief", {
    context,
    args: { qualification },
    schema: schema.researchBrief(),
  });

  const draft = await app.skill("sdr-copy", {
    context,
    args: { qualification, research },
    schema: schema.outboundDraft(),
  });

  return app.workflow("prospect").start({ signal, qualification, research, draft });
});
```

## MCP Surface Rules

Expose tools by role, not by implementation detail.

SDR surface:

```text
/mcp/trellis
trellis-sdr
```

Use business vocabulary:

- `list_leads`
- `get_lead`
- `pipeline_stats`
- `estimate_cost`
- `list_pending_approvals`
- `approve_draft`
- `reject_draft`
- `research_account`
- bounded skill tools

Operator surface:

```text
/mcp/operator
trellis-operator
```

Use runtime vocabulary:

- `trellis.health`
- `trellis.signal.submit`
- `trellis.run.status`
- `trellis.trace.inspect`
- `trellis.trace.cost`
- `trellis.operator.controls`
- workflow/provider replay and pause/resume tools

Do not put operator controls in the SDR surface unless the user explicitly asks for a power-user surface.

## D1 And Schema

The Trellis framework owns internal D1 tables. Do not ask novices to design migrations for these tables.

For D1 creation, binding checks, schema proof, seed data, trace cleanup, and database inspection, use the `trellis-setup-database` skill.

Canonical internal tables:

- `trellis_signals`
- `trellis_prospects`
- `trellis_state_records`
- `trellis_drafts`
- `trellis_approvals`
- `trellis_provider_runs`
- `trellis_provider_actions`
- `trellis_workflow_runs`
- `trellis_audit_events`
- `trellis_trace_events`
- `trellis_operator_controls`
- `trellis_smoke_runs`
- `trellis_agent_sessions`
- `trellis_slack_threads`

Business state goes through `trellis.state(...)`.

Example:

```ts
const stateMap = trellis.state({
  tables: {
    accounts: {
      primaryKey: "domain",
      fields: {
        domain: "signal.payload.companyDomain",
        name: "signal.payload.company",
        fitStatus: "qualification.decision",
        researchSummary: "research.summary",
      },
      indexes: [
        { name: "accounts_by_status", fields: ["fitStatus"] },
      ],
    },
    prospects: {
      primaryKey: "id",
      fields: {
        id: "prospect.id",
        signalId: "signal.id",
        threadId: "signal.threadId",
        company: "signal.payload.company",
        domain: "signal.payload.companyDomain",
        status: "qualification.decision",
        summary: "qualification.summary",
        draftSubject: "draft.subject",
      },
      indexes: [
        { name: "prospects_by_status", fields: ["status"] },
      ],
    },
  },
});
```

## Skill Authoring Format

Every `SKILL.md` should include:

```md
# Skill Name

## Purpose
What this skill decides or produces.

## Inputs
- signal
- context
- knowledge files
- prior skill outputs

## Method
1. Check required evidence.
2. Apply explicit rules.
3. Return only the requested output.

## Output Contract
Return fields matching the schema in `src/agent.ts`.

## Safety
No sends, CRM writes, or irreversible side effects.
```

Keep skills small. A good Trellis skill is a reliable method, not a whole agent.

## Knowledge Formatting

Use markdown files with obvious names:

- `knowledge/company.md`
- `knowledge/icp.md`
- `knowledge/messaging.md`
- `knowledge/reply-policy.md`
- `knowledge/handoff-policy.md`

Prefer compact decision rules, examples, and definitions. Do not bury critical policy in prose.

## CLI Commands

Create:

```bash
npm run trellis -- init ../my-agent --name my-agent --json
```

Local proof:

```bash
nvm use 22
npm install
npm run cf:login
npm run doctor -- --json
npm run smoke -- --json
npm run verify -- --json
```

Deploy and verify:

```bash
npm run deploy -- --json
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"
```

Inspect D1 only when table-level proof is needed:

```bash
npx wrangler d1 execute <database-name> --remote --command "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'trellis_%' ORDER BY name"
```

Optional live exercise:

```bash
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY" --exercise-agent
```

Connect providers after the Cloudflare proof:

```bash
npm run trellis -- connect firecrawl --json
npm run trellis -- connect attio --json
npm run trellis -- connect agentmail --json
```

Connect MCP:

```bash
claude mcp add --scope user --transport http trellis-sdr \
  "$APP_URL/mcp/trellis" \
  --header "Authorization: Bearer $TRELLIS_API_KEY"

claude mcp add --scope user --transport http trellis-operator \
  "$APP_URL/mcp/operator" \
  --header "Authorization: Bearer $TRELLIS_API_KEY"
```

## Safety Checklist

Do not call an agent demo-ready until:

- typecheck passes
- doctor passes or only has optional provider warnings
- smoke passes
- deploy succeeds
- live verify passes
- `/mcp/trellis` and `/mcp/operator` are reachable with auth
- no-send and approval gates are understood
- pending approvals can be listed and acted on

Outbound sends and CRM writes remain approval-gated unless the user explicitly changes safety.
