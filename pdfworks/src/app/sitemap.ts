import type { MetadataRoute } from 'next'
import { tools } from '@/lib/tools-registry'

const BASE = 'https://pdfworks.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const tool_pages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${BASE}${t.route}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: t.comingSoon ? 0.3 : 0.8,
  }))

  return [...static_pages, ...tool_pages]
}
