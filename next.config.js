/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        return config;
      },
    experimental: {
        // esmExternals: "loose",
        serverComponentsExternalPackages: ["mongoose"] 
    },
    images: {
        domains: ['lh3.googleusercontent.com', "oaidalleapiprodscus.blob.core.windows.net", "localhost"],
        // remotePatterns: [
        //     {
        //       protocol: "http",
        //       hostname: "localhost",
        //       port: "3000",
        //       pathname: "/tarotdeck/**",
        //     }
        //   ]
    }

}

module.exports = nextConfig