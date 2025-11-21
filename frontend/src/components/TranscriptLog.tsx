"use client";

import { TranscriptEvent } from "../lib/api";

interface Props {
  events: TranscriptEvent[];
}

export function TranscriptLog({ events }: Props) {
  if (!events.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
        Snapshot code iterations to build a trail the AI interviewer can score.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((event, index) => (
        <li
          key={`${event.event_type}-${index}-${event.payload.timestamp ?? index}`}
          className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {event.event_type}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {event.payload.code?.slice(0, 160) || "Snapshot saved"}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {event.payload.timestamp}
          </p>
        </li>
      ))}
    </ul>
  );
}
