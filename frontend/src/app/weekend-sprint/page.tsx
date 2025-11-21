import { AppLayout } from "../../components/AppLayout";

export default function WeekendSprint() {
  return (
    <AppLayout>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-600">
          Weekend Sprint
        </p>
        <h1 className="mt-3 text-2xl lg:text-3xl font-semibold text-slate-900">
          3 mock loop blitz
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Intensive weekend preparation with multiple mock interviews and
          focused practice.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Weekend Prep Package
        </h2>
        <p className="text-slate-600 mb-6">
          Intensive 3-day preparation program designed to maximize your
          interview readiness.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              4 Mock Interviews
            </h3>
            <p className="text-sm text-slate-600">
              Full-length technical and behavioral rounds
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Resume Review</h3>
            <p className="text-sm text-slate-600">
              Professional feedback and optimization
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Action Plan</h3>
            <p className="text-sm text-slate-600">
              Personalized practice roadmap
            </p>
          </div>
        </div>

        <button className="mt-6 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
          Hold a Slot - $299
        </button>
      </div>
    </AppLayout>
  );
}
