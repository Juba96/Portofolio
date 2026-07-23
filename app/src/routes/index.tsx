import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "../components/client-only";
import { PortfolioApp } from "../components/portfolio-app";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-dvh w-full overflow-hidden">
      {/* Static fallback: server-rendered so crawlers, link-preview scrapers,
          slow connections, and no-JS visitors see real content instead of a
          blank shell. Swapped for the interactive app once JS hydrates. */}
      <ClientOnly fallback={<StaticHero />}>
        <PortfolioApp />
      </ClientOnly>
    </div>
  );
}

function StaticHero() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-white text-black px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm text-gray-700 font-medium mb-2">Hey, I'm Taha 👋</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          AI Product Builder
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Senior VAS &amp; Product Development Manager — 7+ years shipping carrier billing,
          VAS, and AI products across MENA with Tier-1 operators. Founder of Qaysariya
          Studio: QuizQ, Ramba, OoredooAI, Voyalla.
        </p>
        <a
          href="/overview"
          className="inline-block px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium"
        >
          View the 60-second overview →
        </a>
      </div>
    </div>
  );
}
