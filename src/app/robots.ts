import { WebsiteProfile } from "@/common/config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${WebsiteProfile.URL}/sitemap.xml`,
  }
}
