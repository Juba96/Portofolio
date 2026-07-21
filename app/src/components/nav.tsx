"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 100], [0, -8]);
  const opacity = useTransform(scrollY, [0, 100], [1, 0.96]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.header
      style={{ y, opacity }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container-page py-4">
        <nav
          className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
            scrolled ? "glass" : "bg-transparent border border-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
              TY
            </div>
            <span className="font-semibold tracking-tight text-sm">
              Taha Yasir
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-muted hover:text-ink transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center text-xs font-medium px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-400 hover:to-cyan-500 hover:scale-105 transition-all duration-300"
          >
            Get in touch
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
