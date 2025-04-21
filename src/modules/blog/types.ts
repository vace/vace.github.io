import { TOCItemType } from "@/components/toc/types"
import { CompiledMdx } from "../mdx/mdx-compile"

export type BlogMetadata = {
  title: string
  date: Date
  summary: string
  tags: string[]
  image?: string
}

export type BlogPostInfo = {
  minutes: number
  words: number
  /**
   * Serialized MDX content
   */
  mdx: CompiledMdx
  toc: TOCItemType[]
}

export type BlogPost = {
  type: 'md' | 'mdx'
  name: string
  metadata: BlogMetadata
  content: string
}

export type BlogTag = {
  name: string
  count: number
}
