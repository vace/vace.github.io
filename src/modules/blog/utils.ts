import { WebsiteProfile } from "@/common/config"
import { BlogPost } from "./types"

export function generatePostUrl(slug: string) {
  return `/blog/${slug}`
}

/**
 * JSON for Linking Data
 * @see https://json-ld.org/
 */
export async function generatePostJsonID(post: BlogPost) {
  const { image, date, summary, title } = post.metadata
  const ogImage = image ? image : `${WebsiteProfile.URL}/og?title=${encodeURIComponent(title)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: date,
    dateModified: date,
    description: summary,
    image: ogImage,
    url: `${WebsiteProfile.URL}${generatePostUrl(post.name)}`,
    author: {
      '@type': 'Person',
      name: WebsiteProfile.Author,
    },
  }
}
