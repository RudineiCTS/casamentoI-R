"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/language";

const TARGET = new Date("2027-04-17T16:00:00-03:00").getTime();

function computeRemaining() {
  let diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return { d, h, m, s };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const t = useT();
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(
    null
  );

  useEffect(() => {
    const update = () => setRemaining(computeRemaining());
    const intervalId = setInterval(update, 1000);
    const timeoutId = setTimeout(update, 0);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const units: { key: string; value: string; pt: string; en: string }[] = [
    { key: "d", value: remaining ? String(remaining.d) : "--", pt: "Dias", en: "Days" },
    { key: "h", value: remaining ? pad(remaining.h) : "--", pt: "Horas", en: "Hours" },
    { key: "m", value: remaining ? pad(remaining.m) : "--", pt: "Min", en: "Min" },
    { key: "s", value: remaining ? pad(remaining.s) : "--", pt: "Seg", en: "Sec" },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "clamp(14px,4vw,46px)", margin: "44px 0 0" }}>
      {units.map((u) => (
        <div key={u.key} style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(40px,6vw,68px)",
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            {u.value}
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginTop: 8,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {t(u.pt, u.en)}
          </div>
        </div>
      ))}
    </div>
  );
}
