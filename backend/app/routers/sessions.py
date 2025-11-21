"""Interview session management endpoints."""

import uuid
import secrets
import string
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel

from ..database import get_db, Interview, InterviewMessage

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


def generate_session_id() -> str:
    """Generate a semantic session ID like 'isession-abc123def'."""
    # Generate 9 random characters (mix of letters and numbers)
    chars = string.ascii_lowercase + string.digits
    random_suffix = ''.join(secrets.choice(chars) for _ in range(9))
    return f"isession-{random_suffix}"


def session_id_to_db_id(session_id: str) -> int:
    """Convert semantic session ID to database integer ID."""
    return abs(hash(session_id)) % (2**31)


def db_id_to_session_id(db_id: int, created_at: datetime) -> str:
    """Generate consistent session ID from database ID and timestamp."""
    # Use the database ID and timestamp to generate a consistent hash
    seed = f"{db_id}-{created_at.isoformat()}"
    chars = string.ascii_lowercase + string.digits
    # Generate deterministic suffix from hash
    hash_val = abs(hash(seed))
    suffix = ''
    for _ in range(9):
        suffix += chars[hash_val % len(chars)]
        hash_val //= len(chars)
    return f"isession-{suffix}"


class CreateSessionResponse(BaseModel):
    session_id: str
    started_at: str
    status: str


class SaveProgressRequest(BaseModel):
    code: Optional[str] = None
    timeElapsed: Optional[int] = None
    transcript: Optional[List[dict]] = None


class InterviewSessionResponse(BaseModel):
    session_id: str
    started_at: str
    status: str
    config: Optional[dict] = None
    request: Optional[dict] = None
    prompts: List[dict] = []


class CreateSessionRequest(BaseModel):
    level: Optional[str] = "Mid-level"
    role: Optional[str] = "Backend Engineer"
    company: Optional[str] = "Generic Tech Company"
    difficulty: Optional[str] = "Medium"


@router.post("/create", response_model=CreateSessionResponse)
async def create_interview_session(
    request: Optional[CreateSessionRequest] = None,
    db: AsyncSession = Depends(get_db)
):
    """Create a new interview session with semantic ID and configuration."""
    session_id = generate_session_id()

    # Use provided config or defaults
    config = {}
    if request:
        config = {
            "level": request.level,
            "role": request.role,
            "company": request.company,
            "difficulty": request.difficulty,
            "problem_type": "dynamic",  # Will be generated based on config
        }
    else:
        config = {
            "level": "Mid-level",
            "role": "Backend Engineer",
            "company": "Generic Tech Company",
            "difficulty": "Medium",
            "problem_type": "two_sum",
        }

    # Create interview record
    interview = Interview(
        session_id=session_id,  # Store the semantic session ID directly
        user_id=1,  # TODO: Get from auth context
        title=f"Mock Interview Session",
        description=f"{config['difficulty']} {config['role']} interview for {config['company']}",
        status="in_progress",
        config=config,
        started_at=datetime.utcnow(),
    )

    db.add(interview)
    await db.commit()
    await db.refresh(interview)

    return CreateSessionResponse(
        session_id=session_id,
        started_at=interview.started_at.isoformat(),
        status=interview.status,
    )


@router.get("/active", response_model=List[InterviewSessionResponse])
async def get_active_interviews(db: AsyncSession = Depends(get_db)):
    """Get all active interview sessions for the user."""
    # TODO: Filter by authenticated user
    result = await db.execute(
        select(Interview).where(Interview.status == "in_progress")
    )
    interviews = result.scalars().all()

    sessions = []
    for interview in interviews:
        # Use the stored session_id or generate one for legacy records
        session_id = interview.session_id or db_id_to_session_id(interview.id, interview.started_at)

        sessions.append(InterviewSessionResponse(
            session_id=session_id,
            started_at=interview.started_at.isoformat(),
            status=interview.status,
            config=interview.config,
            request={"target_company": "Generic", "experience_level": "Mid-level"},
            prompts=[],
        ))

    return sessions


@router.get("/all", response_model=List[InterviewSessionResponse])
async def get_all_sessions(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Get all interview sessions for the user with optional filtering and pagination."""
    query = select(Interview)

    # Filter by status if provided
    if status:
        query = query.where(Interview.status == status)

    # TODO: Filter by authenticated user
    # query = query.where(Interview.user_id == current_user.id)

    # Add pagination and ordering
    query = query.order_by(Interview.started_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    interviews = result.scalars().all()

    sessions = []
    for interview in interviews:
        # Use the stored session_id or generate one for legacy records
        session_id = interview.session_id or db_id_to_session_id(interview.id, interview.started_at)

        sessions.append(InterviewSessionResponse(
            session_id=session_id,
            started_at=interview.started_at.isoformat(),
            status=interview.status,
            config=interview.config,
            request={"target_company": interview.config.get("company", "Generic"),
                    "experience_level": interview.config.get("level", "Mid-level")},
            prompts=[],
        ))

    return sessions


@router.get("/history", response_model=List[InterviewSessionResponse])
async def get_session_history(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Get user's interview session history (completed and archived sessions)."""
    result = await db.execute(
        select(Interview)
        .where(Interview.status.in_(["completed", "archived"]))
        .order_by(Interview.started_at.desc())
        .offset(offset)
        .limit(limit)
    )
    interviews = result.scalars().all()

    sessions = []
    for interview in interviews:
        # Use the stored session_id or generate one for legacy records
        session_id = interview.session_id or db_id_to_session_id(interview.id, interview.started_at)

        sessions.append(InterviewSessionResponse(
            session_id=session_id,
            started_at=interview.started_at.isoformat(),
            status=interview.status,
            config=interview.config,
            request={"target_company": interview.config.get("company", "Generic"),
                    "experience_level": interview.config.get("level", "Mid-level")},
            prompts=[],
        ))

    return sessions


@router.get("/{session_id}", response_model=InterviewSessionResponse)
async def get_interview_session(session_id: str, db: AsyncSession = Depends(get_db)):
    """Get interview session by semantic ID."""
    # First try to find by session_id, then fall back to legacy ID lookup
    result = await db.execute(
        select(Interview).where(Interview.session_id == session_id)
    )
    interview = result.scalar_one_or_none()

    # Fall back to legacy ID-based lookup for backward compatibility
    if not interview:
        interview_id = session_id_to_db_id(session_id)
        result = await db.execute(
            select(Interview).where(Interview.id == interview_id)
        )
        interview = result.scalar_one_or_none()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")

    # Mock prompts for now
    prompts = [
        {
            "id": "1",
            "type": "coding",
            "title": "Two Sum",
            "body": "Given an array of integers nums and an integer target...",
            "expected_duration": 30,
        },
        {
            "id": "2",
            "type": "behavioral",
            "title": "Code Optimization Experience",
            "body": "Tell me about a time when you had to optimize slow-performing code...",
            "expected_duration": 10,
        },
    ]

    return InterviewSessionResponse(
        session_id=session_id,
        started_at=interview.started_at.isoformat(),
        status=interview.status,
        config=interview.config,
        request={"target_company": "Generic", "experience_level": "Mid-level"},
        prompts=prompts,
    )


@router.post("/{session_id}/save")
async def save_interview_progress(
    session_id: str,
    progress: SaveProgressRequest,
    db: AsyncSession = Depends(get_db)
):
    """Save interview progress."""
    # First try to find by session_id, then fall back to legacy ID lookup
    result = await db.execute(
        select(Interview.id).where(Interview.session_id == session_id)
    )
    interview_id = result.scalar()

    # Fall back to legacy ID-based lookup for backward compatibility
    if not interview_id:
        interview_id = session_id_to_db_id(session_id)

    # Update interview config with progress
    config_update = {}
    if progress.code is not None:
        config_update["current_code"] = progress.code
    if progress.timeElapsed is not None:
        config_update["time_elapsed"] = progress.timeElapsed

    if config_update:
        # Get current config and merge manually since PostgreSQL JSON merge has issues
        result = await db.execute(
            select(Interview.config).where(Interview.id == interview_id)
        )
        current_config = result.scalar() or {}

        # Merge the configs
        merged_config = {**current_config, **config_update}

        await db.execute(
            update(Interview)
            .where(Interview.id == interview_id)
            .values(config=merged_config)
        )
        await db.commit()

    return {"status": "saved"}


@router.delete("/{session_id}")
async def delete_interview_session(session_id: str, db: AsyncSession = Depends(get_db)):
    """Delete an interview session permanently."""
    # First try to find by session_id, then fall back to legacy ID lookup
    result = await db.execute(
        select(Interview).where(Interview.session_id == session_id)
    )
    interview = result.scalar_one_or_none()

    # Fall back to legacy ID-based lookup for backward compatibility
    if not interview:
        try:
            interview_id = session_id_to_db_id(session_id)
            result = await db.execute(
                select(Interview).where(Interview.id == interview_id)
            )
            interview = result.scalar_one_or_none()
        except (ValueError, TypeError):
            # session_id_to_db_id failed, likely not a valid legacy ID format
            pass

    if not interview:
        # Get all available sessions for debugging
        all_sessions_result = await db.execute(select(Interview.session_id))
        available_sessions = [s[0] for s in all_sessions_result.fetchall() if s[0]]
        
        raise HTTPException(
            status_code=404, 
            detail={
                "message": f"Interview session '{session_id}' not found",
                "available_sessions": available_sessions[:5],  # Limit to first 5 for debugging
                "searched_for": session_id
            }
        )

    # Delete the session
    from sqlalchemy import delete
    await db.execute(
        delete(Interview).where(Interview.id == interview.id)
    )
    await db.commit()

    return {"status": "deleted", "session_id": session_id}


@router.post("/{session_id}/end")
async def end_interview_session(session_id: str, db: AsyncSession = Depends(get_db)):
    """End interview session by deleting it and generate feedback."""
    # First try to find by session_id, then fall back to legacy ID lookup
    result = await db.execute(
        select(Interview).where(Interview.session_id == session_id)
    )
    interview = result.scalar_one_or_none()

    # Fall back to legacy ID-based lookup for backward compatibility
    if not interview:
        interview_id = session_id_to_db_id(session_id)
        result = await db.execute(
            select(Interview).where(Interview.id == interview_id)
        )
        interview = result.scalar_one_or_none()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")

    # Generate feedback before deleting
    feedback = {
        "overall_score": 75,
        "summary": "Good problem-solving approach with room for optimization",
        "strengths": [
            "Clear communication of thought process",
            "Correct solution implementation",
            "Good handling of edge cases"
        ],
        "improvements": [
            "Consider time complexity optimization",
            "Add more comprehensive test cases",
            "Discuss space-time tradeoffs"
        ],
        "recommended_next_steps": [
            "Practice more medium-difficulty problems",
            "Focus on optimization techniques",
            "Review common algorithmic patterns"
        ]
    }

    # Delete the session (user is done with it)
    from sqlalchemy import delete
    await db.execute(
        delete(Interview).where(Interview.id == interview.id)
    )
    await db.commit()

    # Return feedback even though session is deleted
    return {
        **feedback,
        "status": "session_deleted",
        "message": "Interview session has been completed and removed"
    }


@router.post("/{session_id}/discard")
async def discard_interview_session(session_id: str, db: AsyncSession = Depends(get_db)):
    """Discard interview session without feedback (immediate delete)."""
    # First try to find by session_id, then fall back to legacy ID lookup
    result = await db.execute(
        select(Interview).where(Interview.session_id == session_id)
    )
    interview = result.scalar_one_or_none()

    # Fall back to legacy ID-based lookup for backward compatibility
    if not interview:
        interview_id = session_id_to_db_id(session_id)
        result = await db.execute(
            select(Interview).where(Interview.id == interview_id)
        )
        interview = result.scalar_one_or_none()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")

    # Delete the session immediately (user is discarding it)
    from sqlalchemy import delete
    await db.execute(
        delete(Interview).where(Interview.id == interview.id)
    )
    await db.commit()

    return {
        "status": "session_discarded",
        "message": "Interview session has been discarded and removed",
        "session_id": session_id
    }