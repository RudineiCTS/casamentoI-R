"use client";

import { useLanguage, useT } from "@/lib/language";

const links = [
  { href: "#historia", pt: "Nossa História", en: "Our Story" },
  { href: "#evento", pt: "Evento", en: "Event" },
  { href: "#galeria", pt: "Galeria", en: "Gallery" },
  { href: "#presentes", pt: "Presentes", en: "Gifts" },
];

export default function Nav() {
  const { lang, setLang } = useLanguage();
  const t = useT();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        padding: "16px clamp(20px,5vw,64px)",
        background: "rgba(251,247,239,0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <a
        href="#inicio"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: "0.04em",
          color: "var(--ink)",
          whiteSpace: "nowrap",
        }}
      >
        I <span style={{ color: "var(--gold)", fontStyle: "italic" }}>&amp;</span> R
      </a>

      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,30px)" }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              fontSize: 12.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted-1)",
            }}
          >
            {t(l.pt, l.en)}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, letterSpacing: "0.1em" }}>
          <button
            type="button"
            onClick={() => setLang("pt")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              letterSpacing: "0.1em",
              padding: "2px 2px",
              color: lang === "pt" ? "var(--ink)" : "var(--muted-5)",
              fontWeight: lang === "pt" ? 600 : 400,
            }}
          >
            PT
          </button>
          <span style={{ color: "var(--gold-mid)" }}>/</span>
          <button
            type="button"
            onClick={() => setLang("en")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              letterSpacing: "0.1em",
              padding: "2px 2px",
              color: lang === "en" ? "var(--ink)" : "var(--muted-5)",
              fontWeight: lang === "en" ? 600 : 400,
            }}
          >
            EN
          </button>
        </div>
        <a
          href="#rsvp"
          style={{
            display: "inline-block",
            background: "var(--gold)",
            color: "#fff",
            fontSize: 11.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "12px 22px",
            borderRadius: 2,
            whiteSpace: "nowrap",
          }}
        >
          {t("Confirmar Presença", "RSVP")}
        </a>
      </div>
    </nav>
  );
}
