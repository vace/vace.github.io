'use server'

import { Metadata } from 'next'

import { WebsiteProfile } from '@/common/config'
import readingTime from '@/lib/reading-time'
import { formatDate } from '@/lib/utils'

import { mdxCompile } from '../mdx/mdx-compile'
import { BlogPost, BlogPostInfo, BlogTag } from './types'
import { generatePostUrl } from './utils'

type BlogResult = {
  blogs: BlogPost[]
  tags: BlogTag[]
}

let allPostListCache: Promise<BlogResult>
try {
  // @ts-ignore
  allPostListCache = import('./.posts.cache.json') as Promise<BlogResult>
} catch (error) {
  console.error('[Blog] Error loading blog list:', error)
  allPostListCache = Promise.resolve({ blogs: [], tags: [] })
}

export async function getAllPostList() {
  return allPostListCache
}

export async function generatePostMeta(name: string): Promise<Metadata | null> {
  const { blogs } = await getAllPostList()
  const post = blogs.find((post) => post.name === name)
  if (!post) {
    return null
  }
  const { title, date, summary, image } = post.metadata
  const description = summary
  const ogImage = image ? image : `${WebsiteProfile.URL}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: formatDate(date),
      url: `${WebsiteProfile.URL}${generatePostUrl(name)}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

const postInfoCache = new Map<string, BlogPostInfo>()

export async function getPostInfo(post?: BlogPost | null): Promise<BlogPostInfo | null> {

  if (!post) {
    return null
  }

  if (postInfoCache.has(post.name)) {
    return postInfoCache.get(post.name)!
  }

  const { minutes, words } = readingTime(post.content)

  const mdx = await mdxCompile(post.content)

  const info: BlogPostInfo = {
    minutes,
    words,
    mdx,
    toc: mdx.toc,
  }

  if (process.env.NODE_ENV !== 'development') {
    postInfoCache.set(post.name, info)
  }

  return info
}


export async function findPostBySlug(slug: string): Promise<BlogPost | null> {
  const { blogs } = await getAllPostList()
  const post = blogs.find((post) => post.name === slug)
  if (!post) {
    return null
  }
  
  return post
}


if (process.env.NODE_ENV === 'development') {
  console.log('development mode, clearing blog cache')
  postInfoCache.clear()
}
