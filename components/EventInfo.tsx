"use client";

import { useT } from "@/lib/language";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

function EventCard({
  icon,
  title,
  date,
  time,
  venue,
  address,
  mapUrl,
}: {
  icon: string;
  title: { pt: string; en: string };
  date: { pt: string; en: string };
  time: string;
  venue: { pt: string; en: string };
  address: { pt: string; en: string };
  mapUrl: string;
}) {
  const t = useT();
  return (
    <Reveal style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 3, padding: "42px 38px", textAlign: "center" }}>
      <span style={{ fontSize: 30, color: "var(--gold)" }}>{icon}</span>
      <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: 30, margin: "14px 0 4px" }}>{t(title.pt, title.en)}</h3>
      <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 22px" }}>{t(date.pt, date.en)}</p>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 34, margin: 0 }}>{time}</p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted-1)", margin: "18px 0 0" }}>{t(venue.pt, venue.en)}</p>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted-2)", margin: "4px 0 24px" }}>{t(address.pt, address.en)}</p>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: "var(--gold)",
          color: "#fff",
          fontSize: 11.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          padding: "14px 30px",
          borderRadius: 2,
        }}
      >
        {t("Como Chegar", "Get Directions")}
      </a>
    </Reveal>
  );
}

export default function EventInfo() {
  const t = useT();

  return (
    <section id="evento" style={{ scrollMarginTop: 80, padding: "clamp(80px,12vh,150px) clamp(20px,5vw,64px)", background: "var(--sand)" }}>
      <SectionHeader label={t("O Evento", "THE EVENT")} title={t("Quando e onde", "When & where")} />

      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 28 }}>
        <EventCard
          icon="⛪"
          title={{ pt: "Cerimônia", en: "Ceremony" }}
          date={{ pt: "Sábado, 17 de Abril de 2027", en: "Saturday, April 17, 2027" }}
          time="16h00"
          venue={{ pt: "Igreja Nossa Senhora do Rosário", en: "Our Lady of the Rosary Church" }}
          address={{ pt: "Av. das Flores, 123 · Jardim Europa · São Paulo", en: "123 Flores Ave · Jardim Europa · São Paulo" }}
          mapUrl="https://www.google.com/maps/search/Igreja+Nossa+Senhora+do+Rosario+Sao+Paulo"
        />
        <EventCard
          icon="🥂"
          title={{ pt: "Recepção", en: "Reception" }}
          date={{ pt: "Sábado, 17 de Abril de 2027", en: "Saturday, April 17, 2027" }}
          time="18h30"
          venue={{ pt: "Espaço Villa Toscana", en: "Villa Toscana Events Space" }}
          address={{ pt: "Estrada dos Ipês, 456 · Sítio do Mato · São Paulo", en: "456 Ipês Rd · Sítio do Mato · São Paulo" }}
          mapUrl="https://www.google.com/maps/search/Espaco+Villa+Toscana+Sao+Paulo"
        />
      </div>

      <Reveal
        style={{
          maxWidth: 980,
          margin: "28px auto 0",
          position: "relative",
          border: "1px solid var(--line)",
          borderRadius: 3,
          overflow: "hidden",
          height: 340,
          backgroundImage:
            "repeating-linear-gradient(45deg,#e7dcc6 0 2px,transparent 2px 26px),repeating-linear-gradient(-45deg,#ece2cf 0 1px,transparent 1px 40px)",
          backgroundColor: "#efe5d1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", background: "rgba(251,247,239,0.9)", padding: "26px 34px", border: "1px solid var(--line)", borderRadius: 3 }}>
          <span style={{ fontSize: 26, color: "var(--gold)" }}>📍</span>
          <p style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted-2)", margin: "10px 0 14px" }}>
            [ {t("mapa interativo — cerimônia, festa e estacionamento", "Interactive map — ceremony, reception & parking")} ]
          </p>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "transparent",
              border: "1px solid var(--gold)",
              color: "var(--gold-dark)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "11px 24px",
              borderRadius: 2,
            }}
          >
            {t("Abrir no Google Maps", "Open in Google Maps")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
