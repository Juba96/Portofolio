import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "../components/client-only";
import { PortfolioApp } from "../components/portfolio-app";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-dvh w-full overflow-hidden">
      <ClientOnly>
        <PortfolioApp />
      </ClientOnly>
    </div>
  );
}
