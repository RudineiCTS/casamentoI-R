import type Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { registerPayment, stripe } from "@/lib/gifts/payments";

/**
 * Webhook do Stripe. Eventos usados:
 *  - checkout.session.completed            (cartão: já vem pago)
 *  - checkout.session.async_payment_succeeded (Pix: pago depois de concluir o checkout)
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Webhook não configurado", { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe().webhooks.constructEventAsync(await req.text(), signature, secret);
  } catch (e) {
    console.error("[stripe-webhook] assinatura inválida:", (e as Error).message);
    return new Response("Assinatura inválida", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        const created = await registerPayment(session);
        console.log(`[stripe-webhook] ${event.type} ${session.id} → ${created ? "registrado" : "já registrado"}`);
        revalidatePath("/presentes");
        revalidatePath("/painel/presentes");
      } catch (e) {
        console.error("[stripe-webhook]", e);
        // 500 faz o Stripe tentar de novo mais tarde.
        return new Response("Erro ao registrar", { status: 500 });
      }
    }
  }

  return Response.json({ received: true });
}
