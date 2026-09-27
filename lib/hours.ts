import { site, type DayHours } from "@/data/site";

export const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Dia da semana (0-6) e minutos desde 00:00 no fuso da loja. */
export function storeNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

type Span = { start: number; end: number }; // minutos a partir do início do dia de abertura

const spans = (hours: DayHours | undefined): Span[] =>
  (hours ?? []).map(({ open, close }) => {
    const start = toMinutes(open);
    let end = toMinutes(close);
    if (end <= start) end += 24 * 60; // passa da meia-noite
    return { start, end };
  });

export type OpenStatus = {
  open: boolean;
  /** Texto curto, ex.: "Fecha às 23:00" ou "Abre hoje às 18:00" */
  detail: string;
};

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = storeNow(date);
  const yesterday = (day + 6) % 7;

  // Turno de hoje
  for (const s of spans(site.hours[day])) {
    if (minutes >= s.start && minutes < s.end) {
      return { open: true, detail: `Fecha às ${fmt(s.end)}` };
    }
  }
  // Turno de ontem que atravessou a meia-noite
  for (const s of spans(site.hours[yesterday])) {
    if (s.end > 24 * 60 && minutes < s.end - 24 * 60) {
      return { open: true, detail: `Fecha às ${fmt(s.end)}` };
    }
  }

  // Próxima abertura
  const later = spans(site.hours[day]).find((s) => s.start > minutes);
  if (later) return { open: false, detail: `Abre hoje às ${fmt(later.start)}` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const first = spans(site.hours[d])[0];
    if (first) {
      const when = i === 1 ? "amanhã" : WEEKDAYS[d].toLowerCase();
      return { open: false, detail: `Abre ${when} às ${fmt(first.start)}` };
    }
  }
  return { open: false, detail: "Consulte pelo WhatsApp" };
}

function fmt(totalMinutes: number) {
  const m = totalMinutes % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export const formatDayHours = (hours: DayHours | undefined) =>
  hours && hours.length ? hours.map((h) => `${h.open} – ${h.close}`).join(" · ") : "Fechado";
