"use client";

import Image from "next/image";
import { featuredProducts } from "@/data/menu";
import { money } from "@/lib/format";
import { useOrder } from "../order/OrderProvider";
import { PlusIcon } from "../ui/icons";

export function Featured() {
  const { openProduct } = useOrder();
  if (!featuredProducts.length) return null;

  return (
    <section className="overflow-hidden bg-paper pt-14 sm:pt-20" aria-labelledby="favoritos-titulo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-ketchup uppercase">Destaques</p>
            <h2 id="favoritos-titulo" className="mt-2 font-display text-4xl leading-[1.05] text-patty sm:text-5xl">
              Os favoritos da casa <span aria-hidden>🍔</span>
            </h2>
          </div>
          <a href="#cardapio" className="hidden shrink-0 py-2.5 font-bold text-ketchup underline-offset-4 hover:underline sm:block">
            Ver cardápio completo
          </a>
        </div>
      </div>

      <ul className="no-scrollbar mx-auto mt-8 flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
        {featuredProducts.map((p, i) => (
          <li key={p.id} className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[46vw] lg:w-auto lg:max-w-none">
            <button
              type="button"
              onClick={() => openProduct(p.id)}
              className="group relative block aspect-[4/5] w-full lg:aspect-square overflow-hidden rounded-[28px] bg-ember text-left shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              aria-label={`${p.name}, ${money(p.price)}. Escolher`}
            >
              {p.image && (
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 78vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading={i < 2 ? "eager" : "lazy"}
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-ember via-ember/20 to-transparent" aria-hidden />
              {p.badge && (
                <span className="absolute top-4 left-4 rounded-full bg-cheddar px-3 py-1 text-[11px] font-extrabold tracking-wide text-patty uppercase">
                  {p.badge}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <span className="min-w-0">
                  <span className="block font-display text-[1.7rem] leading-none text-white">{p.name}</span>
                  <span className="mt-2 line-clamp-1 block text-sm text-white/75">{p.ingredients.slice(0, 4).join(" · ")}</span>
                  <span className="tabular mt-2 block text-lg font-extrabold text-cheddar">{money(p.price)}</span>
                </span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ketchup text-white shadow-lg transition group-hover:scale-110">
                  <PlusIcon size={24} strokeWidth={2.6} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
