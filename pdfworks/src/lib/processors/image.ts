/**
 * Image processor — canvas-based, runs on the main thread.
 * Canvas operations are sub-second for typical images and drawing to a canvas
 * automatically strips all EXIF metadata.
 */

export type ProgressFn = (pct: number, msg: string) => void

const MIME: Record<string, string> = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  bmp:  'image/bmp',
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number, // 0–100
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Image encoding failed'))),
      mimeType,
      quality / 100,
    ),
  )
}

// ─── 13. Compress Image ───────────────────────────────────────────────────────

export async function compressImage(
  file: File,
  quality: number,
  onProgress: ProgressFn,
): Promise<Blob> {
  onProgress(10, 'Loading image…')
  const img = await loadImage(file)

  onProgress(40, 'Applying compression…')
  const canvas = document.createElement('canvas')
  canvas.width  = img.naturalWidth
  canvas.height = img.naturalHeight
  canvas.getContext('2d')!.drawImage(img, 0, 0)

  onProgress(75, 'Encoding…')
  // Always encode as JPEG for maximum compression; fall back to PNG for transparency
  const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const blob = await canvasToBlob(canvas, mimeType, quality)
  onProgress(100, 'Done!')
  // Never return a result larger than the original
  return blob.size < file.size ? blob : file.slice(0, file.size, file.type)
}

// ─── 14. Resize Image ─────────────────────────────────────────────────────────

export async function resizeImage(
  file: File,
  targetWidth: number | null,
  targetHeight: number | null,
  onProgress: ProgressFn,
): Promise<Blob> {
  onProgress(10, 'Loading image…')
  const img = await loadImage(file)

  let w = targetWidth  ?? img.naturalWidth
  let h = targetHeight ?? img.naturalHeight

  // Maintain aspect ratio when only one dimension is given
  if (targetWidth && !targetHeight) {
    h = Math.round((img.naturalHeight / img.naturalWidth) * targetWidth)
  } else if (!targetWidth && targetHeight) {
    w = Math.round((img.naturalWidth / img.naturalHeight) * targetHeight)
  }

  if (w <= 0 || h <= 0) throw new Error('Invalid dimensions — width and height must be positive numbers.')

  onProgress(40, `Resizing to ${w} × ${h} px…`)
  const canvas = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, w, h)

  onProgress(80, 'Encoding…')
  const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const blob = await canvasToBlob(canvas, mimeType, 92)
  onProgress(100, 'Done!')
  return blob
}

// ─── 15. Convert Image ────────────────────────────────────────────────────────

export async function convertImage(
  file: File,
  outputFormat: string,
  onProgress: ProgressFn,
): Promise<Blob> {
  onProgress(10, 'Loading image…')
  const img = await loadImage(file)

  onProgress(40, `Converting to ${outputFormat.toUpperCase()}…`)
  const canvas = document.createElement('canvas')
  canvas.width  = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')!

  // For JPEG output fill with white so transparent areas don't go black
  if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)

  onProgress(75, 'Encoding…')
  const mime    = MIME[outputFormat] ?? 'image/jpeg'
  const quality = (mime === 'image/jpeg') ? 93 : 100
  const blob    = await canvasToBlob(canvas, mime, quality)
  onProgress(100, 'Done!')
  return blob
}

// ─── 16. Strip EXIF ───────────────────────────────────────────────────────────
// Drawing to a canvas and re-encoding discards ALL EXIF/XMP/IPTC metadata.

export async function stripExif(file: File, onProgress: ProgressFn): Promise<Blob> {
  onProgress(10, 'Loading image…')
  const img = await loadImage(file)

  onProgress(50, 'Stripping metadata…')
  const canvas = document.createElement('canvas')
  canvas.width  = img.naturalWidth
  canvas.height = img.naturalHeight
  canvas.getContext('2d')!.drawImage(img, 0, 0)

  onProgress(80, 'Encoding clean image…')
  // Preserve the format where possible; TIFF → JPEG (canvas cannot encode TIFF)
  const srcMime  = file.type
  const outMime  = srcMime === 'image/png' ? 'image/png'
                 : srcMime === 'image/webp' ? 'image/webp'
                 : 'image/jpeg'
  const blob = await canvasToBlob(canvas, outMime, 95)
  onProgress(100, 'Done!')
  return blob
}
