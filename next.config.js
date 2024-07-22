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
      },
      {
        source: '/reports',
        destination: '/reports/transactions',
        permanent: true
      },
      {
        source: '/admin',
        destination: '/admin/staff',
        permanent: true
      },
      {
        source: '/expenses',
        destination: '/expenses/add',
        permanent: true
      },
      {
        source: '/summary',
        destination: '/summary/financial',
        permanent: true
      },
    ]
  }
}

module.exports = nextConfig
