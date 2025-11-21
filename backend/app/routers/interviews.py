"""Interview session endpoints."""

from datetime import datetime
from typing import Dict, List
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ..services.mock_ai import (
    InterviewFeedback,
    InterviewPrompt,
    MockInterviewEngine,
)


router = APIRouter(prefix="/api/interviews", tags=["interviews"])


class InterviewRequest(BaseModel):
    """Payload for starting a new interview session."""

    candidate_name: str = Field(..., description="Name displayed to AI interviewer")
    target_company: str = Field(..., description="Company style to emulate")
    experience_level: str = Field(..., description="Level like Junior/Mid/Senior")
    focus_area: str = Field(
        "backend",
        description="Primary practice track (backend/systems/behavioral)",
    )


class InterviewSession(BaseModel):
    """Represents a lightweight session kept in-memory."""

    session_id: UUID
    started_at: datetime
    request: InterviewRequest
    prompts: List[InterviewPrompt]


class TranscriptEvent(BaseModel):
    """User interactions sent during a mock session."""

    event_type: str = Field(..., description="e.g. code_update, chat, run_code")
    payload: Dict[str, str] = Field(default_factory=dict)


class EndInterviewRequest(BaseModel):
    """Payload for finalizing an interview."""

    transcript: List[TranscriptEvent]


mock_engine = MockInterviewEngine()
sessions: Dict[UUID, InterviewSession] = {}


@router.post("", response_model=InterviewSession)
def start_interview(payload: InterviewRequest) -> InterviewSession:
    """Create a new interview session and return scripted prompts."""
    session = InterviewSession(
        session_id=uuid4(),
        started_at=datetime.utcnow(),
        request=payload,
        prompts=mock_engine.generate_prompts(payload),
    )
    sessions[session.session_id] = session
    return session


@router.post("/{session_id}/end", response_model=InterviewFeedback)
def finalize_interview(session_id: UUID, payload: EndInterviewRequest) -> InterviewFeedback:
    """Generate mock feedback for a finished session."""
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    feedback = mock_engine.generate_feedback(session, payload.transcript)
    return feedback
