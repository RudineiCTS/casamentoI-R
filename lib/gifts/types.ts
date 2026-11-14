/** Tipos da lista de presentes (compartilhados entre servidor, painel e site público). */

export type GiftKind = "tradicional" | "lua-de-mel";

export const GIFT_KINDS: { value: GiftKind; pt: string; en: string }[] = [
  { value: "tradicional", pt: "Tradicional", en: "Traditional" },
  { value: "lua-de-mel", pt: "Lua de Mel", en: "Honeymoon" },
];

export type GiftStatus = "disponivel" | "recebido";

export interface Gift {
  id: string;
  title: string;
  description: string;
  kind: GiftKind;
  /** Agrupamento livre exibido como filtro (ex.: "Cozinha & Mesa", "Experiências"). */
  category: string;
  /** Valor em centavos (R$ 199,90 = 19990). Para cotas, é o valor de UMA cota. */
  priceCents: number;
  /** Se definido, o presente é dividido em cotas. */
  quotas: { total: number; given: number } | null;
  imageUrl: string | null;
  /** Link opcional para comprar o item numa loja. */
  storeUrl: string | null;
  status: GiftStatus;
  /** Oculta o presente do site público sem apagar. */
  visible: boolean;
  order: number;
  /** Reservado para a integração com o Stripe (Price ID). */
  stripePriceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GiftInput = Omit<Gift, "id" | "createdAt" | "updatedAt">;

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Aceita "1.299,90", "1299.90", "1299" etc. Retorna centavos ou null. */
export function parseBRL(value: string): number | null {
  const clean = value.replace(/[^\d,.-]/g, "").trim();
  if (!clean) return null;
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function isAvailable(g: Gift) {
  if (g.status === "recebido") return false;
  if (g.quotas) return g.quotas.given < g.quotas.total;
  return true;
}
