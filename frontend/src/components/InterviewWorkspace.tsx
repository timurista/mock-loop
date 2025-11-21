"use client";

import { InterviewSession, TranscriptEvent } from "../lib/api";

interface Props {
  session: InterviewSession | null;
  codeDraft: string;
  setCodeDraft: (value: string) => void;
  transcript: TranscriptEvent[];
  onSnapshot: () => void;
  onEnd: () => Promise<void>;
  disabled?: boolean;
}

export function InterviewWorkspace({
  session,
  codeDraft,
  setCodeDraft,
  transcript,
  onSnapshot,
  onEnd,
  disabled,
}: Props) {
  const headerLabel = session
    ? `${session.request.target_company} • ${session.request.experience_level}`
    : "Studio idle";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Interview room
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            {headerLabel}
          </h2>
          <p className="text-sm text-slate-500">
            {session
              ? "Capture snapshots as you iterate. End the interview when ready to generate feedback."
              : "Kick off a session to unlock the LLM interviewer and code capture stream."}
          </p>
        </div>
        <button
          className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-brand-400 hover:text-brand-600 disabled:opacity-50"
          onClick={() => onEnd()}
          disabled={!session || disabled}
        >
          End interview
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[2fr_minmax(200px,1fr)]">
        <div className="rounded-2xl border border-slate-100 bg-slate-900/95">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-300">
            <span>Coding pad • Python</span>
            <span>{`Snapshots: ${transcript.length}`}</span>
          </div>
          <textarea
            value={codeDraft}
            onChange={(event) => setCodeDraft(event.target.value)}
            className="h-64 w-full rounded-b-2xl border-0 bg-transparent px-4 py-3 font-mono text-sm text-slate-50 focus:outline-none"
            placeholder="# Sketch your solution..."
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Interviewer feed
          </p>
          <p className="mt-2 flex-1 text-sm text-slate-600">
            {session
              ? "Interviewer monitors your snapshots and asks follow-up questions. Narrate approach before sharing final code."
              : "When a session is live, this panel mirrors the interviewer persona and next nudges."}
          </p>
          <button
            type="button"
            onClick={onSnapshot}
            disabled={!session}
            className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
          >
            Log snapshot
          </button>
        </div>
      </div>
    </section>
  );
}
