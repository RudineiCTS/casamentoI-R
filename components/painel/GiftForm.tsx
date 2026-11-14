"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Gift } from "@/lib/gifts/types";
import { deleteGiftAction, saveGiftAction, type FormState } from "@/app/painel/(app)/presentes/actions";
import { btnDanger, btnGhost, btnPrimary, card, input, label } from "./ui";
import GiftThumb from "@/components/gifts/GiftThumb";

export default function GiftForm({ gift, categories }: { gift: Gift | null; categories: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveGiftAction.bind(null, gift?.id ?? null), { error: null });
  const [kind, setKind] = useState(gift?.kind ?? "tradicional");
  const [useQuotas, setUseQuotas] = useState(gift ? Boolean(gift.quotas) : false);
  const [preview, setPreview] = useState<string | null>(gift?.imageUrl ?? null);

  const price = gift ? (gift.priceCents / 100).toFixed(2).replace(".", ",") : "";

  return (
    <form action={action} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 24, alignItems: "start" }} className="gift-form">
      <div style={{ ...card, padding: 28, display: "grid", gap: 20 }}>
        <label style={label}>
          Nome do presente *
          <input name="title" defaultValue={gift?.title} required style={input} placeholder="Ex.: Jogo de panelas" />
        </label>

        <label style={label}>
          Descrição
          <textarea name="description" defaultValue={gift?.description} rows={3} style={{ ...input, resize: "vertical" }} placeholder="Uma frase curta sobre o presente" />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label style={label}>
            Tipo
            <select
              name="kind"
              value={kind}
              onChange={(e) => {
                const v = e.target.value as Gift["kind"];
                setKind(v);
                if (v === "lua-de-mel" && !gift) setUseQuotas(true);
              }}
              style={input}
            >
              <option value="tradicional">Lista tradicional</option>
              <option value="lua-de-mel">Cota de lua de mel</option>
            </select>
          </label>
          <label style={label}>
            Categoria
            <input name="category" defaultValue={gift?.category} list="gift-categories" style={input} placeholder={kind === "lua-de-mel" ? "Ex.: Experiências" : "Ex.: Cozinha & Mesa"} />
            <datalist id="gift-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label style={label}>
            {useQuotas ? "Valor de cada cota (R$) *" : "Valor (R$) *"}
            <input name="price" defaultValue={price} required inputMode="decimal" style={input} placeholder="349,90" />
          </label>
          <label style={{ ...label, alignSelf: "end", display: "flex", alignItems: "center", gap: 10, textTransform: "none", letterSpacing: 0, fontSize: 14, paddingBottom: 12 }}>
            <input type="checkbox" name="useQuotas" checked={useQuotas} onChange={(e) => setUseQuotas(e.target.checked)} />
            Dividir em cotas
          </label>
        </div>

        {useQuotas && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label style={label}>
              Total de cotas *
              <input name="quotaTotal" type="number" min={1} defaultValue={gift?.quotas?.total ?? 5} style={input} />
            </label>
            <label style={label}>
              Cotas já recebidas
              <input name="quotaGiven" type="number" min={0} defaultValue={gift?.quotas?.given ?? 0} style={input} />
            </label>
          </div>
        )}

        <label style={label}>
          Link da loja (opcional)
          <input name="storeUrl" type="url" defaultValue={gift?.storeUrl ?? ""} style={input} placeholder="https://..." />
        </label>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 14 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" name="visible" defaultChecked={gift?.visible ?? true} /> Mostrar no site
          </label>
          {!useQuotas && (
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="received" defaultChecked={gift?.status === "recebido"} /> Já recebido
            </label>
          )}
        </div>

        {state.error && <p style={{ color: "#a33", fontSize: 14, margin: 0 }}>{state.error}</p>}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" disabled={pending} style={btnPrimary}>{pending ? "Salvando..." : gift ? "Salvar alterações" : "Adicionar presente"}</button>
          <Link href="/painel/presentes" style={btnGhost}>Cancelar</Link>
          {gift && (
            <button
              type="button"
              style={{ ...btnDanger, marginLeft: "auto" }}
              onClick={() => {
                if (window.confirm(`Excluir "${gift.title}"? Essa ação não pode ser desfeita.`)) void deleteGiftAction(gift.id);
              }}
            >
              Excluir
            </button>
          )}
        </div>
      </div>

      <div style={{ ...card, padding: 20, display: "grid", gap: 14 }}>
        <p style={{ ...label, display: "block" }}>Foto</p>
        <GiftThumb gift={{ imageUrl: preview, title: "Prévia", kind }} />
        <label style={{ ...btnGhost, justifyContent: "center" }}>
          Enviar foto
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/avif"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </label>
        <label style={label}>
          ou cole o link de uma imagem
          <input name="imageUrl" type="url" defaultValue={gift?.imageUrl?.startsWith("http") ? gift.imageUrl : ""} style={input} placeholder="https://..." onBlur={(e) => e.target.value && setPreview(e.target.value)} />
        </label>
        {gift?.imageUrl && (
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--muted-1)" }}>
            <input type="checkbox" name="removeImage" /> Remover foto atual
          </label>
        )}
        <p style={{ fontSize: 12, color: "var(--muted-2)", margin: 0, lineHeight: 1.5 }}>JPG, PNG ou WEBP até 8 MB. Fotos quadradas ou 4:3 ficam melhores.</p>
      </div>
    </form>
  );
}
