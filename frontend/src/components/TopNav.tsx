"use client";

import Link from "next/link";

export function TopNav() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-base font-semibold text-brand-700">
            ML
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">MockLoop</p>
            <p className="text-xs text-slate-500">Interview OS for backend prep</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 px-4 py-2 transition hover:border-brand-300 hover:text-brand-600"
          >
            Product
          </Link>
          <Link
            href="/features"
            className="rounded-xl border border-slate-200 px-4 py-2 transition hover:border-brand-300 hover:text-brand-600"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="rounded-xl border border-slate-200 px-4 py-2 transition hover:border-brand-300 hover:text-brand-600"
          >
            Pricing
          </Link>
          <button className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
