"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { lineTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { QtyStepper } from "../ui/QtyStepper";
import { useOrder } from "./OrderProvider";

type Props = {
  /** Limita a altura da lista (sidebar do desktop). */
  scrollList?: boolean;
  onCheckout?: () => void;
};

/**
 * O carrinho em forma de comanda — o mesmo conteúdo que vai para o WhatsApp.
 */
export function Comanda({ scrollList, onCheckout }: Props) {
  const { lines, count, subtotal, setQty, removeLine, hydrated } = useOrder();
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    const now = new Date();
    setStamp(
      now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) +
        " · " +
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    );
  }, [count]);

  const empty = hydrated && lines.length === 0;

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex min-h-0 flex-col drop-shadow-[0_14px_22px_rgba(42,21,12,0.16)]">
        <div className="ticket-edge flex min-h-0 flex-col bg-white px-5 pt-6 pb-7 font-mono text-[13px] text-patty">
          <div className="flex items-baseline justify-between text-[11px] tracking-[0.2em] text-cocoa uppercase">
            <span>Comanda · La Encasa</span>
            <span className="tracking-normal">{stamp}</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-b-2 border-dashed border-patty/20 pb-3">
            <h2 className="font-display text-2xl tracking-tight">Seu pedido</h2>
            <span className="text-xs font-semibold text-cocoa">
              {count} {count === 1 ? "item" : "itens"}
            </span>
          </div>

          {empty ? (
            <div className="py-8 text-center">
              <p className="font-sans text-[15px] font-bold">Sua comanda está vazia.</p>
              <p className="mt-1 font-sans text-sm text-cocoa">Toque no + de um lanche para começar.</p>
            </div>
          ) : (
            <ul className={`divide-y-2 divide-dashed divide-patty/10 ${scrollList ? "min-h-0 overflow-y-auto overscroll-contain pr-1" : ""}`}>
              {lines.map((l) => (
                <li key={l.key} className="py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold uppercase">
                      <span className="text-ketchup">{l.qty}x</span> {l.name}
                    </p>
                    <span className="tabular shrink-0 font-semibold">{money(lineTotal(l))}</span>
                  </div>
                  {(l.options.length > 0 || l.addons.length > 0 || l.removed.length > 0 || l.note) && (
                    <ul className="mt-1 space-y-0.5 pl-6 text-[12.5px] text-cocoa">
                      {l.options.map((o) => (
                        <li key={o.group}>
                          · {o.group}: {o.label}
                        </li>
                      ))}
                      {l.addons.map((a) => (
                        <li key={a.name}>
                          + {a.qty > 1 ? `${a.qty}x ` : ""}
                          {a.name}
                        </li>
                      ))}
                      {l.removed.map((r) => (
                        <li key={r}>− sem {r.toLowerCase()}</li>
                      ))}
                      {l.note && <li className="italic">“{l.note}”</li>}
                    </ul>
                  )}
                  <div className="mt-2 flex items-center justify-between pl-6 font-sans">
                    <QtyStepper
                      value={l.qty}
                      onChange={(n) => setQty(l.key, n)}
                      min={0}
                      size="sm"
                      label={`Quantidade de ${l.name}`}
                      trashAtOne
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(l.key)}
                      className="rounded-full px-2 py-1 text-xs font-semibold text-cocoa underline-offset-2 hover:text-ketchup hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!empty && (
            <dl className="mt-1 space-y-1.5 border-t-2 border-dashed border-patty/20 pt-3">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-cocoa">
                <dt>Entrega</dt>
                <dd>{site.deliveryFee === null ? "a combinar" : money(site.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular">{money(subtotal + (site.deliveryFee ?? 0))}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {onCheckout && !empty && (
        <button
          type="button"
          onClick={onCheckout}
          className="flex h-14 w-full shrink-0 items-center justify-center rounded-2xl bg-ketchup text-[17px] font-extrabold text-white shadow-[0_10px_24px_-12px_rgba(213,43,30,0.9)] transition hover:bg-ketchup-deep active:scale-[0.98]"
        >
          Finalizar pedido
        </button>
      )}
    </div>
  );
}
