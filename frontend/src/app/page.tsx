"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard on app load
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white text-lg font-bold mx-auto mb-4">
          ML
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">MockLoop</h1>
        <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
