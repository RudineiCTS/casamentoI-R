import type { CSSProperties } from "react";

/** Estilos compartilhados do Painel dos Noivos. */
export const input: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid var(--line)",
  borderRadius: 3,
  background: "#fff",
  fontSize: 14.5,
  color: "var(--ink)",
  outline: "none",
};

export const label: CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 11.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--muted-1)",
};

const btnBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 11.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  padding: "12px 22px",
  borderRadius: 2,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export const btnPrimary: CSSProperties = { ...btnBase, background: "var(--gold)", color: "#fff", border: "1px solid var(--gold)" };
export const btnGhost: CSSProperties = { ...btnBase, background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" };
export const btnDanger: CSSProperties = { ...btnBase, background: "transparent", color: "#a33", border: "1px solid #e3c4c4" };

export const card: CSSProperties = { background: "#fff", border: "1px solid var(--line)", borderRadius: 4 };
