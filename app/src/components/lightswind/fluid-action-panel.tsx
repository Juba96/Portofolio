"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, X, Link2, Check, Mail, Share2 } from "lucide-react";

// lucide-react@1.x has no brand icons — inline LinkedIn glyph.
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);
import { cn } from "@/lib/utils";

// lightswind fluid-action-panel, tailored as the portfolio's "i" button:
// the morphing glass panel with the About content and quick contact actions.
//
// Anti-flash: the container declares its closed size three ways — inline
// style base, `initial={false}` (mount at animate values, no mount pass),
// and no `layout` prop — so the first painted frame is always the 44px
// button, never an unsized full-width/height container.

export interface FluidActionPanelProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
  onThemeToggle?: () => void;
  isDark?: boolean;
}

const ABOUT_ROWS = [
  { icon: "⚡", title: "Powered by AI", desc: "Chat with my AI assistant to learn about my work and experience." },
  { icon: "🎨", title: "Fluid Design", desc: "Built with WebGL fluid simulation and smooth motion effects." },
  { icon: "💼", title: "Qaysariya Studio", desc: "Independent product studio building AI-powered products for MENA markets." },
];

export const FluidActionPanel = ({ position = "top-right", className }: FluidActionPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate height to a MEASURED number, never "auto" — animating to "auto"
  // makes the library measure mid-mount on the first open, which flashes the
  // panel to a huge height before settling. Measured pre-paint, so the spring
  // always targets the real content height.
  const [openHeight, setOpenHeight] = useState(470);
  useLayoutEffect(() => {
    if (isOpen && contentRef.current) {
      setOpenHeight(Math.min(44 + contentRef.current.offsetHeight, window.innerHeight - 32));
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-4 right-4 md:top-5 md:right-10",
    "top-left": "top-6 left-6",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
  };

  return (
    <div
      ref={containerRef}
      className={cn("fixed z-[1000] font-sans select-none", positionClasses[position], className)}
    >
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? 320 : 44,
          height: isOpen ? openHeight : 44,
          borderRadius: isOpen ? 24 : 22,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
        style={{ width: 44, height: 44, borderRadius: 22 }}
        className="liquid-glass w-11 h-11 overflow-hidden flex flex-col justify-start ml-auto"
      >
        {/* Morphing trigger */}
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0 ml-auto">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="w-11 h-11 flex items-center justify-center relative focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "Close info" : "Info"}
          >
            <AnimatePresence mode="wait">
              {!isOpen ? (
                <motion.div
                  key="info"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Info className="w-[18px] h-[18px] text-gray-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="close"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-[18px] h-[18px] text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Panel content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contentRef}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-[320px] px-4 pb-4 flex flex-col gap-3 text-left"
            >
              <motion.div variants={itemVariants} className="flex flex-col gap-0.5 border-b border-black/5 pb-2">
                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">About</span>
                <span className="text-sm font-bold text-gray-800">Taha Yasir — AI Portfolio</span>
              </motion.div>

              {ABOUT_ROWS.map((row) => (
                <motion.div
                  key={row.title}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-white/50 border border-black/5"
                >
                  <span className="text-base leading-none mt-0.5">{row.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{row.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{row.desc}</p>
                  </div>
                </motion.div>
              ))}

              {/* Quick actions */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
                <a
                  href="https://www.linkedin.com/in/taha-algburi/"
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-black/10 bg-white/60 hover:bg-white hover:-translate-y-0.5 transition-all text-[11px] font-bold text-gray-700"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  Connect on LinkedIn
                </a>
                <a
                  href="mailto:Taha@qaysariya.com"
                  className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-black/10 bg-white/60 hover:bg-white hover:-translate-y-0.5 transition-all text-[11px] font-bold text-gray-700"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email me
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-black/10 bg-white/60 hover:bg-white hover:-translate-y-0.5 transition-all text-[11px] font-bold text-gray-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy link"}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) navigator.share({ title: document.title, url: window.location.href });
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-black/10 bg-white/60 hover:bg-white hover:-translate-y-0.5 transition-all text-[11px] font-bold text-gray-700"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="border-t border-black/5 pt-2">
                <p className="text-[10px] text-gray-400 text-center">© 2026 Taha Yasir. All rights reserved.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
