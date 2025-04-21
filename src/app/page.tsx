import { getAllPostList } from '@/modules/blog/model'
import { AboutMeSection, HeroSection, SpecialSection } from '@/components/pages/home'

// 首页内容
export default async function Page() {
  const { blogs, tags } = await getAllPostList()

  return (
    <main className="container mx-auto space-x-6 px-4 md:px-6 lg:px-8">      
      <HeroSection />
      <SpecialSection blogs={blogs.slice(0, 6)} tags={tags} />
      <AboutMeSection />
    </main>
  )
}
