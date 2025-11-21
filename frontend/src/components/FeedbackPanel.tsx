"use client";

import { InterviewFeedback } from "../lib/api";

interface Props {
  feedback: InterviewFeedback | null;
}

export function FeedbackPanel({ feedback }: Props) {
  if (!feedback) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
        End a session to unlock rubric-driven scoring, detailed notes, and next
        practice steps.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Scorecard preview
      </p>
      <div className="mt-3 flex items-baseline gap-3">
        <p className="text-4xl font-bold text-brand-600">
          {feedback.overall_score.toFixed(1)}
        </p>
        <p className="text-sm text-slate-500">/ 5.0</p>
      </div>
      <p className="mt-2 text-sm text-slate-600">{feedback.summary}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <FeedbackList title="Strengths" items={feedback.strengths} />
        <FeedbackList title="To improve" items={feedback.improvements} />
      </div>

      <div className="mt-4 rounded-2xl bg-brand-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Next steps
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-brand-800">
          {feedback.recommended_next_steps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-slate-50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
