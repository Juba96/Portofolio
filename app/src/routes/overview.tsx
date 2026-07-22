import { Link, createFileRoute } from "@tanstack/react-router";

// Zero-click scannable overview — the recruiter fast lane. Everything worth
// knowing in one scroll: summary, projects, experience, skills, education,
// contact. Server-rendered (no ClientOnly, no motion) so it paints instantly
// and reads well for crawlers too.

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [{ title: "Taha Yasir — Overview" }],
  }),
  component: OverviewPage,
});

const projects = [
  {
    title: "QuizQ",
    tag: "Gamified Trivia · DCB",
    desc: "Arabic-first speed-quiz PWA with real prizes; game tokens paid via Direct Carrier Billing. Claude Partner Network POC, prepared for launch on Zain Iraq.",
    screen: "/assets/quizq/screens/home-light.png",
    icon: "🎮",
  },
  {
    title: "Ramba",
    tag: "Subscriptions · Payments",
    desc: "Car-wash subscription platform for Iraq — plans redeemable across partner shops, live queue tracking, Wayl payments with FIB / ZainCash settlement.",
    screen: "/assets/ramba/screens/home.png",
    icon: "🚗",
  },
  {
    title: "OoredooAI",
    tag: "Telco AI · VAS",
    desc: "AI-powered VAS & customer-acquisition engine — MVP delivered to Ooredoo Tunisia and Algeria. Bilingual chat, balance queries, plans billed to phone credit.",
    screen: "/assets/ooredooai/screens/chat.png",
    icon: "🤖",
  },
  {
    title: "Voyalla",
    tag: "GenAI · Travel Content",
    desc: "AI-driven travel content app generating cinematic destination media with generative video, voice, and character-driven storytelling.",
    screen: null,
    icon: "✈️",
  },
];

const experience = [
  {
    period: "2022 — Present",
    role: "Senior VAS & Product Development Manager",
    org: "Al-Bawaba Telecom",
    desc: "Partner onboarding, technical integrations, and SLM frameworks with Tier-1 operators across Iraq, Saudi Arabia, UAE, and Algeria. Led the Ooredoo Algeria Mega Promo launch and the Khalaspay carrier-billing integration.",
  },
  {
    period: "2022 — Present",
    role: "Founder",
    org: "Qaysariya Studio",
    desc: "Independent product studio designing and shipping AI-directed, monetized digital products for MENA markets end-to-end — QuizQ, Ramba, OoredooAI, Voyalla.",
  },
  {
    period: "2018 — 2022",
    role: "IT Engineer",
    org: "Metco (supporting Zain Iraq)",
    desc: "Telecom infrastructure and enterprise support for one of Iraq's largest operators.",
  },
];

const skills = [
  "Direct Carrier Billing",
  "VAS & Subscription Management",
  "Partner Development",
  "Mobile Payments",
  "API Integrations & Onboarding",
  "AI Product Development",
  "Stakeholder Management",
  "Project Delivery",
  "Arabic (native) · English (professional)",
];

function OverviewPage() {
  return (
    // html/body are overflow:hidden globally (the interactive app is a fixed
    // viewport) — this page scrolls inside its own full-height container.
    <div className="h-dvh w-full overflow-y-auto bg-white text-black">
      <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
        {/* Header */}
        <header className="flex items-center gap-5">
          <img
            src="/assets/avatar.png"
            alt="Taha Yasir"
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover bg-gray-100"
          />
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Taha Yasir</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              AI Product Builder · Senior VAS &amp; Product Development Manager
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Baghdad, Iraq · MENA-wide</p>
          </div>
        </header>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="https://www.linkedin.com/in/taha-algburi/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Connect on LinkedIn
          </a>
          <a
            href="mailto:Taha@qaysariya.com"
            className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
          >
            Taha@qaysariya.com
          </a>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
          >
            Interactive portfolio →
          </Link>
        </div>

        {/* Summary */}
        <p className="mt-8 text-[15px] leading-relaxed text-gray-700 [text-wrap:pretty]">
          7+ years shipping carrier billing, VAS, and AI products across MENA with Tier-1
          operators (Ooredoo, Zain, Khalaspay). I manage partner ecosystems and technical
          integrations by day, and design, build, and launch AI products end-to-end through my
          studio, Qaysariya.
        </p>

        {/* Projects */}
        <section className="mt-10">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Products I&apos;ve built
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.title}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4"
              >
                {p.screen ? (
                  <img
                    src={p.screen}
                    alt={`${p.title} screen`}
                    className="w-16 h-28 rounded-lg object-cover object-top shrink-0 bg-white border border-gray-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-28 rounded-lg shrink-0 bg-white border border-gray-100 flex items-center justify-center text-2xl">
                    {p.icon}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-[15px]">{p.title}</h3>
                  </div>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">{p.tag}</p>
                  <p className="text-[13px] leading-snug text-gray-600 mt-1.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mt-10">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((e) => (
              <div key={e.role} className="grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-3">
                <div className="text-[12px] text-gray-400 pt-0.5 whitespace-nowrap">{e.period}</div>
                <div>
                  <h3 className="font-semibold text-[15px]">
                    {e.role} <span className="text-gray-400 font-normal">· {e.org}</span>
                  </h3>
                  <p className="text-[13px] leading-snug text-gray-600 mt-1">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-10">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-full bg-gray-100 text-[12px] font-medium text-gray-700"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mt-10">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Education &amp; certifications
          </h2>
          <ul className="text-[13px] leading-relaxed text-gray-600 space-y-1">
            <li>Al-Iraqia University — College of Engineering, Networks (2014–2018)</li>
            <li>CS50 — Harvard University (2020)</li>
            <li>Avaya Certified Implementation &amp; Support Specialist (2020)</li>
            <li>Recoded for Entrepreneurship (2018)</li>
          </ul>
        </section>

        {/* Footer CTA */}
        <footer className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-gray-500">
            Want the full experience? Try the AI-powered interactive portfolio.
          </p>
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gray-800 transition-colors"
          >
            Open it →
          </Link>
        </footer>
      </div>
    </div>
  );
}
