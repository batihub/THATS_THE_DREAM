import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tools — PDFworks.io',
  description:
    'Browse all 51 free tools on PDFworks: compress, merge, split, convert, OCR, resize, and more — for PDFs, images, documents, audio, and video. No account required.',
  openGraph: {
    title: 'All Tools — PDFworks.io',
    description:
      '51 free file tools. No sign-up. No watermarks. No limits. PDFs, images, documents, audio, and video — all in one place.',
    type: 'website',
    url: 'https://pdfworks.io/tools',
    siteName: 'PDFworks.io',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDFworks.io Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tools — PDFworks.io',
    description:
      '51 free file tools. No sign-up. No watermarks. No limits. PDFs, images, documents, audio, and video — all in one place.',
    site: '@pdfworksio',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://pdfworks.io/tools' },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
