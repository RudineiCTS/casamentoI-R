import Link from "next/link";
import { listGifts } from "@/lib/gifts/store";
import GiftForm from "@/components/painel/GiftForm";

export const metadata = { title: "Novo presente · Painel dos Noivos" };

export default async function NovoPresente() {
  const categories = [...new Set((await listGifts()).map((g) => g.category))];
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Link href="/painel/presentes" style={{ fontSize: 13, color: "var(--muted-2)" }}>← Lista de presentes</Link>
      <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 38, margin: "10px 0 24px" }}>Novo presente</h1>
      <GiftForm gift={null} categories={categories} />
    </div>
  );
}
