"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  /** dialog: centralizado no desktop · drawer: painel lateral no desktop. No celular os dois são bottom sheet. */
  variant?: "dialog" | "drawer";
  children: React.ReactNode;
};

let openCount = 0;

/**
 * Modal acessível que vira bottom sheet no celular.
 * O botão "voltar" do Android fecha o sheet em vez de sair do site.
 */
export function Sheet({ open, onClose, label, variant = "dialog", children }: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const id = useId();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Histórico: abre -> empilha um estado; "voltar" -> fecha.
  useEffect(() => {
    if (!open) return;
    history.pushState({ sheet: id }, "");
    const onPop = () => onCloseRef.current();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open, id]);

  // Trava o scroll da página, foco inicial, Esc e Tab preso dentro do modal.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    openCount++;
    document.documentElement.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        requestClose();
      }
      if (e.key === "Tab" && panel) {
        const items = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      openCount--;
      if (openCount === 0) document.documentElement.style.overflow = "";
      previous?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function requestClose() {
    // Se o estado do histórico ainda é o deste sheet, volta (o popstate chama onClose).
    if (history.state?.sheet === id) history.back();
    else onCloseRef.current();
  }

  if (!mounted || !open) return null;

  const isDrawer = variant === "drawer";

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="presentation">
      <div
        className="animate-fade absolute inset-0 bg-ember/60 backdrop-blur-[2px]"
        onClick={requestClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={[
          "absolute flex flex-col overflow-hidden bg-paper shadow-lift outline-none",
          // celular: bottom sheet
          "inset-x-0 bottom-0 max-h-[94dvh] rounded-t-[28px] animate-sheet",
          isDrawer
            ? "sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[440px] sm:rounded-none sm:rounded-l-[28px]"
            : "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(640px,calc(100vw-2rem))] sm:max-h-[90dvh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:animate-dialog",
        ].join(" ")}
      >
        <SheetContext.Provider value={requestClose}>{children}</SheetContext.Provider>
      </div>
    </div>,
    document.body,
  );
}

const SheetContext = createContext<() => void>(() => {});
/** Fecha o sheet atual respeitando o histórico do navegador. */
export const useSheetClose = () => useContext(SheetContext);

/** Alça visual do bottom sheet (só no celular). */
export function SheetHandle() {
  return <div className="mx-auto mt-2.5 mb-1 h-1.5 w-10 shrink-0 rounded-full bg-crust sm:hidden" aria-hidden />;
}
