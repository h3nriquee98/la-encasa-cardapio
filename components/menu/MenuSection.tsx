"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addons, categories, products, type CategoryId } from "@/data/menu";
import { money, normalize } from "@/lib/format";
import { Comanda } from "../order/Comanda";
import { useOrder } from "../order/OrderProvider";
import { CloseIcon, SearchIcon } from "../ui/icons";
import { ProductCard } from "./ProductCard";

type Filter = "todos" | CategoryId | "adicionais";

const CHIPS: { id: Filter; label: string; count?: number }[] = [
  { id: "todos", label: "Todos" },
  ...categories.map((c) => ({ id: c.id as Filter, label: c.name, count: products.filter((p) => p.category === c.id).length })),
  { id: "adicionais", label: "Adicionais" },
];

export function MenuSection() {
  const { openCart } = useOrder();
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const q = normalize(query.trim());

  const results = useMemo(() => {
    if (!q) return null;
    return products.filter((p) =>
      normalize([p.name, p.description ?? "", ...p.ingredients].join(" ")).includes(q),
    );
  }, [q]);

  const visible = categories
    .filter((c) => filter === "todos" || c.id === filter)
    .map((c) => ({ category: c, items: (results ?? products).filter((p) => p.category === c.id) }))
    .filter((g) => g.items.length);

  const showAddons = !q && (filter === "todos" || filter === "adicionais");

  const choose = (f: Filter) => {
    setFilter(f);
    setQuery("");
    const top = listRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    chipRefs.current[filter]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [filter]);

  return (
    <section id="cardapio" className="relative pt-16 sm:pt-24" aria-labelledby="cardapio-titulo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-ketchup uppercase">Cardápio</p>
            <h2 id="cardapio-titulo" className="mt-2 font-display text-4xl leading-[1.05] text-patty sm:text-5xl">
              Escolha, capriche e peça.
            </h2>
            <p className="mt-3 max-w-lg text-[16px] text-cocoa">
              Toque no lanche para escolher adicionais e tirar ingredientes. O pedido vai pronto para o WhatsApp.
            </p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-cocoa" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (filter !== "todos") setFilter("todos");
              }}
              placeholder="Buscar lanche, porção, bebida…"
              aria-label="Buscar no cardápio"
              className="h-13 w-full rounded-2xl bg-white pr-11 pl-12 text-[16px] text-patty shadow-card ring-1 ring-crust outline-none placeholder:text-cocoa/60 focus:ring-2 focus:ring-cheddar [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-cocoa hover:bg-bun"
                aria-label="Limpar busca"
              >
                <CloseIcon size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categorias: barra fixa ao rolar */}
      <div className="sticky top-16 z-30 mt-8 border-b border-crust/80 bg-paper/95 backdrop-blur-md sm:top-[72px]">
        <nav aria-label="Categorias do cardápio" className="mx-auto max-w-7xl">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
            {CHIPS.map((c) => {
              const active = filter === c.id && !q;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    chipRefs.current[c.id] = el;
                  }}
                  type="button"
                  onClick={() => choose(c.id)}
                  aria-pressed={active}
                  className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[15px] font-bold whitespace-nowrap transition ${
                    active ? "bg-patty text-white shadow-card" : "bg-white text-patty ring-1 ring-crust hover:ring-cheddar"
                  }`}
                >
                  {c.label}
                  {c.count !== undefined && (
                    <span className={`tabular text-xs ${active ? "text-cheddar" : "text-cocoa/70"}`}>{c.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 xl:grid xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
        <div ref={listRef} className="scroll-mt-[72px] pt-8">
          {q && (
            <p className="mb-6 text-[15px] text-cocoa" role="status">
              {results?.length
                ? `${results.length} ${results.length === 1 ? "item encontrado" : "itens encontrados"} para “${query.trim()}”`
                : ""}
            </p>
          )}

          {q && !results?.length && (
            <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-crust">
              <p className="text-lg font-bold text-patty">Nada encontrado para “{query.trim()}”.</p>
              <p className="mt-1 text-cocoa">Tente outro nome ou ingrediente, como “bacon” ou “costela”.</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-5 rounded-full bg-patty px-5 py-2.5 font-bold text-white"
              >
                Limpar busca
              </button>
            </div>
          )}

          {visible.map(({ category, items }) => (
            <div key={category.id} className="mb-12 last:mb-0">
              <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-dashed border-crust pb-3">
                <h3 className="font-display text-2xl text-patty sm:text-[1.75rem]">{category.name}</h3>
                <span className="tabular text-sm font-semibold text-cocoa">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </span>
              </div>
              {category.note && <p className="-mt-1 mb-4 text-sm font-semibold text-cocoa">{category.note}</p>}
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}

          {showAddons && <AddonsPanel />}
        </div>

        <aside className="hidden xl:block" aria-label="Seu pedido">
          <div className="sticky top-[152px] flex max-h-[calc(100vh-172px)] flex-col pt-8">
            <Comanda scrollList onCheckout={() => openCart("dados")} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function AddonsPanel() {
  return (
    <div className="mb-4">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-dashed border-crust pb-3">
        <h3 className="font-display text-2xl text-patty sm:text-[1.75rem]">Adicionais dos lanches</h3>
      </div>
      <p className="mb-4 max-w-xl text-[15px] text-cocoa">
        Escolha os adicionais ao abrir qualquer hambúrguer. O hambúrguer artesanal extra vale só para os lanches artesanais.
      </p>
      <ul className="grid gap-x-8 rounded-3xl bg-white px-5 py-2 ring-1 ring-crust sm:grid-cols-2">
        {addons.map((a) => (
          <li key={a.id} className="flex items-baseline gap-2 border-b border-dashed border-crust py-3 text-[15px] last:border-0 sm:[&:nth-last-child(2)]:border-0">
            <span className="text-patty">{a.name}</span>
            <span className="flex-1 translate-y-[-3px] border-b border-dotted border-cocoa/30" aria-hidden />
            <span className="tabular font-bold whitespace-nowrap text-patty">{money(a.price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
