"use client";

import { useEffect, useState } from "react";
import { mapsDirectionsUrl, mapsEmbedUrl, site, whatsappLink } from "@/data/site";
import { formatDayHours, storeNow, WEEKDAYS } from "@/lib/hours";
import { OpenStatusPill } from "./OpenStatus";
import { ClockIcon, PinIcon, WhatsAppIcon } from "./ui/icons";

// Semana começando na segunda
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function Location() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(storeNow().day), []);

  return (
    <section id="localizacao" className="bg-patty py-20 text-white sm:py-28" aria-labelledby="local-titulo">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-cheddar uppercase">Localização</p>
          <h2 id="local-titulo" className="mt-2 font-display text-4xl leading-[1.05] sm:text-5xl">
            Onde estamos
          </h2>

          <div className="mt-8 flex gap-3">
            <PinIcon className="mt-1 shrink-0 text-cheddar" />
            <address className="text-[17px] leading-relaxed not-italic">
              <strong className="block text-lg">{site.name}</strong>
              {site.address.street}
              <br />
              {site.address.neighborhood} · {site.address.city} - {site.address.state}
              {site.address.postalCode && (
                <>
                  <br />
                  <span className="text-white/60">CEP {site.address.postalCode}</span>
                </>
              )}
            </address>
          </div>

          <div className="mt-8 flex gap-3">
            <ClockIcon className="mt-1 shrink-0 text-cheddar" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-lg">Horário</strong>
                <OpenStatusPill tone="dark" />
              </div>
              <ul className="mt-3 divide-y divide-white/10 text-[15px]">
                {ORDER.map((d) => (
                  <li
                    key={d}
                    className={`flex justify-between py-2 ${today === d ? "font-bold text-cheddar" : "text-white/80"}`}
                    aria-current={today === d ? "date" : undefined}
                  >
                    <span>
                      {WEEKDAYS[d]}
                      {today === d && " (hoje)"}
                    </span>
                    <span className="tabular">{formatDayHours(site.hours[d])}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-cheddar font-extrabold text-patty transition hover:bg-[#ffb829]"
            >
              <PinIcon size={19} /> Como chegar
            </a>
            <a
              href={whatsappLink("Olá, La Encasa!")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white/10 font-bold ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <WhatsAppIcon size={20} /> Chamar no WhatsApp
            </a>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-[28px] bg-ember ring-1 ring-white/10 lg:min-h-full">
          <iframe
            title="Mapa: La Encasa, Av. Paulo VI, 1517 – Franca/SP"
            src={mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale-[0.2]"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
