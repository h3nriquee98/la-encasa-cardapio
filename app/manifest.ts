import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Encasa Burguer — Cardápio",
    short_name: "La Encasa",
    description: "Cardápio digital e pedidos pelo WhatsApp da La Encasa, hamburgueria artesanal em Franca-SP.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf2",
    theme_color: "#170b06",
    lang: "pt-BR",
    icons: [
      { src: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
