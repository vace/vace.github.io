"use client"

import { ArrowRight, BookOpen, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useEffect } from 'react'

import { WebsiteProfile } from '@/common/config'
import { mainSkills } from '@/common/skills'
import { PinContainer } from '@/components/ui/3d-pin'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogPost, BlogTag } from '@/modules/blog/types'
import { generatePostUrl } from '@/modules/blog/utils'

import GithubIcon from '../icons/Github'

export const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-between flex-col lg:flex-row gap-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="space-y-6 flex-1 shrink-0"
      >
        <div className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 transition-colors rounded-full pl-1 pr-4 py-1">
          <Badge variant="default" className="rounded-full px-3 py-1">
            {WebsiteProfile.Author} 👋
          </Badge>
          <span className="text-sm font-medium">
            Welcome to my blog!
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter">
          <span className="text-primary">{WebsiteProfile.Title}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground">
          {WebsiteProfile.Description}
        </p>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button asChild size="lg" className="group">
            <Link href="/blog">
              Start Reading
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">
              About Me
            </Link>
          </Button>
        </div>
      </motion.div>

      <PinContainer className='w-md hidden lg:block'>
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 25 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-md relative"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-background to-secondary/20 border border-border/20 shadow backdrop-blur-sm">
              <div className="h-12 w-full bg-background/80 backdrop-blur-sm rounded-t-xl border-b border-border/50 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs font-mono opacity-70">~/Developer/ByteDiary</div>
              </div>
              <div className="p-6 space-y-4 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 animate-fade fade-in delay-0">$</span>
                  <span className="typing-animation delay-0">echo $HELLO_WORLD</span>
                </div>
                <div>
                  <span className='typing-animation delay-500'>👋 Hello, I'm {WebsiteProfile.Author}!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 animate-fade fade-in delay-1500">$</span>
                  <span className="typing-animation delay-1600">whoami</span>
                </div>
                <div>
                  <span className='typing-animation delay-2000'>{WebsiteProfile.JobName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 animate-fade fade-in delay-3000">$</span>
                  <span className="typing-animation delay-3100">cd ./skills && ls</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mainSkills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-background/50 animate-fade fade-in hover:bg-background/60"
                      style={{ animationDelay: `${i * 200 + 3500}ms` }}
                    >{skill}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 animate-fade fade-in delay-5000">
                  <span className="text-green-500">$</span>
                  <span className="typing-animation-blink animate-in">|</span>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 -top-3 p-1 bg-background rounded-full border border-border shadow-lg">
              <Avatar className="h-12 w-12 border-2 border-background">
                <AvatarImage src="/assets/avatar.png" alt={WebsiteProfile.Author} />
              </Avatar>
            </div>
          </motion.div>
        </div>
      </PinContainer>
    </section>
  )
}


export const SpecialSection = ({ blogs, tags }: { blogs: BlogPost[], tags: BlogTag[] }) => {
  return (
    <section className="py-16 relative">
      <div className="mb-10 text-center animate-fade fade-in delay-400">
        <h2 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Recent Updates
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blogs.map((post, index) => (
          <motion.div
            key={post.name}
            className="h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors hover:underline">
                  <Link href={generatePostUrl(post.name)}>{post.metadata.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3">{post.metadata.summary}</CardDescription>
              </CardContent>
              <CardFooter className='flex items-center'>
                <div className="flex flex-wrap gap-2">
                  {(post.metadata.tags || []).slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" asChild className="ml-auto group">
                  <Link href={generatePostUrl(post.name)}>
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex justify-center mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: blogs.length * 0.05 + 0.2 }}
      >
        <Button asChild variant="outline">
          <Link href="/blog" className="group">
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}

export const AboutMeSection = () => {
  useEffect(() => {
    // 添加滚动动画触发检测
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  })

  return (
    <section className="py-16 relative animate-on-scroll opacity-0 transition-all duration-700">
      <div className="max-w-4xl mx-auto bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src="/assets/avatar.png" alt={WebsiteProfile.Author} />
              <AvatarFallback>{WebsiteProfile.Author[0]}</AvatarFallback>
            </Avatar>

            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{WebsiteProfile.Author}</h2>
                <p className="text-xl text-primary font-medium">{WebsiteProfile.JobName}</p>
              </div>

              <p className="text-muted-foreground">
                {WebsiteProfile.AboutMe}
              </p>

              <div className="flex gap-3 pt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={WebsiteProfile.Github}>
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Github
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/about">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    About Me
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
