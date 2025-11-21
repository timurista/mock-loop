import { AppLayout } from "../../components/AppLayout";

export default function Scorecards() {
  return (
    <AppLayout>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-600">
          Scorecards
        </p>
        <h1 className="mt-3 text-2xl lg:text-3xl font-semibold text-slate-900">
          LLM + rubric grading
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review your past interview performance with detailed feedback and
          scoring.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Coming Soon
        </h2>
        <p className="text-slate-600">
          Access detailed scorecards from your past interviews, track
          improvements, and identify areas for focused practice.
        </p>
      </div>
    </AppLayout>
  );
}
