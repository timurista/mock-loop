"""A placeholder AI interview engine.

The real product would stream events to an LLM and scoring pipeline. For now,
this module fabricates prompts and feedback using deterministic heuristics so
the frontend can integrate before AI access is wired up.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class InterviewPrompt(BaseModel):
    """A single interviewer instruction."""

    id: str
    type: str = Field(..., description="coding|behavioral|followup")
    title: str
    body: str
    expected_duration: int = Field(5, description="Minutes suggested for prompt")


class InterviewFeedback(BaseModel):
    """Structured grading payload shared with the UI."""

    overall_score: float
    summary: str
    strengths: List[str]
    improvements: List[str]
    recommended_next_steps: List[str]


@dataclass
class MockInterviewEngine:
    """Utility for faking AI-powered behavior."""

    default_strengths: tuple[str, ...] = (
        "Clear explanation of brute-force baseline",
        "Consistent communication with interviewer role-play",
    )
    default_improvements: tuple[str, ...] = (
        "Add more explicit complexity analysis before coding",
        "Narrate edge-case testing strategy aloud",
    )

    def generate_prompts(self, request) -> List[InterviewPrompt]:
        """Return canned prompts tailored by company/experience level."""
        company = request.target_company
        experience = request.experience_level.capitalize()
        return [
            InterviewPrompt(
                id="coding-array",
                type="coding",
                title=f"{company} {experience} Coding Warmup",
                body="Implement a rate limiter that allows N requests per rolling minute.",
                expected_duration=20,
            ),
            InterviewPrompt(
                id="systems-design",
                type="discussion",
                title="Systems follow-up",
                body="Sketch how you would extend the service to support bursty traffic.",
                expected_duration=15,
            ),
            InterviewPrompt(
                id="behavioral",
                type="behavioral",
                title="Behavioral reflection",
                body="Tell me about a production incident you owned end-to-end.",
                expected_duration=10,
            ),
        ]

    def generate_feedback(self, session, transcript) -> InterviewFeedback:
        """Craft a summary informed by transcript length."""
        touches = len(transcript)
        complexity_callout = next(
            (
                e.payload.get("analysis")
                for e in transcript
                if e.payload.get("analysis")
            ),
            "Complexity discussion captured basic Big-O detail.",
        )

        score = min(5.0, 3.5 + touches * 0.1)
        now = datetime.utcnow().strftime("%b %d %H:%M UTC")

        return InterviewFeedback(
            overall_score=round(score, 2),
            summary=(
                f"Session on {now} emulated {session.request.target_company}."
                f" Candidate strengths centered on clarity and resilience."
            ),
            strengths=list(self.default_strengths)
            + [f"Transcript depth: {touches} notable events."],
            improvements=list(self.default_improvements)
            + [complexity_callout],
            recommended_next_steps=[
                "Redo the warmup question after 48 hours.",
                "Schedule a behavioral-only loop for deeper STAR practice.",
                "Upload resume for tailored follow-ups (coming soon).",
            ],
        )
