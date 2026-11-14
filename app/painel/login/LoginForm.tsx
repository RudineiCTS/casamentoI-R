"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { btnPrimary, input } from "@/components/painel/ui";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} style={{ display: "grid", gap: 14 }}>
      <input name="password" type="password" placeholder="Senha" required autoFocus style={input} />
      {error && <p style={{ color: "#a33", fontSize: 13, margin: 0 }}>{error}</p>}
      <button type="submit" disabled={pending} style={btnPrimary}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
