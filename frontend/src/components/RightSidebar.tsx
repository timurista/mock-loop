"use client";

import { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", description: "Progress & streaks" },
  { label: "Interview Studio", description: "AI-assisted room" },
  { label: "Scorecards", description: "LLM + rubric grading" },
  { label: "Weekend Sprint", description: "3 mock loop blitz" },
  { label: "Coach Upsell", description: "Add human reviewer" },
];

interface UpcomingSession {
  company: string;
  focus: string;
  day: string;
}

const upcoming: UpcomingSession[] = [
  { company: "Amazon SDE2", focus: "Systems follow-up", day: "Thu" },
  { company: "Netflix Platform", focus: "Behavioral deep dive", day: "Sat" },
];

export function RightSidebar({ children }: { children?: ReactNode }) {
  return (
    <aside className="flex h-fit max-h-screen flex-col space-y-8 overflow-y-auto">
      {/* MockLoop OS Section */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-lg p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-5">
          MockLoop OS
        </p>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button className="w-full rounded-xl border border-transparent px-4 py-3 text-left transition-all hover:border-brand-200 hover:bg-brand-50 hover:shadow-sm">
                <p className="text-sm font-semibold text-dark-800">
                  {item.label}
                </p>
                <p className="text-xs text-neutral-500">{item.description}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Upcoming Mocks Section */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-lg p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-5">
          Upcoming mocks
        </p>
        <div className="space-y-3">
          {upcoming.map((item) => (
            <div
              key={`${item.company}-${item.day}`}
              className="rounded-xl border border-neutral-100 bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-semibold text-dark-800">
                {item.company}
              </p>
              <p className="text-xs text-neutral-600 mt-1">{item.focus}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">
                  {item.day}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Children Section */}
      {children && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-lg p-6">
          {children}
        </div>
      )}

      {/* Weekend Prep Package */}
      <div className="rounded-2xl border border-warning-200 bg-gradient-to-br from-warning-50 to-warning-100 p-6 text-center shadow-lg">
        <p className="text-sm font-bold text-warning-800">
          Weekend Prep Package
        </p>
        <p className="text-xs text-warning-700 mt-2">
          4 mocks + resume teardown + action plan.
        </p>
        <button className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-warning-500 to-warning-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-warning-600 hover:to-warning-700 hover:shadow-lg">
          Hold a Slot
        </button>
      </div>
    </aside>
  );
}
