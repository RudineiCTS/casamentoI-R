import type { Gift } from "@/lib/gifts/types";

/** Foto do presente ou um placeholder elegante quando não houver imagem. */
export default function GiftThumb({ gift, size, ratio }: { gift: Pick<Gift, "imageUrl" | "title" | "kind">; size?: number; ratio?: string }) {
  const style: React.CSSProperties = size
    ? { width: size, height: size, borderRadius: 3 }
    : { width: "100%", aspectRatio: ratio ?? "4 / 3" };

  if (gift.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={gift.imageUrl} alt={gift.title} style={{ ...style, objectFit: "cover", background: "var(--sand)" }} />;
  }
  return (
    <div
      aria-hidden
      style={{
        ...style,
        display: "grid",
        placeItems: "center",
        background:
          "repeating-linear-gradient(135deg,rgba(181,152,79,0.08) 0 2px,transparent 2px 14px),linear-gradient(160deg,#f6efe2,#ece0c9)",
        color: "var(--gold)",
        fontFamily: "var(--font-cormorant), serif",
        fontSize: size ? size * 0.4 : 44,
        fontStyle: "italic",
      }}
    >
      {gift.kind === "lua-de-mel" ? "✈" : "♡"}
    </div>
  );
}
