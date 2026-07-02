import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>somnio-loop</span>,
  project: {
    link: 'https://github.com/giosomniodev/somnio-loop',
  },
  docsRepositoryBase: 'https://github.com/giosomniodev/somnio-loop/tree/main/docs',
  footer: {
    content: 'somnio-loop docs — MIT License',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="somnio-loop — Autonomous agentic loop orchestration for Claude Code" />
    </>
  ),
}

export default config
