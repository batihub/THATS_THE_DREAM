'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView, animate } from 'framer-motion'
import type { MotionProps } from 'framer-motion'
import {
  ShieldCheck, Sparkles, Zap, X, CheckCircle,
  Mail, ArrowRight, Globe, Lock, Heart, Github,
} from 'lucide-react'
import { categories, totalToolCount } from '@/lib/tool-categories'
import { ToolIcon } from '@/components/ToolIcon'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

// ─── Animation presets ────────────────────────────────────────────────────────

const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut' as const },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: 'easeOut' as const } },
}

// ─── Counter ──────────────────────────────────────────────────────────────────

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(0, to, {
      duration: to === 0 ? 0 : 1.8,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = Math.round(v) + suffix
      },
    })
    return controls.stop
  }, [inView, to, suffix])

  return <span ref={ref}>{to + suffix}</span>
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      {...fadeUp}
      className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4"
    >
      {children}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — HERO
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gray-950 border-b border-gray-800/60">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient blobs */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '-10%',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155,89,182,0.13) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 22, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: '-20%',
          right: '-8%',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,152,219,0.1) 0%, transparent 70%)',
        }}
        animate={{ x: [0, -20, 0], y: [0, 24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '40%',
          left: '55%',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(231,76,60,0.07) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' as const }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">
            <Heart className="w-3.5 h-3.5" />
            About PDFworks
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight mb-6">
            We Built PDFworks Because{' '}
            <span
              className="bg-clip-text text-transparent animate-gradient"
              style={{
                backgroundImage: 'linear-gradient(90deg, #9b59b6, #3498db, #2ecc71, #e74c3c, #9b59b6)',
              }}
            >
              PDF Tools Should Not Cost Money
            </span>
            {' '}— Or Your Privacy
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A complete suite of free tools built on one principle: basic utilities should be private, instant, and
            available to everyone — no asterisks.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-gray-700 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-gray-600" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — OUR STORY
// ─────────────────────────────────────────────────────────────────────────────

function StorySection() {
  const storyPillars = [
    { label: 'Completely free',    sub: 'No premium tiers or hidden costs' },
    { label: 'Fully anonymous',    sub: 'No email or name ever required' },
    { label: 'Privacy-first',      sub: 'Files auto-deleted within 30 minutes' },
    { label: 'No account needed',  sub: 'Open the site and start working' },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start">

          {/* Left: sticky label + decorative quote */}
          <motion.div {...fadeUp} className="lg:sticky lg:top-28">
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="text-3xl font-black text-white leading-tight">
              Born out of<br />
              <span className="text-gray-600">frustration.</span>
            </h2>
            {/* Giant decorative quote */}
            <div
              aria-hidden="true"
              className="mt-6 font-black select-none leading-none"
              style={{ fontSize: 140, color: 'rgba(155,89,182,0.12)', lineHeight: 1 }}
            >
              &ldquo;
            </div>
          </motion.div>

          {/* Right: story text */}
          <div className="space-y-6 text-base leading-relaxed">
            <motion.p {...fadeUp} className="text-gray-300 text-lg">
              PDFworks.io was born out of frustration. Every time we needed to compress a PDF or merge a few
              documents, we would land on a site that demanded an email, pushed a{' '}
              <span className="text-white font-semibold">$12/month subscription</span>, or plastered the screen
              with aggressive pop-ups. We thought: <span className="text-white font-medium italic">this is absurd.</span>
            </motion.p>

            <motion.p
              {...fadeUp}
              className="text-gray-500"
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' as const }}
            >
              PDF manipulation is not rocket science. These are basic utilities that everyone needs — students,
              freelancers, small business owners, teachers, developers. Why should anyone pay a premium or hand over
              personal data for something so fundamental?
            </motion.p>

            <motion.p
              {...fadeUp}
              className="text-gray-400 font-medium text-lg"
              transition={{ duration: 0.55, delay: 0.14, ease: 'easeOut' as const }}
            >
              So we built PDFworks.
            </motion.p>

            {/* Pillars grid */}
            <motion.div
              className="grid sm:grid-cols-2 gap-3 pt-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={containerVariants}
            >
              {storyPillars.map((p) => (
                <motion.div
                  key={p.label}
                  variants={itemVariants}
                  className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors duration-200"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-semibold">{p.label}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{p.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — HOW WE SUSTAIN THIS
// ─────────────────────────────────────────────────────────────────────────────

function SustainSection() {
  const wontSee = [
    'Pop-up ads that block your workflow',
    'Countdown timers forcing you to watch something',
    '"Upgrade to Premium" banners every 5 seconds',
    'Dark patterns designed to trick you into paying',
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-28 border-y border-gray-800/60 bg-gray-900/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>How We Sustain This</SectionLabel>
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl font-black text-white mb-5 tracking-tight"
          >
            We keep the lights on with ads.{' '}
            <span className="text-gray-600">Small ones. That&apos;s it.</span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-gray-500 max-w-2xl mx-auto leading-relaxed"
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' as const }}
          >
            Running servers costs money, and we are transparent about how we keep the lights on:
            minimal, non-intrusive advertising. We believe in respecting our users.
            You came here to get work done, not to be a product.
          </motion.p>
        </div>

        {/* Two-panel comparison */}
        <motion.div
          className="grid md:grid-cols-2 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
        >
          {/* Won't see */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-900 border border-red-500/20 rounded-2xl p-7"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-red-400 mb-6 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center">
                <X className="w-3 h-3" />
              </span>
              You will NOT see
            </h3>
            <ul className="space-y-3.5">
              {wontSee.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                  <X className="w-4 h-4 text-red-500/50 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Will see */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-900 border border-green-500/20 rounded-2xl p-7 flex flex-col"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-green-400 mb-6 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle className="w-3 h-3" />
              </span>
              You WILL see
            </h3>
            <div className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed mb-auto">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p>
                A small, clearly labeled{' '}
                <span className="text-white font-semibold">ad banner</span> — usually at the bottom of
                the page.
                <br /><br />
                That is it. Seriously.
              </p>
            </div>

            {/* Mock ad preview */}
            <div className="mt-8 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border-b border-gray-700/50">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
                  Advertisement
                </span>
                <span className="ml-auto text-[10px] text-gray-700">Keeping PDFworks free</span>
              </div>
              <div className="h-14 flex items-center justify-center bg-gray-900/50">
                <p className="text-xs text-gray-700 italic select-none">Ad space · honest &amp; minimal</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — WHAT WE OFFER
// ─────────────────────────────────────────────────────────────────────────────

function StatsSection() {
  const stats = [
    {
      value: totalToolCount, suffix: '+',
      label: 'Tools',
      sub: 'PDFs, images, documents, audio & video',
      color: '#9b59b6',
    },
    {
      value: 7, suffix: '',
      label: 'Categories',
      sub: 'Find what you need in seconds',
      color: '#3498db',
    },
    {
      value: 0, suffix: '',
      label: 'Accounts Required',
      sub: 'No sign-up, no email, no tracking',
      color: '#2ecc71',
    },
    {
      value: 0, suffix: '',
      label: 'Tracking',
      sub: 'No analytics cookies, no user profiles',
      color: '#e74c3c',
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <SectionLabel>What We Offer</SectionLabel>
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Everything you need.{' '}
            <span className="text-gray-600">Nothing you don&apos;t.</span>
          </motion.h2>
        </div>

        {/* Counter cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
        >
          {stats.map((s) => {
            const rgb = hexToRgb(s.color)
            return (
              <motion.div
                key={s.label}
                variants={itemVariants}
                className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center overflow-hidden group hover:border-gray-700 transition-colors duration-300"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(${rgb}, 0.08), transparent 70%)` }}
                />
                <div
                  className="text-5xl font-black mb-2"
                  style={{ color: s.color }}
                >
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm font-bold text-white mb-1.5">{s.label}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{s.sub}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Category list */}
        <motion.h3
          {...fadeUp}
          className="text-sm font-bold text-gray-500 uppercase tracking-[0.18em] mb-5"
        >
          Browse by category
        </motion.h3>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
        >
          {categories.map((cat) => {
            const rgb = hexToRgb(cat.color)
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  href="/tools"
                  className="group flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4 transition-all duration-200 hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `rgba(${rgb}, 0.12)`, color: cat.color }}
                  >
                    <ToolIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{cat.name}</p>
                    <p className="text-gray-600 text-xs">{cat.toolCount} tools · {cat.description.split(' ').slice(0, 6).join(' ')}…</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — OUR VALUES
// ─────────────────────────────────────────────────────────────────────────────

function ValuesSection() {
  type ValueItem = { Icon: React.ElementType; color: string; title: string; body: string }

  const values: ValueItem[] = [
    {
      Icon: ShieldCheck,
      color: '#2ecc71',
      title: 'Privacy is a Right, Not a Feature',
      body: 'We do not collect, store, or sell any user data. Your files are processed and deleted. We have no user database because we do not want one.',
    },
    {
      Icon: Sparkles,
      color: '#9b59b6',
      title: 'Free Means Free',
      body: 'No asterisks, no trial periods, no "free for 3 pages." Every tool works fully, every time, for everyone.',
    },
    {
      Icon: Zap,
      color: '#f39c12',
      title: 'Respect Your Time',
      body: 'No mandatory sign-ups, no email verifications, no "create an account to download." Upload, process, download. Done.',
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-28 border-y border-gray-800/60 bg-gray-900/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <SectionLabel>Our Values</SectionLabel>
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What we actually believe in.
          </motion.h2>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
        >
          {values.map((v) => {
            const { Icon } = v
            const rgb = hexToRgb(v.color)
            return (
              <motion.div
                key={v.title}
                variants={itemVariants}
                className="relative bg-gray-900 border border-gray-800 rounded-2xl p-7 overflow-hidden group hover:border-gray-700 transition-colors duration-300"
              >
                {/* Hover accent glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(${rgb}, 0.07), transparent 65%)` }}
                />

                {/* Animated icon */}
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `rgba(${rgb}, 0.12)`, color: v.color }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                <h3 className="text-white font-bold text-base mb-3 leading-snug">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — TECH STACK
// ─────────────────────────────────────────────────────────────────────────────

function TechSection() {
  const techBadges = [
    'Next.js 14', 'TypeScript', 'WebAssembly', 'Tailwind CSS',
    'FastAPI', 'Celery', 'Redis', 'framer-motion',
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <SectionLabel>Under the Hood</SectionLabel>
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Built with the modern web.
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed"
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' as const }}
          >
            PDFworks is built with modern web technologies designed to keep your data on your device
            whenever possible.
          </motion.p>
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' as const }}
          className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800/80">

            {/* Browser-side */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">In Your Browser</p>
                  <p className="text-gray-600 text-xs">WebAssembly + JavaScript</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Many operations run directly in your browser using{' '}
                <span className="text-white font-medium">WebAssembly</span> and JavaScript, meaning your files often{' '}
                <span className="text-white font-medium">never even leave your device</span>.
                Zero network exposure, zero server involvement.
              </p>
            </div>

            {/* Server-side */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">On Our Servers</p>
                  <p className="text-gray-600 text-xs">Isolated · Encrypted · Auto-deleted</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                For operations that require server processing, files are handled in{' '}
                <span className="text-white font-medium">isolated environments</span> and permanently deleted within{' '}
                <span className="text-white font-medium">30 minutes</span> — no exceptions.
              </p>
            </div>

          </div>

          {/* Tech badge strip */}
          <div className="px-8 py-4 border-t border-gray-800/80 bg-gray-900/40 flex flex-wrap gap-2">
            {techBadges.map((t) => (
              <span
                key={t}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700/60"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — CONTACT
// ─────────────────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 border-t border-gray-800/60 bg-gray-900/20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <motion.div {...fadeUp} className="mb-12">
          <SectionLabel>Get in Touch</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            We&apos;d love to hear from you.
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Have feedback, feature requests, or found a bug?{' '}
            <span className="text-gray-300">We read every message.</span>
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
        >
          <motion.a
            variants={itemVariants}
            href="mailto:hello@pdfworks.io"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5"
          >
            <Mail className="w-4 h-4" />
            hello@pdfworks.io
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </motion.a>

          <motion.a
            variants={itemVariants}
            href="https://github.com/batihub"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold text-sm border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Github className="w-4 h-4" />
            GitHub
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </motion.a>
        </motion.div>

        {/* Bottom footnote */}
        <motion.p
          {...fadeUp}
          className="mt-16 text-xs text-gray-700 leading-relaxed"
          transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' as const }}
        >
          PDFworks.io — Free PDF & File Tools. No signup. No tracking.
          <br />
          Built with care for everyone who just needs to get things done.
        </motion.p>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <HeroSection />
      <StorySection />
      <SustainSection />
      <StatsSection />
      <ValuesSection />
      <TechSection />
      <ContactSection />
    </div>
  )
}
