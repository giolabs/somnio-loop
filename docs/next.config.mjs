import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/somnio-loop',
  images: {
    unoptimized: true,
  },
}

export default withNextra(nextConfig)
