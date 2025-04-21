import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'

import { rehypeCode, rehypeToc, remarkCodeTab, remarkHeading, remarkImage } from './plugins'
import { VFile } from 'vfile'
import { TOCItemType } from '@/components/toc/types'
import { remarkInstall } from './plugins/remark-install'

type CompileOptions = {
  format?: 'md' | 'mdx'
  scope?: Record<string, unknown>
  rsc?: boolean
}

export type CompiledMdx = {
  compiledSource: string
  scope: Record<string, unknown>
  toc: TOCItemType[]
  frontmatter: Record<string, unknown>
}

export async function mdxCompile(source: string, { format = 'mdx', scope, rsc = false }: CompileOptions = {}) {

  const vfile = new VFile(source)

  const remarkPlugins = [
    remarkGfm,
    remarkHeading,
    remarkImage,
    remarkCodeTab,
    remarkInstall,
  ]

  const rehypePlugins = [
    rehypeCode,
    rehypeToc,
  ]

  const compiledMdx = await compile(vfile, {
    outputFormat: 'function-body',
    format: format,
    remarkPlugins,
    rehypePlugins,
    providerImportSource: rsc ? undefined : '@mdx-js/react',
    development: process.env.NODE_ENV !== 'production',
  })

  return {
    compiledSource: compiledMdx.toString(),
    toc: compiledMdx.data?.toc || [],
    scope: scope,
    frontmatter: {}
  } as CompiledMdx
}
