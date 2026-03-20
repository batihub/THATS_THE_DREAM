import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tools, getToolById } from '@/lib/tools-registry'
import { getCategoryById, getToolsByCategory } from '@/lib/tool-categories'
import ToolClient from './ToolClient'

type Props = { params: { tool: string } }

export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolById(params.tool)
  if (!tool) return {}
  const title = `${tool.name} — Free Online Tool`
  const description = `${tool.description} — Free, no account required, no watermarks. Files deleted after 30 minutes.`
  const url = `https://pdfworks.io${tool.route}`
  return {
    title,
    description,
    keywords: [tool.name, 'free', 'online', 'no signup', 'PDF tool', tool.category],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'PDFworks.io',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@pdfworksio',
      images: ['/og-image.png'],
    },
  }
}

export default function ToolPage({ params }: Props) {
  const tool = getToolById(params.tool)
  if (!tool) notFound()

  const category = getCategoryById(tool.category)
  const related = getToolsByCategory(tool.category)
    .filter((t) => t.id !== tool.id && !t.comingSoon)
    .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `https://pdfworks.io${tool.route}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolClient tool={tool} category={category} relatedTools={related} />
    </>
  )
}
