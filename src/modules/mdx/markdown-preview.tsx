import { CustomMDX } from './custom-mdx'
import { mdxCompile } from './mdx-compile'

export type MarkdownPreviewProps = {
  content: string
}

export async function MarkdownPreview ({ content }: MarkdownPreviewProps) {
  const mdx = await mdxCompile(content)
  
  return <CustomMDX mdx={mdx} />
}
