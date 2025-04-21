import { BookmarkIcon, CalendarIcon, TagIcon } from 'lucide-react'
// import Link from 'next/link'
import { Link } from 'next-view-transitions'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { cn, formatDate } from '@/lib/utils'
import { generatePostUrl } from '@/modules/blog/utils'

import { BlogPost } from '../types'

export default function PostListItem({ blog }: { blog: BlogPost }) {
  const { metadata, name } = blog
  const href = generatePostUrl(name)

  return (
    <article className={cn(
      "group relative flex flex-col space-y-3 rounded-lg border border-transparent p-4 transition-all",
      "hover:bg-muted/50 hover:border-border",
    )}>
      <div className="flex justify-between items-start gap-2 flex-col sm:flex-row">
        <h2 className="text-xl font-semibold tracking-tight">
          <Link href={href} className="group-hover:text-primary transition-colors">
            {metadata.title}
          </Link>
        </h2>

        <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={metadata.date}>
            {formatDate(metadata.date)}
          </time>
        </div>
      </div>

      {metadata.summary && (
        <p className="text-muted-foreground line-clamp-2">{metadata.summary}</p>
      )}

      <div className="flex items-center gap-3 flex-wrap mt-2">
        <div className="flex items-center gap-1 group transition-opacity text-muted-foreground">
          <BookmarkIcon className="h-4 w-4" />
          <Link href={href} className="text-sm font-medium hover:underline">
            Read post
          </Link>
        </div>

        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {metadata.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {metadata.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{metadata.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
