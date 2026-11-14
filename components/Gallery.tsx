"use client";

import { useState } from "react";
import { useT } from "@/lib/language";
import SectionHeader from "./SectionHeader";

const captions = [
  "pré-wedding · 01",
  "ensaio · 02",
  "casal · 03",
  "pré-wedding · 04",
  "ensaio · 05",
  "casal · 06",
  "pré-wedding · 07",
  "ensaio · 08",
];
const rowSpans = [2, 1, 1, 1, 2, 1, 1, 1];

export default function Gallery() {
  const t = useT();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const n = captions.length;
  const open = (i: number) => setLightboxIndex(((i % n) + n) % n);

  return (
    <section id="galeria" style={{ scrollMarginTop: 80, padding: "clamp(80px,12vh,150px) clamp(20px,5vw,64px)", background: "var(--cream)" }}>
      <SectionHeader
        label={t("Galeria", "GALLERY")}
        title={t("Momentos a dois", "Moments together")}
        description={t("Clique em qualquer foto para ampliar.", "Click any photo to view it larger.")}
        marginBottom="clamp(46px,6vh,70px)"
      />

      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, gridAutoRows: 230 }}>
        {captions.map((cap, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => open(i)}
            style={{
              gridRow: `span ${rowSpans[i]}`,
              backgroundImage: "repeating-linear-gradient(135deg,#ddd0b6 0 2px,transparent 2px 18px)",
              backgroundColor: "#e9dec8",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "flex-end",
              padding: 12,
              cursor: "pointer",
              transition: "filter .3s,transform .3s",
              overflow: "hidden",
              filter: hoverIndex === i ? "brightness(0.94)" : "none",
              transform: hoverIndex === i ? "scale(1.01)" : "none",
            }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 10.5, color: "var(--muted-3)" }}>[ {cap} ]</span>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
          style={{
            display: "flex",
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(28,24,18,0.92)",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            style={{ position: "absolute", top: 24, right: 30, background: "none", border: "none", color: "#fff", fontSize: 34, cursor: "pointer", lineHeight: 1, fontFamily: "var(--font-cormorant), serif" }}
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => open(lightboxIndex - 1)}
            style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 46, cursor: "pointer", lineHeight: 1 }}
          >
            ‹
          </button>
          <div
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              aspectRatio: "3/2",
              width: 760,
              backgroundImage: "repeating-linear-gradient(135deg,#5b5040 0 2px,transparent 2px 22px)",
              backgroundColor: "#473e31",
              display: "flex",
              alignItems: "flex-end",
              padding: 18,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>[ {captions[lightboxIndex]} ]</span>
          </div>
          <button
            type="button"
            onClick={() => open(lightboxIndex + 1)}
            style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 46, cursor: "pointer", lineHeight: 1 }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
