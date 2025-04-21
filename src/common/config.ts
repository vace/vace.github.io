import { Metadata } from "next"

// website info
export const WebsiteProfile = {
  URL: 'https://vace.me',
  Author: 'Vace',
  Title: 'Vace | ByteDiary',
  JobName: 'Full Stack Developer',
  Email: 'ocdo@qq.com',
  Github: 'https://github.com/vace',
  // 你好，互联网拾荒者，这里是一个数字游民的数字自留地，记录一些有趣的技术和生活中的点滴。
  Description: 'Hello, Internet scavengers. This is a digital homestead of a digital nomad, recording some interesting technology and bits of life.',
  AboutMe: 'Bonjour! 🥖 I am Vace! A full stack developer from China. This is a digital homestead of a digital nomad, recording some interesting technology and bits of life.',
}

export const MaxTocDepth = 3

export const WebMetadata: Metadata = {
  metadataBase: new URL(WebsiteProfile.URL),
  title: {
    default: WebsiteProfile.Title,
    template: `%s | ${WebsiteProfile.Title}`,
  },
  description: WebsiteProfile.Description,
  openGraph: {
    title: WebsiteProfile.Title,
    description: WebsiteProfile.Description,
    url: WebsiteProfile.URL,
    siteName: WebsiteProfile.Title,
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}