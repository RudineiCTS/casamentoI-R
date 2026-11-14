"use client";

import { useT } from "@/lib/language";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const PlaceholderPhoto = ({ caption }: { caption: string }) => (
  <div
    style={{
      aspectRatio: "4/3",
      backgroundImage: "repeating-linear-gradient(135deg,#ece1cd 0 2px,transparent 2px 16px)",
      backgroundColor: "#f3ead9",
      border: "1px solid var(--line)",
      display: "flex",
      alignItems: "flex-end",
      padding: 12,
    }}
  >
    <span style={{ fontFamily: "monospace", fontSize: 10.5, color: "var(--muted-3)" }}>[ {caption} ]</span>
  </div>
);

const Dot = () => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <span
      style={{
        width: 13,
        height: 13,
        background: "var(--gold)",
        borderRadius: "50%",
        border: "3px solid var(--cream)",
        boxShadow: "0 0 0 1px var(--gold-mid)",
      }}
    />
  </div>
);

type Step = {
  year: { pt: string; en: string };
  title: { pt: string; en: string };
  text: { pt: string; en: string };
  photoCaption: string;
  photoFirst: boolean;
};

const steps: Step[] = [
  {
    year: { pt: "2019", en: "2019" },
    title: { pt: "Como nos conhecemos", en: "How we met" },
    text: {
      pt: "No aniversário de um amigo em comum, uma conversa despretensiosa que se estendeu pela madrugada — e nenhum dos dois queria se despedir.",
      en: "A friend's birthday, an unplanned conversation that stretched into the early hours — and neither of us wanted to say goodbye.",
    },
    photoCaption: "foto: primeiro encontro",
    photoFirst: false,
  },
  {
    year: { pt: "2021", en: "2021" },
    title: { pt: "Momentos marcantes", en: "Memorable moments" },
    text: {
      pt: "Viagens, a primeira casa juntos e os pequenos rituais do dia a dia que transformaram duas vidas em uma só.",
      en: "Trips, the first home together, small everyday rituals that turned two lives into a shared one.",
    },
    photoCaption: "foto: viagens a dois",
    photoFirst: true,
  },
  {
    year: { pt: "Dezembro 2025", en: "December 2025" },
    title: { pt: "O pedido", en: "The proposal" },
    text: {
      pt: "No fim de tarde, à beira-mar, um anel e uma pergunta que só tinha uma resposta possível: sim, mil vezes sim.",
      en: "At sunset, by the sea, a ring and a question that only had one possible answer: yes, a thousand times yes.",
    },
    photoCaption: "foto / vídeo: o pedido",
    photoFirst: false,
  },
  {
    year: { pt: "2027", en: "2027" },
    title: { pt: "Preparando o grande dia", en: "Getting ready for the big day" },
    text: {
      pt: 'E agora, o capítulo mais esperado — dizer "sim" cercados por todos que amamos.',
      en: "And now, the most awaited chapter — to say 'I do' surrounded by everyone we love.",
    },
    photoCaption: "foto: ensaio pré-wedding",
    photoFirst: true,
  },
];

export default function OurStory() {
  const t = useT();

  return (
    <section id="historia" style={{ scrollMarginTop: 80, padding: "clamp(80px,12vh,150px) clamp(20px,5vw,64px)", background: "var(--cream)" }}>
      <SectionHeader label={t("Nossa História", "OUR STORY")} title={t("Como tudo começou", "How our journey began")} />

      <div style={{ maxWidth: 980, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--line)", transform: "translateX(-50%)" }} />

        {steps.map((step, i) => {
          const textBlock = (
            <div style={{ padding: step.photoFirst ? "0 0 0 34px" : "0 34px 0 0", textAlign: step.photoFirst ? "left" : "right" }}>
              <p style={{ fontSize: 12, letterSpacing: "0.25em", color: "var(--gold)", margin: "0 0 8px" }}>{t(step.year.pt, step.year.en)}</p>
              <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: 28, margin: "0 0 10px" }}>{t(step.title.pt, step.title.en)}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted-1)", margin: 0 }}>{t(step.text.pt, step.text.en)}</p>
            </div>
          );
          const photoBlock = (
            <div style={{ padding: step.photoFirst ? "0 34px 0 0" : "0 0 0 34px" }}>
              <PlaceholderPhoto caption={step.photoCaption} />
            </div>
          );

          return (
            <Reveal
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr",
                alignItems: "center",
                marginBottom: i < steps.length - 1 ? 56 : 0,
              }}
            >
              {step.photoFirst ? photoBlock : textBlock}
              <Dot />
              {step.photoFirst ? textBlock : photoBlock}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
