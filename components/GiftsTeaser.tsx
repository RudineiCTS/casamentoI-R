"use client";

import Link from "next/link";
import { useT } from "@/lib/language";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const categories = [
  { icon: "🏡", title: { pt: "Lista Tradicional", en: "Traditional list" }, text: { pt: "Itens para o nosso novo lar", en: "Items for our new home" } },
  { icon: "✈️", title: { pt: "Cotas de Lua de Mel", en: "Honeymoon fund" }, text: { pt: "Experiências para a nossa viagem", en: "Experiences for our trip" } },
  { icon: "♥", title: { pt: "Presente via PIX", en: "Gift via PIX" }, text: { pt: "QR Code e chave para presentear", en: "QR code & key for your gift" } },
];

export default function GiftsTeaser() {
  const t = useT();

  return (
    <section id="presentes" style={{ scrollMarginTop: 80, padding: "clamp(80px,12vh,150px) clamp(20px,5vw,64px)", background: "var(--sand)" }}>
      <SectionHeader
        label={t("Lista de Presentes", "GIFT REGISTRY")}
        title={t("Sua presença é o presente", "Your presence is the gift")}
        description={t(
          "Mas se quiser nos presentear, separamos algumas formas com todo o carinho.",
          "But if you wish to give us something, here are a few ways with all our love."
        )}
        marginBottom="clamp(40px,5vh,60px)"
      />

      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
        {categories.map((c, i) => (
          <Reveal key={i} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 3, padding: "36px 28px", textAlign: "center" }}>
            <span style={{ fontSize: 30, color: "var(--gold)" }}>{c.icon}</span>
            <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: 26, margin: "14px 0 8px" }}>{t(c.title.pt, c.title.en)}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted-2)", margin: 0 }}>{t(c.text.pt, c.text.en)}</p>
          </Reveal>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 46 }}>
        <Link
          href="/presentes"
          style={{
            display: "inline-block",
            background: "var(--gold)",
            color: "#fff",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "17px 44px",
            borderRadius: 2,
          }}
        >
          {t("Ver lista completa de presentes", "See the full registry")}
        </Link>
      </div>
    </section>
  );
}
