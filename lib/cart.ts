import type { Addon, OptionChoice, Product } from "@/data/menu";

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  category: Product["category"];
  image?: string;
  qty: number;
  /** Preço de 1 unidade já com opções e adicionais. */
  unitPrice: number;
  options: { group: string; label: string }[];
  addons: { name: string; qty: number; price: number }[];
  removed: string[];
  note: string;
}

export type Selection = {
  options: Record<string, string>; // groupId -> choiceId
  addons: Record<string, number>; // addonId -> quantidade
  removed: string[];
  note: string;
};

export function selectedChoices(product: Product, sel: Selection) {
  return (product.options ?? [])
    .map((g) => ({ group: g, choice: g.choices.find((c) => c.id === sel.options[g.id]) }))
    .filter((x): x is { group: (typeof x)["group"]; choice: OptionChoice } => !!x.choice);
}

export function unitPrice(product: Product, sel: Selection) {
  let base = product.price;
  let extra = 0;
  for (const { choice } of selectedChoices(product, sel)) {
    if (choice.price !== undefined) base = choice.price;
    if (choice.extra) extra += choice.extra;
  }
  for (const addon of product.addons ?? []) {
    extra += (sel.addons[addon.id] ?? 0) * addon.price;
  }
  return base + extra;
}

/** Menor preço possível (para mostrar "a partir de" nos cards). */
export function startingPrice(product: Product) {
  const prices = (product.options ?? []).flatMap((g) =>
    g.choices.map((c) => c.price).filter((p): p is number => p !== undefined),
  );
  return prices.length ? Math.min(product.price, ...prices) : product.price;
}

export function missingRequired(product: Product, sel: Selection) {
  return (product.options ?? []).filter((g) => g.required && !sel.options[g.id]);
}

export function buildLine(product: Product, sel: Selection, qty: number): CartLine {
  const addonList = (product.addons ?? [])
    .filter((a: Addon) => (sel.addons[a.id] ?? 0) > 0)
    .map((a) => ({ name: a.name, qty: sel.addons[a.id], price: a.price }));
  const options = selectedChoices(product, sel).map(({ group, choice }) => ({
    group: group.title,
    label: choice.label,
  }));
  const note = sel.note.trim();
  const signature = JSON.stringify([product.id, options, addonList, [...sel.removed].sort(), note]);
  return {
    key: signature,
    productId: product.id,
    name: product.name,
    category: product.category,
    image: product.image,
    qty,
    unitPrice: unitPrice(product, sel),
    options,
    addons: addonList,
    removed: sel.removed,
    note,
  };
}

export const lineTotal = (line: CartLine) => line.unitPrice * line.qty;
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + lineTotal(l), 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.qty, 0);
