"use client";

import { useT } from "@/lib/language";

export default function Footer() {
  const t = useT();

  return (
    <footer style={{ background: "var(--ink)", color: "#e8ddc8", textAlign: "center", padding: "clamp(60px,9vh,100px) clamp(20px,5vw,64px)" }}>
      <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300, fontSize: "clamp(40px,7vw,84px)", margin: 0, letterSpacing: "0.02em" }}>
        Isa <span style={{ fontStyle: "italic", color: "#E6CD8F" }}>&amp;</span> Rudinei
      </h2>
      <p style={{ fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", margin: "18px 0 30px", color: "#c9bca0" }}>17 · 04 · 2027 — São Paulo</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 22, margin: "0 0 34px" }}>
        {["Instagram", "Facebook", "TikTok"].map((s) => (
          <a key={s} href="#" style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: "1px solid rgba(230,205,143,0.4)", paddingBottom: 3 }}>
            {s}
          </a>
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 17, color: "var(--muted-4)", margin: 0 }}>
        {t("Feito com amor para os nossos convidados", "Made with love for our guests")}
      </p>
    </footer>
  );
}
