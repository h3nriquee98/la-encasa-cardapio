"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "./icons";

type Props = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label: string;
  /** Mostra lixeira no lugar do "−" quando o valor está no mínimo 1. */
  trashAtOne?: boolean;
};

export function QtyStepper({ value, onChange, min = 1, max = 50, size = "md", label, trashAtOne }: Props) {
  const btn = size === "sm" ? "size-8" : "size-11";
  const showTrash = trashAtOne && value <= 1;
  return (
    <div
      className={`inline-flex items-center rounded-full bg-white ring-1 ring-crust ${size === "sm" ? "gap-0.5 p-0.5" : "gap-1 p-1"}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full text-patty transition hover:bg-bun disabled:opacity-30 disabled:hover:bg-transparent`}
        onClick={() => onChange(value - 1)}
        disabled={!showTrash && value <= min}
        aria-label={showTrash ? "Remover item" : "Diminuir quantidade"}
      >
        {showTrash ? <TrashIcon size={size === "sm" ? 15 : 18} /> : <MinusIcon size={size === "sm" ? 15 : 18} />}
      </button>
      <span className={`tabular min-w-6 text-center font-bold ${size === "sm" ? "text-sm" : "text-lg"}`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full text-patty transition hover:bg-bun disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
      >
        <PlusIcon size={size === "sm" ? 15 : 18} />
      </button>
    </div>
  );
}
