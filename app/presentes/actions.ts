"use server";

import { redirect } from "next/navigation";
import { getGift } from "@/lib/gifts/store";
import { createCheckout, paymentsEnabled } from "@/lib/gifts/payments";
import { isAvailable } from "@/lib/gifts/types";

/** Chamado pelo botão "Pagar com cartão" quando o Stripe estiver configurado. */
export async function startCheckoutAction(giftId: string, quantity: number) {
  if (!paymentsEnabled()) return { error: "Pagamento online ainda não disponível." };
  const gift = await getGift(giftId);
  if (!gift || !gift.visible || !isAvailable(gift)) return { error: "Este presente não está mais disponível." };
  const max = gift.quotas ? gift.quotas.total - gift.quotas.given : 1;
  const qty = Math.min(Math.max(1, Math.floor(quantity)), max);
  const { url } = await createCheckout(gift, qty);
  redirect(url);
}
