"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Diagonal shine sweep — suggests glass wipe / fresh polish. */
export function WipeShine({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <motion.div
        className="absolute -inset-y-8 w-1/3 bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.28)_50%,rgba(255,255,255,0.08)_58%,transparent_100%)]"
        initial={{ x: "-40%" }}
        animate={{ x: "280%" }}
        transition={{
          duration: 3.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 4.5,
        }}
      />
    </div>
  );
}

const SPARKS = [
  { top: "18%", left: "12%", size: 6, delay: 0 },
  { top: "28%", left: "78%", size: 5, delay: 0.6 },
  { top: "62%", left: "18%", size: 4, delay: 1.1 },
  { top: "48%", left: "88%", size: 7, delay: 1.7 },
  { top: "74%", left: "62%", size: 5, delay: 2.2 },
  { top: "36%", left: "42%", size: 4, delay: 0.9 },
];

/** Soft sparkles — clean, crystal finish cue. */
export function CleanSparkles() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SPARKS.map((spark, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            top: spark.top,
            left: spark.left,
            width: spark.size,
            height: spark.size,
            boxShadow: "0 0 10px rgba(255,255,255,0.85)",
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 0.95, 0],
            scale: [0.4, 1.15, 0.5],
            y: [0, -10, -18],
          }}
          transition={{
            duration: 2.8,
            delay: spark.delay,
            repeat: Infinity,
            repeatDelay: 2.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
