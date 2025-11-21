"use client";

import { InterviewPrompt } from "../lib/api";

interface Props {
  prompts: InterviewPrompt[];
}

export function PromptPanel({ prompts }: Props) {
  if (!prompts.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        Start a session to load coding + behavioral prompts tuned to the
        company bar. They will appear here with suggested pacing.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {prompts.map((prompt) => (
        <article
          key={prompt.id}
          className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            {prompt.type}
          </p>
          <h3 className="text-base font-semibold text-slate-900">
            {prompt.title}
          </h3>
          <p className="text-sm text-slate-600">{prompt.body}</p>
          <p className="mt-2 text-xs text-slate-400">
            Suggested: {prompt.expected_duration} min
          </p>
        </article>
      ))}
    </div>
  );
}
