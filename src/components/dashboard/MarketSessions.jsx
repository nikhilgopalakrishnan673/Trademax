import { useEffect, useState } from "react";

// Standard (non-DST) session hours in UTC, as shown on BabyPips' Forex Market Hours tool.
const SESSIONS = [
  { name: "Sydney", start: 22, end: 7, color: "var(--color-faint)" },
  { name: "Tokyo", start: 0, end: 9, color: "var(--color-run)" },
  { name: "London", start: 8, end: 17, color: "var(--color-accent)" },
  { name: "New York", start: 13, end: 22, color: "var(--color-profit)" },
];

const pad = (n) => String(n).padStart(2, "0");
const hourOf = (d) => d.getUTCHours() + d.getUTCMinutes() / 60;
const isOpen = (s, h) => (s.start < s.end ? h >= s.start && h < s.end : h >= s.start || h < s.end);

/** Forex weekend: Friday 22:00 UTC until Sunday 22:00 UTC. */
function isWeekend(d) {
  const day = d.getUTCDay();
  const h = hourOf(d);
  return day === 6 || (day === 5 && h >= 22) || (day === 0 && h < 22);
}

/** Bar segments (in % of 24h) for a session, split when it wraps past midnight. */
function segments({ start, end }) {
  const seg = (a, b) => ({ left: (a / 24) * 100, width: ((b - a) / 24) * 100 });
  return start < end ? [seg(start, end)] : [seg(start, 24), seg(0, end)];
}

/** Current forex market session(s) with a 24-hour UTC timeline and a "now" marker. */
export default function MarketSessions() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  const h = hourOf(now);
  const weekend = isWeekend(now);
  const active = weekend ? [] : SESSIONS.filter((s) => isOpen(s, h));
  const local = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const utc = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`;
  const status = weekend ? "Market closed (weekend)" : active.length ? active.map((s) => s.name).join(" + ") : "Between sessions";
  const overlap = active.length > 1 ? "Session overlap: typically higher volume" : null;

  return (
    <section className="card" aria-label="Forex market sessions">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="label">Forex market session</div>
          <div className="mt-1.5 text-[1.125rem] leading-tight font-semibold sm:text-[1.25rem]">{status}</div>
        </div>
        <div className="num shrink-0 text-right text-xs text-muted">
          <div>{local} local</div>
          <div>{utc} UTC</div>
        </div>
      </div>

      <div className="relative mt-4 mb-1">
        <div className="relative flex flex-col gap-1.5">
          {SESSIONS.map((s) => {
            const open = !weekend && isOpen(s, h);
            return (
              <div key={s.name} className="flex items-center gap-2">
                <span className={`w-16 shrink-0 text-xs ${open ? "font-semibold text-fg" : "text-muted"}`}>{s.name}</span>
                <div className="relative h-4 flex-1 rounded-full bg-surface-2">
                  {segments(s).map((g, i) => (
                    <span
                      key={i}
                      className="absolute top-0 h-full rounded-full"
                      style={{ left: `${g.left}%`, width: `${g.width}%`, background: s.color, opacity: open ? 1 : 0.35 }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* "Now" marker, aligned to the bar track (16 = label width 4rem + gap 0.5rem → 4.5rem). */}
        <div className="pointer-events-none absolute inset-y-0 right-0 left-[4.5rem]" aria-hidden="true">
          <div className="absolute -inset-y-1 w-0.5 rounded bg-loss" style={{ left: `${(h / 24) * 100}%` }} />
        </div>
      </div>

      <div className="ml-[4.5rem] flex justify-between text-[0.6875rem] text-faint num" aria-hidden="true">
        {["00", "06", "12", "18", "24"].map((t) => <span key={t}>{t}</span>)}
      </div>

      <small className="mt-2 block text-xs text-muted">{overlap ?? "Hours in UTC (standard time). Red line = now."}</small>
    </section>
  );
}
