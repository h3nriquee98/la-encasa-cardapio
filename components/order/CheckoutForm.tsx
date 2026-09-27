"use client";

import { useEffect, useRef, useState } from "react";
import { mapsDirectionsUrl, site } from "@/data/site";
import { maskCep, maskPhone, money, onlyDigits } from "@/lib/format";
import {
  buildOrderLink,
  buildOrderMessage,
  orderTotals,
  validateCustomer,
  type Customer,
  type Errors,
  type Payment,
} from "@/lib/order";
import { useOpenStatus } from "../OpenStatus";
import { BikeIcon, CheckIcon, PinIcon, StoreIcon, WhatsAppIcon } from "../ui/icons";
import { useOrder } from "./OrderProvider";

const inputCls =
  "h-13 w-full rounded-2xl bg-white px-4 text-[16px] text-patty ring-1 ring-crust outline-none transition placeholder:text-cocoa/55 focus:ring-2 focus:ring-cheddar aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ketchup";

function Field({
  label,
  name,
  error,
  optional,
  className = "",
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 flex items-baseline justify-between text-sm font-bold text-patty">
        {label}
        {optional && <span className="text-xs font-medium text-cocoa">opcional</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-erro`} className="mt-1.5 text-sm font-semibold text-ketchup">
          {error}
        </p>
      )}
    </div>
  );
}

function Choice({
  checked,
  onSelect,
  name,
  children,
}: {
  checked: boolean;
  onSelect: () => void;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition ${
        checked ? "bg-cheddar/15 ring-2 ring-cheddar" : "bg-white ring-crust hover:ring-cheddar/60"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      {children}
      <span
        className={`ml-auto grid size-5 shrink-0 place-items-center rounded-full ring-2 ${
          checked ? "bg-ketchup text-white ring-ketchup" : "ring-crust"
        }`}
        aria-hidden
      >
        {checked && <CheckIcon size={12} strokeWidth={3.5} />}
      </span>
    </label>
  );
}

const PAYMENTS: { id: Payment; label: string; icon: string }[] = [
  { id: "pix", label: "Pix", icon: "⚡" },
  { id: "dinheiro", label: "Dinheiro", icon: "💵" },
  { id: "cartao", label: "Cartão", icon: "💳" },
];

export function CheckoutForm({ onSent }: { onSent: (link: string) => void }) {
  const { lines, customer: c, updateCustomer } = useOrder();
  const [errors, setErrors] = useState<Errors>({});
  const [cepState, setCepState] = useState<"idle" | "loading" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const status = useOpenStatus();
  const { subtotal, fee, total } = orderTotals(lines, c.fulfillment);

  const set = <K extends keyof Customer>(key: K, value: Customer[K]) => {
    updateCustomer({ [key]: value } as Partial<Customer>);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Preenche rua e bairro pelo CEP (ViaCEP)
  const cepDigits = onlyDigits(c.cep);
  useEffect(() => {
    if (cepDigits.length !== 8) return;
    const ctrl = new AbortController();
    setCepState("loading");
    fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.erro) return setCepState("error");
        setCepState("idle");
        updateCustomer({
          ...(data.logradouro ? { street: data.logradouro } : {}),
          ...(data.bairro ? { neighborhood: data.bairro } : {}),
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setCepState("error");
      });
    return () => ctrl.abort();
  }, [cepDigits, updateCustomer]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateCustomer(c, total);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    const link = buildOrderLink(lines, c);
    const win = window.open(link, "_blank");
    if (win) win.opener = null;
    else window.location.href = link; // bloqueador de pop-up: abre na mesma aba
    onSent(link);
  };

  const err = (k: keyof Customer) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-erro` } : {};

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-8 px-5 pt-2 pb-6 sm:px-7">
      {status && !status.open && (
        <p className="rounded-2xl bg-ketchup/10 px-4 py-3 text-sm font-semibold text-ketchup-deep">
          🔴 Estamos fechados agora ({status.detail.toLowerCase()}). Você pode enviar o pedido e ele será respondido quando abrirmos.
        </p>
      )}

      <section className="space-y-4">
        <h3 className="font-display text-xl text-patty">Seus dados</h3>
        <Field label="Nome" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={c.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Como podemos te chamar?"
            className={inputCls}
            {...err("name")}
          />
        </Field>
        <Field label="Telefone / WhatsApp" name="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={c.phone}
            onChange={(e) => set("phone", maskPhone(e.target.value))}
            placeholder="(16) 99999-9999"
            className={inputCls}
            {...err("phone")}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl text-patty">Como você quer receber?</h3>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Forma de recebimento">
          <Choice name="fulfillment" checked={c.fulfillment === "delivery"} onSelect={() => set("fulfillment", "delivery")}>
            <BikeIcon className="shrink-0 text-ketchup" />
            <span className="font-bold text-patty">Delivery</span>
          </Choice>
          <Choice name="fulfillment" checked={c.fulfillment === "retirada"} onSelect={() => set("fulfillment", "retirada")}>
            <StoreIcon className="shrink-0 text-ketchup" />
            <span className="leading-tight font-bold text-patty">Retirada</span>
          </Choice>
        </div>

        {c.fulfillment === "delivery" ? (
          <div className="animate-fade grid grid-cols-6 gap-3">
            <Field label="CEP" name="cep" optional className="col-span-6 sm:col-span-3">
              <input
                id="cep"
                name="cep"
                inputMode="numeric"
                autoComplete="postal-code"
                value={c.cep}
                onChange={(e) => set("cep", maskCep(e.target.value))}
                placeholder="14400-000"
                className={inputCls}
              />
              {cepState === "loading" && <p className="mt-1.5 text-sm text-cocoa">Buscando endereço…</p>}
              {cepState === "error" && <p className="mt-1.5 text-sm text-cocoa">CEP não encontrado. Preencha o endereço abaixo.</p>}
            </Field>
            <Field label="Rua" name="street" error={errors.street} className="col-span-6">
              <input
                id="street"
                name="street"
                autoComplete="address-line1"
                value={c.street}
                onChange={(e) => set("street", e.target.value)}
                className={inputCls}
                {...err("street")}
              />
            </Field>
            <Field label="Número" name="number" error={errors.number} className="col-span-2">
              <input
                id="number"
                name="number"
                inputMode="numeric"
                value={c.number}
                onChange={(e) => set("number", e.target.value)}
                className={inputCls}
                {...err("number")}
              />
            </Field>
            <Field label="Bairro" name="neighborhood" error={errors.neighborhood} className="col-span-4">
              <input
                id="neighborhood"
                name="neighborhood"
                value={c.neighborhood}
                onChange={(e) => set("neighborhood", e.target.value)}
                className={inputCls}
                {...err("neighborhood")}
              />
            </Field>
            <Field label="Complemento" name="complement" optional className="col-span-6">
              <input
                id="complement"
                name="complement"
                autoComplete="address-line2"
                value={c.complement}
                onChange={(e) => set("complement", e.target.value)}
                placeholder="Apto, bloco, casa dos fundos…"
                className={inputCls}
              />
            </Field>
            <Field label="Ponto de referência" name="reference" optional className="col-span-6">
              <input
                id="reference"
                name="reference"
                value={c.reference}
                onChange={(e) => set("reference", e.target.value)}
                placeholder="Perto de…"
                className={inputCls}
              />
            </Field>
          </div>
        ) : (
          <div className="animate-fade flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-crust">
            <PinIcon className="mt-0.5 shrink-0 text-ketchup" />
            <div>
              <p className="font-bold text-patty">Retirada na La Encasa</p>
              <p className="mt-0.5 text-[15px] text-cocoa">{site.address.oneLine}</p>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-bold text-ketchup underline underline-offset-2"
              >
                Como chegar
              </a>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl text-patty">Pagamento</h3>
        <div className="grid gap-2" role="radiogroup" aria-label="Forma de pagamento">
          {PAYMENTS.map((p) => (
            <Choice key={p.id} name="payment" checked={c.payment === p.id} onSelect={() => set("payment", p.id)}>
              <span aria-hidden>{p.icon}</span>
              <span className="font-bold text-patty">{p.label}</span>
            </Choice>
          ))}
        </div>
        {errors.payment && <p className="text-sm font-semibold text-ketchup">{errors.payment}</p>}

        {c.payment === "dinheiro" && (
          <div className="animate-fade space-y-3 rounded-2xl bg-bun/60 p-4">
            <p className="font-bold text-patty">Precisa de troco?</p>
            <div className="grid grid-cols-2 gap-2">
              <Choice name="needsChange" checked={!c.needsChange} onSelect={() => set("needsChange", false)}>
                <span className="font-semibold text-patty">Não</span>
              </Choice>
              <Choice name="needsChange" checked={c.needsChange} onSelect={() => set("needsChange", true)}>
                <span className="font-semibold text-patty">Sim</span>
              </Choice>
            </div>
            {c.needsChange && (
              <Field label="Troco para quanto?" name="changeFor" error={errors.changeFor}>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-cocoa">R$</span>
                  <input
                    id="changeFor"
                    name="changeFor"
                    inputMode="decimal"
                    value={c.changeFor}
                    onChange={(e) => set("changeFor", e.target.value.replace(/[^\d,.]/g, ""))}
                    placeholder="100,00"
                    className={`${inputCls} pl-11`}
                    {...err("changeFor")}
                  />
                </div>
              </Field>
            )}
          </div>
        )}
      </section>

      <section>
        <Field label="Observações do pedido" name="notes" optional>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={300}
            value={c.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Ex.: interfone quebrado, pode ligar quando chegar."
            className={`${inputCls} h-auto resize-none py-3`}
          />
        </Field>
      </section>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-crust">
        <dl className="tabular space-y-2 text-[15px]">
          <div className="flex justify-between text-cocoa">
            <dt>Subtotal</dt>
            <dd>{money(subtotal)}</dd>
          </div>
          {c.fulfillment === "delivery" && (
            <div className="flex justify-between text-cocoa">
              <dt>Taxa de entrega</dt>
              <dd>{fee === null ? "a combinar" : money(fee)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-crust pt-2 text-lg font-extrabold text-patty">
            <dt>Total</dt>
            <dd>
              {money(total)}
              {c.fulfillment === "delivery" && fee === null && <span className="text-sm font-semibold text-cocoa"> + entrega</span>}
            </dd>
          </div>
        </dl>
        {c.fulfillment === "delivery" && fee === null && (
          <p className="mt-3 text-sm text-cocoa">A taxa de entrega é confirmada pela La Encasa no WhatsApp.</p>
        )}
        <details className="group mt-4">
          <summary className="cursor-pointer list-none text-sm font-bold text-ketchup [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Ver a mensagem que será enviada</span>
            <span className="hidden group-open:inline">Esconder mensagem</span>
          </summary>
          <pre className="mt-3 max-h-72 overflow-auto rounded-2xl bg-bun/60 p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-patty">
            {buildOrderMessage(lines, c)}
          </pre>
        </details>
      </section>

      <button
        type="submit"
        className="flex h-15 w-full items-center justify-center gap-2.5 rounded-2xl bg-whatsapp text-[17px] font-extrabold text-ember shadow-[0_12px_28px_-12px_rgba(37,211,102,0.9)] transition hover:brightness-95 active:scale-[0.98]"
      >
        <WhatsAppIcon size={22} />
        Enviar pedido pelo WhatsApp
      </button>
      <p className="-mt-5 text-center text-[13px] text-cocoa">
        O WhatsApp abre com a mensagem pronta. É só tocar em enviar.
      </p>
    </form>
  );
}
