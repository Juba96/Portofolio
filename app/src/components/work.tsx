"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type Project = {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  year: string;
  gradient: string;
  image: string;
};

const projects: Project[] = [
  {
    title: "QuizQ",
    tagline: "Bilingual Speed-Quiz PWA",
    description:
      "True-or-false quiz app monetized through Direct Carrier Billing. Flagship POC for the Anthropic Claude Partner Network, launched on Zain Iraq via aggregator.",
    tags: ["PWA", "DCB", "Quiz", "Arabic/French"],
    year: "2024",
    gradient: "from-amber-500/20 to-orange-500/10",
    image: "/assets/quizq.png",
  },
  {
    title: "Ramba",
    tagline: "Car-Wash Subscription Platform",
    description:
      "Monthly plans redeemable across partner car washes in Iraq. Integrated with the Wayl payment API, with automated partner settlement via FIB / ZainCash.",
    tags: ["Fintech", "Subscription", "API Integration"],
    year: "2024",
    gradient: "from-blue-500/20 to-teal-500/10",
    image: "/assets/ramba.png",
  },
  {
    title: "OoredooAI",
    tagline: "AI-Powered VAS & Acquisition Engine",
    description:
      "Intelligent multi-channel targeting across header enrichment, USSD, WhatsApp, and SMS with AI-driven lead scoring and CPA optimization. MVP delivered to Ooredoo Tunisia & Algeria.",
    tags: ["AI", "VAS", "Multi-Channel", "Lead Scoring"],
    year: "2024",
    gradient: "from-purple-500/20 to-fuchsia-500/10",
    image: "/assets/ooredooai.png",
  },
  {
    title: "Voyalla",
    tagline: "AI-Driven Travel Content",
    description:
      "Cinematic destination media generated through generative-AI video, voice, and character-driven storytelling pipelines. Travel content at scale.",
    tags: ["Generative AI", "Video", "Travel", "Voice"],
    year: "2024",
    gradient: "from-rose-500/20 to-amber-500/10",
    image: "/assets/voyalla.png",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <div
        className={`relative rounded-3xl overflow-hidden glass bg-gradient-to-br ${project.gradient} p-[1px] transition-all duration-500 hover:border-amber-500/30`}
      >
        <div className="rounded-3xl bg-bg-elevated/90 backdrop-blur-xl h-full flex flex-col">
          {/* Image */}
          <div className="relative overflow-hidden rounded-t-[22px] aspect-[4/3]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <span className="text-xs font-mono text-ink-dim">0{index + 1}</span>
              <span className="text-xs text-ink-muted bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {project.year}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-10 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight group-hover:text-amber-400 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-sm text-amber-500/80 mb-4 font-medium">
                {project.tagline}
              </p>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs font-medium text-ink-dim">
                Qaysariya Studio
              </span>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 group-hover:scale-110">
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Work() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="container-page">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-amber-500 mb-4">
            — Selected Work —
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Products <span className="text-gradient">shipped</span>.
          </h2>
          <p className="text-ink-muted max-w-xl mx-auto text-base md:text-lg">
            A snapshot of ventures built under Qaysariya, my independent product
            studio for the MENA region.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
