/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/patrons/:patronId/misc',
        destination: '/patrons/:patronId/misc/dd',
        permanent: true
      },
      {
        source: '/patrons',
        destination: '/patrons/search',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
