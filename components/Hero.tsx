import Image from "next/image";
import { whatsappLink } from "@/data/site";
import { OpenStatusPill } from "./OpenStatus";
import { BurgerIcon, PinIcon, ScooterIcon, WhatsAppIcon } from "./ui/icons";
import heroImage from "@/public/images/hero.jpg";

const FACTS = [
  { Icon: BurgerIcon, label: "Hambúrguer artesanal" },
  { Icon: ScooterIcon, label: "Delivery" },
  { Icon: PinIcon, label: "Franca - SP" },
];

// Uma linha por elemento: o título tem sempre 3 linhas, em qualquer tela.
const TITLE = ["O hambúrguer", "que você estava", "procurando."];

/*
  Composição (ver ".hero" em globals.css):
  - celular e tablet em pé: foto em cima, texto embaixo;
  - desktop e tablet deitado: foto espelhada à direita. A borda do hambúrguer é
    calculada a partir da largura da tela, então ele nunca fica atrás do texto.
*/
export function Hero() {
  return (
    <section id="inicio" className="hero relative isolate overflow-hidden bg-ember text-white">
      <div className="hero-media">
        <Image
          src={heroImage}
          alt="Hambúrguer com queijo empanado, bacon, cheddar e alface"
          preload
          placeholder="blur"
          sizes="(min-width: 1024px) 1700px, (min-width: 768px) 1100px, 170vw"
          className="hero-img"
        />
        <div className="hero-shade" aria-hidden />
      </div>

      <div className="hero-content mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="hero-copy">
          <OpenStatusPill tone="dark" />

          <h1 className="hero-title mt-5 font-display leading-[1.04] tracking-[-0.01em]">
            {TITLE.map((line, i) => (
              <span
                key={line}
                className={`hero-line block ${i === TITLE.length - 1 ? "text-cheddar" : ""}`}
                style={{ animationDelay: `${140 + i * 90}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-[#f3e3cf]/85 sm:text-lg">
            Hamburgueria artesanal no Jardim Alvorada, em Franca. Monte seu pedido aqui e envie direto pelo WhatsApp.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#cardapio"
              className="inline-flex h-14 shrink-0 items-center justify-center rounded-2xl bg-cheddar px-7 whitespace-nowrap text-[17px] font-extrabold text-patty shadow-[0_12px_28px_-12px_rgba(247,168,20,0.75)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffb829] active:translate-y-0"
            >
              Ver cardápio
            </a>
            <a
              href={whatsappLink("Olá, La Encasa! Quero fazer um pedido.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-white/[0.08] px-7 whitespace-nowrap text-[17px] font-bold text-white ring-1 ring-white/25 transition duration-200 hover:bg-white/15 hover:ring-white/40"
            >
              <WhatsAppIcon size={20} /> Pedir pelo WhatsApp
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-[#f3e3cf]/90 sm:text-[15px]">
            {FACTS.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon size={17} className="text-cheddar" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
