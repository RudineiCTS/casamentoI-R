import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase-admin";

export type Contribution = {
  id: string;
  gift_title: string;
  quantity: number;
  amount_cents: number;
  guest_name: string | null;
  guest_email: string | null;
  message: string | null;
  payment_method: string | null;
  created_at: string;
};

/** Pagamentos online confirmados pelo Stripe (mais recentes primeiro). */
export async function listContributions(limit = 100): Promise<Contribution[]> {
  if (!supabaseConfigured()) return [];
  const { data, error } = await supabaseAdmin()
    .from("gift_contributions")
    .select("id,gift_title,quantity,amount_cents,guest_name,guest_email,message,payment_method,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    // Tabela ainda não criada (002_pagamentos.sql não rodou): não derruba o painel.
    console.warn("[contribuições]", error.message);
    return [];
  }
  return data as Contribution[];
}
