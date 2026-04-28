import { definePlugin } from 'pluxx'

export default definePlugin({
  name: 'trellis-plugin',
  version: '0.1.0',
  description: 'Trellis onboarding and setup flows for composable agentic GTM apps.',
  author: {
    name: 'Orchid Labs',
  },
  license: 'MIT',
  skills: './skills/',
  targets: ['claude-code', 'cursor', 'codex', 'opencode'],
})
