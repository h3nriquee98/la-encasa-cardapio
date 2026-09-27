"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/** Status calculado só no navegador (evita divergência entre servidor e cliente). */
export function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);
  return status;
}

type Props = { tone?: "light" | "dark"; showDetail?: boolean; className?: string };

export function OpenStatusPill({ tone = "light", showDetail = true, className = "" }: Props) {
  const status = useOpenStatus();
  const dark = tone === "dark";
  if (!status) {
    return <span className={`inline-block h-7 w-28 rounded-full ${dark ? "bg-white/10" : "bg-crust/60"} ${className}`} aria-hidden />;
  }
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold whitespace-nowrap",
        dark ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-white text-patty ring-1 ring-crust",
        className,
      ].join(" ")}
    >
      <span className="relative flex size-2.5">
        {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-lettuce/60" />}
        <span className={`relative size-2.5 rounded-full ${status.open ? "bg-lettuce" : "bg-ketchup"}`} />
      </span>
      {status.open ? "Aberto agora" : "Fechado agora"}
      {showDetail && <span className={`font-normal ${dark ? "text-white/70" : "text-cocoa"}`}>· {status.detail}</span>}
    </span>
  );
}
