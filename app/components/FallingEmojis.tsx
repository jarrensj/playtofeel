"use client";

import { useEffect, useMemo, useState } from "react";

type FallingEmojisProps = {
  show: boolean;
  count?: number;
  emojis?: string[];
};

type Particle = {
  id: string;
  leftPercent: number; // 0-100
  sizePx: number; // font-size
  fallDuration: number; // seconds
  fallDelay: number; // seconds
  swayDuration: number; // seconds
  swayDelay: number; // seconds
  rotateDeg: number; // end rotation
  emoji: string;
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FallingEmojis({
  show,
  count = 28,
  emojis = ["🤗", "🫂"],
}: FallingEmojisProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useMemo(() => {
    return () => {
      const list: Particle[] = [];
      for (let i = 0; i < count; i += 1) {
        const leftPercent = randomBetween(2, 98);
        const sizePx = randomBetween(18, 38);
        const fallDuration = randomBetween(9, 15);
        const fallDelay = randomBetween(0, 2.5);
        const swayDuration = randomBetween(2.5, 4.5);
        const swayDelay = randomBetween(0, 2);
        const rotateDeg = randomBetween(-60, 60);
        const emoji = emojis[Math.floor(Math.random() * emojis.length)] ?? "🤗";
        list.push({
          id: `${Date.now()}-${i}-${Math.round(Math.random() * 1e6)}`,
          leftPercent,
          sizePx,
          fallDuration,
          fallDelay,
          swayDuration,
          swayDelay,
          rotateDeg,
          emoji,
        });
      }
      return list;
    };
  }, [count, emojis]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }
    const next = generateParticles();
    setParticles(next);

    // Cleanup particles when hidden
    return () => {
      setParticles([]);
    };
  }, [show, generateParticles]);

  if (!show) return null;

  return (
    <div className="emoji-overlay" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="emoji-wrapper"
          style={{
            left: `${p.leftPercent}%`,
            animationDuration: `${p.swayDuration}s`,
            animationDelay: `${p.swayDelay}s`,
          }}
        >
          <span
            className="emoji"
            style={{
              fontSize: `${p.sizePx}px`,
              animationDuration: `${p.fallDuration}s`,
              animationDelay: `${p.fallDelay}s`,
              // CSS var for end rotation
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore - CSS var not in type
              "--emoji-rotate": `${p.rotateDeg}deg`,
            }}
          >
            {p.emoji}
          </span>
        </span>
      ))}
    </div>
  );
}
