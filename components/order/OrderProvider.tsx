"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct } from "@/data/menu";
import { cartCount, cartSubtotal, type CartLine } from "@/lib/cart";
import { emptyCustomer, type Customer } from "@/lib/order";

const CART_KEY = "laencasa:cart:v1";
const CUSTOMER_KEY = "laencasa:customer:v1";

type OrderContextValue = {
  hydrated: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  addLine: (line: CartLine) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;

  customer: Customer;
  updateCustomer: (patch: Partial<Customer>) => void;

  activeProductId: string | null;
  openProduct: (id: string) => void;
  closeProduct: () => void;

  cartOpen: boolean;
  cartStep: CartStep;
  setCartStep: (step: CartStep) => void;
  openCart: (step?: CartStep) => void;
  closeCart: () => void;

  /** Último item adicionado (para o aviso rápido). */
  lastAdded: { name: string; qty: number; id: number } | null;

  /** Incrementa a cada item adicionado — usado para animar o botão do carrinho. */
  bump: number;
};

export type CartStep = "pedido" | "dados" | "enviado";

const OrderContext = createContext<OrderContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo privado / armazenamento cheio: o pedido segue funcionando sem salvar */
  }
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<CartStep>("pedido");
  const [lastAdded, setLastAdded] = useState<OrderContextValue["lastAdded"]>(null);
  const [bump, setBump] = useState(0);
  const skipFirstWrite = useRef(true);

  // Carrega o que ficou salvo (só no navegador, depois da hidratação).
  useEffect(() => {
    const saved = read<CartLine[]>(CART_KEY, []);
    // Descarta itens que saíram do cardápio ou estão esgotados.
    setLines(saved.filter((l) => getProduct(l.productId)?.available));
    // Dados do cliente ficam salvos para o próximo pedido; pagamento e obs. não.
    const c = read<Partial<Customer>>(CUSTOMER_KEY, {});
    setCustomer({ ...emptyCustomer, ...c, payment: "", needsChange: false, changeFor: "", notes: "" });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipFirstWrite.current) {
      skipFirstWrite.current = false;
      return;
    }
    write(CART_KEY, lines);
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const { payment, needsChange, changeFor, notes, ...keep } = customer;
    void payment; void needsChange; void changeFor; void notes;
    write(CUSTOMER_KEY, keep);
  }, [customer, hydrated]);

  const addLine = useCallback((line: CartLine) => {
    setLines((prev) => {
      const same = prev.find((l) => l.key === line.key);
      if (same) return prev.map((l) => (l.key === line.key ? { ...l, qty: l.qty + line.qty } : l));
      return [...prev, line];
    });
    setBump((b) => b + 1);
    setLastAdded({ name: line.name, qty: line.qty, id: Date.now() });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);
  const updateCustomer = useCallback((patch: Partial<Customer>) => setCustomer((c) => ({ ...c, ...patch })), []);

  const value = useMemo<OrderContextValue>(
    () => ({
      hydrated,
      lines,
      count: cartCount(lines),
      subtotal: cartSubtotal(lines),
      addLine,
      setQty,
      removeLine,
      clear,
      customer,
      updateCustomer,
      activeProductId,
      openProduct: (id) => setActiveProductId(id),
      closeProduct: () => setActiveProductId(null),
      cartOpen,
      cartStep,
      setCartStep,
      openCart: (step = "pedido") => {
        setCartStep(step);
        setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      lastAdded,
      bump,
    }),
    [hydrated, lines, addLine, setQty, removeLine, clear, customer, updateCustomer, activeProductId, cartOpen, cartStep, lastAdded, bump],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder precisa estar dentro de <OrderProvider>");
  return ctx;
}
