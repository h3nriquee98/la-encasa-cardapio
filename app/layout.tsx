import type { Metadata, Viewport } from "next";
import { Figtree, IBM_Plex_Mono, Ultra } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const ultra = Ultra({ weight: "400", subsets: ["latin"], variable: "--font-ultra", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const plexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = "La Encasa Burguer | Hamburgueria artesanal em Franca-SP · Delivery";
const description =
  "Cardápio digital da La Encasa, hamburgueria artesanal em Franca-SP. Hambúrguer artesanal de 170 g, porções, combos e bebidas. Monte seu pedido e envie pelo WhatsApp — delivery ou retirada na Av. Paulo VI, 1517.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | La Encasa Burguer" },
  description,
  applicationName: site.fullName,
  keywords: [
    "La Encasa Franca",
    "La Encasa Burguer",
    "La Encasa Burger",
    "hambúrguer Franca",
    "hamburgueria Franca",
    "hambúrguer artesanal Franca",
    "delivery de hambúrguer Franca",
    "lanche Franca SP",
    "Jardim Alvorada Franca",
  ],
  alternates: { canonical: `${site.url}/` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${site.url}/`,
    siteName: site.fullName,
    title,
    description,
    images: [{ url: `${site.url}/images/og.jpg`, width: 1200, height: 630, alt: "Hambúrguer artesanal da La Encasa" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${site.url}/images/og.jpg`],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#170b06",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${site.url}/#restaurant`,
  name: site.fullName,
  alternateName: ["La Encasa", "La Encasa Burger"],
  url: site.url,
  image: [`${site.url}/images/og.jpg`, `${site.url}/images/logo.png`],
  logo: `${site.url}/images/logo.png`,
  telephone: "+55-16-99329-7272",
  servesCuisine: ["Hambúrguer", "Hambúrguer artesanal", "Lanches", "Porções"],
  priceRange: "R$",
  menu: `${site.url}/#cardapio`,
  acceptsReservations: false,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street} - ${site.address.neighborhood}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
    addressCountry: "BR",
  },
  areaServed: { "@type": "City", name: "Franca" },
  sameAs: [site.instagram.url],
  openingHoursSpecification: Object.entries(site.hours).flatMap(([day, spans]) =>
    spans.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayNames[Number(day)],
      opens: s.open,
      closes: s.close,
    })),
  ),
  potentialAction: {
    "@type": "OrderAction",
    target: `https://wa.me/${site.whatsapp.number}`,
    deliveryMethod: ["http://purl.org/goodrelations/v1#DeliveryModeOwnFleet", "http://purl.org/goodrelations/v1#DeliveryModePickUp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${ultra.variable} ${figtree.variable} ${plexMono.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
