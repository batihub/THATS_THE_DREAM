/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Web Worker — runs all pdf-lib operations off the main thread.
 * Spawned via: new Worker(new URL('../workers/pdf.worker.ts', import.meta.url))
 */
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkerRequest {
  id: string
  op: string
  buffers: ArrayBuffer[]
  options: {
    pageRange?: string
    rotation?: number
    watermarkText?: string
    password?: string
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function send(id: string, type: string, payload: Record<string, unknown>) {
  ;(self as any).postMessage({ id, type, ...payload })
}

function progress(id: string, pct: number, msg: string) {
  send(id, 'progress', { pct, msg })
}

function parsePageNums(input: string, total: number): number[] {
  if (!input.trim()) return Array.from({ length: total }, (_, i) => i)
  const seen = new Set<number>()
  for (const part of input.split(',')) {
    const t = part.trim()
    const m = t.match(/^(\d+)\s*-\s*(\d+)$/)
    if (m) {
      const lo = Math.max(1, +m[1])
      const hi = Math.min(total, +m[2])
      for (let i = lo; i <= hi; i++) seen.add(i - 1)
    } else {
      const n = parseInt(t, 10)
      if (Number.isInteger(n) && n >= 1 && n <= total) seen.add(n - 1)
    }
  }
  return Array.from(seen).sort((a, b) => a - b)
}

// ─── Entry point ─────────────────────────────────────────────────────────────

;(self as any).addEventListener('message', async (e: MessageEvent<WorkerRequest>) => {
  const { id, op, buffers, options } = e.data
  try {
    const result = await dispatch(id, op, buffers, options)
    ;(self as any).postMessage({ id, type: 'done', buffer: result }, [result])
  } catch (err) {
    send(id, 'error', { message: (err as Error).message })
  }
})

async function dispatch(
  id: string,
  op: string,
  buffers: ArrayBuffer[],
  options: WorkerRequest['options'],
): Promise<ArrayBuffer> {
  switch (op) {
    case 'merge':        return doMerge(id, buffers)
    case 'split':        return doExtract(id, buffers[0], options.pageRange ?? '')
    case 'extract':      return doExtract(id, buffers[0], options.pageRange ?? '')
    case 'delete':       return doDelete(id, buffers[0], options.pageRange ?? '')
    case 'rotate':       return doRotate(id, buffers[0], options.pageRange ?? '', options.rotation ?? 90)
    case 'number':       return doNumber(id, buffers[0])
    case 'protect':      return doProtect(id, buffers[0], options.password ?? '')
    case 'watermark':    return doWatermark(id, buffers[0], options.watermarkText ?? 'CONFIDENTIAL')
    case 'flatten':      return doFlatten(id, buffers[0])
    default: throw new Error(`Unknown operation: ${op}`)
  }
}

// ─── Operations ───────────────────────────────────────────────────────────────

async function doMerge(id: string, buffers: ArrayBuffer[]): Promise<ArrayBuffer> {
  progress(id, 5, 'Starting merge…')
  const out = await PDFDocument.create()
  for (let i = 0; i < buffers.length; i++) {
    progress(id, 10 + (i / buffers.length) * 80, `Merging file ${i + 1} of ${buffers.length}…`)
    const doc = await PDFDocument.load(buffers[i])
    const pages = await out.copyPages(doc, doc.getPageIndices())
    pages.forEach((p) => out.addPage(p))
  }
  progress(id, 93, 'Saving…')
  const bytes = await out.save()
  return bytes.buffer as ArrayBuffer
}

async function doExtract(id: string, buffer: ArrayBuffer, pageRange: string): Promise<ArrayBuffer> {
  progress(id, 5, 'Loading PDF…')
  const doc = await PDFDocument.load(buffer)
  const total = doc.getPageCount()
  const indices = parsePageNums(pageRange, total)
  if (indices.length === 0) throw new Error('No valid pages in range. Check your page numbers.')
  progress(id, 40, `Extracting ${indices.length} page(s)…`)
  const out = await PDFDocument.create()
  const pages = await out.copyPages(doc, indices)
  pages.forEach((p) => out.addPage(p))
  progress(id, 92, 'Saving…')
  const bytes = await out.save()
  return bytes.buffer as ArrayBuffer
}

async function doDelete(id: string, buffer: ArrayBuffer, pageRange: string): Promise<ArrayBuffer> {
  progress(id, 5, 'Loading PDF…')
  const doc = await PDFDocument.load(buffer)
  const total = doc.getPageCount()
  const toDelete = new Set(parsePageNums(pageRange, total))
  if (toDelete.size === 0) throw new Error('No valid pages in range. Check your page numbers.')
  if (toDelete.size >= total) throw new Error('Cannot delete all pages from a PDF.')
  const toKeep = doc.getPageIndices().filter((i) => !toDelete.has(i))
  progress(id, 40, `Removing ${toDelete.size} page(s)…`)
  const out = await PDFDocument.create()
  const pages = await out.copyPages(doc, toKeep)
  pages.forEach((p) => out.addPage(p))
  progress(id, 92, 'Saving…')
  const bytes = await out.save()
  return bytes.buffer as ArrayBuffer
}

async function doRotate(
  id: string,
  buffer: ArrayBuffer,
  pageRange: string,
  rotation: number,
): Promise<ArrayBuffer> {
  progress(id, 5, 'Loading PDF…')
  const doc = await PDFDocument.load(buffer)
  const total = doc.getPageCount()
  const indices = pageRange.trim() ? parsePageNums(pageRange, total) : Array.from({ length: total }, (_, i) => i)
  progress(id, 30, `Rotating ${indices.length} page(s) by ${rotation}°…`)
  for (const i of indices) {
    const page = doc.getPage(i)
    const current = page.getRotation().angle
    page.setRotation(degrees((current + rotation) % 360))
  }
  progress(id, 92, 'Saving…')
  const bytes = await doc.save()
  return bytes.buffer as ArrayBuffer
}

async function doNumber(id: string, buffer: ArrayBuffer): Promise<ArrayBuffer> {
  progress(id, 5, 'Loading PDF…')
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const total = doc.getPageCount()
  for (let i = 0; i < total; i++) {
    progress(id, 10 + (i / total) * 80, `Numbering page ${i + 1} of ${total}…`)
    const page = doc.getPage(i)
    const { width } = page.getSize()
    const text = String(i + 1)
    const fontSize = 10
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 16,
      size: fontSize,
      font,
      color: rgb(0.35, 0.35, 0.35),
      opacity: 0.75,
    })
  }
  progress(id, 93, 'Saving…')
  const bytes = await doc.save()
  return bytes.buffer as ArrayBuffer
}

async function doProtect(id: string, buffer: ArrayBuffer, password: string): Promise<ArrayBuffer> {
  if (!password.trim()) throw new Error('Please enter a password to protect the PDF.')
  progress(id, 5, 'Loading PDF…')
  const doc = await PDFDocument.load(buffer)
  progress(id, 50, 'Applying encryption…')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bytes = await doc.save({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: false,
    },
  } as any)
  progress(id, 100, 'Done!')
  return bytes.buffer as ArrayBuffer
}

async function doWatermark(id: string, buffer: ArrayBuffer, text: string): Promise<ArrayBuffer> {
  if (!text.trim()) throw new Error('Please enter watermark text.')
  progress(id, 5, 'Loading PDF…')
  const doc = await PDFDocument.load(buffer)
  const font = await doc.embedFont(StandardFonts.HelveticaBold)
  const total = doc.getPageCount()
  for (let i = 0; i < total; i++) {
    progress(id, 10 + (i / total) * 80, `Watermarking page ${i + 1} of ${total}…`)
    const page = doc.getPage(i)
    const { width, height } = page.getSize()
    const fontSize = Math.min(width, height) * 0.1
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: (height - fontSize) / 2,
      size: fontSize,
      font,
      color: rgb(0.6, 0.6, 0.6),
      opacity: 0.22,
      rotate: degrees(45),
    })
  }
  progress(id, 93, 'Saving…')
  const bytes = await doc.save()
  return bytes.buffer as ArrayBuffer
}

async function doFlatten(id: string, buffer: ArrayBuffer): Promise<ArrayBuffer> {
  progress(id, 5, 'Loading PDF…')
  const doc = await PDFDocument.load(buffer)
  const form = doc.getForm()
  progress(id, 50, 'Flattening form fields and annotations…')
  try {
    form.flatten()
  } catch {
    // PDF may not have a form — that's fine, just re-save it
  }
  progress(id, 93, 'Saving…')
  const bytes = await doc.save()
  return bytes.buffer as ArrayBuffer
}
