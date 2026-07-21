"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { value: "7+", label: "Years Experience" },
    { value: "4+", label: "Markets" },
    { value: "4", label: "Products Shipped" },
    { value: "10+", label: "Partner Integrations" },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container-page">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-teal-500 mb-4">
            About
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
            Bridging telecom <span className="text-gradient">and AI</span>.
          </h2>
          <div className="space-y-4 text-ink-muted leading-relaxed">
            <p>
              I'm an AI product builder and Senior VAS &amp; Product Development Manager with 7+ years
              of experience at the intersection of technical execution and business
              growth. I work with Tier-1 operators across Iraq, Saudi Arabia, UAE,
              and Algeria — building partnerships, shipping products, and scaling
              revenue.
            </p>
            <p>
              I also run <span className="text-ink font-medium">Qaysariya</span>,
              my independent product studio, where I build AI-directed, monetized
              digital products for the MENA market — from DCB-powered games to
              fintech platforms and AI-driven travel content.
            </p>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2 tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-ink-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
