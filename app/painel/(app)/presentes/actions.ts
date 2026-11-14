"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createGift,
  deleteGift,
  getGift,
  listGifts,
  nextOrder,
  removeUpload,
  saveUpload,
  setOrder,
  updateGift,
} from "@/lib/gifts/store";
import { parseBRL, type GiftInput, type GiftKind } from "@/lib/gifts/types";

export type FormState = { error: string | null };

function refresh() {
  revalidatePath("/presentes");
  revalidatePath("/painel/presentes");
}

async function readForm(fd: FormData, current: GiftInput | null): Promise<GiftInput | string> {
  const title = String(fd.get("title") ?? "").trim();
  if (!title) return "Informe o nome do presente.";

  const kind = (String(fd.get("kind")) === "lua-de-mel" ? "lua-de-mel" : "tradicional") as GiftKind;
  const priceCents = parseBRL(String(fd.get("price") ?? ""));
  if (priceCents === null || priceCents <= 0) return "Informe um valor válido (ex.: 349,90).";

  let quotas: GiftInput["quotas"] = null;
  if (fd.get("useQuotas") === "on") {
    const total = Number(fd.get("quotaTotal"));
    const given = Number(fd.get("quotaGiven") || 0);
    if (!Number.isInteger(total) || total < 1) return "Informe o número de cotas.";
    if (!Number.isInteger(given) || given < 0 || given > total) return "Cotas recebidas deve estar entre 0 e o total.";
    quotas = { total, given };
  }

  let imageUrl = current?.imageUrl ?? null;
  const file = fd.get("image");
  if (fd.get("removeImage") === "on") {
    await removeUpload(imageUrl);
    imageUrl = null;
  }
  if (file instanceof File && file.size > 0) {
    try {
      const url = await saveUpload(file);
      await removeUpload(imageUrl);
      imageUrl = url;
    } catch (e) {
      return (e as Error).message;
    }
  } else {
    const imageLink = String(fd.get("imageUrl") ?? "").trim();
    if (imageLink && imageLink !== imageUrl) {
      if (!/^https?:\/\//.test(imageLink)) return "O link da imagem deve começar com http:// ou https://";
      await removeUpload(imageUrl);
      imageUrl = imageLink;
    }
  }

  const storeUrl = String(fd.get("storeUrl") ?? "").trim() || null;
  if (storeUrl && !/^https?:\/\//.test(storeUrl)) return "O link da loja deve começar com http:// ou https://";

  return {
    title,
    description: String(fd.get("description") ?? "").trim(),
    kind,
    category: String(fd.get("category") ?? "").trim() || (kind === "lua-de-mel" ? "Experiências" : "Outros"),
    priceCents,
    quotas,
    imageUrl,
    storeUrl,
    status: fd.get("received") === "on" ? "recebido" : "disponivel",
    visible: fd.get("visible") === "on",
    order: current?.order ?? (await nextOrder()),
    stripePriceId: current?.stripePriceId ?? null,
  };
}

export async function saveGiftAction(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const current = id ? await getGift(id) : null;
  if (id && !current) return { error: "Presente não encontrado." };
  const data = await readForm(fd, current);
  if (typeof data === "string") return { error: data };
  if (id) await updateGift(id, data);
  else await createGift(data);
  refresh();
  redirect("/painel/presentes");
}

export async function deleteGiftAction(id: string) {
  await requireAdmin();
  const gift = await deleteGift(id);
  await removeUpload(gift?.imageUrl ?? null);
  refresh();
  redirect("/painel/presentes");
}

export async function toggleReceivedAction(id: string) {
  await requireAdmin();
  const gift = await getGift(id);
  if (!gift) return;
  await updateGift(id, { status: gift.status === "recebido" ? "disponivel" : "recebido" });
  refresh();
}

export async function toggleVisibleAction(id: string) {
  await requireAdmin();
  const gift = await getGift(id);
  if (!gift) return;
  await updateGift(id, { visible: !gift.visible });
  refresh();
}

export async function addQuotaAction(id: string, delta: number) {
  await requireAdmin();
  const gift = await getGift(id);
  if (!gift?.quotas) return;
  const given = Math.min(gift.quotas.total, Math.max(0, gift.quotas.given + delta));
  await updateGift(id, { quotas: { ...gift.quotas, given } });
  refresh();
}

export async function moveGiftAction(id: string, dir: -1 | 1) {
  await requireAdmin();
  const ids = (await listGifts()).map((g) => g.id);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await setOrder(ids);
  refresh();
}
