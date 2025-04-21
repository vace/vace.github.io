"use client"

import { MDXRemote } from "next-mdx-remote"

import { CompiledMdx } from "./mdx-compile";
import { defaultMdxComponents } from "./components";

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
