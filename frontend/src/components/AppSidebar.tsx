"use client";

const sections = [
  { label: "Dashboard", hint: "Progress + streak" },
  { label: "Interview Studio", hint: "Live coding room" },
  { label: "Scorecards", hint: "Feedback archive" },
  { label: "Weekend Sprint", hint: "3-loop blitz" },
  { label: "Coach Review", hint: "Human boost" },
];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isOpen, onToggle }: Props) {
  return (
    <aside
      className={`fixed left-4 top-28 z-30 hidden transition-all duration-300 xl:block ${
        isOpen ? "w-64 translate-x-0 opacity-100" : "w-12 -translate-x-2 opacity-80"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-4 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-500 shadow"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? "«" : "»"}
      </button>
      <nav
        className={`h-[calc(100vh-8rem)] rounded-3xl border border-slate-200 bg-white/95 p-4 text-sm shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/80 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Sections
        </p>
        <ul className="mt-3 space-y-2">
          {sections.map((section) => (
            <li
              key={section.label}
              className="rounded-2xl border border-transparent px-3 py-2 transition hover:border-brand-200 hover:bg-brand-50"
            >
              <p className="font-semibold text-slate-900">{section.label}</p>
              <p className="text-xs text-slate-500">{section.hint}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
          Auth tokens from Next.js will anchor here; proxy cookies to FastAPI once
          OAuth wiring is in.
        </div>
      </nav>
    </aside>
  );
}
