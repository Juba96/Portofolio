"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const links = [
    {
      label: "Email",
      value: "Taha@qaysariya.com",
      href: "mailto:Taha@qaysariya.com",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Phone",
      value: "Taha@qaysariya.com",
      href: "mailto:Taha@qaysariya.com",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      label: "Location",
      value: "Baghdad, Iraq",
      href: "#",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-[120px] pointer-events-none" />

      <div className="container-page relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-teal-500 mb-4">
            Contact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
            Let's build something
            <br />
            <span className="text-gradient">together</span>.
          </h2>
          <p className="text-ink-muted max-w-lg mx-auto mb-10 leading-relaxed">
            I'm always open to new partnerships, product opportunities, and
            conversations across telecom, VAS, and AI.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="card p-5 text-center hover:border-teal-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3">
                  {link.icon}
                </div>
                <div className="text-[11px] text-ink-dim mb-0.5">{link.label}</div>
                <div className="text-sm font-medium">{link.value}</div>
              </motion.a>
            ))}
          </div>

          <motion.a
            href="mailto:Taha@qaysariya.com"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium text-sm hover:from-teal-400 hover:to-cyan-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-teal-500/25"
          >
            Start a conversation
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
