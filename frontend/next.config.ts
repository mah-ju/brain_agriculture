import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Desabilita ESLint durante o build (já que estamos usando eslint-disable nos lugares necessários)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Continua verificando TypeScript durante o build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
