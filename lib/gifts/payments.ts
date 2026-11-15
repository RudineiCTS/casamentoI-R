import Stripe from "stripe";
import type { Gift } from "./types";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase-admin";

/**
 * Pagamentos dos presentes com Stripe Checkout (cartão e Pix).
 *
 * Fluxo:
 *  1. Convidado clica em "Pagar" → createCheckout() cria a sessão e o site redireciona.
 *  2. Stripe confirma o pagamento → /api/stripe/webhook chama registerPayment().
 *  3. registerPayment() grava a contribuição e atualiza as cotas/status no Supabase.
 *
 * Variáveis (.env.local): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL.
 * O pagamento online só aparece quando o Stripe E o Supabase estão configurados.
 */

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY não definida.");
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export function paymentsEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY) && supabaseConfigured();
}

export async function createCheckout(gift: Gift, quantity: number, origin: string): Promise<{ url: string }> {
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    locale: "pt-BR",
    // Filtra os métodos ativos no Dashboard do Stripe: só cartão e Pix.
    allowed_payment_method_types: ["card", "pix"],
    line_items: [
      {
        quantity,
        price_data: {
          currency: "brl",
          unit_amount: gift.priceCents,
          product_data: {
            name: gift.quotas ? `${gift.title} (cota)` : gift.title,
            description: gift.description || undefined,
            images: gift.imageUrl?.startsWith("http") ? [gift.imageUrl] : undefined,
          },
        },
      },
    ],
    custom_fields: [
      { key: "nome", label: { type: "custom", custom: "Seu nome (para os noivos saberem quem presenteou)" }, type: "text" },
      { key: "recado", label: { type: "custom", custom: "Recado para os noivos" }, type: "text", optional: true },
    ],
    metadata: { gift_id: gift.id, quantity: String(quantity) },
    payment_intent_data: { description: `Presente de casamento: ${gift.title}`, metadata: { gift_id: gift.id } },
    success_url: `${origin}/presentes/obrigado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/presentes`,
  });
  if (!session.url) throw new Error("O Stripe não retornou a URL de pagamento.");
  return { url: session.url };
}

/** Grava o pagamento no Supabase. Seguro contra webhooks repetidos. */
export async function registerPayment(session: Stripe.Checkout.Session) {
  const giftId = session.metadata?.gift_id;
  if (!giftId) return false;
  const field = (key: string) => session.custom_fields?.find((f) => f.key === key)?.text?.value ?? null;

  const { data, error } = await supabaseAdmin().rpc("register_gift_payment", {
    p_session_id: session.id,
    p_gift_id: giftId,
    p_quantity: Number(session.metadata?.quantity ?? 1),
    p_amount_cents: session.amount_total ?? 0,
    p_guest_name: field("nome") ?? session.customer_details?.name ?? null,
    p_guest_email: session.customer_details?.email ?? null,
    p_message: field("recado"),
    p_method: session.payment_method_types?.join(",") ?? null,
  });
  if (error) throw new Error(`Supabase: ${error.message}`);
  return Boolean(data);
}
