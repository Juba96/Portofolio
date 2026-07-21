"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const knowledgeBase: { [key: string]: string } = {
  "who": "I'm Taha Yasir — an AI product builder with deep telecom roots. I'm Senior VAS & Product Development Manager working with Tier-1 operators across Iraq, Saudi Arabia, UAE, and Algeria, and I run Qaysariya — my product studio building AI products for MENA markets.",
  "about": "Based in Baghdad, I specialize in partner relationship management, technical integrations, and scalable platform delivery across E-Sports, Music, Video, Gaming, Fitness, and E-Learning. I'm passionate about building products at the intersection of telecom and AI.",
  "name": "I'm Taha Yasir — Senior VAS & Product Development Manager and founder of Qaysariya Studio. 👋",
  "experience": "7+ years across telecom and product development. Currently Senior VAS & Product Development Manager at Al-Bawaba Telecom (2022–present), managing partner onboarding across 4 markets. Previously IT Engineer at Metco (2018–2022) supporting Zain Iraq.",
  "skills": "Key strengths: Partner Development & Account Management, Direct Carrier Billing & Subscription Management, Stakeholder Management, Mobile Payments & Revenue Optimization, Technical Onboarding & API Integrations, and Project Delivery. I speak Arabic natively and English professionally.",
  "projects": "I've built 4 products under Qaysariya Studio:\n\n1. QuizQ — bilingual true-or-false speed-quiz PWA with DCB monetization\n2. Ramba — car-wash subscription platform with Wayl payment integration\n3. OoredooAI — AI-powered VAS & customer-acquisition engine\n4. Voyalla — AI-driven travel content with generative video & voice\n\nI also led the Ooredoo Algeria Mega Promo Service launch and Khalaspay carrier billing wallet integration.",
  "products": "Four main products through Qaysariya: QuizQ (quiz PWA), Ramba (car-wash subscriptions), OoredooAI (AI VAS engine), Voyalla (AI travel content). Each solves a specific problem for the MENA market — from gaming to fintech to travel.",
  "work": "I'm Senior VAS & Product Development Manager at Al-Bawaba Telecom, where I manage the full lifecycle of service provider partnerships. I also run Qaysariya Studio, building AI-powered products independently.",
  "contact": "📧 tahayasser96@gmail.com\n📱 +964 783 829 1196\n📍 Baghdad, Iraq\n\nI'm always open to new partnerships and product ideas. Feel free to reach out!",
  "email": "tahayasser96@gmail.com",
  "phone": "+964 783 829 1196",
  "location": "I'm based in Baghdad, Iraq 🇮🇶",
  "company": "I currently work at Al-Bawaba for Telecom Services as Senior VAS & Product Development Manager. I'm also the founder of Qaysariya, my independent product studio.",
  "qaysariya": "Qaysariya is my independent product studio building AI-directed, monetized digital products for MENA markets. We build PWAs and platforms using an AI-assisted development model. Four products live or in MVP: QuizQ, Ramba, OoredooAI, Voyalla.",
  "quizq": "QuizQ is a bilingual (Arabic/French) true-or-false speed-quiz PWA monetized through Direct Carrier Billing. It was developed as the flagship POC for the Anthropic Claude Partner Network and prepared for launch on Zain Iraq via aggregator.",
  "ramba": "Ramba is a car-wash subscription platform for the Iraqi market. Users get monthly plans redeemable across partner car washes. Integrated with the Wayl payment API, with automated partner settlement via FIB / ZainCash.",
  "ooredooai": "OoredooAI is an AI-powered VAS & customer-acquisition engine — MVP delivered to Ooredoo Tunisia and Algeria. It uses intelligent multi-channel targeting across header enrichment, USSD, WhatsApp, and SMS with AI-driven lead scoring and CPA optimization.",
  "voyalla": "Voyalla is an AI-driven travel content app that generates cinematic destination media through generative-AI video, voice, and character-driven storytelling pipelines. Travel content at scale.",
  "telecom": "Telecom VAS is my core domain. I work with Tier-1 operators — Ooredoo, Zain, and others across Iraq, Saudi, UAE, and Algeria. I manage partner onboarding, integration requirements, Subscription Lifecycle Management (SLM), and end-to-end project delivery.",
  "vas": "VAS (Value-Added Services) management is my specialty. I oversee end-to-end onboarding, define integration requirements, implement SLM frameworks for billing & reporting, and coordinate cross-functional teams to deliver on time.",
  "education": "Al-Iraqia University — College of Engineering, Networks Department (2014–2018). I also completed CS50 at Harvard University (2020) and the Recoded for Entrepreneurship program (2018).",
  "certifications": "• Avaya Certified Implementation Specialist (2020)\n• Avaya Certified Support Specialist (2020)\n• CS50 — Harvard University (2020)\n• Recoded for Entrepreneurship (2018)",
  "languages": "Arabic — Native\nEnglish — Professional (fluent)",
  "availability": "I'm open to new partnership opportunities and product collaborations. The best way to reach me is at tahayasser96@gmail.com.",
  "hire": "I'm always open to discussing new opportunities. Reach out at tahayasser96@gmail.com or call +964 783 829 1196.",
  "hello": "Hey! 👋 I'm Taha's AI portfolio assistant. Ask me anything about his work, projects, skills, or experience. Try: 'What projects have you built?'",
  "hi": "Hey! 👋 Feel free to ask me anything about Taha's work. Try 'What are your skills?' or 'Tell me about QuizQ'.",
  "help": "You can ask me about:\n\n• Projects & products\n• Experience & background\n• Skills & expertise\n• Contact information\n• Qaysariya studio\n\nJust type your question!",
  "what can you do": "I can answer questions about Taha's work, projects, skills, experience, and background. Try asking about specific projects or his telecom experience.",
  "default": "I can answer questions about Taha's work, projects, skills, experience, and background. Try asking about his projects, skills, or experience in telecom VAS.",
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

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hey! 👋 I'm Taha's AI portfolio assistant. Ask me anything about his work, projects, or experience." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const typeOutMessage = (text: string, id: number) => {
    setIsTyping(true);
    let i = 0;
    const speed = 12;
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((m) => m.id === id ? { ...m, content: text.slice(0, i + 1) } : m),
      );
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text.trim() };
    const assistantId = Date.now() + 1;
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    const answer = findAnswer(text.trim());
    setTimeout(() => typeOutMessage(answer, assistantId), 350 + Math.random() * 250);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative bg-bg-elevated/60 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
              TY
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-bg-elevated" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Taha's AI Portfolio</div>
            <div className="text-[11px] text-ink-dim">Online · Always here</div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[380px] overflow-y-auto px-4 py-5 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-teal-500 text-white rounded-br-md"
                      : "bg-white/5 text-ink border border-white/10 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" && msg.content === "" && (
                    <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-teal-400 align-middle" />
                  )}
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
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-muted dot-bounce-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-muted dot-bounce-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-muted dot-bounce-3" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-4 pb-4 pt-3 border-t border-white/5">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 pr-12 text-sm placeholder:text-ink-dim focus:outline-none focus:border-teal-500/40 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Send"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Suggested questions */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestedQuestions.map((q) => (
          <motion.button
            key={q}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => sendMessage(q)}
            disabled={isTyping}
            className="px-3.5 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-ink-muted hover:border-teal-500/30 hover:text-ink hover:bg-white/10 transition-all duration-200 disabled:opacity-40"
          >
            {q}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
