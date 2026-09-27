"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { money } from "@/lib/format";
import { OpenStatusPill } from "./OpenStatus";
import { useOrder } from "./order/OrderProvider";
import { BagIcon, WhatsAppIcon } from "./ui/icons";

const LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#sobre", label: "Sobre" },
  { href: "#localizacao", label: "Localização" },
];

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/images/logo.png"
        alt=""
        width={44}
        height={44}
        className="size-10 rounded-full bg-white ring-2 ring-cheddar/70 sm:size-11"
      />
      <span className={`leading-none ${tone === "light" ? "[text-shadow:0_1px_10px_rgb(23_11_6/0.9)]" : ""}`}>
        <span className={`block font-display text-[19px] tracking-tight whitespace-nowrap sm:text-[21px] ${tone === "light" ? "text-white" : "text-patty"}`}>
          La Encasa
        </span>
        <span className={`mt-0.5 block text-[10px] font-semibold tracking-[0.32em] uppercase ${tone === "light" ? "text-cheddar" : "text-cocoa"}`}>
          burguer
        </span>
      </span>
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, subtotal, openCart, hydrated } = useOrder();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        solid ? "bg-paper/95 shadow-[0_1px_0_#f2e2c8,0_10px_30px_-20px_rgba(42,21,12,0.5)] backdrop-blur-md" : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6">
        <a href="#inicio" aria-label="La Encasa — início" onClick={() => setMenuOpen(false)}>
          <Logo tone={solid ? "dark" : "light"} />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                solid ? "text-patty hover:bg-bun" : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {solid && (
            <span className="hidden sm:block">
              <OpenStatusPill showDetail={false} />
            </span>
          )}
          <a
            href="#cardapio"
            className="hidden rounded-full bg-ketchup px-5 py-2.5 text-[15px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(213,43,30,0.7)] transition hover:-translate-y-0.5 hover:bg-ketchup-deep active:translate-y-0 sm:inline-flex"
          >
            Fazer pedido
          </a>
          {hydrated && count > 0 && (
            <button
              type="button"
              onClick={() => openCart()}
              className={`relative flex h-11 items-center gap-2 rounded-full px-3 font-bold transition ${
                solid ? "text-patty hover:bg-bun" : "text-white hover:bg-white/10"
              }`}
              aria-label={`Ver pedido: ${count} ${count === 1 ? "item" : "itens"}, ${money(subtotal)}`}
            >
              <span className="relative">
                <BagIcon size={22} />
                <span className="absolute -top-1.5 -right-2 grid size-[18px] place-items-center rounded-full bg-ketchup text-[10px] font-bold text-white">
                  {count}
                </span>
              </span>
              <span className="tabular hidden text-[15px] lg:inline">{money(subtotal)}</span>
            </button>
          )}
          <button
            type="button"
            className={`grid size-11 place-items-center rounded-full lg:hidden ${solid ? "text-patty hover:bg-bun" : "text-white hover:bg-white/10"}`}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="relative block h-4 w-6" aria-hidden>
              <span className={`absolute left-0 h-[3px] w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-[6.5px] rotate-45" : "top-0"}`} />
              <span className={`absolute top-[6.5px] left-0 h-[3px] w-6 rounded-full bg-cheddar transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-[3px] w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-[6.5px] -rotate-45" : "top-[13px]"}`} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="menu-mobile" className="animate-fade border-t border-crust bg-paper px-4 pt-2 pb-5 lg:hidden">
          <nav aria-label="Menu" className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-crust/70 py-3.5 font-display text-2xl text-patty"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <OpenStatusPill className="self-start" />
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#cardapio"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-ketchup py-3.5 text-center font-bold text-white"
              >
                Fazer pedido
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-patty py-3.5 font-bold text-white"
              >
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </div>
            <p className="text-sm text-cocoa">{site.address.oneLine}</p>
          </div>
        </div>
      )}
    </header>
  );
}
