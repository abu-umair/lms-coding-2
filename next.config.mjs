/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/dashboards/instructor/edit-course', // URL asli di Next.js
        destination: '/dashboards/instructor/create-course', // URL tujuan di Next.js
      },
    ];
  },
  images: {
    remotePatterns: [
      //! local 
      {
        protocol: 'http', // Gunakan 'http' karena localhost biasanya tidak pakai SSL
        hostname: 'localhost',
        port: '3000', // Port sesuai dengan API
        pathname: '/storage/**', // Mengizinkan semua file di dalam folder storage
      },
      //! production
      {
        protocol: 'https',
        hostname: 'api.nusavia.id',
        pathname: '/storage/**',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
