"use client";

import { motion, useReducedMotion } from "framer-motion";

type Bubble = {
  left: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
};

/** Deterministic “random” bubbles — hydration-safe, soap/clean cue. */
const BUBBLES: Bubble[] = [
  { left: "4%", size: 8, delay: 0, duration: 14, drift: 18, opacity: 0.28 },
  { left: "11%", size: 14, delay: 1.4, duration: 18, drift: -22, opacity: 0.22 },
  { left: "18%", size: 6, delay: 3.2, duration: 12, drift: 12, opacity: 0.32 },
  { left: "25%", size: 20, delay: 0.8, duration: 22, drift: -16, opacity: 0.18 },
  { left: "33%", size: 10, delay: 5.1, duration: 15, drift: 24, opacity: 0.26 },
  { left: "41%", size: 16, delay: 2.3, duration: 19, drift: -10, opacity: 0.2 },
  { left: "48%", size: 7, delay: 6.4, duration: 13, drift: 14, opacity: 0.3 },
  { left: "55%", size: 22, delay: 1.1, duration: 24, drift: -28, opacity: 0.16 },
  { left: "62%", size: 9, delay: 4.0, duration: 16, drift: 20, opacity: 0.25 },
  { left: "69%", size: 12, delay: 7.2, duration: 17, drift: -14, opacity: 0.24 },
  { left: "76%", size: 5, delay: 2.8, duration: 11, drift: 8, opacity: 0.34 },
  { left: "83%", size: 18, delay: 5.6, duration: 21, drift: -20, opacity: 0.19 },
  { left: "90%", size: 11, delay: 0.5, duration: 15, drift: 16, opacity: 0.27 },
  { left: "8%", size: 15, delay: 8.1, duration: 20, drift: -12, opacity: 0.21 },
  { left: "29%", size: 8, delay: 9.3, duration: 14, drift: 19, opacity: 0.29 },
  { left: "52%", size: 13, delay: 3.7, duration: 18, drift: -18, opacity: 0.23 },
  { left: "71%", size: 6, delay: 10.2, duration: 12, drift: 11, opacity: 0.31 },
  { left: "94%", size: 17, delay: 6.8, duration: 23, drift: -15, opacity: 0.17 },
  { left: "15%", size: 9, delay: 11.5, duration: 16, drift: 13, opacity: 0.26 },
  { left: "58%", size: 24, delay: 4.5, duration: 26, drift: -24, opacity: 0.14 },
  { left: "37%", size: 5, delay: 7.9, duration: 10, drift: 9, opacity: 0.33 },
  { left: "86%", size: 10, delay: 9.8, duration: 15, drift: -11, opacity: 0.25 },
];

/** Soft floating bubbles across the public site. */
export function CleanBubbles() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden"
      aria-hidden
    >
      {BUBBLES.map((bubble, index) => (
        <motion.span
          key={index}
          className="absolute bottom-[-10%] rounded-full border border-[rgba(87,192,255,0.35)] bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.75),rgba(87,192,255,0.18)_45%,rgba(16,156,246,0.08)_100%)] shadow-[inset_-2px_-2px_6px_rgba(1,87,189,0.08)]"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
          }}
          initial={{
            y: 0,
            x: 0,
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            y: [0, -1100 - bubble.size * 8],
            x: [0, bubble.drift, bubble.drift * -0.4, bubble.drift * 0.6],
            opacity: [0, bubble.opacity, bubble.opacity, 0],
            scale: [0.7, 1, 1.05, 0.9],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.12, 0.82, 1],
          }}
        />
      ))}
    </div>
  );
}
