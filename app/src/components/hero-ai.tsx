"use client";

import { motion } from "motion/react";
import { AIChat } from "./ai-chat";

export function HeroAI() {
  return (
    <section id="top" className="relative min-h-dvh flex items-center py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-bg pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

      <div className="container-page relative z-10 w-full">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl mb-3 text-ink-muted"
          >
            Hey, I'm <span className="text-ink font-semibold">Taha</span> 👋
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Senior <span className="text-gradient">Telecom</span> &amp; Product
            <br className="hidden md:block" /> Development Manager
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-ink-muted max-w-lg mx-auto text-base md:text-lg"
          >
            Building AI-powered products and partnerships across MENA.
            7+ years with Tier-1 operators.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <AIChat />
        </motion.div>

        {/* Nav dots / sections quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {[
            { href: "#about", label: "About" },
            { href: "#projects", label: "Projects" },
            { href: "#skills", label: "Skills" },
            { href: "#contact", label: "Contact" },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="text-sm text-ink-muted hover:text-teal-400 transition-colors relative group"
            >
              {s.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
