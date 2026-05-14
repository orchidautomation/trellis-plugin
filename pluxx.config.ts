import { definePlugin } from 'pluxx'

export default definePlugin({
  name: 'trellis-plugin',
  version: '0.1.0',
  description: 'Cloudflare-first Trellis onboarding and operator flows for composable agentic GTM apps.',
  author: {
    name: 'Orchid Labs',
    url: 'https://github.com/orchidautomation',
  },
  repository: 'https://github.com/orchidautomation/trellis-plugin',
  license: 'MIT',
  keywords: [
    'trellis',
    'cloudflare',
    'gtm',
    'agents',
    'workers',
    'mcp',
    'pluxx',
  ],

  brand: {
    displayName: 'Trellis',
    shortDescription: 'Cloudflare-first setup and operations guidance for Trellis GTM agents.',
    longDescription:
      'Use the Trellis plugin to create, validate, deploy, and operate Cloudflare-native GTM agents across Workers, D1, R2, Queues, Workflows, Durable Objects, Workers AI, AI Gateway, provider connections, and MCP clients.',
    category: 'Developer Tools',
    websiteURL: 'https://github.com/orchidautomation/trellis-plugin',
    color: '#146EF5',
    icon: './assets/icon/trellis-icon.svg',
    screenshots: [
      './assets/screenshots/cloudflare-runbook.svg',
      './assets/screenshots/operator-surfaces.svg',
    ],
    defaultPrompts: [
      'Use Trellis to create a Cloudflare-first GTM agent and tell me the next exact command.',
      'Run a Trellis readiness check and identify the next blocker before deploy.',
      'Explain the Trellis Cloudflare stack and how MCP, traces, providers, and approvals fit together.',
    ],
  },

  skills: './skills/',
  assets: './assets/',
  targets: ['claude-code', 'cursor', 'codex', 'opencode'],
  outDir: './dist',
})
