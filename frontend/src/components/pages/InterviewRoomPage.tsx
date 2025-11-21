"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getInterviewSession,
  createInterviewSession,
  saveInterviewProgress,
  executeCode,
  endInterview,
  discardSession,
  InterviewSession,
} from "../../lib/api";
import { CodeEditor } from "../CodeEditor";

interface InterviewRoomPageProps {
  sessionId?: string;
}

export function InterviewRoomPage({ sessionId }: InterviewRoomPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessionId || null
  );
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [code, setCode] = useState(`def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.

    You may assume that each input would have exactly one solution,
    and you may not use the same element twice.

    Example:
    Input: nums = [2,7,11,15], target = 9
    Output: [0,1]
    """
    # Your solution here
    pass`);
  const [output, setOutput] = useState("");
  const [feedback, setFeedback] = useState("Ready to start coding...");
  const [voiceFeedback, setVoiceFeedback] = useState("Not listening");
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [interviewConfig, setInterviewConfig] = useState({
    level: searchParams?.get("level") || "Mid-level",
    role: searchParams?.get("role") || "Backend Engineer",
    company: searchParams?.get("company") || "Generic Tech Company",
    difficulty: searchParams?.get("difficulty") || "Medium",
  });

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      try {
        let sessionData: InterviewSession;

        if (currentSessionId) {
          // Load existing session
          sessionData = await getInterviewSession(currentSessionId);

          // Load configuration from session if available
          if (sessionData.config) {
            setInterviewConfig({
              level: sessionData.config.level || interviewConfig.level,
              role: sessionData.config.role || interviewConfig.role,
              company: sessionData.config.company || interviewConfig.company,
              difficulty:
                sessionData.config.difficulty || interviewConfig.difficulty,
            });
          }

          // TODO: Load saved progress (code, timeElapsed, etc.)
        } else {
          // Create new session with current URL params
          const configFromParams = {
            level: searchParams?.get("level") || interviewConfig.level,
            role: searchParams?.get("role") || interviewConfig.role,
            company: searchParams?.get("company") || interviewConfig.company,
            difficulty:
              searchParams?.get("difficulty") || interviewConfig.difficulty,
          };

          sessionData = await createInterviewSession(configFromParams);
          setCurrentSessionId(sessionData.session_id);
          // Redirect to the session URL
          router.replace(`/interview-room/${sessionData.session_id}`);
        }

        setSession(sessionData);
        setFeedback(
          `Session ${sessionData.session_id.slice(
            0,
            8
          )}... loaded. Ready to start coding!`
        );
      } catch (error) {
        console.error("Failed to initialize session:", error);
        setFeedback("Error loading session. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [currentSessionId, router]);

  // Generate initial problem
  useEffect(() => {
    if (!currentProblem) {
      generateProblem();
    }
  }, [interviewConfig]);

  // Auto-save progress
  useEffect(() => {
    if (!currentSessionId || isLoading) return;

    const saveProgress = async () => {
      try {
        await saveInterviewProgress(currentSessionId, {
          code,
          timeElapsed,
        });
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    };

    const interval = setInterval(saveProgress, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [currentSessionId, code, timeElapsed, isLoading]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRunCode = async () => {
    setOutput("Running code...");

    try {
      // Prepare test cases and filter out empty/comment-only ones
      const rawTestCases = currentProblem
        ? [
            // Add some basic test cases based on the problem
            currentProblem.title === "Two Sum"
              ? "two_sum([2, 7, 11, 15], 9)"
              : currentProblem.title === "Valid Palindrome"
              ? 'is_palindrome("A man, a plan, a canal: Panama")'
              : currentProblem.title === "LRU Cache"
              ? "" // Empty string for LRU Cache - will be filtered out
              : "", // Default to empty string instead of comment
          ]
        : [];

      // Filter out empty strings and comment-only test cases
      const validTestCases = rawTestCases.filter((testCase) => {
        const cleaned = testCase.trim();
        return cleaned && !cleaned.startsWith("#");
      });

      const result = await executeCode({
        code: code,
        language: "python",
        test_cases: validTestCases,
      });

      if (result.success) {
        setOutput(result.output || "Code executed successfully");
        setFeedback(
          "Code executed successfully! " +
            (result.output.includes("None")
              ? "Make sure your function returns the expected value."
              : "Good work! Consider edge cases and optimization.")
        );
      } else {
        setOutput(`Error: ${result.error || "Unknown error occurred"}`);
        setFeedback(
          "There was an error in your code. Check the output panel for details."
        );
      }
    } catch (error) {
      console.error("Code execution failed:", error);
      setOutput(
        `Network Error: Failed to execute code. Make sure the backend is running.`
      );
      setFeedback(
        "Unable to connect to code execution service. Please try again."
      );
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setVoiceFeedback("Listening...");
      // Mock voice feedback
      setTimeout(() => {
        setVoiceFeedback(
          "I can hear you explaining your approach. Keep going!"
        );
      }, 2000);
    } else {
      setVoiceFeedback("Stopped listening");
    }
  };

  const handleEndInterview = () => {
    setShowEndModal(true);
  };

  const handleSaveAndEnd = async () => {
    if (currentSessionId) {
      try {
        // Save final progress first
        await saveInterviewProgress(currentSessionId, {
          code,
          timeElapsed,
        });
        // End the session (this will delete it and return feedback)
        const feedback = await endInterview(currentSessionId, []); // Empty transcript for now
        console.log("Interview ended with feedback:", feedback);
      } catch (error) {
        console.error("Failed to save and end interview:", error);
      }
    }
    setShowEndModal(false);
    router.push("/dashboard");
  };

  const handleJustEnd = async () => {
    if (currentSessionId) {
      try {
        // Discard the session without saving or feedback
        await discardSession(currentSessionId);
        console.log("Interview session discarded");
      } catch (error) {
        console.error("Failed to discard interview:", error);
      }
    }
    setShowEndModal(false);
    router.push("/dashboard");
  };

  const generateProblem = () => {
    const problems = {
      Easy: {
        "Backend Engineer": [
          {
            title: "Two Sum",
            description:
              "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
            constraints: [
              "2 ≤ nums.length ≤ 10⁴",
              "-10⁹ ≤ nums[i] ≤ 10⁹",
              "-10⁹ ≤ target ≤ 10⁹",
              "Only one valid answer exists",
            ],
            initialCode: `def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    """
    # Your solution here
    pass`,
            tip: "Think about the time and space complexity. Can you solve this in O(n) time?",
          },
          {
            title: "Valid Palindrome",
            description:
              "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
            example:
              'Input: s = "A man, a plan, a canal: Panama"\nOutput: true',
            constraints: [
              "1 ≤ s.length ≤ 2 * 10⁵",
              "s consists only of printable ASCII characters",
            ],
            initialCode: `def is_palindrome(s):
    """
    Check if a string is a valid palindrome.
    """
    # Your solution here
    pass`,
            tip: "Consider using two pointers approach for optimal space complexity.",
          },
        ],
        "Frontend Engineer": [
          {
            title: "Implement debounce",
            description:
              "Create a debounce function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked.",
            example:
              "const debouncedFn = debounce(() => console.log('Called!'), 1000);",
            constraints: [
              "Function should handle multiple calls",
              "Should cancel previous timeouts",
              "Should preserve 'this' context",
            ],
            initialCode: `function debounce(func, wait) {
  /**
   * Returns a debounced version of the function
   */
  // Your solution here
}`,
            tip: "Use setTimeout and clearTimeout to manage the delay.",
          },
        ],
      },
      Medium: {
        "Backend Engineer": [
          {
            title: "LRU Cache",
            description:
              "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
            example:
              "lRUCache.put(1, 1); lRUCache.put(2, 2); lRUCache.get(1); // returns 1",
            constraints: [
              "0 ≤ capacity ≤ 3000",
              "0 ≤ key ≤ 10⁴",
              "0 ≤ value ≤ 10⁵",
            ],
            initialCode: `class LRUCache:
    def __init__(self, capacity: int):
        """
        Initialize LRU cache with given capacity
        """
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass`,
            tip: "Consider using a hash map combined with a doubly linked list for O(1) operations.",
          },
          {
            title: "Design Rate Limiter",
            description:
              "Design a rate limiter that limits the number of requests a user can make within a time window.",
            example:
              "rate_limiter.is_allowed('user1', limit=5, window=60) // true/false",
            constraints: [
              "Support multiple users",
              "Configurable limits and windows",
              "Thread-safe implementation",
            ],
            initialCode: `def rate_limiter(key: str, limit: int, window_seconds: int = 60):
    """
    Check if request is allowed based on rate limiting rules.
    Returns True if allowed, False otherwise.
    """
    # Your solution here
    pass`,
            tip: "Consider sliding window vs fixed window approaches. Think about memory efficiency.",
          },
        ],
      },
    };

    const difficultyProblems =
      problems[interviewConfig.difficulty as keyof typeof problems];
    const roleProblems =
      difficultyProblems?.[
        interviewConfig.role as keyof typeof difficultyProblems
      ] || difficultyProblems?.["Backend Engineer"];

    if (roleProblems && roleProblems.length > 0) {
      const randomProblem =
        roleProblems[Math.floor(Math.random() * roleProblems.length)];
      setCurrentProblem(randomProblem);
      setCode(randomProblem.initialCode);
      setOutput("");
      setFeedback(
        `New ${interviewConfig.difficulty.toLowerCase()} problem loaded for ${
          interviewConfig.role
        }. Take your time to understand the requirements.`
      );
    }
  };

  const handleSelectNewProblem = () => {
    generateProblem();
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleEndInterview}
            className="text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="w-px h-6 bg-neutral-300"></div>
          <h1 className="text-lg font-semibold text-dark-800">
            MockLoop Interview
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-lg font-mono font-semibold text-dark-800">
              {formatTime(timeElapsed)}
            </span>
          </div>

          {/* Voice Recording */}
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isRecording
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
            }`}
          >
            🎤 {isRecording ? "Recording" : "Start Recording"}
          </button>

          {/* End Interview */}
          <button
            onClick={handleEndInterview}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            End Interview
          </button>
        </div>
      </header>

      {/* Main 3-Panel Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel - Problem Statement */}
        <div
          className={`${
            leftSidebarCollapsed ? "w-12" : "w-1/3"
          } bg-white border-r border-neutral-200 flex flex-col transition-all duration-300`}
        >
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h2
              className={`font-semibold text-dark-800 ${
                leftSidebarCollapsed ? "hidden" : ""
              }`}
            >
              Problem
            </h2>
            <button
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-800"
              title={
                leftSidebarCollapsed
                  ? "Expand problem panel"
                  : "Collapse problem panel"
              }
            >
              {leftSidebarCollapsed ? "▶" : "◀"}
            </button>
          </div>
          <div
            className={`flex-1 p-4 overflow-y-auto ${
              leftSidebarCollapsed ? "hidden" : ""
            }`}
          >
            <div className="space-y-4">
              {currentProblem ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-dark-800">
                        {currentProblem.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          interviewConfig.difficulty === "Easy"
                            ? "bg-success-100 text-success-700"
                            : interviewConfig.difficulty === "Medium"
                            ? "bg-warning-100 text-warning-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {interviewConfig.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">
                      {currentProblem.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-dark-800 mb-2">Example:</h4>
                    <div className="bg-neutral-50 p-3 rounded-lg text-sm font-mono whitespace-pre-line">
                      {currentProblem.example}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-dark-800 mb-2">
                      Constraints:
                    </h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {currentProblem.constraints.map(
                        (constraint: string, index: number) => (
                          <li key={index}>• {constraint}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mt-6 p-3 bg-brand-50 rounded-lg">
                    <p className="text-sm text-brand-800">
                      💡 <strong>Interviewer Tip:</strong> {currentProblem.tip}
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-neutral-100 rounded-lg">
                    <div className="text-xs text-neutral-600 space-y-1">
                      <div>
                        <strong>Role:</strong> {interviewConfig.role}
                      </div>
                      <div>
                        <strong>Company:</strong> {interviewConfig.company}
                      </div>
                      <div>
                        <strong>Level:</strong> {interviewConfig.level}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-neutral-600">Loading problem...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 bg-neutral-900 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-neutral-800 border-b border-neutral-700">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-white">Code Editor</h2>
              <div className="text-xs text-neutral-400">Python</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectNewProblem}
                className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 hover:bg-neutral-700 rounded transition-colors"
              >
                🔄 Select New Problem
              </button>
              <button
                onClick={handleRunCode}
                className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors"
              >
                ▶ Run Code
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {/* Code Editor Area */}
            <div className="flex-1">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="python"
                placeholder="Write your code here..."
              />
            </div>

            {/* Output Area */}
            <div className="h-32 bg-neutral-800 border-t border-neutral-700">
              <div className="p-2 border-b border-neutral-700">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Output
                </span>
              </div>
              <div className="p-3 h-24 overflow-y-auto">
                <pre className="text-sm text-neutral-300 font-mono whitespace-pre-wrap">
                  {output || "Click 'Run Code' to see output..."}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Feedback */}
        <div
          className={`${
            rightSidebarCollapsed ? "w-12" : "w-1/3"
          } bg-white border-l border-neutral-200 flex flex-col transition-all duration-300`}
        >
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h2
              className={`font-semibold text-dark-800 ${
                rightSidebarCollapsed ? "hidden" : ""
              }`}
            >
              Feedback & Notes
            </h2>
            <button
              onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-800"
              title={
                rightSidebarCollapsed
                  ? "Expand feedback panel"
                  : "Collapse feedback panel"
              }
            >
              {rightSidebarCollapsed ? "◀" : "▶"}
            </button>
          </div>

          <div
            className={`flex-1 p-4 overflow-y-auto space-y-4 ${
              rightSidebarCollapsed ? "hidden" : ""
            }`}
          >
            {/* Voice Status */}
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-neutral-700">
                  Voice Status
                </span>
                <div
                  className={`h-2 w-2 rounded-full ${
                    isRecording ? "bg-red-500" : "bg-neutral-400"
                  }`}
                ></div>
              </div>
              <p className="text-sm text-neutral-600">{voiceFeedback}</p>
            </div>

            {/* Real-time Feedback */}
            <div className="p-3 bg-brand-50 rounded-lg">
              <h3 className="text-sm font-medium text-brand-800 mb-2">
                AI Feedback
              </h3>
              <p className="text-sm text-brand-700">{feedback}</p>
            </div>

            {/* Progress Tracking */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-dark-800">
                Interview Progress
              </h3>
              <div className="space-y-2">
                <ProgressItem
                  label="Problem Understanding"
                  status="completed"
                />
                <ProgressItem label="Solution Approach" status="in-progress" />
                <ProgressItem label="Implementation" status="pending" />
                <ProgressItem label="Testing & Edge Cases" status="pending" />
                <ProgressItem
                  label="Optimization Discussion"
                  status="pending"
                />
              </div>
            </div>

            {/* Behavioral Question */}
            <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
              <h3 className="text-sm font-medium text-warning-800 mb-2">
                Behavioral Follow-up
              </h3>
              <p className="text-sm text-warning-700">
                "Tell me about a time when you had to optimize a slow-performing
                piece of code. What was your approach?"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* End Interview Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-dark-800">
                End Interview
              </h3>
            </div>

            <p className="text-neutral-600 mb-6">
              Are you sure you want to end this interview session? Choose how
              you'd like to proceed:
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSaveAndEnd}
                className="w-full px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors font-medium"
              >
                💾 Save Progress & End
              </button>

              <button
                onClick={handleJustEnd}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                🚪 Just End (Don't Save)
              </button>

              <button
                onClick={() => setShowEndModal(false)}
                className="w-full px-4 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressItem({
  label,
  status,
}: {
  label: string;
  status: "completed" | "in-progress" | "pending";
}) {
  const statusConfig = {
    completed: { color: "bg-success-500", text: "text-success-700" },
    "in-progress": { color: "bg-warning-500", text: "text-warning-700" },
    pending: { color: "bg-neutral-300", text: "text-neutral-500" },
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-2 w-2 rounded-full ${statusConfig[status].color}`}
      ></div>
      <span className={`text-sm ${statusConfig[status].text}`}>{label}</span>
    </div>
  );
}
