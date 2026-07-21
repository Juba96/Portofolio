"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const skills = [
  {
    category: "Product & Partnerships",
    items: [
      { name: "Partner Development", level: 95 },
      { name: "Account Management", level: 92 },
      { name: "Product Strategy", level: 88 },
      { name: "Stakeholder Management", level: 94 },
    ],
  },
  {
    category: "Telecom & VAS",
    items: [
      { name: "Direct Carrier Billing", level: 90 },
      { name: "Subscription Management", level: 93 },
      { name: "USSD / SMS / WhatsApp", level: 85 },
      { name: "Tier-1 Operator Integrations", level: 90 },
    ],
  },
  {
    category: "Technology",
    items: [
      { name: "API Integrations", level: 88 },
      { name: "PWA Development", level: 82 },
      { name: "AI Product Design", level: 85 },
      { name: "Payment Systems", level: 87 },
    ],
  },
];

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="container-page">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-teal-500 mb-4">
            Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What I <span className="text-gradient">bring</span> to the table.
          </h2>
          <p className="text-ink-muted leading-relaxed">
            A blend of telecom domain expertise, product thinking, and
            technical execution honed across 7+ years in the MENA region.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {skills.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + ci * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card p-6"
            >
              <h3 className="text-base font-semibold mb-5 text-ink">
                {cat.category}
              </h3>
              <ul className="space-y-4">
                {cat.items.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-ink">{skill.name}</span>
                      <span className="text-ink-dim text-xs">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{
                          duration: 1,
                          delay: 0.3 + ci * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <span className="text-xs px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-ink-muted">
            Arabic — Native
          </span>
          <span className="text-xs px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-ink-muted">
            English — Professional
          </span>
          <span className="text-xs px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-ink-muted">
            CS50 — Harvard University
          </span>
          <span className="text-xs px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-ink-muted">
            Avaya Certified Specialist
          </span>
        </motion.div>
      </div>
    </section>
  );
}
