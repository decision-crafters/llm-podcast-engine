/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure media file handling
  async headers() {
    return [
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/mpeg',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
    ]
  },
  // Enable serving static files from the public directory
  output: 'standalone',
  distDir: 'dist',
  // Configure static file serving
  experimental: {
    serverActions: true,
  },
  // Configure webpack to handle media files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/audio/[name][ext]',
      },
    })
    return config
  },
}

export default nextConfig
