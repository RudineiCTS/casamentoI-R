"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getGift } from "@/lib/gifts/store";
import { createCheckout, paymentsEnabled } from "@/lib/gifts/payments";
import { isAvailable } from "@/lib/gifts/types";

async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Botão "Pagar com cartão ou Pix" da janela do presente. */
export async function startCheckoutAction(giftId: string, quantity: number) {
  if (!paymentsEnabled()) return { error: "Pagamento online ainda não disponível." };
  const gift = await getGift(giftId);
  if (!gift || !gift.visible || !isAvailable(gift)) return { error: "Este presente não está mais disponível." };
  const max = gift.quotas ? gift.quotas.total - gift.quotas.given : 1;
  const qty = Math.min(Math.max(1, Math.floor(quantity)), max);

  let url: string;
  try {
    ({ url } = await createCheckout(gift, qty, await siteOrigin()));
  } catch (e) {
    console.error("[checkout]", e);
    return { error: "Não foi possível abrir o pagamento agora. Tente novamente em instantes." };
  }
  redirect(url);
}
