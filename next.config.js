// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
  dest: 'public',
})

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"]
    });
    return config;
  }
})
