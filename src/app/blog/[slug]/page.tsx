import { notFound } from 'next/navigation'

import { PostBody } from '@/modules/blog/components/PostBody'
import { PostHeader } from '@/modules/blog/components/PostHeader'
import { findPostBySlug, generatePostMeta, getAllPostList, getPostInfo } from '@/modules/blog/model'
import { generatePostJsonID } from '@/modules/blog/utils'
import { Separator } from '@radix-ui/react-dropdown-menu'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return generatePostMeta(slug)
}

// static params
export async function generateStaticParams() {
  const { blogs } = await getAllPostList()
  return blogs.map((post) => ({ slug: post.name }))
}

export default async function Blog({ params }: Props) {
  const { slug } = await params
  const post = await findPostBySlug(slug)
  const info = await getPostInfo(post)

  if (!post) {
    notFound()
  }
  if (!info) {
    notFound()
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePostJsonID(post)) }}
      />
      <article className="max-w-screen-2xl mx-auto py-4 px-4 md:px-0">
        <PostHeader
          metadata={post.metadata}
          minutes={info.minutes}
        />

        <Separator className="mb-6 w-full mx-auto" />

        <PostBody mdx={info.mdx} toc={info.toc} />
      </article>
    </>
  )
}
