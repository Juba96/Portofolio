"use client";

import { motion, useScroll, useTransform } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Hero3D } from "./hero-3d";
import { ClientOnly } from "./client-only";
import { Magnetic } from "./magnetic";

export function Hero() {
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const stats = [
    { value: 7, suffix: "+", label: "Years Experience" },
    { value: 4, suffix: "+", label: "Markets Launched" },
    { value: 4, suffix: "", label: "Products Shipped" },
  ];

  return (
    <section
      id="top"
      className="relative min-h-dvh flex items-center overflow-hidden pt-20"
    >
      {/* 3D Scene */}
      <ClientOnly>
        <Hero3D />
      </ClientOnly>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20 z-[1]" />

      <motion.div
        style={{ y: contentY, opacity }}
        className="container-page relative z-10 w-full"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass backdrop-blur-xl mb-8 border-amber-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-xs font-medium text-ink-muted">
              Available for new partnerships
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
          >
            Building products
            <br />
            at the <span className="text-gradient">intersection</span> of
            <br />
            telecom & AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Taha Yasir — AI Product Builder & Senior VAS Product Manager. 7+ years
            shipping VAS, mobile payment, and AI-driven products across Iraq,
            Saudi Arabia, UAE, and Algeria with Tier-1 operators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Magnetic strength={0.4}>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-bg font-medium text-sm hover:bg-amber-500 transition-colors duration-300"
              >
                View my work
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass backdrop-blur-xl font-medium text-sm hover:border-amber-500/30 transition-all duration-300"
              >
                Get in touch
              </a>
            </Magnetic>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 max-w-lg mx-auto gap-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold tracking-tight text-gradient tabular-nums">
                  <NumberFlow value={stat.value} />
                  <span className="text-amber-500">{stat.suffix}</span>
                </div>
                <div className="text-xs text-ink-muted mt-1.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-widest text-ink-dim">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-ink-muted/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}