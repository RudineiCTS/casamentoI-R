"use client";

import { useEffect, useState, useTransition } from "react";
import { useT } from "@/lib/language";
import { formatBRL, type Gift } from "@/lib/gifts/types";
import { startCheckoutAction } from "@/app/presentes/actions";
import GiftThumb from "./GiftThumb";
import PixCard from "./PixCard";

export default function GiftModal({
  gift,
  pix,
  onlinePayment,
  onClose,
}: {
  gift: Gift;
  pix: { key: string; holder: string; bank: string };
  onlinePayment: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const max = gift.quotas ? gift.quotas.total - gift.quotas.given : 1;
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const total = formatBRL(gift.priceCents * qty);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(35,30,24,0.55)", display: "grid", placeItems: "center", padding: 16, overflowY: "auto" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, background: "var(--cream)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <button onClick={onClose} aria-label={t("Fechar", "Close")} style={{ position: "absolute", top: 10, right: 12, zIndex: 2, background: "rgba(255,255,255,0.85)", border: 0, borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer" }}>
          ×
        </button>
        <GiftThumb gift={gift} ratio="16 / 9" />
        <div style={{ padding: "24px 28px 30px", display: "grid", gap: 18 }}>
          <div>
            <p style={{ fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>{gift.category}</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: 30, margin: "6px 0 0" }}>{gift.title}</h2>
            {gift.description && <p style={{ fontSize: 14, color: "var(--muted-2)", lineHeight: 1.6, margin: "6px 0 0" }}>{gift.description}</p>}
          </div>

          {gift.quotas && max > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: 13, color: "var(--muted-1)" }}>
                {t("Quantas cotas?", "How many shares?")} <small>({formatBRL(gift.priceCents)} {t("cada", "each")})</small>
              </span>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", background: "#fff" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                <span style={{ minWidth: 34, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(max, q + 1))} style={qtyBtn}>+</button>
              </div>
            </div>
          )}

          <PixCard pix={pix} amount={total} />

          {onlinePayment && (
            <button
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await startCheckoutAction(gift.id, qty);
                  if (res?.error) setError(res.error);
                })
              }
              style={{ background: "var(--ink)", color: "#fff", border: 0, padding: "15px", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
            >
              {pending ? t("Abrindo pagamento...", "Opening checkout...") : t(`Pagar ${total} com cartão`, `Pay ${total} by card`)}
            </button>
          )}
          {error && <p style={{ color: "#a33", fontSize: 13, margin: 0 }}>{error}</p>}

          {gift.storeUrl && (
            <a href={gift.storeUrl} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", fontSize: 13, color: "var(--gold-dark)", textDecoration: "underline" }}>
              {t("Prefere comprar o item? Ver na loja ↗", "Prefer to buy the item? See it in the store ↗")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const qtyBtn: React.CSSProperties = { background: "none", border: 0, width: 34, height: 34, fontSize: 18, cursor: "pointer", color: "var(--ink)" };
