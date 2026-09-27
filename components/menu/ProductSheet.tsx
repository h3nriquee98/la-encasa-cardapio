"use client";

import { useMemo, useRef, useState } from "react";
import { getCategory, getProduct, type Addon, type Product } from "@/data/menu";
import { buildLine, missingRequired, unitPrice, type Selection } from "@/lib/cart";
import { money } from "@/lib/format";
import { useOrder } from "../order/OrderProvider";
import { CheckIcon, CloseIcon } from "../ui/icons";
import { QtyStepper } from "../ui/QtyStepper";
import { Sheet, SheetHandle, useSheetClose } from "../ui/Sheet";
import { ProductImage } from "./ProductImage";

export function ProductSheet() {
  const { activeProductId, closeProduct } = useOrder();
  const product = activeProductId ? getProduct(activeProductId) : undefined;
  return (
    <Sheet open={!!product} onClose={closeProduct} label={product?.name ?? "Produto"}>
      {product && <ProductDetail key={product.id} product={product} />}
    </Sheet>
  );
}

const initialSelection = (p: Product): Selection => ({
  // Tamanho já vem marcado na primeira opção (porção inteira); o resto o cliente escolhe.
  options: Object.fromEntries((p.options ?? []).filter((g) => g.id === "tamanho").map((g) => [g.id, g.choices[0].id])),
  addons: {},
  removed: [],
  note: "",
});

function ProductDetail({ product }: { product: Product }) {
  const { addLine } = useOrder();
  const close = useSheetClose();
  const [sel, setSel] = useState<Selection>(() => initialSelection(product));
  const [qty, setQty] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const groupRefs = useRef<Record<string, HTMLFieldSetElement | null>>({});

  const unit = unitPrice(product, sel);
  const missing = missingRequired(product, sel);
  const category = getCategory(product.category);

  const addonGroups = useMemo(() => {
    const groups = new Map<Addon["group"], Addon[]>();
    for (const a of product.addons ?? []) groups.set(a.group, [...(groups.get(a.group) ?? []), a]);
    return [...groups.entries()];
  }, [product.addons]);

  const addonCount = Object.values(sel.addons).reduce((s, n) => s + n, 0);

  const submit = () => {
    if (missing.length) {
      setShowErrors(true);
      groupRefs.current[missing[0].id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addLine(buildLine(product, sel, qty));
    close();
  };

  return (
    <>
      <div className="relative shrink-0">
        <SheetHandle />
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-white/95 text-patty shadow-card transition hover:bg-white"
          aria-label="Fechar"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <ProductImage
          product={product}
          sizes="(min-width: 640px) 640px, 100vw"
          className="mx-3 mt-1 aspect-[16/11] rounded-[22px] sm:mx-0 sm:mt-0 sm:aspect-[16/9] sm:rounded-none"
        />

        <div className="px-5 pt-5 pb-6 sm:px-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-[0.18em] text-cocoa uppercase">{category.name}</span>
            {product.badge && (
              <span className="rounded-full bg-cheddar/20 px-2 py-0.5 text-[11px] font-bold tracking-wide text-cheddar-deep uppercase">
                {product.badge}
              </span>
            )}
          </div>
          <h2 className="mt-1.5 font-display text-[1.9rem] leading-[1.05] text-patty sm:text-4xl">{product.name}</h2>
          <p className="tabular mt-2 text-xl font-extrabold text-ketchup">{money(unitPrice(product, { ...sel, addons: {} }))}</p>

          {product.description && <p className="mt-3 text-[15px] leading-relaxed text-cocoa">{product.description}</p>}

          {product.ingredients.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-patty">Ingredientes</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {product.ingredients.map((i) => (
                  <li key={i} className="rounded-full bg-bun px-3 py-1 text-[13px] font-medium text-patty">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {category.note && (
            <p className="mt-4 rounded-2xl bg-cheddar/15 px-4 py-3 text-sm font-semibold text-patty">{category.note}</p>
          )}

          {/* Opções (tamanho, sabor, lanches do combo...) */}
          {product.options?.map((group) => {
            const error = showErrors && missing.some((m) => m.id === group.id);
            return (
              <fieldset
                key={group.id}
                ref={(el) => {
                  groupRefs.current[group.id] = el;
                }}
                className="mt-7"
              >
                <legend className="flex w-full items-center justify-between">
                  <span className="text-[17px] font-extrabold text-patty">{group.title}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                      error ? "bg-ketchup text-white" : sel.options[group.id] ? "bg-lettuce/15 text-lettuce" : "bg-patty text-white"
                    }`}
                  >
                    {sel.options[group.id] ? "Ok" : group.required ? "Obrigatório" : "Opcional"}
                  </span>
                </legend>
                {error && <p className="mt-1 text-sm font-semibold text-ketchup">Escolha uma opção para continuar.</p>}
                {group.choices.length > 8 ? (
                  <select
                    aria-label={group.title}
                    aria-invalid={error || undefined}
                    value={sel.options[group.id] ?? ""}
                    onChange={(e) => setSel((s) => ({ ...s, options: { ...s.options, [group.id]: e.target.value } }))}
                    className={`mt-3 h-13 w-full appearance-none rounded-2xl bg-white bg-[length:20px] bg-[right_1rem_center] bg-no-repeat px-4 pr-12 text-[16px] font-semibold text-patty ring-1 outline-none focus:ring-2 focus:ring-cheddar ${
                      error ? "ring-2 ring-ketchup" : sel.options[group.id] ? "ring-2 ring-cheddar" : "ring-crust"
                    }`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232a150c' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                    }}
                  >
                    <option value="" disabled>
                      Escolha…
                    </option>
                    {group.choices.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                        {c.price !== undefined ? ` — ${money(c.price)}` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className={`mt-3 grid gap-2 ${group.choices.length > 4 ? "sm:grid-cols-2" : ""}`}>
                    {group.choices.map((c) => {
                      const checked = sel.options[group.id] === c.id;
                      return (
                        <label
                          key={c.id}
                          className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 transition ${
                            checked ? "bg-cheddar/15 ring-2 ring-cheddar" : "bg-white ring-crust hover:ring-cheddar/60"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={group.id}
                              value={c.id}
                              checked={checked}
                              onChange={() => setSel((s) => ({ ...s, options: { ...s.options, [group.id]: c.id } }))}
                              className="size-5 accent-ketchup"
                            />
                            <span className="text-[15px] font-semibold text-patty">{c.label}</span>
                          </span>
                          {c.price !== undefined && <span className="tabular text-[15px] font-bold text-patty">{money(c.price)}</span>}
                          {c.extra ? <span className="tabular text-sm font-bold text-cocoa">+ {money(c.extra)}</span> : null}
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            );
          })}

          {/* Adicionais */}
          {addonGroups.length > 0 && (
            <section className="mt-8" aria-labelledby="adicionais-titulo">
              <div className="flex items-center justify-between">
                <h3 id="adicionais-titulo" className="text-[17px] font-extrabold text-patty">
                  Adicionais
                </h3>
                <span className="rounded-full bg-crust px-2.5 py-0.5 text-[11px] font-bold text-cocoa uppercase">
                  {addonCount ? `${addonCount} escolhido${addonCount > 1 ? "s" : ""}` : "Opcional"}
                </span>
              </div>
              {addonGroups.map(([groupName, list]) => (
                <div key={groupName} className="mt-4">
                  <h4 className="text-xs font-bold tracking-[0.16em] text-cocoa uppercase">{groupName}</h4>
                  <ul className="mt-2 divide-y divide-crust/70 rounded-2xl bg-white ring-1 ring-crust">
                    {list.map((a) => {
                      const n = sel.addons[a.id] ?? 0;
                      const setN = (v: number) =>
                        setSel((s) => ({ ...s, addons: { ...s.addons, [a.id]: Math.max(0, Math.min(5, v)) } }));
                      return (
                        <li key={a.id} className="flex min-h-14 items-center justify-between gap-3 py-2 pr-2 pl-4">
                          <span className="min-w-0">
                            <span className="block text-[15px] leading-snug font-semibold text-patty">{a.name}</span>
                            <span className="tabular text-sm text-cocoa">+ {money(a.price)}</span>
                          </span>
                          {n === 0 ? (
                            <button
                              type="button"
                              onClick={() => setN(1)}
                              className="shrink-0 rounded-full bg-bun px-4 py-2 text-sm font-bold text-patty transition hover:bg-cheddar/30"
                              aria-label={`Adicionar ${a.name}`}
                            >
                              Adicionar
                            </button>
                          ) : (
                            <QtyStepper value={n} onChange={setN} min={0} max={5} size="sm" label={`Quantidade de ${a.name}`} trashAtOne />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Remover ingredientes */}
          {!!product.removable?.length && (
            <section className="mt-8" aria-labelledby="remover-titulo">
              <h3 id="remover-titulo" className="text-[17px] font-extrabold text-patty">
                Remover ingredientes
              </h3>
              <p className="mt-0.5 text-sm text-cocoa">Toque no que você quer tirar do lanche.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.removable.map((ing) => {
                  const on = sel.removed.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setSel((s) => ({
                          ...s,
                          removed: on ? s.removed.filter((r) => r !== ing) : [...s.removed, ing],
                        }))
                      }
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition ${
                        on ? "bg-patty text-white ring-patty" : "bg-white text-patty ring-crust hover:ring-cheddar"
                      }`}
                    >
                      {on && <CheckIcon size={15} />}
                      {on ? `Sem ${ing.toLowerCase()}` : ing}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="mt-8">
            <label htmlFor="obs-produto" className="text-[17px] font-extrabold text-patty">
              Observações
            </label>
            <textarea
              id="obs-produto"
              rows={2}
              maxLength={140}
              value={sel.note}
              onChange={(e) => setSel((s) => ({ ...s, note: e.target.value }))}
              placeholder={product.notePlaceholder ?? "Ex.: sem cebola, por favor."}
              className="mt-2 w-full resize-none rounded-2xl bg-white px-4 py-3 text-[16px] text-patty ring-1 ring-crust outline-none placeholder:text-cocoa/60 focus:ring-2 focus:ring-cheddar"
            />
          </section>
        </div>
      </div>

      <footer className="pb-safe flex shrink-0 items-center gap-3 border-t border-crust bg-paper px-4 pt-3 sm:px-6">
        <QtyStepper value={qty} onChange={setQty} label="Quantidade" />
        <button
          type="button"
          onClick={submit}
          className="flex h-14 flex-1 items-center justify-between gap-2 rounded-2xl bg-ketchup px-5 text-[16px] font-extrabold text-white shadow-[0_10px_24px_-12px_rgba(213,43,30,0.9)] transition hover:bg-ketchup-deep active:scale-[0.98]"
        >
          <span>
            Adicionar<span className="hidden min-[400px]:inline"> ao pedido</span>
          </span>
          <span className="tabular">{money(unit * qty)}</span>
        </button>
      </footer>
    </>
  );
}
