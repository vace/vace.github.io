'use server'

import matter from 'gray-matter'
import { BlogStoragePath, WebsiteProfile } from '@/common/config'
import { getDirectoryFiles } from '@/lib/fs'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { BlogPost, BlogPostInfo, BlogTag } from './types'
import { generatePostUrl } from './utils'
import readingTime from '@/lib/reading-time'
import { mdxCompile } from '../mdx/mdx-compile'

type BlogResult = {
  blogs: BlogPost[]
  tags: BlogTag[]
}

let blogListCache: BlogResult | null = null

export async function getAllPostList() {
  if (blogListCache) {
    return blogListCache
  }
  const files = await getDirectoryFiles(BlogStoragePath, {
    recursive: true,
    extensions: ['.mdx', '.md'],
    isReadFile: true,
  })
  const blogList: BlogPost[] = []
  const tagNameMap: Map<string, BlogTag> = new Map()
  for (const file of files) {
    if (!file.content) {
      continue
    }
    const metadata = matter(file.content)
    const filetype = file.name.endsWith('.mdx') ? 'mdx' : 'md'
    const tags = metadata.data.tags || []
    const blog: BlogPost = {
      type: filetype,
      name: file.name,
      metadata: {
        title: metadata.data.title,
        date: metadata.data.date || new Date(),
        summary: metadata.data.summary,
        tags: tags,
      },
      content: metadata.content,
    }
    for (const tag of tags) {
      if (!tagNameMap.has(tag)) {
        tagNameMap.set(tag, { name: tag, count: 0 })
      }
      tagNameMap.get(tag)!.count++
    }
    blogList.push(blog)
  }
  const cache = {
    blogs: blogList.sort((a, b) => {
      return b.metadata.date.getTime() - a.metadata.date.getTime()
    }),
    tags: Array.from(tagNameMap.values()),
  }
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Blog] load all posts: ${cache.blogs.length} posts`)
  }
  return cache
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
  blogListCache = null
  postInfoCache.clear()
}
