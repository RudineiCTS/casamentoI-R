import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Acesso ao Painel dos Noivos por senha única (ADMIN_PASSWORD no .env.local).
 * O cookie guarda um HMAC derivado da senha: trocar a senha desloga todo mundo.
 */
const COOKIE = "painel_sessao";

function token(password: string) {
  return crypto.createHmac("sha256", password).update("painel-dos-noivos").digest("hex");
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const a = Buffer.from(token(input));
  const b = Buffer.from(token(pass));
  return crypto.timingSafeEqual(a, b);
}

export async function startSession() {
  const store = await cookies();
  store.set(COOKIE, token(process.env.ADMIN_PASSWORD!), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isLoggedIn() {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return value === token(pass);
}

/** Use no início de toda página/ação do painel. */
export async function requireAdmin() {
  if (!(await isLoggedIn())) redirect("/painel/login");
}
