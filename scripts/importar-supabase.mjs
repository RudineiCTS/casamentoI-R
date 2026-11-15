/**
 * Importa data/gifts.json (e as fotos de data/uploads) para o Supabase.
 *
 *   npm run importar:supabase
 *
 * Pré-requisitos: ter rodado supabase/schema.sql no SQL Editor e ter no .env.local
 * NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY.
 * Pode rodar mais de uma vez: presentes com o mesmo id são atualizados, não duplicados.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY no .env.local.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "presentes";
const TYPES = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

const gifts = JSON.parse(await readFile(path.join("data", "gifts.json"), "utf8"));
console.log(`Encontrados ${gifts.length} presentes em data/gifts.json`);

let fotos = 0;
const rows = [];
for (const g of gifts) {
  let image = g.imageUrl ?? null;
  if (image?.startsWith("/uploads/")) {
    const name = path.basename(image);
    const file = await readFile(path.join("data", "uploads", name));
    const { error } = await db.storage
      .from(BUCKET)
      .upload(name, file, { contentType: TYPES[path.extname(name).toLowerCase()], upsert: true });
    if (error) throw new Error(`Falha ao enviar a foto ${name}: ${error.message}`);
    image = db.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
    fotos++;
  }
  rows.push({
    id: g.id,
    title: g.title,
    description: g.description ?? "",
    kind: g.kind,
    category: g.category,
    price_cents: g.priceCents,
    quota_total: g.quotas?.total ?? null,
    quota_given: g.quotas?.given ?? 0,
    image_url: image,
    store_url: g.storeUrl ?? null,
    status: g.status,
    visible: g.visible,
    sort_order: g.order,
    stripe_price_id: g.stripePriceId ?? null,
    created_at: g.createdAt,
    updated_at: g.updatedAt,
  });
}

const { error } = await db.from("gifts").upsert(rows, { onConflict: "id" });
if (error) {
  console.error("Erro ao gravar os presentes:", error.message);
  process.exit(1);
}

const { count } = await db.from("gifts").select("*", { count: "exact", head: true });
console.log(`Pronto: ${rows.length} presentes importados (${fotos} fotos enviadas). Total no banco: ${count}.`);
