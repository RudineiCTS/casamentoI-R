import { redirect } from "next/navigation";
import { adminConfigured, isLoggedIn } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Painel dos Noivos · Entrar" };

export default async function LoginPage() {
  if (await isLoggedIn()) redirect("/painel/presentes");

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--sand)" }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", border: "1px solid var(--line)", borderRadius: 4, padding: "44px 36px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 30, margin: 0 }}>
          I <span style={{ color: "var(--gold)", fontStyle: "italic" }}>&amp;</span> R
        </p>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold)", margin: "10px 0 28px" }}>
          Painel dos Noivos
        </p>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted-1)" }}>
            Defina <code>ADMIN_PASSWORD</code> no arquivo <code>.env.local</code> e reinicie o servidor para liberar o painel.
          </p>
        )}
      </div>
    </main>
  );
}
