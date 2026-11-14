import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Permite enviar fotos de presentes/galeria pelo Painel dos Noivos.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
