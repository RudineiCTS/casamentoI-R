"use client";

import { FormEvent, useState, useTransition } from "react";
import { submitRsvp } from "@/app/rsvp/actions";
import { useT } from "@/lib/language";
import SectionHeader from "./SectionHeader";

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  border: "1px solid var(--line)",
  borderRadius: 2,
  background: "#fff",
  fontSize: 15,
  color: "var(--ink)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--muted-1)",
};

export default function Rsvp() {
  const t = useT();
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nome = (data.get("nome") as string | null)?.trim() ?? "";
    setError(null);
    start(async () => {
      const res = await submitRsvp(data);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setFirstName(nome.split(" ")[0] || nome);
      setSubmitted(true);
    });
  };

  return (
    <section id="rsvp" style={{ scrollMarginTop: 80, padding: "clamp(80px,12vh,150px) clamp(20px,5vw,64px)", background: "var(--cream)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SectionHeader
          label={t("Confirmação de Presença", "RSVP")}
          title={t("Você vem celebrar conosco?", "Will you celebrate with us?")}
          description={t("Por favor, confirme até 17 de Março de 2027.", "Please confirm by March 17, 2027.")}
          marginBottom="clamp(40px,5vh,56px)"
        />

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "grid", gap: 7 }}>
              <label style={labelStyle}>{t("Nome completo", "Full name")}</label>
              <input name="nome" required type="text" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gap: 7 }}>
              <label style={labelStyle}>{t("Telefone", "Phone")}</label>
              <input name="telefone" required type="tel" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gap: 7 }}>
              <label style={labelStyle}>{t("E-mail (opcional)", "E-mail (optional)")}</label>
              <input name="email" type="email" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gap: 7 }}>
              <label style={labelStyle}>{t("Recado para os noivos", "Message to the couple")}</label>
              <textarea name="obs" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            {error && <p style={{ color: "#a33", fontSize: 14, margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={pending}
              style={{
                background: "var(--gold)",
                color: "#fff",
                border: "none",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: 18,
                borderRadius: 2,
                cursor: "pointer",
                marginTop: 6,
              }}
            >
              {pending ? t("Enviando...", "Sending...") : t("Confirmar minha presença", "Confirm my attendance")}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: 3, padding: "56px 40px" }}>
            <span style={{ fontSize: 40, color: "var(--gold)" }}>♥</span>
            <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 34, margin: "14px 0 10px" }}>
              {t(`Até lá, ${firstName}!`, `See you there, ${firstName}!`)}
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--muted-1)", margin: "0 auto", maxWidth: 420 }}>
              {t(
                "Ficamos muito felizes que você fará parte deste dia. Prepare-se para celebrar conosco em 17 de abril de 2027.",
                "We are so happy you will be part of this day. Get ready to celebrate with us on April 17, 2027."
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
