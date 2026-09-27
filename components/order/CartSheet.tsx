"use client";

import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/format";
import { ArrowLeftIcon, BagIcon, CheckIcon, CloseIcon, WhatsAppIcon } from "../ui/icons";
import { Sheet, SheetHandle, useSheetClose } from "../ui/Sheet";
import { CheckoutForm } from "./CheckoutForm";
import { Comanda } from "./Comanda";
import { useOrder } from "./OrderProvider";

export function CartSheet() {
  const { cartOpen, closeCart } = useOrder();
  return (
    <Sheet open={cartOpen} onClose={closeCart} label="Seu pedido" variant="drawer">
      <CartSteps />
    </Sheet>
  );
}

function CartSteps() {
  const { cartStep, setCartStep, lines, clear } = useOrder();
  const close = useSheetClose();
  const [sentLink, setSentLink] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [cartStep]);

  // Sem itens não há checkout
  const step = lines.length === 0 && cartStep === "dados" ? "pedido" : cartStep;

  const titles = { pedido: "Carrinho", dados: "Finalizar", enviado: "Pedido pronto" };

  return (
    <>
      <SheetHandle />
      <header className="flex shrink-0 items-center gap-2 border-b border-crust px-3 py-2.5 sm:px-5 sm:py-4">
        {step === "dados" ? (
          <button
            type="button"
            onClick={() => setCartStep("pedido")}
            className="grid size-10 place-items-center rounded-full text-patty hover:bg-bun"
            aria-label="Voltar para o pedido"
          >
            <ArrowLeftIcon />
          </button>
        ) : (
          <span className="grid size-10 place-items-center text-ketchup" aria-hidden>
            <BagIcon />
          </span>
        )}
        <h2 className="flex-1 font-display text-xl text-patty">{titles[step]}</h2>
        {step !== "enviado" && (
          <ol className="mr-1 flex items-center gap-1.5 text-[11px] font-bold text-cocoa" aria-label="Etapas">
            <li className={`h-1.5 w-6 rounded-full ${step === "pedido" ? "bg-ketchup" : "bg-cheddar"}`} aria-current={step === "pedido" ? "step" : undefined} />
            <li className={`h-1.5 w-6 rounded-full ${step === "dados" ? "bg-ketchup" : "bg-crust"}`} aria-current={step === "dados" ? "step" : undefined} />
          </ol>
        )}
        <button
          type="button"
          onClick={close}
          className="grid size-10 place-items-center rounded-full text-patty hover:bg-bun"
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>
      </header>

      <div ref={bodyRef} className="flex-1 overflow-y-auto overscroll-contain">
        {step === "pedido" && (
          <div className="px-4 pt-5 pb-6 sm:px-6">
            <Comanda onCheckout={() => setCartStep("dados")} />
            <button
              type="button"
              onClick={close}
              className="mt-3 w-full rounded-2xl py-3 text-[15px] font-bold text-patty hover:bg-bun"
            >
              {lines.length ? "Continuar escolhendo" : "Ver cardápio"}
            </button>
          </div>
        )}

        {step === "dados" && (
          <CheckoutForm
            onSent={(link) => {
              setSentLink(link);
              setCartStep("enviado");
            }}
          />
        )}

        {step === "enviado" && (
          <div className="flex flex-col items-center px-6 pt-10 pb-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-whatsapp text-ember">
              <CheckIcon size={30} strokeWidth={3} />
            </span>
            <h3 className="mt-5 font-display text-2xl text-patty">Seu pedido está no WhatsApp</h3>
            <p className="mt-2 max-w-xs text-[15px] text-cocoa">
              Confira a mensagem e toque em <strong className="text-patty">enviar</strong> na conversa com a La Encasa.
              A confirmação chega por lá.
            </p>
            <div className="mt-7 flex w-full max-w-sm flex-col gap-2.5">
              <a
                href={sentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-whatsapp font-extrabold text-ember"
              >
                <WhatsAppIcon /> Abrir o WhatsApp de novo
              </a>
              <button
                type="button"
                onClick={() => {
                  clear();
                  setCartStep("pedido");
                  close();
                }}
                className="h-14 rounded-2xl bg-white font-bold text-patty ring-1 ring-crust hover:bg-bun"
              >
                Começar um novo pedido
              </button>
              <button type="button" onClick={() => setCartStep("dados")} className="py-2 text-sm font-semibold text-cocoa underline">
                Voltar e editar o pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/** Barra fixa no rodapé do celular: "Ver pedido • R$ XX,XX". */
export function CartBar() {
  const { count, subtotal, openCart, hydrated, bump, cartOpen, activeProductId } = useOrder();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!bump) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 450);
    return () => clearTimeout(t);
  }, [bump]);

  if (!hydrated || count === 0 || cartOpen || activeProductId) return null;

  return (
    <div className="pb-safe animate-rise fixed inset-x-0 bottom-0 z-40 px-3 pt-3 sm:px-6 xl:hidden">
      <button
        type="button"
        onClick={() => openCart()}
        className={`mx-auto flex h-15 w-full max-w-lg items-center gap-3 rounded-2xl bg-patty px-4 text-white shadow-[0_18px_40px_-12px_rgba(23,11,6,0.7)] ring-1 ring-white/10 transition active:scale-[0.98] ${
          pulse ? "animate-pop" : ""
        }`}
      >
        <span className="relative grid size-9 place-items-center rounded-xl bg-cheddar text-patty">
          <BagIcon size={19} />
          <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ketchup text-[11px] font-bold text-white ring-2 ring-patty">
            {count}
          </span>
        </span>
        <span className="text-[16px] font-extrabold">Ver pedido</span>
        <span className="tabular ml-auto text-[16px] font-extrabold">{money(subtotal)}</span>
      </button>
    </div>
  );
}

/** Aviso rápido quando um item entra no pedido. */
export function AddedToast() {
  const { lastAdded } = useOrder();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4">
      {visible && lastAdded && (
        <p
          key={lastAdded.id}
          className="animate-rise flex items-center gap-2 rounded-full bg-patty px-4 py-2.5 text-sm font-semibold text-white shadow-lift"
        >
          <span className="grid size-5 place-items-center rounded-full bg-lettuce">
            <CheckIcon size={12} strokeWidth={3.5} />
          </span>
          {lastAdded.qty > 1 ? `${lastAdded.qty}x ` : ""}
          {lastAdded.name} no pedido
        </p>
      )}
    </div>
  );
}
