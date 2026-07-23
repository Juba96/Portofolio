import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "../components/client-only";
import { PortfolioApp } from "../components/portfolio-app";
import { fetchSiteContent } from "../lib/api/content.functions";

export const Route = createFileRoute("/")({
  // Editable site content, loaded server-side (cached) and serialized to the
  // client — /admin edits appear on the next page load, no redeploy.
  loader: () => fetchSiteContent(),
  component: Index,
});

function Index() {
  const content = Route.useLoaderData();
  return (
    <div className="h-dvh w-full overflow-hidden">
      {/* Static fallback: server-rendered so crawlers, link-preview scrapers,
          slow connections, and no-JS visitors see real content instead of a
          blank shell. Swapped for the interactive app once JS hydrates. */}
      <ClientOnly fallback={<StaticHero content={content} />}>
        <PortfolioApp content={content} />
      </ClientOnly>
    </div>
  );
}

function StaticHero({ content }: { content: Awaited<ReturnType<typeof fetchSiteContent>> }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-white text-black px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm text-gray-700 font-medium mb-2">{content.hero.greeting}</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          {content.hero.title}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {content.hero.subtitle} — {content.summary}
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
