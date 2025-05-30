// import createMDX from '@next/mdx'
import type { NextConfig } from "next"
import { once } from 'lodash-es'
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants'

import { generatorPostCache } from './bin/generator-post-cache'

// const withMdx = createMDX({})

const onceGenerateCache = once(generatorPostCache)

export default async function run(phase: string, config: any) {
  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_DEVELOPMENT_SERVER) {
    await onceGenerateCache()
  }
  return Promise.resolve(nextConfig)
}

const nextConfig: NextConfig = {

  // caveats: _posts
  outputFileTracingIncludes: {
    'markdown': [ "./_posts/**/*.md", "./_posts/**/*.mdx"]
  },

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'h5.ahmq.net',
      }
    ],
    loader: 'custom',
    loaderFile: './src/lib/next-image-loader.ts',
  },
  /* config options here */
  transpilePackages: [
    "next-mdx-remote",
  ],
  /**experimental */
  experimental: {
    /**
     * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition
     */
    viewTransition: true,
  }
}
