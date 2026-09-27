const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 12.5 -> "R$ 12,50" (com espaço normal, para funcionar bem no WhatsApp) */
export const money = (value: number) => brl.format(value).replace(/ /g, " ");

/** Remove acentos e caixa para busca. */
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const onlyDigits = (s: string) => s.replace(/\D/g, "");

export const maskPhone = (value: string) => {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const maskCep = (value: string) => {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/** "50" ou "50,00" ou "R$ 50" -> 50 */
export const parseMoney = (value: string) => {
  const clean = value.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(clean);
  return Number.isFinite(n) ? n : NaN;
};
