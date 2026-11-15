import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente do Supabase com a chave SECRETA. Use somente no servidor
 * (Server Components, Server Actions e Route Handlers), nunca em "use client".
 * A secret key ignora o RLS, por isso ela não pode ir para o navegador.
 */
let client: SupabaseClient | null = null;

export function supabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

export function supabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") throw new Error("supabaseAdmin() só pode ser usado no servidor.");
  if (!supabaseConfigured()) {
    throw new Error("Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY no .env.local.");
  }
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const GIFT_BUCKET = "presentes";
