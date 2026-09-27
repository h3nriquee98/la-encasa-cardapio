import { getCategory } from "@/data/menu";
import { site, whatsappLink } from "@/data/site";
import { cartSubtotal, lineTotal, type CartLine } from "@/lib/cart";
import { money, parseMoney } from "@/lib/format";

export type Fulfillment = "delivery" | "retirada";
export type Payment = "pix" | "dinheiro" | "cartao";

export interface Customer {
  name: string;
  phone: string;
  fulfillment: Fulfillment;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  reference: string;
  payment: Payment | "";
  needsChange: boolean;
  changeFor: string;
  notes: string;
}

export const emptyCustomer: Customer = {
  name: "",
  phone: "",
  fulfillment: "delivery",
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  complement: "",
  reference: "",
  payment: "",
  needsChange: false,
  changeFor: "",
  notes: "",
};

export const PAYMENT_LABEL: Record<Payment, string> = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
};

export function orderTotals(lines: CartLine[], fulfillment: Fulfillment) {
  const subtotal = cartSubtotal(lines);
  const fee = fulfillment === "delivery" ? site.deliveryFee : 0;
  return { subtotal, fee, total: subtotal + (fee ?? 0) };
}

export type Errors = Partial<Record<keyof Customer, string>>;

export function validateCustomer(c: Customer, total: number): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 2) e.name = "Informe seu nome.";
  if (c.phone.replace(/\D/g, "").length < 10) e.phone = "Informe um telefone com DDD.";
  if (c.fulfillment === "delivery") {
    if (!c.street.trim()) e.street = "Informe a rua.";
    if (!c.number.trim()) e.number = "Informe o número.";
    if (!c.neighborhood.trim()) e.neighborhood = "Informe o bairro.";
  }
  if (!c.payment) e.payment = "Escolha a forma de pagamento.";
  if (c.payment === "dinheiro" && c.needsChange) {
    const v = parseMoney(c.changeFor);
    if (!Number.isFinite(v)) e.changeFor = "Informe o valor para o troco.";
    else if (v < total) e.changeFor = `O valor precisa ser maior que ${money(total)}.`;
  }
  return e;
}

const LINE = "━━━━━━━━━━━━━━";

export function buildOrderMessage(lines: CartLine[], c: Customer) {
  const { subtotal, fee, total } = orderTotals(lines, c.fulfillment);
  const out: string[] = [];

  out.push("🍔 *NOVO PEDIDO - LA ENCASA*", "");
  out.push(`👤 *Cliente:* ${c.name.trim()}`);
  out.push(`📱 *Telefone:* ${c.phone}`, "");
  out.push("📦 *Pedido:*", "");

  for (const l of lines) {
    const emoji = getCategory(l.category).emoji;
    out.push(`${emoji} *${l.qty}x ${l.name}*`);
    for (const o of l.options) out.push(`• ${o.group}: ${o.label}`);
    for (const a of l.addons) out.push(`• Adicional: ${a.qty > 1 ? `${a.qty}x ` : ""}${a.name}`);
    for (const r of l.removed) out.push(`• Sem ${r.toLowerCase()}`);
    if (l.note) out.push(`• Obs.: ${l.note}`);
    out.push(money(lineTotal(l)), "");
  }

  out.push(LINE);
  out.push(`💰 Subtotal: ${money(subtotal)}`);
  if (c.fulfillment === "delivery") {
    out.push(`🛵 Entrega: ${fee === null ? "a combinar" : money(fee)}`);
  }
  out.push(`💵 *TOTAL: ${money(total)}*${c.fulfillment === "delivery" && fee === null ? " + entrega" : ""}`);
  out.push(LINE, "");

  if (c.fulfillment === "delivery") {
    out.push("📍 *Entrega*");
    out.push(`Rua: ${c.street.trim()}`);
    out.push(`Número: ${c.number.trim()}`);
    out.push(`Bairro: ${c.neighborhood.trim()}`);
    if (c.cep) out.push(`CEP: ${c.cep}`);
    if (c.complement.trim()) out.push(`Complemento: ${c.complement.trim()}`);
    if (c.reference.trim()) out.push(`Referência: ${c.reference.trim()}`);
  } else {
    out.push("🏠 *Retirada no local*");
    out.push(site.address.oneLine);
  }
  out.push("");

  if (c.payment) {
    out.push(`💳 *Pagamento:* ${PAYMENT_LABEL[c.payment]}`);
    if (c.payment === "dinheiro") {
      out.push(c.needsChange ? `💵 Troco para: ${money(parseMoney(c.changeFor))}` : "💵 Não precisa de troco");
    }
  }

  if (c.notes.trim()) {
    out.push("", "📝 *Observações:*", c.notes.trim());
  }

  return out.join("\n");
}

export const buildOrderLink = (lines: CartLine[], c: Customer) => whatsappLink(buildOrderMessage(lines, c));
