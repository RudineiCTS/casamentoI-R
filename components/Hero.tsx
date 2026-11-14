"use client";

import { useT } from "@/lib/language";
import Reveal from "./Reveal";
import Countdown from "./Countdown";

/**
 * Foto de fundo do hero: public/hero.jpg (retrato, 1602×2400).
 * Em telas em pé (celular) a foto cobre a tela inteira.
 * Em telas largas (desktop) ela aparece inteira no centro, com as laterais
 * preenchidas por uma versão desfocada dela mesma. Estilos em app/globals.css (.hero-*).
 * Se trocarem a foto por uma versão 16:9 (estendida com IA), basta remover o bloco
 * @media de .hero-* no globals.css para ela cobrir a tela em qualquer tamanho.
 */

export default function Hero() {
  const t = useT();

  return (
    <section
      id="inicio"
      style={{
        scrollMarginTop: 80,
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "140px clamp(20px,5vw,64px) 80px",
        overflow: "hidden",
      }}
    >
      {/* Fallback (aparece se a foto ainda não existir em public/) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg,#4a4034 0 2px,transparent 2px 22px),linear-gradient(180deg,#5b5040,#3a322a)",
        }}
      />
      {/* Preenchimento desfocado das laterais (só aparece em telas largas) */}
      <div aria-hidden className="hero-fill" />
      {/* Foto principal do casal */}
      <div aria-hidden className="hero-photo" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg,rgba(35,30,24,0.55),rgba(35,30,24,0.35) 40%,rgba(35,30,24,0.7))",
        }}
      />

      <div style={{ position: "relative", zIndex: 3, color: "#fff", maxWidth: 980 }}>
        <Reveal as="p" style={{ fontSize: 13, letterSpacing: "0.45em", textTransform: "uppercase", margin: "0 0 26px", color: "rgba(255,255,255,0.82)" }}>
          {t("Vamos nos casar", "WE'RE GETTING MARRIED")}
        </Reveal>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 300,
            fontSize: "clamp(64px,13vw,168px)",
            lineHeight: 0.92,
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          Isabella{" "}
          <span style={{ fontStyle: "italic", color: "#E6CD8F", fontWeight: 400 }}>&amp;</span> Rudinei
        </h1>

        <Reveal
          as="p"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(19px,2.3vw,27px)",
            lineHeight: 1.5,
            maxWidth: 620,
            margin: "30px auto 0",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {t(
            "Estamos contando os dias para celebrar este momento tão especial ao lado das pessoas que amamos.",
            "We are counting down the days to celebrate this very special moment surrounded by the people we love."
          )}
        </Reveal>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            margin: "34px 0 0",
            fontSize: 13,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
            flexWrap: "wrap",
          }}
        >
          <span>17 · 04 · 2027</span>
          <span style={{ width: 5, height: 5, background: "#E6CD8F", transform: "rotate(45deg)", display: "inline-block" }} />
          <span>{t("São Paulo · Brasil", "São Paulo · Brazil")}</span>
        </div>

        <Countdown />

        <div style={{ display: "flex", justifyContent: "center", gap: 16, margin: "46px 0 0", flexWrap: "wrap" }}>
          <a
            href="#rsvp"
            style={{
              display: "inline-block",
              background: "var(--gold)",
              color: "#fff",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "17px 38px",
              borderRadius: 2,
            }}
          >
            {t("Confirmar Presença", "Confirm Attendance")}
          </a>
          <a
            href="#evento"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.6)",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "17px 38px",
              borderRadius: 2,
            }}
          >
            {t("Ver Informações", "View Information")}
          </a>
        </div>
      </div>
    </section>
  );
}
