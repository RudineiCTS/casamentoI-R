import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Gift, GiftInput } from "./types";

/**
 * Armazenamento simples em arquivo JSON (data/gifts.json).
 * Todas as leituras/escritas passam por aqui; para trocar por um banco
 * (Supabase, Postgres...) basta reimplementar estas funções.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "gifts.json");

async function readAll(): Promise<Gift[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Gift[];
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

export async function listGifts(opts: { onlyVisible?: boolean } = {}) {
  const all = (await readAll()).sort(byOrder);
  return opts.onlyVisible ? all.filter((g) => g.visible) : all;
}

export async function getGift(id: string) {
  return (await readAll()).find((g) => g.id === id) ?? null;
}

export async function createGift(input: GiftInput) {
  const all = await readAll();
  const now = new Date().toISOString();
  const gift: Gift = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  all.push(gift);
  await writeAll(all);
  return gift;
}

export async function updateGift(id: string, patch: Partial<GiftInput>) {
  const all = await readAll();
  const i = all.findIndex((g) => g.id === id);
  if (i === -1) return null;
  all[i] = { ...all[i], ...patch, updatedAt: new Date().toISOString() };
  await writeAll(all);
  return all[i];
}

export async function deleteGift(id: string) {
  const all = await readAll();
  const gift = all.find((g) => g.id === id);
  await writeAll(all.filter((g) => g.id !== id));
  return gift ?? null;
}

/** Regrava a ordem de exibição conforme a lista de ids. */
export async function setOrder(ids: string[]) {
  const all = await readAll();
  const pos = new Map(ids.map((id, i) => [id, i + 1]));
  for (const g of all) g.order = pos.get(g.id) ?? g.order;
  await writeAll(all);
}

export async function nextOrder() {
  const all = await readAll();
  return all.reduce((m, g) => Math.max(m, g.order), 0) + 1;
}

/* ---------- Fotos enviadas pelo painel (data/uploads, servidas em /uploads/<arquivo>) ---------- */

export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
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
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${crypto.randomUUID()}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function removeUpload(url: string | null) {
  if (!url?.startsWith("/uploads/")) return;
  const name = path.basename(url);
  await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
}
