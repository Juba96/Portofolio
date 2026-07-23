import { createServerFn } from "@tanstack/react-start";

import { getSiteContent } from "./content.server";

// Public read used as the route loader for / and /overview — SSR'd and
// serialized to the client, so the whole visitor UI renders from one document.
export const fetchSiteContent = createServerFn({ method: "GET" }).handler(() =>
  getSiteContent(),
);
