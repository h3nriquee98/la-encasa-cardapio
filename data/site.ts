// Configurações gerais da La Encasa.
// Tudo que muda com frequência (horários, taxa de entrega, contatos, textos) fica aqui.

export type DayHours = { open: string; close: string }[];

export const site = {
  name: "La Encasa",
  fullName: "La Encasa Burguer",
  tagline: "Hamburgueria artesanal em Franca-SP",

  // Defina NEXT_PUBLIC_SITE_URL na hospedagem (ex.: https://www.seudominio.com.br)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  whatsapp: {
    number: "5516993297272", // só números, com DDI 55 + DDD
    display: "(16) 99329-7272",
  },
  phone: {
    number: "551637028531",
    display: "(16) 3702-8531",
  },
  instagram: {
    handle: "@encasala",
    url: "https://www.instagram.com/encasala",
  },
  googleUrl: "https://share.google/G34qDv8XgC1TxjFhZ",

  address: {
    street: "Av. Paulo VI, 1517",
    neighborhood: "Jardim Alvorada",
    city: "Franca",
    state: "SP",
    postalCode: "14403-143",
    oneLine: "Av. Paulo VI, 1517 – Jardim Alvorada, Franca/SP",
  },
  mapsQuery: "La Encasa Burguer, Av. Paulo VI, 1517 - Jardim Alvorada, Franca - SP",

  // Taxa de entrega em reais. Use null para "a combinar" (confirmada pelo WhatsApp).
  deliveryFee: null as number | null,

  // Horário de funcionamento (fuso de Brasília). 0 = domingo ... 6 = sábado.
  // Fechamento "00:00" ou antes da abertura = vira a meia-noite.
  // Fonte: perfil público no Restaurant Guru. CONFIRME com a loja.
  timezone: "America/Sao_Paulo",
  hours: {
    0: [{ open: "18:00", close: "23:00" }],
    1: [{ open: "18:00", close: "23:00" }],
    2: [{ open: "18:00", close: "23:00" }],
    3: [{ open: "18:00", close: "23:00" }],
    4: [{ open: "18:00", close: "23:00" }],
    5: [{ open: "18:00", close: "00:00" }],
    6: [{ open: "18:00", close: "00:00" }],
  } as Record<number, DayHours>,

  // Texto da seção "Sobre" — edite livremente.
  about: [
    "A La Encasa é uma hamburgueria artesanal no Jardim Alvorada, em Franca.",
    "No cardápio tem hambúrguer artesanal de 170 g, bacon artesanal, empanados recheados de queijo, porções para dividir e cerveja gelada. Peça para retirar ou receba em casa.",
  ],
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`;
