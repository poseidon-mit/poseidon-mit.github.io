import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/*
 * The Vite project keeps route components in src/pages/.
 * Next.js auto-detects this as a Pages Router directory and errors because
 * app/ (App Router) is at the project root while pages/ is under src/.
 *
 * Fix: temporarily rename src/pages/ during build so Next.js only sees app/.
 * This is a build-time workaround for the v0 preview branch only.
 */
const srcPages = path.join(__dirname, 'src', 'pages')
const srcPagesRenamed = path.join(__dirname, 'src', '_pages_vite')

if (fs.existsSync(srcPages)) {
  fs.renameSync(srcPages, srcPagesRenamed)
  process.on('exit', () => {
    if (fs.existsSync(srcPagesRenamed)) {
      fs.renameSync(srcPagesRenamed, srcPages)
    }
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    return config
  },
}

export default nextConfig
