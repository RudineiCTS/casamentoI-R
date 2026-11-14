"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "pt" | "en";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

/** Mirrors the prototype's data-pt/data-en pairing: pass the PT copy then the EN copy. */
export function useT() {
  const { lang } = useLanguage();
  return (pt: string, en: string) => (lang === "en" ? en : pt);
}
