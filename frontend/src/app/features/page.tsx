"use client";

import { TopNav } from "../../components/TopNav";

const features = [
  {
    title: "Interview Studio",
    body:
      "Pair a Python-ready coding pad with an AI interviewer persona tuned to FAANG bars, streaming prompts and nudges in real time.",
    badge: "Live room",
  },
  {
    title: "Scorecards",
    body:
      "LLM + rubric scoring across correctness, communication, and systems depth. Timeline annotations tie back to each snapshot.",
    badge: "Feedback",
  },
  {
    title: "Weekend Sprint",
    body:
      "Book 3–4 mock loops plus a behavioral teardown over a single weekend, perfect before onsite finals.",
    badge: "Premium",
  },
  {
    title: "Coach Upsells",
    body:
      "Route standout sessions to human reviewers for an additional layer of critique and hiring-bar calibration.",
    badge: "Add-on",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <main className="mx-auto max-w-5xl space-y-10 px-4 py-12 lg:py-16">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">
            Product Features
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Designed for backend engineers prepping on tight timelines.
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            MockLoop blends an AI interviewer, coding telemetry, and a premium human coaching layer
            so every practice run feels like a production interview loop.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
            >
              <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {feature.badge}
              </span>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{feature.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">What&apos;s next?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Resume uploads, company-style prompt tuning, and audio interviews are on deck. The FastAPI
            backend already exposes interview + scoring endpoints so the UI can stay static or be
            deployed via Next.js Edge functions.
          </p>
        </section>
      </main>
    </div>
  );
}
