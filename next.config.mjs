/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Ignore the Vite src/ directory during Next.js compilation */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
