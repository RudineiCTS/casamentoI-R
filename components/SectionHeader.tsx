import Reveal from "./Reveal";

export default function SectionHeader({
  label,
  title,
  description,
  ornament = !description,
  maxWidth = 720,
  marginBottom = "clamp(50px,7vh,86px)",
}: {
  label: string;
  title: string;
  description?: string;
  ornament?: boolean;
  maxWidth?: number;
  marginBottom?: string;
}) {
  return (
    <div style={{ textAlign: "center", maxWidth, margin: `0 auto ${marginBottom}` }}>
      <Reveal as="p" style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 18px" }}>
        {label}
      </Reveal>
      <Reveal
        as="h2"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontWeight: 300,
          fontSize: "clamp(38px,5.5vw,64px)",
          lineHeight: 1.05,
          margin: 0,
        }}
      >
        {title}
      </Reveal>
      {description && (
        <Reveal as="p" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted-2)", margin: "18px auto 0", maxWidth: 520 }}>
          {description}
        </Reveal>
      )}
      {ornament && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 26 }}>
          <span style={{ width: 46, height: 1, background: "var(--gold-mid)" }} />
          <span style={{ width: 7, height: 7, background: "var(--gold)", transform: "rotate(45deg)" }} />
          <span style={{ width: 46, height: 1, background: "var(--gold-mid)" }} />
        </div>
      )}
    </div>
  );
}
