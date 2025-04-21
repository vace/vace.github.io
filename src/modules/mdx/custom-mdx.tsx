"use client"

import { MDXRemote } from 'next-mdx-remote'

import { defaultMdxComponents } from './components'
import { CompiledMdx } from './mdx-compile'

export type CustomMDXProps = {
  mdx: CompiledMdx
}

export function CustomMDX({ mdx }: CustomMDXProps) {
  return (
    <MDXRemote
      {...mdx}
      components={defaultMdxComponents}
    />
  )
}
