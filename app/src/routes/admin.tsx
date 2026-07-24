import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { SiteContent } from "@/content/schema";
import { adminLogin, adminLogout, adminSession } from "@/lib/api/admin-auth.functions";
import {
  adminGetContent,
  adminListChatLogs,
  adminListLeads,
  adminListRevisions,
  adminRestoreRevision,
  adminSaveContent,
  adminSetLeadStatus,
  adminStats,
} from "@/lib/api/admin.functions";

// Private dashboard: funnel stats, leads + follow-up status, AI-chat
// transcripts, and the live content editor. Auth = httpOnly session cookie
// set by adminLogin; every server fn re-verifies it. Not linked anywhere,
// noindexed, and worthless without the cookie.

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Dashboard" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

type Lead = Awaited<ReturnType<typeof adminListLeads>>[number];
type ChatLog = Awaited<ReturnType<typeof adminListChatLogs>>[number];
type Stats = Awaited<ReturnType<typeof adminStats>>;
type Revision = Awaited<ReturnType<typeof adminListRevisions>>[number];

const glassCard =
  "bg-white rounded-2xl p-5 border border-black/10 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]";
const fieldCls =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-black/30 transition-colors";
const labelCls = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1";

function AdminPage() {
  const [phase, setPhase] = useState<"loading" | "login" | "app">("loading");

  useEffect(() => {
    adminSession()
      .then((s) => setPhase(s.authed ? "app" : "login"))
      .catch(() => setPhase("login"));
  }, []);

  if (phase === "loading") {
    return <div className="h-dvh w-full overflow-y-auto bg-white" />;
  }
  return (
    <div className="h-dvh w-full overflow-y-auto bg-white text-black">
      <div className="mx-auto max-w-4xl px-5 py-8 md:py-10">
        {phase === "login" ? (
          <LoginCard onSuccess={() => setPhase("app")} />
        ) : (
          <Dashboard onLogout={() => setPhase("login")} />
        )}
      </div>
    </div>
  );
}

function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("checking");
    try {
      const res = await adminLogin({ data: { password } });
      if (res.ok) onSuccess();
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-[70dvh] flex items-center justify-center">
      <form onSubmit={submit} className={`${glassCard} w-full max-w-sm`}>
        <h1 className="text-lg font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-xs text-gray-500 mb-4">Private area — password required.</p>
        <input
          type="password"
          className={fieldCls}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={state === "checking" || !password}
          className="mt-3 w-full py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {state === "checking" ? "Checking…" : "Enter"}
        </button>
        {state === "error" && (
          <p className="mt-2 text-xs text-red-500">Wrong password (attempts are limited).</p>
        )}
      </form>
    </div>
  );
}

type Tab = "overview" | "leads" | "chats" | "content";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");

  const logout = async () => {
    await adminLogout().catch(() => {});
    onLogout();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold tracking-tight">Portfolio dashboard</h1>
        <button
          onClick={logout}
          className="text-[12px] text-gray-500 hover:text-gray-800 transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            ["overview", "Overview"],
            ["leads", "Leads"],
            ["chats", "Chats"],
            ["content", "Content"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === id
                ? "bg-black text-white"
                : "liquid-glass text-gray-700 hover:text-black"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "leads" && <LeadsTab />}
      {tab === "chats" && <ChatsTab />}
      {tab === "content" && <ContentTab />}
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    adminStats().then(setStats).catch(console.error);
  }, []);

  const leadTotal = stats ? Object.values(stats.leads).reduce((a, b) => a + b, 0) : 0;
  const cards = [
    { label: "New leads", value: stats?.leads["new"] ?? 0 },
    { label: "Total leads", value: leadTotal },
    { label: "Chats today", value: stats?.chats.day ?? 0 },
    { label: "Chats (7 days)", value: stats?.chats.week ?? 0 },
    { label: "Chats total", value: stats?.chats.total ?? 0 },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={glassCard}>
            <p className="text-2xl font-black tracking-tight">{stats ? c.value : "–"}</p>
            <p className="text-[11px] text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-gray-500 mt-4">
        Traffic analytics (visitors, sources, pages) live in{" "}
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-gray-800"
        >
          Google Analytics
        </a>
        .
      </p>
    </div>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[] | null>(null);

  useEffect(() => {
    adminListLeads().then(setLeads).catch(console.error);
  }, []);

  const setStatus = async (id: number, status: "new" | "contacted" | "closed") => {
    setLeads((prev) => prev?.map((l) => (l.id === id ? { ...l, status } : l)) ?? null);
    await adminSetLeadStatus({ data: { id, status } }).catch(console.error);
  };

  if (!leads) return <p className="text-sm text-gray-500">Loading…</p>;
  if (leads.length === 0)
    return <p className="text-sm text-gray-500">No leads yet — they'll appear here.</p>;

  return (
    <div className="space-y-3">
      {leads.map((l) => (
        <div key={l.id} className={glassCard}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="font-bold text-sm">{l.name}</span>{" "}
              <a href={`mailto:${l.email}`} className="text-blue-500 text-sm hover:underline">
                {l.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${
                  l.source === "chat" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                {l.source === "chat" ? "AI chat" : "Form"}
              </span>
              {l.autoRepliedAt && (
                <span className="px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                  auto-replied ✓
                </span>
              )}
              <span>{new Date(l.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <p className="text-[13px] text-gray-600 leading-relaxed mt-2 whitespace-pre-line">
            {l.message}
          </p>
          <div className="flex gap-1.5 mt-3">
            {(["new", "contacted", "closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(l.id, s)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  l.status === s
                    ? s === "new"
                      ? "bg-amber-500 text-white"
                      : s === "contacted"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatsTab() {
  const [logs, setLogs] = useState<ChatLog[] | null>(null);
  useEffect(() => {
    adminListChatLogs().then(setLogs).catch(console.error);
  }, []);

  if (!logs) return <p className="text-sm text-gray-500">Loading…</p>;
  if (logs.length === 0)
    return <p className="text-sm text-gray-500">No chat conversations logged yet.</p>;

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className={glassCard}>
          <div className="flex items-center justify-between mb-2 text-[11px] text-gray-400">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 font-medium text-gray-600">
              {log.provider}
            </span>
            <span>{new Date(log.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-[13px] font-semibold text-gray-800 whitespace-pre-line">
            {log.question}
          </p>
          <p className="text-[13px] text-gray-600 leading-relaxed mt-1.5 whitespace-pre-line">
            {log.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

function ContentTab() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const load = () => {
    adminGetContent().then(setContent).catch(console.error);
    adminListRevisions().then(setRevisions).catch(console.error);
  };
  useEffect(load, []);

  if (!content) return <p className="text-sm text-gray-500">Loading…</p>;

  const set = (patch: Partial<SiteContent>) => {
    setContent({ ...content, ...patch });
    setState("idle");
  };

  const save = async () => {
    setState("saving");
    try {
      const res = await adminSaveContent({ data: content });
      setState(res.ok ? "saved" : "error");
      adminListRevisions().then(setRevisions).catch(() => {});
    } catch {
      setState("error");
    }
  };

  const restore = async (id: number) => {
    await adminRestoreRevision({ data: { id } }).catch(console.error);
    load();
    setState("idle");
  };

  // Line-based editors for simple string lists.
  const linesToArray = (v: string) =>
    v.split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Hero */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-3">Hero</h2>
        <div className="space-y-2.5">
          <div>
            <label className={labelCls}>Greeting</label>
            <input
              className={fieldCls}
              value={content.hero.greeting}
              onChange={(e) => set({ hero: { ...content.hero, greeting: e.target.value } })}
            />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input
              className={fieldCls}
              value={content.hero.title}
              onChange={(e) => set({ hero: { ...content.hero, title: e.target.value } })}
            />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input
              className={fieldCls}
              value={content.hero.subtitle}
              onChange={(e) => set({ hero: { ...content.hero, subtitle: e.target.value } })}
            />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-3">Summary (overview page + AI)</h2>
        <textarea
          className={`${fieldCls} resize-y`}
          rows={3}
          value={content.summary}
          onChange={(e) => set({ summary: e.target.value })}
        />
      </section>

      {/* Experience */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-3">Experience</h2>
        <div className="space-y-4">
          {content.experience.map((exp, i) => (
            <div key={i} className="rounded-xl border border-black/5 p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className={fieldCls}
                  placeholder="Period"
                  value={exp.period}
                  onChange={(e) => {
                    const experience = [...content.experience];
                    experience[i] = { ...exp, period: e.target.value };
                    set({ experience });
                  }}
                />
                <input
                  className={fieldCls}
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => {
                    const experience = [...content.experience];
                    experience[i] = { ...exp, role: e.target.value };
                    set({ experience });
                  }}
                />
                <input
                  className={fieldCls}
                  placeholder="Organization"
                  value={exp.org}
                  onChange={(e) => {
                    const experience = [...content.experience];
                    experience[i] = { ...exp, org: e.target.value };
                    set({ experience });
                  }}
                />
              </div>
              <textarea
                className={`${fieldCls} resize-y`}
                rows={2}
                placeholder="Description"
                value={exp.desc}
                onChange={(e) => {
                  const experience = [...content.experience];
                  experience[i] = { ...exp, desc: e.target.value };
                  set({ experience });
                }}
              />
              <button
                onClick={() => set({ experience: content.experience.filter((_, j) => j !== i) })}
                className="text-[11px] text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              set({
                experience: [...content.experience, { period: "", role: "", org: "", desc: "" }],
              })
            }
            className="text-[12px] font-medium text-gray-600 hover:text-black"
          >
            + Add experience
          </button>
        </div>
      </section>

      {/* Projects */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-1">Projects</h2>
        <p className="text-[11px] text-gray-400 mb-3">
          Screens/images are managed in code — text fields are editable here.
        </p>
        <div className="space-y-4">
          {content.projects.map((p, i) => (
            <div key={i} className="rounded-xl border border-black/5 p-3 space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <input
                  className={fieldCls}
                  placeholder="Title"
                  value={p.title}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[i] = { ...p, title: e.target.value };
                    set({ projects });
                  }}
                />
                <input
                  className={fieldCls}
                  placeholder="Subtitle"
                  value={p.subtitle}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[i] = { ...p, subtitle: e.target.value };
                    set({ projects });
                  }}
                />
                <input
                  className={fieldCls}
                  placeholder="Tag (overview)"
                  value={p.tag}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[i] = { ...p, tag: e.target.value };
                    set({ projects });
                  }}
                />
                <input
                  className={fieldCls}
                  placeholder="Icon (emoji)"
                  value={p.icon}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[i] = { ...p, icon: e.target.value };
                    set({ projects });
                  }}
                />
              </div>
              <textarea
                className={`${fieldCls} resize-y`}
                rows={2}
                placeholder="Description (interactive app)"
                value={p.desc}
                onChange={(e) => {
                  const projects = [...content.projects];
                  projects[i] = { ...p, desc: e.target.value };
                  set({ projects });
                }}
              />
              <textarea
                className={`${fieldCls} resize-y`}
                rows={2}
                placeholder="Description (overview + resume)"
                value={p.overviewDesc}
                onChange={(e) => {
                  const projects = [...content.projects];
                  projects[i] = { ...p, overviewDesc: e.target.value };
                  set({ projects });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-3">Skills</h2>
        <div className="space-y-3">
          {content.skillCategories.map((cat, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2">
              <input
                className={fieldCls}
                value={`${cat.icon} ${cat.name}`}
                onChange={(e) => {
                  const [icon, ...rest] = e.target.value.split(" ");
                  const skillCategories = [...content.skillCategories];
                  skillCategories[i] = { ...cat, icon, name: rest.join(" ") };
                  set({ skillCategories });
                }}
              />
              <input
                className={fieldCls}
                value={cat.skills.join(", ")}
                onChange={(e) => {
                  const skillCategories = [...content.skillCategories];
                  skillCategories[i] = {
                    ...cat,
                    skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  };
                  set({ skillCategories });
                }}
              />
            </div>
          ))}
          <div>
            <label className={labelCls}>Overview page skill chips (one per line)</label>
            <textarea
              className={`${fieldCls} resize-y`}
              rows={4}
              value={content.overviewSkills.join("\n")}
              onChange={(e) => set({ overviewSkills: linesToArray(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls}>Languages (one per line)</label>
            <textarea
              className={`${fieldCls} resize-y`}
              rows={2}
              value={content.languages.join("\n")}
              onChange={(e) => set({ languages: linesToArray(e.target.value) })}
            />
          </div>
        </div>
      </section>

      {/* Education + Fun */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-3">Education & certifications (one per line)</h2>
        <textarea
          className={`${fieldCls} resize-y`}
          rows={4}
          value={content.education.join("\n")}
          onChange={(e) => set({ education: linesToArray(e.target.value) })}
        />
        <h2 className="text-sm font-bold mt-4 mb-3">Fun cards</h2>
        <div className="space-y-2">
          {content.funItems.map((f, i) => (
            <div key={i} className="grid grid-cols-[60px_1fr_2fr] gap-2">
              <input
                className={fieldCls}
                value={f.icon}
                onChange={(e) => {
                  const funItems = [...content.funItems];
                  funItems[i] = { ...f, icon: e.target.value };
                  set({ funItems });
                }}
              />
              <input
                className={fieldCls}
                value={f.title}
                onChange={(e) => {
                  const funItems = [...content.funItems];
                  funItems[i] = { ...f, title: e.target.value };
                  set({ funItems });
                }}
              />
              <input
                className={fieldCls}
                value={f.desc}
                onChange={(e) => {
                  const funItems = [...content.funItems];
                  funItems[i] = { ...f, desc: e.target.value };
                  set({ funItems });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Contact + AI facts */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-3">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className={labelCls}>Email</label>
            <input
              className={fieldCls}
              value={content.contact.email}
              onChange={(e) => set({ contact: { ...content.contact, email: e.target.value } })}
            />
          </div>
          <div>
            <label className={labelCls}>LinkedIn URL</label>
            <input
              className={fieldCls}
              value={content.contact.linkedin}
              onChange={(e) => set({ contact: { ...content.contact, linkedin: e.target.value } })}
            />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input
              className={fieldCls}
              value={content.contact.location}
              onChange={(e) => set({ contact: { ...content.contact, location: e.target.value } })}
            />
          </div>
        </div>
        <h2 className="text-sm font-bold mt-4 mb-2">Extra facts for the AI agent</h2>
        <p className="text-[11px] text-gray-400 mb-2">
          Only the chatbot sees this — metrics, FAQs, anything it should know.
        </p>
        <textarea
          className={`${fieldCls} resize-y`}
          rows={4}
          value={content.chatFacts}
          onChange={(e) => set({ chatFacts: e.target.value })}
        />
      </section>

      {/* CRM auto-reply */}
      <section className={glassCard}>
        <h2 className="text-sm font-bold mb-1">Lead auto-reply email</h2>
        <p className="text-[11px] text-gray-400 mb-3">
          Sent once to every new lead (chat or form). Requires RESEND_API_KEY in Railway —
          without it, nothing is sent regardless of this toggle. Use {"{{name}}"} for the
          lead's name.
        </p>
        <label className="flex items-center gap-2 mb-3 text-sm font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={content.crm.autoReplyEnabled}
            onChange={(e) => set({ crm: { ...content.crm, autoReplyEnabled: e.target.checked } })}
            className="w-4 h-4 accent-black"
          />
          Auto-reply enabled
        </label>
        <div className="space-y-2.5">
          <div>
            <label className={labelCls}>Subject</label>
            <input
              className={fieldCls}
              value={content.crm.autoReplySubject}
              onChange={(e) => set({ crm: { ...content.crm, autoReplySubject: e.target.value } })}
            />
          </div>
          <div>
            <label className={labelCls}>Body (plain text)</label>
            <textarea
              className={`${fieldCls} resize-y`}
              rows={7}
              value={content.crm.autoReplyBody}
              onChange={(e) => set({ crm: { ...content.crm, autoReplyBody: e.target.value } })}
            />
          </div>
        </div>
      </section>

      {/* Save bar */}
      <div className="sticky bottom-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={state === "saving"}
          className="px-6 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-lg"
        >
          {state === "saving" ? "Saving…" : state === "saved" ? "Saved ✓ (live now)" : "Save changes"}
        </button>
        {state === "error" && <span className="text-xs text-red-500">Save failed — try again.</span>}
      </div>

      {/* Revisions */}
      {revisions.length > 0 && (
        <section className={glassCard}>
          <h2 className="text-sm font-bold mb-3">Revision history</h2>
          <div className="space-y-1.5">
            {revisions.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-[12px]">
                <span className="text-gray-500">{new Date(r.savedAt).toLocaleString()}</span>
                <button
                  onClick={() => restore(r.id)}
                  className="text-blue-500 hover:underline"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
