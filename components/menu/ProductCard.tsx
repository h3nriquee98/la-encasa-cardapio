"use client";

import { useState } from "react";
import type { Product } from "@/data/menu";
import { buildLine, startingPrice } from "@/lib/cart";
import { money } from "@/lib/format";
import { useOrder } from "../order/OrderProvider";
import { CheckIcon, PlusIcon } from "../ui/icons";
import { ProductImage } from "./ProductImage";

/** Produto sem nenhuma escolha a fazer pode ir direto para o pedido pelo "+". */
export const isQuickAdd = (p: Product) =>
  !p.options?.length && !p.addons?.length && !p.removable?.length && !p.notePlaceholder;

export function summary(p: Product) {
  return p.description ?? p.ingredients.join(", ");
}

export function ProductCard({ product }: { product: Product }) {
  const { openProduct, addLine } = useOrder();
  const [added, setAdded] = useState(false);
  const from = startingPrice(product);
  const hasFrom = from !== product.price;
  const soldOut = !product.available;

  const onPlus = () => {
    if (soldOut) return;
    if (isQuickAdd(product)) {
      addLine(buildLine(product, { options: {}, addons: {}, removed: [], note: "" }, 1));
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } else {
      openProduct(product.id);
    }
  };

  return (
    <article
      className={`group relative flex gap-4 rounded-3xl bg-white p-3 pr-4 shadow-card ring-1 ring-crust/70 transition duration-200 ${
        soldOut ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-lift hover:ring-cheddar/60"
      }`}
    >
      <div className="relative shrink-0">
        <ProductImage
          product={product}
          sizes="(min-width: 1024px) 140px, 112px"
          className="aspect-square w-28 rounded-2xl sm:w-32 xl:w-36"
        />
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 rounded-full bg-cheddar px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-patty uppercase shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <div>
          <h3 className="text-[17px] leading-snug font-extrabold text-patty">
            <button
              type="button"
              onClick={() => !soldOut && openProduct(product.id)}
              disabled={soldOut}
              className="text-left after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-cheddar"
            >
              {product.name}
            </button>
          </h3>
        </div>
        <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-cocoa">{summary(product)}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="tabular leading-none whitespace-nowrap">
            {hasFrom && <span className="block pb-1 text-[11px] font-semibold text-cocoa">a partir de</span>}
            <span className="text-lg font-extrabold text-patty">{money(from)}</span>
          </p>
          {soldOut ? (
            <span className="rounded-full bg-crust px-3 py-1.5 text-xs font-bold text-cocoa">Esgotado</span>
          ) : (
            <button
              type="button"
              onClick={onPlus}
              aria-label={isQuickAdd(product) ? `Adicionar ${product.name} ao pedido` : `Escolher ${product.name}`}
              className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full text-white shadow-[0_6px_14px_-6px_rgba(213,43,30,0.8)] transition active:scale-90 ${
                added ? "animate-pop bg-lettuce" : "bg-ketchup hover:bg-ketchup-deep"
              }`}
            >
              {added ? <CheckIcon size={20} /> : <PlusIcon size={22} strokeWidth={2.6} />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
