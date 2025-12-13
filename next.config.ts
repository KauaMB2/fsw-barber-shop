import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // O Next permite configurar onde as imagens devem ser carregadas, oferecendo otimizações, como carregamento sob demanda(lazy loading), otimização de tamanho e formatos de imagem modenos(como WebP).
    remotePatterns: [
      // Configura uma URLs externas de imagens
      {
        // Define https://utfs.io como sendo uma rota de consulta de imagens
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
