import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Gift, GiftInput } from "./types";
import { GIFT_BUCKET, supabaseAdmin, supabaseConfigured } from "@/lib/supabase-admin";

/**
 * Armazenamento da lista de presentes.
 *
 * - Com NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY no .env.local: usa o Supabase
 *   (tabela public.gifts e bucket "presentes"). É o modo de produção.
 * - Sem essas variáveis: usa o arquivo data/gifts.json (modo antigo, útil só localmente).
 *
 * As páginas e ações só usam as funções exportadas aqui.
 */

/* =========================== Supabase =========================== */

type GiftRow = {
  id: string;
  title: string;
  description: string;
  kind: Gift["kind"];
  category: string;
  price_cents: number;
  quota_total: number | null;
  quota_given: number;
  image_url: string | null;
  store_url: string | null;
  status: Gift["status"];
  visible: boolean;
  sort_order: number;
  stripe_price_id: string | null;
  created_at: string;
  updated_at: string;
};

export function rowToGift(r: GiftRow): Gift {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    kind: r.kind,
    category: r.category,
    priceCents: r.price_cents,
    quotas: r.quota_total ? { total: r.quota_total, given: r.quota_given } : null,
    imageUrl: r.image_url,
    storeUrl: r.store_url,
    status: r.status,
    visible: r.visible,
    order: r.sort_order,
    stripePriceId: r.stripe_price_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function giftToRow(g: Partial<GiftInput>): Partial<GiftRow> {
  const r: Partial<GiftRow> = {};
  if (g.title !== undefined) r.title = g.title;
  if (g.description !== undefined) r.description = g.description;
  if (g.kind !== undefined) r.kind = g.kind;
  if (g.category !== undefined) r.category = g.category;
  if (g.priceCents !== undefined) r.price_cents = g.priceCents;
  if (g.quotas !== undefined) {
    r.quota_total = g.quotas?.total ?? null;
    r.quota_given = g.quotas?.given ?? 0;
  }
  if (g.imageUrl !== undefined) r.image_url = g.imageUrl;
  if (g.storeUrl !== undefined) r.store_url = g.storeUrl;
  if (g.status !== undefined) r.status = g.status;
  if (g.visible !== undefined) r.visible = g.visible;
  if (g.order !== undefined) r.sort_order = g.order;
  if (g.stripePriceId !== undefined) r.stripe_price_id = g.stripePriceId;
  return r;
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(`Supabase: ${res.error.message}`);
  return res.data;
}

const sb = {
  async list(onlyVisible: boolean) {
    let q = supabaseAdmin().from("gifts").select("*").order("sort_order").order("created_at");
    if (onlyVisible) q = q.eq("visible", true);
    return (check(await q) as GiftRow[]).map(rowToGift);
  },
  async get(id: string) {
    const data = check(await supabaseAdmin().from("gifts").select("*").eq("id", id).maybeSingle());
    return data ? rowToGift(data as GiftRow) : null;
  },
  async create(input: GiftInput) {
    const data = check(await supabaseAdmin().from("gifts").insert(giftToRow(input)).select().single());
    return rowToGift(data as GiftRow);
  },
  async update(id: string, patch: Partial<GiftInput>) {
    const row = { ...giftToRow(patch), updated_at: new Date().toISOString() };
    const data = check(await supabaseAdmin().from("gifts").update(row).eq("id", id).select().maybeSingle());
    return data ? rowToGift(data as GiftRow) : null;
  },
  async remove(id: string) {
    const data = check(await supabaseAdmin().from("gifts").delete().eq("id", id).select().maybeSingle());
    return data ? rowToGift(data as GiftRow) : null;
  },
  async setOrder(ids: string[]) {
    const db = supabaseAdmin();
    await Promise.all(ids.map(async (id, i) => check(await db.from("gifts").update({ sort_order: i + 1 }).eq("id", id))));
  },
  async nextOrder() {
    const data = check(await supabaseAdmin().from("gifts").select("sort_order").order("sort_order", { ascending: false }).limit(1));
    return ((data as { sort_order: number }[])[0]?.sort_order ?? 0) + 1;
  },
};

/* ======================== Arquivo JSON (local) ======================== */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "gifts.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

async function readAll(): Promise<Gift[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Gift[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

async function writeAll(gifts: Gift[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(gifts, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

const byOrder = (a: Gift, b: Gift) => a.order - b.order || a.createdAt.localeCompare(b.createdAt);

const json = {
  async list(onlyVisible: boolean) {
    const all = (await readAll()).sort(byOrder);
    return onlyVisible ? all.filter((g) => g.visible) : all;
  },
  async get(id: string) {
    return (await readAll()).find((g) => g.id === id) ?? null;
  },
  async create(input: GiftInput) {
    const all = await readAll();
    const now = new Date().toISOString();
    const gift: Gift = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    all.push(gift);
    await writeAll(all);
    return gift;
  },
  async update(id: string, patch: Partial<GiftInput>) {
    const all = await readAll();
    const i = all.findIndex((g) => g.id === id);
    if (i === -1) return null;
    all[i] = { ...all[i], ...patch, updatedAt: new Date().toISOString() };
    await writeAll(all);
    return all[i];
  },
  async remove(id: string) {
    const all = await readAll();
    const gift = all.find((g) => g.id === id);
    await writeAll(all.filter((g) => g.id !== id));
    return gift ?? null;
  },
  async setOrder(ids: string[]) {
    const all = await readAll();
    const pos = new Map(ids.map((id, i) => [id, i + 1]));
    for (const g of all) g.order = pos.get(g.id) ?? g.order;
    await writeAll(all);
  },
  async nextOrder() {
    return (await readAll()).reduce((m, g) => Math.max(m, g.order), 0) + 1;
  },
};

const backend = () => (supabaseConfigured() ? sb : json);

/* =========================== API pública =========================== */

export const listGifts = (opts: { onlyVisible?: boolean } = {}) => backend().list(Boolean(opts.onlyVisible));
export const getGift = (id: string) => backend().get(id);
export const createGift = (input: GiftInput) => backend().create(input);
export const updateGift = (id: string, patch: Partial<GiftInput>) => backend().update(id, patch);
export const deleteGift = (id: string) => backend().remove(id);
/** Regrava a ordem de exibição conforme a lista de ids. */
export const setOrder = (ids: string[]) => backend().setOrder(ids);
export const nextOrder = () => backend().nextOrder();

/* ======================== Fotos dos presentes ======================== */

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export async function saveUpload(file: File): Promise<string> {
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Formato de imagem não suportado (use JPG, PNG, WEBP ou AVIF).");
  if (file.size > 8 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 8 MB.");
  const name = `${crypto.randomUUID()}${ext}`;

  if (supabaseConfigured()) {
    const storage = supabaseAdmin().storage.from(GIFT_BUCKET);
    check(await storage.upload(name, file, { contentType: file.type, cacheControl: "31536000" }));
    return storage.getPublicUrl(name).data.publicUrl;
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function removeUpload(url: string | null) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${GIFT_BUCKET}/`;
  if (supabaseConfigured() && url.includes(marker)) {
    const name = decodeURIComponent(url.split(marker)[1]);
    await supabaseAdmin().storage.from(GIFT_BUCKET).remove([name]);
    return;
  }
  if (url.startsWith("/uploads/")) {
    await fs.rm(path.join(UPLOAD_DIR, path.basename(url)), { force: true });
  }
}
