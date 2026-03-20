/**
 * OCR processor — uses Tesseract.js which manages its own Web Worker pool.
 * For PDF OCR each page is rendered to canvas via pdfjs-dist then passed to Tesseract.
 */
import Tesseract from 'tesseract.js'

export type ProgressFn = (pct: number, msg: string) => void

type TesseractLogger = { status: string; progress: number }

// ─── 11. PDF OCR ─────────────────────────────────────────────────────────────

export async function ocrPdf(file: File, onProgress: ProgressFn): Promise<Blob> {
  onProgress(2, 'Loading PDF renderer…')

  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`

  onProgress(5, 'Loading PDF…')
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
  const numPages = pdfDoc.numPages

  const pageTexts: string[] = []

  for (let i = 1; i <= numPages; i++) {
    const pageBasePct = 5 + ((i - 1) / numPages) * 88
    onProgress(pageBasePct, `Rendering page ${i} of ${numPages}…`)

    const page     = await pdfDoc.getPage(i)
    const viewport = page.getViewport({ scale: 2.0 }) // higher scale → better OCR

    const canvas  = document.createElement('canvas')
    canvas.width  = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)

    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise

    const imgBlob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error('Canvas export failed'))),
        'image/png',
      ),
    )

    const result = await Tesseract.recognize(imgBlob, 'eng', {
      logger: (m: TesseractLogger) => {
        if (m.status === 'recognizing text') {
          onProgress(
            pageBasePct + (m.progress * 88) / numPages,
            `OCR page ${i} of ${numPages}: ${Math.round(m.progress * 100)}%`,
          )
        }
      },
    })

    pageTexts.push(`=== Page ${i} ===\n${result.data.text.trim()}`)

    // Yield between pages so the UI can update
    await new Promise<void>((r) => setTimeout(r, 0))
  }

  onProgress(96, 'Compiling text…')
  const text = pageTexts.join('\n\n')
  const blob = new Blob([text], { type: 'text/plain' })
  onProgress(100, 'Done!')
  return blob
}

// ─── 12. OCR: Image to Text ──────────────────────────────────────────────────

export async function ocrImage(file: File, onProgress: ProgressFn): Promise<Blob> {
  onProgress(5, 'Initialising OCR engine…')

  const result = await Tesseract.recognize(file, 'eng', {
    logger: (m: TesseractLogger) => {
      if (m.status === 'recognizing text') {
        onProgress(10 + m.progress * 85, `Recognising text… ${Math.round(m.progress * 100)}%`)
      } else {
        onProgress(8, m.status)
      }
    },
  })

  onProgress(97, 'Building text file…')
  const blob = new Blob([result.data.text], { type: 'text/plain' })
  onProgress(100, 'Done!')
  return blob
}
