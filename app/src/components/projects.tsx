"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type Project = {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  status: string;
  year: string;
};

const projects: Project[] = [
  {
    title: "QuizQ",
    tagline: "Bilingual Speed-Quiz PWA",
    description:
      "True-or-false quiz app monetized through Direct Carrier Billing. Flagship POC for the Anthropic Claude Partner Network, prepared for launch on Zain Iraq.",
    tags: ["PWA", "DCB", "Quiz", "Arabic"],
    status: "Launched",
    year: "2024",
  },
  {
    title: "Ramba",
    tagline: "Car-Wash Subscription Platform",
    description:
      "Monthly plans redeemable across partner car washes in Iraq. Integrated with the Wayl payment API, with automated partner settlement via FIB / ZainCash.",
    tags: ["Fintech", "Subscription", "API"],
    status: "MVP",
    year: "2024",
  },
  {
    title: "OoredooAI",
    tagline: "AI-Powered VAS & Acquisition Engine",
    description:
      "Intelligent multi-channel targeting across header enrichment, USSD, WhatsApp, and SMS with AI-driven lead scoring and CPA optimization. MVP delivered to Ooredoo Tunisia & Algeria.",
    tags: ["AI", "VAS", "Lead Gen"],
    status: "MVP",
    year: "2024",
  },
  {
    title: "Voyalla",
    tagline: "AI-Driven Travel Content",
    description:
      "Cinematic destination media generated through generative-AI video, voice, and character-driven storytelling pipelines. Travel content at scale.",
    tags: ["Generative AI", "Video", "Travel"],
    status: "In Progress",
    year: "2024",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const statusColor =
    project.status === "Launched"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : project.status === "MVP"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-teal-500/10 text-teal-400 border-teal-500/20";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="card p-6 md:p-7 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${statusColor}`}>
            {project.status}
          </span>
          <span className="text-[10px] text-ink-dim font-mono">
            {project.year}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-1 tracking-tight group-hover:text-teal-400 transition-colors duration-300">
        {project.title}
      </h3>
      <p className="text-sm text-teal-400/80 font-medium mb-3">
        {project.tagline}
      </p>
      <p className="text-sm text-ink-muted leading-relaxed mb-5">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-ink-muted border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-elevated/30 to-transparent pointer-events-none" />
      <div className="container-page relative">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-teal-500 mb-4">
            Projects
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Products I've <span className="text-gradient">built</span>.
          </h2>
          <p className="text-ink-muted leading-relaxed">
            A selection of products built under Qaysariya Studio — each
            addressing a specific need in the MENA market, from gaming to
            fintech to AI-powered travel.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
