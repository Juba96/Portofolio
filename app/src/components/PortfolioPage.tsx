"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ReactLenis } from "lenis/react";
import {
  SectionReveal,
  AnimatedLine,
  HeroOrbs,
  Magnetic,
} from "./PortfolioElements";
import { ClientOnly } from "./ClientOnly";

// Data
const PRODUCTS = [
  {
    name: "QuizQ",
    tagline: "Bilingual Speed-Quiz PWA",
    description:
      "Arabic/French true-or-false speed quiz app monetized via Direct Carrier Billing. Flagship POC for the Anthropic Claude Partner Network, launched on Zain Iraq via aggregator.",
    image: "/assets/quizq.svg",
    gradient: "from-amber-500/20 to-orange-600/10",
    accent: "text-amber-400",
    tags: ["PWA", "DCB", "Gaming"],
  },
  {
    name: "Ramba",
    tagline: "Car-Wash Subscription Platform",
    description:
      "Monthly car-wash plans redeemable across partner locations in Iraq. Integrated Wayl payment API with automated partner settlement via FIB and ZainCash.",
    image: "/assets/ramba.svg",
    gradient: "from-teal-500/20 to-cyan-600/10",
    accent: "text-teal-400",
    tags: ["Marketplace", "Payments", "Fintech"],
  },
  {
    name: "OoredooAI",
    tagline: "AI-Powered VAS Engine",
    description:
      "Intelligent multi-channel customer-acquisition engine for Ooredoo Tunisia & Algeria. Header enrichment, USSD, WhatsApp, and SMS targeting with AI lead scoring and CPA optimization.",
    image: "/assets/ooredooai.svg",
    gradient: "from-violet-500/20 to-purple-600/10",
    accent: "text-violet-400",
    tags: ["AI", "VAS", "Growth"],
  },
  {
    name: "Voyalla",
    tagline: "AI Travel Storytelling",
    description:
      "AI-driven travel-content app generating cinematic destination media through generative-AI video, voice, and character-driven storytelling pipelines.",
    image: "/assets/voyalla.svg",
    gradient: "from-rose-500/20 to-pink-600/10",
    accent: "text-rose-400",
    tags: ["Generative AI", "Travel", "Video"],
  },
];

const EXPERIENCE = [
  {
    company: "Al-Bawaba for Telecom Services",
    role: "Senior VAS & Product Development Manager",
    period: "2022 — Present",
    location: "Baghdad, Iraq",
    points: [
      "Managed end-to-end onboarding of service providers across Iraq, KSA, UAE & Algeria",
      "Implemented Subscription Lifecycle Management frameworks for seamless billing",
      "Launched Ooredoo Algeria Mega Promo Service and SMART SMS Tool",
      "Led Khalaspay carrier billing wallet & gaming subscription platform integrations",
    ],
  },
  {
    company: "Metco",
    role: "IT Engineer",
    period: "2018 — 2022",
    location: "Baghdad, Iraq",
    points: [
      "Supported Zain Iraq Call Center with Avaya systems & network monitoring",
      "Coordinated with technical teams and vendors for issue resolution",
      "Built strong stakeholder communication and problem-solving foundations",
    ],
  },
];

const SKILLS = [
  "Partner Development",
  "Account Management",
  "Direct Carrier Billing",
  "Subscription Management",
  "Stakeholder Management",
  "Mobile Payments",
  "Revenue Optimization",
  "Technical Onboarding",
  "API Integrations",
  "Project Delivery",
  "VAS Strategy",
  "AI Product Development",
  "PWA Development",
  "Operational Excellence",
];

const STATS = [
  { label: "Years Experience", value: "7+" },
  { label: "Markets Launched", value: "4" },
  { label: "Products Built", value: "4" },
  { label: "Partners Onboarded", value: "20+" },
];

export default function PortfolioPage() {
  return (
    <ReactLenis root options={{ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
      <div className="relative min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">
        <Hero />
        <ProductsSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </div>
    </ReactLenis>
  );
}

/* ========== HERO ========== */
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background orbs */}
      <ClientOnly fallback={<div className="absolute inset-0 bg-[#0a0a12]" />}>
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <HeroOrbs />
        </motion.div>
      </ClientOnly>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Avatar badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm text-white/70">Available for new opportunities</span>
        </motion.div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Taha <span className="text-gradient-amber">Yasir</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-xl text-white/60 sm:text-2xl"
            >
              AI Product Builder · Senior VAS & Product Development Manager
            </motion.p>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-8 max-w-2xl text-base text-white/50 sm:text-lg"
        >
          Building AI-directed, monetized digital products for MENA markets.
          Founder of Qaysariya — an independent product studio turning ideas into
          Progressive Web Apps.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Magnetic>
            <a
              href="#work"
              className="group relative inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3 font-medium text-black transition-all hover:bg-amber-400"
            >
              View My Work
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
            >
              Get in Touch
            </a>
          </Magnetic>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
          >
            <div className="h-2 w-0.5 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ========== PRODUCTS ========== */
function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="work" ref={ref} className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionReveal className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
            Products & Ventures
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Built with <span className="text-gradient-amber">Qaysariya</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
            An independent product studio conceiving, designing, and shipping
            AI-directed digital products for MENA markets.
          </p>
        </SectionReveal>

        <div className="grid gap-8 md:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${product.gradient}`}
        />
        <img
          src={product.image}
          alt={product.name}
          className="relative h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent" />
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className={`text-2xl font-bold ${product.accent}`}>{product.name}</h3>
        <p className="mt-1 text-sm text-white/50">{product.tagline}</p>
        <p className="mt-4 text-white/70 leading-relaxed">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ========== EXPERIENCE ========== */
function ExperienceSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-4xl">
        <SectionReveal className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
            Career Journey
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Experience
          </h2>
        </SectionReveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-white/20 to-transparent md:left-1/2" />

          <div className="space-y-16">
            {EXPERIENCE.map((exp, i) => (
              <TimelineItem key={exp.company} exp={exp} index={i} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <SectionReveal key={stat.label} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
                <div className="text-3xl font-bold text-gradient-amber sm:text-4xl">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof EXPERIENCE)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative md:grid md:grid-cols-2 md:gap-8">
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
        className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.5)] md:left-1/2"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -40 : 40 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`pl-12 md:pl-0 ${isLeft ? "md:pr-8 md:text-right" : "md:col-start-2 md:pl-8"}`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
          <span className="text-sm font-medium text-amber-500/80">{exp.period}</span>
          <h3 className="mt-2 text-xl font-bold">{exp.role}</h3>
          <p className="text-white/50">{exp.company} · {exp.location}</p>
          <ul className="mt-4 space-y-2">
            {exp.points.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-white/60">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

/* ========== SKILLS / MARQUEE ========== */
function SkillsSection() {
  return (
    <section className="relative py-32 px-6">
      <SectionReveal className="mb-16 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
          Core Competencies
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Skills & Expertise
        </h2>
      </SectionReveal>

      {/* Marquee 1 */}
      <div className="relative mb-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex min-w-max animate-marquee-x gap-4">
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <div
              key={`${skill}-${i}`}
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="whitespace-nowrap text-white/80">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee 2 (reverse) */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex min-w-max animate-marquee-x-slow gap-4 [animation-direction:reverse]">
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <div
              key={`${skill}-r-${i}`}
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3"
            >
              <span className="whitespace-nowrap text-white/60">{skill}</span>
              <span className="h-2 w-2 rounded-full bg-violet-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== CONTACT ========== */
function ContactSection() {
  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-amber-500/10 to-transparent p-12 sm:p-20">
            {/* Glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-500/20 blur-[100px]" />

            <div className="relative">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
                Let's Connect
              </p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Have a project in mind?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
                From telecom VAS to AI-powered digital products, I help bring
                ideas to market. Let's build something together.
              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <a
                    href="mailto:tahayasser96@gmail.com"
                    className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3 font-medium text-black transition-all hover:bg-amber-400"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Me
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://www.linkedin.com/in/taha-algburi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </Magnetic>
              </div>

              <p className="mt-8 text-sm text-white/40">
                tahayasser96@gmail.com · +964 7838291196 · Baghdad, Iraq
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ========== FOOTER ========== */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Taha Yasir. All rights reserved.
        </p>
        <p className="text-sm text-white/30">
          Built with <span className="text-amber-500">♥</span> in Baghdad
        </p>
      </div>
    </footer>
  );
}
