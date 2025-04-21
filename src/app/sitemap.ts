import { WebsiteProfile } from "@/common/config"
import { getAllPostList } from "@/modules/blog/model"

export default async function sitemap() {
  const { blogs } = await getAllPostList()
  let posts = blogs.map((post) => ({
    url: `${WebsiteProfile.URL}/blog/${post.name}`,
    lastModified: post.metadata.date,
  }))

  let routes = ['', '/blog'].map((route) => ({
    url: `${WebsiteProfile.URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...posts]
}
