"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const roles = [
  {
    company: "Al-Bawaba for Telecom Services",
    role: "Senior VAS & Product Development Manager",
    period: "Aug 2022 — Present",
    location: "Baghdad, Iraq",
    highlights: [
      "Onboarded & managed digital service partners across Iraq, Saudi, UAE & Algeria",
      "Launched Ooredoo Algeria Mega Promo Service + SMART SMS Tool end-to-end",
      "Led Khalaspay carrier billing wallet and gaming subscription platform integrations",
      "Implemented Subscription Lifecycle Management (SLM) frameworks for Tier-1 operators",
    ],
  },
  {
    company: "Metco",
    role: "IT Engineer",
    period: "2018 — 2022",
    location: "Baghdad, Iraq",
    highlights: [
      "Supported Zain Iraq Call Center with Avaya systems, network monitoring, and ticket resolution",
      "Coordinated with technical teams and vendors to ensure continuous service uptime",
    ],
  },
];

function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: (typeof roles)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative pl-10 pb-12 last:pb-0"
    >
      {/* Dot */}
      <div className="absolute left-0 top-1.5">
        <div className="w-4 h-4 rounded-full bg-amber-500 relative z-10 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
        {!isLast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-amber-500/50 to-transparent min-h-[200px]" />
        )}
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 hover:border-amber-500/20 transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-2">
          <div>
            <h3 className="text-xl font-bold tracking-tight">{item.role}</h3>
            <p className="text-amber-500 font-medium text-sm">{item.company}</p>
          </div>
          <div className="text-right md:text-left">
            <p className="text-xs text-ink-muted font-mono">{item.period}</p>
            <p className="text-xs text-ink-dim">{item.location}</p>
          </div>
        </div>
        <ul className="space-y-2.5 mt-4">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-muted">
              <span className="text-amber-500 mt-1 shrink-0">▸</span>
              <span className="leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Experience() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-elevated/30 to-transparent pointer-events-none" />
      <div className="container-page relative">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-amber-500 mb-4">
            — Experience —
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            A track record of <span className="text-gradient">shipments</span>.
          </h2>
          <p className="text-ink-muted max-w-xl mx-auto text-base md:text-lg">
            7+ years across telecom, VAS, and product development with Tier-1
            operators in the MENA region.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {roles.map((role, i) => (
            <TimelineItem
              key={role.company}
              item={role}
              index={i}
              isLast={i === roles.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
