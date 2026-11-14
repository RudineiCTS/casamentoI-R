"use server";

import { redirect } from "next/navigation";
import { checkPassword, endSession, startSession } from "@/lib/admin-auth";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return "Senha incorreta.";
  await startSession();
  redirect("/painel/presentes");
}

export async function logout() {
  await endSession();
  redirect("/painel/login");
}
