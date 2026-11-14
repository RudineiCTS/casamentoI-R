"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/painel/presentes", label: "Lista de Presentes", ready: true },
  { href: "#", label: "Convidados & RSVP", ready: false },
  { href: "#", label: "Galeria de Fotos", ready: false },
  { href: "#", label: "Conteúdo do Site", ready: false },
];

export default function PainelNav() {
  const path = usePathname();
  return (
    <nav style={{ display: "grid", gap: 2 }}>
      {items.map((it) =>
        it.ready ? (
          <Link
            key={it.label}
            href={it.href}
            style={{
              padding: "10px 12px",
              borderRadius: 3,
              fontSize: 14,
              background: path.startsWith(it.href) ? "var(--sand)" : "transparent",
              color: path.startsWith(it.href) ? "var(--ink)" : "var(--muted-1)",
              fontWeight: path.startsWith(it.href) ? 500 : 400,
            }}
          >
            {it.label}
          </Link>
        ) : (
          <span key={it.label} style={{ padding: "10px 12px", fontSize: 14, color: "var(--muted-5)", display: "flex", justifyContent: "space-between" }}>
            {it.label}
            <small style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>em breve</small>
          </span>
        )
      )}
    </nav>
  );
}
