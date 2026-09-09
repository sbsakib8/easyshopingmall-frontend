const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5004/api";
const backendOrigin = backendUrl.replace(/\/api\/?$/, "");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://apis.google.com https://www.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' https://fonts.gstatic.com",
      `connect-src 'self' ${backendOrigin} https://api.easyshoppingmallbd.com wss://api.easyshoppingmallbd.com https://easyshoppingmallbd.com wss://easyshoppingmallbd.com https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://www.google-analytics.com https://www.google.com https://res.cloudinary.com https://i.ibb.co`,
      "frame-src 'self' https://www.youtube.com https://easyshoppingmall-48bf0.firebaseapp.com https://*.firebaseapp.com https://*.facebook.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://www.facebook.com",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.easyshoppingmallbd.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "easyshoppingmallbd.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/react-icons/,
      type: "javascript/auto",
    });
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
