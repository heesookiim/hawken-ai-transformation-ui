/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance options
  poweredByHeader: false,
  generateEtags: false,
  
  // Image configuration for normal Next.js
  images: {
    domains: ['ui.public', 'localhost', 'hawken-ai-transformation-27d8ee0ab1a5.herokuapp.com'],
  },
  
  // Build error handling
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add CORS headers for API routes if needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 