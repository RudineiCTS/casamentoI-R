"use server";

import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase-admin";

export type RsvpResult = { ok: true } | { ok: false; error: string };

/** Grava a confirmação de presença na tabela public.rsvps. */
export async function submitRsvp(formData: FormData): Promise<RsvpResult> {
  const field = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max);
  const name = field("nome", 160);
  const phone = field("telefone", 40);
  const email = field("email", 160) || null;
  const message = field("obs", 2000) || null;

  if (!name || !phone) return { ok: false, error: "Preencha nome e telefone." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "E-mail inválido." };

  if (!supabaseConfigured()) {
    console.warn("[rsvp] Supabase não configurado; confirmação não foi salva:", name);
    return { ok: true };
  }

  const { error } = await supabaseAdmin().from("rsvps").insert({ name, phone, email, message });
  if (error) {
    console.error("[rsvp]", error.message);
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes." };
  }
  return { ok: true };
}
