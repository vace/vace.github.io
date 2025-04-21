import { CalendarIcon, ClockIcon, TagIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { BlogMetadata } from '@/modules/blog/types'

export function PostHeader({
  metadata,
  minutes
}: {
  metadata: BlogMetadata,
  minutes: number
}) {
  return (
    <header className="mb-6 mx-auto">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        {metadata.title}
      </h1>

      <div className="flex flex-wrap gap-4 text-muted-foreground mb-4 text-sm">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={metadata.date}>
            {formatDate(metadata.date)}
          </time>
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <span>{minutes} {minutes > 1 ? "minutes" : "minute"} read</span>
        </div>

        {metadata.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 ml-4">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            {metadata.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
