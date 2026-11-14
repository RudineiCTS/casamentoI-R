import { LanguageProvider } from "@/lib/language";
import { listGifts } from "@/lib/gifts/store";
import { paymentsEnabled } from "@/lib/gifts/payments";
import { siteConfig } from "@/lib/site-config";
import GiftCatalog from "@/components/gifts/GiftCatalog";

export const metadata = {
  title: "Lista de Presentes · Isa & Rudinei",
};

// Sempre lê a lista atualizada pelo Painel dos Noivos.
export const dynamic = "force-dynamic";

export default async function PresentesPage() {
  const gifts = await listGifts({ onlyVisible: true });
  return (
    <LanguageProvider>
      <GiftCatalog gifts={gifts} pix={siteConfig.pix} onlinePayment={paymentsEnabled()} />
    </LanguageProvider>
  );
}
