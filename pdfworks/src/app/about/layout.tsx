import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About PDFworks.io — Free, Private, No Accounts. Ever.',
  description:
    'PDFworks is a fully free, privacy-first file tool suite. No accounts, no tracking, no upsells — just 51 tools for PDFs, images, documents, audio, and video. Learn who built it and why.',
  openGraph: {
    title: 'About PDFworks.io — Free, Private, No Accounts. Ever.',
    description:
      'No sign-up. No tracking. No premium tier. PDFworks gives you 51 powerful file tools completely free, with files auto-deleted within 30 minutes.',
    type: 'website',
    url: 'https://pdfworks.io/about',
    siteName: 'PDFworks.io',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDFworks.io' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PDFworks.io — Free, Private, No Accounts. Ever.',
    description:
      'No sign-up. No tracking. No premium tier. PDFworks gives you 51 powerful file tools completely free, with files auto-deleted within 30 minutes.',
    site: '@pdfworksio',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://pdfworks.io/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
