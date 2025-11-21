"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppLayout } from "../AppLayout";
import {
  getActiveInterviews,
  createInterviewSession,
  deleteSession,
  InterviewSession,
} from "../../lib/api";

export function DashboardPage() {
  const router = useRouter();
  const [activeInterviews, setActiveInterviews] = useState<InterviewSession[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [config, setConfig] = useState({
    experienceLevel: "Mid-level",
    role: "Backend Engineer",
    company: "Generic Tech Company",
    difficulty: "Medium",
  });

  // Load active interviews
  useEffect(() => {
    const loadActiveInterviews = async () => {
      try {
        const interviews = await getActiveInterviews();
        setActiveInterviews(interviews);
      } catch (error) {
        console.error("Failed to load active interviews:", error);
        // Mock data for development
        setActiveInterviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveInterviews();
  }, []);

  const handleStartInterview = () => {
    setShowConfiguration(true);
  };

  const handleStartWithConfig = async () => {
    try {
      // Create new session with configuration
      const session = await createInterviewSession({
        level: config.experienceLevel,
        role: config.role,
        company: config.company,
        difficulty: config.difficulty,
      });

      // Navigate to the session
      router.push(`/interview-room/${session.session_id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      // Fall back to basic navigation
      const params = new URLSearchParams({
        level: config.experienceLevel,
        role: config.role,
        company: config.company,
        difficulty: config.difficulty,
      });
      router.push(`/interview-room?${params.toString()}`);
    }
  };

  const handleResumeInterview = (sessionId: string) => {
    router.push(`/interview-room/${sessionId}`);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this interview session? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteSession(sessionId);
      // Remove from local state
      setActiveInterviews((prev) =>
        prev.filter((interview) => interview.session_id !== sessionId)
      );
      console.log("Session deleted successfully");
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert("Failed to delete session. Please try again.");
    }
  };

  const rightSidebar = (
    <div className="text-sm text-slate-600">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2">
        Ready to Practice
      </p>
      <p>
        MockLoop pairs a coding pad with an interviewer persona tailored to the
        company bar.
      </p>
    </div>
  );

  return (
    <AppLayout rightSidebar={rightSidebar}>
      {/* Hero Section */}
      <header className="rounded-2xl border border-neutral-200 bg-white p-6 lg:p-10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            MockLoop Interview Platform
          </p>
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold text-dark-800 leading-tight mb-6">
          Practice Technical Interviews
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-3xl">
          MockLoop pairs a coding pad with an interviewer persona tailored to
          the company bar. Start with one coding prompt and a behavioral follow
          up.
        </p>

        {/* Start Interview Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStartInterview}
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-xl">🚀</span>
            Start Mock Interview Now
          </button>
        </div>
      </header>

      {/* Active Interviews Section */}
      {!isLoading && activeInterviews.length > 0 && (
        <div className="rounded-2xl border border-warning-200 bg-warning-50 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-warning-500 animate-pulse"></div>
            <h2 className="text-lg font-bold text-dark-800">
              Active Interviews
            </h2>
          </div>
          <p className="text-sm text-warning-700 mb-4">
            You have {activeInterviews.length} interview session
            {activeInterviews.length !== 1 ? "s" : ""} in progress. Click to
            resume where you left off.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {activeInterviews.map((interview) => (
              <div
                key={interview.session_id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-warning-200 hover:shadow-md transition-all"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleResumeInterview(interview.session_id)}
                >
                  <p className="font-medium text-dark-800">
                    {/* Show the meaningful part after 'isession-' */}
                    Session{" "}
                    {interview.session_id
                      .replace("isession-", "")
                      .toUpperCase()}
                  </p>
                  <p className="text-xs text-neutral-600">
                    Started {new Date(interview.started_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {interview.config?.role} • {interview.config?.company}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResumeInterview(interview.session_id)}
                    className="text-brand-600 hover:text-brand-700 font-medium text-sm px-3 py-1 rounded hover:bg-brand-50 transition-colors"
                  >
                    Resume →
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(interview.session_id);
                    }}
                    className="text-red-600 hover:text-red-700 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete session"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <FeatureCard
          icon="💻"
          title="Coding Environment"
          description="Full-featured code editor with syntax highlighting and code execution"
        />
        <FeatureCard
          icon="🎯"
          title="Company-Specific"
          description="Interview questions tailored to specific companies and difficulty levels"
        />
        <FeatureCard
          icon="📝"
          title="Real-Time Feedback"
          description="Get instant feedback as you code and speak during the interview"
        />
      </div>

      {/* Interview Configuration Modal */}
      {showConfiguration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <span className="text-brand-600 text-xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-dark-800">
                Configure Interview
              </h3>
            </div>

            <div className="space-y-4">
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-2">
                  Experience Level
                </label>
                <select
                  value={config.experienceLevel}
                  onChange={(e) =>
                    setConfig({ ...config, experienceLevel: e.target.value })
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
                  Role
                </label>
                <select
                  value={config.role}
                  onChange={(e) =>
                    setConfig({ ...config, role: e.target.value })
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

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-2">
                  Company Style
                </label>
                <select
                  value={config.company}
                  onChange={(e) =>
                    setConfig({ ...config, company: e.target.value })
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

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-2">
                  Problem Difficulty
                </label>
                <select
                  value={config.difficulty}
                  onChange={(e) =>
                    setConfig({ ...config, difficulty: e.target.value })
                  }
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleStartWithConfig}
                className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors font-medium"
              >
                Start Interview
              </button>

              <button
                onClick={() => setShowConfiguration(false)}
                className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold text-dark-800">{title}</h3>
      </div>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
}
