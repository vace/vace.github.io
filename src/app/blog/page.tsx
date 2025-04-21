import { Metadata } from 'next'
import React from 'react'

import PostListItem from '@/modules/blog/components/PostListItem'
import PostPagination from '@/modules/blog/components/PostPagination'
import { getAllPostList } from '@/modules/blog/model'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Knowledge sharing and technical exploration',
}

type BlogPageParams = {
  limit?: string
  page?: string
}

const DEFAULT_PAGE_SIZE = 15

export default async function BlogPage({ searchParams }: { searchParams: Promise<BlogPageParams>}) {
  const params = await searchParams
  const { blogs, tags } = await getAllPostList()
  const limit = Math.min(10, parseInt(params.limit!, 10) || DEFAULT_PAGE_SIZE)
  const page = Math.max(1, parseInt(params.page!, 10) || 1)
  const pageRows = blogs.slice((page - 1) * limit, page * limit)
  
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-12 -mx-4">
        {pageRows.map(blog => (
          <PostListItem key={blog.name} blog={blog} />
        ))}
      </div>
      <PostPagination 
        total={blogs.length} 
        page={page} 
        limit={limit} 
      />
    </div>
  )
}
