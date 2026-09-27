import Image from "next/image";
import { site } from "@/data/site";
import { InstagramIcon } from "./ui/icons";

// Fotos publicadas no Instagram da La Encasa
const PHOTOS = [
  { src: "/images/produtos/empanado-do-chef.jpg", alt: "Lanche de frango empanado com cheddar e bacon" },
  { src: "/images/produtos/duplo-cheddar.jpg", alt: "Hambúrguer duplo com cheddar, ovo e bacon" },
  { src: "/images/produtos/magnifico.jpg", alt: "Hambúrguer com empanado, cheddar cremoso e bacon" },
  { src: "/images/produtos/fabuloso.jpg", alt: "Hambúrguer com empanado de queijo, bacon e alface" },
  { src: "/images/produtos/prime.jpg", alt: "Hambúrguer com queijo empanado, cheddar e bacon" },
  { src: "/images/produtos/imperador.jpg", alt: "Hambúrguer com requeijão empanado e bacon" },
];

export function Instagram() {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="instagram-titulo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-ketchup uppercase">Instagram</p>
            <h2 id="instagram-titulo" className="mt-2 font-display text-4xl leading-[1.05] text-patty sm:text-5xl">
              Siga a La Encasa
            </h2>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-lg font-bold text-cocoa hover:text-ketchup">
              {site.instagram.handle}
            </a>
          </div>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center justify-center gap-2.5 self-start rounded-2xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-6 font-bold text-white shadow-card transition hover:-translate-y-0.5 sm:self-auto"
          >
            <InstagramIcon /> Ver Instagram
          </a>
        </div>

        <ul className="mt-8 grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-6">
          {PHOTOS.map((p) => (
            <li key={p.src}>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl sm:rounded-2xl"
                aria-label={`${p.alt} — ver no Instagram`}
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 200px, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-ember/0 text-white opacity-0 transition group-hover:bg-ember/40 group-hover:opacity-100" aria-hidden>
                  <InstagramIcon size={28} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
