/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/dashboards/edit-course', // URL asli di Next.js
        destination: '/dashboards/create-course', // URL tujuan di Next.js
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Gunakan 'http' karena localhost biasanya tidak pakai SSL
        hostname: 'localhost',
        port: '3000', // Port sesuai dengan API
        pathname: '/storage/**', // Mengizinkan semua file di dalam folder storage
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
