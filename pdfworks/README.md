# PDFworks.io

**Free PDF tools for everyone. No accounts. No tracking. No premium.**

PDFworks is a fully free, privacy-first web application that lets anyone compress, merge, split, convert, edit, and process PDFs, images, documents, audio, and video files — directly in the browser, with no sign-up required and no data ever sold.

---

## What is PDFworks?

Most online file tools make you create an account, accept aggressive tracking cookies, and eventually hit a paywall before you can do anything useful. PDFworks was built as the antidote to that.

It is a suite of 50+ tools covering PDFs, images, documents, audio, and video. Every single tool is free. No feature is hidden behind a premium tier. No email is required. Files are automatically deleted from the server within 30 minutes. Many operations run entirely in your browser using WebAssembly, meaning your files never even leave your device.

We keep the lights on with small, clearly labeled, non-intrusive advertising. That is the entire business model.

---

## PDFworks vs The Alternatives

| Feature | PDFworks | ILovePDF / Smallpdf / Adobe |
|---|---|---|
| Price | Free forever | $12–20/month for full access |
| Account required | No | Yes |
| Tracking & analytics | None | Extensive |
| File storage | Auto-deleted within 30 min | Stored indefinitely |
| Premium tier | Does not exist | Required for most features |
| Ads | Minimal, non-intrusive | Aggressive pop-ups and upsells |
| Watermarks on output | Never | Yes, on free tier |
| File size limits | None | 25–200 MB on free tier |

---

## Tools Available

### PDF Tools — 22 tools
Compress, merge, split, rotate, delete pages, extract pages, watermark, protect, unlock, flatten, OCR, annotate, fill forms, read, crop, redact, sign, organize, and number pages.

### Convert — 10 tools
PDF to Word, Word to PDF, PDF to PowerPoint, PowerPoint to PDF, PDF to Excel, Excel to PDF, PDF to JPG, JPG to PDF, HTML to PDF, Markdown to PDF.

### AI Tools — 5 tools
Chat with PDF, AI PDF Summarizer, AI PDF Assistant, AI Question Generator, Translate PDF.

### Image Tools — 6 tools
Convert & Compress, HEIC to JPG, Resize Image, Strip EXIF Data, JPG to PNG, PNG to JPG, WebP Converter, Image Cropper.

### Document Tools — 3 tools
OCR: Image to Text, CSV to JSON, Markdown Editor.

### Audio Tools — 3 tools
Audio Converter (MP3/WAV/OGG), Compress Audio, Extract Audio from Video.

### Video Tools — 2 tools
Video Converter (MP4/MKV/MOV), Compress Video.

> **Total: 51 tools** — 46 live, 5 coming soon.

---

## Privacy

PDFworks was designed from the ground up with privacy as the default, not an afterthought.

- **Zero accounts.** No sign-up, no email address, no user profile — ever. Open the site and start working.
- **No tracking cookies.** No analytics fingerprinting, no third-party trackers, no session surveillance.
- **Auto-deletion.** Any file that reaches our servers is permanently and irreversibly deleted within 30 minutes. We do not keep copies.
- **Browser-first processing.** Many operations — including PDF manipulation, image processing, and OCR — run entirely in your browser via WebAssembly. Your files never leave your device.
- **No data sold.** We have no user database because we do not want one.

---

## How We Stay Free

Running servers costs money. We cover operating costs through minimal, non-intrusive advertising — a single banner, clearly marked "Advertisement", placed unobtrusively on pages.

You will **never** see:
- Pop-ups that block your workflow
- Countdown timers forcing you to watch something
- "Upgrade to Premium" banners
- Dark patterns designed to trick you into paying

You **will** see:
- A small, static ad banner — usually at the bottom of the page. That is it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router, static generation) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| PDF processing | [pdf-lib](https://pdf-lib.js.org), [pdfjs-dist](https://mozilla.github.io/pdf.js) |
| OCR | [Tesseract.js](https://tesseract.projectnaptha.com) |
| Document parsing | [mammoth](https://github.com/mwilliamson/mammoth.js) (DOCX), [xlsx](https://sheetjs.com) (spreadsheets), [jsPDF](https://parall.ax/products/jspdf) |
| File utilities | [react-dropzone](https://react-dropzone.js.org), [file-saver](https://github.com/eligrey/FileSaver.js) |
| Icons | [Lucide React](https://lucide.dev) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |

---

## Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/batihub/pdfworks.git
cd pdfworks

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure

```
src/
├── app/
│   ├── about/          # About page
│   ├── tools/
│   │   ├── page.tsx    # All tools browser with search + category filter
│   │   └── [tool]/     # Individual tool pages (51 static routes)
│   ├── layout.tsx      # Root layout (Navbar, Footer, ThemeProvider)
│   ├── template.tsx    # Page transition wrapper
│   └── page.tsx        # Homepage
├── components/
│   ├── Navbar.tsx      # Navigation with mega-dropdown and mobile drawer
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx
│   └── ToolIcon.tsx    # Dynamic Lucide icon resolver
└── lib/
    ├── tools-registry.ts    # Single source of truth for all 51 tools
    └── tool-categories.ts   # Category definitions and helpers
```

### Adding a New Tool

The only file you need to edit is `src/lib/tools-registry.ts`. Add an entry to the `tools` array:

```ts
{
  id: 'my-new-tool',
  name: 'My New Tool',
  description: 'What this tool does in one sentence.',
  category: 'pdf',         // pdf | convert | ai | image | document | audio | video
  icon: 'FileText',        // any Lucide icon name
  color: '#e74c3c',        // hex accent (typically matches category color)
  comingSoon: false,
  route: '/tools/my-new-tool',
},
```

The tool immediately appears in the All Tools browser, the Navbar mega-dropdown, the category page, and gets its own statically generated route — no other changes required.

---

## Contributing

Contributions are welcome. If you find a bug, have a feature request, or want to add a new tool:

1. [Open an issue](https://github.com/batihub/pdfworks/issues) describing what you want to change
2. Fork the repository and create a branch: `git checkout -b feature/my-feature`
3. Make your changes and verify with `npm run lint` and `npm run build`
4. Open a pull request with a clear description of what you changed and why

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

You are free to use, modify, and distribute this code. If you build something with it, a mention is appreciated but not required.

---

*PDFworks.io — Your PDFs. Your Privacy. No Compromises.*
