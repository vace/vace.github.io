import { AnchorProvider } from "@/components/toc/primitive"
import ClerkTOCItems from "@/components/toc/toc-clerk"
import { TOCItemType } from "@/components/toc/types"
import { CustomMDX } from "@/modules/mdx/custom-mdx"
import { CompiledMdx } from "@/modules/mdx/mdx-compile"

export type PostBodyProps = {
  mdx: CompiledMdx
  toc: TOCItemType[]
}

export function PostBody({ mdx, toc }: PostBodyProps) {
  return (
    <AnchorProvider toc={toc}>
      <div className="w-full flex flex-col md:flex-row">
        <div className='article-content prose dark:prose-invert max-w-none w-full'>
          <CustomMDX mdx={mdx} />
        </div>
        <div className="ml-6">
          <ClerkTOCItems items={toc} />
        </div>
      </div>
    </AnchorProvider>
  )
}
