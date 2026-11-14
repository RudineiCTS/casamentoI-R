"use client";

import { useEffect, useRef, useState, ReactNode, ElementType } from "react";

export default function Reveal({
  as: Tag = "div",
  style,
  children,
}: {
  as?: ElementType;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(26px)",
        transition: "opacity .9s ease, transform .9s ease",
      }}
    >
      {children}
    </Tag>
  );
}
