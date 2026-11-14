/** Dados fixos usados pela lista de presentes. Ajuste aqui. */
export const siteConfig = {
  couple: "Isa & Rudinei",
  pix: {
    /** Chave PIX exibida aos convidados (e-mail, CPF, telefone ou aleatória). */
    key: process.env.NEXT_PUBLIC_PIX_KEY ?? "presentes@isaerudinei.com.br",
    holder: "Isabella & Rudinei",
    bank: "",
  },
};
