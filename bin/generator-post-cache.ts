import dayjs from 'dayjs'
import matter from 'gray-matter'
import path from 'path'

import { getDirectoryFiles, putFileContent } from './fs'

import type { BlogPost, BlogTag } from "../src/modules/blog/types"
const BlogStoragePath = './_posts'
const BlogOutputPath = './src/modules/blog/.posts.cache.json'

export async function generatorPostCache() {
  const buildStartAt = Date.now()
  const current = await import(path.resolve(process.cwd(), BlogOutputPath))
  if (current && current.version && (buildStartAt - current.version) < 2000) {
    return current
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
      return dayjs(b.metadata.date).valueOf() - dayjs(a.metadata.date).valueOf()
    }),
    tags: Array.from(tagNameMap.values()),
    version: Date.now(),
  }

  // write to file
  await putFileContent(BlogOutputPath, JSON.stringify(cache, null, 2))

  const buildEndAt = Date.now()
  console.log(`[Blog] load all posts: ${cache.blogs.length} posts, ${cache.tags.length} tags, ${buildEndAt - buildStartAt}ms`)

  return cache
}

