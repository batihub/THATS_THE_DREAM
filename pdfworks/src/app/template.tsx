'use client'

import { motion } from 'framer-motion'

/**
 * Next.js App Router template.tsx — re-mounts on every navigation,
 * giving each page a fresh fade-up entrance animation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
