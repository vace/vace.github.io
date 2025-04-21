// import createMDX from '@next/mdx'
import type { NextConfig } from "next"

// const withMdx = createMDX({})

const nextConfig: NextConfig = {
  // output: 'standalone',

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

export default nextConfig
