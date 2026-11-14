"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { Gift } from "@/lib/gifts/types";
import {
  addQuotaAction,
  moveGiftAction,
  toggleReceivedAction,
  toggleVisibleAction,
} from "@/app/painel/(app)/presentes/actions";

const iconBtn: React.CSSProperties = {
  border: "1px solid var(--line)",
  background: "#fff",
  borderRadius: 3,
  padding: "6px 10px",
  fontSize: 12.5,
  cursor: "pointer",
  color: "var(--muted-1)",
  whiteSpace: "nowrap",
};

export default function GiftRowActions({ gift, first, last, canMove }: { gift: Gift; first: boolean; last: boolean; canMove: boolean }) {
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<unknown>) => start(async () => void (await fn()));

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end", opacity: pending ? 0.5 : 1 }}>
      {gift.quotas ? (
        <>
          <button style={iconBtn} title="Remover uma cota recebida" onClick={() => run(() => addQuotaAction(gift.id, -1))}>−1 cota</button>
          <button style={iconBtn} title="Registrar uma cota recebida" onClick={() => run(() => addQuotaAction(gift.id, 1))}>+1 cota</button>
        </>
      ) : (
        <button style={iconBtn} onClick={() => run(() => toggleReceivedAction(gift.id))}>
          {gift.status === "recebido" ? "Desmarcar recebido" : "Marcar recebido"}
        </button>
      )}
      <button style={iconBtn} onClick={() => run(() => toggleVisibleAction(gift.id))}>{gift.visible ? "Ocultar" : "Mostrar"}</button>
      {canMove && (
        <>
          <button style={iconBtn} disabled={first} title="Subir" onClick={() => run(() => moveGiftAction(gift.id, -1))}>↑</button>
          <button style={iconBtn} disabled={last} title="Descer" onClick={() => run(() => moveGiftAction(gift.id, 1))}>↓</button>
        </>
      )}
      <Link href={`/painel/presentes/${gift.id}`} style={{ ...iconBtn, color: "var(--gold-dark)" }}>Editar</Link>
    </div>
  );
}
