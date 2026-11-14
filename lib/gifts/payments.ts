import type { Gift } from "./types";

/**
 * Ponto de entrada para pagamentos dos presentes.
 *
 * Hoje os convidados presenteiam via PIX (ou pelo link da loja).
 * Para ligar o Stripe depois:
 *   1. npm install stripe
 *   2. definir STRIPE_SECRET_KEY no .env.local
 *   3. implementar createCheckout() com stripe.checkout.sessions.create(...)
 *      usando gift.priceCents * quantity (ou gift.stripePriceId) e
 *      success_url/cancel_url apontando para /presentes
 *   4. criar app/api/stripe/webhook/route.ts que, no evento
 *      checkout.session.completed, chama registerContribution().
 */
export function paymentsEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createCheckout(_gift: Gift, _quantity: number): Promise<{ url: string }> {
  throw new Error("Pagamento online ainda não configurado.");
}
