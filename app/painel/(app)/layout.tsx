import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "../actions";
import PainelNav from "@/components/painel/PainelNav";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="painel" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "240px 1fr", background: "var(--cream)" }}>
      <aside className="painel-aside" style={{ background: "#fff", borderRight: "1px solid var(--line)", padding: "28px 18px", display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ padding: "0 10px" }}>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, margin: 0 }}>
            I <span style={{ color: "var(--gold)", fontStyle: "italic" }}>&amp;</span> R
          </p>
          <p style={{ fontSize: 10.5, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", margin: "6px 0 0" }}>Painel dos Noivos</p>
        </div>
        <PainelNav />
        <div style={{ marginTop: "auto", display: "grid", gap: 6, padding: "0 10px", fontSize: 13 }}>
          <Link href="/" target="_blank" style={{ color: "var(--muted-1)" }}>↗ Ver site público</Link>
          <form action={logout}>
            <button type="submit" style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "var(--muted-2)", fontSize: 13 }}>Sair</button>
          </form>
        </div>
      </aside>
      <main style={{ padding: "clamp(24px,4vw,48px)", minWidth: 0 }}>{children}</main>
    </div>
  );
}
