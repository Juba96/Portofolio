"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SmokeyCursor from "./lightswind/smokey-cursor";
import { Iphone16Pro } from "./lightswind/iphone16-pro";
import { FluidActionPanel } from "./lightswind/fluid-action-panel";

type View = "me" | "projects" | "skills" | "fun" | "contact";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const knowledgeBase: { [key: string]: string } = {
  "who": "I'm Taha Yasir — an AI product builder with deep telecom roots. By day I'm Senior VAS & Product Development Manager working with Tier-1 operators across Iraq, Saudi Arabia, UAE, and Algeria; through Qaysariya, my product studio, I design and ship AI products end-to-end.",
  "about": "Based in Baghdad, I specialize in partner relationship management, technical integrations, and scalable platform delivery across E-Sports, Music, Video, Gaming, Fitness, and E-Learning.",
  "name": "I'm Taha Yasir — AI product builder, Senior VAS & Product Development Manager, and founder of Qaysariya Studio.",
  "experience": "7+ years across telecom and product development. Currently Senior VAS & Product Development Manager at Al-Bawaba Telecom (2022–present), managing partner onboarding across 4 markets. Previously IT Engineer at Metco (2018–2022) supporting Zain Iraq.",
  "skills": "Key strengths: Partner Development & Account Management, Direct Carrier Billing & Subscription Management, Stakeholder Management, Mobile Payments & Revenue Optimization, Technical Onboarding & API Integrations, and Project Delivery. I speak Arabic natively and English professionally.",
  "projects": "I've built 4 products under Qaysariya Studio: QuizQ (bilingual speed-quiz PWA with DCB), Ramba (car-wash subscription platform), OoredooAI (AI-powered VAS engine), and Voyalla (AI-driven travel content). I also led the Ooredoo Algeria Mega Promo Service launch and Khalaspay carrier billing integration.",
  "products": "Four products through Qaysariya: QuizQ, Ramba, OoredooAI, Voyalla — each solving a specific MENA market problem from gaming to fintech to travel.",
  "work": "I'm Senior VAS & Product Development Manager at Al-Bawaba Telecom, and I run Qaysariya Studio where I build AI products — QuizQ, Ramba, and OoredooAI are all studio work.",
  "contact": "📧 tahayasser96@gmail.com\n📱 +964 783 829 1196\n🔗 linkedin.com/in/taha-algburi\n📍 Baghdad, Iraq",
  "email": "tahayasser96@gmail.com",
  "phone": "+964 783 829 1196",
  "location": "Baghdad, Iraq 🇮🇶",
  "company": "Al-Bawaba Telecom and Qaysariya Studio.",
  "qaysariya": "Qaysariya is my independent product studio building AI-directed, monetized digital products for MENA markets. Products: QuizQ, Ramba, OoredooAI, Voyalla.",
  "quizq": "QuizQ is a bilingual true-or-false speed-quiz PWA monetized through Direct Carrier Billing. Flagship POC for the Anthropic Claude Partner Network, prepared for launch on Zain Iraq.",
  "ramba": "Ramba is a car-wash subscription platform for Iraq. Monthly plans redeemable across partner car washes. Integrated with Wayl payment API with automated settlement via FIB / ZainCash.",
  "ooredooai": "OoredooAI is an AI-powered VAS & customer-acquisition engine — MVP delivered to Ooredoo Tunisia and Algeria. Multi-channel targeting with AI-driven lead scoring and CPA optimization.",
  "voyalla": "Voyalla is an AI-driven travel content app that generates cinematic destination media through generative-AI video, voice, and character-driven storytelling.",
  "telecom": "Telecom VAS is my core domain. I work with Tier-1 operators (Ooredoo, Zain, Khalaspay) across Iraq, Saudi, UAE, and Algeria — partner onboarding, integrations, SLM, and end-to-end delivery.",
  "vas": "VAS (Value-Added Services) management is my specialty. End-to-end onboarding, integration requirements, SLM frameworks for billing & reporting, cross-functional team coordination.",
  "education": "Al-Iraqia University — College of Engineering, Networks Department (2014–2018). CS50 — Harvard University (2020). Recoded for Entrepreneurship (2018).",
  "certifications": "Avaya Certified Implementation Specialist (2020), Avaya Certified Support Specialist (2020), CS50 — Harvard University (2020), Recoded for Entrepreneurship (2018).",
  "languages": "Arabic — Native. English — Professional.",
  "hello": "Hey! 👋 Ask me anything about my work, projects, skills, or experience.",
  "hi": "Hey! 👋 Feel free to ask me anything. Try 'What projects have you built?'",
  "help": "Ask me about: projects, experience, skills, contact info, Qaysariya studio, or any specific product.",
  "what can you do": "I can answer questions about Taha's work, projects, skills, experience, and background.",
  "fun": "Outside of work, I love exploring new AI tools, following the MENA startup scene, and building side projects. I'm always experimenting with new technologies!",
  "hobby": "I enjoy building side projects, exploring new AI tools, and following the tech and startup scene across the Middle East.",
  "default": "I can answer questions about Taha's work, projects, skills, and experience. Try asking about his projects or telecom experience.",
};

function findAnswer(question: string): string {
  const q = question.toLowerCase().trim();
  for (const key of Object.keys(knowledgeBase)) {
    if (q.includes(key)) return knowledgeBase[key];
  }
  return knowledgeBase["default"];
}

const suggestedQuestions = [
  "What projects have you built?",
  "What's your experience?",
  "What are your skills?",
  "How can I contact you?",
];

type Project = {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  desc: string;
  // App screens shown inside the iPhone frame; multiple screens auto-cycle.
  screens: string[];
  // Pushes the screen image down inside the frame (SVG units) when the
  // screenshot's content starts at the very top (would hide under the island).
  screenInsetTop?: number;
  // Hide the frame's drawn island/camera when the screenshots already have
  // their own Dynamic Island baked in (e.g. Ramba's studio captures).
  frameIsland?: boolean;
};

const projects: Project[] = [
  {
    title: "QuizQ",
    subtitle: "Gamified Trivia App",
    icon: "🎮",
    color: "from-[#C21F2E] to-[#7a1020]",
    desc: "Arabic-first trivia game — timed questions, monthly leaderboards, and real prizes like phones and cash, with game tokens paid via carrier billing.",
    screens: [
      "/assets/quizq/screens/home-light.png",
      "/assets/quizq/screens/game-light.png",
      "/assets/quizq/screens/prizes-light.png",
    ],
    screenInsetTop: 60,
  },
  {
    title: "Ramba",
    subtitle: "Car-Wash Platform",
    icon: "🚗",
    color: "from-emerald-500 to-teal-600",
    desc: "Car-wash subscriptions for Iraq — wash plans, live queue tracking with Dynamic Island updates, nearby partner shops, and mobile-wallet payments.",
    screens: [
      "/assets/ramba/screens/home.png",
      "/assets/ramba/screens/queue.png",
      "/assets/ramba/screens/washing.png",
    ],
    frameIsland: false,
  },
  {
    title: "OoredooAI",
    subtitle: "Telco AI Assistant",
    icon: "🤖",
    color: "from-rose-500 to-pink-600",
    desc: "AI assistant for Ooredoo subscribers — bilingual chat, balance and data queries, image generation, and daily or weekly plans billed straight to phone credit.",
    screens: [
      "/assets/ooredooai/screens/chat.png",
      "/assets/ooredooai/screens/balance.png",
      "/assets/ooredooai/screens/plans.png",
    ],
    frameIsland: false,
  },
];

const skillCategories = [
  { name: "Product & Partnerships", icon: "🤝", skills: ["Partner Development", "Account Management", "Product Strategy", "Stakeholder Management", "Project Delivery"] },
  { name: "Telecom & VAS", icon: "📡", skills: ["Direct Carrier Billing", "Subscription Management", "USSD / SMS / WhatsApp", "Tier-1 Integrations", "Revenue Optimization"] },
  { name: "Technology", icon: "⚡", skills: ["API Integrations", "PWA Development", "AI Product Design", "Payment Systems", "Mobile Payments"] },
];

const funItems = [
  { title: "Side Projects", desc: "Always building something new — from AI tools to mini apps", icon: "🛠️" },
  { title: "MENA Startup Scene", desc: "Passionate about the growing tech ecosystem across the Middle East", icon: "🚀" },
  { title: "AI Exploration", desc: "Constantly experimenting with new AI models and workflows", icon: "🧪" },
];

const navItems: { id: View; label: string; iconColor: string }[] = [
  { id: "me", label: "Me", iconColor: "#14b8a6" },
  { id: "projects", label: "Projects", iconColor: "#10b981" },
  { id: "skills", label: "Skills", iconColor: "#8b5cf6" },
  { id: "fun", label: "Fun", iconColor: "#ec4899" },
  { id: "contact", label: "Contact", iconColor: "#eab308" },
];

const NavIcon = ({ view, color }: { view: View; color: string }) => {
  const icons: Record<View, any> = {
    me: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    ),
    projects: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M8 6V4h8v2" />
      </svg>
    ),
    skills: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6">
        <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    fun: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <circle cx="9" cy="10" r="0.5" fill={color} />
        <circle cx="15" cy="10" r="0.5" fill={color} />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
      </svg>
    ),
    contact: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6">
        <path d="M4 4h16v16H4z" />
        <path d="M4 7l8 5 8-5" />
      </svg>
    ),
  };
  return icons[view];
};

export function PortfolioApp() {
  const [view, setView] = useState<View>("me");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Desktop = precise hovering pointer. On touch devices the fluid cursor has
  // nothing to follow and only burns GPU/memory. (Component is client-only.)
  const [hasFinePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    // Scroll ONLY the chat's own scroll container. scrollIntoView would also
    // scroll every scrollable ancestor — shifting the whole page up off the
    // viewport (the overflow-hidden root can still be scrolled by the browser).
    const scroller = messagesEndRef.current?.parentElement;
    if (scroller && showChat) {
      // Instant scroll: restarting a *smooth* scroll animation on every
      // typewriter tick thrashes the compositor on mobile.
      scroller.scrollTo({ top: scroller.scrollHeight });
    }
  }, [messages, isTyping, showChat]);

  // Prefetch all project screens once the page is idle, so the Projects
  // switcher and its auto-cycle never show a loading pop-in.
  useEffect(() => {
    const prefetch = () => {
      for (const p of projects) {
        for (const src of p.screens) {
          const img = new Image();
          img.src = src;
        }
      }
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    if (idle) idle(prefetch);
    else setTimeout(prefetch, 1200);
  }, []);

  // Typewriter effect. Batches 4 chars per 40ms tick (~100 chars/sec) instead
  // of 1 char per 10ms — the old version forced ~100 full re-renders/sec,
  // which crashed mobile browsers mid-response on top of the WebGL cursor.
  const typeOutMessage = (text: string, id: number) => {
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i = Math.min(i + 4, text.length);
      const shown = text.slice(0, i);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: shown } : m)));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    setShowChat(true);
    const userMsg: Message = { id: Date.now(), role: "user", content: text.trim() };
    const assistantId = Date.now() + 1;
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    const answer = findAnswer(text.trim());
    setTimeout(() => typeOutMessage(answer, assistantId), 350 + Math.random() * 250);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const handleNavClick = (v: View) => {
    setView(v);
    setShowChat(false);
    setMessages([]);
    setInput("");
  };

  return (
    <div className="h-dvh w-full flex flex-col bg-white text-black overflow-hidden relative">
      {/* Smokey cursor — behind content, liquid glass effect. Desktop only:
          it's a mouse effect, and the WebGL fluid sim's GPU/memory load was
          crashing mobile browsers during chat responses. */}
      {hasFinePointer && (
        <SmokeyCursor
          transparent={true}
          simulationResolution={128}
          dyeResolution={1024}
          densityDissipation={1}
          velocityDissipation={0.5}
          curl={3}
          splatRadius={0.2}
          splatForce={6000}
          pressure={0.1}
          pressureIterations={20}
          colorUpdateSpeed={10}
          backgroundColor={{ r: 1, g: 1, b: 1 }}
          enableShading={true}
          className="!z-0 !cursor-auto opacity-60"
        />
      )}

      {/* Massive watermark */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none leading-none">
        <span className="text-[20vw] font-black text-black/[0.025] tracking-tighter whitespace-nowrap translate-y-[0.136em] block">
          TAHA
        </span>
      </div>

      {/* Info hub — morphing fluid action panel (replaces the old i-button modal) */}
      <FluidActionPanel position="top-right" />

      {/* Main content area. Mobile: scrollable so no view ever clips (m-auto
          keeps short content centered); desktop: fixed, centered. */}
      <main className="flex-1 flex px-3 md:px-10 relative z-10 overflow-y-auto md:overflow-hidden md:items-center md:justify-center">
        <AnimatePresence mode="wait">
          {!showChat && (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl m-auto py-3 md:py-0"
            >
              {view === "me" && <MeView />}
              {view === "projects" && <ProjectsView />}
              {view === "skills" && <SkillsView />}
              {view === "fun" && <FunView />}
              {view === "contact" && <ContactView />}
            </motion.div>
          )}

          {showChat && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl m-auto py-3 md:py-0"
            >
              <ChatView
                messages={messages}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom section */}
      <footer className="relative z-20 px-3 md:px-10 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6 pt-1 md:pt-2">
        {/* Toggle / back button */}
        <div className="flex items-center justify-center mb-2">
          {showChat ? (
            <button
              onClick={() => { setShowChat(false); setMessages([]); }}
              className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {view === "me" ? "me" : view}
            </button>
          ) : (
            <button
              onClick={() => setShowQuickQuestions((s) => !s)}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
            >
              {showQuickQuestions ? "Hide quick questions" : "Show quick questions"}
              <svg
                className={`w-3 h-3 transition-transform ${showQuickQuestions ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Quick questions */}
        <AnimatePresence>
          {showQuickQuestions && !showChat && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-2 md:mb-3"
            >
              {suggestedQuestions.map((q, i) => (
                <motion.button
                  key={q}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                  onClick={() => sendMessage(q)}
                  className="quick-q-btn liquid-glass text-[11px] px-3 py-2 md:text-[10px] md:px-2.5 md:py-1.5 rounded-full text-gray-600 transition-all duration-300"
                >
                  {q}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav cards */}
        {!showChat && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-2 md:mb-3"
          >
            <div className="flex items-stretch gap-1.5 md:gap-3">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ y: -3, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`nav-card liquid-glass flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 rounded-xl md:rounded-[16px] transition-all duration-300 ease-out ${
                    view === item.id ? "liquid-glass-active nav-card-active" : ""
                  }`}
                >
                  <NavIcon view={item.id} color={item.iconColor} />
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-gray-600">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat input */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-sm sm:max-w-md mx-auto"
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="liquid-glass w-full rounded-full px-4 md:px-5 py-2.5 md:py-3.5 pr-12 md:pr-14 text-base md:text-sm placeholder:text-gray-400 focus:outline-none transition-all duration-300"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="liquid-glass-dark absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full text-white flex items-center justify-center disabled:opacity-30 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Send"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </motion.form>

        <p className="text-center text-[8px] md:text-[9px] text-gray-400 mt-2 tracking-wider uppercase">
          Powered by AI
        </p>
      </footer>

    </div>
  );
}

/* ---------- Views ---------- */

function MeView() {
  return (
    <div className="text-center">
      {/* Y logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-4 md:mb-5"
      >
        <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl border border-black/10 bg-white flex items-center justify-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]">
          <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 text-black">
            <path
              fill="currentColor"
              d="M12 2L6 18h4v4h4v-4h4L12 2zm0 4l3 7.5h-6L12 6z"
            />
          </svg>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-sm md:text-base mb-1.5 md:mb-2 text-gray-700 font-medium"
      >
        Hey, I'm <span className="font-semibold text-black">Taha</span> 👋
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 md:mb-3 leading-tight"
      >
        AI Product Builder
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-[11px] sm:text-xs md:text-sm text-gray-500 mb-3 md:mb-5"
      >
        Senior VAS &amp; Product Development Manager · 7+ years in telecom across MENA
      </motion.p>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mb-2 md:mb-4"
      >
        <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto">
          <img
            src="/assets/avatar.png"
            alt="Taha Yasir"
            width={416}
            height={416}
            fetchPriority="high"
            className="w-full h-full object-contain avatar-float"
          />
        </div>
      </motion.div>
    </div>
  );
}

function ProjectsView() {
  const [active, setActive] = useState(0);
  const [screenIdx, setScreenIdx] = useState(0);
  const p = projects[active];
  const goTo = (dir: number) =>
    setActive((a) => (a + dir + projects.length) % projects.length);

  // Warm every screen the moment Projects opens — switching apps or cycling
  // should never wait on the network.
  useEffect(() => {
    for (const proj of projects) {
      for (const src of proj.screens) {
        const img = new Image();
        img.src = src;
      }
    }
  }, []);

  // Auto-cycle through the active app's screens (QuizQ has several).
  useEffect(() => {
    setScreenIdx(0);
    if (projects[active].screens.length < 2) return;
    const t = setInterval(() => {
      setScreenIdx((i) => (i + 1) % projects[active].screens.length);
    }, 3500);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight text-center"
      >
        My Projects
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
        {/* The phone — swaps between apps with motion */}
        <div className="w-[132px] md:w-[150px] shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: 70, rotate: 8, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, x: -70, rotate: -8, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              // Native-feel swipe between apps; vertical panning stays free
              // for page scroll.
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) goTo(1);
                else if (info.offset.x > 60) goTo(-1);
              }}
              style={{ touchAction: "pan-y" }}
            >
              <Iphone16Pro
                src={p.screens[screenIdx]}
                contentInsetTop={p.screenInsetTop ?? 0}
                screenBackground={p.screenInsetTop ? "#ffffff" : "#0a0a0a"}
                showIsland={p.frameIsland ?? true}
                showCamera={p.frameIsland ?? true}
                frameColor="#1c1c1e"
                bezelColor="#000000"
                shadow
                rounded
                className="w-full h-auto drop-shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Project info — animates alongside the phone */}
        <AnimatePresence mode="wait">
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[280px] text-center md:text-left"
          >
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">
              {p.subtitle}
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-1.5">{p.title}</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{p.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* App switcher */}
      <div className="flex justify-center gap-2 mt-3 md:mt-4">
        {projects.map((proj, i) => (
          <button
            key={proj.title}
            onClick={() => setActive(i)}
            className={`liquid-glass px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 ${
              i === active ? "liquid-glass-active text-black" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span className="mr-1">{proj.icon}</span>
            {proj.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function SkillsView() {
  return (
    <div className="max-w-xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-center"
      >
        Skills &amp; Expertise
      </motion.h2>

      <div className="space-y-5 mt-5">
        {skillCategories.map((cat, ci) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + ci * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-base">{cat.icon}</span>
              <h3 className="text-xs font-semibold text-gray-600">{cat.name}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill, si) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + ci * 0.1 + si * 0.04 }}
                  className="skill-pill text-[11px] font-medium px-2.5 py-1 rounded-full bg-black text-white cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 flex items-center justify-center gap-2.5 text-[11px] text-gray-500"
      >
        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">🇮🇶 Arabic — Native</span>
        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">🇬🇧 English — Professional</span>
      </motion.div>
    </div>
  );
}

function FunView() {
  return (
    <div className="max-w-xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl md:text-3xl font-bold mb-5 tracking-tight text-center"
      >
        Fun Stuff
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {funItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="rounded-2xl p-4 border border-black/10 bg-white hover:border-black/15 transition-all duration-300 text-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="font-bold text-sm mb-1.5">{item.title}</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-xs text-gray-500 mt-6"
      >
        Always curious, always building. 🚀
      </motion.p>
    </div>
  );
}

function ContactView() {
  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-black/10 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-bold tracking-tight">Contacts</h2>
          <span className="text-[11px] text-gray-400">@tahayasir</span>
        </div>

        <motion.a
          href="mailto:tahayasser96@gmail.com"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-blue-500 font-medium text-sm hover:text-blue-600 transition-colors inline-flex items-center gap-1 mb-5"
        >
          tahayasser96@gmail.com
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {["Email", "LinkedIn", "Phone"].map((s) => (
            <a
              key={s}
              href={
                s === "Email"
                  ? "mailto:tahayasser96@gmail.com"
                  : s === "Phone"
                    ? "tel:+9647838291196"
                    : "https://www.linkedin.com/in/taha-algburi/"
              }
              {...(s === "LinkedIn" ? { target: "_blank", rel: "noreferrer" } : {})}
              className="text-[12px] text-gray-500 hover:text-gray-800 transition-colors"
            >
              {s}
            </a>
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="text-center text-xs text-gray-500 mt-5"
      >
        You can reach me super easily! Just hit me up via:
      </motion.p>
    </div>
  );
}

function ChatView({
  messages,
  isTyping,
  messagesEndRef,
}: {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="h-[55vh] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dot-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dot-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dot-3" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
