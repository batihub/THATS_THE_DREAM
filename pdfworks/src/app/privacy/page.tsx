'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Trash2, Lock, Eye, Server, Mail } from 'lucide-react'

const sections = [
  {
    icon: ShieldCheck,
    title: 'What we collect',
    body: `We collect only what is necessary to provide the service. When you upload a file, it is temporarily stored on our servers to complete your requested conversion or operation. We do not require you to create an account or provide any personal information to use the tools.`,
  },
  {
    icon: Trash2,
    title: 'File deletion',
    body: `All uploaded files and processed outputs are automatically deleted from our servers within 30 minutes of upload. We do not archive, copy, or retain your files after deletion. No human on our team has access to your file contents.`,
  },
  {
    icon: Lock,
    title: 'Encryption & transit security',
    body: `All file transfers between your browser and our servers are encrypted using HTTPS/TLS. Files processed entirely in your browser (such as image conversions and PDF merging) never leave your device at all.`,
  },
  {
    icon: Eye,
    title: 'No tracking or selling',
    body: `We do not sell, share, or rent your data to any third parties. We do not build profiles of individual users. Basic analytics (page views, tool usage counts) are collected in aggregate and contain no personally identifiable information.`,
  },
  {
    icon: Server,
    title: 'Cookies',
    body: `We use only essential cookies required to operate the site (such as your theme preference). We do not use advertising cookies or third-party tracking pixels.`,
  },
  {
    icon: Mail,
    title: 'Contact',
    body: `If you have questions about this privacy policy or how your data is handled, you can reach us at privacy@pdfworks.io. We aim to respond within 48 hours.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-7 h-7 text-green-500" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Your files are yours. We process them, never store or share them.
            </p>
            <p className="text-xs text-gray-400 mt-4">Last updated: March 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-4.5 h-4.5 text-green-500" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">{s.title}</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.body}</p>
          </motion.div>
        ))}

        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to tools
          </Link>
        </div>
      </div>
    </div>
  )
}
