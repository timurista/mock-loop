import { AppLayout } from "../../components/AppLayout";

export default function CoachReview() {
  return (
    <AppLayout>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-600">
          Coach Review
        </p>
        <h1 className="mt-3 text-2xl lg:text-3xl font-semibold text-slate-900">
          Human boost
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Get personalized feedback from experienced tech industry
          professionals.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Professional Coaching
        </h2>
        <p className="text-slate-600 mb-6">
          Supplement your AI practice with human expertise and personalized
          guidance.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">1-on-1 Review</h3>
            <p className="text-sm text-slate-600 mb-4">
              Personal session with senior engineer to review your interview
              performance
            </p>
            <div className="text-sm text-slate-500">
              <div>• 45min session</div>
              <div>• Code review</div>
              <div>• Behavioral feedback</div>
              <div>• Practice plan</div>
            </div>
            <button className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
              Book Session - $149
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              Mock Interview
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Full mock interview conducted by experienced interviewer
            </p>
            <div className="text-sm text-slate-500">
              <div>• 60min live session</div>
              <div>• Real interview experience</div>
              <div>• Instant feedback</div>
              <div>• Detailed scorecard</div>
            </div>
            <button className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
              Schedule - $199
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
