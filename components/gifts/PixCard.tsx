"use client";

import { useState } from "react";
import { useT } from "@/lib/language";

export default function PixCard({ pix, amount }: { pix: { key: string; holder: string; bank: string }; amount?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pix.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* navegador sem permissão: o convidado pode copiar manualmente */
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", background: "#fff", border: "1px solid var(--line)", borderRadius: 3, padding: "34px 30px", textAlign: "center" }}>
      <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>{t("Presente via PIX", "Gift via PIX")}</p>
      {amount && (
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 38, margin: "12px 0 0" }}>{amount}</p>
      )}
      <p style={{ fontSize: 14, color: "var(--muted-2)", lineHeight: 1.6, margin: "12px 0 20px" }}>
        {t("Copie a chave abaixo e faça o PIX pelo app do seu banco.", "Copy the key below and send the PIX from your bank app.")}
      </p>
      <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 2, overflow: "hidden" }}>
        <code style={{ flex: 1, padding: "13px 14px", fontSize: 14, background: "var(--cream)", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pix.key}</code>
        <button onClick={copy} style={{ background: "var(--gold)", color: "#fff", border: 0, padding: "0 18px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
          {copied ? t("Copiado!", "Copied!") : t("Copiar", "Copy")}
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted-1)", margin: "14px 0 0" }}>
        {pix.holder}
        {pix.bank && ` · ${pix.bank}`}
      </p>
    </div>
  );
}
