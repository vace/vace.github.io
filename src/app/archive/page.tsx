import React from 'react'
import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { getAllPostList } from "@/modules/blog/model"
import { CalendarIcon, TagIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Link } from 'next-view-transitions'
import { generatePostUrl } from '@/modules/blog/utils'
import { cn } from '@/lib/utils'
import { BlogPost } from '@/modules/blog/types'

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Archive of all blog posts by categories and tags',
}

export default async function ArchivePage() {
  const { blogs, tags } = await getAllPostList()
  const years = groupByYears(blogs)
  const sortedTags = [...tags].sort((a, b) => b.count - a.count)

  return (
    <div className="py-8">
      {/* Tag cloud section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(tag => (
            <Badge 
              key={tag.name} 
              variant="outline" 
              className={cn(
                "px-2 py-1.5 text-xs font-medium hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
              )}
            >
              {tag.name} <span className="ml-1 opacity-70">({tag.count})</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Blog posts list section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">All Posts</h2>
        <div className="space-y-8">
          {years.map((yearGroup) => (
            <div key={yearGroup.year} className="relative">
              <div className="sticky top-4 z-10 bg-background/40 backdrop-blur">
                <h3 className="text-2xl font-bold mb-4">{yearGroup.year}</h3>
              </div>
              <div className="grid gap-3 pl-4 border-l-2 border-muted-foreground/20">
                {yearGroup.posts.map((post) => (
                  <Link 
                    key={post.name}
                    href={generatePostUrl(post.name)}
                    className="group grid grid-cols-[1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 hover:bg-muted/50 rounded-md p-2 transition-colors"
                  >
                    <div className="hidden sm:flex items-center text-muted-foreground text-sm gap-1 mr-2">
                      <CalendarIcon size={14} />
                      <time dateTime={post.metadata.date.toISOString()}>
                        {formatDate(post.metadata.date, 'MMM. DD')}
                      </time>
                    </div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {post.metadata.title}
                    </h4>
                    {post.metadata.tags && post.metadata.tags.length > 0 && (
                      <div className='items-center space-x-2 hidden md:flex'>
                        <TagIcon size={14} className="text-muted-foreground" />
                        {post.metadata.tags.map((tag) => (
                          <span key={tag} className="text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type IYearPost = {
  year: number
  posts: BlogPost[]
}

function groupByYears(blogs: BlogPost[]) {
  const indexed = new Map<number, IYearPost>()

  for (const blog of blogs) {
    const year = blog.metadata.date.getFullYear()
    if (!indexed.has(year)) {
      indexed.set(year, { year, posts: [] })
    }
    indexed.get(year)!.posts.push(blog)
  }

  return Array.from(indexed.values()).sort((a, b) => b.year - a.year)
}
