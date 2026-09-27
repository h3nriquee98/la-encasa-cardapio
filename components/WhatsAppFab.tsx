"use client";

import { whatsappLink } from "@/data/site";
import { useOrder } from "./order/OrderProvider";
import { WhatsAppIcon } from "./ui/icons";

export function WhatsAppFab() {
  const { count, hydrated } = useOrder();
  // No celular, sobe quando a barra "Ver pedido" está aparecendo
  const lifted = hydrated && count > 0;
  return (
    <a
      href={whatsappLink("Olá, La Encasa!")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a La Encasa no WhatsApp"
      className={`group fixed right-4 z-40 flex items-center transition-[bottom] duration-300 sm:right-6 ${
        lifted ? "bottom-24 xl:bottom-6" : "bottom-5 sm:bottom-6"
      }`}
    >
      <span className="pointer-events-none mr-3 hidden translate-x-2 rounded-full bg-patty px-4 py-2 text-sm font-semibold whitespace-nowrap text-white opacity-0 shadow-lift transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        Fale com a La Encasa
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_-8px_rgba(37,211,102,0.8)] transition group-hover:scale-105">
        <WhatsAppIcon size={30} />
      </span>
    </a>
  );
}
