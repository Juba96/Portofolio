import { z } from "zod";

// Single source of truth for everything editable on the portfolio.
// Rendered by the visitor UI (/ and /overview), fed to the AI agent's system
// prompt, and edited from /admin. Shared client+server — no secrets here.

export const projectSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  tag: z.string(), // short label on /overview cards, e.g. "Gamified Trivia · DCB"
  icon: z.string(),
  color: z.string(), // tailwind gradient classes for the switcher pill
  desc: z.string(),
  overviewDesc: z.string(), // denser wording used on /overview + resume
  screens: z.array(z.string()),
  screenInsetTop: z.number().optional(),
  frameIsland: z.boolean().optional(),
});

export const siteContentSchema = z.object({
  hero: z.object({
    greeting: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  summary: z.string(), // paragraph on /overview + AI identity line
  projects: z.array(projectSchema),
  experience: z.array(
    z.object({
      period: z.string(),
      role: z.string(),
      org: z.string(),
      desc: z.string(),
    }),
  ),
  skillCategories: z.array(
    z.object({
      name: z.string(),
      icon: z.string(),
      skills: z.array(z.string()),
    }),
  ),
  overviewSkills: z.array(z.string()), // chips on /overview + resume
  languages: z.array(z.string()),
  funItems: z.array(
    z.object({ title: z.string(), desc: z.string(), icon: z.string() }),
  ),
  education: z.array(z.string()),
  contact: z.object({
    email: z.string(),
    linkedin: z.string(), // full URL
    location: z.string(),
  }),
  // Extra free-form facts only the AI agent sees (metrics, FAQs, context).
  chatFacts: z.string(),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Project = z.infer<typeof projectSchema>;
