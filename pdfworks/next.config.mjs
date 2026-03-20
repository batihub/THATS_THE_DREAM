import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // pdfjs-dist optionally requires 'canvas' (Node.js native module) for
    // server-side rendering. In the browser / worker context we shim it with
    // an empty object so webpack doesn't throw "module not found".
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas:   path.resolve(__dirname, 'src/lib/canvas-shim.js'),
      encoding: false,
    }
    return config
  },
}

export default nextConfig
