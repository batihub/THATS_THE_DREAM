# PDFworks.io

**Free, private, anonymous PDF and file conversion tools. No account. No tracking. No paywall.**

PDFworks.io is a complete suite of file utilities built on one principle: basic tools should be free, instant, and respect your privacy — no asterisks. We keep the lights on through minimal, non-intrusive advertising.

---

## What It Does

### PDF Tools
| Tool | Description |
|---|---|
| Compress PDF | Reduce file size — Low / Medium / High quality |
| Merge PDF | Combine multiple PDFs into one |
| Split PDF | Extract page ranges into separate files |
| Rotate PDF | Rotate pages 90°, 180°, or 270° |
| Delete PDF Pages | Remove unwanted pages |
| Extract PDF Pages | Pull only the pages you need |
| Protect PDF | Encrypt with a password |
| Unlock PDF | Remove password protection |
| Watermark PDF | Overlay text on every page |
| Number Pages | Add page numbers |
| Flatten PDF | Make annotations permanent |
| Strip PDF Metadata | Remove hidden author/creation data |
| PDF OCR | Make scanned PDFs searchable |

### Convert
| Tool | Description |
|---|---|
| PDF → Word | Export to editable DOCX |
| Word → PDF | Convert DOC/DOCX to PDF |
| PDF → PowerPoint | Convert to editable PPTX |
| PPT → PDF | Convert PPT/PPTX to PDF |
| PDF → Excel | Extract tables to XLSX |
| Excel → PDF | Convert XLS/XLSX to PDF |
| PDF → JPG | Save every page as an image |
| JPG → PDF | Combine images into a PDF |
| HTML → PDF | Convert a webpage or HTML file |
| Markdown → PDF | Convert .md files to PDF |

### Image Tools
| Tool | Description |
|---|---|
| Compress Image | Low / Medium / High quality presets |
| Image Converter | Convert between JPG, PNG, WebP, BMP |
| Resize Image | Scale to exact pixel dimensions |
| Strip EXIF Data | Remove GPS and camera metadata |
| HEIC → JPG | Convert iPhone photos |
| PNG → JPG | Quick format swap |

### Audio Tools
| Tool | Description |
|---|---|
| Audio Converter | Convert between MP3, WAV, OGG, FLAC, M4A, AAC |
| Compress Audio | Low / Medium / High bitrate compression |
| Extract Audio | Pull the audio track from any video as MP3 |

### Video Tools
| Tool | Description |
|---|---|
| Video Converter | Convert between MP4, MKV, MOV, AVI, WebM |
| Compress Video | Low / Medium / High quality compression |

### Document Tools
| Tool | Description |
|---|---|
| OCR (Image → Text) | Extract text from photos and scans |
| CSV → JSON | Convert spreadsheet data to JSON |
| HTML → PDF | Render HTML to PDF |
| Markdown → PDF | Publish Markdown as a PDF |

---

## Privacy

- **No account required** — open a tool and use it. We never ask for an email.
- **Files auto-deleted after 30 minutes** — no long-term storage, ever.
- **No tracking cookies** — we don't fingerprint or profile visitors.
- **No data sold** — we are not in the data business.
- **Ad-supported** — a small, clearly-labeled banner keeps the service free for everyone. No pop-ups. No paywalls. No countdown timers.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     pdfworks/  (Next.js 14)                 │
│  - App Router, TypeScript, Tailwind CSS, framer-motion      │
│  - Client-side PDF processing (pdf-lib + pdfjs-dist WASM)   │
│  - Client-side image/OCR processing                         │
│  - API client → FastAPI backend for heavy conversions       │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP
┌────────────────────────────▼────────────────────────────────┐
│              app/  (FastAPI + Celery + Redis)                │
│  - POST /api/pdf/* /api/image/* /api/audio/* /api/video/*   │
│  - Async job queue: submit → poll → download                │
│  - Workers: default (PDF/image) · heavy (audio/video)       │
│  - Auto-cleanup every 15 min (Celery Beat)                  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  Docker Compose Services                     │
│  api · worker-default · worker-heavy · scheduler            │
│  redis (port 6380) · flower (port 5555)                     │
└─────────────────────────────────────────────────────────────┘
```

**Browser-side processing** (no upload needed for these tools):
- Compress, merge, split, rotate, delete/extract pages, protect, watermark, flatten, number pages
- Image compress, resize, convert, strip EXIF
- OCR (Tesseract.js)

**Server-side processing** (file uploaded, processed, auto-deleted in 30 min):
- Word/PPT/Excel ↔ PDF (LibreOffice headless)
- PDF → Word (pdf2docx)
- PDF → JPG images (poppler / pdf2image)
- HTML / Markdown → PDF (WeasyPrint)
- Audio convert & compress (FFmpeg)
- Video convert & compress (FFmpeg)

---

## Quick Start (Docker)

```bash
git clone https://github.com/batihub/pdfworks
cd pdfworks

# Copy env files and edit as needed
cp .env.example .env

# Start all services
docker compose up --build

# Frontend (Next.js) — separate terminal
cd pdfworks
npm install
npm run dev
```

Backend: http://localhost:8000
Frontend: http://localhost:3000
API docs: http://localhost:8000/docs
Celery monitor: http://localhost:5555

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection string |
| `DATABASE_URL` | SQLite | Async DB for job records |
| `UPLOAD_DIR` | `/tmp/fileconvert/uploads` | Temp upload directory |
| `OUTPUT_DIR` | `/tmp/fileconvert/outputs` | Temp output directory |
| `FILE_TTL_MINUTES` | `30` | Auto-delete after N minutes |
| `MAX_FILE_SIZE_MB` | `50` | Upload size limit |
| `SECRET_KEY` | — | JWT signing key |
| `STRIPE_SECRET_KEY` | — | Optional: Stripe payments |
| `GOOGLE_CLIENT_ID` | — | Optional: Google OAuth |

Frontend (`pdfworks/.env.local`):

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI backend URL |

---

## Tech Stack

**Frontend:** Next.js 14 · TypeScript · Tailwind CSS · framer-motion · pdf-lib · pdfjs-dist · Tesseract.js
**Backend:** FastAPI · Celery · Redis · SQLModel · pypdf · pdf2docx · pdf2image · LibreOffice · FFmpeg · WeasyPrint
**Infrastructure:** Docker Compose · PostgreSQL (prod) / SQLite (dev) · Cloudflare R2 (optional)

---

## License

MIT — see [LICENSE](./LICENSE)

---

*PDFworks.io — Free PDF & File Tools. No signup. No tracking. Built for everyone.*





