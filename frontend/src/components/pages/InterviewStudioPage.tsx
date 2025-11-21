"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "../AppLayout";
import { createInterviewSession } from "../../lib/api";

export function InterviewStudioPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"quick" | "series">("quick");
  const [quickConfig, setQuickConfig] = useState({
    experienceLevel: "Mid-level",
    role: "Backend Engineer",
    company: "Generic Tech Company",
    difficulty: "Medium",
    duration: "45 minutes",
  });

  const handleQuickStart = async () => {
    try {
      // Create new session with configuration
      const session = await createInterviewSession({
        level: quickConfig.experienceLevel,
        role: quickConfig.role,
        company: quickConfig.company,
        difficulty: quickConfig.difficulty,
      });

      // Navigate to the session
      router.push(`/interview-room/${session.session_id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      // Fall back to basic navigation
      const params = new URLSearchParams({
        level: quickConfig.experienceLevel,
        role: quickConfig.role,
        company: quickConfig.company,
        difficulty: quickConfig.difficulty,
      });
      router.push(`/interview-room?${params.toString()}`);
    }
  };

  const rightSidebar = (
    <div className="text-sm text-slate-600">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2">
        Studio Tools
      </p>
      <p>
        Compose custom interview experiences with AI-powered problems and
        feedback.
      </p>
    </div>
  );

  return (
    <AppLayout rightSidebar={rightSidebar}>
      {/* Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-2 w-2 rounded-full bg-brand-500"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Interview Studio
          </p>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-dark-800 leading-tight mb-4">
          Compose Your Interview Experience
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl">
          Create custom interview sessions with tailored problems, specific
          company styles, and structured practice series. Perfect for targeted
          preparation.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white rounded-xl border border-neutral-200 p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("quick")}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
            activeTab === "quick"
              ? "bg-brand-100 text-brand-800"
              : "text-neutral-600 hover:text-neutral-800"
          }`}
        >
          🚀 Quick Practice
        </button>
        <button
          onClick={() => setActiveTab("series")}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
            activeTab === "series"
              ? "bg-brand-100 text-brand-800"
              : "text-neutral-600 hover:text-neutral-800"
          }`}
        >
          📚 Practice Series
        </button>
      </div>

      {/* Quick Practice Tab */}
      {activeTab === "quick" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-dark-800 mb-6">
              Configure Interview
            </h2>

            <div className="space-y-4">
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-2">
                  Experience Level
                </label>
                <select
                  value={quickConfig.experienceLevel}
                  onChange={(e) =>
                    setQuickConfig({
                      ...quickConfig,
                      experienceLevel: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>Junior (0-2 years)</option>
                  <option>Mid-level (3-5 years)</option>
                  <option>Senior (5+ years)</option>
                  <option>Staff/Principal (8+ years)</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-2">
                  Role Focus
                </label>
                <select
                  value={quickConfig.role}
                  onChange={(e) =>
                    setQuickConfig({ ...quickConfig, role: e.target.value })
                  }
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>Backend Engineer</option>
                  <option>Frontend Engineer</option>
                  <option>Full Stack Engineer</option>
                  <option>Data Engineer</option>
                  <option>DevOps Engineer</option>
                  <option>Mobile Engineer</option>
                </select>
              </div>

              {/* Company Style */}
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-2">
                  Company Style
                </label>
                <select
                  value={quickConfig.company}
                  onChange={(e) =>
                    setQuickConfig({ ...quickConfig, company: e.target.value })
                  }
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>Generic Tech Company</option>
                  <option>FAANG (Meta, Google, etc.)</option>
                  <option>Startup (Fast-paced)</option>
                  <option>Enterprise (Traditional)</option>
                  <option>Finance/Trading</option>
                </select>
              </div>

              {/* Difficulty & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-800 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={quickConfig.difficulty}
                    onChange={(e) =>
                      setQuickConfig({
                        ...quickConfig,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-800 mb-2">
                    Duration
                  </label>
                  <select
                    value={quickConfig.duration}
                    onChange={(e) =>
                      setQuickConfig({
                        ...quickConfig,
                        duration: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleQuickStart}
              className="w-full mt-6 px-6 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors font-semibold text-lg"
            >
              🚀 Start Interview
            </button>
          </div>

          {/* Preview Panel */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-dark-800 mb-6">
              Interview Preview
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-brand-50 rounded-lg">
                <h3 className="font-medium text-brand-800 mb-2">
                  Interview Format
                </h3>
                <p className="text-sm text-brand-700">
                  {quickConfig.duration} • {quickConfig.difficulty} difficulty
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h3 className="font-medium text-dark-800 mb-2">
                  Company Context
                </h3>
                <p className="text-sm text-neutral-700">
                  Interview style tailored for{" "}
                  <strong>{quickConfig.company}</strong> with
                  <strong> {quickConfig.role}</strong> focus at the{" "}
                  <strong>{quickConfig.experienceLevel}</strong> level.
                </p>
              </div>

              <div className="p-4 bg-success-50 rounded-lg">
                <h3 className="font-medium text-success-800 mb-2">
                  What to Expect
                </h3>
                <ul className="text-sm text-success-700 space-y-1">
                  <li>• 1-2 coding problems</li>
                  <li>• Real-time AI feedback</li>
                  <li>• Behavioral follow-up questions</li>
                  <li>• Performance scorecard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Series Tab */}
      {activeTab === "series" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold text-dark-800 mb-4">
              Practice Series
            </h2>
            <p className="text-neutral-600 mb-8">
              Create structured interview preparation series with progressive
              difficulty, topic focus, and performance tracking. Perfect for
              systematic preparation over time.
            </p>
            <div className="bg-brand-50 p-6 rounded-xl">
              <p className="text-brand-800 font-medium">Coming Soon</p>
              <p className="text-sm text-brand-700 mt-2">
                Multi-session interview series with progress tracking and
                adaptive difficulty.
              </p>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
