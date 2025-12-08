/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
        // OR (older syntax)
        // domains: ["res.cloudinary.com"],
    },
};

export default nextConfig;
