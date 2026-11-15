import Link from "next/link";
import { paymentsEnabled, stripe } from "@/lib/gifts/payments";

export const metadata = { title: "Obrigado! · Isa & Rudinei" };
export const dynamic = "force-dynamic";

export default async function ObrigadoPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid = false;
  let pending = false;
  let name: string | null = null;
  let item: string | null = null;

  if (session_id && paymentsEnabled()) {
    try {
      const s = await stripe().checkout.sessions.retrieve(session_id, { expand: ["line_items"] });
      paid = s.payment_status === "paid";
      pending = s.status === "complete" && s.payment_status === "unpaid";
      name = s.custom_fields?.find((f) => f.key === "nome")?.text?.value ?? s.customer_details?.name ?? null;
      item = s.line_items?.data[0]?.description ?? null;
    } catch {
      /* sessão inválida: mostra a mensagem genérica */
    }
  }

  const first = name?.split(" ")[0];

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--cream)", textAlign: "center" }}>
      <div style={{ maxWidth: 540 }}>
        <span style={{ fontSize: 44, color: "var(--gold)" }}>♥</span>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300, fontSize: "clamp(40px,6vw,60px)", lineHeight: 1.05, margin: "14px 0 0" }}>
          {first ? `Obrigado, ${first}!` : "Muito obrigado!"}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--muted-1)", margin: "20px auto 0" }}>
          {pending
            ? "Recebemos seu pedido. Assim que o Pix for confirmado, seu presente aparece para nós. Obrigado pelo carinho!"
            : paid
              ? `Seu presente${item ? ` (${item})` : ""} foi confirmado. Ficamos muito felizes com o seu carinho!`
              : "Obrigado pelo carinho! Se o pagamento foi concluído, ele aparece para nós em instantes."}
        </p>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "var(--muted-2)", margin: "26px 0 36px" }}>Isa &amp; Rudinei</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/presentes" style={{ border: "1px solid var(--line)", padding: "15px 28px", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ver outros presentes</Link>
          <Link href="/" style={{ background: "var(--gold)", color: "#fff", padding: "15px 28px", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>Voltar ao início</Link>
        </div>
      </div>
    </main>
  );
}
