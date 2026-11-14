import Link from "next/link";
import { listGifts } from "@/lib/gifts/store";
import { formatBRL, isAvailable } from "@/lib/gifts/types";
import { btnPrimary, card } from "@/components/painel/ui";
import GiftRowActions from "@/components/painel/GiftRowActions";
import GiftThumb from "@/components/gifts/GiftThumb";

export const metadata = { title: "Lista de Presentes · Painel dos Noivos" };

export default async function PresentesAdmin({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = await searchParams;
  const all = await listGifts();
  const gifts = tipo ? all.filter((g) => g.kind === tipo) : all;

  const received = all.filter((g) => !isAvailable(g)).length;
  const quotaValue = all.reduce((s, g) => s + (g.quotas ? g.quotas.given * g.priceCents : g.status === "recebido" ? g.priceCents : 0), 0);

  const stats = [
    { label: "Presentes cadastrados", value: String(all.length) },
    { label: "Visíveis no site", value: String(all.filter((g) => g.visible).length) },
    { label: "Recebidos / esgotados", value: String(received) },
    { label: "Valor recebido (estimado)", value: formatBRL(quotaValue) },
  ];

  const tabs = [
    { href: "/painel/presentes", label: "Todos", active: !tipo },
    { href: "/painel/presentes?tipo=tradicional", label: "Tradicional", active: tipo === "tradicional" },
    { href: "/painel/presentes?tipo=lua-de-mel", label: "Lua de Mel", active: tipo === "lua-de-mel" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 8px" }}>Gestão</p>
          <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 40, margin: 0 }}>Lista de Presentes</h1>
        </div>
        <Link href="/painel/presentes/novo" style={btnPrimary}>+ Adicionar presente</Link>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, padding: "18px 20px" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-2)", margin: 0 }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 32, margin: "6px 0 0" }}>{s.value}</p>
          </div>
        ))}
      </section>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 13,
              border: "1px solid " + (t.active ? "var(--gold)" : "var(--line)"),
              background: t.active ? "var(--gold)" : "#fff",
              color: t.active ? "#fff" : "var(--muted-1)",
            }}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        {gifts.length === 0 && (
          <p style={{ padding: 40, textAlign: "center", color: "var(--muted-2)" }}>
            Nenhum presente ainda. <Link href="/painel/presentes/novo" style={{ color: "var(--gold)" }}>Adicionar o primeiro</Link>
          </p>
        )}
        {gifts.map((g, i) => (
          <div
            key={g.id}
            className="gift-row"
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr auto",
              gap: 16,
              alignItems: "center",
              padding: "14px 18px",
              borderTop: i ? "1px solid var(--line)" : 0,
              opacity: g.visible ? 1 : 0.55,
            }}
          >
            <GiftThumb gift={g} size={64} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Link href={`/painel/presentes/${g.id}`} style={{ fontSize: 16, fontWeight: 500 }}>{g.title}</Link>
                <Badge tone={g.kind === "lua-de-mel" ? "blue" : "sand"}>{g.kind === "lua-de-mel" ? "Lua de Mel" : "Tradicional"}</Badge>
                {!isAvailable(g) && <Badge tone="green">{g.quotas ? "Cotas completas" : "Recebido"}</Badge>}
                {!g.visible && <Badge tone="gray">Oculto</Badge>}
              </div>
              <p style={{ fontSize: 13, color: "var(--muted-2)", margin: "4px 0 0" }}>
                {g.category} · {formatBRL(g.priceCents)}
                {g.quotas && ` por cota · ${g.quotas.given}/${g.quotas.total} cotas`}
              </p>
            </div>
            <GiftRowActions gift={g} first={i === 0} last={i === gifts.length - 1} canMove={!tipo} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "sand" | "blue" | "green" | "gray" }) {
  const colors = {
    sand: ["#f3eada", "#7a6440"],
    blue: ["#e6eef3", "#41617a"],
    green: ["#e5f0e3", "#3f6a3a"],
    gray: ["#eee", "#777"],
  }[tone];
  return (
    <span style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: colors[0], color: colors[1] }}>
      {children}
    </span>
  );
}
