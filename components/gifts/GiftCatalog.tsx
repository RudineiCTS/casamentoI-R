"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage, useT } from "@/lib/language";
import { formatBRL, isAvailable, type Gift, type GiftKind } from "@/lib/gifts/types";
import GiftThumb from "./GiftThumb";
import GiftModal from "./GiftModal";
import PixCard from "./PixCard";

type Tab = GiftKind | "pix";
type Pix = { key: string; holder: string; bank: string };

export default function GiftCatalog({ gifts, pix, onlinePayment }: { gifts: Gift[]; pix: Pix; onlinePayment: boolean }) {
  const t = useT();
  const { lang, setLang } = useLanguage();
  const [tab, setTab] = useState<Tab>("tradicional");
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Gift | null>(null);

  const inTab = useMemo(() => gifts.filter((g) => g.kind === tab), [gifts, tab]);
  const categories = useMemo(() => [...new Set(inTab.map((g) => g.category))], [inTab]);
  const shown = category ? inTab.filter((g) => g.category === category) : inTab;

  const tabs: { id: Tab; pt: string; en: string }[] = [
    { id: "tradicional", pt: "Lista Tradicional", en: "Traditional" },
    { id: "lua-de-mel", pt: "Lua de Mel", en: "Honeymoon" },
    { id: "pix", pt: "PIX", en: "PIX" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px clamp(20px,5vw,64px)",
          background: "rgba(251,247,239,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Link href="/" style={{ fontSize: 12.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted-1)" }}>
          ← {t("Voltar ao início", "Back to home")}
        </Link>
        <Link href="/" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, fontWeight: 500 }}>
          I <span style={{ color: "var(--gold)", fontStyle: "italic" }}>&amp;</span> R
        </Link>
        <div style={{ fontSize: 12, letterSpacing: "0.12em", display: "flex", gap: 8 }}>
          {(["pt", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{ background: "none", border: 0, cursor: "pointer", fontWeight: lang === l ? 600 : 400, color: lang === l ? "var(--ink)" : "var(--muted-5)", fontSize: 12, letterSpacing: "0.12em" }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section style={{ textAlign: "center", padding: "clamp(56px,9vh,96px) clamp(20px,5vw,64px) 36px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 18px" }}>
          {t("Lista de Presentes", "Gift Registry")}
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300, fontSize: "clamp(40px,6vw,68px)", lineHeight: 1.05, margin: 0 }}>
          {t("Sua presença é o presente", "Your presence is the gift")}
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted-2)", margin: "18px auto 0", maxWidth: 520 }}>
          {t(
            "Mas, se quiser nos presentear, escolha um item da lista ou contribua com a nossa lua de mel. Obrigado por todo o carinho!",
            "But if you wish to give us something, choose an item from the list or contribute to our honeymoon. Thank you for all your love!"
          )}
        </p>
      </section>

      <nav style={{ display: "flex", justifyContent: "center", gap: 0, borderBottom: "1px solid var(--line)", maxWidth: 640, margin: "0 auto 34px", padding: "0 20px" }}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => {
              setTab(tb.id);
              setCategory(null);
            }}
            style={{
              flex: 1,
              background: "none",
              border: 0,
              borderBottom: "2px solid " + (tab === tb.id ? "var(--gold)" : "transparent"),
              padding: "14px 8px",
              cursor: "pointer",
              fontSize: 12.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: tab === tb.id ? "var(--ink)" : "var(--muted-2)",
              marginBottom: -1,
            }}
          >
            {t(tb.pt, tb.en)}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px,5vw,64px) 110px" }}>
        {tab === "pix" ? (
          <PixCard pix={pix} />
        ) : (
          <>
            {categories.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 30 }}>
                {[null, ...categories].map((c) => (
                  <button
                    key={c ?? "all"}
                    onClick={() => setCategory(c)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 20,
                      fontSize: 13,
                      cursor: "pointer",
                      border: "1px solid " + (category === c ? "var(--gold)" : "var(--line)"),
                      background: category === c ? "var(--gold)" : "#fff",
                      color: category === c ? "#fff" : "var(--muted-1)",
                    }}
                  >
                    {c ?? t("Todos", "All")}
                  </button>
                ))}
              </div>
            )}

            {shown.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-2)", padding: 40 }}>{t("Em breve novos presentes por aqui.", "More gifts coming soon.")}</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 22 }}>
                {shown.map((g) => (
                  <GiftCard key={g.id} gift={g} onSelect={() => setSelected(g)} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selected && <GiftModal gift={selected} pix={pix} onlinePayment={onlinePayment} onClose={() => setSelected(null)} />}
    </div>
  );
}

function GiftCard({ gift, onSelect }: { gift: Gift; onSelect: () => void }) {
  const t = useT();
  const available = isAvailable(gift);
  const q = gift.quotas;
  return (
    <article style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 3, overflow: "hidden", display: "flex", flexDirection: "column", opacity: available ? 1 : 0.6 }}>
      <GiftThumb gift={gift} />
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <p style={{ fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>{gift.category}</p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: 23, lineHeight: 1.15, margin: 0 }}>{gift.title}</h3>
        {gift.description && <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted-2)", margin: 0 }}>{gift.description}</p>}
        {q && (
          <div style={{ marginTop: 4 }}>
            <div style={{ height: 4, background: "var(--sand)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(q.given / q.total) * 100}%`, height: "100%", background: "var(--gold)" }} />
            </div>
            <p style={{ fontSize: 12, color: "var(--muted-2)", margin: "6px 0 0" }}>
              {t(`${q.given} de ${q.total} cotas`, `${q.given} of ${q.total} shares`)}
            </p>
          </div>
        )}
        <div style={{ marginTop: "auto", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24 }}>
            {formatBRL(gift.priceCents)}
            {q && <small style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 11, color: "var(--muted-2)" }}> /{t("cota", "share")}</small>}
          </span>
          <button
            onClick={onSelect}
            disabled={!available}
            style={{
              background: available ? "var(--gold)" : "var(--line)",
              color: "#fff",
              border: 0,
              padding: "11px 18px",
              borderRadius: 2,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: available ? "pointer" : "default",
            }}
          >
            {available ? t("Presentear", "Give") : q ? t("Completo", "Complete") : t("Recebido", "Received")}
          </button>
        </div>
      </div>
    </article>
  );
}
