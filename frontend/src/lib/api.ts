"use client";

export interface StartInterviewPayload {
  candidate_name: string;
  target_company: string;
  experience_level: string;
  focus_area: string;
}

export interface InterviewPrompt {
  id: string;
  type: string;
  title: string;
  body: string;
  expected_duration: number;
}

export interface InterviewSession {
  session_id: string;
  started_at: string;
  request: StartInterviewPayload;
  prompts: InterviewPrompt[];
  config?: {
    level?: string;
    role?: string;
    company?: string;
    difficulty?: string;
    [key: string]: any;
  };
}

export interface TranscriptEvent {
  event_type: string;
  payload: Record<string, string>;
}

export interface InterviewFeedback {
  overall_score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommended_next_steps: string[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function startInterview(
  payload: StartInterviewPayload
): Promise<InterviewSession> {
  return http<InterviewSession>(`${API_BASE_URL}/api/sessions`, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });
}

export async function endInterview(
  sessionId: string,
  transcript: TranscriptEvent[]
): Promise<InterviewFeedback> {
  return http<InterviewFeedback>(
    `${API_BASE_URL}/api/sessions/${sessionId}/end`,
    {
      method: "POST",
      body: JSON.stringify({ transcript }),
      credentials: "include",
    }
  );
}

export async function getInterviewSession(
  sessionId: string
): Promise<InterviewSession> {
  return http<InterviewSession>(`${API_BASE_URL}/api/sessions/${sessionId}`, {
    credentials: "include",
  });
}

export async function getActiveInterviews(): Promise<InterviewSession[]> {
  return http<InterviewSession[]>(`${API_BASE_URL}/api/sessions/active`, {
    credentials: "include",
  });
}

export async function getAllSessions(
  status?: string,
  limit: number = 50,
  offset: number = 0
): Promise<InterviewSession[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  return http<InterviewSession[]>(
    `${API_BASE_URL}/api/sessions/all?${params}`,
    {
      credentials: "include",
    }
  );
}

export async function getSessionHistory(
  limit: number = 20,
  offset: number = 0
): Promise<InterviewSession[]> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  return http<InterviewSession[]>(
    `${API_BASE_URL}/api/sessions/history?${params}`,
    {
      credentials: "include",
    }
  );
}

export async function saveInterviewProgress(
  sessionId: string,
  data: {
    code?: string;
    transcript?: TranscriptEvent[];
    timeElapsed?: number;
  }
): Promise<void> {
  return http<void>(`${API_BASE_URL}/api/sessions/${sessionId}/save`, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export interface CreateSessionRequest {
  level?: string;
  role?: string;
  company?: string;
  difficulty?: string;
}

export async function createInterviewSession(
  config?: CreateSessionRequest
): Promise<InterviewSession> {
  return http<InterviewSession>(`${API_BASE_URL}/api/sessions/create`, {
    method: "POST",
    body: config ? JSON.stringify(config) : undefined,
    credentials: "include",
  });
}

export interface CodeExecutionRequest {
  code: string;
  language?: string;
  test_cases?: string[];
}

export interface CodeExecutionResponse {
  output: string;
  error?: string;
  success: boolean;
  execution_time_ms?: number;
}

export async function executeCode(
  request: CodeExecutionRequest
): Promise<CodeExecutionResponse> {
  return http<CodeExecutionResponse>(`${API_BASE_URL}/api/code/execute`, {
    method: "POST",
    body: JSON.stringify({
      ...request,
      language: request.language || "python",
    }),
    credentials: "include",
  });
}

export async function deleteSession(
  sessionId: string
): Promise<{ status: string; session_id: string }> {
  return http<{ status: string; session_id: string }>(
    `${API_BASE_URL}/api/sessions/${sessionId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
}

export async function discardSession(
  sessionId: string
): Promise<{ status: string; message: string; session_id: string }> {
  return http<{ status: string; message: string; session_id: string }>(
    `${API_BASE_URL}/api/sessions/${sessionId}/discard`,
    {
      method: "POST",
      credentials: "include",
    }
  );
}
